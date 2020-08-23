var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    res.json({
        errno: 0,
        data: {
            username,
            password
        }
    })
});

router.get('/session-test', function(req, res, next) { // 写一个路由记录访问次数来测试session否有效
    const session = req.session
    if (session.viewNum == null) { // 如果session不存在这个viewnum我们就初始化为0
       session.viewNum = 0
    }
    session.viewNum++ // 以后有这个我们就直接加1
    res.json({
        viewNum: session.viewNum
    })
});

module.exports = router;
// 用户路由
