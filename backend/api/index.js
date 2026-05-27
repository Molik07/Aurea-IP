import app from '../src/app.js';
import { connectMongoDB } from '../src/lib/mongodb.js';
import { connectRedis } from '../src/lib/redis.js';
import prisma from '../src/lib/prisma.js';

try {
  // Wait for the primary PostgreSQL connection during the serverless cold start
  await prisma.$connect();
  console.log('[Serverless] ✅ PostgreSQL connected');

  // Try MongoDB and Redis, but don't crash the function if they fail
  // (mimicking the logic in src/index.js)
  connectMongoDB()
    .then(() => console.log('[Serverless] ✅ MongoDB connected'))
    .catch((err) => console.warn('[Serverless] ⚠️ MongoDB connection failed:', err.message));

  connectRedis()
    .then(() => console.log('[Serverless] ✅ Redis connected'))
    .catch((err) => console.warn('[Serverless] ⚠️ Redis connection failed:', err.message));
} catch (error) {
  console.error('[Serverless] ❌ Fatal PostgreSQL connection error:', error);
}

// Export the Express app so Vercel can handle HTTP routing
export default app;
