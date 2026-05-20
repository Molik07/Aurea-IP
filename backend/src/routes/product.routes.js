import { Router } from 'express';
import Product from '../models/Product.js';
import { initialProducts } from '../lib/seedData.js';

const router = Router();

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    let products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Seed database if empty
    if (products.length === 0) {
      console.log('[Products] Database empty. Seeding initial products...');
      await Product.insertMany(initialProducts);
      products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    }
    
    res.json(products);
  } catch (error) {
    console.error('[Products] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
