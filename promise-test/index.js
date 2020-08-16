const fs = require('fs')
const path = require('path')
const { resolve } = require('path')
const { rejects } = require('assert')

function getFileByCallback (fileName, callback) {
    const fullFileName = path.resolve(__dirname, 'files', fileName) // 拿到需要文件的真正绝对路径：当前文件目录 父文件名 需要文件的名
    fs.readFile(fullFileName, (err, data) => { // 读取文件
        if (err) {
            console.error(err)
        }
        callback(
            JSON.parse(data.toString())
        )
    })
}
getFileByCallback('a.json', (aData) => {
    console.log('c', aData)
    getFileByCallback('b.json', (bData) => {
        console.log(bData)
        getFileByCallback('c.json', (cData) => {
            console.log(cData)
        })
    })
})

function getFileByPromise (fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(
                JSON.parse(data.toString())
            )
        })
    })
    return promise
}

getFileByPromise('a.json')
.then((aData) => {
    console.log('p', aData)
    return getFileByPromise('b.json')
})
.then((bData) => {
    console.log(bData)
    return getFileByPromise('c.json')
})
.then((cData) => {
    console.log(cData)
})

/* 执行结果
c { next: 'b.json', msg: 'this is a' }
p { next: 'b.json', msg: 'this is a' }
{ next: 'c.json', msg: 'this is b' }
{ next: 'c.json', msg: 'this is b' }
{ next: 'null', msg: 'this is c' }
{ next: 'null', msg: 'this is c' }
*/