const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF) // 创建连接对象

con.connect() // 连接数据库

function exec (sql) { // 执行数据库操作
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return // 记得return，不然有错误就卡在这里了
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec
}