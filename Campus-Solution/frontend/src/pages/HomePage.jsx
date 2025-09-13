import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Brain, 
  Award, 
  Calendar, 
  MessageCircle, 
  Zap,
  Network,
  Sparkles,
  Play,
  ArrowRight,
  Target,
  Palette,
  BarChart3,
  BookOpen,
  Star
} from 'lucide-react';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const studentFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Matchmaking",
      description: "Personalized recommendations based on your interests, skills, and academic goals",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Skill Passport",
      description: "Gamified achievement system with verified badges and progress tracking",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Interactive Assistant",
      description: "Smart chatbot that makes club discovery simple and fun",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const orgFeatures = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Recruitment",
      description: "AI-powered tools to find and connect with ideal candidates",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Auto Scheduling",
      description: "Intelligent calendar management and meeting coordination",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "AI Poster Generator",
      description: "Automatically create stunning event posters and promotional content",
      color: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-8 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Reimagining Campus Engagement</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                CampusConnect AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              A smart platform that connects students with the right clubs, projects, and faculty initiatives through intelligent matchmaking and engaging design
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/students"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>I'm a Student</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/organizations"
                className="group px-8 py-4 border border-gray-600 hover:border-cyan-400 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-cyan-400/10 flex items-center space-x-2"
              >
                <Target className="w-5 h-5" />
                <span>I'm an Organization</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                The Challenge
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Students struggle to discover the right campus opportunities while organizations find it hard to manage recruitment efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Students Feel Lost</h3>
                  <p className="text-gray-300">Scrolling through WhatsApp groups and overcrowded noticeboards, struggling to find clubs that match their interests and goals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Organizations Struggle</h3>
                  <p className="text-gray-300">Clubs and faculty initiatives find it difficult to reach the right students and manage recruitment effectively</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Missed Connections</h3>
                  <p className="text-gray-300">Perfect matches between students and opportunities are lost in the chaos of traditional discovery methods</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-8 rounded-2xl border border-gray-600 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Current State</h4>
                  <p className="text-gray-300 text-sm">Disconnected, inefficient, overwhelming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                For Students
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover, connect, and grow with personalized recommendations and gamified experiences
            </p>
            <Link 
              to="/students"
              className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore Student Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {studentFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-3 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                For Organizations
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Streamline recruitment, automate tasks, and grow your community with intelligent tools
            </p>
            <Link 
              to="/organizations"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Explore Organization Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {orgFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-3 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Ready to Transform Your Campus Experience?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of students and organizations already using CampusConnect AI to build meaningful connections and unlock their potential
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/student-dashboard"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-12 py-4 border border-gray-600 hover:border-cyan-400 rounded-full font-bold text-xl transition-all duration-300 hover:bg-cyan-400/10">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Network className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CampusConnect AI
              </span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2025 CampusConnect AI. Reimagining Campus Engagement.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
