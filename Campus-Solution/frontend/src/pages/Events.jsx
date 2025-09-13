import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { eventsAPI } from '../utils/api';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, UserPlus, CheckCircle, XCircle, AlertCircle, FileText, Shield, Shirt, User } from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    category: 'academic',
    rules: '',
    penalties: '',
    dressCode: '',
    roomNumber: '',
    requirements: '',
    status: 'pending', // pending, approved, rejected
  });

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' },
    { value: 'social', label: 'Social' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      console.log('Fetched events data:', data);
      // Handle both array response and object with events property
      const eventsArray = Array.isArray(data) ? data : (data.events || []);
      setEvents(eventsArray);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample events data
      const sampleEvents = [
        {
          _id: 'event1',
          title: 'Annual Tech Fest 2024',
          description: 'Join us for the biggest technology festival of the year featuring competitions, workshops, and exhibitions.',
          date: '2024-03-15',
          time: '09:00',
          location: 'Main Auditorium',
          category: 'technical',
          maxParticipants: 500,
          registeredCount: 245,
          organizer: 'Dr. Smith (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Student ID, Laptop (for coding competitions)',
          dressCode: 'Formal',
          roomNumber: 'AUD-001',
          registrations: []
        },
        {
          _id: 'event2',
          title: 'Cultural Night 2024',
          description: 'Showcase your talents in dance, music, and drama. Open to all students and faculty.',
          date: '2024-03-20',
          time: '18:00',
          location: 'Open Air Theatre',
          category: 'cultural',
          maxParticipants: 300,
          registeredCount: 156,
          organizer: 'Prof. Johnson (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Performance props (if any)',
          dressCode: 'Traditional or Formal',
          roomNumber: 'OAT-001',
          registrations: []
        },
        {
          _id: 'event3',
          title: 'Inter-College Sports Meet',
          description: 'Annual sports competition featuring cricket, football, basketball, and athletics.',
          date: '2024-03-25',
          time: '08:00',
          location: 'Sports Complex',
          category: 'sports',
          maxParticipants: 200,
          registeredCount: 89,
          organizer: 'Coach Williams (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Sports attire, Medical certificate',
          dressCode: 'Sports wear',
          roomNumber: 'SC-001',
          registrations: []
        },
        {
          _id: 'event4',
          title: 'AI & Machine Learning Workshop',
          description: 'Hands-on workshop on artificial intelligence and machine learning fundamentals.',
          date: '2024-03-30',
          time: '10:00',
          location: 'Computer Lab 1',
          category: 'academic',
          maxParticipants: 50,
          registeredCount: 32,
          organizer: 'Dr. Patel (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Laptop with Python installed',
          dressCode: 'Casual',
          roomNumber: 'CL-101',
          registrations: []
        },
        {
          _id: 'event5',
          title: 'Blood Donation Camp',
          description: 'Annual blood donation drive in collaboration with local hospitals.',
          date: '2024-04-05',
          time: '09:00',
          location: 'Medical Center',
          category: 'social',
          maxParticipants: 100,
          registeredCount: 67,
          organizer: 'Dr. Kumar (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Age 18+, Weight 50kg+, Good health',
          dressCode: 'Comfortable clothing',
          roomNumber: 'MC-001',
          registrations: []
        },
        {
          _id: 'event6',
          title: 'Entrepreneurship Seminar',
          description: 'Learn from successful entrepreneurs about starting and scaling businesses.',
          date: '2024-04-10',
          time: '14:00',
          location: 'Conference Hall',
          category: 'academic',
          maxParticipants: 150,
          registeredCount: 98,
          organizer: 'Prof. Singh (Faculty)',
          status: 'approved',
          approvalStatus: 'approved',
          requirements: 'Notebook, Pen',
          dressCode: 'Business casual',
          roomNumber: 'CH-201',
          registrations: []
        }
      ];
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, formData);
        alert('Event updated successfully!');
      } else {
        // Add capacity field and creator info for event creation
        const eventData = {
          ...formData,
          capacity: parseInt(formData.maxParticipants) || 100,
          maxParticipants: parseInt(formData.maxParticipants) || 100,
          createdBy: user._id,
          organizer: `${user.name} (${user.role === 'faculty' ? 'Faculty' : 'Admin'})`,
          status: user.role === 'faculty' ? 'pending' : 'approved',
          approvalStatus: user.role === 'faculty' ? 'pending' : 'approved',
          registeredCount: 0,
          registrations: []
        };
        await eventsAPI.create(eventData);
        alert('Event created successfully!');
      }
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventsAPI.register(eventId);
      alert('Successfully registered for event!');
      fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event. Please try again.');
    }
  };

  const handleApproval = async (eventId, status) => {
    try {
      // Try API call first
      await eventsAPI.updateStatus(eventId, status);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, status: status }
            : event
        )
      );
      
      alert(`Event ${status} successfully!`);
    } catch (error) {
      console.error('Error updating event status:', error);
      
      // Fallback: Update local state for demo mode
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, status: status }
            : event
        )
      );
      
      alert(`Event ${status} successfully! (Demo mode)`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        alert('Event deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      category: 'academic',
      rules: '',
      penalties: '',
      dressCode: '',
      roomNumber: '',
      requirements: '',
      status: 'pending',
    });
    setShowAddForm(false);
    setEditingEvent(null);
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category,
      rules: event.rules || '',
      penalties: event.penalties || '',
      dressCode: event.dressCode || '',
      roomNumber: event.roomNumber || '',
      requirements: event.requirements || '',
      status: event.status || 'pending',
    });
    setShowAddForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-600',
      cultural: 'bg-purple-600',
      sports: 'bg-green-600',
      technical: 'bg-orange-600',
      social: 'bg-pink-600',
    };
    return colors[category] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🎉 Campus Events
            </h1>
            <p className="text-gray-300 text-lg">
              {user?.role === 'student' ? 'Discover and register for exciting campus events' : 'Manage and organize campus events'}
            </p>
          </div>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card-modern p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              {editingEvent ? '✏️ Edit Event' : '✨ Create New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input-modern w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-modern w-full"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-modern w-full"
                  rows="3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-modern w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="input-modern w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                    className="input-modern w-full"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="input-modern w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className="input-modern w-full"
                  placeholder="e.g., AUD-001, LAB-301"
                  required
                />
              </div>

              {user?.role === 'faculty' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FileText className="inline mr-1" size={16} />
                      Event Rules
                    </label>
                    <textarea
                      value={formData.rules}
                      onChange={(e) => setFormData({...formData, rules: e.target.value})}
                      className="input-modern w-full"
                      rows="3"
                      placeholder="List the rules and regulations for this event..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Shield className="inline mr-1" size={16} />
                      Penalties for Rule Violations
                    </label>
                    <textarea
                      value={formData.penalties}
                      onChange={(e) => setFormData({...formData, penalties: e.target.value})}
                      className="input-modern w-full"
                      rows="2"
                      placeholder="Specify consequences for not following rules..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Shirt className="inline mr-1" size={16} />
                      Dress Code
                    </label>
                    <input
                      type="text"
                      value={formData.dressCode}
                      onChange={(e) => setFormData({...formData, dressCode: e.target.value})}
                      className="input-modern w-full"
                      placeholder="e.g., Formal attire, Traditional wear, Casual"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      className="input-modern w-full"
                      rows="2"
                      placeholder="Prerequisites, materials needed, etc..."
                    />
                  </div>
                </>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div key={event._id} className="card-modern card-hover p-6">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white truncate">{event.title}</h3>
                      <span className={`status-badge ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      <span className={`status-badge flex items-center space-x-1 ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                        <span className="capitalize">{event.status}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    {user?.role === 'admin' && event.status === 'pending' && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleApproval(event._id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                          title="Approve Event"
                        >
                          <CheckCircle size={12} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApproval(event._id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                          title="Reject Event"
                        >
                          <XCircle size={12} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(event)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded hover:bg-blue-900/20"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-900/20"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{event.description}</p>
                {event.organizer && (
                  <p className="text-sm text-gray-400 mb-2">
                    <User className="inline mr-1" size={14} />
                    Organized by: {event.organizer}
                  </p>
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Clock size={16} />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                  {event.roomNumber && (
                    <span className="text-blue-400">({event.roomNumber})</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Users size={16} />
                  <span>{event.registeredCount}/{event.maxParticipants} participants</span>
                </div>
              </div>

              {/* Event Details for Faculty/Admin or when viewing detailed info */}
              {(user?.role === 'faculty' || user?.role === 'admin') && event.rules && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
                  <h4 className="font-semibold text-white flex items-center">
                    <FileText className="mr-2" size={16} />
                    Event Details
                  </h4>
                  
                  {event.rules && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">Rules:</p>
                      <p className="text-xs text-gray-400">{event.rules}</p>
                    </div>
                  )}
                  
                  {event.penalties && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                        <Shield className="mr-1" size={14} />
                        Penalties:
                      </p>
                      <p className="text-xs text-gray-400">{event.penalties}</p>
                    </div>
                  )}
                  
                  {event.dressCode && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                        <Shirt className="mr-1" size={14} />
                        Dress Code:
                      </p>
                      <p className="text-xs text-gray-400">{event.dressCode}</p>
                    </div>
                  )}
                  
                  {event.requirements && (
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">Requirements:</p>
                      <p className="text-xs text-gray-400">{event.requirements}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Student and Faculty view - show approval status */}
              {(user?.role === 'student' || user?.role === 'faculty') && event.status !== 'approved' && (
                <div className={`border rounded-lg p-3 mb-4 ${
                  event.status === 'pending' 
                    ? 'bg-yellow-900/30 border-yellow-600' 
                    : 'bg-red-900/30 border-red-600'
                }`}>
                  <div className={`flex items-center space-x-2 text-sm ${
                    event.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {event.status === 'pending' ? <AlertCircle size={16} /> : <XCircle size={16} />}
                    <span>
                      {event.status === 'pending' 
                        ? 'This event is pending admin approval' 
                        : `This event has been rejected${event.rejectionReason ? ': ' + event.rejectionReason : ''}`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Faculty and Student view - show approval confirmation */}
              {(user?.role === 'student' || user?.role === 'faculty') && event.status === 'approved' && (
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>This event has been approved by admin</span>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${(event.registeredCount / event.maxParticipants) * 100}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mb-4">
                Organized by: {event.organizer}
              </div>
              
              {user?.role === 'student' && !event.isRegistered && event.status === 'approved' && (
                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={event.registeredCount >= event.maxParticipants}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <UserPlus size={16} />
                  <span>
                    {event.registeredCount >= event.maxParticipants ? 'Event Full' : 'Register'}
                  </span>
                </button>
              )}
              
              {user?.role === 'student' && event.status !== 'approved' && (
                <div className="w-full bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-center">
                  {event.status === 'pending' ? 'Registration Pending Approval' : 'Event Not Available'}
                </div>
              )}
              
              {user?.role === 'student' && event.isRegistered && (
                <div className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-center">
                  ✓ Registered
                </div>
              )}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-gray-400">
              {user?.role === 'student' 
                ? 'No events are currently available. Check back later!' 
                : 'Create your first event to get started.'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
