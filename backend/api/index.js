import app from '../src/app.js';
import { connectMongoDB } from '../src/lib/mongodb.js';
import { connectRedis } from '../src/lib/redis.js';
import prisma from '../src/lib/prisma.js';

// Fire off database connections in the background so the module exports immediately
// (Prisma will automatically wait for the connection when the first query is made)
prisma.$connect()
  .then(() => console.log('[Serverless] ✅ PostgreSQL connected'))
  .catch((err) => console.error('[Serverless] ❌ Fatal PostgreSQL connection error:', err));

connectMongoDB()
  .then(() => console.log('[Serverless] ✅ MongoDB connected'))
  .catch((err) => console.warn('[Serverless] ⚠️ MongoDB connection failed:', err.message));

connectRedis()
  .then(() => console.log('[Serverless] ✅ Redis connected'))
  .catch((err) => console.warn('[Serverless] ⚠️ Redis connection failed:', err.message));

// Export the Express app so Vercel can handle HTTP routing
export default app;
