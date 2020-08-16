const handleUserRouter = (req, res) => {
    const method = req.method

    if (method === 'POST' && req.path === '/api/user/login') {
        return {
            message: '这是登录的接口'
        }
    }
}

module.exports = handleUserRouter
// 这里是定义user的路由