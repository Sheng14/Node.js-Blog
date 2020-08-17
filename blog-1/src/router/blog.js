const { getList,
        getDetail,
        newBlog,
        updateBlog
     } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id || ''
    
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || '' // 自然是拿到参数才能传递给函数
        const listData = getList(author, keyword) // 拿到函数返回的数组
        return new SuccessModel(listData) // 丢给类做返回数据的处理（就加一个正确错误标识）
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
        const detailData = getDetail(id)
        return new SuccessModel(detailData)
    }

    if (method === 'POST' && req.path === '/api/blog/new') {
        const data = newBlog(req.body)
        return new SuccessModel(data)
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)
        if (result) {
            return new SuccessModel(result)
        } else {
            return new ErrorModel('更新博客失败')
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