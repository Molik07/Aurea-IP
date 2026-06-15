/**
 * Rate limiting middleware configuration.
 *
 * Provides two limiters:
 * - globalLimiter: 100 requests per 15 minutes per IP (general API protection)
 * - authLimiter: 10 requests per 15 minutes per IP (brute-force protection on login/OTP)
 */
import rateLimit from 'express-rate-limit';

// Global: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Auth-specific: 10 attempts per 15 minutes per IP (login, OTP verify, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
});
