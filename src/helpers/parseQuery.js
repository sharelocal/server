const qs = require('querystring');

module.exports = req => qs.parse(req.url.split('?')[1]);
