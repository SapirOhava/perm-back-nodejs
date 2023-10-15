// we know with docker we can always use mongo the dns - (name of our service -> to its ip address)
// works in dev and in prod , but in the future i don't want to keep my database as a docker container
// maybe i would want to use some managed service. so in that case i cant use dns (because it wont be running as a container anymore)
// so in that case i would need to pass the ip address as an environment variable.
// this - process.env.MONGO_IP - were going to make sure that my docker container pass this env variable in
// and if not its going to use the default value - "mongo"
// don't forget to pass all this env variable in the docker-compose file

// in prod and dev were not really gonna set the process.env.REDIS_URL , mongo_ip etc.. its there
// maybe in the future ill decide to have a redis db that is not a docker container, and i cant use
// docker dns then ill pass this

// by the way i use only the default ports like mongo's 27017 and redis 6379

module.exports = {
  MONGO_IP: process.env.MONGO_IP || 'mongo',
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  REDIS_URL: process.env.REDIS_URL || 'redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
