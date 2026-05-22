import app from './app.js';
import { PORT } from './config/index.js';
import { connectMongoDB } from './lib/mongodb.js';
import { connectRedis } from './lib/redis.js';
import prisma from './lib/prisma.js';

/**
 * Application entry point.
 * Establishes all database connections before binding the HTTP server.
 * Implements graceful shutdown on SIGTERM / SIGINT.
 */

let server;

const shutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(async () => {
    console.log('[Server] HTTP server closed');
    
    try {
      // Close database connections
      await prisma.$disconnect();
      console.log('[Server] Prisma disconnected');

      const { default: redis } = await import('./lib/redis.js');
      await redis.quit();
      console.log('[Server] Redis disconnected');

      const { default: mongoose } = await import('./lib/mongodb.js');
      await mongoose.connection.close();
      console.log('[Server] MongoDB disconnected');

      console.log('[Server] Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('[Server] Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if graceful fails
  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

const start = async () => {
  try {
    console.log('[Server] Connecting to databases...');

    // PostgreSQL (Prisma) — REQUIRED for auth, orders, users
    await prisma.$connect();
    console.log('[Server] ✅ PostgreSQL connected');

    // MongoDB — optional in dev (used for product catalog)
    try {
      await connectMongoDB();
      console.log('[Server] ✅ MongoDB connected');
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[Server] ❌ MongoDB connection failed (fatal in production):', err.message);
        process.exit(1);
      }
      console.warn('[Server] ⚠️  MongoDB unavailable (non-fatal in dev) — product catalog features will be limited');
    }

    // Redis — optional in dev (used for caching)
    try {
      await connectRedis();
      console.log('[Server] ✅ Redis connected');
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[Server] ❌ Redis connection failed (fatal in production):', err.message);
        process.exit(1);
      }
      console.warn('[Server] ⚠️  Redis unavailable (non-fatal in dev) — caching will be skipped');
    }

    server = app.listen(PORT, () => {
      console.log(`\n[Server] 🚀 Aurea API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
      console.log(`[Server] Auth endpoints: http://localhost:${PORT}/api/auth\n`);
    });

    server.on('error', (err) => {
      console.error('[Server] Server error:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('[Server] Failed to start (PostgreSQL required):', err);
    process.exit(1);
  }
};

// ─── Graceful Shutdown Hooks ──────────────────────────────────────────────────
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled Errors ─────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
  process.exit(1);
});

start();
