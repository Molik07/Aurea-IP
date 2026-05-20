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
    // Connect to all data stores before starting HTTP server
    console.log('[Server] Connecting to databases...');
    await connectMongoDB();
    await connectRedis();
    await prisma.$connect();
    console.log('[Server] All database connections established');

    server = app.listen(PORT, () => {
      console.log(`[Server] Makeup Store API running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/health`);
    });

    server.on('error', (err) => {
      console.error('[Server] Server error:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('[Server] Failed to start:', err);
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
