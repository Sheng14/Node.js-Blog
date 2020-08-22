const { exec, excape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const loginCheck = (username, password) => {
    username = excape(username)
    password = genPassword(password) // 对密码进行加密（数据库的密码已经加密，这里不加密就对不上，登录失败）
    password = excape(password) // 对传入的参数进行特殊字符的处理，同时下面的也需要去掉‘’
    const sql = `select * from users where username=${username} and password=${password}` // 根据拿到的密码和用户名进行条件查询
    console.log(sql)
    return exec(sql).then((loginData) => {
        return loginData[0] || {} // 如果存在则返回查询结果对象数组的第一项，否则返回空对象
    })
}

module.exports = {
    loginCheck
}
// select * from users where username='bubing\'--' and password='11111'这里就是多加了一个\来转义掉‘