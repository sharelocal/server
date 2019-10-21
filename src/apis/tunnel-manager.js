const generate = require('nanoid/generate');
const redis = require('./redis');
const Tunnel = require('./tunnel');
const TunnelAgent = require('./tunnel-agent');
const { safeParse } = require('../helpers');

class TunnelManager {
  constructor() {
    this.tunnels = {};

    this.startup();
  }

  async startup() {
    const keys = await redis.hgetall('tunnels');

    if (!keys) {
      return;
    }

    await Promise.all(
      Object.entries(keys).map(async ([key, data]) => {
        const { name, port } = safeParse(data);

        if (!name || !port) {
          redis.hdel('tunnels', key)
            .catch(() => undefined);

          return;
        }

        const agent = new TunnelAgent(port);
        const tunnel = new Tunnel(name, agent);

        await agent.start();

        this.tunnels[name] = tunnel;
      }),
    );
  }

  create() {
    const name = generate('1234567890abcdefghijklmnopqrstuvwxyz', 4);

    return this.tunnels[name]
      ? this.create()
      : name;
  }

  add(name, tunnel) {
    setImmediate(async () => {
      await redis.hset('tunnels', name, JSON.stringify({
        name,
        port: tunnel.agent.port,
      }));
    });

    this.tunnels[name] = tunnel;
  }

  get(name) {
    return this.tunnels[name];
  }
}

module.exports = TunnelManager;
