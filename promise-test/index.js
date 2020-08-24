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
/*getFileByCallback('a.json', (aData) => {
    console.log('c', aData)
    getFileByCallback('b.json', (bData) => {
        console.log(bData)
        getFileByCallback('c.json', (cData) => {
            console.log(cData)
        })
    })
})*/

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

/*getFileByPromise('a.json')
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
})*/

/* 执行结果
c { next: 'b.json', msg: 'this is a' }
p { next: 'b.json', msg: 'this is a' }
{ next: 'c.json', msg: 'this is b' }
{ next: 'c.json', msg: 'this is b' }
{ next: 'null', msg: 'this is c' }
{ next: 'null', msg: 'this is c' }
*/

async function readFileData () {
    try {
        const aData = await getFileByPromise('a.json')
        console.log('aData:', aData)
        const bData = await getFileByPromise(aData.next)
        console.log('bData:', bData)
        const cData = await getFileByPromise(bData.next)
        console.log('cData:', cData)
    } catch (err) {
        console.log(err)
    }
}

readFileData() // 测试async和await

async function readAdata () {
    const aData = await getFileByPromise('a.json')
    return aData
}
async function test () {
    const aData = await readAdata()
    console.log(aData)
}
test() // 测试async返回的是否是promise（是）是否可以跟在await后面（可以）

/* 执行结果
aData: { next: 'b.json', msg: 'this is a' }
{ next: 'b.json', msg: 'this is a' }       
bData: { next: 'c.json', msg: 'this is b' }
cData: { next: 'null', msg: 'this is c' } 
*/

// async await 要点：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数里面
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值