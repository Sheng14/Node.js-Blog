const redis = require('redis') // 引入redis

const redisClient = redis.createClient(6379, '127.0.0.1') // 创建客户端

redisClient.on('error', err => { // 监听错误
    console.log(err)
})

redisClient.set('myname', 'xiangbei', redis.print) // 设置键值且打印成功提示

redisClient.get('myname', (err, val) => { // 获取键值且获取完成关闭客户端
    if (err) {
        console.log(err)
        return
    }
    console.log('val:', val)
    redisClient.quit()
})