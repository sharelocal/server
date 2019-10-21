const http = require('http');

class Tunnel {
  constructor(name, agent) {
    this.name = name;
    this.agent = agent;
  }

  send(req) {
    return new Promise((resolve) => {
      const request = http.request({
        path: req.url,
        method: req.method,
        headers: req.headers,
        agent: this.agent,
      }, resolve);

      request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      req.pipe(request);
    });
  }
}

module.exports = Tunnel;
