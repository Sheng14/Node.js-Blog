const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建一个客户端
const redisClient = redis.createClient(REDIS_CONF.portm, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log(err)
})

// 定义设置redis的方法
function set (key, val) {
    if (typeof val === 'object') { // 如果值是对象则转换为json字符串
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

// 定义获取redis的方法
function get (key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => { // 获取redis
            if (err) { // 如果错误存在直接退出
                reject(err)
                return
            }
            if (val == null) { // 如果找不到key对应的值则返回null
                resolve(null)
            }
            try { // 如果不需要转换为原本的对象则直接返回
                resolve(
                    JSON.parse(val)
                )
            }
            catch (ex) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}