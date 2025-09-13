import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI (will use demo responses if API key not provided)
let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-key') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// AI Assistant chat endpoint
router.post('/assistant', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let response;

    if (openai) {
      // Use actual OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a campus management system. You can help students, faculty, and staff with:
            - Campus information and directions
            - Academic schedules and timetables
            - Event information and registration
            - Food ordering and canteen services
            - Resource booking and availability
            - General campus policies and procedures
            
            Keep responses helpful, concise, and relevant to campus life. The user is ${req.user.name} with role ${req.user.role}.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      response = completion.choices[0].message.content;
    } else {
      // Demo responses when OpenAI API is not available
      response = generateDemoResponse(message, req.user);
    }

    res.json({
      message: 'AI response generated successfully',
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    
    // Fallback to demo response on error
    const demoResponse = generateDemoResponse(req.body.message, req.user);
    
    res.json({
      message: 'AI response generated successfully (demo mode)',
      response: demoResponse,
      timestamp: new Date().toISOString()
    });
  }
});

// Generate demo responses for common queries
function generateDemoResponse(message, user) {
  const lowerMessage = message.toLowerCase();
  
  // Campus directions and locations
  if (lowerMessage.includes('library') || lowerMessage.includes('where')) {
    return `Hi ${user.name}! The main library is located in Block A, Ground Floor. It's open from 8:00 AM to 8:00 PM on weekdays. You can access digital resources 24/7 through the campus portal.`;
  }
  
  // Timetable queries
  if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('class')) {
    if (user.role === 'student') {
      return `You can view your personalized timetable in the Timetable section of your dashboard. It shows all your enrolled courses, timings, and room locations. Don't forget to check for any updates from your faculty!`;
    } else {
      return `You can manage timetables in the Faculty Dashboard. Create new entries, update existing ones, and view student schedules. Remember to avoid time conflicts when scheduling.`;
    }
  }
  
  // Food and canteen
  if (lowerMessage.includes('food') || lowerMessage.includes('canteen') || lowerMessage.includes('menu')) {
    return `The campus canteen offers a variety of meals throughout the day. Check the Canteen section for today's menu, place orders online, and track your order status. We have vegetarian, vegan, and special dietary options available!`;
  }
  
  // Events
  if (lowerMessage.includes('event') || lowerMessage.includes('activity')) {
    return `Stay updated with campus events! Browse upcoming events in the Events section, register for activities you're interested in, and even create your own events if you're faculty. From academic seminars to cultural festivals, there's always something happening!`;
  }
  
  // Booking resources
  if (lowerMessage.includes('book') || lowerMessage.includes('room') || lowerMessage.includes('lab')) {
    return `Need to book a resource? Visit the Booking section to see available classrooms, labs, and other facilities. Submit your request with details about purpose and duration. Faculty approval may be required for certain resources.`;
  }
  
  // Wallet and payments
  if (lowerMessage.includes('wallet') || lowerMessage.includes('payment') || lowerMessage.includes('money')) {
    return `Your campus wallet makes payments easy! Top up your balance, pay for food orders, and track all transactions. You can add money through various payment methods in the Wallet section.`;
  }
  
  // General help
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return `I'm here to help with all campus-related queries! I can assist with:
    
    📚 Academic schedules and timetables
    🍽️ Food ordering and canteen services  
    📅 Event information and registration
    🏢 Resource booking and availability
    💳 Wallet and payment services
    📍 Campus directions and information
    
    Just ask me anything about campus life!`;
  }
  
  // Default response
  return `Hello ${user.name}! I'm your campus AI assistant. I can help you with timetables, events, food ordering, resource booking, and general campus information. What would you like to know about?`;
}

export default router;
