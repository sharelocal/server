const { Tunnel, TunnelManager, TunnelAgent } = require('../apis');

const manager = new TunnelManager();

module.exports.hello = async (req, res) => {
  const { subdomain = manager.getAvailableName() } = req.query;

  if (manager.get(subdomain)) {
    res.end(JSON.stringify({
      status: 400,
      error: 'Tunnel is busy',
    }));

    return;
  }

  const agent = new TunnelAgent();
  const tunnel = new Tunnel(subdomain, agent);
  const port = await agent.start();

  manager.add(tunnel.name, tunnel);

  agent.on('dead', () => {
    manager.remove(tunnel.name);
  });

  res.end(JSON.stringify({
    port,
    subdomain,
  }));
};

module.exports.tunnel = (req, res) => {
  const { host } = req.headers;
  const name = host && host.split('.')[0];
  const tunnel = manager.get(name);

  if (!tunnel) {
    res.end(JSON.stringify({
      status: 404,
      error: 'Tunnel is not found',
    }));

    return;
  }

  tunnel.request(req, res);
};
