# 🎓 Campus Solution

**A Comprehensive Campus Management Platform for Educational Institutions**

Campus Solution is a full-stack web application that provides a unified platform for students, faculty, administrators, and canteen staff to manage all aspects of campus life. Built with modern technologies, it offers role-based dashboards, real-time features, and an intuitive user interface.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Login Credentials](#-login-credentials)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Student, Faculty, Admin, Canteen Staff)
- Protected routes with automatic redirects
- Password encryption with bcrypt

### 👨‍🎓 Student Features
- **Timetable Management**: View personalized class schedules with timings, locations, and instructors
- **Event Discovery**: Browse and register for campus events with real-time availability tracking
- **Food Ordering**: Complete canteen ordering system with menu browsing, cart management, and order tracking
- **Resource Booking**: Book labs, classrooms, and facilities with approval workflow
- **Library System**: Browse books, borrow/return, pay fines, and track borrowing history
- **AI Assistant**: Interactive chat interface for campus-related queries and assistance
- **Gamification**: Earn points, badges, and compete on leaderboards
- **Campus Navigation**: Interactive campus map with directions and points of interest
- **Digital Wallet**: Manage campus payments and transaction history

### 👨‍🏫 Faculty Features
- **Timetable Creation**: Create and manage class schedules for students
- **Event Management**: Organize campus events, workshops, and activities
- **Order Monitoring**: View and manage canteen orders with status updates
- **Booking Approvals**: Review and approve/reject resource booking requests
- **Subject Management**: Create and manage course subjects with detailed information
- **Student Analytics**: Track student attendance and performance

### 👨‍💼 Admin Features
- **Complete System Access**: All student and faculty features combined
- **User Management**: Create, update, and manage all user accounts
- **System Analytics**: Comprehensive dashboard with statistics and metrics
- **Revenue Tracking**: Financial overview of canteen operations and bookings
- **Library Administration**: Manage book inventory, borrowing policies, and fines
- **Platform Settings**: System-wide configuration and management

### 🍽️ Canteen Staff Features
- **Order Management**: Process and update food orders in real-time
- **Menu Administration**: Manage menu items, prices, and availability
- **Customer Service**: Handle special requests and order modifications
- **Sales Analytics**: Track daily sales and popular items

---

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development and optimized builds
- **Tailwind CSS** for modern, responsive design
- **React Router DOM** with protected routes
- **Lucide React** for consistent iconography
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Express Validator** for input validation

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Campus-Solution/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   The `.env` file is pre-configured with default values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/campusDB
   JWT_SECRET=supersecret123
   OPENAI_API_KEY=your-openai-key
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB installation
   mongod
   ```

5. **Seed the database**
   ```bash
   node scripts/seedData.js
   ```

6. **Start backend server**
   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Campus-Solution/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Open your browser and navigate to: `http://localhost:5173`

---

## 🔑 Login Credentials

Use these pre-configured accounts to explore different user roles:

### 👨‍💼 Admin Account
- **Email**: `admin@campus.edu`
- **Password**: `password123`
- **Access**: Complete system administration, analytics, user management

### 👨‍🏫 Faculty Account
- **Email**: `sarah.johnson@campus.edu`
- **Password**: `password123`
- **Access**: Timetable creation, event management, booking approvals

### 👨‍🎓 Student Account
- **Email**: `john.doe@student.campus.edu`
- **Password**: `password123`
- **Access**: View schedules, order food, book resources, library access

### 🍽️ Canteen Staff Account
- **Email**: `canteen@campus.edu`
- **Password**: `password123`
- **Access**: Order management, menu administration

---

## 📁 Project Structure

```
Campus-Solution/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middlewares/
│   │   └── authMiddleware.js     # Authentication middleware
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Timetable.js
│   │   ├── Event.js
│   │   ├── Order.js
│   │   ├── Booking.js
│   │   ├── Subject.js
│   │   ├── Book.js
│   │   └── BookBorrow.js
│   ├── routes/                   # API endpoints
│   │   ├── auth.js
│   │   ├── timetable.js
│   │   ├── events.js
│   │   ├── food.js
│   │   ├── bookings.js
│   │   ├── subjects.js
│   │   ├── library.js
│   │   ├── ai.js
│   │   ├── wallet.js
│   │   ├── gamification.js
│   │   └── navigation.js
│   ├── scripts/
│   │   └── seedData.js          # Database seeding
│   ├── server.js                # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Main layout component
│   │   │   └── CampusMap.jsx    # Interactive campus map
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Timetable.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Canteen.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── Gamification.jsx
│   │   │   └── Navigation.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── utils/
│   │   │   └── api.js           # API utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Core Feature Endpoints
- **Timetable**: `/timetable` - CRUD operations for class schedules
- **Events**: `/events` - Event management and registration
- **Food**: `/food` - Menu and order management
- **Bookings**: `/bookings` - Resource booking system
- **Library**: `/library` - Book and borrowing management
- **Subjects**: `/subjects` - Course subject management
- **AI Assistant**: `/ai/assistant` - Chat with AI assistant
- **Gamification**: `/gamification` - Points, badges, leaderboard
- **Navigation**: `/navigation` - Campus map and directions
- **Wallet**: `/wallet` - Digital payment system

### Role-Specific Endpoints
- **Student**: `/student/*` - Personalized student data
- **Faculty**: `/faculty/*` - Faculty management features
- **Admin**: `/admin/*` - Administrative functions

---

## 🎯 Key Features Showcase

### 📅 Dynamic Timetable System
- Real-time schedule management with conflict detection
- Role-based views (students see their schedule, faculty manage all schedules)
- Integration with subject database for automatic course details

### 🎪 Event Management
- Complete event lifecycle from creation to registration
- Capacity management and waitlist functionality
- Role-based event creation and approval workflow

### 🍽️ Smart Canteen System
- Real-time menu management with availability tracking
- Order processing with status updates and estimated times
- Role-based interfaces for customers and staff

### 📚 Comprehensive Library System
- Book catalog with search and filtering capabilities
- Automated fine calculation and payment processing
- Real-time availability tracking and borrowing limits

### 🤖 AI-Powered Assistant
- Natural language processing for campus queries
- Integration with OpenAI for intelligent responses
- Context-aware assistance for different user roles

### 🏆 Gamification Engine
- Point system for campus activities and achievements
- Badge collection with different categories
- Competitive leaderboards to encourage engagement

---

## 📱 Screenshots

*Screenshots would be included here showing different dashboards and features*

---

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Update JWT secrets and API keys
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **CORS**: Configure for production domain
4. **SSL**: Enable HTTPS for secure communication
5. **File Storage**: Implement proper file upload system

### Build Commands
```bash
# Frontend build
cd frontend && npm run build

# Backend production
cd backend && npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes as part of a campus management system.

---

## 👥 Team

Developed by passionate developers committed to improving campus life through technology.

---

## 📞 Support

For support, email support@campussolution.edu or join our Slack channel.

---

**Made with ❤️ for Educational Excellence**

*Campus Solution - Connecting Campus, Empowering Education*
