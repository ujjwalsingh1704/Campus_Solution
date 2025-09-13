import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { aiAPI } from '../utils/api';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const AiAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: `Hello ${user?.name}! I'm your Campus Solutions AI Assistant. I can help you with:

• Timetable information and class schedules
• Event details and registration
• Canteen menu and ordering
• Resource booking availability
• General campus information

What would you like to know?`,
        timestamp: new Date(),
      }
    ]);
  }, [user?.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPromptBasedResponse = (message, userRole) => {
    const msg = message.toLowerCase();
    
    // Role-specific responses
    if (userRole === 'admin') {
      if (msg.includes('user') || msg.includes('manage') || msg.includes('dashboard')) {
        return "As an admin, you can manage users through the User Management section, view analytics on the Admin Dashboard, and oversee all campus operations including bookings, events, and system health.";
      }
      if (msg.includes('analytics') || msg.includes('stats') || msg.includes('report')) {
        return "Check your Admin Dashboard for real-time analytics including total bookings, active events, user statistics, and pending approvals. You can click on each metric for detailed information.";
      }
    }
    
    if (userRole === 'faculty') {
      if (msg.includes('timetable') || msg.includes('schedule') || msg.includes('class')) {
        return "As faculty, you can create and manage class schedules in the Timetable section. You can add new classes, assign rooms, set timings, and manage student enrollments for your courses.";
      }
      if (msg.includes('book') || msg.includes('room') || msg.includes('lab')) {
        return "Faculty can book campus resources like conference rooms, labs, and equipment through the Booking section. Your booking requests are automatically prioritized and you can specify requirements for your sessions.";
      }
      if (msg.includes('student') || msg.includes('grade') || msg.includes('attendance')) {
        return "You can view student information, manage course enrollments, and track attendance through your faculty dashboard. Access student profiles and academic records as needed.";
      }
    }
    
    if (userRole === 'student') {
      if (msg.includes('timetable') || msg.includes('schedule') || msg.includes('class')) {
        return "View your complete class schedule in the Timetable section. It shows all your enrolled courses with timings, locations, instructors, and room numbers. You can also see upcoming classes and exam schedules.";
      }
      if (msg.includes('grade') || msg.includes('result') || msg.includes('marks')) {
        return "Check your academic performance and grades through your student dashboard. You can view semester results, assignment scores, and overall GPA tracking.";
      }
      if (msg.includes('event') || msg.includes('register') || msg.includes('club')) {
        return "Discover and register for campus events, clubs, and activities in the Events section. Join student organizations, attend workshops, and participate in cultural and technical events.";
      }
    }
    
    // Common responses for all roles
    if (msg.includes('event') || msg.includes('fest') || msg.includes('workshop')) {
      return "Check the Events section for upcoming campus activities! You can view event details, register for participation, and see what's happening around campus. Events include workshops, cultural programs, and academic seminars.";
    }
    
    if (msg.includes('food') || msg.includes('canteen') || msg.includes('order') || msg.includes('menu')) {
      return "Browse the complete canteen menu and place orders through the Canteen section. You can add items to your cart, choose payment methods (Campus Wallet, UPI, or Cash), and track your order status in real-time.";
    }
    
    if (msg.includes('book') || msg.includes('resource') || msg.includes('facility')) {
      return "Book campus facilities like computer labs, conference rooms, sports equipment, and study halls through the Booking section. Select your preferred date, time, and specify the purpose for your booking.";
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('help')) {
      return `Hello! I'm your Campus Solutions AI Assistant. As a ${userRole}, I can help you with platform navigation, answer questions about available features, and guide you through various campus services. What would you like to know?`;
    }
    
    if (msg.includes('navigation') || msg.includes('how to') || msg.includes('where')) {
      return "I can guide you through the Campus Solutions platform. Use the navigation menu to access different sections like Timetable, Events, Canteen, Bookings, and more. Each section is designed for easy access to campus services.";
    }
    
    // Default response
    return `I'm here to help you with Campus Solutions as a ${userRole}. You can ask me about timetables, events, canteen services, bookings, or any other campus-related questions. What specific information do you need?`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      // Use prompt-based responses instead of training AI
      const response = getPromptBasedResponse(currentMessage, user?.role || 'student');
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      // Simulate AI thinking time
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I encountered an error processing your request. Please try rephrasing your question or ask about timetables, events, canteen, or bookings.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAllRolePrompts = (userRole) => {
    const prompts = {
      student: {
        academic: [
          "What's my next class?",
          "Show me my complete timetable",
          "When is my exam schedule?",
          "How do I check my grades?",
          "What assignments are due?",
          "Who is my instructor for [subject]?",
          "What room is my [subject] class in?",
          "How do I view my semester results?",
          "What's my GPA?",
          "How do I enroll in courses?"
        ],
        events: [
          "Show me upcoming events",
          "How do I register for events?",
          "What cultural events are happening?",
          "Are there any workshops this week?",
          "How do I join student clubs?",
          "What's happening at Tech Fest?",
          "How do I participate in competitions?",
          "Show me sports events",
          "What are the event timings?",
          "How do I get event certificates?"
        ],
        services: [
          "What's available in the canteen?",
          "How do I order food?",
          "What payment methods are accepted?",
          "How do I track my food order?",
          "What are today's canteen specials?",
          "How do I book study rooms?",
          "How do I reserve library resources?",
          "What facilities can I book?",
          "How do I report an issue?",
          "Where is the student help desk?"
        ],
        general: [
          "How do I navigate the platform?",
          "How do I update my profile?",
          "How do I change my password?",
          "What notifications do I have?",
          "How do I contact faculty?",
          "Where can I find campus maps?",
          "What are the campus rules?",
          "How do I access WiFi?",
          "What are library hours?",
          "How do I get academic support?"
        ]
      },
      faculty: {
        teaching: [
          "How do I create a class schedule?",
          "How do I manage student enrollments?",
          "How do I take attendance?",
          "How do I upload grades?",
          "How do I create assignments?",
          "How do I schedule exams?",
          "How do I view student profiles?",
          "How do I send announcements?",
          "How do I manage course materials?",
          "How do I track student progress?"
        ],
        resources: [
          "How do I book a conference room?",
          "How do I reserve lab equipment?",
          "How do I book the auditorium?",
          "What AV equipment is available?",
          "How do I schedule faculty meetings?",
          "How do I book sports facilities?",
          "What are the booking policies?",
          "How do I cancel a booking?",
          "How do I extend my booking?",
          "Who approves faculty bookings?"
        ],
        administration: [
          "How do I submit leave requests?",
          "How do I access payroll information?",
          "How do I update my profile?",
          "How do I view my teaching load?",
          "How do I request resources?",
          "How do I report maintenance issues?",
          "What are faculty policies?",
          "How do I access research funds?",
          "How do I submit expense reports?",
          "How do I contact administration?"
        ],
        general: [
          "Show me upcoming events",
          "What's available in the canteen?",
          "How do I navigate the platform?",
          "What notifications do I have?",
          "How do I collaborate with other faculty?",
          "What professional development is available?",
          "How do I access academic calendar?",
          "What are campus emergency procedures?",
          "How do I get technical support?",
          "Where can I find faculty resources?"
        ]
      },
      admin: {
        management: [
          "Show me user analytics",
          "How do I manage users?",
          "What are pending approvals?",
          "How do I create new user accounts?",
          "How do I deactivate users?",
          "How do I reset user passwords?",
          "How do I manage user roles?",
          "How do I bulk import users?",
          "How do I export user data?",
          "How do I view user activity logs?"
        ],
        analytics: [
          "Show me system statistics",
          "What are the booking trends?",
          "How many active users are there?",
          "What are the popular events?",
          "Show me canteen revenue data",
          "What are the system usage patterns?",
          "How do I generate reports?",
          "What are the peak usage times?",
          "Show me error logs",
          "What's the system performance?"
        ],
        operations: [
          "How do I manage bookings?",
          "How do I approve requests?",
          "How do I manage events?",
          "How do I oversee canteen operations?",
          "How do I handle user complaints?",
          "How do I manage system settings?",
          "How do I configure notifications?",
          "How do I manage departments?",
          "How do I set up new resources?",
          "How do I manage academic calendar?"
        ],
        general: [
          "Show me upcoming events",
          "What's available in the canteen?",
          "How do I navigate the platform?",
          "What system alerts do I have?",
          "How do I backup data?",
          "How do I update system configurations?",
          "What are the security protocols?",
          "How do I manage integrations?",
          "How do I handle emergencies?",
          "Where can I find admin documentation?"
        ]
      }
    };
    
    return prompts[userRole] || prompts.student;
  };

  const getRoleSuggestedQuestions = (userRole) => {
    const allPrompts = getAllRolePrompts(userRole);
    // Return a mix from different categories for initial display
    const mixed = [
      ...(allPrompts.academic?.slice(0, 2) || []),
      ...(allPrompts.teaching?.slice(0, 2) || []),
      ...(allPrompts.management?.slice(0, 2) || []),
      ...(allPrompts.events?.slice(0, 1) || []),
      ...(allPrompts.services?.slice(0, 1) || []),
      ...(allPrompts.general?.slice(0, 2) || [])
    ];
    return mixed.slice(0, 6);
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-lg p-4 border border-gray-700 border-b-0">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <p className="text-gray-400 text-sm">Ask me anything about campus services</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-gray-800 border-l border-r border-gray-700 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    {message.type === 'user' ? (
                      <User size={20} className="text-white" />
                    ) : (
                      <Bot size={20} className="text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-4 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="p-2 rounded-lg bg-gray-700">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="rounded-lg p-4 bg-gray-700 text-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Comprehensive Prompt Suggestions */}
        {messages.length <= 1 && (
          <div className="bg-gray-800 border-l border-r border-gray-700 p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">Available prompts for {user?.role || 'student'}:</p>
              <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                {Object.values(getAllRolePrompts(user?.role || 'student')).flat().length} prompts
              </span>
            </div>
            
            {Object.entries(getAllRolePrompts(user?.role || 'student')).map(([category, prompts]) => (
              <div key={category} className="mb-4">
                <h4 className="text-gray-300 font-medium mb-2 capitalize flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {category}
                  <span className="ml-2 text-xs text-gray-500">({prompts.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {prompts.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <p className="text-blue-200 text-xs">
                💡 <strong>Tip:</strong> Click any prompt above to ask the AI Assistant, or type your own question below.
              </p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-gray-800 rounded-b-lg p-4 border border-gray-700 border-t-0">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            AI Assistant can help with timetables, events, canteen, bookings, and general campus information.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AiAssistant;
