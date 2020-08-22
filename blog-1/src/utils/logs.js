const fs = require('fs')
const path = require('path')

// 生成流对象
function createWriteStream (fileName) {
    const fullName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullName, {
        flags: 'a'
    })
    return writeStream
}

// 写日志的方法
function writeLog (writeStream, log) {
    writeStream.write(log + '\n')
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access (log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}