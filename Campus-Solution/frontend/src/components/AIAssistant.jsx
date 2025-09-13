import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your campus AI assistant. Ask me about your timetable, menu, next period, or any campus-related questions!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock data for responses
  const mockData = {
    timetable: [
      { time: '9:00 AM', subject: 'Mathematics', room: 'Room 101', instructor: 'Dr. Smith' },
      { time: '10:30 AM', subject: 'Physics', room: 'Lab 201', instructor: 'Prof. Johnson' },
      { time: '12:00 PM', subject: 'Computer Science', room: 'Room 301', instructor: 'Dr. Wilson' },
      { time: '2:00 PM', subject: 'Chemistry', room: 'Lab 102', instructor: 'Dr. Brown' },
      { time: '3:30 PM', subject: 'English', room: 'Room 205', instructor: 'Prof. Davis' }
    ],
    menu: [
      { item: 'Chicken Biryani', price: '₹120', category: 'Main Course' },
      { item: 'Vegetable Curry', price: '₹80', category: 'Main Course' },
      { item: 'Masala Dosa', price: '₹60', category: 'South Indian' },
      { item: 'Paneer Butter Masala', price: '₹100', category: 'Main Course' },
      { item: 'Fresh Juice', price: '₹40', category: 'Beverages' },
      { item: 'Ice Cream', price: '₹30', category: 'Desserts' }
    ]
  };

  const getCurrentTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let i = 0; i < mockData.timetable.length; i++) {
      const timeStr = mockData.timetable[i].time;
      const [time, period] = timeStr.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      let adjustedHour = hour;
      
      if (period === 'PM' && hour !== 12) adjustedHour += 12;
      if (period === 'AM' && hour === 12) adjustedHour = 0;
      
      if (adjustedHour > currentHour || (adjustedHour === currentHour && minute > currentMinute)) {
        return mockData.timetable[i];
      }
    }
    return null;
  };

  const processMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching for different types of queries
    if (lowerMessage.includes('next period') || lowerMessage.includes('next class') || lowerMessage.includes('what\'s next')) {
      const nextClass = getCurrentTime();
      if (nextClass) {
        return `Your next period is ${nextClass.subject} at ${nextClass.time} in ${nextClass.room} with ${nextClass.instructor}.`;
      } else {
        return "No more classes scheduled for today!";
      }
    }
    
    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('classes today')) {
      let response = "Here's your timetable for today:\n\n";
      mockData.timetable.forEach(item => {
        response += `• ${item.time} - ${item.subject} (${item.room}) - ${item.instructor}\n`;
      });
      return response;
    }
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('canteen') || lowerMessage.includes('lunch') || lowerMessage.includes('dinner')) {
      let response = "Today's menu at the canteen:\n\n";
      const categories = [...new Set(mockData.menu.map(item => item.category))];
      categories.forEach(category => {
        response += `**${category}:**\n`;
        mockData.menu.filter(item => item.category === category).forEach(item => {
          response += `• ${item.item} - ${item.price}\n`;
        });
        response += '\n';
      });
      return response;
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('what time')) {
      const now = new Date();
      return `Current time is ${now.toLocaleTimeString()}.`;
    }
    
    if (lowerMessage.includes('library') || lowerMessage.includes('books')) {
      return "The library is open from 8:00 AM to 8:00 PM. You can borrow up to 5 books at a time. Visit the Library section in the app to browse available books.";
    }
    
    if (lowerMessage.includes('events') || lowerMessage.includes('activities')) {
      return "Check the Events section in the app for upcoming campus activities, workshops, and cultural events. You can also register for events directly through the app.";
    }
    
    if (lowerMessage.includes('booking') || lowerMessage.includes('room') || lowerMessage.includes('facility')) {
      return "You can book rooms and facilities through the Booking section. Available resources include classrooms, labs, auditoriums, and sports facilities.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I can help you with:
• Next period/class information
• Daily timetable and schedule
• Canteen menu and food options
• Current time
• Library information
• Campus events and activities
• Room and facility bookings
• General campus information

Just ask me in natural language!`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you with your campus needs today?";
    }
    
    // Default response for unrecognized queries
    return "I'm not sure about that. Try asking me about your timetable, next period, menu, library, events, or bookings. Type 'help' to see what I can do!";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Process the message and generate response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: processMessage(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Campus AI Assistant</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="hover:bg-blue-700 p-1 rounded"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                <div className="whitespace-pre-line text-sm">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about timetable, menu, next period..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
