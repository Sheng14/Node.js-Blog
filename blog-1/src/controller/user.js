const { exec } = require('../db/mysql')
const loginCheck = (username, password) => {
    const sql = `select * from users where username='${username}' and password='${password}'` // 根据拿到的密码和用户名进行条件查询
    return exec(sql).then((loginData) => {
        return loginData[0] || {} // 如果存在则返回查询结果对象数组的第一项，否则返回空对象
    })
}

module.exports = {
    loginCheck
}