const getList = (author, keyword) => { // 这个就是假装根据了传入的参数返回对应的数据！（格式至少是正确的）
    return [
        {
            id: 1,
            title: "标题A",
            content: "内容A",
            createTime: 1597571009456,
            author: "huangdi"
        },
        {
            id: 2,
            title: "标题B",
            content: "内容B",
            createTime: 1597571055908,
            author: "qibing"
        }
    ]
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

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog
}