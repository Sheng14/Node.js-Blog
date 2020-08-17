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

const serverHandle = (req, res) => {
    res.setHeader('Content-type', 'application/json') // 设置返回的格式
    const url = req.url
    req.path = url.split('?')[0]
     // 获取都要用到的url和path各地就无需再获取了（因为你调用外面的函数传入的req res也还是这里获取的，这里加了另外的属性，传入就自然有）
    
     // 获取query，方便各地使用
    req.query = querystring.parse(url.split('?')[1])
    
    getPostData(req).then((postData) => { // 使用获取postData的方法
      req.body = postData // 将拿到的postData塞到req里面（body本身没有东西）方便各地使用
      const blogData = handleBlogRouter(req, res)
      if (blogData) {
        res.end(
          JSON.stringify(blogData)
        )
        return // 记得return，不然会一直发送，因为一直满足条件嘛
      }
  
      const userData = handleUserRouter(req, res)
      if (userData) {
        res.end(
          JSON.stringify(userData)
        )
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