import Promise from 'bluebird';
import nconf from 'nconf';
import redis from 'redis';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client_url = nconf.get('REDIS_URL') || nconf.get('REDISCLOUD_URL') || 'redis://127.0.0.1:6379';
const client = redis.createClient({url: client_url});
export default client;


// Gets a users language based on ID
export function getUserLang(user_id) {
  return client.hgetAsync(`user_${user_id}`, 'lang')
    .then(lang => lang || 'en');
}

// Sets a users language based on ID
export function setUserLang(user_id, lang) {
  return client.hsetAsync(`user_${user_id}`, 'lang', lang);
}
