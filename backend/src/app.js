import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { NODE_ENV, FRONTEND_URL } from './config/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiError } from './utils/ApiError.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import productRoutes from './routes/product.routes.js';
import settingsRoutes from './routes/settings.routes.js';

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies (refresh tokens)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  })
);

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Makeup Store API is running (DB Setup Mode)', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
