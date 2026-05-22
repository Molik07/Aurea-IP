import { Router } from 'express';
import Category from '../models/Category.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/categories - Fetch all active categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // Seed default categories if database is empty
    if (categories.length === 0) {
      const defaultCategories = ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask'].map(name => ({ name }));
      await Category.insertMany(defaultCategories);
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    }

    res.json(categories);
  } catch (error) {
    console.error('[Categories] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create a new category (Admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('[Categories] Create Error:', error);
    res.status(400).json({ error: error.message || 'Failed to create category' });
  }
});

// PUT /api/categories/:id - Update a category (Admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update category' });
  }
});

// DELETE /api/categories/:id - Delete a category (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
