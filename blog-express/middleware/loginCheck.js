const { ErrorModel } = require('../model/resModel')

module.exports = (req, res, next) => { // 校验登录状态：未登录 已经登录
    if (req.session.username) {
        next()
        return
    }
    res.json(
        new ErrorModel('尚未登录')
    )
}