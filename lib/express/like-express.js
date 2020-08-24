const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor () {
        // 这个就是存放中间件的列表即app.xxx这些东西
        this.routes = {
            all: [], // app.use(...)
            get: [], // app.get(...)
            post: [] // app.post(...)
        }
    }

    register (path) { // 共同方法，主要是分开路由和其他参数
        let info = {}
        if (typeof path === 'string') { // 有传路由的情况
            info.path = path
            info.stack = slice.call(arguments, 1) // 要从第二个开始截取
        } else {
            info.path = '/' // 不传路由的情况
            info.stack = slice.call(arguments, 0) // 直接全部截取
        }
        return info
    }

    use () {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get () {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)       
    }

    post () {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match (method, url) { // 匹配适宜中间件
        let stack = [] // 存放符合的中间件
        if (url = '/favicon.ico') { // 如果是浏览器那个icon加载的可以不管直接丢
            return stack
        }
        let currentRoutes = []
        currentRoutes = currentRoutes.concat(this.routes.all)
        currentRoutes = currentRoutes.concat(this.routes[method]) // 拿到符合请求方式的中间件
        currentRoutes.forEach((routeInfo) => {
            if (url.indexOf(routeInfo.path) === 0) { // 0是true即有包含对应路径，-1是false不包含对应路径，
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'                
                stack = stack.concat(routeInfo.stack) // 拿到符合路径的中间件
            }
        })
        return stack
    }

    handle (req, res, stack) { // 做next中间件处理同时触发中间件
        const next = () => {
            const middleware = stack.shift() // 拿到第一个中间件
            if (middleware) { // 如果存在则执行中间件，同时会调用next
                middleware(req, res, next)
            }
        }
        next() // 立即执行！
    }

    callback () { // 由于监听时拿到的参数含有我们访问的地址，可以根据这个来操作
        return(req, res) => {
            res.json = (data) => { // 定义res.json函数
                res.setHeader('Content-type', 'application/json') // 设置表头
                res.end(
                    JSON.stringify(data) // 格式化数据
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()
            const resultList = this.match(method, url) // 将请求方式和地址拿去配对得到应该触发的中间件列表
            this.handle(req, res, resultList) // 触发中间件同时看看是否需要next
        }
    }

    listen (...args) { // 处理端口的监听
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = () => {
    return new LikeExpress()
}
/* 整理一下大致顺序：
1.引入和定义slice
2.定义基本class，工厂函数抛出class
3.定义存放中间件列表
4.定义use、get、post函数
5.提取三个函数的共同部分拿到路由和其它参数（分开）
6.监听listen的实现
7.回调函数
8.匹配中间件
9.处理next
*/