import express from 'express';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middlewares/authMiddleware.js';
import Event from '../models/event.js';

const router = express.Router();

// Get all events
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, upcoming, search } = req.query;
    let filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter upcoming events
    if (upcoming === 'true') {
      filter.date = { $gte: new Date().toISOString().split('T')[0] };
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email role')
      .populate('registrations.userId', 'name email studentId')
      .sort({ date: 1 });

    console.log('Events found:', events.length);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event
router.post('/', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      roomNumber,
      category, 
      capacity, 
      tags,
      rules,
      penalties,
      dressCode,
      requirements
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      roomNumber,
      category,
      capacity,
      tags,
      rules,
      penalties,
      dressCode,
      requirements,
      status: req.user.role === 'admin' ? 'approved' : 'pending', // Auto-approve admin events
      createdBy: req.user._id
    });

    await event.save();
    await event.populate('createdBy', 'name email role');

    console.log('Event created successfully:', event._id);
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.registrations.some(
      reg => reg.userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    if (event.capacity && event.registrations.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Add registration
    event.registrations.push({
      userId: req.user._id,
      registeredAt: new Date()
    });

    await event.save();
    await event.populate('registrations.userId', 'name email studentId');

    res.json({
      message: 'Successfully registered for event',
      event
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user can update this event
    if (req.user.role === 'faculty' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('createdBy', 'name email role')
     .populate('registrations.userId', 'name email studentId');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user can delete this event
    if (req.user.role === 'faculty' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unregister from event
router.delete('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove registration
    event.registrations = event.registrations.filter(
      reg => reg.userId.toString() !== req.user._id.toString()
    );

    await event.save();

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's registered events
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({
      'registrations.userId': req.user._id
    }).populate('createdBy', 'name email role');

    res.json(events);
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin approval endpoints
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    event.approvedBy = req.user._id;
    event.approvedAt = new Date();

    await event.save();
    await event.populate('createdBy', 'name email role');
    await event.populate('approvedBy', 'name email role');

    res.json({
      message: `Event ${status} successfully`,
      event
    });
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events pending approval (admin only)
router.get('/pending', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events by status
router.get('/by-status/:status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let filter = { status };
    
    // Faculty can only see their own events if not approved
    if (req.user.role === 'faculty' && status !== 'approved') {
      filter.createdBy = req.user._id;
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email role')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    console.error('Get events by status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
