import Redis from 'ioredis';
import { REDIS_URL } from '../config/index.js';

/**
 * ioredis singleton client.
 * Configured with:
 *   - lazyConnect: don't connect until first command
 *   - maxRetriesPerRequest: fail fast if Redis is down
 *   - enableOfflineQueue: false, so commands fail rather than pile up
 */

const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  retryStrategy(times) {
    const delay = Math.min(times * 500, 3000);
    console.warn(`[Redis] Retrying connection in ${delay}ms... (attempt ${times})`);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
  console.error('[Redis] Client error:', err.message);
});

redis.on('close', () => {
  console.warn('[Redis] Connection closed');
});

export const connectRedis = async () => {
  await redis.connect();
};

export default redis;
