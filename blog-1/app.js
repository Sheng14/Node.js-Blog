const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const { resolve } = require('path')
const { rejects } = require('assert')

const getPostData = (req) => { // 异步获取postData即POST请求发送过来的内容（需要接收一个请求req）
  const promise = new Promise((resolve, reject) => { // 不需要reject，因为没有错误只有其它情况
    if (req.method !== 'POST') { // 如果不是POST直接返回空
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') { // 如果不是json格式也直接返回空
      resolve({})
      return
    }
    let postData = '' // 接下来就是获取postData
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) { // 如果不存在postData则也发挥空
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}
const getCookieExpires = () => { // 设置cookie的过期时间（当前时间加一天）
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log(d.toGMTString())
  return d.toGMTString() // 转换成GMT格式
}

const SESSION_DATA = {} // 定义一个全局变量的session

const serverHandle = (req, res) => {
    res.setHeader('Content-type', 'application/json') // 设置返回的格式
    const url = req.url
    req.path = url.split('?')[0]
     // 获取都要用到的url和path各地就无需再获取了（因为你调用外面的函数传入的req res也还是这里获取的，这里加了另外的属性，传入就自然有）
    
     // 获取query，方便各地使用
    req.query = querystring.parse(url.split('?')[1])
    
    // 解析cookie
    req.cookie = {} // 定义一个存放cookie的对象
    const cookieStr = req.headers.cookie || '' // 拿到cookie字符串或者空字符串
    cookieStr.split(';').forEach(item => { // 通过；分割出一组cookie
      if (!item) {
        return
      }
      const arr = item.split('=') // 通过=分割每一组cookie的key和value
      const key = arr[0].trim()
      const value = arr[1].trim()
      req.cookie[key] = value
    })
    console.log(req.cookie) // 到此各地皆可以使用req.cookie来获取已经解析完成的cookie了
    /* 解析结果：
    {
      username: '14',
      ' Hm_lvt_70b7d1f99329b1ded9b60564cd0c45f6': '1591789578,1591930187,1592016696,1592034016'
    }*/

    // 解析session
    let needSetCookie = false // 判断是否需要修改cookie（默认是false，只有当cookie中的userId不存在才需要）
    let userId = req.cookie.userId // 获取cookie中的userId
    if (userId) { // 如果cookie存在userId就可以判断全局的session中有没有
      if (!SESSION_DATA[userId]) { // 有就直接赋值给req的session了，如果没有就开辟这个属性，且值为空对象（等到登录路由那里填充）
        SESSION_DATA[userId] = {}
      }
    } else { //如果cookie不存在这个userId，我们就创造一个userId，同时开辟session中对应userId的空间
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]
     // 说到底就是为了根据cookie中userId对应的值在存放session数据里开一个对应id的空间方便各地存储session信息

    getPostData(req).then((postData) => { // 使用获取postData的方法
      req.body = postData // 将拿到的postData塞到req里面（body本身没有东西）方便各地使用
     /* const blogData = handleBlogRouter(req, res)
      if (blogData) {
        res.end(
          JSON.stringify(blogData)
        )
        return // 记得return，不然会一直发送，因为一直满足条件嘛
      } 这些都是因为返回的是数据而如此处理，现在返回的是promise，故改一下*/
      const blogResult = handleBlogRouter(req, res) // 调用函数拿到获得数据的promise 管理博客路由
      if (blogResult) {
        blogResult.then((blogData) => { // 拿出其中的数据发给客户端
          if (needSetCookie) { // 如果需要设置cookie就在路由返回前把cookie给设置了。
            res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          res.end(
            JSON.stringify(blogData)
          )
        })
        return
      }
  
      const userResult = handleUserRouter(req, res) // 管理用户路由
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          res.end(
            JSON.stringify(userData)
          )
        })
        return
      }
      // 处理没有命中以上两种路由的情况，不处理的话就会一直加载中
      res.writeHead(404, {"Content-type": "text/plain"})
      res.write("404 not found")
      res.end()
    })

}

module.exports = serverHandle
// env: process.env.NODE_ENV