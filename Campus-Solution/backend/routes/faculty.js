import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import Timetable from '../models/timetable.js';
import Booking from '../models/booking.js';

const router = express.Router();

// Get faculty timetable
router.get('/timetable', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const timetable = await Timetable.find({ faculty: req.user.name })
      .populate('studentId', 'name email studentId')
      .sort({ day: 1, time: 1 });

    res.json(timetable);
  } catch (error) {
    console.error('Get faculty timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update timetable
router.put('/timetable', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { timetableEntries } = req.body;
    
    // In production, you'd validate and update multiple entries
    res.json({ message: 'Timetable updated successfully' });
  } catch (error) {
    console.error('Update faculty timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking requests
router.get('/booking-requests', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' })
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
router.put('/booking-requests/:id/approve', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'approved', approvedBy: req.user._id },
      { new: true }
    ).populate('bookedBy', 'name email studentId')
     .populate('resourceId', 'name type location');

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
router.put('/booking-requests/:id/reject', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: 'rejected', 
        rejectionReason: reason,
        approvedBy: req.user._id 
      },
      { new: true }
    ).populate('bookedBy', 'name email studentId')
     .populate('resourceId', 'name type location');

    res.json({
      message: 'Booking rejected successfully',
      booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance for a class
router.get('/attendance/:classId', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Mock attendance data
    const mockAttendance = [
      { studentId: '1', name: 'John Doe', present: true },
      { studentId: '2', name: 'Jane Smith', present: false },
      { studentId: '3', name: 'Bob Johnson', present: true }
    ];

    res.json(mockAttendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance
router.post('/attendance/:classId', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { classId } = req.params;
    const { attendance } = req.body;

    // In production, save attendance to database
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement
router.post('/announcements', authenticateToken, authorizeRoles('faculty'), async (req, res) => {
  try {
    const { title, message, targetClass } = req.body;

    const announcement = {
      id: Date.now().toString(),
      title,
      message,
      targetClass,
      createdBy: req.user.name,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
