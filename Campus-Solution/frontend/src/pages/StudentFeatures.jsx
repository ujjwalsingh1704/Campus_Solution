import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Award, 
  MessageCircle, 
  Users, 
  Star, 
  BookOpen, 
  Target, 
  Zap,
  ArrowRight,
  Play,
  Heart,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

const StudentFeatures = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const features = [
    {
      id: 'discover',
      title: 'AI-Powered Discovery',
      icon: <Brain className="w-6 h-6" />,
      description: 'Find clubs and opportunities that match your interests perfectly'
    },
    {
      id: 'passport',
      title: 'Skill Passport',
      icon: <Award className="w-6 h-6" />,
      description: 'Track achievements and showcase your growth journey'
    },
    {
      id: 'assistant',
      title: 'Smart Assistant',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Get personalized guidance and instant answers'
    }
  ];

  const clubs = [
    {
      name: 'Robotics Club',
      category: 'Technology',
      members: 156,
      match: 95,
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['AI', 'Engineering', 'Innovation']
    },
    {
      name: 'Photography Society',
      category: 'Arts',
      members: 89,
      match: 88,
      image: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Creative', 'Visual Arts', 'Portfolio']
    },
    {
      name: 'Debate Team',
      category: 'Academic',
      members: 67,
      match: 82,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Public Speaking', 'Critical Thinking', 'Competition']
    }
  ];

  const achievements = [
    { name: 'First Club Join', icon: <Users className="w-6 h-6" />, earned: true, date: '2024-01-15' },
    { name: 'Event Organizer', icon: <Calendar className="w-6 h-6" />, earned: true, date: '2024-02-20' },
    { name: 'Leadership Role', icon: <Star className="w-6 h-6" />, earned: true, date: '2024-03-10' },
    { name: 'Mentor', icon: <BookOpen className="w-6 h-6" />, earned: false, progress: 60 },
    { name: 'Innovation Award', icon: <Zap className="w-6 h-6" />, earned: false, progress: 30 },
    { name: 'Community Builder', icon: <Heart className="w-6 h-6" />, earned: false, progress: 45 }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Student Features
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover your perfect campus community with AI-powered recommendations, gamified achievements, and intelligent assistance
          </p>
          <Link 
            to="/student-dashboard"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>Try Student Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center mb-12 space-x-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === feature.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {feature.icon}
                <span>{feature.title}</span>
              </button>
            ))}
          </div>

          {/* AI Discovery Tab */}
          {activeTab === 'discover' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    AI-Powered Discovery
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Our intelligent matching system analyzes your interests, skills, academic goals, and personality to recommend the perfect clubs and opportunities for you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-cyan-400" />
                    <span className="text-lg">Smart personality-based matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-blue-400" />
                    <span className="text-lg">Goal-oriented recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-lg">Continuous learning and improvement</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {clubs.map((club, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={club.image} 
                        alt={club.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">{club.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-cyan-400 font-bold">{club.match}% match</span>
                          </div>
                        </div>
                        <p className="text-gray-400 mb-2">{club.category} • {club.members} members</p>
                        <div className="flex flex-wrap gap-2">
                          {club.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Passport Tab */}
          {activeTab === 'passport' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Skill Passport
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Track your growth journey with our gamified achievement system. Earn verified badges, showcase your skills, and unlock new opportunities as you progress.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg">Verified achievements and certifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-lg">Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    <span className="text-lg">Skill development recommendations</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-center">Your Achievement Progress</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                          : 'bg-gray-700/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.earned 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                            : 'bg-gray-600 text-gray-400'
                        }`}>
                          {achievement.icon}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-center mb-1">{achievement.name}</h4>
                      {achievement.earned ? (
                        <p className="text-xs text-green-400 text-center">Earned {achievement.date}</p>
                      ) : (
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Overall Progress</p>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full w-1/2"></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">3 of 6 achievements unlocked</p>
                </div>
              </div>
            </div>
          )}

          {/* Smart Assistant Tab */}
          {activeTab === 'assistant' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Smart Assistant
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Get instant, personalized guidance with our AI-powered chatbot. Ask questions, get recommendations, and navigate your campus journey with confidence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                    <span className="text-lg">24/7 intelligent support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <span className="text-lg">Contextual recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg">Proactive notifications and reminders</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Campus Assistant</h3>
                    <p className="text-sm text-green-400">Online</p>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-sm max-w-xs">
                      <p className="text-sm">Hi! I'm your campus assistant. How can I help you today?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl rounded-br-sm max-w-xs">
                      <p className="text-sm text-white">I'm interested in joining a tech club</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-sm max-w-xs">
                      <p className="text-sm">Great! Based on your profile, I found 3 tech clubs that match your interests. The Robotics Club has a 95% compatibility with your skills. Would you like me to show you more details?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl rounded-br-sm max-w-xs">
                      <p className="text-sm text-white">Yes, please!</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-full hover:from-green-500 hover:to-emerald-600 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Ready to Discover Your Perfect Campus Community?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who have already found their place on campus with CampusConnect AI
          </p>
          <Link 
            to="/student-dashboard"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentFeatures;
