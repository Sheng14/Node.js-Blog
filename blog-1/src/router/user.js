const { loginCheck } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => { // 为cookie设置过期时间
    const method = req.method


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
    if (method === 'POST' && req.path === '/api/user/login') {
        // const { username, password } = req.query
        const { username, password } = req.body
        const result = loginCheck(username, password) // 调用登录函数
        return result.then((resultData) => {
            if (resultData.username) { // 查询找不到时返回空对象没有东西肯定就是false，自然就登录失败
                req.session.username = resultData.username
                req.session.realname = resultData.realname // 在这里用的话就直接设置session的值（已经是对应userId）
                set(req.sessionId, req.session) // 设置redis中的session
                // res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`) // 如果查询得到就把设置好cookie，只要是3000端口下的cookie都有这个
                // 注意这里设置的是返回的headers，具体可以看浏览器的response header
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    /*if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) { // 现在是通过session来判断了，cookie只剩下一个userId
            // 通过查看cookie里面有没有username这个key判断是否登录成功（注意有个坑，如果username被加上‘’就会默认不存在）
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
            // {"data":{"session":{"username":"qibin","realname":"骑兵"}},"errno":0} session返回的内容
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }*/
}

module.exports = handleUserRouter
// 这里是定义user的路由