const http = require('http');

class Tunnel {
  constructor(name, agent) {
    this.name = name;
    this.agent = agent;
  }

  request(ctx) {
    const request = http.request({
      path: ctx.path,
      method: ctx.method,
      headers: ctx.headers,
      agent: this.agent,
    }, (response) => {
      ctx.res.writeHead(response.statusCode, response.headers);
      response.pipe(ctx.res);
    });

    request.on('error', () => {
      res.end(JSON.stringify({
        status: 500,
        error: 'Tunnel error',
      }));
    });

    ctx.req.pipe(request);
  }
}

module.exports = Tunnel;
