import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Network, Menu, X, Users, Building2 } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Network className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CampusConnect AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/students" 
              className={`flex items-center space-x-1 transition-colors ${isActive('/students') || isActive('/student-dashboard') ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>For Students</span>
            </Link>
            <Link 
              to="/organizations" 
              className={`flex items-center space-x-1 transition-colors ${isActive('/organizations') || isActive('/organization-dashboard') ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Organizations</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/student-login"
                className="px-4 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-full font-semibold transition-all duration-300"
              >
                Student Login
              </Link>
              <Link 
                to="/organization-login"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Org Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/95 backdrop-blur-md rounded-lg mt-2">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'text-cyan-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/students" 
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/students') ? 'text-cyan-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                For Students
              </Link>
              <Link 
                to="/organizations" 
                className={`block px-3 py-2 rounded-md transition-colors ${isActive('/organizations') ? 'text-cyan-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                For Organizations
              </Link>
              <Link 
                to="/student-login" 
                className="block px-3 py-2 rounded-md text-cyan-400 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Student Login
              </Link>
              <Link 
                to="/organization-login" 
                className="block px-3 py-2 rounded-md text-cyan-400 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Organization Login
              </Link>
              <Link 
                to="/student-dashboard" 
                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Student Dashboard
              </Link>
              <Link 
                to="/organization-dashboard" 
                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Organization Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
