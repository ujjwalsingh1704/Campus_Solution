import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Filter, 
  Search,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { notificationsAPI } from '../utils/api';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Class Rescheduled',
      message: 'Data Structures class has been moved from 9:00 AM to 11:00 AM tomorrow.',
      type: 'info',
      category: 'academic',
      read: false,
      timestamp: '2024-01-15T10:30:00Z',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Food Order Ready',
      message: 'Your lunch order #12345 is ready for pickup at the main canteen.',
      type: 'success',
      category: 'food',
      read: false,
      timestamp: '2024-01-15T12:15:00Z',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Event Registration Confirmed',
      message: 'You have successfully registered for Tech Fest 2024. Event starts tomorrow at 9:00 AM.',
      type: 'success',
      category: 'events',
      read: true,
      timestamp: '2024-01-14T16:45:00Z',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Library Book Due',
      message: 'Your library book "Advanced Algorithms" is due in 2 days. Please return or renew.',
      type: 'warning',
      category: 'academic',
      read: false,
      timestamp: '2024-01-14T09:00:00Z',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'System Maintenance',
      message: 'Campus portal will be under maintenance on Sunday 2:00 AM - 4:00 AM.',
      type: 'info',
      category: 'system',
      read: true,
      timestamp: '2024-01-13T14:20:00Z',
      priority: 'low'
    },
    {
      id: 6,
      title: 'Payment Successful',
      message: 'Your wallet has been topped up with ₹500. New balance: ₹950.',
      type: 'success',
      category: 'payment',
      read: true,
      timestamp: '2024-01-13T11:30:00Z',
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'All', color: 'bg-gray-600' },
    { id: 'academic', name: 'Academic', color: 'bg-blue-600' },
    { id: 'food', name: 'Food', color: 'bg-green-600' },
    { id: 'events', name: 'Events', color: 'bg-purple-600' },
    { id: 'system', name: 'System', color: 'bg-orange-600' },
    { id: 'payment', name: 'Payment', color: 'bg-emerald-600' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.category === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    
    return matchesFilter && matchesSearch && matchesReadStatus;
  });

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(notifications.map(notification =>
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'error':
        return <X className="text-red-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-blue-100">Stay updated with campus activities and important announcements</p>
            </div>
            <div className="relative">
              <Bell className="text-blue-200" size={48} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === category.id
                        ? `${category.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Unread Filter */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Unread only</span>
              </label>

              {/* Mark All Read */}
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <BellOff className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
              <p className="text-gray-400">
                {searchQuery || filter !== 'all' || showUnreadOnly
                  ? 'Try adjusting your filters or search query.'
                  : 'You\'re all caught up! No new notifications.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-800 rounded-lg p-6 border-l-4 ${getPriorityColor(notification.priority)} border-r border-t border-b border-gray-700 ${
                  !notification.read ? 'bg-gray-800/80' : 'bg-gray-800/40'
                } transition-all duration-200 hover:bg-gray-700/50`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${!notification.read ? 'text-gray-300' : 'text-gray-400'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <span className="capitalize">{notification.category}</span>
                        <span className="capitalize">{notification.priority} priority</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Email Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Class schedule changes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Event registrations</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Food order updates</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">Push Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Urgent announcements</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Payment confirmations</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-600" />
                  <span className="text-sm text-gray-300">Daily digest</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
