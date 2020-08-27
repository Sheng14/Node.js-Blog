const http = require('http')

const server = http.createServer((req, res) => {
    // 模拟日志
    console.log('no error', Date.now())

    // 模拟错误
    console.error('errnor', Date.now())

    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            data: 'welcome to PM2! we are the god!'
        })
    )
})

server.listen(8000)
console.log('ok')