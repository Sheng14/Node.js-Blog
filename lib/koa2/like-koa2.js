const http = require('http')

function compose (middlewareList) { // 组合函数，一方面是执行中间件，一方面是实现next（）
    return (ctx) => {
        function dispatch (i) {
            const fn = middlewareList[i] // 拿到要执行的第i个中间件
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1)) // 执行下一个中间件
                )
            }  catch (err) {
                return Promise.reject(err)
            }
        }
       return dispatch(0) // 立即执行第一个中间件
    }
}

class LikeKoa2 {
    constructor () {
        this.middlewareList = [] // 存放中间件的列表
    }

    use (fn) { // 注册中间件，就是把中间件添加到列表即可
        this.middlewareList.push(fn)
        return true // 照顾链式调用的写法
    }

    createContext (req, res) { // 组合ctx，这个没啥，反正就把req，res合起来就行
        const ctx = {
            req,
            res
        }
        ctx.query = req.query // koa2当然会有更多这种赋值，毕竟要把两个变量合成一个，但是这里是测试，就简单的写一个就行
        return ctx
    }

    handleRequest (ctx, fn) { // 执行中间件
        return fn(ctx)
    }

    callback () {
        const fn = compose(this.middlewareList) // 拿到要执行的中间件
        return (req, res)  =>{
            const ctx = this.createContext(req, res) // 整合ctx
            return this.handleRequest(ctx, fn) //执行中间件
        }
    }

    listen(...args) { // 监听端口
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = LikeKoa2