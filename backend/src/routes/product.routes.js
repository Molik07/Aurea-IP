import { Router } from 'express';
import Product from '../models/Product.js';
import { initialProducts } from '../lib/seedData.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/products - Fetch products with search, filters, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, skinTypes, concerns, sort, page, limit, all } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      // Handles multiple categories if passed as comma separated
      const categories = category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    if (skinTypes) {
      const types = skinTypes.split(',').map(s => s.trim());
      query.skinTypes = { $in: types };
    }

    if (concerns) {
      const c = concerns.split(',').map(c => c.trim());
      query.concerns = { $in: c };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { pricePaise: 1 };
    if (sort === 'price-desc') sortOption = { pricePaise: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    // Seed database if empty logic
    const totalDocs = await Product.countDocuments();
    if (totalDocs === 0) {
      console.log('[Products] Database empty. Seeding initial products...');
      await Product.insertMany(initialProducts);
    }

    if (all === 'true') {
      const products = await Product.find(query).sort(sortOption);
      return res.json(products); // Legacy array format for useProducts global store
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
    
    const totalCount = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      }
    });
  } catch (error) {
    console.error('[Products] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Create a new product
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.id; // Remove client-side temp id to let MongoDB generate ObjectId
    
    const product = new Product(payload);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('[Products] Create Error:', error);
    res.status(400).json({ error: error.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.id;
    
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('[Products] Update Error:', error);
    res.status(400).json({ error: error.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('[Products] Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
