import redis from 'redis';

const REDIS_PORT = process.env.PORT || 6379;
const client=redis.createClient(REDIS_PORT)

client
  .connect()
  .then(() => {
    console.log("Redis Client Connected");
  })

  .catch((error) => console.error(error));

  export default client;
