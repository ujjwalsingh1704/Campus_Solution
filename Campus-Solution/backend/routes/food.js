import express from 'express';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middlewares/authMiddleware.js';
import Order from '../models/order.js';
import MenuItem from '../models/menuItem.js';
import User from '../models/user.js';

const router = express.Router();

// Get menu items
router.get('/menu', optionalAuth, async (req, res) => {
  try {
    const { category, vegetarian, available, popular, ecoFriendly } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (vegetarian === 'true') filter.isVegetarian = true;
    if (available !== 'false') filter.isAvailable = true;
    if (ecoFriendly === 'true') filter.isEcoFriendly = true;

    let query = MenuItem.find(filter);
    
    if (popular === 'true') {
      query = query.sort({ popularity: -1 });
    } else {
      query = query.sort({ category: 1, name: 1 });
    }

    const menuItems = await query;
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu by category
router.get('/menu/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuItem.find({ 
      category, 
      isAvailable: true 
    }).sort({ name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular items
router.get('/menu/popular', async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ isAvailable: true })
      .sort({ popularity: -1 })
      .limit(10);
    
    res.json(popularItems);
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eco-friendly options
router.get('/menu/eco-friendly', async (req, res) => {
  try {
    const ecoItems = await MenuItem.find({ 
      isEcoFriendly: true, 
      isAvailable: true 
    }).sort({ name: 1 });
    
    res.json(ecoItems);
  } catch (error) {
    console.error('Get eco-friendly items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items, paymentMethod, specialInstructions, deliveryLocation } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.name}` });
      }
      
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Item not available: ${menuItem.name}` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        category: menuItem.category,
        image: menuItem.image,
        customizations: item.customizations
      });
    }

    // Check wallet balance if paying with wallet
    if (paymentMethod === 'wallet') {
      const user = await User.findById(req.user._id);
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
    }

    const order = new Order({
      userId: req.user._id,
      items: processedItems,
      totalAmount,
      paymentMethod,
      specialInstructions,
      deliveryLocation,
      estimatedTime: Math.max(...processedItems.map(item => 
        items.find(i => i.name === item.name)?.preparationTime || 15
      ))
    });

    await order.save();

    // Deduct from wallet if payment method is wallet
    if (paymentMethod === 'wallet') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { walletBalance: -totalAmount }
      });
      order.paymentStatus = 'paid';
      await order.save();
    }

    await order.populate('userId', 'name email studentId');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { userId: req.user._id };
    
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (for faculty/admin)
router.get('/orders/all', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    await order.populate('userId', 'name email studentId');

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply discount to order
router.post('/orders/:id/discount', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { discountCode } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Simple discount logic (can be enhanced)
    let discountAmount = 0;
    switch (discountCode.toUpperCase()) {
      case 'STUDENT10':
        discountAmount = order.totalAmount * 0.1;
        break;
      case 'FIRST20':
        discountAmount = order.totalAmount * 0.2;
        break;
      default:
        return res.status(400).json({ message: 'Invalid discount code' });
    }

    order.totalAmount -= discountAmount;
    order.discountApplied = discountCode;
    order.discountAmount = discountAmount;
    await order.save();

    res.json({
      message: 'Discount applied successfully',
      order,
      discountAmount
    });
  } catch (error) {
    console.error('Apply discount error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order queue
router.get('/queue', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const queue = await Order.find({
      status: { $in: ['confirmed', 'preparing'] }
    }).populate('userId', 'name email studentId')
      .sort({ createdAt: 1 });

    res.json(queue);
  } catch (error) {
    console.error('Get order queue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request refund
router.post('/orders/:id/refund', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot refund delivered orders' });
    }

    order.status = 'cancelled';
    order.refundReason = reason;
    order.paymentStatus = 'refunded';
    await order.save();

    // Refund to wallet if paid via wallet
    if (order.paymentMethod === 'wallet' && order.paymentStatus === 'paid') {
      await User.findByIdAndUpdate(order.userId, {
        $inc: { walletBalance: order.totalAmount }
      });
    }

    res.json({
      message: 'Refund processed successfully',
      order
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
