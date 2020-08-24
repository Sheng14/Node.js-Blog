const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建一个客户端
const redisClient = redis.createClient(REDIS_CONF.portm, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log(err)
})

module.exports = {
    redisClient
}
