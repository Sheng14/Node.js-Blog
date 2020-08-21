const { stdout } = require("process");
// 标准输入输出（Linux） 从输入stdin流入输出stdout，显示在控制台上。
process.stdin.pipe(process.stdout)

// 直接返回request数据
const http = require('http')
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        req.pipe(res) // 从我们发送的request流到传回来的response，显示在返回结果那里
    }
})
server.listen(8000)

// 复制文件
const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')

const readStream = fs.createReadStream(fileName1)
const writeStream = fs.createWriteStream(fileName2) // 拿到对应的文件且创建读写对象

readStream.pipe(writeStream) // 将读到的文件流入写入的文件（也就是拷贝了）

readStream.on('data', chunk => { // 监听每次流入的数据（因为是一点点流的，当然这个一点点可能就是亿点点，只是相对整个搬过去来说）
    console.log(chunk.toString())
})
readStream.on('end', () => { // 监听拷贝完成
    console.log('copy done')
})

// http请求文件
const fs = require('fs')
const path = require('path')
const http = require('http')
const fileName1 = path.resolve(__dirname, 'data.txt')
const readStream = fs.createReadStream(fileName1)

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        readStream.pipe(res) // 直接将读取到的文件一点点传到返回值那里
    }
})
server.listen(8000)
