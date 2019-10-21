const http = require('http');
const qs = require('querystring');
const controllers = require('./controllers');

http.createServer((req, res) => {
  req.query = qs.parse(req.url.split('?')[1]);

  if (req.query.create) {
    controllers.hello(req, res);
  } else {
    controllers.tunnel(req, res);
  }
}).listen(process.env.APP_PORT);
