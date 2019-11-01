const http = require('http');

class Tunnel {
  constructor(name, agent) {
    this.name = name;
    this.agent = agent;
  }

  request(req, res) {
    const request = http.request({
      path: req.url,
      method: req.method,
      headers: req.headers,
      agent: this.agent,
    }, (response) => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    });

    request.on('error', () => {
      res.end(JSON.stringify({
        status: 500,
        error: 'Tunnel error',
      }));
    });

    req.pipe(request);
  }
}

module.exports = Tunnel;
