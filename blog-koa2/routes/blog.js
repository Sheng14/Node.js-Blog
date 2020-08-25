const router = require('koa-router')()

router.prefix('/api/blog') // 设置父路径

router.get('/list', async function(ctx, next) {
    const query = ctx.query
    ctx.body = {
        errno: 0,
        query,
        dara: ['获取博客数据']
    }
})

module.exports = router