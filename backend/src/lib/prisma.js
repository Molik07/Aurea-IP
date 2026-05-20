import { PrismaClient } from '@prisma/client';
import { NODE_ENV } from '../config/index.js';

/**
 * Prisma client singleton.
 * In development, attach to the global object to prevent hot-reload
 * from spawning multiple Prisma connections.
 */

const globalForPrisma = globalThis;

const prisma =
globalForPrisma.prisma ??
  new PrismaClient({
    log:
      NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
