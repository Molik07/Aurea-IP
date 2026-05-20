import { Router } from 'express';
import redis from '../lib/redis.js';

const router = Router();

// Middleware to ensure guest_id/user_id exists
const requireUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'Missing x-user-id header' });
  req.userId = userId;
  next();
};

router.use(requireUserId);

router.get('/', async (req, res) => {
  try {
    const data = await redis.get(`cart:${req.userId}`);
    res.json(data ? JSON.parse(data) : { items: [] });
  } catch (error) {
    console.error('[Cart] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    await redis.set(`cart:${req.userId}`, JSON.stringify({ items }), 'EX', 60 * 60 * 24 * 7); // 7 days expiration
    res.json({ success: true });
  } catch (error) {
    console.error('[Cart] Update Error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

export default router;
