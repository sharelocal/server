const nanoid = require('nanoid');
const { Users, Domains } = require('./mongodb');
const { encryptPassword } = require('../helpers');

class User {
  constructor({ login, password, token }) {
    this.login = login;
    this.password = password;
    this.token = token;
  }

  async create() {
    const token = nanoid();

    await Users({
      login: this.login,
      password: encryptPassword(this.password),
      token,
    }).save();

    return token;
  }

  async verify() {
    const user = await Users.findOne({
      token: this.token,
    });

    return !!user;
  }

  async check() {
    const user = await Users.findOne({
      login: this.login,
    });

    return !!user;
  }

  async get() {
    const user = await Users.findOne({ login: this.login });
    const domains = await Domains.find({ userId: user._id });

    return {
      login: user.login,
      token: user.token,
      domains: domains.map(item => item.domain),
    };
  }
}

module.exports = User;
