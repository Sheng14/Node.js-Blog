const mysql = require('mysql') // 引入数据库插件

const con = mysql.createConnection({ // 创建连接（root默认密码为空）
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',  // 默认端口号
    database: 'myBlog' // 连接到myblog数据库（navicat里面的）
})

con.connect() // 连接数据库

const sql = 'select * from blogs' // 定义查询语句
con.query(sql, (err, result) => { // 执行查询语句
    if (err) {
        console.log(err)
        return
    } else {
        console.log(result)
    }
})
con.end() // 关闭连接