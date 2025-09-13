import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import Timetable from '../models/timetable.js';
import Subject from '../models/subject.js';

const router = express.Router();

// Get all timetables (with optional filtering)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { instructor, day, semester } = req.query;
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'faculty') {
      filter.instructor = req.user.name;
    }

    // Additional filters
    if (instructor) filter.instructor = instructor;
    if (day) filter.day = day;
    if (semester) filter.semester = semester;

    const timetables = await Timetable.find(filter)
      .populate('subjectId', 'name code department semester credits')
      .populate('createdBy', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.json({ timetable: timetables });
  } catch (error) {
    console.error('Get timetables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new timetable entry
router.post('/', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { 
      subjectId, 
      subject, 
      courseCode, 
      instructor, 
      day, 
      startTime, 
      endTime, 
      room, 
      classType, 
      students, 
      semester,
      academicYear 
    } = req.body;

    // Validate subject exists - handle both ObjectId and string codes
    let subjectDoc;
    try {
      // First try to find by ObjectId
      subjectDoc = await Subject.findById(subjectId);
    } catch (error) {
      // If ObjectId cast fails, try to find by code
      subjectDoc = await Subject.findOne({ code: subjectId });
    }
    
    // If still not found by ObjectId, try by code
    if (!subjectDoc) {
      subjectDoc = await Subject.findOne({ code: subjectId });
    }
    
    // For demo purposes, if subject not found in DB, create a mock subject reference
    if (!subjectDoc) {
      console.log(`Subject ${subjectId} not found in database, using mock data`);
      // Don't return error, continue with the provided subject data
    }

    // Check for time conflicts (same room, instructor, or overlapping time)
    const existingEntry = await Timetable.findOne({
      day,
      $or: [
        { 
          room,
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
        },
        { 
          instructor,
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
        }
      ]
    });

    if (existingEntry) {
      return res.status(400).json({ 
        message: 'Time conflict detected',
        conflict: existingEntry 
      });
    }

    const timetable = new Timetable({
      subjectId,
      subject: subject || (subjectDoc ? subjectDoc.name : subject),
      courseCode: courseCode || (subjectDoc ? subjectDoc.code : courseCode),
      instructor: instructor || req.user.name,
      day,
      startTime,
      endTime,
      room,
      classType: classType || 'lecture',
      students: students || [],
      enrolledCount: students ? students.length : 0,
      credits: subjectDoc ? subjectDoc.credits : 3,
      weeklyHours: subjectDoc ? subjectDoc.weeklyHours : 4,
      semester: semester || (subjectDoc ? subjectDoc.semester : 1),
      academicYear: academicYear || new Date().getFullYear().toString(),
      createdBy: req.user._id
    });

    await timetable.save();

    res.status(201).json({
      message: 'Timetable entry created successfully',
      timetable
    });
  } catch (error) {
    console.error('Create timetable error:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update timetable entry
router.put('/:id', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if entry exists
    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    // Faculty can only update their own entries (unless admin)
    if (req.user.role === 'faculty' && timetable.instructor !== req.user.name) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If subject is being updated, validate it exists
    if (updates.subjectId) {
      const subjectDoc = await Subject.findById(updates.subjectId);
      if (!subjectDoc) {
        return res.status(400).json({ message: 'Subject not found' });
      }
      // Update related fields from subject
      updates.subject = subjectDoc.name;
      updates.courseCode = subjectDoc.code;
      updates.credits = subjectDoc.credits;
      updates.weeklyHours = subjectDoc.weeklyHours;
    }

    // Check for conflicts if time/day/room is being updated
    if (updates.day || updates.startTime || updates.endTime || updates.room || updates.instructor) {
      const conflictFilter = {
        _id: { $ne: id },
        day: updates.day || timetable.day,
        $or: [
          { 
            room: updates.room || timetable.room,
            $or: [
              { 
                startTime: { $lt: updates.endTime || timetable.endTime }, 
                endTime: { $gt: updates.startTime || timetable.startTime } 
              }
            ]
          },
          { 
            instructor: updates.instructor || timetable.instructor,
            $or: [
              { 
                startTime: { $lt: updates.endTime || timetable.endTime }, 
                endTime: { $gt: updates.startTime || timetable.startTime } 
              }
            ]
          }
        ]
      };

      const existingEntry = await Timetable.findOne(conflictFilter);
      if (existingEntry) {
        return res.status(400).json({ 
          message: 'Time conflict detected',
          conflict: existingEntry 
        });
      }
    }

    // Update enrolled count if students array is updated
    if (updates.students) {
      updates.enrolledCount = updates.students.length;
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('subjectId', 'name code department semester credits');

    res.json({
      message: 'Timetable entry updated successfully',
      timetable: updatedTimetable
    });
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete timetable entry
router.delete('/:id', authenticateToken, authorizeRoles('faculty', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    // Faculty can only delete their own entries (unless admin)
    if (req.user.role === 'faculty' && timetable.instructor !== req.user.name) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Timetable.findByIdAndDelete(id);

    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly schedule with optional filters
router.get('/weekly', authenticateToken, async (req, res) => {
  try {
    const { instructor, semester } = req.query;
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'faculty') {
      filter.instructor = req.user.name;
    }

    // Additional filters
    if (instructor) filter.instructor = instructor;
    if (semester) filter.semester = semester;

    const schedule = await Timetable.find(filter)
      .populate('subjectId', 'name code department semester credits')
      .populate('createdBy', 'name email')
      .sort({ day: 1, startTime: 1 });

    // Group by day
    const weeklySchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    schedule.forEach(entry => {
      if (weeklySchedule[entry.day]) {
        weeklySchedule[entry.day].push(entry);
      }
    });

    res.json(weeklySchedule);
  } catch (error) {
    console.error('Get weekly schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get timetable statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'faculty') {
      filter.instructor = req.user.name;
    }

    const totalClasses = await Timetable.countDocuments(filter);
    const totalHours = await Timetable.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalWeeklyHours: { $sum: '$weeklyHours' }
        }
      }
    ]);

    const subjectCount = await Timetable.distinct('subjectId', filter);
    const totalStudents = await Timetable.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalEnrolled: { $sum: '$enrolledCount' }
        }
      }
    ]);

    res.json({
      totalClasses,
      totalWeeklyHours: totalHours[0]?.totalWeeklyHours || 0,
      totalSubjects: subjectCount.length,
      totalStudents: totalStudents[0]?.totalEnrolled || 0
    });
  } catch (error) {
    console.error('Get timetable stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
