import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all notifications for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Mock notifications for demo
    const mockNotifications = [
      {
        id: '1',
        title: 'Event Registration Confirmed',
        message: 'Your registration for "Tech Talk 2024" has been confirmed.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Booking Approved',
        message: 'Your booking for Computer Lab A has been approved for tomorrow 2:00 PM.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Food Order Ready',
        message: 'Your order #ORD12345 is ready for pickup at the canteen.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: 'Timetable Updated',
        message: 'Your class schedule has been updated. Please check the Timetable section.',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json(mockNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, update the notification in database
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (for system/admin use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    
    // Mock notification creation
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type: type || 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: userId || req.user._id
    };

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    // Mock unread count
    const unreadCount = 2;
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
