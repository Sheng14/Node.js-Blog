const { loginCheck } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => { // 为cookie设置过期时间
    const method = req.method

    const getCookieExpires = () => { // 设置cookie的过期时间（当前时间加一天）
        const d = new Date()
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
        console.log(d.toGMTString())
        return d.toGMTString() // 转换成GMT格式
    }

   /* if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = loginCheck(username, password) // 调用登录函数
        return result.then((resultData) => {
            if (resultData.username) { // 查询找不到时返回空对象没有东西肯定就是false，自然就登录失败
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }*/
    if (method === 'GET' && req.path === '/api/user/login') { // 仅仅是作为测试使用
        const { username, password } = req.query
        const result = loginCheck(username, password) // 调用登录函数
        return result.then((resultData) => {
            if (resultData.username) { // 查询找不到时返回空对象没有东西肯定就是false，自然就登录失败
                res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`) // 如果查询得到就把设置好cookie，只要是3000端口下的cookie都有这个
                // 注意这里设置的是返回的headers，具体可以看浏览器的response header
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) { // 通过查看cookie里面有没有username这个key判断是否登录成功（注意有个坑，如果username被加上‘’就会默认不存在）
            return Promise.resolve(new SuccessModel('登录成功'))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports = handleUserRouter
// 这里是定义user的路由