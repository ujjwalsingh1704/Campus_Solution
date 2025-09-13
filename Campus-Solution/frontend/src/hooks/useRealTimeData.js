import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for real-time data simulation
export const useRealTimeData = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    notifications: [],
    walletBalance: 2500,
    attendance: 85,
    upcomingEvents: [],
    recentActivity: [],
    systemHealth: {
      server: 'online',
      database: 'online',
      api: 'online'
    },
    liveStats: {
      activeUsers: 1247,
      todayAttendance: 89,
      canteenOrders: 156,
      eventRegistrations: 43
    }
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        liveStats: {
          ...prevData.liveStats,
          activeUsers: prevData.liveStats.activeUsers + Math.floor(Math.random() * 10) - 5,
          todayAttendance: Math.min(100, prevData.liveStats.todayAttendance + Math.floor(Math.random() * 3)),
          canteenOrders: prevData.liveStats.canteenOrders + Math.floor(Math.random() * 5),
          eventRegistrations: prevData.liveStats.eventRegistrations + Math.floor(Math.random() * 2)
        },
        walletBalance: prevData.walletBalance + (Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate notifications based on user role
  useEffect(() => {
    const generateNotifications = () => {
      const baseNotifications = [
        {
          id: 1,
          title: 'System Maintenance',
          message: 'Scheduled maintenance tonight from 2:00 AM to 4:00 AM',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false
        }
      ];

      if (user?.role === 'student') {
        baseNotifications.push(
          {
            id: 2,
            title: 'Assignment Due',
            message: 'Data Structures assignment due tomorrow',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            read: false
          },
          {
            id: 3,
            title: 'New Achievement',
            message: 'You earned the "Study Streak" badge!',
            type: 'success',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            read: false
          }
        );
      } else if (user?.role === 'faculty') {
        baseNotifications.push(
          {
            id: 4,
            title: 'Class Schedule Update',
            message: 'Room changed for CS101 - now in Lab 3',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            read: false
          },
          {
            id: 5,
            title: 'Pending Approvals',
            message: '3 booking requests need your approval',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            read: false
          }
        );
      } else if (user?.role === 'admin') {
        baseNotifications.push(
          {
            id: 6,
            title: 'Server Alert',
            message: 'High CPU usage detected on server 2',
            type: 'error',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            read: false
          },
          {
            id: 7,
            title: 'New User Registration',
            message: '15 new users registered today',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            read: false
          }
        );
      }

      setData(prevData => ({
        ...prevData,
        notifications: baseNotifications
      }));
    };

    generateNotifications();
  }, [user?.role]);

  // Generate upcoming events
  useEffect(() => {
    const events = [
      {
        id: 1,
        title: 'Tech Fest 2024',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        location: 'Main Auditorium',
        type: 'academic'
      },
      {
        id: 2,
        title: 'Career Fair',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        location: 'Sports Complex',
        type: 'career'
      },
      {
        id: 3,
        title: 'Cultural Night',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        location: 'Open Ground',
        type: 'cultural'
      }
    ];

    setData(prevData => ({
      ...prevData,
      upcomingEvents: events
    }));
  }, []);

  // Generate recent activity
  useEffect(() => {
    const activities = [];
    
    if (user?.role === 'student') {
      activities.push(
        {
          id: 1,
          action: 'Submitted assignment',
          subject: 'Data Structures',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          icon: 'BookOpen'
        },
        {
          id: 2,
          action: 'Ordered food',
          subject: 'Chicken Biryani',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          icon: 'UtensilsCrossed'
        },
        {
          id: 3,
          action: 'Booked facility',
          subject: 'Library Study Room',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          icon: 'Calendar'
        }
      );
    } else if (user?.role === 'faculty') {
      activities.push(
        {
          id: 4,
          action: 'Marked attendance',
          subject: 'CS101 - Section A',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          icon: 'UserCheck'
        },
        {
          id: 5,
          action: 'Created event',
          subject: 'Guest Lecture Series',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          icon: 'Users'
        },
        {
          id: 6,
          action: 'Approved booking',
          subject: 'Conference Room B',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          icon: 'CheckCircle'
        }
      );
    } else if (user?.role === 'admin') {
      activities.push(
        {
          id: 7,
          action: 'Added new user',
          subject: 'John Doe (Student)',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          icon: 'UserPlus'
        },
        {
          id: 8,
          action: 'Updated system settings',
          subject: 'Notification preferences',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          icon: 'Settings'
        },
        {
          id: 9,
          action: 'Generated report',
          subject: 'Monthly analytics',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          icon: 'BarChart'
        }
      );
    }

    setData(prevData => ({
      ...prevData,
      recentActivity: activities
    }));
  }, [user?.role]);

  const markNotificationAsRead = (notificationId) => {
    setData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  const addNotification = (notification) => {
    setData(prevData => ({
      ...prevData,
      notifications: [notification, ...prevData.notifications]
    }));
  };

  return {
    ...data,
    markNotificationAsRead,
    addNotification
  };
};

// Hook for campus navigation data
export const useCampusNavigation = () => {
  const [navigationData, setNavigationData] = useState({
    currentLocation: { lat: 19.0760, lng: 72.8777, name: 'NMIMS Campus' },
    pointsOfInterest: [
      {
        id: 1,
        name: 'Main Library',
        category: 'academic',
        coordinates: { lat: 19.0761, lng: 72.8778 },
        description: 'Central library with study rooms and digital resources',
        facilities: ['WiFi', 'Study Rooms', 'Computers', 'Printing'],
        hours: '8:00 AM - 10:00 PM',
        image: '/api/placeholder/300/200'
      },
      {
        id: 2,
        name: 'Student Canteen',
        category: 'dining',
        coordinates: { lat: 19.0759, lng: 72.8776 },
        description: 'Main dining facility with various food options',
        facilities: ['Seating', 'WiFi', 'Payment Terminal'],
        hours: '7:00 AM - 9:00 PM',
        image: '/api/placeholder/300/200'
      },
      {
        id: 3,
        name: 'Sports Complex',
        category: 'recreation',
        coordinates: { lat: 19.0763, lng: 72.8780 },
        description: 'Indoor and outdoor sports facilities',
        facilities: ['Gym', 'Basketball Court', 'Swimming Pool', 'Lockers'],
        hours: '6:00 AM - 10:00 PM',
        image: '/api/placeholder/300/200'
      },
      {
        id: 4,
        name: 'Admin Building',
        category: 'administrative',
        coordinates: { lat: 19.0758, lng: 72.8775 },
        description: 'Administrative offices and student services',
        facilities: ['Student Services', 'Registrar', 'Finance Office'],
        hours: '9:00 AM - 5:00 PM',
        image: '/api/placeholder/300/200'
      },
      {
        id: 5,
        name: 'Computer Lab A',
        category: 'academic',
        coordinates: { lat: 19.0762, lng: 72.8779 },
        description: 'High-tech computer laboratory',
        facilities: ['Computers', 'Projector', 'AC', 'WiFi'],
        hours: '8:00 AM - 8:00 PM',
        image: '/api/placeholder/300/200'
      }
    ],
    quickAccessLocations: [
      { name: 'My Classroom', coordinates: { lat: 19.0760, lng: 72.8777 } },
      { name: 'Parking Lot', coordinates: { lat: 19.0755, lng: 72.8773 } },
      { name: 'Main Gate', coordinates: { lat: 19.0757, lng: 72.8774 } },
      { name: 'Hostel', coordinates: { lat: 19.0765, lng: 72.8782 } }
    ],
    directions: null,
    isNavigating: false
  });

  const getDirections = (destination) => {
    // Simulate getting directions
    const directions = {
      destination,
      steps: [
        'Head north from your current location',
        'Turn right at the main pathway',
        'Continue straight for 200 meters',
        'Destination will be on your left'
      ],
      estimatedTime: '5 minutes',
      distance: '300 meters'
    };

    setNavigationData(prev => ({
      ...prev,
      directions,
      isNavigating: true
    }));
  };

  const stopNavigation = () => {
    setNavigationData(prev => ({
      ...prev,
      directions: null,
      isNavigating: false
    }));
  };

  const searchLocations = (query) => {
    return navigationData.pointsOfInterest.filter(poi =>
      poi.name.toLowerCase().includes(query.toLowerCase()) ||
      poi.category.toLowerCase().includes(query.toLowerCase()) ||
      poi.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    ...navigationData,
    getDirections,
    stopNavigation,
    searchLocations
  };
};
