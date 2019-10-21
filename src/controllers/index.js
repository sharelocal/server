const { Tunnel, TunnelManager, TunnelAgent } = require('../apis');

const manager = new TunnelManager();

module.exports.hello = async (ctx) => {
  const { subdomain = manager.create() } = ctx.request.body;

  ctx.assert(!manager.get(subdomain), 400, 'Tunnel is busy');

  const agent = new TunnelAgent();
  const tunnel = new Tunnel(subdomain, agent);
  const port = await agent.start();

  manager.add(tunnel.name, tunnel);

  ctx.body = {
    port,
    url: `https://${subdomain}.localshare.me`,
  };
};

module.exports.tunnel = async (ctx) => {
  const { host } = ctx.headers;
  const name = host && host.split('.')[0];
  const tunnel = manager.get(name);

  ctx.assert(tunnel, 502, 'Tunnel is not found');

  const response = await tunnel.send(ctx.req);

  Object.entries(response.headers).forEach(([key, value]) => {
    ctx.set(key, value);
  });

  ctx.status = response.statusCode;
  ctx.response = false;

  response.pipe(ctx.res);
};
