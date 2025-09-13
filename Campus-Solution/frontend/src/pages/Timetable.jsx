import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { timetableAPI, subjectsAPI } from '../utils/api';
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';

export default function Timetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    subjectId: '',
    subject: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    instructor: '',
    students: [], // For faculty - list of enrolled students
    courseCode: '', // Course identifier
    classType: 'lecture', // lecture, lab, tutorial
    credits: 0,
    weeklyHours: 0,
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const currentDay = days[today.getDay() - 1] || 'Monday'; // Adjust for Sunday = 0
  
  // 8-hour schedule with breaks: 3hr + 15min break + 3hr + 10min break + 2hr
  const timeSlots = [
    { time: '09:00', type: 'class', label: '09:00 - 10:00' },
    { time: '10:00', type: 'class', label: '10:00 - 11:00' },
    { time: '11:00', type: 'class', label: '11:00 - 12:00' },
    { time: '12:00', type: 'break', label: '12:00 - 12:15 (Break)', duration: 15 },
    { time: '12:15', type: 'class', label: '12:15 - 13:15' },
    { time: '13:15', type: 'class', label: '13:15 - 14:15' },
    { time: '14:15', type: 'class', label: '14:15 - 15:15' },
    { time: '15:15', type: 'break', label: '15:15 - 15:25 (Break)', duration: 10 },
    { time: '15:25', type: 'class', label: '15:25 - 16:25' },
    { time: '16:25', type: 'class', label: '16:25 - 17:25' },
  ];

  // Comprehensive subject list for admin timetable creation
  const availableSubjects = [
    // Computer Science
    { id: 'CS101', name: 'Introduction to Programming', code: 'CS101', credits: 4, department: 'Computer Science', type: 'Core' },
    { id: 'CS201', name: 'Data Structures and Algorithms', code: 'CS201', credits: 4, department: 'Computer Science', type: 'Core' },
    { id: 'CS301', name: 'Database Management Systems', code: 'CS301', credits: 3, department: 'Computer Science', type: 'Core' },
    { id: 'CS302', name: 'Computer Networks', code: 'CS302', credits: 3, department: 'Computer Science', type: 'Core' },
    { id: 'CS401', name: 'Software Engineering', code: 'CS401', credits: 4, department: 'Computer Science', type: 'Core' },
    { id: 'CS402', name: 'Operating Systems', code: 'CS402', credits: 3, department: 'Computer Science', type: 'Core' },
    { id: 'CS501', name: 'Machine Learning', code: 'CS501', credits: 4, department: 'Computer Science', type: 'Elective' },
    { id: 'CS502', name: 'Artificial Intelligence', code: 'CS502', credits: 4, department: 'Computer Science', type: 'Elective' },
    { id: 'CS503', name: 'Web Development', code: 'CS503', credits: 3, department: 'Computer Science', type: 'Elective' },
    { id: 'CS504', name: 'Mobile App Development', code: 'CS504', credits: 3, department: 'Computer Science', type: 'Elective' },
    { id: 'CS505', name: 'Cybersecurity', code: 'CS505', credits: 3, department: 'Computer Science', type: 'Elective' },
    { id: 'CS506', name: 'Cloud Computing', code: 'CS506', credits: 3, department: 'Computer Science', type: 'Elective' },
    
    // Mathematics
    { id: 'MATH101', name: 'Calculus I', code: 'MATH101', credits: 4, department: 'Mathematics', type: 'Core' },
    { id: 'MATH201', name: 'Calculus II', code: 'MATH201', credits: 4, department: 'Mathematics', type: 'Core' },
    { id: 'MATH301', name: 'Linear Algebra', code: 'MATH301', credits: 3, department: 'Mathematics', type: 'Core' },
    { id: 'MATH302', name: 'Discrete Mathematics', code: 'MATH302', credits: 3, department: 'Mathematics', type: 'Core' },
    { id: 'MATH401', name: 'Statistics and Probability', code: 'MATH401', credits: 3, department: 'Mathematics', type: 'Core' },
    { id: 'MATH501', name: 'Numerical Methods', code: 'MATH501', credits: 3, department: 'Mathematics', type: 'Elective' },
    
    // Physics
    { id: 'PHY101', name: 'Physics I - Mechanics', code: 'PHY101', credits: 4, department: 'Physics', type: 'Core' },
    { id: 'PHY201', name: 'Physics II - Electricity & Magnetism', code: 'PHY201', credits: 4, department: 'Physics', type: 'Core' },
    { id: 'PHY301', name: 'Quantum Physics', code: 'PHY301', credits: 3, department: 'Physics', type: 'Core' },
    { id: 'PHY401', name: 'Thermodynamics', code: 'PHY401', credits: 3, department: 'Physics', type: 'Core' },
    
    // Engineering
    { id: 'ENG101', name: 'Engineering Drawing', code: 'ENG101', credits: 2, department: 'Engineering', type: 'Core' },
    { id: 'ENG201', name: 'Circuit Analysis', code: 'ENG201', credits: 3, department: 'Engineering', type: 'Core' },
    { id: 'ENG301', name: 'Digital Electronics', code: 'ENG301', credits: 3, department: 'Engineering', type: 'Core' },
    { id: 'ENG401', name: 'Microprocessors', code: 'ENG401', credits: 3, department: 'Engineering', type: 'Core' },
    { id: 'ENG501', name: 'VLSI Design', code: 'ENG501', credits: 3, department: 'Engineering', type: 'Elective' },
    
    // Business & Management
    { id: 'BUS101', name: 'Principles of Management', code: 'BUS101', credits: 3, department: 'Business', type: 'Core' },
    { id: 'BUS201', name: 'Financial Accounting', code: 'BUS201', credits: 3, department: 'Business', type: 'Core' },
    { id: 'BUS301', name: 'Marketing Management', code: 'BUS301', credits: 3, department: 'Business', type: 'Core' },
    { id: 'BUS401', name: 'Operations Research', code: 'BUS401', credits: 3, department: 'Business', type: 'Core' },
    { id: 'BUS501', name: 'Entrepreneurship', code: 'BUS501', credits: 3, department: 'Business', type: 'Elective' },
    
    // Languages & Communication
    { id: 'ENG001', name: 'English Communication', code: 'ENG001', credits: 2, department: 'Languages', type: 'Core' },
    { id: 'ENG002', name: 'Technical Writing', code: 'ENG002', credits: 2, department: 'Languages', type: 'Core' },
    { id: 'ENG003', name: 'Business Communication', code: 'ENG003', credits: 2, department: 'Languages', type: 'Elective' },
    
    // Research & Projects
    { id: 'RES401', name: 'Research Methodology', code: 'RES401', credits: 2, department: 'Research', type: 'Core' },
    { id: 'PRJ501', name: 'Capstone Project I', code: 'PRJ501', credits: 4, department: 'Projects', type: 'Core' },
    { id: 'PRJ502', name: 'Capstone Project II', code: 'PRJ502', credits: 4, department: 'Projects', type: 'Core' },
    
    // Labs
    { id: 'LAB201', name: 'Programming Lab', code: 'LAB201', credits: 2, department: 'Computer Science', type: 'Lab' },
    { id: 'LAB301', name: 'Database Lab', code: 'LAB301', credits: 2, department: 'Computer Science', type: 'Lab' },
    { id: 'LAB401', name: 'Network Lab', code: 'LAB401', credits: 2, department: 'Computer Science', type: 'Lab' },
    { id: 'LAB501', name: 'AI/ML Lab', code: 'LAB501', credits: 2, department: 'Computer Science', type: 'Lab' },
    { id: 'LAB101', name: 'Physics Lab', code: 'LAB101', credits: 2, department: 'Physics', type: 'Lab' },
    { id: 'LAB102', name: 'Electronics Lab', code: 'LAB102', credits: 2, department: 'Engineering', type: 'Lab' },
  ];

  useEffect(() => {
    fetchTimetable();
    fetchSubjects();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      let data;
      if (user?.role === 'faculty') {
        // Faculty sees only classes assigned to them by admin
        data = await timetableAPI.getByInstructor(user.name || user.email);
      } else if (user?.role === 'student') {
        // Students see their enrolled classes
        data = await timetableAPI.getByStudent(user._id);
      } else {
        // Admin sees all timetables
        data = await timetableAPI.getAll();
      }
      
      // Set real-time data if available
      if (data && data.timetable && data.timetable.length > 0) {
        setTimetable(data.timetable);
      } else {
        // Use role-based mock data as fallback
        setTimetable(getRoleBasedMockData());
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // Use role-based mock data as fallback
      setTimetable(getRoleBasedMockData());
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedMockData = () => {
    // Comprehensive admin-created timetable that all roles can see
    const adminCreatedTimetable = [
      // Monday Schedule
      {
        _id: '1',
        subject: 'Data Structures and Algorithms',
        courseCode: 'CS301',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room A-101',
        instructor: 'Dr. Sarah Wilson',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Alice Brown', 'Bob Wilson'],
        enrolledCount: 45,
      },
      {
        _id: '2',
        subject: 'Linear Algebra',
        courseCode: 'MATH301',
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room B-205',
        instructor: 'Prof. David Martinez',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['Carol White', 'David Lee', 'Emma Clark', 'Frank Miller'],
        enrolledCount: 38,
      },
      {
        _id: '3',
        subject: 'Programming Lab',
        courseCode: 'LAB201',
        day: 'Monday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'Lab C-301',
        instructor: 'Dr. Sarah Wilson',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        enrolledCount: 25,
      },
      {
        _id: '4',
        subject: 'English Communication',
        courseCode: 'ENG001',
        day: 'Monday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Room D-102',
        instructor: 'Prof. Jennifer Adams',
        type: 'lecture',
        credits: 2,
        weeklyHours: 2,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Languages',
        students: ['All CS Students'],
        enrolledCount: 60,
      },

      // Tuesday Schedule
      {
        _id: '5',
        subject: 'Database Management Systems',
        courseCode: 'CS401',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room A-101',
        instructor: 'Prof. Michael Chen',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Grace Taylor', 'Henry Davis', 'Ivy Johnson', 'Jack Brown'],
        enrolledCount: 42,
      },
      {
        _id: '6',
        subject: 'Statistics and Probability',
        courseCode: 'MATH401',
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room B-205',
        instructor: 'Dr. Rachel Green',
        type: 'lecture',
        credits: 3,
        weeklyHours: 3,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['Kate Wilson', 'Liam Smith', 'Mia Jones', 'Noah Garcia'],
        enrolledCount: 35,
      },
      {
        _id: '7',
        subject: 'Database Lab',
        courseCode: 'LAB301',
        day: 'Tuesday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'Lab B-201',
        instructor: 'Prof. Michael Chen',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Grace Taylor', 'Henry Davis', 'Ivy Johnson'],
        enrolledCount: 20,
      },
      {
        _id: '8',
        subject: 'Circuit Analysis',
        courseCode: 'ENG201',
        day: 'Tuesday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Room E-301',
        instructor: 'Dr. Thomas Brown',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['Oliver Martinez', 'Penny Rodriguez', 'Quinn Lewis'],
        enrolledCount: 28,
      },

      // Wednesday Schedule
      {
        _id: '9',
        subject: 'Software Engineering',
        courseCode: 'CS501',
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room A-101',
        instructor: 'Dr. Priya Sharma',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Ruby Walker', 'Sam Hall', 'Tina Allen', 'Uma Young'],
        enrolledCount: 40,
      },
      {
        _id: '10',
        subject: 'Computer Networks',
        courseCode: 'CS302',
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room C-201',
        instructor: 'Dr. Kevin Liu',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Victor King', 'Wendy Clark', 'Xavier Davis'],
        enrolledCount: 35,
      },
      {
        _id: '11',
        subject: 'Physics Lab',
        courseCode: 'LAB101',
        day: 'Wednesday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'Physics Lab',
        instructor: 'Dr. Amanda Foster',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Physics',
        students: ['Yara Johnson', 'Zack Miller', 'Amy Wilson'],
        enrolledCount: 22,
      },
      {
        _id: '12',
        subject: 'Technical Writing',
        courseCode: 'ENG002',
        day: 'Wednesday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Room D-102',
        instructor: 'Prof. Jennifer Adams',
        type: 'lecture',
        credits: 2,
        weeklyHours: 2,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Languages',
        students: ['Ben Taylor', 'Chloe Anderson', 'Dan Roberts'],
        enrolledCount: 30,
      },

      // Thursday Schedule
      {
        _id: '13',
        subject: 'Machine Learning',
        courseCode: 'CS601',
        day: 'Thursday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room A-101',
        instructor: 'Dr. Robert Kumar',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Eva Martinez', 'Felix Johnson', 'Grace Kim'],
        enrolledCount: 32,
      },
      {
        _id: '14',
        subject: 'Operating Systems',
        courseCode: 'CS402',
        day: 'Thursday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room C-201',
        instructor: 'Dr. Steven Park',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Hannah Lee', 'Ian Brown', 'Julia Davis'],
        enrolledCount: 38,
      },
      {
        _id: '15',
        subject: 'AI/ML Lab',
        courseCode: 'LAB501',
        day: 'Thursday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'AI Lab',
        instructor: 'Dr. Robert Kumar',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Eva Martinez', 'Felix Johnson', 'Grace Kim'],
        enrolledCount: 18,
      },
      {
        _id: '16',
        subject: 'Digital Electronics',
        courseCode: 'ENG301',
        day: 'Thursday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Room E-301',
        instructor: 'Dr. Thomas Brown',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['Kyle Wilson', 'Luna Garcia', 'Max Johnson'],
        enrolledCount: 25,
      },

      // Friday Schedule
      {
        _id: '17',
        subject: 'Network Security',
        courseCode: 'CS701',
        day: 'Friday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room A-101',
        instructor: 'Dr. Lisa Anderson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Nina Smith', 'Oscar Brown', 'Paula Davis'],
        enrolledCount: 28,
      },
      {
        _id: '18',
        subject: 'Web Development',
        courseCode: 'CS503',
        day: 'Friday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room C-201',
        instructor: 'Prof. Alex Thompson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Quinn Martinez', 'Ryan Lee', 'Sofia Wilson'],
        enrolledCount: 30,
      },
      {
        _id: '19',
        subject: 'Research Methodology',
        courseCode: 'RES401',
        day: 'Friday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'Room F-205',
        instructor: 'Dr. Maria Rodriguez',
        type: 'seminar',
        credits: 2,
        weeklyHours: 2,
        classType: 'seminar',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Research',
        students: ['Tom Anderson', 'Ursula Clark', 'Victor Kim'],
        enrolledCount: 15,
      },
      {
        _id: '20',
        subject: 'Network Lab',
        courseCode: 'LAB401',
        day: 'Friday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Network Lab',
        instructor: 'Dr. Kevin Liu',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Walter Brown', 'Xara Johnson', 'Yuki Davis'],
        enrolledCount: 20,
      },

      // Additional Monday Classes
      {
        _id: '21',
        subject: 'Physics I - Mechanics',
        courseCode: 'PHY101',
        day: 'Monday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room F-301',
        instructor: 'Dr. Amanda Foster',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Physics',
        students: ['All Engineering Students'],
        enrolledCount: 50,
      },
      {
        _id: '22',
        subject: 'Principles of Management',
        courseCode: 'BUS101',
        day: 'Monday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'Room G-201',
        instructor: 'Prof. James Wilson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 3,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Business',
        students: ['Business Students'],
        enrolledCount: 35,
      },
      {
        _id: '23',
        subject: 'Discrete Mathematics',
        courseCode: 'MATH302',
        day: 'Monday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Room B-205',
        instructor: 'Prof. David Martinez',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['CS & Math Students'],
        enrolledCount: 40,
      },
      {
        _id: '24',
        subject: 'Engineering Drawing',
        courseCode: 'ENG101',
        day: 'Monday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'Drawing Hall',
        instructor: 'Prof. Susan Lee',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['First Year Engineering'],
        enrolledCount: 45,
      },

      // Additional Tuesday Classes
      {
        _id: '25',
        subject: 'Calculus I',
        courseCode: 'MATH101',
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room B-205',
        instructor: 'Dr. Rachel Green',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['First Year Students'],
        enrolledCount: 60,
      },
      {
        _id: '26',
        subject: 'Introduction to Programming',
        courseCode: 'CS101',
        day: 'Tuesday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'Room A-101',
        instructor: 'Dr. Sarah Wilson',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['First Year CS Students'],
        enrolledCount: 55,
      },
      {
        _id: '27',
        subject: 'Financial Accounting',
        courseCode: 'BUS201',
        day: 'Tuesday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Room G-201',
        instructor: 'Prof. James Wilson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Business',
        students: ['Business & Management Students'],
        enrolledCount: 30,
      },
      {
        _id: '28',
        subject: 'Electronics Lab',
        courseCode: 'LAB102',
        day: 'Tuesday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'Electronics Lab',
        instructor: 'Dr. Thomas Brown',
        type: 'lab',
        credits: 2,
        weeklyHours: 3,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['Electronics Engineering'],
        enrolledCount: 25,
      },

      // Additional Wednesday Classes
      {
        _id: '29',
        subject: 'Calculus II',
        courseCode: 'MATH201',
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room B-205',
        instructor: 'Dr. Rachel Green',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['Second Year Students'],
        enrolledCount: 45,
      },
      {
        _id: '30',
        subject: 'Marketing Management',
        courseCode: 'BUS301',
        day: 'Wednesday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'Room G-201',
        instructor: 'Prof. Jennifer Adams',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Business',
        students: ['Marketing Students'],
        enrolledCount: 28,
      },
      {
        _id: '31',
        subject: 'Microprocessors',
        courseCode: 'ENG401',
        day: 'Wednesday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Room E-301',
        instructor: 'Dr. Steven Park',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['Electronics & CS Students'],
        enrolledCount: 32,
      },
      {
        _id: '32',
        subject: 'Numerical Methods',
        courseCode: 'MATH501',
        day: 'Wednesday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'Computer Lab 2',
        instructor: 'Prof. David Martinez',
        type: 'lab',
        credits: 3,
        weeklyHours: 4,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['Advanced Math Students'],
        enrolledCount: 20,
      },

      // Additional Thursday Classes
      {
        _id: '33',
        subject: 'Physics II - Electricity & Magnetism',
        courseCode: 'PHY201',
        day: 'Thursday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room F-301',
        instructor: 'Dr. Amanda Foster',
        type: 'lecture',
        credits: 4,
        weeklyHours: 5,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Physics',
        students: ['Second Year Physics'],
        enrolledCount: 40,
      },
      {
        _id: '34',
        subject: 'Cybersecurity',
        courseCode: 'CS505',
        day: 'Thursday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'Room A-101',
        instructor: 'Dr. Lisa Anderson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Advanced CS Students'],
        enrolledCount: 25,
      },
      {
        _id: '35',
        subject: 'Operations Research',
        courseCode: 'BUS401',
        day: 'Thursday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Room G-201',
        instructor: 'Prof. James Wilson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Business',
        students: ['Business Analytics Students'],
        enrolledCount: 22,
      },
      {
        _id: '36',
        subject: 'VLSI Design',
        courseCode: 'ENG501',
        day: 'Thursday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'VLSI Lab',
        instructor: 'Dr. Kevin Liu',
        type: 'lab',
        credits: 3,
        weeklyHours: 4,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Engineering',
        students: ['Advanced Electronics'],
        enrolledCount: 15,
      },

      // Additional Friday Classes
      {
        _id: '37',
        subject: 'Mobile App Development',
        courseCode: 'CS504',
        day: 'Friday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room C-201',
        instructor: 'Prof. Alex Thompson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Mobile Dev Students'],
        enrolledCount: 28,
      },
      {
        _id: '38',
        subject: 'Quantum Physics',
        courseCode: 'PHY301',
        day: 'Friday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'Room F-301',
        instructor: 'Dr. Amanda Foster',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Physics',
        students: ['Advanced Physics Students'],
        enrolledCount: 18,
      },
      {
        _id: '39',
        subject: 'Business Communication',
        courseCode: 'ENG003',
        day: 'Friday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Room D-102',
        instructor: 'Prof. Jennifer Adams',
        type: 'lecture',
        credits: 2,
        weeklyHours: 2,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Languages',
        students: ['Business Students'],
        enrolledCount: 35,
      },
      {
        _id: '40',
        subject: 'Capstone Project I',
        courseCode: 'PRJ501',
        day: 'Friday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'Project Lab',
        instructor: 'Dr. Maria Rodriguez',
        type: 'seminar',
        credits: 4,
        weeklyHours: 6,
        classType: 'seminar',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Projects',
        students: ['Final Year Students'],
        enrolledCount: 20,
      },

      // Saturday Schedule (Optional/Electives)
      {
        _id: '41',
        subject: 'Entrepreneurship',
        courseCode: 'BUS501',
        day: 'Saturday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Room B-205',
        instructor: 'Prof. James Wilson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 3,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Business',
        students: ['Entrepreneurship Students'],
        enrolledCount: 22,
      },
      {
        _id: '42',
        subject: 'Cloud Computing',
        courseCode: 'CS506',
        day: 'Saturday',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Room C-201',
        instructor: 'Dr. Sarah Wilson',
        type: 'lecture',
        credits: 3,
        weeklyHours: 3,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['Cloud Computing Students'],
        enrolledCount: 18,
      },
      {
        _id: '43',
        subject: 'Thermodynamics',
        courseCode: 'PHY401',
        day: 'Saturday',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room F-301',
        instructor: 'Dr. Amanda Foster',
        type: 'lecture',
        credits: 3,
        weeklyHours: 4,
        classType: 'lecture',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Physics',
        students: ['Mechanical Engineering'],
        enrolledCount: 25,
      },
      {
        _id: '44',
        subject: 'Artificial Intelligence',
        courseCode: 'CS502',
        day: 'Saturday',
        startTime: '12:15',
        endTime: '13:15',
        room: 'AI Lab',
        instructor: 'Dr. Robert Kumar',
        type: 'lab',
        credits: 4,
        weeklyHours: 5,
        classType: 'lab',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Computer Science',
        students: ['AI Specialization'],
        enrolledCount: 20,
      },
      {
        _id: '45',
        subject: 'Capstone Project II',
        courseCode: 'PRJ502',
        day: 'Saturday',
        startTime: '13:15',
        endTime: '14:15',
        room: 'Project Lab',
        instructor: 'Dr. Maria Rodriguez',
        type: 'seminar',
        credits: 4,
        weeklyHours: 6,
        classType: 'seminar',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Projects',
        students: ['Final Year Students'],
        enrolledCount: 20,
      },
      {
        _id: '46',
        subject: 'Advanced Mathematics Workshop',
        courseCode: 'MATH601',
        day: 'Saturday',
        startTime: '14:15',
        endTime: '15:15',
        room: 'Room B-205',
        instructor: 'Prof. David Martinez',
        type: 'tutorial',
        credits: 2,
        weeklyHours: 2,
        classType: 'tutorial',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Mathematics',
        students: ['Advanced Math Students'],
        enrolledCount: 15,
      },
      {
        _id: '47',
        subject: 'Industry Mentorship Program',
        courseCode: 'IND501',
        day: 'Saturday',
        startTime: '15:25',
        endTime: '16:25',
        room: 'Conference Hall',
        instructor: 'Industry Experts',
        type: 'seminar',
        credits: 2,
        weeklyHours: 2,
        classType: 'seminar',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Industry Relations',
        students: ['All Final Year Students'],
        enrolledCount: 50,
      },
      {
        _id: '48',
        subject: 'Career Development Workshop',
        courseCode: 'CAR101',
        day: 'Saturday',
        startTime: '16:25',
        endTime: '17:25',
        room: 'Auditorium',
        instructor: 'Career Counselors',
        type: 'seminar',
        credits: 1,
        weeklyHours: 1,
        classType: 'seminar',
        createdBy: 'admin',
        semester: 'Fall 2024',
        department: 'Career Services',
        students: ['All Students'],
        enrolledCount: 100,
      }
    ];

    let mockData = [];
    
    if (user?.role === 'student') {
      // Students see classes they're enrolled in from admin-created timetable
      const studentName = user?.name || user?.email || 'Student';
      mockData = adminCreatedTimetable.filter(cls => {
        // Show classes where student is enrolled or general classes
        return cls.students.some(student => 
          student.toLowerCase().includes('john') || 
          student.toLowerCase().includes('jane') ||
          student.toLowerCase().includes('all')
        ) || cls.department === 'Computer Science';
      });
    } else if (user?.role === 'faculty') {
        // Faculty see classes assigned to them by admin
        const facultyName = user?.name || user?.email || 'Dr. Sarah Wilson';
        mockData = adminCreatedTimetable.filter(cls => 
          cls.instructor === facultyName || 
          cls.instructor.includes('Sarah') ||
          cls.instructor.includes('Wilson')
        ).map(cls => ({
          ...cls,
          assignedBy: 'admin',
          assignedDate: '2024-09-01'
        }));
        
        // If no specific matches, show sample faculty classes
        if (mockData.length === 0) {
          mockData = adminCreatedTimetable.slice(0, 5).map(cls => ({
            ...cls,
            instructor: facultyName,
            assignedBy: 'admin',
            assignedDate: '2024-09-01'
          }));
        }
    } else {
        // Admin sees all timetables for management
        mockData = adminCreatedTimetable;
    }
    
    return mockData;
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectsAPI.getAll();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await timetableAPI.update(editingClass._id, formData);
      } else {
        await timetableAPI.create(formData);
      }
      fetchTimetable();
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await timetableAPI.delete(id);
        fetchTimetable();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subjectId: '',
      subject: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      room: '',
      instructor: '',
      students: [],
      courseCode: '',
      classType: 'lecture',
      credits: 0,
      weeklyHours: 0,
    });
    setShowAddForm(false);
    setEditingClass(null);
  };

  const handleSubjectChange = (subjectId) => {
    // Check both API subjects and availableSubjects
    const allSubjects = subjects.length > 0 ? subjects : availableSubjects;
    const selectedSubject = allSubjects.find(s => (s._id || s.id) === subjectId);
    if (selectedSubject) {
      setFormData({
        ...formData,
        subjectId,
        subject: selectedSubject.name,
        courseCode: selectedSubject.code,
        credits: selectedSubject.credits || 0,
        weeklyHours: selectedSubject.weeklyHours || 0,
        instructor: selectedSubject.instructor || formData.instructor,
      });
    }
  };

  const startEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      subjectId: classItem.subjectId || '',
      subject: classItem.subject,
      day: classItem.day,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      room: classItem.room,
      instructor: classItem.instructor,
      students: classItem.students || [],
      courseCode: classItem.courseCode || '',
      classType: classItem.classType || classItem.type || 'lecture',
      credits: classItem.credits || 0,
      weeklyHours: classItem.weeklyHours || 0,
    });
    setShowAddForm(true);
  };

  const getClassesForDay = (day) => {
    return timetable.filter(cls => cls.day === day).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const todayClasses = getClassesForDay(currentDay);
    
    return todayClasses.find(cls => cls.startTime > currentTime) || 
           (todayClasses.length > 0 ? todayClasses[0] : null);
  };

  const getTodayClasses = () => {
    return getClassesForDay(currentDay);
  };

  const formatTimeRemaining = (classTime) => {
    const now = new Date();
    const [hours, minutes] = classTime.split(':');
    const classDate = new Date();
    classDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diff = classDate - now;
    if (diff <= 0) return 'Started';
    
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    }
    return `${minutesLeft}m`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Timetable</h1>
            <p className="text-gray-400">
              {user?.role === 'student' ? 'View your class schedule' : 'Manage class schedules'}
            </p>
            {user?.role === 'student' && (
              <div className="mt-2 text-sm text-blue-400">
                Today is {currentDay} • {getTodayClasses().length} classes scheduled
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {user?.role === 'student' && (
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Today
                </button>
              </div>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Class</span>
              </button>
            )}
          </div>
        </div>

        {/* Next Class Alert for Students */}
        {user?.role === 'student' && getNextClass() && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 border border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">Next Class</h3>
                <p className="text-blue-100 text-sm">{getNextClass().subject}</p>
                <p className="text-blue-200 text-xs">
                  {getNextClass().room} • {getNextClass().startTime} - {getNextClass().endTime}
                </p>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-xl">
                  {formatTimeRemaining(getNextClass().startTime)}
                </div>
                <div className="text-blue-200 text-xs">remaining</div>
              </div>
            </div>
          </div>
        )}

        {/* Role-based Information Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'student' ? 'Enrolled Classes' : 
                   user?.role === 'faculty' ? 'Teaching Classes' : 'Total Classes'}
                </p>
                <p className="text-2xl font-bold text-white">{timetable.length}</p>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'student' ? 'Total Credits' : 
                   user?.role === 'faculty' ? 'Teaching Hours/Week' : 'Weekly Hours'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {timetable.reduce((sum, cls) => sum + (cls.credits || cls.weeklyHours || 0), 0)}
                </p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'student' ? 'This Week' : 
                   user?.role === 'faculty' ? 'Students Taught' : 'Active Courses'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {user?.role === 'student' ? 
                    timetable.filter(cls => {
                      const today = new Date().getDay();
                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      return cls.day === days[today];
                    }).length :
                   user?.role === 'faculty' ? 
                    timetable.reduce((sum, cls) => sum + (cls.enrolledCount || cls.students?.length || 0), 0) :
                    new Set(timetable.map(cls => cls.courseCode)).size
                  }
                </p>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {/* Use availableSubjects if subjects from API are not available */}
                    {(subjects.length > 0 ? subjects : availableSubjects).map(subject => (
                      <option key={subject._id || subject.id} value={subject._id || subject.id}>
                        {subject.code} - {subject.name}
                      </option>
                    ))}
                  </select>
                  {formData.subject && (
                    <div className="mt-2 text-xs text-gray-400">
                      Credits: {formData.credits} | Weekly Hours: {formData.weeklyHours}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Class Type</label>
                  <select
                    value={formData.classType}
                    onChange={(e) => setFormData({...formData, classType: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Laboratory</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Start Time</option>
                    {timeSlots.filter(slot => slot.type === 'class').map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select End Time</option>
                    {timeSlots.filter(slot => slot.type === 'class').map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instructor</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Student Daily View */}
        {user?.role === 'student' && viewMode === 'day' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Today's Schedule - {currentDay}</h2>
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            {getTodayClasses().length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400 text-lg">No classes scheduled for today</p>
                <p className="text-gray-500 text-sm mt-2">Enjoy your free day!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTodayClasses().map((cls, index) => {
                  const isNext = getNextClass()?._id === cls._id;
                  const now = new Date();
                  const currentTime = now.toTimeString().slice(0, 5);
                  const isOngoing = cls.startTime <= currentTime && cls.endTime > currentTime;
                  
                  return (
                    <div key={cls._id} className={`p-4 rounded-lg border transition-all ${
                      isOngoing ? 'bg-green-600/20 border-green-500' :
                      isNext ? 'bg-blue-600/20 border-blue-500' :
                      'bg-gray-700 border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              isOngoing ? 'bg-green-500' :
                              isNext ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}></div>
                            <h3 className="text-white font-semibold text-lg">{cls.subject}</h3>
                            {isOngoing && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                LIVE
                              </span>
                            )}
                            {isNext && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                NEXT
                              </span>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-300">
                              <Clock size={16} />
                              <span>{cls.startTime} - {cls.endTime}</span>
                              {isNext && (
                                <span className="text-blue-400 font-medium">
                                  (in {formatTimeRemaining(cls.startTime)})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                              <MapPin size={16} />
                              <span>{cls.room}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-300">
                              <Users size={16} />
                              <span>{cls.instructor}</span>
                            </div>
                          </div>
                          {cls.courseCode && (
                            <div className="mt-2">
                              <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded font-mono">
                                {cls.courseCode}
                              </span>
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                cls.classType === 'lecture' ? 'bg-blue-600/30 text-blue-300' :
                                cls.classType === 'lab' ? 'bg-green-600/30 text-green-300' :
                                cls.classType === 'seminar' ? 'bg-purple-600/30 text-purple-300' :
                                'bg-orange-600/30 text-orange-300'
                              }`}>
                                {cls.classType || cls.type}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Timetable Grid - Traditional Schedule View */}
        {(user?.role !== 'student' || viewMode === 'week') && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left text-white font-semibold border-r border-gray-600">
                      Time
                    </th>
                    {days.map(day => (
                      <th key={day} className={`px-4 py-3 text-center text-white font-semibold border-r border-gray-600 min-w-[140px] ${
                        day === currentDay && user?.role === 'student' ? 'bg-blue-600/30' : ''
                      }`}>
                        {day}
                        {day === currentDay && user?.role === 'student' && (
                          <div className="text-xs text-blue-300 font-normal">Today</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
              <tbody>
                {timeSlots.map((slot, timeIndex) => (
                  <tr key={slot.time} className={`${timeIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} border-b border-gray-700 ${slot.type === 'break' ? 'bg-yellow-900/20' : ''}`}>
                    <td className={`px-4 py-4 text-gray-300 font-medium border-r border-gray-600 ${slot.type === 'break' ? 'bg-yellow-800/30' : 'bg-gray-700'}`}>
                      <div className="text-sm">{slot.label}</div>
                      {slot.type === 'break' && (
                        <div className="text-xs text-yellow-400 mt-1">
                          {slot.duration} min break
                        </div>
                      )}
                    </td>
                    {days.map(day => {
                      if (slot.type === 'break') {
                        return (
                          <td key={`${day}-${slot.time}`} className="px-2 py-2 border-r border-gray-600 h-16 align-middle text-center bg-yellow-900/10">
                            <div className="text-yellow-400 text-sm font-medium">
                              Break Time
                            </div>
                            <div className="text-yellow-300 text-xs">
                              {slot.duration} minutes
                            </div>
                          </td>
                        );
                      }

                      const classForSlot = timetable.find(cls => 
                        cls.day === day && cls.startTime === slot.time
                      );
                      const isToday = day === currentDay && user?.role === 'student';
                      const now = new Date();
                      const currentTime = now.toTimeString().slice(0, 5);
                      const isCurrentSlot = isToday && slot.time <= currentTime && 
                        timeSlots[timeSlots.indexOf(slot) + 1]?.time > currentTime;
                      
                      return (
                        <td key={`${day}-${slot.time}`} className={`px-2 py-2 border-r border-gray-600 h-20 align-top ${
                          isToday ? 'bg-blue-50/5' : ''
                        } ${isCurrentSlot ? 'bg-yellow-500/20 border-yellow-500' : ''}`}>
                          {classForSlot ? (
                            <div className={`h-full rounded-lg p-2 text-xs relative group cursor-pointer ${
                              classForSlot.type === 'lecture' ? 'bg-blue-600/80 hover:bg-blue-600' : 
                              classForSlot.type === 'lab' ? 'bg-green-600/80 hover:bg-green-600' : 
                              classForSlot.type === 'seminar' ? 'bg-purple-600/80 hover:bg-purple-600' :
                              'bg-orange-600/80 hover:bg-orange-600'
                            } transition-colors`}>
                              <div className="text-white font-semibold truncate">
                                {classForSlot.subject}
                              </div>
                              <div className="text-gray-200 text-xs truncate">
                                {classForSlot.room}
                              </div>
                              {classForSlot.courseCode && (
                                <div className="text-gray-300 text-xs font-mono">
                                  {classForSlot.courseCode}
                                </div>
                              )}
                              
                              {/* Hover tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-600 min-w-[200px]">
                                <div className="font-semibold text-sm mb-2">{classForSlot.subject}</div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>{classForSlot.startTime} - {classForSlot.endTime}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin size={12} />
                                    <span>{classForSlot.room}</span>
                                  </div>
                                  {user?.role === 'student' ? (
                                    <div>Instructor: {classForSlot.instructor}</div>
                                  ) : (
                                    <div className="flex items-center space-x-1">
                                      <Users size={12} />
                                      <span>{classForSlot.enrolledCount || 0} students</span>
                                    </div>
                                  )}
                                  {classForSlot.type && (
                                    <div className="capitalize">{classForSlot.type}</div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Action buttons for faculty/admin */}
                              {(user?.role === 'faculty' || user?.role === 'admin') && (
                                <div className="absolute top-1 right-1 hidden group-hover:flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEdit(classForSlot);
                                    }}
                                    className="text-white hover:text-blue-200 p-1 bg-black/50 rounded"
                                  >
                                    <Edit size={12} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(classForSlot._id);
                                    }}
                                    className="text-white hover:text-red-200 p-1 bg-black/50 rounded"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                              {(user?.role === 'faculty' || user?.role === 'admin') && (
                                <button
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      day: day,
                                      startTime: slot.time,
                                      endTime: timeSlots[timeSlots.indexOf(slot) + 1]?.time || '18:00'
                                    });
                                    setShowAddForm(true);
                                  }}
                                  className="w-full h-full flex items-center justify-center hover:bg-gray-600/50 rounded transition-colors"
                                >
                                  <Plus size={16} className="text-gray-400" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Total Classes</h3>
                <p className="text-gray-400 text-sm">This week</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{timetable.length}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Hours/Week</h3>
                <p className="text-gray-400 text-sm">Class time</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {timetable.reduce((total, cls) => {
                const start = new Date(`2000-01-01 ${cls.startTime}`);
                const end = new Date(`2000-01-01 ${cls.endTime}`);
                return total + (end - start) / (1000 * 60 * 60);
              }, 0).toFixed(1)}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {user?.role === 'student' ? 'Subjects' : 'Students'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'student' ? 'Enrolled' : 'Teaching'}
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {user?.role === 'student' 
                ? new Set(timetable.map(cls => cls.subject)).size
                : timetable.reduce((total, cls) => total + (cls.enrolledCount || 0), 0)
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
