const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const controllers = require('./controllers');

const app = new Koa();
const router = new Router();

router.post('/api/tunnels', controllers.createTunnel);
router.post('/api/users', controllers.createUser);
router.get('/api/users/:name/domains', controllers.getUserDomains);
router.post('/api/users/:name/domains', controllers.addUserDomain);
router.delete('/api/users/:name/domains/:domain', controllers.deleteUserDomain);
router.all('*', controllers.tunnel);

app.on('error', console.error);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.status || 500;
    const message = err.message && status < 500 ? err.message : 'Server error';

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
