const net = require('net');
const http = require('http');

class TunnelAgent extends http.Agent {
  constructor() {
    super();

    this.sockets = [];
    this.queue = [];
  }

  start() {
    return new Promise((resolve) => {
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
      }).listen(() => {
        resolve(server.address().port);
      });
    });
  }

  createConnection(options, callback) {
    const socket = this.sockets.shift();

    if (!socket) {
      this.queue.push(callback);
    } else {
      callback(null, socket);
    }
  }
}

module.exports = TunnelAgent;
