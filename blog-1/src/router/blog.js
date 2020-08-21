const { getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 登录验证函数
const LoginCheck = (req) => {
if (!req.session.username) { // 多打了个s导致排查千年
    return Promise.resolve(
        new ErrorModel('尚未登录')
    )
}
}
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id || ''
    console.log(req.session)
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || '' // 自然是拿到参数才能传递给函数
    /* const listData = getList(author, keyword) // 拿到函数返回的数组
        return new SuccessModel(listData) // 丢给类做返回数据的处理（就加一个正确错误标识） 这些操作是因为返回的只是数据，而现在返回的是promise*/
        if (req.query.isadmin) { // 如果列表中有最高参数说明此时处于管理界面，需要对登录与否以及只能查询自己的列表做一个权限限制
            const LoginCheckResult = LoginCheck(req)
            if (LoginCheckResult) {
                return LoginCheckResult
            }
            author = req.session.username // 也是多写了个s即sessison我他妈
            console.log(req.session.username)
        }
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
    const LoginCheckResult = LoginCheck(req)
    if (LoginCheckResult) { // 如果有值说明并没有登录则会return而不会执行下面的内容
        return LoginCheckResult
    }
    // req.body.author = 'nuoduo' // 自定义一个假数据
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then((data) => {
        return new SuccessModel(data)
    })
}

if (method === 'POST' && req.path === '/api/blog/update') {
   /* const result = updateBlog(id, req.body)
    if (result) {
        return new SuccessModel()
    } else {
        return new ErrorModel('更新博客失败')
    }*/
    const LoginCheckResult = LoginCheck(req)
    if (LoginCheckResult) {
        return LoginCheckResult
    }
    const result = updateBlog(id, req.body) // 把要删除的id和postData（即更新的内容）传入
    return result.then((updateData) => {
        if (updateData) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新博客失败')
        }
    })
}

if (method === 'POST' && req.path === '/api/blog/del') {
    /*const result = delBlog(id)
    if (result) {
        return new SuccessModel()
    } else {
        return new ErrorModel('删除博客失败')
    }*/
    const LoginCheckResult = LoginCheck(req)
    if (LoginCheckResult) {
        return LoginCheckResult
    }
    // const author = 'nuoduo' // 假数据
    const author = req.session.username
    const result = delBlog(id, author)
    return result.then((deleteData) => {
        if (deleteData) {
            return new SuccessModel()
        } else {
            return new ErrorModel('删除博客失败')
        }
    })
}
}

module.exports = handleBlogRouter
/*
这里是定义博客的路由 
<a href="/detail.html?id=${item.id}" target="_blank">${item.title}</a> 
<a href="/index.html?author=${item.author}">${item.author}</a>
<a href="/edit.html?id=${item.id}">编辑</a>

<a href="http://localhost:8080/html-test/detail?id=${item.id}" target="_blank">${item.title}</a>
<a href="http://localhost:8080/html-test/index.html?author=${item.author}">${item.author}</a>
*/