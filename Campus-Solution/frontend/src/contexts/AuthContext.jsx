import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based access control helper
export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role) => {
    return user?.role === role;
  };
  
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };
  
  const isStudent = () => hasRole('student');
  const isFaculty = () => hasRole('faculty');
  const isAdmin = () => hasRole('admin');
  
  return {
    hasRole,
    hasAnyRole,
    isStudent,
    isFaculty,
    isAdmin,
    currentRole: user?.role
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response;
      
      // Validate role matches if provided
      if (credentials.role && userData.role !== credentials.role) {
        return { success: false, error: `Invalid role. This account is registered as ${userData.role}.` };
      }
      
      // Update last login time
      const updatedUser = {
        ...userData,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      // Demo mode: If backend is not available, create a demo user
      if (error.message.includes('Unable to connect to server') || error.message === 'DEMO_MODE') {
        // Use provided role or determine based on email pattern
        let role = credentials.role || 'student';
        if (!credentials.role) {
          if (credentials.email.includes('admin') || credentials.email.includes('@admin.')) {
            role = 'admin';
          } else if (credentials.email.includes('faculty') || credentials.email.includes('prof') || credentials.email.includes('@faculty.')) {
            role = 'faculty';
          } else if (credentials.email.includes('canteen') || credentials.email.includes('@canteen.') || credentials.email.includes('staff')) {
            role = 'canteen_staff';
          }
        }
        
        const demoUser = {
          _id: 'demo-user',
          name: role === 'canteen_staff' ? 'Canteen Manager' : credentials.email.split('@')[0],
          email: credentials.email,
          role: role,
          department: role === 'student' ? 'Computer Science' : role === 'canteen_staff' ? 'Food Services' : 'Information Technology',
          studentId: role === 'student' ? 'STU' + Date.now().toString().slice(-6) : null,
          employeeId: role !== 'student' ? (role === 'canteen_staff' ? 'CNT001' : 'EMP' + Date.now().toString().slice(-6)) : null,
          lastLogin: new Date().toISOString().split('T')[0],
          joinDate: new Date().toISOString().split('T')[0]
        };
        
        const demoToken = 'demo-jwt-token';
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
        
        return { success: true };
      }
      
      // Handle specific error cases
      if (error.response?.status === 404 || error.message.includes('User not found')) {
        return { success: false, error: 'User not found. Please check your credentials.' };
      }
      if (error.response?.status === 401 || error.message.includes('Invalid credentials')) {
        return { success: false, error: 'Invalid email or password.' };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Dispatch event for user management to listen
      window.dispatchEvent(new CustomEvent('userRegistered', {
        detail: { user: newUser }
      }));
      
      return { success: true };
    } catch (error) {
      // Demo mode: If backend is not available, create a demo user
      if (error.message === 'DEMO_MODE' || error.message.includes('Unable to connect to server')) {
        // Auto-assign role based on email for admin signup
        let role = 'student';
        if (userData.email && userData.email.includes('admin')) {
          role = 'admin';
        } else if (userData.email && (userData.email.includes('faculty') || userData.email.includes('prof'))) {
          role = 'faculty';
        } else if (userData.email && userData.email.includes('canteen')) {
          role = 'canteen_staff';
        }
        
        const demoUser = {
          _id: 'demo-user-' + Date.now(),
          name: userData.name || userData.email?.split('@')[0] || 'Demo User',
          email: userData.email,
          role: userData.role || role,
          department: userData.department || 'Computer Science',
          studentId: role === 'student' ? 'STU' + Date.now().toString().slice(-6) : null,
          employeeId: role !== 'student' ? 'EMP' + Date.now().toString().slice(-6) : null,
          lastLogin: new Date().toISOString().split('T')[0],
          joinDate: new Date().toISOString().split('T')[0]
        };
        
        const demoToken = 'demo-jwt-token';
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setUser(demoUser);
        
        // Dispatch event for user management to listen
        window.dispatchEvent(new CustomEvent('userRegistered', {
          detail: { user: demoUser }
        }));
        
        return { success: true };
      }
      
      // Handle specific error cases for registration
      if (error.response?.status === 409 || error.message.includes('already exists')) {
        return { success: false, error: 'Email already registered. Please use a different email.' };
      }
      
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
