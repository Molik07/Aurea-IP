import { Router } from 'express';
import redis from '../lib/redis.js';
import prisma from '../lib/prisma.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

const CACHE_KEY = 'site:settings';
const CACHE_TTL = 86400; // 24 hours in seconds

const DEFAULT_SETTINGS = {
  heroImage: '',
};

// GET /api/settings - Fetch global site settings
router.get('/', async (req, res) => {
  try {
    // 1. Try Redis cache first (fast path)
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 2. Cache miss → read from PostgreSQL (permanent store)
    let record = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    if (!record) {
      // First-ever run: seed the row
      record = await prisma.siteSettings.create({
        data: { id: 'global', heroImage: '' },
      });
    }

    const settings = { heroImage: record.heroImage };

    // 3. Repopulate Redis cache with a 24-hour TTL
    await redis.set(CACHE_KEY, JSON.stringify(settings), 'EX', CACHE_TTL);

    res.json(settings);
  } catch (error) {
    console.error('[Settings] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// POST /api/settings - Update site settings
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Build only the fields we received (future-proof for more settings)
    const updateData = {};
    if (req.body.heroImage !== undefined) updateData.heroImage = req.body.heroImage;

    // 1. Write to PostgreSQL (source of truth — never gets evicted)
    const record = await prisma.siteSettings.upsert({
      where: { id: 'global' },
      update: updateData,
      create: { id: 'global', heroImage: updateData.heroImage ?? '' },
    });

    const settings = { heroImage: record.heroImage };

    // 2. Refresh Redis cache so the next GET is fast
    await redis.set(CACHE_KEY, JSON.stringify(settings), 'EX', CACHE_TTL);

    res.json(settings);
  } catch (error) {
    console.error('[Settings] Update Error:', error);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
