var createError = require('http-errors'); // 主要是处理路由错误例如404，可以不关心
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 解析cookie方便各地使用
var logger = require('morgan'); // 处理日志access那一块
const session = require('express-session');
const RedisStore = require('connect-redis')(session) // 立即执行

 // var indexRouter = require('./routes/index');
 // var usersRouter = require('./routes/users'); // 引入路由
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express(); // 注册实例，监听客户端请求

// view engine setup 这里主要是处理前端引擎的，我们可以不管
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');

app.use(logger('dev')); // 注册日志，有一些配置后面讲
app.use(express.json()); // 处理post请求中的数据 注：content-type是application/json的时候 各地可以通过req.body访问到数据
app.use(express.urlencoded({ extended: false })); // 处理post请求中的数据 住：content-type不是上面那种情况的时候（如x-www-啥啥啥）
app.use(cookieParser()); // 注册cookie，各地可以通过req.cookies访问
// app.use(express.static(path.join(__dirname, 'public'))); // 处理静态资源，这里用不到，我们也不用管

/*const redisClient = require('./db/redis') // 引入创建好的客户端
const sessionStore = new RedisStore({
  client: redisClient
}) // 生成新的储存session的空间*/

// 处理session
app.use(session({
  secret: 'ODST123!#', // 自定义密匙
  cookie: {
    path: '/', // 默认配置
    httpOnly: true, // 默认配置
    maxAge: 24*60*60*1000 // 24小时
  },
 // store: sessionStore
}))

// 注册完，接下来就是路由处理
// app.use('/', indexRouter);
// app.use('/users', usersRouter); // 注册路由，且加是父路径！
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler 如果路径不符合上面引入的路由就会404，进而触发这个函数
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 处理程序抛出的问题，如果是线下开发的时候抛出，如果是上线了有bug就返回空对象
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {}; // 需与package.json中定义的环境名称一致

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
