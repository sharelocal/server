const generate = require('nanoid/generate');

class TunnelManager {
  constructor() {
    this.tunnels = {};
  }

  getAvailableName() {
    const name = generate('1234567890abcdefghijklmnopqrstuvwxyz', 4);

    return this.tunnels[name]
      ? this.getAvailableName()
      : name;
  }

  add(name, tunnel) {
    this.tunnels[name] = tunnel;
  }

  remove(name) {
    delete this.tunnels[name];
  }

  get(name) {
    return this.tunnels[name];
  }
}

module.exports = TunnelManager;
