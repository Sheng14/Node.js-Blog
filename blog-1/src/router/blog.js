const { getList } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || '' // 自然是拿到参数才能传递给函数
        const listData = getList(author, keyword) // 拿到函数返回的数组
        return new SuccessModel(listData) // 丢给类做返回数据的处理（就加一个正确错误标识）
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