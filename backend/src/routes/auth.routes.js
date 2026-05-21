import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { admin } from '../lib/firebase.js';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Schemas ──────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string().optional(),
    firebaseIdToken: z.string().optional(),
  }).refine((data) => {
    // If phone number is provided, a Firebase ID token MUST be provided to verify it
    if (data.phoneNumber && !data.firebaseIdToken) return false;
    return true;
  }, {
    message: "Firebase ID token is required if phone number is provided",
    path: ["firebaseIdToken"]
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, firebaseIdToken } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Verify Phone Number with Firebase if provided
  let verifiedPhoneNumber = null;
  if (phoneNumber && firebaseIdToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      
      // Ensure the token's phone number matches the one submitted
      if (decodedToken.phone_number !== phoneNumber) {
        throw new ApiError(400, 'Phone number mismatch with Firebase token');
      }
      
      verifiedPhoneNumber = decodedToken.phone_number;
    } catch (error) {
      console.error('[Firebase] Token Verification Error:', error);
      throw new ApiError(401, 'Invalid or expired Firebase ID token');
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNumber: verifiedPhoneNumber,
    },
  });

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
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
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
