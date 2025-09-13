import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  Chrome,
  Github,
  Linkedin
} from 'lucide-react';

const SSOLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.name);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      alert(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async (provider) => {
    setLoading(true);
    try {
      // Simulate SSO login - in real implementation, this would redirect to OAuth provider
      const ssoEmail = `user@${provider}.com`;
      const ssoName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      
      // Auto-assign role based on email domain for demo
      let role = 'student';
      if (ssoEmail.includes('faculty') || ssoEmail.includes('prof')) {
        role = 'faculty';
      } else if (ssoEmail.includes('admin')) {
        role = 'admin';
      }

      await login(ssoEmail, 'sso-login', ssoName, role);
      navigate('/dashboard');
    } catch (error) {
      console.error('SSO login error:', error);
      alert('SSO login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginOptions = [
    { email: 'student@nmims.edu', role: 'student', name: 'John Student' },
    { email: 'faculty@nmims.edu', role: 'faculty', name: 'Dr. Jane Faculty' },
    { email: 'admin@nmims.edu', role: 'admin', name: 'Admin User' }
  ];

  const handleQuickLogin = async (option) => {
    setLoading(true);
    try {
      await login(option.email, 'demo', option.name, option.role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Quick login error:', error);
      alert('Quick login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-gray-300">
            {isLogin ? 'Sign in to your Campus Solutions account' : 'Join the Campus Solutions community'}
          </p>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSSOLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <Chrome size={20} />
            <span>Continue with Google</span>
          </button>
          
          <button
            onClick={() => handleSSOLogin('microsoft')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <Linkedin size={20} />
            <span>Continue with Microsoft</span>
          </button>

          <button
            onClick={() => handleSSOLogin('github')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <Github size={20} />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Login for Demo */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-400">Quick Demo Login:</p>
          <div className="grid grid-cols-3 gap-2">
            {quickLoginOptions.map((option) => (
              <button
                key={option.role}
                onClick={() => handleQuickLogin(option)}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded-md transition-colors disabled:opacity-50 capitalize"
              >
                {option.role}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Form */}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSOLogin;
