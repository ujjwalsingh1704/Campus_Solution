import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { OrderProvider } from './contexts/OrderContext';
import { MenuProvider } from './contexts/MenuContext';
import { RealTimeDataProvider } from './contexts/RealTimeDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import SSOLogin from './components/SSOLogin';
import LandingPage from './pages/LandingPage';

// Dashboard Pages
import Dashboard from './pages/Dashboard';

// Feature Pages
import Timetable from './pages/Timetable';
import Events from './pages/Events';
import Library from './pages/Library';
import Canteen from './pages/Canteen';
import Booking from './pages/Booking';
import AiAssistant from './pages/AiAssistant';
import Navigation from './pages/Navigation';
import Wallet from './pages/Wallet';
import Gamification from './pages/Gamification';
import Attendance from './pages/Attendance';
import UserManagement from './pages/UserManagement';
import SubjectManagement from './pages/SubjectManagement';
import ExpenseManagement from './pages/ExpenseManagement';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import RoleBasedAccessTest from './components/RoleBasedAccessTest';

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('AppContent - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    return <LandingPage />;
  }

  // Show dashboard with navigation for authenticated users
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        {/* Default route redirects based on user role */}
        <Route path="/" element={<Navigate to={user?.role === 'canteen_staff' ? "/canteen" : "/dashboard"} replace />} />
        
        {/* Auth routes (accessible even when logged in for role switching) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sso-login" element={<SSOLogin />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/timetable" element={
          <ProtectedRoute>
            <Timetable />
          </ProtectedRoute>
        } />

        <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />

        <Route path="/library" element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />

        <Route path="/canteen" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin', 'canteen_staff']}>
            <Canteen />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />

        <Route path="/ai-assistant" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <AiAssistant />
          </ProtectedRoute>
        } />

        <Route path="/navigation" element={
          <ProtectedRoute>
            <Navigation />
          </ProtectedRoute>
        } />

        <Route path="/wallet" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
            <Wallet />
          </ProtectedRoute>
        } />

        <Route path="/gamification" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <Gamification />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={['faculty', 'student', 'admin']}>
            <Attendance />
          </ProtectedRoute>
        } />

        <Route path="/user-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />

        <Route path="/subject-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SubjectManagement />
          </ProtectedRoute>
        } />

        <Route path="/expense-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ExpenseManagement />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
            <Notifications />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/access-test" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RoleBasedAccessTest />
          </ProtectedRoute>
        } />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

// Unauthorized Page Component
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
      <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
      <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
        Go to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <OrderProvider>
          <MenuProvider>
            <RealTimeDataProvider>
              <Router>
                <AppContent />
              </Router>
            </RealTimeDataProvider>
          </MenuProvider>
        </OrderProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
