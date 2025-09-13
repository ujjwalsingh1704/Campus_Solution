import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Star, 
  Calendar, 
  MessageCircle, 
  Award, 
  TrendingUp,
  Users,
  BookOpen,
  Heart,
  Filter,
  MapPin,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const recommendations = [
    {
      id: 1,
      name: 'AI Research Club',
      category: 'Technology',
      match: 96,
      members: 89,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Explore cutting-edge AI research and collaborate on innovative projects',
      tags: ['Machine Learning', 'Research', 'Innovation'],
      nextEvent: 'Workshop: Neural Networks 101',
      eventDate: 'Tomorrow, 6:00 PM'
    },
    {
      id: 2,
      name: 'Photography Society',
      category: 'Arts',
      match: 92,
      members: 156,
      image: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Capture moments, develop skills, and showcase your artistic vision',
      tags: ['Photography', 'Creative', 'Portfolio'],
      nextEvent: 'Photo Walk: Campus Architecture',
      eventDate: 'Saturday, 10:00 AM'
    },
    {
      id: 3,
      name: 'Entrepreneurship Hub',
      category: 'Business',
      match: 88,
      members: 203,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Turn your ideas into reality with like-minded innovators',
      tags: ['Startup', 'Innovation', 'Networking'],
      nextEvent: 'Pitch Competition Finals',
      eventDate: 'Friday, 7:00 PM'
    }
  ];

  const myClubs = [
    {
      name: 'Robotics Club',
      role: 'Member',
      joinDate: 'Sep 2024',
      nextMeeting: 'Today, 4:00 PM',
      status: 'active'
    },
    {
      name: 'Debate Society',
      role: 'Vice President',
      joinDate: 'Aug 2024',
      nextMeeting: 'Tomorrow, 3:00 PM',
      status: 'leadership'
    }
  ];

  const achievements = [
    { name: 'First Club Join', icon: <Users className="w-4 h-4" />, earned: true, date: 'Sep 15, 2024' },
    { name: 'Event Organizer', icon: <Calendar className="w-4 h-4" />, earned: true, date: 'Oct 2, 2024' },
    { name: 'Leadership Role', icon: <Star className="w-4 h-4" />, earned: true, date: 'Nov 10, 2024' },
    { name: 'Mentor Badge', icon: <BookOpen className="w-4 h-4" />, earned: false, progress: 75 },
    { name: 'Innovation Award', icon: <Award className="w-4 h-4" />, earned: false, progress: 40 },
    { name: 'Community Builder', icon: <Heart className="w-4 h-4" />, earned: false, progress: 60 }
  ];

  const upcomingEvents = [
    {
      title: 'AI Workshop: Deep Learning Basics',
      club: 'AI Research Club',
      date: 'Tomorrow',
      time: '6:00 PM',
      location: 'Tech Building, Room 301',
      attendees: 45
    },
    {
      title: 'Photography Exhibition Opening',
      club: 'Photography Society',
      date: 'Friday',
      time: '7:00 PM',
      location: 'Art Gallery',
      attendees: 120
    },
    {
      title: 'Startup Pitch Competition',
      club: 'Entrepreneurship Hub',
      date: 'Saturday',
      time: '2:00 PM',
      location: 'Business Center Auditorium',
      attendees: 200
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, Alex!</h1>
              <p className="text-gray-300 mt-1">Discover new opportunities and track your progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
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
              { id: 'discover', label: 'Discover', icon: <Search className="w-4 h-4" /> },
              { id: 'my-clubs', label: 'My Clubs', icon: <Users className="w-4 h-4" /> },
              { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
              { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
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
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map((club) => (
                <div key={club.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-full">
                      <span className="text-white font-bold text-sm">{club.match}% match</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{club.name}</h3>
                      <span className="text-sm text-gray-400">{club.members} members</span>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{club.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-white font-medium">{club.nextEvent}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{club.eventDate}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300">
                        Join Club
                      </button>
                      <button className="px-4 py-2 border border-gray-600 hover:border-cyan-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Clubs Tab */}
        {activeTab === 'my-clubs' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">My Clubs</h2>
              <span className="text-gray-400">{myClubs.length} active memberships</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {myClubs.map((club, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{club.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      club.status === 'leadership' 
                        ? 'bg-yellow-500/20 text-yellow-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {club.role}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Joined</span>
                      <span className="text-white">{club.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Next Meeting</span>
                      <span className="text-cyan-400">{club.nextMeeting}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-semibold text-white transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-600 hover:border-cyan-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">3/6</p>
                <p className="text-gray-400 text-sm">Badges Earned</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                      : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
                    
                    {achievement.earned ? (
                      <p className="text-green-400 text-sm">Earned on {achievement.date}</p>
                    ) : (
                      <div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-sm">{achievement.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-6 rounded-2xl border border-cyan-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Progress Insights</h3>
              </div>
              <p className="text-gray-300 mb-4">
                You're making great progress! Complete 2 more achievements to unlock the "Campus Leader" status.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full w-1/2"></div>
                </div>
                <span className="text-cyan-400 font-semibold">50% to next level</span>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold text-white transition-colors">
                View Calendar
              </button>
            </div>

            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-cyan-400 mb-3">{event.club}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-300">
                        Attend
                      </button>
                      <button className="px-4 py-2 border border-gray-600 hover:border-cyan-400 rounded-lg text-gray-300 hover:text-white transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
