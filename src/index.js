const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const controllers = require('./controllers');

const app = new Koa();
const router = new Router();

router.post('/hello', controllers.hello);
router.all('*', controllers.tunnel);

app.on('error', console.error);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Server error';

    ctx.body = {
      status,
      message,
    };

    if (status >= 500) {
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(bodyParser());
app.use(router.routes());

app.listen(process.env.APP_PORT);
