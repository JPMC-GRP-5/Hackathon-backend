import redis from 'redis';

const REDIS_PORT = process.env.PORT || 6379;
const client=redis.createClient(REDIS_PORT)
export default client;

