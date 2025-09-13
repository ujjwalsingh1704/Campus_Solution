import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.js';
import MenuItem from '../models/menuItem.js';
import Resource from '../models/resource.js';
import Event from '../models/event.js';
import Timetable from '../models/timetable.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Resource.deleteMany({});
    await Event.deleteMany({});
    await Timetable.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        employeeId: 'EMP001',
        walletBalance: 5000,
        points: 500,
        level: 5
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@campus.edu',
        password: hashedPassword,
        role: 'faculty',
        department: 'Computer Science',
        employeeId: 'FAC001',
        walletBalance: 3000,
        points: 300,
        level: 3
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@campus.edu',
        password: hashedPassword,
        role: 'faculty',
        department: 'Information Technology',
        employeeId: 'FAC002',
        walletBalance: 2500,
        points: 250,
        level: 3
      },
      {
        name: 'John Doe',
        email: 'john.doe@student.campus.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science',
        studentId: 'STU001',
        walletBalance: 1000,
        points: 150,
        level: 2,
        badges: ['early_bird', 'foodie']
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@student.campus.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Information Technology',
        studentId: 'STU002',
        walletBalance: 800,
        points: 200,
        level: 2,
        badges: ['social_butterfly']
      },
      {
        name: 'Bob Wilson',
        email: 'bob.wilson@student.campus.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science',
        studentId: 'STU003',
        walletBalance: 1200,
        points: 100,
        level: 1
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample menu items
    await MenuItem.insertMany([
      {
        name: 'Chicken Burger',
        description: 'Juicy grilled chicken burger with lettuce and tomato',
        price: 120,
        category: 'lunch',
        isAvailable: true,
        preparationTime: 15,
        spiceLevel: 'mild',
        popularity: 85
      },
      {
        name: 'Veggie Pizza',
        description: 'Fresh vegetables on crispy pizza base',
        price: 150,
        category: 'lunch',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 20,
        popularity: 70
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 25,
        category: 'beverages',
        isVegetarian: true,
        isVegan: true,
        isAvailable: true,
        preparationTime: 5,
        popularity: 95,
        isEcoFriendly: true
      },
      {
        name: 'Pasta Alfredo',
        description: 'Creamy white sauce pasta with herbs',
        price: 180,
        category: 'dinner',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 25,
        popularity: 60
      },
      {
        name: 'Fresh Fruit Salad',
        description: 'Seasonal fruits with honey dressing',
        price: 80,
        category: 'snacks',
        isVegetarian: true,
        isVegan: true,
        isAvailable: true,
        preparationTime: 10,
        popularity: 40,
        isEcoFriendly: true
      },
      {
        name: 'Chocolate Brownie',
        description: 'Rich chocolate brownie with vanilla ice cream',
        price: 90,
        category: 'desserts',
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 5,
        popularity: 75
      }
    ]);

    console.log('🍽️ Created sample menu items');

    // Create sample resources
    const resources = await Resource.insertMany([
      {
        name: 'Computer Lab A',
        type: 'lab',
        capacity: 30,
        location: 'Block A, Floor 2',
        description: 'Fully equipped computer lab with latest software',
        amenities: ['Computers', 'Projector', 'Whiteboard', 'Air Conditioning'],
        managedBy: users[1]._id // Dr. Sarah Johnson
      },
      {
        name: 'Lecture Hall 101',
        type: 'classroom',
        capacity: 100,
        location: 'Block A, Floor 1',
        description: 'Large lecture hall with audio-visual equipment',
        amenities: ['Projector', 'Microphone', 'Whiteboard', 'Air Conditioning'],
        managedBy: users[1]._id
      },
      {
        name: 'Conference Room',
        type: 'meeting_room',
        capacity: 20,
        location: 'Block B, Floor 3',
        description: 'Modern conference room for meetings and presentations',
        amenities: ['Smart TV', 'Video Conferencing', 'Whiteboard', 'Coffee Machine'],
        managedBy: users[0]._id // Admin
      },
      {
        name: 'Sports Hall',
        type: 'sports',
        capacity: 50,
        location: 'Sports Complex',
        description: 'Indoor sports facility for various activities',
        amenities: ['Basketball Court', 'Volleyball Net', 'Sound System'],
        operatingHours: { start: '06:00', end: '22:00' },
        managedBy: users[0]._id
      }
    ]);

    console.log('🏢 Created sample resources');

    // Create sample events
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Event.insertMany([
      {
        title: 'Tech Talk: AI in Education',
        description: 'Join us for an insightful discussion on how AI is transforming education',
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        location: 'Lecture Hall 101',
        category: 'academic',
        capacity: 100,
        tags: ['AI', 'Technology', 'Education'],
        createdBy: users[1]._id,
        registrations: [
          { userId: users[3]._id },
          { userId: users[4]._id }
        ]
      },
      {
        title: 'Annual Sports Day',
        description: 'Campus-wide sports competition with various events',
        date: nextWeek.toISOString().split('T')[0],
        time: '09:00',
        location: 'Sports Complex',
        category: 'sports',
        capacity: 200,
        tags: ['Sports', 'Competition', 'Fun'],
        createdBy: users[0]._id,
        registrations: [
          { userId: users[3]._id },
          { userId: users[5]._id }
        ]
      },
      {
        title: 'Cultural Night',
        description: 'Showcase your talents in music, dance, and drama',
        date: '2024-12-15',
        time: '18:00',
        location: 'Main Auditorium',
        category: 'cultural',
        capacity: 300,
        tags: ['Culture', 'Performance', 'Entertainment'],
        createdBy: users[2]._id
      }
    ]);

    console.log('🎉 Created sample events');

    // Create sample timetable entries
    await Timetable.insertMany([
      {
        subjectId: 'CS201',
        subject: 'Data Structures and Algorithms',
        courseCode: 'CS201',
        instructor: 'Dr. Sarah Johnson',
        startTime: '09:00',
        endTime: '10:00',
        day: 'Monday',
        room: 'Room 101',
        classType: 'lecture',
        students: ['John Doe'],
        enrolledCount: 1,
        credits: 4,
        weeklyHours: 3,
        semester: 'Fall 2024',
        academicYear: '2024-25',
        createdBy: users[1]._id // Dr. Sarah Johnson
      },
      {
        subjectId: 'CS301',
        subject: 'Database Management Systems',
        courseCode: 'CS301',
        instructor: 'Prof. Michael Chen',
        startTime: '11:00',
        endTime: '12:00',
        day: 'Monday',
        room: 'Room 102',
        classType: 'lecture',
        students: ['John Doe'],
        enrolledCount: 1,
        credits: 3,
        weeklyHours: 3,
        semester: 'Fall 2024',
        academicYear: '2024-25',
        createdBy: users[2]._id // Prof. Michael Chen
      },
      {
        subjectId: 'IT401',
        subject: 'Web Development',
        courseCode: 'IT401',
        instructor: 'Dr. Sarah Johnson',
        startTime: '14:00',
        endTime: '16:00',
        day: 'Tuesday',
        room: 'Computer Lab A',
        classType: 'lab',
        students: ['Jane Smith'],
        enrolledCount: 1,
        credits: 3,
        weeklyHours: 4,
        semester: 'Fall 2024',
        academicYear: '2024-25',
        createdBy: users[1]._id // Dr. Sarah Johnson
      },
      {
        subjectId: 'CS401',
        subject: 'Software Engineering',
        courseCode: 'CS401',
        instructor: 'Prof. Michael Chen',
        startTime: '10:00',
        endTime: '11:00',
        day: 'Wednesday',
        room: 'Room 103',
        classType: 'lecture',
        students: ['Bob Wilson'],
        enrolledCount: 1,
        credits: 4,
        weeklyHours: 3,
        semester: 'Fall 2024',
        academicYear: '2024-25',
        createdBy: users[2]._id // Prof. Michael Chen
      }
    ]);

    console.log('📚 Created sample timetable entries');

    console.log('✅ Sample data seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@campus.edu / password123');
    console.log('Faculty: sarah.johnson@campus.edu / password123');
    console.log('Student: john.doe@student.campus.edu / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
