const http = require('http')

const server = http.createServer((req, res) => {
    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            data: 'welcome to PM2!'
        })
    )
})

server.listen(8000)
console.log('ok')