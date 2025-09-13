import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import User from '../models/user.js';
import Order from '../models/order.js';
import Booking from '../models/booking.js';
import Event from '../models/event.js';

const router = express.Router();

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, employeeId } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password, // In production, hash this
      role,
      department,
      studentId,
      employeeId
    });

    await user.save();
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk upload users
router.post('/users/bulk', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { users } = req.body;
    
    // In production, validate and process bulk user creation
    res.json({ message: `${users.length} users processed successfully` });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard analytics
router.get('/analytics/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalEvents = await Event.countDocuments();

    const stats = {
      totalUsers,
      totalOrders,
      totalBookings,
      totalEvents,
      activeUsers: Math.floor(totalUsers * 0.7), // Mock active users
      revenue: 25000, // Mock revenue
      pendingBookings: await Booking.countDocuments({ status: 'pending' }),
      upcomingEvents: await Event.countDocuments({ 
        date: { $gte: new Date().toISOString().split('T')[0] } 
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking heatmap data
router.get('/analytics/bookings-heatmap', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Mock heatmap data
    const heatmapData = [
      { day: 'Monday', hour: 9, bookings: 5 },
      { day: 'Monday', hour: 10, bookings: 8 },
      { day: 'Tuesday', hour: 9, bookings: 3 },
      { day: 'Tuesday', hour: 14, bookings: 6 },
      // Add more mock data...
    ];

    res.json(heatmapData);
  } catch (error) {
    console.error('Booking heatmap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sales data
router.get('/analytics/sales', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    // Mock sales data
    const salesData = {
      week: [
        { date: '2024-01-01', sales: 1200 },
        { date: '2024-01-02', sales: 1500 },
        { date: '2024-01-03', sales: 900 },
        { date: '2024-01-04', sales: 1800 },
        { date: '2024-01-05', sales: 2100 },
        { date: '2024-01-06', sales: 1600 },
        { date: '2024-01-07', sales: 1300 }
      ],
      month: [
        { date: '2024-01', sales: 25000 },
        { date: '2024-02', sales: 28000 },
        { date: '2024-03', sales: 32000 }
      ]
    };

    res.json(salesData[period] || salesData.week);
  } catch (error) {
    console.error('Sales data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Event participation data
router.get('/analytics/event-participation', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const events = await Event.find()
      .select('title registrations category')
      .populate('registrations.userId', 'name role');

    const participationData = events.map(event => ({
      eventName: event.title,
      category: event.category,
      totalRegistrations: event.registrations.length,
      studentRegistrations: event.registrations.filter(r => r.userId.role === 'student').length,
      facultyRegistrations: event.registrations.filter(r => r.userId.role === 'faculty').length
    }));

    res.json(participationData);
  } catch (error) {
    console.error('Event participation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User activity data
router.get('/analytics/user-activity', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          avgPoints: { $avg: '$points' }
        }
      }
    ]);

    res.json(userStats);
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
