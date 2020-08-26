const router = require('koa-router')()
const { getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog') // 设置父路径

router.get('/list', async function(ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    if (ctx.query.isadmin) {
        if (ctx.session.username == null) {
            ctx.body = new ErrorModel('未登录')
            return
        }
        author = ctx.session.username // 也是多写了个s即sessison我他妈
        console.log(ctx.session.username)
    }
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function(ctx, next){
    const detailData = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(detailData)
})

router.post('/new', loginCheck, async function(ctx, next) {
    ctx.request.body.author = ctx.session.username
    const data = await newBlog(ctx.request.body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function(ctx, next) {
    const updateData = await updateBlog(ctx.query.id, ctx.request.body)
    if (updateData) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, function(ctx, next) {
    const author = ctx.session.username
    const deleteData = await delBlog(ctx.query.id, author)
    if (deleteData) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = router