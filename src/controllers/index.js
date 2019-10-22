const {
  User,
  Tunnel,
  TunnelManager,
  TunnelAgent,
} = require('../apis');

const manager = new TunnelManager();

module.exports.createTunnel = async (ctx) => {
  const { subdomain = manager.getAvailableName() } = ctx.query;

  ctx.assert(!manager.get(subdomain), 400, 'Tunnel is busy');

  const agent = new TunnelAgent();
  const tunnel = new Tunnel(subdomain, agent);
  const port = await agent.start();

  manager.add(tunnel.name, tunnel);

  agent.on('dead', () => {
    manager.remove(tunnel.name);
  });

  ctx.body = {
    port,
    subdomain,
  };
};

module.exports.createUser = async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = new User({ login, password });
  const exists = await user.check();

  ctx.assert(!exists, 400, 'User is already exists');

  const token = await user.create();

  ctx.body = {
    token,
  };
};

module.exports.getUserDomains = async (ctx) => {};

module.exports.addUserDomain = async (ctx) => {};

module.exports.deleteUserDomain = async (ctx) => {};

module.exports.tunnel = (ctx) => {
  ctx.respond = false;

  const { host } = ctx.headers;
  const name = host && host.split('.')[0];
  const tunnel = manager.get(name);

  ctx.assert(tunnel, 404, 'Tunnel is not found');

  tunnel.request(ctx);
};
