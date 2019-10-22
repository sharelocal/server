const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
});

const Users = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const Domains = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  domain: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = {
  Users: mongoose.model('users', Users),
  Domains: mongoose.model('domains', Domains),
};
