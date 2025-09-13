import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import Timetable from '../models/timetable.js';
import User from '../models/user.js';

const router = express.Router();

// Get personalized timetable
router.get('/timetable', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const timetable = await Timetable.find({ studentId: req.user._id })
      .sort({ day: 1, time: 1 });

    res.json(timetable);
  } catch (error) {
    console.error('Get student timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get enrolled courses
router.get('/courses', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const courses = await Timetable.find({ studentId: req.user._id })
      .distinct('course');

    const courseDetails = await Timetable.aggregate([
      { $match: { studentId: req.user._id } },
      {
        $group: {
          _id: '$course',
          faculty: { $first: '$faculty' },
          credits: { $first: '$credits' },
          courseCode: { $first: '$courseCode' },
          type: { $first: '$type' }
        }
      }
    ]);

    res.json(courseDetails);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get grades (mock data)
router.get('/grades', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const mockGrades = [
      { course: 'Data Structures', courseCode: 'CS201', grade: 'A', credits: 4, semester: 'Fall 2024' },
      { course: 'Database Systems', courseCode: 'CS301', grade: 'B+', credits: 3, semester: 'Fall 2024' },
      { course: 'Web Development', courseCode: 'CS401', grade: 'A-', credits: 3, semester: 'Fall 2024' }
    ];

    res.json(mockGrades);
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance (mock data)
router.get('/attendance', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const mockAttendance = [
      { course: 'Data Structures', attended: 28, total: 30, percentage: 93.3 },
      { course: 'Database Systems', attended: 25, total: 28, percentage: 89.3 },
      { course: 'Web Development', attended: 22, total: 25, percentage: 88.0 }
    ];

    res.json(mockAttendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
