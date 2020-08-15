/* 处理get请求
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method // 获取访问的方法，一般浏览器直接访问就是GET
    console.log(method)
    const url = req.url // 访问的路径
    console.log(url)
    req.query = querystring.parse(url.split('?')[1]) // 截取访问路径？后面带的参数同时转换成对象
    console.log(req.query)
    res.end(
      JSON.stringify(req.query) // 返回这些参数且json字符串化
    )
})

server.listen(3000)
console.log('ok')
*/

/* 直接访问http://localhost:3000/时
ok
GET
/
[Object: null prototype] {}
GET
/favicon.ico
[Object: null prototype] 
*/

/*访问http://localhost:3000/api/book/list
GET
/api/book/list
[Object: null prototype] {}
GET
/favicon.ico
[Object: null prototype] {}
*/

/*访问http://localhost:3000/api/book/list?author=diguo&number=4
GET
/api/book/list?author=diguo&number=4
[Object: null prototype] { author: 'diguo', number: '4' }
GET
/favicon.ico
[Object: null prototype] {}
*/

/* 处理POST请求
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.method === 'POST') { // 监听是否是POST请求是再处理
    console.log('content-type: ', req.headers['content-type']) // 定义发送post请求的客户端的请求头
    let postData = '' // 定义一个接受数据的字符串string
    req.on('data', chunk => { // 监听传入的数据
        postData += chunk.toString()
    })
    req.on('end', () => { // 监听数据传入结束时
        console.log(postData)
        res.end('hello world') // 向客户端发送信息
    })
  }
})

server.listen(3000)
console.log('ok')
*/

/*
content-type:  application/json
{
    "name":"皇帝",
    "number":"007"
}
*/

const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]
  const query = querystring.parse(url.split('?')[1])

  res.setHeader('content-type', 'application/json')
  
  const resData = {
    method,
    url,
    path,
    query
  } // 定义一个对象保存上面获得的各种数据
  if (method === 'GET') { // 如果是GET请求就直接把数据返回
    res.end(
      JSON.stringify(resData)
    ) // {"method":"GET","url":"/api/book/list?author=diguo&number=4","path":"/api/book/list","query":{"author":"diguo","number":"4"}}
  } 
  if (method === 'POST') { // 如果是POST请求则需要定义多一根postData来接收传来的数据并且整合到resData中一起返回。
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resData.postData = postData
      res.end(
        JSON.stringify(resData)
      )
    })
  }
})

server.listen(3000)
console.log('ok')