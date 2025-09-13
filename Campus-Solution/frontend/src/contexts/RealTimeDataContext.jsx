import React, { createContext, useContext, useState, useEffect } from 'react';

const RealTimeDataContext = createContext();

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

export const RealTimeDataProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real-time data fetching functions
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to mock data
      setBookings([
        {
          _id: '1',
          resource: { name: 'Computer Lab 1', type: 'lab', capacity: 30 },
          date: '2024-03-15',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Advanced Programming Workshop',
          status: 'approved',
          bookedBy: 'Dr. Sarah Wilson',
          bookedByRole: 'faculty',
          bookedAt: '2024-03-10T09:00:00Z',
          department: 'Computer Science',
          adminApproval: 'approved',
          facultyApproval: 'approved',
        },
        {
          _id: '2',
          resource: { name: 'Conference Room A', type: 'room', capacity: 20 },
          date: '2024-03-12',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Student Project Presentation',
          status: 'pending_faculty',
          bookedBy: 'John Student',
          bookedByRole: 'student',
          bookedAt: '2024-03-08T11:30:00Z',
          department: 'Engineering',
          adminApproval: 'approved',
          facultyApproval: 'pending',
        }
      ]);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to mock data
      setEvents([
        { _id: '1', title: 'Tech Symposium', date: '2024-03-20', status: 'active', attendees: 150 },
        { _id: '2', title: 'Cultural Fest', date: '2024-03-22', status: 'upcoming', attendees: 300 },
        { _id: '3', title: 'Sports Meet', date: '2024-03-25', status: 'upcoming', attendees: 200 }
      ]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@student.edu', role: 'student', status: 'active', lastActive: new Date() },
        { _id: '2', name: 'Dr. Smith', email: 'smith@faculty.edu', role: 'faculty', status: 'active', lastActive: new Date() },
        { _id: '3', name: 'Admin User', email: 'admin@university.edu', role: 'admin', status: 'active', lastActive: new Date() }
      ]);
    }
  };

  const fetchApprovals = async () => {
    try {
      const response = await fetch('/api/admin/approvals');
      if (response.ok) {
        const data = await response.json();
        setApprovals(data.approvals || data || []);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
      // Fallback to mock data
      setApprovals([
        { _id: '1', title: 'Lab Booking Request', type: 'booking', user: 'John Student', status: 'pending' },
        { _id: '2', title: 'Event Creation', type: 'event', user: 'Dr. Wilson', status: 'pending' }
      ]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Fallback to mock data
      setSubjects([
        { _id: '1', name: 'Data Structures', code: 'CS301', department: 'Computer Science', semester: 3, isActive: true },
        { _id: '2', name: 'Database Systems', code: 'CS401', department: 'Computer Science', semester: 4, isActive: true }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      setOrders([
        { _id: '1', customerName: 'John Student', total: 120, status: 'pending', orderTime: new Date().toISOString() },
        { _id: '2', customerName: 'Dr. Smith', total: 85, status: 'completed', orderTime: new Date().toISOString() }
      ]);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchEvents(),
        fetchUsers(),
        fetchApprovals(),
        fetchSubjects(),
        fetchOrders()
      ]);
    } catch (error) {
      console.error('Error fetching all data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {
    fetchAllData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchAllData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Analytics calculations
  const getAnalytics = () => {
    const totalBookings = bookings.length;
    const activeEvents = events.filter(e => e.status === 'active').length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return {
      totalBookings,
      activeEvents,
      activeUsers,
      pendingApprovals,
      totalOrders,
      pendingOrders,
      recentBookings: bookings.filter(b => 
        new Date(b.bookedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      recentUsers: users.filter(u => 
        u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    };
  };

  const value = {
    bookings,
    events,
    users,
    approvals,
    subjects,
    orders,
    loading,
    fetchBookings,
    fetchEvents,
    fetchUsers,
    fetchApprovals,
    fetchSubjects,
    fetchOrders,
    fetchAllData,
    getAnalytics
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
};
