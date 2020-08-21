const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt') // 拿到要操作的文件

// 读取文件
fs.readFile(fileName, (err,data) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(data.toString()) // 注意拿到的是二进制文件，需要转换成字符串！
})

// 写入文件
const content = '帝国长枪兵\n' // 随便写入点东西，这里还换行了！
const opt = {
    flag: 'a'
} // 定义写入的形式， a代表追加写入
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.log(err)
        return
    }
})

// 判断文件是否存在
fs.exists(fileName, (state) => {
    console.log(state)
})