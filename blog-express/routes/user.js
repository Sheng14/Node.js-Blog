var express = require('express');
var router = express.Router();
const { loginCheck } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    const result = loginCheck(username, password) // 调用登录函数
    return result.then((resultData) => {
        if (resultData.username) { 
            req.session.username = resultData.username
            req.session.realname = resultData.realname
            res.json(
                new SuccessModel()
            )
            return
        } // 其实还是可以省略else，直接像下面这样子写就行，反正不经过if的就走这里。
        res.json( 
            new ErrorModel('登录失败')
        )
    })
});

router.get('/login-test', function(req, res, next) { // 查看否已经登录
    if (req.session.username) {
        res.json({
            errno: 0,
            msg: '已经登录'
        })
        return
    }
    res.json({
        errno: 1,
        msg: '未登录'
    })
})

/*router.get('/session-test', function(req, res, next) { // 写一个路由记录访问次数来测试session否有效
    const session = req.session
    if (session.viewNum == null) { // 如果session不存在这个viewnum我们就初始化为0
       session.viewNum = 0
    }
    session.viewNum++ // 以后有这个我们就直接加1
    res.json({
        viewNum: session.viewNum
    })
});*/

module.exports = router;
// 用户路由
