import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Users, Calendar, MapPin, Utensils, BookOpen, Star, ChevronRight, Play, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const { login, register } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isLogin 
        ? await login(formData)
        : await register(formData);

      if (!result.success) {
        setError(result.error);
      } else {
        setShowModal(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openLoginModal = () => {
    setIsLogin(true);
    setShowModal(true);
    setError('');
    setFormData({ email: '', password: '', name: '', role: 'student' });
  };

  const openSignupModal = () => {
    setIsLogin(false);
    setShowModal(true);
    setError('');
    setFormData({ email: '', password: '', name: '', role: 'student' });
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
      title: "Smart Timetable",
      description: "AI-powered scheduling with real-time updates and conflict detection"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-400" />,
      title: "Resource Booking",
      description: "Book labs, classrooms, and facilities with instant approval workflow"
    },
    {
      icon: <Utensils className="w-8 h-8 text-orange-400" />,
      title: "Digital Canteen",
      description: "Order food online, track orders, and manage payments seamlessly"
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-400" />,
      title: "Campus Navigation",
      description: "Interactive maps with AR directions and real-time location tracking"
    },
    {
      icon: <Users className="w-8 h-8 text-pink-400" />,
      title: "Event Management",
      description: "Create, manage, and participate in campus events and activities"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Gamification",
      description: "Earn points, badges, and compete on leaderboards for engagement"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "Campus Solution has transformed how I manage my academic life. The timetable feature is incredible!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Faculty, Engineering",
      content: "The resource booking system has streamlined our lab management. Highly recommended!",
      rating: 5
    },
    {
      name: "Admin Office",
      role: "Campus Administration",
      content: "Event management and analytics have made our operations so much more efficient.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Campus Solution</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openLoginModal}
                className="px-4 py-2 rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-blue-600/20"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Full Width - Hero Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Complete
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Campus Solution
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Streamline your academic journey with AI-powered scheduling, smart resource management, 
                and seamless campus integration. Everything you need in one powerful platform.
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Smart Scheduling</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Resource Booking</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Digital Canteen</span>
                </div>
              </div>

              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white text-center mb-8">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join Campus Solution'}
              </h2>
              <p className="text-gray-300">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student" className="bg-gray-800">Student</option>
                  <option value="faculty" className="bg-gray-800">Faculty</option>
                  <option value="admin" className="bg-gray-800">Admin</option>
                  <option value="canteen_staff" className="bg-gray-800">Canteen Staff</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', name: '', role: 'student' });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-200 text-sm font-semibold mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-300 space-y-1">
                <p>Admin: admin@campus.edu / password123</p>
                <p>Faculty: sarah.johnson@campus.edu / password123</p>
                <p>Student: john.doe@student.campus.edu / password123</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
