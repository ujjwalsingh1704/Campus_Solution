import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRealTimeData } from '../../contexts/RealTimeDataContext';
import { 
  Calendar, 
  Coffee, 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  IndianRupee,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    bookings, 
    events, 
    users, 
    approvals, 
    orders,
    loading,
    fetchAllData,
    getAnalytics 
  } = useRealTimeData();
  
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const analytics = getAnalytics();

  const quickActions = [
    {
      title: 'Manage Timetables',
      description: 'Oversee all class schedules',
      icon: Calendar,
      href: '/timetable',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Event Management',
      description: 'Create and manage events',
      icon: Users,
      href: '/events',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Canteen Management',
      description: 'View canteen menu and orders',
      icon: Coffee,
      href: '/canteen',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Resource Bookings',
      description: 'Approve booking requests',
      icon: BookOpen,
      href: '/bookings',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-purple-100">Complete overview of Campus Solutions platform.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link to="/bookings" className="block">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{analytics.totalBookings}</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp size={16} className="mr-1" />
                  {analytics.recentBookings} new today
                </p>
              </div>
              <div className="bg-orange-600 p-3 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
            </div>
          </div>
        </Link>

        <Link to="/events" className="block">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Events</p>
                <p className="text-2xl font-bold text-white">{analytics.activeEvents}</p>
                <p className="text-blue-400 text-sm flex items-center mt-1">
                  <Activity size={16} className="mr-1" />
                  {events.filter(e => e.status === 'upcoming').length} upcoming this week
                </p>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
        </Link>

        <Link to="/user-management" className="block">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{analytics.activeUsers}</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp size={16} className="mr-1" />
                  {analytics.recentUsers} active today
                </p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
        </Link>

        <div 
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
          onClick={() => {
            // Show approvals modal or navigate to approvals page
            alert(`Pending Approvals:\n${approvals.map(a => `• ${a.title} (${a.type}) - ${a.user}`).join('\n')}`);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Approvals</p>
              <p className="text-2xl font-bold text-white">{analytics.pendingApprovals}</p>
              <p className="text-yellow-400 text-sm">
                {approvals.filter(a => a.type === 'booking').length} bookings, {approvals.filter(a => a.type === 'event').length} events
              </p>
            </div>
            <div className="bg-yellow-600 p-3 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
          </div>
        </div>

        <Link to="/canteen" className="block">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Canteen Orders</p>
                <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
                <p className="text-orange-400 text-sm flex items-center mt-1">
                  <IndianRupee size={16} className="mr-1" />
                  {analytics.pendingOrders} pending orders
                </p>
              </div>
              <div className="bg-orange-600 p-3 rounded-lg">
                <Coffee className="text-white" size={24} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent System Activity */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent System Activity</h2>
          <div className="space-y-4">
            {users.slice(0, 2).map((user, index) => (
              <div key={user._id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">User activity</p>
                  <p className="text-gray-400 text-sm">{user.name} ({user.role}) - {user.lastActive ? 'Recently active' : 'Never logged in'}</p>
                </div>
              </div>
            ))}
            
            {orders.slice(0, 1).map((order, index) => (
              <div key={order._id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Coffee size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">New order placed</p>
                  <p className="text-gray-400 text-sm">₹{order.total} - {order.customerName} - {order.status}</p>
                </div>
              </div>
            ))}
            
            {events.slice(0, 1).map((event, index) => (
              <div key={event._id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Event activity</p>
                  <p className="text-gray-400 text-sm">{event.title} - {event.status} - {event.attendees} attendees</p>
                </div>
              </div>
            ))}

            {bookings.slice(0, 1).map((booking, index) => (
              <div key={booking._id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="bg-orange-600 p-2 rounded-lg">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Resource booking</p>
                  <p className="text-gray-400 text-sm">{booking.resource.name} - {booking.status} - {booking.bookedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">Database</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">API Services</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-white">Payment Gateway</span>
              </div>
              <span className="text-yellow-400 text-sm">Degraded</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">AI Assistant</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>System Update:</strong> Scheduled maintenance on Sunday 2:00 AM - 4:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
