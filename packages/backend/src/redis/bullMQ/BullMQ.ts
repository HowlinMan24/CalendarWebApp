import IORedis from 'ioredis';

require('dotenv').config();

const config = require('config');
const redisConfig = config.get('redis')

const connection = new IORedis({
    host: redisConfig.host,
    port: parseInt(redisConfig.port, 10),
    password: process.env['REDIS_PASSWORD'],
    maxRetriesPerRequest: null
})

export {connection};