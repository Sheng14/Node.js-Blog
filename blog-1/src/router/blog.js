const { getList,
        getDetail,
        newBlog,
        updateBlog,
        delBlog
     } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id || ''
    
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || '' // 自然是拿到参数才能传递给函数
       /* const listData = getList(author, keyword) // 拿到函数返回的数组
        return new SuccessModel(listData) // 丢给类做返回数据的处理（就加一个正确错误标识） 这些操作是因为返回的只是数据，而现在返回的是promise*/
        const result = getList(author, keyword) // 调用函数拿到一个promise
        return result.then((listData) => { // 处理promise拿到其中的数据（其实就是resolve里面的result）这里看成listData，返回整个promise
            return new SuccessModel(listData) // 返回成功模型其实就是数据，但是这里只是返回到promise，最终返回给app的还是整个带有数据的promise
        })
    }

    if (method === 'GET' && req.path === '/api/blog/detail') {
      /*  const detailData = getDetail(id)
        return new SuccessModel(detailData)*/
        const detailResult = getDetail(id)
        return detailResult.then((detailData) => {
            return new SuccessModel(detailData)
        })
    }

    if (method === 'POST' && req.path === '/api/blog/new') {
      /*  const data = newBlog(req.body)
        return new SuccessModel(data)*/
        req.body.author = 'nuoduo' // 自定义一个假数据
        const result = newBlog(req.body)
        return result.then((data) => {
            return new SuccessModel(data)
        })
    }

    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)
        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新博客失败')
        }
    }

    if (method === 'POST' && req.path === '/api/blog/del') {
        const result = delBlog(id)
        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel('删除博客失败')
        }
    }
}

module.exports = handleBlogRouter
//这里是定义博客的路由