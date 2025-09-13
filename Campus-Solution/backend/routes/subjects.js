import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import Subject from '../models/subject.js';
import User from '../models/user.js';

const router = express.Router();

// Get all subjects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { department, semester, academicYear, isActive } = req.query;
    let filter = {};

    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Faculty can only see subjects they're assigned to (unless admin)
    if (req.user.role === 'faculty') {
      filter.assignedFaculty = req.user._id;
    }

    let subjects = await Subject.find(filter)
      .populate('assignedFaculty', 'name email')
      .populate('createdBy', 'name email')
      .sort({ department: 1, semester: 1, code: 1 });

    // If no subjects found in database, return mock subjects for demo
    if (subjects.length === 0) {
      const mockSubjects = [
        // Computer Science
        { _id: 'CS101', name: 'Introduction to Programming', code: 'CS101', credits: 4, department: 'Computer Science', type: 'Core', weeklyHours: 5 },
        { _id: 'CS201', name: 'Data Structures and Algorithms', code: 'CS201', credits: 4, department: 'Computer Science', type: 'Core', weeklyHours: 5 },
        { _id: 'CS301', name: 'Database Management Systems', code: 'CS301', credits: 3, department: 'Computer Science', type: 'Core', weeklyHours: 4 },
        { _id: 'CS302', name: 'Computer Networks', code: 'CS302', credits: 3, department: 'Computer Science', type: 'Core', weeklyHours: 4 },
        { _id: 'CS401', name: 'Software Engineering', code: 'CS401', credits: 4, department: 'Computer Science', type: 'Core', weeklyHours: 5 },
        { _id: 'CS402', name: 'Operating Systems', code: 'CS402', credits: 3, department: 'Computer Science', type: 'Core', weeklyHours: 4 },
        { _id: 'CS501', name: 'Machine Learning', code: 'CS501', credits: 4, department: 'Computer Science', type: 'Elective', weeklyHours: 5 },
        { _id: 'CS502', name: 'Artificial Intelligence', code: 'CS502', credits: 4, department: 'Computer Science', type: 'Elective', weeklyHours: 5 },
        { _id: 'CS503', name: 'Web Development', code: 'CS503', credits: 3, department: 'Computer Science', type: 'Elective', weeklyHours: 4 },
        { _id: 'CS504', name: 'Mobile App Development', code: 'CS504', credits: 3, department: 'Computer Science', type: 'Elective', weeklyHours: 4 },
        { _id: 'CS505', name: 'Cybersecurity', code: 'CS505', credits: 3, department: 'Computer Science', type: 'Elective', weeklyHours: 4 },
        { _id: 'CS506', name: 'Cloud Computing', code: 'CS506', credits: 3, department: 'Computer Science', type: 'Elective', weeklyHours: 4 },
        
        // Mathematics
        { _id: 'MATH101', name: 'Calculus I', code: 'MATH101', credits: 4, department: 'Mathematics', type: 'Core', weeklyHours: 5 },
        { _id: 'MATH201', name: 'Calculus II', code: 'MATH201', credits: 4, department: 'Mathematics', type: 'Core', weeklyHours: 5 },
        { _id: 'MATH301', name: 'Linear Algebra', code: 'MATH301', credits: 3, department: 'Mathematics', type: 'Core', weeklyHours: 4 },
        { _id: 'MATH302', name: 'Discrete Mathematics', code: 'MATH302', credits: 3, department: 'Mathematics', type: 'Core', weeklyHours: 4 },
        { _id: 'MATH401', name: 'Statistics and Probability', code: 'MATH401', credits: 3, department: 'Mathematics', type: 'Core', weeklyHours: 4 },
        { _id: 'MATH501', name: 'Numerical Methods', code: 'MATH501', credits: 3, department: 'Mathematics', type: 'Elective', weeklyHours: 4 },
        
        // Physics
        { _id: 'PHY101', name: 'Physics I - Mechanics', code: 'PHY101', credits: 4, department: 'Physics', type: 'Core', weeklyHours: 5 },
        { _id: 'PHY201', name: 'Physics II - Electricity & Magnetism', code: 'PHY201', credits: 4, department: 'Physics', type: 'Core', weeklyHours: 5 },
        { _id: 'PHY301', name: 'Quantum Physics', code: 'PHY301', credits: 3, department: 'Physics', type: 'Core', weeklyHours: 4 },
        { _id: 'PHY401', name: 'Thermodynamics', code: 'PHY401', credits: 3, department: 'Physics', type: 'Core', weeklyHours: 4 },
        
        // Engineering
        { _id: 'ENG101', name: 'Engineering Drawing', code: 'ENG101', credits: 2, department: 'Engineering', type: 'Core', weeklyHours: 3 },
        { _id: 'ENG201', name: 'Circuit Analysis', code: 'ENG201', credits: 3, department: 'Engineering', type: 'Core', weeklyHours: 4 },
        { _id: 'ENG301', name: 'Digital Electronics', code: 'ENG301', credits: 3, department: 'Engineering', type: 'Core', weeklyHours: 4 },
        { _id: 'ENG401', name: 'Microprocessors', code: 'ENG401', credits: 3, department: 'Engineering', type: 'Core', weeklyHours: 4 },
        { _id: 'ENG501', name: 'VLSI Design', code: 'ENG501', credits: 3, department: 'Engineering', type: 'Elective', weeklyHours: 4 },
        
        // Labs
        { _id: 'LAB201', name: 'Programming Lab', code: 'LAB201', credits: 2, department: 'Computer Science', type: 'Lab', weeklyHours: 3 },
        { _id: 'LAB301', name: 'Database Lab', code: 'LAB301', credits: 2, department: 'Computer Science', type: 'Lab', weeklyHours: 3 },
        { _id: 'LAB401', name: 'Network Lab', code: 'LAB401', credits: 2, department: 'Computer Science', type: 'Lab', weeklyHours: 3 },
        { _id: 'LAB501', name: 'AI/ML Lab', code: 'LAB501', credits: 2, department: 'Computer Science', type: 'Lab', weeklyHours: 3 },
      ];
      
      // Apply filters to mock data
      subjects = mockSubjects.filter(subject => {
        if (department && subject.department !== department) return false;
        return true;
      });
    }

    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subject by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('assignedFaculty', 'name email role')
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check access permissions
    if (req.user.role === 'faculty' && !subject.canBeTeachedBy(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new subject (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      department,
      semester,
      credits,
      weeklyHours,
      lectureHours,
      labHours,
      tutorialHours,
      type,
      category,
      prerequisites,
      maxStudents,
      minStudents,
      assignedFaculty,
      syllabus,
      objectives,
      outcomes,
      assessmentPattern,
      academicYear
    } = req.body;

    // Validate that assigned faculty exist and have faculty role
    if (assignedFaculty && assignedFaculty.length > 0) {
      const faculty = await User.find({
        _id: { $in: assignedFaculty },
        role: 'faculty'
      });
      
      if (faculty.length !== assignedFaculty.length) {
        return res.status(400).json({ message: 'Invalid faculty assignment' });
      }
    }

    const subject = new Subject({
      name,
      code: code.toUpperCase(),
      description,
      department,
      semester,
      credits,
      weeklyHours,
      lectureHours: lectureHours || 0,
      labHours: labHours || 0,
      tutorialHours: tutorialHours || 0,
      type,
      category,
      prerequisites: prerequisites || [],
      maxStudents,
      minStudents,
      assignedFaculty: assignedFaculty || [],
      syllabus,
      objectives: objectives || [],
      outcomes: outcomes || [],
      assessmentPattern,
      academicYear,
      createdBy: req.user._id
    });

    await subject.save();
    await subject.populate('assignedFaculty', 'name email');

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Subject code already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update subject (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updates = { ...req.body };
    updates.lastModifiedBy = req.user._id;
    
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    // Validate assigned faculty if provided
    if (updates.assignedFaculty && updates.assignedFaculty.length > 0) {
      const faculty = await User.find({
        _id: { $in: updates.assignedFaculty },
        role: 'faculty'
      });
      
      if (faculty.length !== updates.assignedFaculty.length) {
        return res.status(400).json({ message: 'Invalid faculty assignment' });
      }
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedFaculty', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Subject code already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete subject (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign faculty to subject (Admin only)
router.post('/:id/assign-faculty', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { facultyIds } = req.body;
    
    // Validate faculty
    const faculty = await User.find({
      _id: { $in: facultyIds },
      role: 'faculty'
    });
    
    if (faculty.length !== facultyIds.length) {
      return res.status(400).json({ message: 'Invalid faculty IDs provided' });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { 
        assignedFaculty: facultyIds,
        lastModifiedBy: req.user._id
      },
      { new: true }
    ).populate('assignedFaculty', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      message: 'Faculty assigned successfully',
      subject
    });
  } catch (error) {
    console.error('Assign faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subjects by department
router.get('/department/:department', authenticateToken, async (req, res) => {
  try {
    const { department } = req.params;
    const { semester, academicYear } = req.query;
    
    let filter = { department, isActive: true };
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;

    const subjects = await Subject.find(filter)
      .populate('assignedFaculty', 'name email')
      .sort({ semester: 1, code: 1 });

    res.json(subjects);
  } catch (error) {
    console.error('Get subjects by department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available faculty for assignment
router.get('/faculty/available', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('name email')
      .sort({ name: 1 });

    res.json(faculty);
  } catch (error) {
    console.error('Get available faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
