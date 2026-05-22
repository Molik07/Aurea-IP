import { Router } from 'express';
import prisma from '../lib/prisma.js';
import Product from '../models/Product.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(isAuthenticated, isAdmin);

// GET /api/admin/stats — dashboard overview
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, recentOrders, totalProducts] = await Promise.all([
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true } },
      },
    }),
    Product.countDocuments({ isActive: true }),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: { totalPaise: true },
    where: { status: { not: 'cancelled' } },
  });

  const totalRevenuePaise = revenueResult._sum.totalPaise || 0;

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenuePaise,
    totalProducts,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customer: o.user?.name || o.user?.email || 'Unknown',
      date: o.createdAt,
      totalPaise: o.totalPaise,
      status: o.status,
      paymentStatus: o.payment?.status || 'unpaid',
    })),
  });
}));

// GET /api/admin/users — all users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });
  res.json(users);
}));

// PATCH /api/admin/users/:id/role — promote/demote user
router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  // Prevent removing the last admin
  if (role === 'customer') {
    const adminCount = await prisma.user.count({ where: { role: 'admin' } });
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot remove the only admin' });
    }
  }
  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(updated);
}));

// GET /api/admin/orders — all orders
router.get('/orders', asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      payment: { select: { status: true, razorpayPaymentId: true } },
    },
  });
  res.json(orders);
}));

// PATCH /api/admin/orders/:id/status — update order status
router.patch('/orders/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(updated);
}));

export default router;
