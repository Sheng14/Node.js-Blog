const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./conf/db')
const fs = require('fs')
const path = require('path')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV // 获取当前的环境
if (ENV !== 'production') { // 即生产环境下
  app.use(morgan('dev',{
    stream: process.stdout // 直接在控制台输出
  }))
} else { // 线上环境
  const fileName = path.join(__dirname, '/logs', 'access.log')
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'
  }) // 获取文件名和流对象
  app.use(morgan('combined', {
    stream: writeStream // 写入到文件
  }))
}

// session配置
app.keys = ['ODST123!#'] // 设置密匙
app.use(session({ // session配置
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24*60*60*1000
  },
  store: redisStore({ // redis配置
   // all: '127.0.0.0:6379' // 指向本地的redis地址（暂时写死）
   all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
