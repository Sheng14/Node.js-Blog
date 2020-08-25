const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => { // 校验登录状态：未登录 已经登录
    if (ctx.session.username) {
        await next()
        return
    }
    ctx.body = new ErrorModel('尚未登录')
}