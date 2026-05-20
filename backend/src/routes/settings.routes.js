import { Router } from 'express';
import redis from '../lib/redis.js';

const router = Router();

const DEFAULT_SETTINGS = {
  heroImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
};

// GET /api/settings - Fetch global site settings
router.get('/', async (req, res) => {
  try {
    const data = await redis.get('site:settings');
    const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
    
    // Seed default settings if empty
    if (!data) {
      await redis.set('site:settings', JSON.stringify(DEFAULT_SETTINGS));
    }
    
    res.json(settings);
  } catch (error) {
    console.error('[Settings] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// POST /api/settings - Update site settings
router.post('/', async (req, res) => {
  try {
    const currentData = await redis.get('site:settings');
    const currentSettings = currentData ? JSON.parse(currentData) : DEFAULT_SETTINGS;
    
    const updatedSettings = {
      ...currentSettings,
      ...req.body,
    };
    
    await redis.set('site:settings', JSON.stringify(updatedSettings));
    res.json(updatedSettings);
  } catch (error) {
    console.error('[Settings] Update Error:', error);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
