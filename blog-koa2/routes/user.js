const router = require('koa-router')()

router.prefix('/api/user') // 设置父路径

router.post('/login', async function(ctx, next) {
    const { username, password } = ctx.request.body
    ctx.body = {
        errno: 0,
        username,
        password
    }
})

router.get('/session-test', async function(ctx, next) { // 测试session是否保存到redis
    if (ctx.session.viewcount == null) {
        ctx.session.viewcount = 0
    }
    ctx.session.viewcount++
    ctx.body = {
        errno: 0,
        viewcount: ctx.session.viewcount
    }
})
/*
127.0.0.1:6379> get koa:sess:0kWnRB74ZfQrFyjJvR9xbUn9r4KTqUkY
"{\"cookie\":{\"path\":\"/\",\"httpOnly\":true,\"maxAge\":86400000,\"overwrite\":true,\"signed\":true},\"viewcount\":6}"
*/

module.exports = router
