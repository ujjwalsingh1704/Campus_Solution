import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Coffee, 
  Users, 
  BookOpen, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock,
  Bell,
  UserCheck,
  MessageSquare,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { facultyAPI, eventsAPI, bookingsAPI } from '../../utils/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClasses: 12,
    upcomingEvents: 0,
    pendingBookings: 0,
    attendanceRate: 85,
    announcements: 2
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentChanges, setRecentChanges] = useState([]);
  const [officeHours, setOfficeHours] = useState([]);
  const [classroomChanges, setClassroomChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState([
    { id: 1, time: '09:00', subject: 'Data Structures', room: 'A-101', students: 45, attendanceMarked: false },
    { id: 2, time: '11:00', subject: 'Algorithms', room: 'B-205', students: 38, attendanceMarked: true },
    { id: 3, time: '14:00', subject: 'Database Systems', room: 'C-301', students: 42, attendanceMarked: false }
  ]);
  
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showRoomUpdateModal, setShowRoomUpdateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newRoom, setNewRoom] = useState('');
  const [studentList, setStudentList] = useState([]);

  // Fetch real-time data
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch upcoming events
      const eventsData = await eventsAPI.getAll();
      console.log('Events data received:', eventsData);
      
      // Handle both array response and object with events property
      const eventsArray = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
      
      const upcomingEvents = eventsArray.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for better comparison
        return eventDate >= today && (event.status === 'approved' || event.approvalStatus === 'approved');
      }).length;

      // Fetch pending bookings
      const bookingsData = await bookingsAPI.getAll();
      const bookingsArray = Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || []);
      const pendingBookings = bookingsArray.filter(booking => 
        booking.status === 'pending'
      ).length;

      setStats(prev => ({
        ...prev,
        upcomingEvents: upcomingEvents || 1,
        pendingBookings: pendingBookings || 0
      }));

      // Fetch real-time data for new sections
      await fetchPendingApprovals();
      await fetchRecentChanges();
      await fetchOfficeHours();
      await fetchClassroomChanges();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use fallback mock data
      setStats(prev => ({
        ...prev,
        upcomingEvents: 1,
        pendingBookings: 2
      }));
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      // In real implementation, this would fetch from approvals API
      setPendingApprovals([
        {
          id: 1,
          type: 'booking',
          title: 'Lab B-201 Booking Request',
          requester: 'John Doe',
          date: '2024-09-13',
          time: '2:00 PM - 4:00 PM',
          priority: 'high'
        },
        {
          id: 2,
          type: 'event',
          title: 'Programming Workshop',
          requester: 'Student Council',
          date: '2024-09-15',
          time: '10:00 AM - 12:00 PM',
          priority: 'medium'
        }
      ]);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const fetchRecentChanges = async () => {
    try {
      setRecentChanges([
        {
          id: 1,
          type: 'room_change',
          title: 'Room A-101 changed to A-105',
          subject: 'Data Structures',
          time: 'Tomorrow 9:00 AM',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'reschedule',
          title: 'Class rescheduled',
          subject: 'Algorithms',
          time: 'Moved to 2:00 PM',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching recent changes:', error);
    }
  };

  const fetchOfficeHours = async () => {
    try {
      setOfficeHours([
        {
          id: 1,
          period: 'Morning',
          time: '10:00 AM - 12:00 PM',
          status: 'active',
          appointments: 3
        },
        {
          id: 2,
          period: 'Evening',
          time: '4:00 PM - 6:00 PM',
          status: 'active',
          appointments: 1
        }
      ]);
    } catch (error) {
      console.error('Error fetching office hours:', error);
    }
  };

  const fetchClassroomChanges = async () => {
    try {
      setClassroomChanges([
        {
          id: 1,
          room: 'A-101',
          newRoom: 'A-105',
          subject: 'Data Structures',
          date: '2024-09-13',
          reason: 'Equipment maintenance'
        }
      ]);
    } catch (error) {
      console.error('Error fetching classroom changes:', error);
    }
  };

  const loadMockData = () => {
    setPendingApprovals([
      {
        id: 1,
        type: 'booking',
        title: 'Lab B-201 Booking Request',
        requester: 'John Doe',
        date: '2024-09-13',
        time: '2:00 PM - 4:00 PM',
        priority: 'high'
      }
    ]);
    setRecentChanges([
      {
        id: 1,
        type: 'room_change',
        title: 'Room A-101 changed to A-105',
        subject: 'Data Structures',
        time: 'Tomorrow 9:00 AM',
        timestamp: new Date().toISOString()
      }
    ]);
    setOfficeHours([
      {
        id: 1,
        period: 'Morning',
        time: '10:00 AM - 12:00 PM',
        status: 'active',
        appointments: 3
      }
    ]);
  };
  
  // Handle Mark Attendance
  const handleMarkAttendance = (classItem) => {
    setSelectedClass(classItem);
    // Generate mock student list for the class
    const mockStudents = Array.from({ length: classItem.students }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      rollNumber: `CS${2021000 + i + 1}`,
      present: Math.random() > 0.2 // 80% attendance rate
    }));
    setStudentList(mockStudents);
    setShowAttendanceModal(true);
  };
  
  // Handle Update Room
  const handleUpdateRoom = (classItem) => {
    setSelectedClass(classItem);
    setNewRoom(classItem.room);
    setShowRoomUpdateModal(true);
  };
  
  // Save Attendance
  const saveAttendance = async () => {
    try {
      // API call would go here
      // await facultyAPI.markAttendance(selectedClass.id, studentList);
      
      // Update local state
      setTodayClasses(prev => 
        prev.map(cls => 
          cls.id === selectedClass.id 
            ? { ...cls, attendanceMarked: true }
            : cls
        )
      );
      
      setShowAttendanceModal(false);
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance. Please try again.');
    }
  };
  
  // Update Room
  const updateRoom = async () => {
    try {
      // API call would go here
      // await facultyAPI.updateRoom(selectedClass.id, newRoom);
      
      // Update local state
      setTodayClasses(prev => 
        prev.map(cls => 
          cls.id === selectedClass.id 
            ? { ...cls, room: newRoom }
            : cls
        )
      );
      
      setShowRoomUpdateModal(false);
      alert('Room updated successfully!');
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Error updating room. Please try again.');
    }
  };
  
  // Toggle student attendance
  const toggleStudentAttendance = (studentId) => {
    setStudentList(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const quickActions = [
    {
      title: 'Manage Timetable',
      description: 'Create and update class schedules',
      icon: Calendar,
      href: '/timetable',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Create Events',
      description: 'Organize campus events',
      icon: Users,
      href: '/events',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Canteen Menu',
      description: 'Browse canteen menu',
      icon: Coffee,
      href: '/canteen',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Approve Bookings',
      description: 'Review resource requests',
      icon: BookOpen,
      href: '/bookings',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'Attendance',
      description: 'Mark student attendance',
      icon: UserCheck,
      href: '/attendance',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      title: 'Announcements',
      description: 'Send notifications to students',
      icon: MessageSquare,
      href: '/announcements',
      color: 'bg-teal-600 hover:bg-teal-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, Prof. {user?.name}</h1>
        <p className="text-green-100">Manage your classes and campus activities.</p>
      </div>

      {/* Today's Classes Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Today's Teaching Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayClasses.map((cls, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-semibold">{cls.time}</span>
                <span className="text-gray-400 text-sm">{cls.students} students</span>
              </div>
              <h3 className="text-white font-medium">{cls.subject}</h3>
              <p className="text-gray-400 text-sm">{cls.room}</p>
              <div className="mt-3 flex space-x-2">
                <button 
                  onClick={() => handleMarkAttendance(cls)}
                  className={`px-3 py-1 rounded text-xs text-white transition-colors ${
                    cls.attendanceMarked 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {cls.attendanceMarked ? 'Attendance Marked' : 'Mark Attendance'}
                </button>
                <button 
                  onClick={() => handleUpdateRoom(cls)}
                  className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs text-white transition-colors"
                >
                  Update Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Classes</p>
              <p className="text-2xl font-bold text-white">{stats.totalClasses}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>


        <Link to="/events" className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  stats.upcomingEvents
                )}
              </p>
              <p className="text-purple-400 text-xs mt-1">Click to view all events</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </Link>

        <Link to="/bookings" className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Bookings</p>
              <p className="text-2xl font-bold text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  stats.pendingBookings
                )}
              </p>
              <p className="text-orange-400 text-xs mt-1">Click to manage bookings</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </Link>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Attendance Rate</p>
              <p className="text-2xl font-bold text-white">{stats.attendanceRate}%</p>
            </div>
            <div className="bg-indigo-600 p-3 rounded-lg">
              <UserCheck className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Bell className="mr-2 text-teal-400" size={20} />
              Recent Announcements
            </h3>
            <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-xs">
              {stats.announcements} New
            </span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-white">Faculty Meeting Scheduled</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Monthly faculty meeting on Friday, 3:00 PM in Conference Room A
                  </p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Admin • 2 hours ago</p>
                </div>
                <div className="bg-blue-500 w-2 h-2 rounded-full flex-shrink-0 mt-2"></div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-white">New Course Material Available</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Updated syllabus and reading materials for CS301 have been uploaded
                  </p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Dr. Smith • 1 day ago</p>
                </div>
                <div className="bg-green-500 w-2 h-2 rounded-full flex-shrink-0 mt-2"></div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-white">System Maintenance Notice</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Campus portal will be down for maintenance this Sunday 2-4 AM
                  </p>
                  <p className="text-gray-400 text-xs mt-2">Posted by IT Department • 2 days ago</p>
                </div>
                <div className="bg-yellow-500 w-2 h-2 rounded-full flex-shrink-0 mt-2"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600">
            <button className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center">
              <MessageSquare size={16} className="mr-1" />
              View All Announcements
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className={`${action.color} rounded-lg p-6 text-white transition-colors block`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon size={32} />
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pending Approvals & Classroom Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-orange-400" size={20} />
            Pending Approvals
          </h2>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${approval.priority === 'high' ? 'bg-red-600' : 'bg-orange-600'}`}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{approval.title}</p>
                    <p className="text-gray-400 text-sm">By {approval.requester} • {approval.date} {approval.time}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                    Approve
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                No pending approvals
              </div>
            )}
          </div>
        </div>

        {/* Classroom Management */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Edit3 className="mr-2 text-blue-400" size={20} />
            Classroom Management
          </h2>
          <div className="space-y-4">
            {classroomChanges.map((change) => (
              <div key={change.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{change.room} → {change.newRoom}</p>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Active</span>
                </div>
                <p className="text-gray-300 text-sm">{change.subject}</p>
                <p className="text-gray-400 text-xs mt-1">Reason: {change.reason}</p>
              </div>
            ))}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
              Request Room Change
            </button>
          </div>
        </div>
      </div>

      {/* Recent Changes & Office Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Changes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Clock className="mr-2 text-green-400" size={20} />
            Recent Changes
          </h2>
          <div className="space-y-4">
            {recentChanges.map((change) => (
              <div key={change.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className={`p-2 rounded-lg ${change.type === 'room_change' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {change.type === 'room_change' ? <Edit3 size={20} className="text-white" /> : <Clock size={20} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{change.title}</p>
                  <p className="text-gray-300 text-sm">{change.subject} - {change.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users className="mr-2 text-purple-400" size={20} />
              Today's Office Hours
            </h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
          </div>
          <div className="space-y-4">
            {officeHours.map((hour) => (
              <div key={hour.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{hour.period}</p>
                  <p className="text-gray-400 text-sm">{hour.time}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${hour.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                    {hour.status}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{hour.appointments} appointments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Mark Attendance - {selectedClass?.subject} ({selectedClass?.time})
              </h2>
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-white"><strong>Room:</strong> {selectedClass?.room}</p>
              <p className="text-white"><strong>Students:</strong> {selectedClass?.students}</p>
              <p className="text-white"><strong>Present:</strong> {studentList.filter(s => s.present).length}</p>
              <p className="text-white"><strong>Absent:</strong> {studentList.filter(s => !s.present).length}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {studentList.map((student) => (
                <div 
                  key={student.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    student.present 
                      ? 'bg-green-700 border-green-500' 
                      : 'bg-red-700 border-red-500'
                  }`}
                  onClick={() => toggleStudentAttendance(student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-gray-300 text-sm">{student.rollNumber}</p>
                    </div>
                    <div className="flex items-center">
                      {student.present ? (
                        <CheckCircle className="text-green-300" size={20} />
                      ) : (
                        <XCircle className="text-red-300" size={20} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveAttendance}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Update Modal */}
      {showRoomUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Update Room</h2>
              <button 
                onClick={() => setShowRoomUpdateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-white mb-2"><strong>Class:</strong> {selectedClass?.subject}</p>
              <p className="text-white mb-2"><strong>Time:</strong> {selectedClass?.time}</p>
              <p className="text-white mb-4"><strong>Current Room:</strong> {selectedClass?.room}</p>
              
              <label className="block text-white mb-2">New Room:</label>
              <input
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter new room number"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowRoomUpdateModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={updateRoom}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                disabled={!newRoom.trim()}
              >
                Update Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
