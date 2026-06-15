import dotenv from 'dotenv';
dotenv.config();

/**
 * Central configuration module.
 * All environment variables are validated and exported from here.
 * The application will throw immediately at startup if critical vars are missing.
 */

function require_env(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function optional_env(key, fallback = '') {
  return process.env[key] ?? fallback;
}

// ─── Server ───────────────────────────────────────────────────────────────────
export const PORT = optional_env('PORT', '5000');
export const NODE_ENV = optional_env('NODE_ENV', 'development');
export const FRONTEND_URL = optional_env('FRONTEND_URL', 'http://localhost:3000');

// ─── PostgreSQL ───────────────────────────────────────────────────────────────
export const DATABASE_URL = require_env('DATABASE_URL');

// ─── MongoDB ──────────────────────────────────────────────────────────────────
export const MONGODB_URI = require_env('MONGODB_URI');

// ─── Redis ────────────────────────────────────────────────────────────────────
export const REDIS_URL = require_env('REDIS_URL');

// ─── Redis TTL Constants ───────────────────────────────────────────────────────
export const REDIS_TTL = {
  CART: 604800,     // 7 days
  SESSION: 86400,   // 1 day
  PRODUCT: 600,     // 10 minutes
  SEARCH: 300,      // 5 minutes
};

// ─── Cloudinary ───────────────────────────────────────────────────────────────
export const CLOUDINARY_CLOUD_NAME = optional_env('CLOUDINARY_CLOUD_NAME');
export const CLOUDINARY_API_KEY = optional_env('CLOUDINARY_API_KEY');
export const CLOUDINARY_API_SECRET = optional_env('CLOUDINARY_API_SECRET');

// ─── JWT ──────────────────────────────────────────────────────────────────────
export const JWT_SECRET = require_env('JWT_SECRET');
export const JWT_REFRESH_SECRET = require_env('JWT_REFRESH_SECRET');
export const JWT_ACCESS_EXPIRATION = optional_env('JWT_ACCESS_EXPIRATION', '15m');
export const JWT_REFRESH_EXPIRATION = optional_env('JWT_REFRESH_EXPIRATION', '7d');
