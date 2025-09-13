import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Search,
  Bell,
  User,
  TrendingUp,
  MessageSquare,
  Target,
  Palette,
  Clock,
  Mail,
  Star,
  Eye,
  Edit,
  Send
} from 'lucide-react';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Members', value: '156', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'text-blue-400' },
    { label: 'Active This Week', value: '89', change: '+8%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-400' },
    { label: 'Upcoming Events', value: '7', change: '+2', icon: <Calendar className="w-6 h-6" />, color: 'text-purple-400' },
    { label: 'Applications', value: '23', change: '+15', icon: <Target className="w-6 h-6" />, color: 'text-orange-400' }
  ];

  const recentApplications = [
    {
      name: 'Sarah Chen',
      skills: ['React', 'Node.js', 'UI/UX'],
      match: 94,
      appliedDate: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Marcus Johnson',
      skills: ['Python', 'Machine Learning', 'Data Science'],
      match: 91,
      appliedDate: '5 hours ago',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Rodriguez',
      skills: ['Marketing', 'Content Creation', 'Social Media'],
      match: 88,
      appliedDate: '1 day ago',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Weekly Team Meeting',
      date: 'Today',
      time: '4:00 PM',
      attendees: 12,
      type: 'meeting'
    },
    {
      title: 'New Member Orientation',
      date: 'Tomorrow',
      time: '6:00 PM',
      attendees: 8,
      type: 'orientation'
    },
    {
      title: 'Hackathon Planning Session',
      date: 'Friday',
      time: '3:00 PM',
      attendees: 15,
      type: 'planning'
    }
  ];

  const members = [
    { name: 'Alex Thompson', role: 'President', joinDate: 'Aug 2023', status: 'active', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Jessica Wang', role: 'Vice President', joinDate: 'Sep 2023', status: 'active', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'David Kim', role: 'Secretary', joinDate: 'Oct 2023', status: 'active', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Maria Garcia', role: 'Treasurer', joinDate: 'Nov 2023', status: 'active', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'James Wilson', role: 'Member', joinDate: 'Dec 2023', status: 'inactive', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150' }
  ];

  const contentTemplates = [
    {
      type: 'Event Poster',
      title: 'Hackathon 2025',
      status: 'Generated',
      date: '2 hours ago',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      type: 'Social Media Post',
      title: 'New Member Welcome',
      status: 'Draft',
      date: '1 day ago',
      preview: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      type: 'Email Newsletter',
      title: 'Monthly Update',
      status: 'Scheduled',
      date: '3 days ago',
      preview: 'bg-gradient-to-br from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Robotics Club Dashboard</h1>
              <p className="text-gray-300 mt-1">Manage your organization and grow your community</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300">
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
              { id: 'applications', label: 'Applications', icon: <Target className="w-4 h-4" /> },
              { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
              { id: 'content', label: 'Content', icon: <Palette className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-700/50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Recent Applications</h3>
                <div className="space-y-4">
                  {recentApplications.map((application, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-colors">
                      <img 
                        src={application.avatar} 
                        alt={application.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white">{application.name}</h4>
                          <span className="text-purple-400 font-bold text-sm">{application.match}% match</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{application.appliedDate}</p>
                        <div className="flex flex-wrap gap-1">
                          {application.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-400' :
                        event.type === 'orientation' ? 'bg-green-400' : 'bg-purple-400'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                        <p className="text-gray-400 text-sm">{event.date} at {event.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{event.attendees}</p>
                        <p className="text-xs text-gray-400">attendees</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 border border-gray-600 hover:border-purple-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Members</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Member</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Join Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {members.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-medium text-white">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{member.role}</td>
                        <td className="px-6 py-4 text-gray-300">{member.joinDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            member.status === 'active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Membership Applications</h2>
              <span className="text-gray-400">{recentApplications.length} pending applications</span>
            </div>

            <div className="space-y-6">
              {recentApplications.map((application, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={application.avatar} 
                        alt={application.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{application.name}</h3>
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-purple-400 font-bold">{application.match}% match</span>
                          <span className="text-gray-400 text-sm">Applied {application.appliedDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {application.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition-colors">
                        Accept
                      </button>
                      <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition-colors">
                        Review
                      </button>
                      <button className="px-6 py-2 border border-gray-600 hover:border-red-400 rounded-lg text-gray-300 hover:text-red-400 transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Events Management</h2>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300">
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} registered</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-white transition-colors">
                      Manage
                    </button>
                    <button className="px-4 py-2 border border-gray-600 hover:border-purple-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">AI Content Creation</h2>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300">
                <Plus className="w-4 h-4" />
                <span>Generate Content</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contentTemplates.map((template, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <div className={`w-full h-32 ${template.preview} rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <Palette className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{template.type}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      template.status === 'Generated' ? 'bg-green-500/20 text-green-300' :
                      template.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {template.status}
                    </span>
                    <span className="text-gray-400 text-sm">{template.date}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-white transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 border border-gray-600 hover:border-purple-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Create New Content</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <button className="p-6 border-2 border-dashed border-gray-600 hover:border-purple-400 rounded-xl text-center transition-colors group">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-purple-400" />
                  <h4 className="font-semibold text-white mb-2">Event Poster</h4>
                  <p className="text-gray-400 text-sm">Generate promotional posters for events</p>
                </button>
                
                <button className="p-6 border-2 border-dashed border-gray-600 hover:border-purple-400 rounded-xl text-center transition-colors group">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-purple-400" />
                  <h4 className="font-semibold text-white mb-2">Social Media</h4>
                  <p className="text-gray-400 text-sm">Create engaging social media content</p>
                </button>
                
                <button className="p-6 border-2 border-dashed border-gray-600 hover:border-purple-400 rounded-xl text-center transition-colors group">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-purple-400" />
                  <h4 className="font-semibold text-white mb-2">Email Campaign</h4>
                  <p className="text-gray-400 text-sm">Design newsletter and email templates</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDashboard;
