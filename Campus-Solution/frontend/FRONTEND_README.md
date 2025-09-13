   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🔧 Configuration

### Backend API Integration
Update the API base URL in `src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout.jsx          # Dashboard layout with sidebar navigation
│   ├── Navbar.jsx          # Top navigation bar with auth controls
│   └── ProtectedRoute.jsx  # Route protection wrapper component
├── contexts/               # React Context providers
│   └── AuthContext.jsx    # Authentication state management
├── pages/                  # Page components
│   ├── dashboards/         # Role-specific dashboard components
│   │   ├── StudentDashboard.jsx    # Student portal with stats & quick actions
│   │   ├── FacultyDashboard.jsx    # Faculty portal with management tools
│   │   └── AdminDashboard.jsx      # Admin portal with analytics
│   ├── Login.jsx           # User login page with form validation
│   ├── Register.jsx        # User registration with role selection
│   ├── Dashboard.jsx       # Main dashboard router component
│   ├── Timetable.jsx       # Class schedule management
│   ├── Events.jsx          # Campus event management & registration
│   ├── Canteen.jsx         # Food ordering system with cart
│   ├── Booking.jsx         # Resource booking & approval system
│   ├── AiAssistant.jsx     # AI chat interface
│   └── Orders.jsx          # Order management (Faculty/Admin only)
├── utils/                  # Utility functions and services
│   └── api.js              # API service layer with JWT handling
└── App.jsx                 # Main application with routing
```

---

## 🔌 API Integration

The frontend integrates with your Node.js backend through these endpoints:

### Authentication Endpoints
- `POST /auth/login` - User login with email/password
- `POST /auth/register` - User registration with role selection

### Feature Endpoints
- `GET/POST/PUT/DELETE /timetable` - Timetable management
- `GET/POST/PUT/DELETE /events` - Event management
- `GET /food/menu` - Canteen menu items
- `GET/POST/PUT /food/orders` - Food order management
- `GET/POST/PUT /bookings` - Resource booking system
- `GET /bookings/resources` - Available resources
- `POST /ai/assistant` - AI chat functionality

All protected endpoints require: `Authorization: Bearer <jwt-token>`

---

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark UI with gradient accents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Smooth hover effects and loading states
- **Consistent Icons**: Lucide React icons throughout the app
- **Color Coding**: Role-based color schemes and status indicators

### User Experience
- **Role-Based Navigation**: Dynamic sidebar based on user permissions
- **Real-Time Updates**: Live status updates for orders and bookings
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Skeleton screens and spinners for better UX
- **Responsive Layouts**: Optimized for desktop, tablet, and mobile

---

## 🚦 Getting Started Guide

### For Students
1. **Register** with role "student" and provide student ID
2. **Login** and access the student dashboard
3. **View Timetable** to see your class schedule
4. **Browse Events** and register for interesting activities
5. **Order Food** from the canteen with real-time tracking
6. **Book Resources** like labs and classrooms
7. **Chat with AI** for campus assistance

### For Faculty
1. **Register** with role "faculty" and department info
2. **Access Faculty Dashboard** with management tools
3. **Create Timetables** for your classes
4. **Organize Events** and manage registrations
5. **Monitor Orders** from the canteen
6. **Approve Bookings** from students

### For Administrators
1. **Register** with role "admin"
2. **Access Admin Dashboard** with full system overview
3. **View Analytics** and system metrics
4. **Manage All Features** across the platform
5. **Monitor System Health** and user activity

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Granular permissions for different user types
- **Protected Routes**: Automatic redirects for unauthorized access
- **Token Management**: Automatic logout on token expiration
- **Input Validation**: Client-side form validation and sanitization
- **Error Handling**: Graceful error handling with user feedback

---

## 🎯 Key Functionalities

### Timetable Management
- View/Create class schedules
- Time conflict detection
- Room and instructor assignment
- Weekly calendar view

### Event System
- Event creation with categories
- Registration management
- Capacity tracking
- Event discovery and filtering

### Canteen Integration
- Menu browsing with categories
- Shopping cart functionality
- Order tracking and status updates
- Payment status monitoring

### Resource Booking
- Available resource listing
- Booking request submission
- Approval workflow
- Conflict prevention

### AI Assistant
- Natural language processing
- Campus information queries
- Contextual help and guidance
- Interactive chat interface

---

## 🚀 Production Build

Build the application for production:
```bash
npm run build
```

The optimized files will be generated in the `dist/` directory, ready for deployment to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

---

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure Guidelines
- **Components**: Reusable UI components in `/components`
- **Pages**: Route-specific components in `/pages`
- **Utils**: Helper functions and API services in `/utils`
- **Contexts**: Global state management in `/contexts`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of a hackathon submission for educational purposes.

---

## 🆘 Support

For issues and questions:
1. Check the browser console for errors
2. Verify backend API is running on `http://localhost:5000`
3. Ensure all dependencies are installed
4. Check network requests in browser DevTools

**Happy Coding! 🚀**
