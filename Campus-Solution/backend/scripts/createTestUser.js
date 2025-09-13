import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@student.com' });
    if (existingUser) {
      console.log('Test user already exists');
      console.log('Email: test@student.com');
      console.log('Password: password123');
      return;
    }

    // Create test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUser = new User({
      name: 'Test Student',
      email: 'test@student.com',
      password: hashedPassword,
      role: 'student',
      department: 'Computer Science',
      studentId: 'CS2024001'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Email: test@student.com');
    console.log('Password: password123');
    console.log('Role: student');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestUser();
