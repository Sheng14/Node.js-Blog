const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  console.log('第一层洋葱 - 开始')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('第一层洋葱 - 结束')
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('第二层洋葱 - 开始')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('第二层洋葱 - 结束')
});

// response
app.use(async ctx => {
  console.log('第三层洋葱 - 开始')
  ctx.body = 'Hello World';
  console.log('第三层洋葱 - 结束')
});

app.listen(3000);

/* 执行代码顺序
//其实从这里开就进入到第一层的next（）
6：  console.log('第一层洋葱 - 开始')     7：  await next();
// 第一层的next（）包含整第二个中间件，需要第二个执行完就继续，而这里又开了个第二层的next
15：  console.log('第二层洋葱 - 开始')    16：  const start = Date.now();   17：   await next();
// 这里开始第三层且第三层代表则包含第三个中间件的第二次next结束
25：   console.log('第三层洋葱 - 开始')   26：    ctx.body = 'Hello World';    27：  console.log('第三层洋葱 - 结束')
// 执行第二层next（）后面剩下的代码代表着第一层next的结束
18：   const ms = Date.now() - start;   19：  ctx.set('X-Response-Time', `${ms}ms`);    20：    console.log('第二层洋葱 - 结束')
// 执行第一层next后面剩下的代码，完成调用
8：     const rt = ctx.response.get('X-Response-Time');   9：    console.log(`${ctx.method} ${ctx.url} - ${rt}`);   10：  console.log('第一层洋葱 - 结束')


打印结果：
第一层洋葱 - 开始
第二层洋葱 - 开始
第三层洋葱 - 开始
第三层洋葱 - 结束
第二层洋葱 - 结束
GET / - 33ms
第一层洋葱 - 结束
*/