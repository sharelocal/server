const net = require('net');
const http = require('http');

class TunnelAgent extends http.Agent {
  constructor(port) {
    super();

    this.sockets = [];
    this.queue = [];
    this.port = port;
  }

  async start() {
    this.port = await new Promise((resolve) => {
      const server = net.createServer((socket) => {
        const callback = this.queue.shift();

        socket.on('close', () => {
          this.sockets.splice(this.sockets.indexOf(socket), 1);
        });

        if (callback) {
          callback(null, socket);
        } else {
          this.sockets.push(socket);
        }
      }).listen(this.port, () => {
        resolve(server.address().port);
      });
    });

    return this.port;
  }

  createConnection(options, callback) {
    const socket = this.sockets.shift();

    if (socket) {
      callback(null, socket);
    } else {
      this.queue.push(callback);
    }
  }
}

module.exports = TunnelAgent;
