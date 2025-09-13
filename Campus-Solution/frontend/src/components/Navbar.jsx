import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useRole } from '../contexts/AuthContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import RealTimeNotifications from './RealTimeNotifications';
import { 
  Home, 
  Calendar, 
  Users, 
  UtensilsCrossed, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  Settings, 
  Wallet, 
  Trophy,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isStudent, isFaculty, isAdmin } = useRole();
  const { notifications } = useRealTimeData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Don't render navbar if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['student', 'faculty', 'admin', 'canteen_staff'] },
    { name: 'Timetable', path: '/timetable', icon: Calendar, roles: ['student', 'faculty', 'admin'] },
    { name: 'Events', path: '/events', icon: Calendar, roles: ['student', 'faculty', 'admin'] },
    { name: 'Canteen', path: '/canteen', icon: UtensilsCrossed, roles: ['student', 'faculty', 'admin', 'canteen_staff'] },
    { name: 'Bookings', path: '/bookings', icon: BookOpen, roles: ['faculty'] },
    { name: 'Wallet', path: '/wallet', icon: Wallet, roles: ['student', 'faculty', 'admin'] },
    { name: 'Gamification', path: '/gamification', icon: Trophy, roles: ['student'] },
    { name: 'User Management', path: '/user-management', icon: Settings, roles: ['admin'] },
    { name: 'Subject Management', path: '/subject-management', icon: BookOpen, roles: ['admin'] },
  ];

  const getVisibleItems = () => {
    return navigationItems.filter(item => item.roles.includes(user?.role));
  };

  return (
    <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-white font-bold text-xl hidden md:block">Campus Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isAuthenticated && getVisibleItems().slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative text-gray-300 hover:text-white p-2 rounded-md transition-colors"
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-gray-300 hover:text-white p-2 rounded-md transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      {user?.role === 'student' && (
                        <Link
                          to="/wallet"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <Wallet size={16} />
                          <span>Wallet</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isAuthenticated && isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <div className="grid grid-cols-2 gap-2">
              {getVisibleItems().map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Notifications Modal */}
      <RealTimeNotifications 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
};

export default Navbar;
