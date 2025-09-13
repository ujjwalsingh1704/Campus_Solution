import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Coffee, 
  Users, 
  BookOpen, 
  MessageCircle, 
  BarChart3,
  Settings,
  Clock,
  Library,
  IndianRupee
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AIAssistant from './AIAssistant';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { name: 'Timetable', href: '/timetable', icon: Calendar },
          { name: 'Events', href: '/events', icon: Users },
          { name: 'Library', href: '/library', icon: Library },
          { name: 'Canteen', href: '/canteen', icon: Coffee },
          { name: 'Bookings', href: '/bookings', icon: BookOpen },
          { name: 'Wallet', href: '/wallet', icon: IndianRupee },
          { name: 'AI Assistant', href: '/ai-assistant', icon: MessageCircle },
        ];
      case 'faculty':
        return [
          ...baseItems,
          { name: 'Timetable', href: '/timetable', icon: Calendar },
          { name: 'Events', href: '/events', icon: Users },
          { name: 'Library', href: '/library', icon: Library },
          { name: 'Canteen', href: '/canteen', icon: Coffee },
          { name: 'Bookings', href: '/bookings', icon: BookOpen },
          { name: 'Wallet', href: '/wallet', icon: IndianRupee },
          { name: 'Expense Management', href: '/expense-management', icon: IndianRupee },
        ];
      case 'admin':
        return [
          ...baseItems,
          { name: 'Timetable', href: '/timetable', icon: Calendar },
          { name: 'Events', href: '/events', icon: Users },
          { name: 'Library', href: '/library', icon: Library },
          { name: 'Canteen', href: '/canteen', icon: Coffee },
          { name: 'Bookings', href: '/bookings', icon: BookOpen },
          { name: 'Wallet', href: '/wallet', icon: IndianRupee },
          { name: 'Expense Management', href: '/expense-management', icon: IndianRupee },
          { name: 'AI Assistant', href: '/ai-assistant', icon: MessageCircle },
          { name: 'Settings', href: '/settings', icon: Settings },
        ];
      case 'canteen_staff':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
          { name: 'Canteen Management', href: '/canteen', icon: Coffee },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/80 backdrop-blur-sm shadow-2xl border-r border-gray-700/50">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">
              {user?.role === 'student' && 'Student Portal'}
              {user?.role === 'faculty' && 'Faculty Portal'}
              {user?.role === 'admin' && 'Admin Portal'}
              {user?.role === 'canteen_staff' && 'Canteen Management'}
            </h2>
            <div className="h-1 bg-gradient-primary rounded-full"></div>
          </div>
          
          <nav className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${
                    isActive ? 'sidebar-item-active' : 'text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <main className="flex-1 p-6 bg-gray-900 min-h-screen animate-fade-in">
          {children}
        </main>
      </div>

      {/* AI Assistant - Available on all pages */}
      <AIAssistant />
    </div>
  );
};

export default Layout;
