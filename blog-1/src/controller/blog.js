const { exec } = require('../db/mysql')

const getList = (author, keyword) => { // 获取博客列表 这个就是假装根据了传入的参数返回对应的数据！（格式至少是正确的）
    let sql = 'select * from blogs where 1=1 ' // 定义查询语句且占位
    if (author) { // 如果有作者则加一个条件（最后记得空格）
        sql += `and author='${author}' `
    }
    if (keyword) { // 如果有关键词则加一个条件（最后记得空格）
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;` // 加多一个排序（最后无需空格）
    return exec(sql) // 传入函数得到一个promise，返回给路由
}

const getDetail = (id) => { // 获取博客详情
    const sql = `select * from blogs where id='${id}';` // 根据id查询对应的博客内容
    return exec(sql).then((rows) =>{
        return rows[0] // 由于返回的是一个数组，虽然里面只有一个对象，但是我们还是返回对象的好，毕竟model接收的是对象
    })
}

const newBlog = (blogData = {}) => { // 新建博客
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author // 从博客对象拿到对于的各种数据
    const createtime = Date.now()

    const sql = `insert into blogs (title, content, createtime, author) 
                 values ('${title}', '${content}', '${createtime}', '${author}')` // 根据数据定义对应的sql语句
    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId // 执行语句得到一对东西，有用的就这个，我们拿到就行
        }
    })
}

const updateBlog = (id, blogData = {}) => { // 更新博客
    return true
}

const delBlog = (id) => { // 删除博客
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}