import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../lib/email.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import crypto from 'crypto';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

const sendOtpSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
  }),
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// ─── In-memory OTP rate limiting (1 send per 60s per email) ──────────────────
const otpRateLimit = new Map(); // email -> timestamp of last send

function checkOtpRateLimit(email) {
  const last = otpRateLimit.get(email);
  if (last && Date.now() - last < 60 * 1000) {
    const secondsLeft = Math.ceil((60 * 1000 - (Date.now() - last)) / 1000);
    throw new ApiError(429, `Please wait ${secondsLeft} seconds before requesting a new code`);
  }
  otpRateLimit.set(email, Date.now());
}

// POST /api/auth/send-otp
router.post('/send-otp', authLimiter, validate(sendOtpSchema), asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists. Please sign in instead.');
  }

  // Rate limit: max 1 OTP per 60 seconds
  checkOtpRateLimit(email);

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration to 10 mins from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Save/Update OTP in database
  await prisma.emailOtp.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt },
  });

  // Send Email
  const emailResult = await sendVerificationEmail(email, otp, name);

  // Build response — surface warning to frontend if email was mocked
  const response = { success: true, message: 'Verification code sent to your email' };
  if (emailResult.mock) {
    response.warning = 'dev_mock_email';
    response.message = 'Code generated — check the server terminal for your OTP (Gmail SMTP not configured)';
  }

  res.json(response);
}));

// POST /api/auth/resend-otp  (resend without requiring name again)
router.post('/resend-otp', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Valid email is required');
  }

  // Check there's a pending OTP to resend (user must have called send-otp first)
  const record = await prisma.emailOtp.findUnique({ where: { email } });
  if (!record) {
    throw new ApiError(400, 'No pending verification found. Please start registration again.');
  }

  // Rate limit
  checkOtpRateLimit(email);

  // Generate fresh OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  await prisma.emailOtp.update({
    where: { email },
    data: { otp, expiresAt },
  });

  const emailResult = await sendVerificationEmail(email, otp, record.name || 'there');

  const response = { success: true, message: 'New verification code sent' };
  if (emailResult.mock) {
    response.warning = 'dev_mock_email';
    response.message = 'New code generated — check the server terminal for your OTP';
  }

  res.json(response);
}));

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Verify OTP
  const record = await prisma.emailOtp.findUnique({ where: { email } });
  if (!record || record.otp !== otp) {
    throw new ApiError(400, 'Invalid verification code');
  }
  
  if (record.expiresAt < new Date()) {
    throw new ApiError(400, 'Verification code has expired');
  }

  // OTP valid, delete it
  await prisma.emailOtp.delete({ where: { email } });

  const hashedPassword = await bcrypt.hash(password, 10);

  // Auto-assign admin role if this is the designated admin email
  const isAdminEmail = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: isAdminEmail ? 'admin' : 'customer',
    },
  });

  // Send Welcome Email asynchronously (don't await so it doesn't block response)
  sendWelcomeEmail(email, name).catch(console.error);

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
}));

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
}));

// POST /api/auth/login-otp (Send OTP for existing user)
router.post('/login-otp', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Valid email is required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, 'No account found with this email. Please register first.');
  }

  checkOtpRateLimit(email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  await prisma.emailOtp.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt },
  });

  const emailResult = await sendVerificationEmail(email, otp, user.name || 'there');

  const response = { success: true, message: 'Login code sent to your email' };
  if (emailResult.mock) {
    response.warning = 'dev_mock_email';
    response.message = 'Login code generated — check the server terminal for your OTP';
  }

  res.json(response);
}));

// POST /api/auth/verify-login-otp (Verify OTP and log in)
router.post('/verify-login-otp', authLimiter, asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const record = await prisma.emailOtp.findUnique({ where: { email } });
  if (!record || record.otp !== otp) {
    throw new ApiError(400, 'Invalid login code');
  }
  
  if (record.expiresAt < new Date()) {
    throw new ApiError(400, 'Login code has expired');
  }

  // OTP valid, delete it
  await prisma.emailOtp.delete({ where: { email } });

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
  });
}));

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: incomingRefreshToken },
    });

    if (!dbToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Generate new tokens
    // We assume decoded payload has role, but refresh token only signs userId. 
    // We should fetch user to get role.
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new ApiError(401, 'User no longer exists');

    const accessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Rotate token in DB
    await prisma.refreshToken.delete({ where: { id: dbToken.id } });
    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt },
    });

    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res.json({ success: true, accessToken });
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
}));

// POST /api/auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (incomingRefreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: incomingRefreshToken },
    });
  }

  res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
  res.json({ success: true, message: 'Logged out successfully' });
}));

// GET /api/auth/me
router.get('/me', isAuthenticated, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
}));

export default router;
