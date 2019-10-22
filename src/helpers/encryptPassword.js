const sha256 = require('sha256');

module.exports = password => sha256(`${process.env.SALT}:${password}`);
