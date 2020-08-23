const cryotp = require('crypto')

// 定义一个密匙（随便自己写）
const SECRET_KEY = 'ODST_935!#'

// 定义一个md5函数
function md5 (content) { // 传入要加密的内容
    const md5 = cryotp.createHash('md5') // 建一个md5
    return md5.update(content).digest('hex') // 进行加密
}

// 定义一个加密函数
function genPassword (password) {
    const str = `password=${password}&key=${SECRET_KEY}` // 内容主要是字符串且包含这两项即可
    return md5(str)
}
console.log(genPassword(123)) // ed1ac071717bb997ad90cbc859a6f928

module.exports = {
    genPassword
}