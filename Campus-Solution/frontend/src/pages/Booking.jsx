import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealTimeData } from '../contexts/RealTimeDataContext';
import { bookingsAPI } from '../utils/api';
import { BookOpen, Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle, Users, Edit, Trash2 } from 'lucide-react';

const Booking = () => {
  const { user, loading: authLoading } = useAuth();
  const { bookings: realTimeBookings, fetchBookings } = useRealTimeData();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    department: '',
    expectedAttendees: '',
    contactEmail: '',
    specialRequirements: '',
  });

  const fetchBookingsData = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getAll();
      if (data && data.bookings) {
        setBookings(data.bookings);
      } else {
        throw new Error('No bookings data received');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Comprehensive mock data with dual approval system
      const mockBookings = [
        // Faculty Bookings
        {
          _id: '1',
          resource: {
            name: 'Computer Lab 1',
            type: 'lab',
            capacity: 30,
          },
          date: '2024-03-15',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Advanced Programming Workshop - Data Structures',
          status: 'approved',
          bookedBy: 'Dr. Sarah Wilson',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-10T09:00:00Z',
          department: 'Computer Science',
          contactEmail: 'sarah.wilson@university.edu',
          expectedAttendees: 25,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '4',
          resource: {
            name: 'Physics Lab 2',
            type: 'lab',
            capacity: 25,
          },
          date: '2024-03-18',
          startTime: '09:00',
          endTime: '11:00',
          purpose: 'Quantum Mechanics Experiment',
          status: 'approved',
          bookedBy: 'Dr. Michael Brown',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-12T14:20:00Z',
          department: 'Physics',
          contactEmail: 'michael.brown@university.edu',
          expectedAttendees: 20,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '6',
          resource: {
            name: 'Chemistry Lab 1',
            type: 'lab',
            capacity: 20,
          },
          date: '2024-03-22',
          startTime: '13:00',
          endTime: '15:00',
          purpose: 'Organic Chemistry Practical',
          status: 'approved',
          bookedBy: 'Dr. Lisa Anderson',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-13T16:30:00Z',
          department: 'Chemistry',
          contactEmail: 'lisa.anderson@university.edu',
          expectedAttendees: 18,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '8',
          resource: {
            name: 'Math Lab',
            type: 'lab',
            capacity: 30,
          },
          date: '2024-03-19',
          startTime: '11:00',
          endTime: '13:00',
          purpose: 'Statistics Workshop',
          status: 'approved',
          bookedBy: 'Dr. James Taylor',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-12T11:20:00Z',
          department: 'Mathematics',
          contactEmail: 'james.taylor@university.edu',
          expectedAttendees: 25,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '9',
          resource: {
            name: 'Conference Room B',
            type: 'room',
            capacity: 15,
          },
          date: '2024-03-21',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Faculty Meeting - Curriculum Review',
          status: 'pending_admin',
          bookedBy: 'Dr. Jennifer Martinez',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-15T10:30:00Z',
          department: 'Computer Science',
          contactEmail: 'jennifer.martinez@university.edu',
          expectedAttendees: 12,
          adminApproval: 'pending',
          facultyApproval: 'approved',
        },
        {
          _id: '10',
          resource: {
            name: 'Electronics Lab',
            type: 'lab',
            capacity: 20,
          },
          date: '2024-03-24',
          startTime: '09:00',
          endTime: '11:00',
          purpose: 'Circuit Design Workshop',
          status: 'rejected',
          bookedBy: 'Dr. David Chen',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-16T08:45:00Z',
          department: 'Electronics',
          contactEmail: 'david.chen@university.edu',
          expectedAttendees: 18,
          adminApproval: 'rejected',
          facultyApproval: 'approved',
          rejectionReason: 'Equipment maintenance scheduled for that time',
        },
        
        // Student Bookings
        {
          _id: '2',
          resource: {
            name: 'Conference Room A',
            type: 'room',
            capacity: 20,
          },
          date: '2024-03-12',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Student Project Presentation',
          status: 'pending_faculty',
          bookedBy: 'John Student',
          bookedByRole: 'student',
          bookedAt: '2024-03-08T11:30:00Z',
          department: 'Engineering',
          contactEmail: 'john.student@university.edu',
          expectedAttendees: 15,
          adminApproval: 'approved',
          facultyApproval: 'pending',
        },
        {
          _id: '3',
          resource: {
            name: 'Auditorium',
            type: 'hall',
            capacity: 200,
          },
          date: '2024-03-20',
          startTime: '18:00',
          endTime: '20:00',
          purpose: 'Cultural Event - Annual Day',
          status: 'pending_admin',
          bookedBy: 'Alice Student',
          bookedByRole: 'student',
          bookedAt: '2024-03-09T15:45:00Z',
          department: 'Student Council',
          contactEmail: 'alice.student@university.edu',
          expectedAttendees: 150,
          adminApproval: 'pending',
          facultyApproval: 'pending',
        },
        {
          _id: '5',
          resource: {
            name: 'Library Study Room 3',
            type: 'room',
            capacity: 8,
          },
          date: '2024-03-16',
          startTime: '15:00',
          endTime: '17:00',
          purpose: 'Group Study Session - Database Systems',
          status: 'pending_faculty',
          bookedBy: 'Emma Davis',
          bookedByRole: 'student',
          bookedAt: '2024-03-11T10:15:00Z',
          department: 'Computer Science',
          contactEmail: 'emma.davis@university.edu',
          expectedAttendees: 6,
          adminApproval: 'approved',
          facultyApproval: 'pending',
        },
        {
          _id: '7',
          resource: {
            name: 'Seminar Hall B',
            type: 'hall',
            capacity: 100,
          },
          date: '2024-03-25',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Guest Lecture - AI in Healthcare',
          status: 'pending_admin',
          bookedBy: 'Robert Wilson',
          bookedByRole: 'student',
          bookedAt: '2024-03-14T09:45:00Z',
          department: 'Computer Science',
          contactEmail: 'robert.wilson@university.edu',
          expectedAttendees: 80,
          adminApproval: 'pending',
          facultyApproval: 'pending',
        },
        {
          _id: '11',
          resource: {
            name: 'Study Room 5',
            type: 'room',
            capacity: 6,
          },
          date: '2024-03-17',
          startTime: '16:00',
          endTime: '18:00',
          purpose: 'Group Project Discussion - Web Development',
          status: 'approved',
          bookedBy: 'Maria Garcia',
          bookedByRole: 'student',
          bookedAt: '2024-03-13T12:20:00Z',
          department: 'Computer Science',
          contactEmail: 'maria.garcia@university.edu',
          expectedAttendees: 5,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '12',
          resource: {
            name: 'Mechanical Workshop',
            type: 'lab',
            capacity: 25,
          },
          date: '2024-03-23',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Final Year Project - Robot Assembly',
          status: 'rejected',
          bookedBy: 'Alex Thompson',
          bookedByRole: 'student',
          bookedAt: '2024-03-17T14:15:00Z',
          department: 'Mechanical Engineering',
          contactEmail: 'alex.thompson@university.edu',
          expectedAttendees: 3,
          adminApproval: 'rejected',
          facultyApproval: 'pending',
          rejectionReason: 'Safety inspection required before use',
        },
        {
          _id: '13',
          resource: {
            name: 'Art Studio',
            type: 'room',
            capacity: 15,
          },
          date: '2024-03-26',
          startTime: '13:00',
          endTime: '15:00',
          purpose: 'Creative Arts Exhibition Setup',
          status: 'pending_faculty',
          bookedBy: 'Sophie Lee',
          bookedByRole: 'student',
          bookedAt: '2024-03-18T09:30:00Z',
          department: 'Fine Arts',
          contactEmail: 'sophie.lee@university.edu',
          expectedAttendees: 12,
          adminApproval: 'approved',
          facultyApproval: 'pending',
        },
        {
          _id: '14',
          resource: {
            name: 'Language Lab',
            type: 'lab',
            capacity: 20,
          },
          date: '2024-03-27',
          startTime: '11:00',
          endTime: '13:00',
          purpose: 'French Language Practice Session',
          status: 'pending_admin',
          bookedBy: 'Kevin Park',
          bookedByRole: 'student',
          bookedAt: '2024-03-19T16:45:00Z',
          department: 'Languages',
          contactEmail: 'kevin.park@university.edu',
          expectedAttendees: 18,
          adminApproval: 'pending',
          facultyApproval: 'pending',
        },
        
        // Admin Bookings
        {
          _id: '15',
          resource: {
            name: 'Main Auditorium',
            type: 'hall',
            capacity: 500,
          },
          date: '2024-03-28',
          startTime: '09:00',
          endTime: '17:00',
          purpose: 'Annual University Convocation',
          status: 'approved',
          bookedBy: 'Dr. Admin Smith',
          bookedByRole: 'admin',
          bookedAt: '2024-03-01T08:00:00Z',
          department: 'Administration',
          contactEmail: 'admin.smith@university.edu',
          expectedAttendees: 450,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '16',
          resource: {
            name: 'Board Room',
            type: 'room',
            capacity: 12,
          },
          date: '2024-03-29',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Board of Directors Meeting',
          status: 'approved',
          bookedBy: 'Dr. Admin Johnson',
          bookedByRole: 'admin',
          bookedAt: '2024-03-02T10:30:00Z',
          department: 'Administration',
          contactEmail: 'admin.johnson@university.edu',
          expectedAttendees: 10,
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '17',
          resource: {
            name: 'Training Center',
            type: 'room',
            capacity: 30,
          },
          date: '2024-03-30',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Staff Training - New Policies',
          status: 'pending_faculty',
          bookedBy: 'Dr. Admin Davis',
          bookedByRole: 'admin',
          bookedAt: '2024-03-20T11:15:00Z',
          department: 'Human Resources',
          contactEmail: 'admin.davis@university.edu',
          expectedAttendees: 25,
          adminApproval: 'approved',
          facultyApproval: 'pending',
        },
      ];
      
      // Filter based on user role - students should see all approved bookings plus their own
      if (user?.role === 'student') {
        setBookings(mockBookings);
      } else if (user?.role === 'faculty') {
        setBookings(mockBookings);
      } else if (user?.role === 'admin') {
        setBookings(mockBookings);
      } else {
        setBookings(mockBookings);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const data = await bookingsAPI.getResources();
      setResources(data.resources || data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Enhanced mock data with valid MongoDB ObjectIds
      setResources([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Computer Lab 1',
          type: 'lab',
          capacity: 30,
          equipment: ['30 Computers', 'Projector', 'Whiteboard', 'Air Conditioning'],
          available: true,
          location: 'Building A, Floor 2',
          features: ['High-speed Internet', 'Software Development Tools', 'Programming IDEs'],
          bookingCount: 12,
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Computer Lab 2',
          type: 'lab',
          capacity: 25,
          equipment: ['25 Computers', 'Smart Board', 'Projector'],
          available: true,
          location: 'Building A, Floor 3',
          features: ['Graphics Design Software', 'CAD Tools', 'High-end GPUs'],
          bookingCount: 8,
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'Conference Room A',
          type: 'room',
          capacity: 20,
          equipment: ['4K Projector', 'Video Conferencing Setup', 'Interactive Whiteboard'],
          available: true,
          location: 'Building B, Floor 1',
          features: ['Zoom Integration', 'Recording Capability', 'Premium Audio System'],
          bookingCount: 15,
        },
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'Main Auditorium',
          type: 'hall',
          capacity: 200,
          equipment: ['Professional Sound System', 'Stage Lighting', 'Large Screen Projector'],
          available: true,
          location: 'Building C, Ground Floor',
          features: ['Live Streaming Setup', 'Wireless Microphones', 'Stage Platform'],
          bookingCount: 5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (bookingId, approvalType, action) => {
    let rejectionReason = '';
    
    // If rejecting, ask for reason
    if (action === 'rejected') {
      rejectionReason = prompt('Please provide a reason for rejection:');
      if (!rejectionReason) {
        alert('Rejection reason is required.');
        return;
      }
    }
    
    try {
      // Try API call first
      await bookingsAPI.updateApproval(bookingId, approvalType, action);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          if (booking._id === bookingId) {
            const updatedBooking = { ...booking };
            if (approvalType === 'admin') {
              updatedBooking.adminApproval = action;
            } else if (approvalType === 'faculty') {
              updatedBooking.facultyApproval = action;
            }
            
            // Add rejection reason if provided
            if (action === 'rejected' && rejectionReason) {
              updatedBooking.rejectionReason = rejectionReason;
            }
            
            // Update overall status based on approvals
            if (updatedBooking.adminApproval === 'approved' && updatedBooking.facultyApproval === 'approved') {
              updatedBooking.status = 'approved';
            } else if (updatedBooking.adminApproval === 'rejected' || updatedBooking.facultyApproval === 'rejected') {
              updatedBooking.status = 'rejected';
            } else if (updatedBooking.adminApproval === 'pending' && updatedBooking.facultyApproval === 'pending') {
              updatedBooking.status = 'pending_admin';
            } else if (updatedBooking.adminApproval === 'approved' && updatedBooking.facultyApproval === 'pending') {
              updatedBooking.status = 'pending_faculty';
            } else {
              updatedBooking.status = 'pending';
            }
            
            return updatedBooking;
          }
          return booking;
        })
      );
      
      // Refresh real-time data
      fetchBookingsData();
    } catch (error) {
      console.error('Error updating approval:', error);
      // Fallback for demo mode
      setBookings(prevBookings =>
        prevBookings.map(booking => {
          if (booking._id === bookingId) {
            const updatedBooking = { ...booking };
            if (approvalType === 'admin') {
              updatedBooking.adminApproval = action;
            } else if (approvalType === 'faculty') {
              updatedBooking.facultyApproval = action;
            }
            
            // Add rejection reason if provided
            if (action === 'rejected' && rejectionReason) {
              updatedBooking.rejectionReason = rejectionReason;
            }
            
            // Update overall status based on approvals
            if (updatedBooking.adminApproval === 'approved' && updatedBooking.facultyApproval === 'approved') {
              updatedBooking.status = 'approved';
            } else if (updatedBooking.adminApproval === 'rejected' || updatedBooking.facultyApproval === 'rejected') {
              updatedBooking.status = 'rejected';
            } else if (updatedBooking.adminApproval === 'pending' && updatedBooking.facultyApproval === 'pending') {
              updatedBooking.status = 'pending_admin';
            } else if (updatedBooking.adminApproval === 'approved' && updatedBooking.facultyApproval === 'pending') {
              updatedBooking.status = 'pending_faculty';
            } else {
              updatedBooking.status = 'pending';
            }
            
            return updatedBooking;
          }
          return booking;
        })
      );
      alert(`Booking ${action} successfully! (Demo mode)`);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      resourceId: booking.resource._id || '',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: booking.purpose,
      department: booking.department,
      expectedAttendees: booking.expectedAttendees,
      contactEmail: booking.contactEmail,
      specialRequirements: booking.specialRequirements || '',
    });
    setShowBookingForm(true);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsAPI.delete(bookingId);
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        fetchBookingsData();
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        // Fallback for demo mode
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        alert('Booking deleted successfully! (Demo mode)');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      resourceId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      department: '',
      expectedAttendees: '',
      contactEmail: '',
      specialRequirements: '',
    });
    setEditingBooking(null);
    setShowBookingForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find the selected resource
    const selectedResource = resources.find(r => r._id === formData.resourceId);
    if (!selectedResource) {
      alert('Please select a resource');
      return;
    }

    const bookingData = {
      ...formData,
      resource: {
        _id: selectedResource._id,
        name: selectedResource.name,
        type: selectedResource.type,
        capacity: selectedResource.capacity,
      },
      bookedBy: user.name || 'Unknown User',
      bookedByRole: user.role,
      bookedAt: new Date().toISOString(),
      status: user.role === 'student' ? 'pending_admin' : 'approved',
      adminApproval: user.role === 'student' ? 'pending' : 'approved',
      facultyApproval: user.role === 'student' ? 'pending' : 'approved',
    };

    try {
      if (editingBooking) {
        // Update existing booking
        await bookingsAPI.update(editingBooking._id, bookingData);
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === editingBooking._id 
              ? { ...booking, ...bookingData }
              : booking
          )
        );
        alert('Booking updated successfully!');
      } else {
        // Create new booking
        const newBooking = await bookingsAPI.create(bookingData);
        setBookings(prevBookings => [newBooking, ...prevBookings]);
        alert('Booking created successfully!');
      }
      
      // Refresh real-time data
      fetchBookingsData();
      resetForm();
    } catch (error) {
      console.error('API call failed:', error);
      
      // Fallback for demo mode
      if (editingBooking) {
        // Update existing booking locally
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === editingBooking._id 
              ? { ...booking, ...bookingData }
              : booking
          )
        );
        alert('Booking updated successfully! (Demo mode)');
      } else {
        // Create new booking locally
        const newBooking = {
          _id: `booking_${Date.now()}`,
          ...bookingData,
        };
        setBookings(prevBookings => [newBooking, ...prevBookings]);
        alert('Booking created successfully! (Demo mode)');
      }
      
      resetForm();
    }
  };

  // Initial data load - always fetch data regardless of user state
  useEffect(() => {
    fetchBookingsData();
    fetchResources();
  }, []);

  // Separate effect for real-time bookings
  useEffect(() => {
    if (realTimeBookings && realTimeBookings.length > 0) {
      setBookings(realTimeBookings);
    }
  }, [realTimeBookings]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user || (user?.role !== 'faculty' && user?.role !== 'admin' && user?.role !== 'student')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            {!user ? 'Please log in to access this page.' : 'You don\'t have permission to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getApprovalBadge = (adminApproval, facultyApproval) => {
    if (adminApproval === 'approved' && facultyApproval === 'approved') {
      return <span className="px-2 py-1 bg-green-600 text-green-100 rounded-full text-xs">Fully Approved</span>;
    } else if (adminApproval === 'rejected' || facultyApproval === 'rejected') {
      return <span className="px-2 py-1 bg-red-600 text-red-100 rounded-full text-xs">Rejected</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs">Pending Approval</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resource Booking</h1>
            <p className="text-gray-400">Manage and view resource bookings</p>
          </div>
          {(user?.role === 'faculty' || user?.role === 'admin' || user?.role === 'student') && (
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Booking
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No bookings found</h3>
                <p className="text-gray-500">Create your first booking to get started</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{booking.resource.name}</h3>
                        <p className="text-gray-400 capitalize">{booking.resource.type} • Capacity: {booking.resource.capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getApprovalBadge(booking.adminApproval, booking.facultyApproval)}
                      {(user?.role === 'admin' || (user?.role === 'faculty' && booking.bookedByRole === 'faculty') || (user?.role === 'student' && booking.bookedByRole === 'student')) && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="Edit booking"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Delete booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{booking.expectedAttendees} attendees</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.department}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 mb-2"><strong>Purpose:</strong> {booking.purpose}</p>
                    <p className="text-gray-400 text-sm">Booked by: {booking.bookedBy} ({booking.bookedByRole})</p>
                  </div>

                  {/* Dual Approval System UI */}
                  {booking.bookedByRole === 'student' && (
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Approval Status</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Admin Approval</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.adminApproval === 'approved' ? 'bg-green-600 text-green-100' :
                              booking.adminApproval === 'rejected' ? 'bg-red-600 text-red-100' :
                              'bg-yellow-600 text-yellow-100'
                            }`}>
                              {booking.adminApproval}
                            </span>
                            {user?.role === 'admin' && booking.adminApproval === 'pending' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleApproval(booking._id, 'admin', 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleApproval(booking._id, 'admin', 'rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                          <span className="text-sm text-gray-300">Faculty Approval</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.facultyApproval === 'approved' ? 'bg-green-600 text-green-100' :
                              booking.facultyApproval === 'rejected' ? 'bg-red-600 text-red-100' :
                              'bg-yellow-600 text-yellow-100'
                            }`}>
                              {booking.facultyApproval}
                            </span>
                            {user?.role === 'faculty' && booking.facultyApproval === 'pending' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleApproval(booking._id, 'faculty', 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleApproval(booking._id, 'faculty', 'rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Rejection Reason Display */}
                      {booking.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-600/20 border border-red-600/50 rounded">
                          <p className="text-red-300 text-sm">
                            <strong>Rejection Reason:</strong> {booking.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm">
            <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-600 p-4 w-full max-w-5xl max-h-[80vh] overflow-y-auto relative z-[99999]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-xl font-bold p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative z-[100000]">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resource *</label>
                  <select
                    value={formData.resourceId}
                    onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer relative z-[100000]"
                    required
                    style={{ zIndex: 100000 }}
                  >
                    <option value="" className="bg-gray-700 text-gray-300">Select a resource</option>
                    {resources.map((resource) => (
                      <option key={resource._id} value={resource._id} className="bg-gray-700 text-white py-2">
                        {resource.name} ({resource.type}) - Capacity: {resource.capacity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Start Time *</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">End Time *</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Expected Attendees *</label>
                    <input
                      type="number"
                      value={formData.expectedAttendees}
                      onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="Number of people"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Department *</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      placeholder="your.email@university.edu"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Purpose *</label>
                    <textarea
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm"
                      rows="2"
                      placeholder="Describe the purpose of your booking..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Special Requirements</label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm"
                      rows="2"
                      placeholder="Any special equipment or setup requirements..."
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm">
                      <strong>Note:</strong> Student bookings require approval from both admin and faculty before confirmation.
                    </p>
                  </div>
                )}

                <div className="sticky bottom-0 bg-gray-800 flex gap-3 pt-4 border-t border-gray-700 mt-4 -mx-4 px-4 pb-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl z-[100001] text-sm"
                  >
                    {editingBooking ? 'Update Booking' : 'Create Booking'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl z-[100001] text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
