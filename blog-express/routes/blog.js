var express = require('express');
var router = express.Router();
const { getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', function(req, res, next) {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    if (req.query.isadmin) {
        if (req.session.username == null) {
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        author = req.session.username // 也是多写了个s即sessison我他妈
        console.log(req.session.username)
    }
    const result = getList(author, keyword)
    return result.then((listData) => {
        res.json(
            new SuccessModel(listData) // 已经帮忙封装了，不需要再return，直接给它让它自己去封装
        )
    })
});

router.get('/detail', function(req, res, next) {
    const detailResult = getDetail(req.query.id)
    return detailResult.then((detailData) => {
        res.json(
            new SuccessModel(detailData)
        )
    })
})

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then((data) => {
        res.json(
            new SuccessModel(data)
        )
    })
})

router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.query.id, req.body) // 把要删除的id和postData（即更新的内容）传入
    return result.then((updateData) => {
        if (updateData) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('更新博客失败')
            )
        }
    })
})

router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username
    const result = delBlog(req.query.id, author)
    return result.then((deleteData) => {
        if (deleteData) {
            res.json(
                new SuccessModel()
            )
        } else {
           res.json(
                new ErrorModel('删除博客失败')
           )
        }
    })
})

module.exports = router;
// 博客路由
