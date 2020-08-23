var express = require('express');
var router = express.Router();
const { getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.get('/list', function(req, res, next) {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    /* if (req.query.isadmin) {
        const LoginCheckResult = LoginCheck(req)
        if (LoginCheckResult) {
            return LoginCheckResult
        }
        author = req.session.username // 也是多写了个s即sessison我他妈
        console.log(req.session.username)
    }*/
    const result = getList(author, keyword)
    return result.then((listData) => {
        res.json(
            new SuccessModel(listData) // 已经帮忙封装了，不需要再return，直接给它让它自己去封装
        )
    })
});

router.get('/detail', function(req, res, next) {
    res.json({
        errno: 0,
        data: [4, 5, 6]
    })
})

module.exports = router;
// 博客路由
