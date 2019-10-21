const { createClient } = require('redis');
const { promisify } = require('util');

const redis = createClient(process.env.REDIS_URL);

redis.hset = promisify(redis.hset);
redis.hget = promisify(redis.hget);
redis.hgetall = promisify(redis.hgetall);
redis.hdel = promisify(redis.hdel);
redis.hdel = promisify(redis.hdel);

module.exports = redis;
