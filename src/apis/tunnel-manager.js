const generate = require('nanoid/generate');

class TunnelManager {
  constructor() {
    this.tunnels = {};
  }

  create() {
    const name = generate('1234567890abcdefghijklmnopqrstuvwxyz', 4);

    return this.tunnels[name]
      ? this.create()
      : name;
  }

  add(name, tunnel) {
    this.tunnels[name] = tunnel;
  }

  get(name) {
    return this.tunnels[name];
  }
}

module.exports = TunnelManager;
