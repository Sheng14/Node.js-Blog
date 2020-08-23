const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('开始请求', req.method, req.url)
    next()
})

// 假设处理cookie
app.use((req, res, next) => {
    req.cookie = {
        userId: 'abc12'
    }
    next()
})

// 假设处理postData
app.use((req, res, next) => {
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 500
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理api路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('处理get路由')
    next()
})

app.post('/api', (req, res, next) => {
    console.log('处理post路由')
    next()
}) // 很意外，除非是路由完全是/api否则即使是父路径包含/api也不会触发（get与post同）但是use则是父路径有包含即可！

// 模拟登录验证（配合下面的get实现多个中间件）
function loginCheck (req, res, next) {
    setTimeout(() => {
        console.log('登录失败')
        res.json({
            errno: -1,
            msg: '登录失败'
        }) // 注意这里不加next（）是因为登录失败，没必要再往下进行，若是模拟成功则加上next（）
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get api-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('处理404')
    res.json({
        errno: -1,
        msg: '404 not found'
    })
})

app.listen(3000, ()=> {
    console.log('ok')
})

/* 
当处理get请求：http://localhost:3000/api/get-cookie（无多函数密码验证时）
开始请求 GET /api/get-cookie
处理api路由
get api-cookie


当处理post请求：http://localhost:3000/api/get-post-data（无多函数密码验证时）
ok
开始请求 POST /api/get-post-data
处理api路由
post /api/get-post-data

当处理get请求： http://localhost:3000/
ok
开始请求 GET /
处理404


当处理get请求： http://localhost:3000/api
ok
开始请求 GET /api
处理api路由
处理get路由
处理404


PS D:\工作室\VsCode\VsProject\Mooc-NodeBlog\express-test> node app.js
ok
开始请求 GET /
开始请求 GET /api
处理api路由
处理get路由
处理404
ok
开始请求 POST /api/get-post-data
处理api路由
登录失败
PS D:\工作室\VsCode\VsProject\Mooc-NodeBlog\express-test> node app.js
ok
开始请求 POST /api/get-post-data
处理api路由
post /api/get-post-data
PS D:\工作室\VsCode\VsProject\Mooc-NodeBlog\express-test> node app.js
ok
开始请求 GET /api/get-cookie
处理api路由
登录失败

*/