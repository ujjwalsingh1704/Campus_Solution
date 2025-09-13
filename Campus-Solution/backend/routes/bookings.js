import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import Booking from '../models/booking.js';
import Resource from '../models/resource.js';

const router = express.Router();

// Get all bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, date, resourceType } = req.query;
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'student') {
      filter.bookedBy = req.user._id;
    }

    // Additional filters
    if (status) filter.status = status;
    if (date) filter.date = date;
    if (resourceType) filter.resourceType = resourceType;

    const bookings = await Booking.find(filter)
      .populate('bookedBy', 'name email studentId')
      .populate('approvedBy', 'name email')
      .populate('resourceId', 'name type location')
      .sort({ date: 1, startTime: 1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { 
      resourceId, 
      date, 
      startTime, 
      endTime, 
      purpose, 
      attendees, 
      contactInfo, 
      specialRequirements 
    } = req.body;

    // Validate resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.isAvailable) {
      return res.status(400).json({ message: 'Resource is not available' });
    }

    // Check capacity
    if (attendees > resource.capacity) {
      return res.status(400).json({ 
        message: `Attendees (${attendees}) exceed resource capacity (${resource.capacity})` 
      });
    }

    // Check for time conflicts
    const conflictingBooking = await Booking.findOne({
      resourceId,
      date,
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        message: 'Time slot conflicts with existing booking',
        conflictingBooking 
      });
    }

    // Check operating hours
    if (startTime < resource.operatingHours.start || endTime > resource.operatingHours.end) {
      return res.status(400).json({ 
        message: `Booking must be within operating hours (${resource.operatingHours.start} - ${resource.operatingHours.end})` 
      });
    }

    const booking = new Booking({
      resourceId,
      resourceName: resource.name,
      resourceType: resource.type,
      date,
      startTime,
      endTime,
      purpose,
      attendees,
      bookedBy: req.user._id,
      contactInfo,
      specialRequirements
    });

    await booking.save();
    await booking.populate('bookedBy', 'name email studentId');
    await booking.populate('resourceId', 'name type location');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only faculty/admin can approve/reject, or user can cancel their own booking
    if (status === 'approved' || status === 'rejected') {
      if (!['faculty', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      booking.approvedBy = req.user._id;
    } else if (status === 'cancelled') {
      if (booking.bookedBy.toString() !== req.user._id.toString() && !['faculty', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    booking.status = status;
    if (rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    await booking.save();
    await booking.populate('bookedBy', 'name email studentId');
    await booking.populate('approvedBy', 'name email');
    await booking.populate('resourceId', 'name type location');

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available resources
router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const { type, capacity, date, startTime, endTime } = req.query;
    let filter = { isAvailable: true };

    if (type) filter.type = type;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };

    let resources = await Resource.find(filter)
      .populate('managedBy', 'name email')
      .sort({ type: 1, name: 1 });

    // If no resources in database, return mock data
    if (resources.length === 0) {
      const mockResources = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Computer Lab 1',
          type: 'lab',
          capacity: 30,
          location: 'Building A, Floor 2',
          description: 'Fully equipped computer lab with latest software',
          amenities: ['30 Computers', 'Projector', 'Whiteboard', 'Air Conditioning'],
          isAvailable: true,
          bookingRules: { maxHours: 4, advanceBookingDays: 7, requiresApproval: true },
          operatingHours: { start: '08:00', end: '18:00' },
          managedBy: { name: 'IT Department', email: 'it@campus.edu' }
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Computer Lab 2',
          type: 'lab',
          capacity: 25,
          location: 'Building A, Floor 3',
          description: 'Computer lab with graphics design software',
          amenities: ['25 Computers', 'Smart Board', 'Projector'],
          isAvailable: true,
          bookingRules: { maxHours: 4, advanceBookingDays: 7, requiresApproval: true },
          operatingHours: { start: '08:00', end: '18:00' },
          managedBy: { name: 'IT Department', email: 'it@campus.edu' }
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'Conference Room A',
          type: 'room',
          capacity: 20,
          location: 'Building B, Floor 1',
          description: 'Modern conference room for meetings and presentations',
          amenities: ['4K Projector', 'Video Conferencing Setup', 'Interactive Whiteboard'],
          isAvailable: true,
          bookingRules: { maxHours: 6, advanceBookingDays: 5, requiresApproval: false },
          operatingHours: { start: '08:00', end: '18:00' },
          managedBy: { name: 'Admin Office', email: 'admin@campus.edu' }
        },
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'Main Auditorium',
          type: 'hall',
          capacity: 200,
          location: 'Building C, Ground Floor',
          description: 'Large auditorium with modern AV equipment',
          amenities: ['Professional Sound System', 'Stage Lighting', 'Large Screen Projector'],
          isAvailable: true,
          bookingRules: { maxHours: 8, advanceBookingDays: 14, requiresApproval: true },
          operatingHours: { start: '08:00', end: '20:00' },
          managedBy: { name: 'Admin', email: 'admin@campus.edu' }
        }
      ];

      resources = mockResources;
    }

    // If date and time provided, filter out resources with conflicts
    if (date && startTime && endTime) {
      const availableResources = [];
      
      for (const resource of resources) {
        const conflictingBooking = await Booking.findOne({
          resourceId: resource._id,
          date,
          status: { $in: ['pending', 'approved'] },
          $or: [
            {
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            }
          ]
        });

        if (!conflictingBooking) {
          availableResources.push(resource);
        }
      }
      
      resources = availableResources;
    }

    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resource details
router.get('/resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findById(id)
      .populate('managedBy', 'name email');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Get upcoming bookings for this resource
    const upcomingBookings = await Booking.find({
      resourceId: id,
      status: { $in: ['pending', 'approved'] },
      date: { $gte: new Date().toISOString().split('T')[0] }
    }).populate('bookedBy', 'name email')
      .sort({ date: 1, startTime: 1 })
      .limit(10);

    res.json({
      resource,
      upcomingBookings
    });
  } catch (error) {
    console.error('Get resource details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking requests (for faculty/admin)
router.get('/requests', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    const bookings = await Booking.find({ status })
      .populate('bookedBy', 'name email studentId')
      .populate('resourceId', 'name type location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get booking requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve booking
router.put('/:id/approve', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not pending approval' });
    }

    booking.status = 'approved';
    booking.approvedBy = req.user._id;
    await booking.save();

    await booking.populate('bookedBy', 'name email studentId');
    await booking.populate('approvedBy', 'name email');
    await booking.populate('resourceId', 'name type location');

    res.json({
      message: 'Booking approved successfully',
      booking
    });
  } catch (error) {
    console.error('Approve booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject booking
router.put('/:id/reject', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not pending approval' });
    }

    booking.status = 'rejected';
    booking.rejectionReason = reason;
    booking.approvedBy = req.user._id;
    await booking.save();

    await booking.populate('bookedBy', 'name email studentId');
    await booking.populate('approvedBy', 'name email');
    await booking.populate('resourceId', 'name type location');

    res.json({
      message: 'Booking rejected successfully',
      booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
