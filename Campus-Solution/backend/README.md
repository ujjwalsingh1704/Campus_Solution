# Campus Solution Backend

A comprehensive Node.js backend for the Campus Solution management system, providing APIs for authentication, timetable management, event organization, food ordering, resource booking, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Timetable Management**: Create, update, and manage class schedules
- **Event System**: Event creation, registration, and management
- **Food Ordering**: Complete canteen ordering system with menu management
- **Resource Booking**: Book classrooms, labs, and other campus facilities
- **AI Assistant**: Intelligent campus assistance with OpenAI integration
- **Wallet System**: Digital wallet for campus payments
- **Gamification**: Points, badges, and leaderboards
- **Notifications**: Real-time notification system
- **Analytics**: Admin dashboard with comprehensive analytics

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env` file is already configured with default values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/campusDB
   JWT_SECRET=supersecret123
   OPENAI_API_KEY=your-openai-key
   ```

   **Important**: Replace `OPENAI_API_KEY` with your actual OpenAI API key if you want to use the AI assistant feature. The system will work with demo responses if no key is provided.

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   ```

5. **Seed the database with sample data**
   ```bash
   node scripts/seedData.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

The server will start on `http://localhost:5000`

## 📊 Sample Data

After running the seed script, you can use these login credentials:

### Admin Account
- **Email**: admin@campus.edu
- **Password**: password123
- **Role**: Admin (full system access)

### Faculty Account
- **Email**: sarah.johnson@campus.edu
- **Password**: password123
- **Role**: Faculty (can manage timetables, approve bookings, create events)

### Student Account
- **Email**: john.doe@student.campus.edu
- **Password**: password123
- **Role**: Student (can view timetables, book resources, order food)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Timetable
- `GET /api/timetable` - Get timetables (filtered by role)
- `POST /api/timetable` - Create timetable entry (Faculty/Admin)
- `PUT /api/timetable/:id` - Update timetable entry
- `DELETE /api/timetable/:id` - Delete timetable entry
- `GET /api/timetable/weekly/:studentId?` - Get weekly schedule

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Faculty/Admin)
- `POST /api/events/:id/register` - Register for event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/my-registrations` - Get user's registered events

### Food Ordering
- `GET /api/food/menu` - Get menu items
- `GET /api/food/menu/popular` - Get popular items
- `POST /api/food/orders` - Create food order
- `GET /api/food/orders` - Get user's orders
- `GET /api/food/orders/all` - Get all orders (Faculty/Admin)
- `PUT /api/food/orders/:id` - Update order status

### Bookings
- `GET /api/bookings` - Get bookings (filtered by role)
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/resources` - Get available resources
- `GET /api/bookings/requests` - Get pending requests (Faculty/Admin)
- `PUT /api/bookings/:id/approve` - Approve booking
- `PUT /api/bookings/:id/reject` - Reject booking

### AI Assistant
- `POST /api/ai/assistant` - Chat with AI assistant

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/topup` - Top up wallet
- `POST /api/wallet/payment` - Process payment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

### Student APIs
- `GET /api/student/timetable` - Get personalized timetable
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/grades` - Get grades
- `GET /api/student/attendance` - Get attendance
- `PUT /api/student/profile` - Update profile

### Faculty APIs
- `GET /api/faculty/timetable` - Get faculty timetable
- `GET /api/faculty/booking-requests` - Get booking requests
- `PUT /api/faculty/booking-requests/:id/approve` - Approve booking
- `GET /api/faculty/attendance/:classId` - Get class attendance
- `POST /api/faculty/announcements` - Create announcement

### Admin APIs
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics/dashboard` - Dashboard stats
- `GET /api/admin/analytics/sales` - Sales data
- `GET /api/admin/analytics/user-activity` - User activity

### Gamification
- `GET /api/gamification/profile` - Get user's gamification profile
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/badges` - Get available badges
- `POST /api/gamification/award` - Award points to user

### Navigation
- `GET /api/navigation/map` - Get campus map
- `POST /api/navigation/directions` - Get directions
- `GET /api/navigation/pois` - Get points of interest

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── middlewares/
│   └── authMiddleware.js     # Authentication middleware
├── models/                   # Mongoose models
│   ├── user.js
│   ├── timetable.js
│   ├── event.js
│   ├── order.js
│   ├── booking.js
│   ├── resource.js
│   └── menuItem.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── timetable.js
│   ├── events.js
│   ├── food.js
│   ├── bookings.js
│   ├── ai.js
│   ├── wallet.js
│   ├── notifications.js
│   ├── student.js
│   ├── faculty.js
│   ├── admin.js
│   ├── gamification.js
│   └── navigation.js
├── scripts/
│   └── seedData.js          # Database seeding script
├── server.js                # Main server file
├── package.json
└── README.md
```

## 🧪 Testing the API

You can test the API endpoints using tools like:
- **Postman** - Import the API collection
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Frontend application** - The React frontend is configured to work with this backend

### Example API Test:

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "role": "student"
     }'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Get timetable** (using the token from login):
   ```bash
   curl -X GET http://localhost:5000/api/timetable \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `node scripts/seedData.js` - Seed database with sample data

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://127.0.0.1:27017/campusDB |
| `JWT_SECRET` | JWT signing secret | supersecret123 |
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | your-openai-key |

## 🚨 Important Notes

1. **MongoDB**: Ensure MongoDB is running before starting the server
2. **CORS**: The server is configured to accept requests from `http://localhost:5173` (Vite dev server)
3. **JWT Secret**: Change the JWT secret in production
4. **OpenAI**: The AI assistant will use demo responses if no valid API key is provided
5. **File Uploads**: Currently using base64 encoding for images (consider implementing proper file upload in production)

## 🔗 Frontend Integration

This backend is designed to work seamlessly with the Campus Solution React frontend. The frontend expects:

- API base URL: `http://localhost:5000/api`
- JWT tokens for authentication
- Specific response formats as implemented in the routes

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response**:
```json
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response**:
```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a campus management system for educational purposes.

---

**Happy Coding! 🚀**
