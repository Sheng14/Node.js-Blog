const { exec } = require('../db/mysql')

const getList = (author, keyword) => { // 这个就是假装根据了传入的参数返回对应的数据！（格式至少是正确的）
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

const getDetail = (id) => {
    return [
        {
            id: 2,
            title: "标题B",
            content: "内容B",
            createTime: 1597571055908,
            author: "qibing"
        }        
    ]
}

const newBlog = (blogData = {}) => {
    return {
        id: 3
    }
}

const updateBlog = (id, blogData = {}) => {
    return true
}

const delBlog = (id) => {
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}