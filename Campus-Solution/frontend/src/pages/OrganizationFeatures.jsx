import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Calendar, 
  Palette, 
  Users, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Play,
  Zap,
  Brain,
  Clock,
  TrendingUp,
  Mail,
  Bell
} from 'lucide-react';

const OrganizationFeatures = () => {
  const [activeTab, setActiveTab] = useState('recruitment');

  const features = [
    {
      id: 'recruitment',
      title: 'Smart Recruitment',
      icon: <Target className="w-6 h-6" />,
      description: 'Find and connect with ideal candidates using AI'
    },
    {
      id: 'scheduling',
      title: 'Auto Scheduling',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Intelligent calendar management and coordination'
    },
    {
      id: 'content',
      title: 'AI Content Creation',
      icon: <Palette className="w-6 h-6" />,
      description: 'Generate stunning posters and promotional content'
    }
  ];

  const candidates = [
    {
      name: 'Alex Chen',
      skills: ['React', 'Python', 'Machine Learning'],
      match: 96,
      year: 'Junior',
      gpa: 3.8,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Sarah Johnson',
      skills: ['UI/UX', 'Figma', 'User Research'],
      match: 92,
      year: 'Sophomore',
      gpa: 3.9,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Marcus Williams',
      skills: ['Java', 'Spring Boot', 'AWS'],
      match: 89,
      year: 'Senior',
      gpa: 3.7,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const meetings = [
    {
      title: 'Weekly Team Standup',
      time: '10:00 AM',
      date: 'Today',
      attendees: 8,
      type: 'recurring'
    },
    {
      title: 'New Member Orientation',
      time: '2:00 PM',
      date: 'Tomorrow',
      attendees: 12,
      type: 'event'
    },
    {
      title: 'Project Review Meeting',
      time: '4:00 PM',
      date: 'Friday',
      attendees: 6,
      type: 'meeting'
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Organization Features
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline recruitment, automate tasks, and grow your community with intelligent tools designed for modern campus organizations
          </p>
          <Link 
            to="/organization-dashboard"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>Try Organization Dashboard</span>
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {feature.icon}
                <span>{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Smart Recruitment Tab */}
          {activeTab === 'recruitment' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Smart Recruitment
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Find the perfect candidates for your organization using AI-powered matching. Our system analyzes skills, interests, and compatibility to recommend ideal members.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-orange-400" />
                    <span className="text-lg">AI-powered candidate matching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-red-400" />
                    <span className="text-lg">Skill-based filtering and search</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-lg">Performance analytics and insights</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span>Top Candidates</span>
                  </h3>
                  {candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl mb-3 last:mb-0 hover:bg-gray-700/70 transition-colors">
                      <img 
                        src={candidate.avatar} 
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{candidate.name}</h4>
                          <span className="text-orange-400 font-bold">{candidate.match}% match</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{candidate.year} • GPA: {candidate.gpa}</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-sm font-semibold transition-all duration-300">
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Auto Scheduling Tab */}
          {activeTab === 'scheduling' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Auto Scheduling
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Streamline your organization's calendar management with intelligent scheduling. Automatically coordinate meetings, events, and activities based on member availability.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                    <span className="text-lg">Smart meeting coordination</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-purple-400" />
                    <span className="text-lg">Availability optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg">Automated reminders and notifications</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>Upcoming Schedule</span>
                  </h3>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {meetings.map((meeting, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        meeting.type === 'recurring' ? 'bg-green-400' :
                        meeting.type === 'event' ? 'bg-blue-400' : 'bg-purple-400'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{meeting.title}</h4>
                        <p className="text-sm text-gray-400">{meeting.date} at {meeting.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{meeting.attendees} attendees</p>
                        <p className="text-xs text-gray-400">Auto-scheduled</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">Smart Suggestion</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Based on member availability, the best time for your next team meeting is Thursday at 3:00 PM. 
                    <button className="text-indigo-400 hover:text-indigo-300 ml-1 font-semibold">Schedule now?</button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Content Creation Tab */}
          {activeTab === 'content' && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                    AI Content Creation
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Create stunning event posters, social media content, and promotional materials in seconds. Our AI understands your brand and generates professional-quality designs automatically.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-6 h-6 text-teal-400" />
                    <span className="text-lg">AI-powered poster generation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                    <span className="text-lg">Social media content creation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-green-400" />
                    <span className="text-lg">Email campaign templates</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-teal-400" />
                    <span>Generated Content</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 p-4 rounded-xl border border-teal-500/30">
                      <div className="w-full h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h4 className="font-bold text-lg">HACKATHON</h4>
                          <p className="text-sm">March 15-17</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">Event Poster</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30">
                      <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h4 className="font-bold text-lg">JOIN US</h4>
                          <p className="text-sm">New Members</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">Recruitment Flyer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold mb-1">Generate New Content</h4>
                      <p className="text-sm text-gray-400">Describe what you need and AI will create it</p>
                    </div>
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                      Create
                    </button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-sm">Workshop announcement poster</span>
                      <span className="text-xs text-green-400">Generated 2h ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-sm">Instagram story template</span>
                      <span className="text-xs text-green-400">Generated 1d ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-sm">Email newsletter design</span>
                      <span className="text-xs text-green-400">Generated 3d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Powerful Analytics
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track your organization's growth and engagement with comprehensive analytics and insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-semibold">Member Growth</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">+24%</div>
              <p className="text-gray-300">This semester</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-semibold">Active Members</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">156</div>
              <p className="text-gray-300">Currently engaged</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-semibold">Event Attendance</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">89%</div>
              <p className="text-gray-300">Average rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Ready to Transform Your Organization?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of campus organizations already using CampusConnect AI to streamline operations and grow their communities
          </p>
          <Link 
            to="/organization-dashboard"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default OrganizationFeatures;
