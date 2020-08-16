const handleBlogRouter = (req, res) => {
    const method = req.method
    
    if (method === 'GET' && req.path === '/api/blog/list') {
        return {
            message: '这是获取博客列表的接口'
        }
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
        return {
            message: '这是获取博客详情的接口'
        }
    }

    if (method === 'POST' && req.path === '/api/blog/new') {
        return {
            message: '这是新建博客的接口'
        }
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        return {
            message: '这是更新博客的接口'
        }
    }

    if (method === 'POST' && req.path === '/api/blog/del') {
        return {
            message: '这是删除博客的接口'
        }
    }
}

module.exports = handleBlogRouter
//这里是定义博客的路由