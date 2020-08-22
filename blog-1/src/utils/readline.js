const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 创建流对象（读取）
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
const readStream = fs.createReadStream(fileName)

// 创建readline对象
const rl = readline.Interface({
    input: readStream
})

// 定义存放浏览器类型的变量
let chromeNum = 0
let sum = 0

// 监听读到的每一行数据
rl.on('line', lineData => {
    if (!lineData) {
        return
    } // 如果不存在数据则可能报错，直接return
    sum++
    const arr = lineData.split(' -- ') // 将数据拆分，因为之前是--隔开的嘛
    if (arr[2] && arr[2].indexOf('Chrome') > 0) { // 如果有第3个数据且该数据包含chrome我们就+1
        chromeNum++
    }
})

// 监听读完的时候
rl.on('close', () => {
    console.log('ok')
    console.log('chrome占比：' + chromeNum/sum)
})
