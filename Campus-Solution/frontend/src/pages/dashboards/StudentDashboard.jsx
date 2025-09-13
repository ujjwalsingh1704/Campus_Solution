import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { Link } from 'react-router-dom';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { 
  Calendar, 
  Coffee, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Trophy, 
  Star, 
  Wallet,
  Bell,
  Award,
  TrendingUp
} from 'lucide-react';
import { studentAPI, gamificationAPI, walletAPI, notificationsAPI } from '../../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { balance: walletBalance, transactions } = useWallet();
  const { 
    walletBalance: realtimeWalletBalance, 
    attendance: realtimeAttendance, 
    upcomingEvents, 
    recentActivity, 
    notifications: realtimeNotifications,
    liveStats 
  } = useRealTimeData();
  
  const [stats, setStats] = useState({
    attendance: 85,
    assignments: 3,
    events: 2,
    wallet: 2500
  });
  // Update stats with real-time data
  useEffect(() => {
    setStats(prevStats => ({
      ...prevStats,
      attendance: realtimeAttendance,
      wallet: walletBalance || realtimeWalletBalance,
      events: upcomingEvents.length
    }));
  }, [realtimeAttendance, realtimeWalletBalance, upcomingEvents, walletBalance]);

  const [gamificationData, setGamificationData] = useState({
    points: 1250,
    level: 5,
    badges: 8,
    rank: 23,
    nextLevelPoints: 1500,
    todayPoints: 45,
    weeklyGoal: 200,
    weeklyProgress: 125
  });
  const [todaySchedule, setTodaySchedule] = useState([
    { time: '09:00', subject: 'Mathematics', room: 'A-101', type: 'lecture' },
    { time: '11:00', subject: 'Physics Lab', room: 'B-205', type: 'lab' },
    { time: '14:00', subject: 'Computer Science', room: 'C-301', type: 'lecture' }
  ]);

  // Fetch gamification data
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const data = await gamificationAPI.getProfile();
        setGamificationData(prev => ({
          ...prev,
          ...data,
          todayPoints: Math.floor(Math.random() * 50) + 20,
          weeklyProgress: Math.floor(Math.random() * 150) + 50
        }));
      } catch (error) {
        // Use dynamic fallback data
        const currentHour = new Date().getHours();
        const dynamicPoints = 1250 + (currentHour * 5); // Points increase throughout the day
        const level = Math.floor(dynamicPoints / 300) + 1;
        
        setGamificationData(prev => ({
          ...prev,
          points: dynamicPoints,
          level: level,
          nextLevelPoints: level * 300,
          todayPoints: Math.floor(Math.random() * 50) + 20,
          weeklyProgress: Math.floor(Math.random() * 150) + 50
        }));
      }
    };

    fetchGamificationData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGamificationData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'View Timetable',
      description: 'Check your class schedule',
      icon: Calendar,
      href: '/timetable',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Order Food',
      description: 'Browse canteen menu',
      icon: Coffee,
      href: '/canteen',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Discover Events',
      description: 'Find and register for events',
      icon: Users,
      href: '/events',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Book Resources',
      description: 'Reserve labs and classrooms',
      icon: BookOpen,
      href: '/bookings',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'AI Assistant',
      description: 'Ask questions about campus',
      icon: MessageCircle,
      href: '/ai-assistant',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      title: 'Campus Navigation',
      description: 'Find your way around campus',
      icon: MapPin,
      href: '/navigation',
      color: 'bg-teal-600 hover:bg-teal-700',
    },
    {
      title: 'My Wallet',
      description: 'Manage payments & balance',
      icon: Wallet,
      href: '/wallet',
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening in your campus today.</p>
      </div>

      {/* Gamification & Wallet Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Gamification Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Level {gamificationData.level}</h3>
              <p className="text-purple-100 text-sm">{gamificationData.points} Points</p>
              <p className="text-purple-200 text-xs">+{gamificationData.todayPoints} today</p>
            </div>
            <div className="relative">
              <Trophy className="text-yellow-300" size={32} />
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-purple-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {gamificationData.level}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {gamificationData.level + 1}</span>
              <span>{gamificationData.points}/{gamificationData.nextLevelPoints}</span>
            </div>
            <div className="w-full bg-purple-800 rounded-full h-2 mb-2">
              <div 
                className="bg-yellow-300 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((gamificationData.points / gamificationData.nextLevelPoints) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span>Weekly Goal: {gamificationData.weeklyProgress}/{gamificationData.weeklyGoal}</span>
              <span>{Math.round((gamificationData.weeklyProgress / gamificationData.weeklyGoal) * 100)}%</span>
            </div>
            <div className="w-full bg-purple-800 rounded-full h-1">
              <div 
                className="bg-green-400 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((gamificationData.weeklyProgress / gamificationData.weeklyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center"><Award size={16} className="mr-1" /> {gamificationData.badges} Badges</span>
            <span className="flex items-center"><TrendingUp size={16} className="mr-1" /> Rank #{gamificationData.rank}</span>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Wallet Balance</h3>
              <p className="text-2xl font-bold">₹{walletBalance || stats.wallet}</p>
            </div>
            <Wallet className="text-green-200" size={32} />
          </div>
          <Link 
            to="/wallet" 
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors block text-center"
          >
            Top Up Wallet
          </Link>
        </div>

        {/* Notifications Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-blue-100 text-sm">{realtimeNotifications.filter(n => !n.read).length} unread messages</p>
            </div>
            <div className="relative">
              <Bell className="text-blue-200" size={32} />
              {realtimeNotifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {realtimeNotifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>
          <Link 
            to="/notifications" 
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors block text-center"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/timetable" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming Classes</p>
              <p className="text-2xl font-bold text-white">{todaySchedule.length}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
        </Link>


        <Link to="/events" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Registered Events</p>
              <p className="text-2xl font-bold text-white">{upcomingEvents.length}</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </Link>

        <Link to="/bookings" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 border border-gray-700 transition-colors block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Bookings</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className={`${action.color} rounded-lg p-6 text-white transition-colors block`}
              >
                <div className="flex items-center space-x-4">
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

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium">{item.subject}</p>
                    <span className="text-blue-400 text-sm font-medium">{item.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.room} • {item.type}</p>
                </div>
              </div>
            ))}
          </div>
          <Link 
            to="/timetable" 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block text-center"
          >
            View Full Timetable
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Mathematics class starts in 30 minutes</p>
              <p className="text-gray-400 text-sm">Room 101, Block A</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <div className="bg-green-600 p-2 rounded-lg">
              <Coffee size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Your lunch order is being prepared</p>
              <p className="text-gray-400 text-sm">Estimated time: 15 minutes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Tech Fest 2024 registration confirmed</p>
              <p className="text-gray-400 text-sm">Event starts tomorrow at 9:00 AM</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Dynamic Achievement Highlights */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
          <div className="text-sm text-gray-400">
            {gamificationData.badges} total badges earned
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center space-x-3">
              <Star className="text-yellow-200" size={24} />
              <div>
                <p className="font-semibold">Eco Warrior</p>
                <p className="text-sm opacity-90">Ordered {Math.floor(Math.random() * 10) + 5} eco-friendly meals</p>
                <p className="text-xs opacity-75">+{Math.floor(Math.random() * 20) + 10} points</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center space-x-3">
              <Trophy className="text-blue-200" size={24} />
              <div>
                <p className="font-semibold">Event Enthusiast</p>
                <p className="text-sm opacity-90">Attended {upcomingEvents.length + Math.floor(Math.random() * 5)} campus events</p>
                <p className="text-xs opacity-75">+{Math.floor(Math.random() * 30) + 15} points</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-4 text-white hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center space-x-3">
              <Award className="text-green-200" size={24} />
              <div>
                <p className="font-semibold">Study Master</p>
                <p className="text-sm opacity-90">Booked study rooms {Math.floor(Math.random() * 15) + 10} times</p>
                <p className="text-xs opacity-75">+{Math.floor(Math.random() * 25) + 20} points</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View All Badges & Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
