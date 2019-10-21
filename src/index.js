const http = require('http');
const { parseQuery } = require('./helpers');
const controllers = require('./controllers');

http.createServer((req, res) => {
  req.query = parseQuery(req);

  if (req.query.create) {
    controllers.hello(req, res);
  } else {
    controllers.tunnel(req, res);
  }
}).listen(process.env.APP_PORT);
