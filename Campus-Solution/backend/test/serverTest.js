import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Test if all route imports work without errors
try {
  console.log('🧪 Testing route imports...');
  
  // Import all routes to check for syntax errors
  const authRoutes = await import('../routes/auth.js');
  console.log('✅ Auth routes imported successfully');
  
  const timetableRoutes = await import('../routes/timetable.js');
  console.log('✅ Timetable routes imported successfully');
  
  const eventsRoutes = await import('../routes/events.js');
  console.log('✅ Events routes imported successfully');
  
  const foodRoutes = await import('../routes/food.js');
  console.log('✅ Food routes imported successfully');
  
  const bookingsRoutes = await import('../routes/bookings.js');
  console.log('✅ Bookings routes imported successfully');
  
  const aiRoutes = await import('../routes/ai.js');
  console.log('✅ AI routes imported successfully');
  
  const walletRoutes = await import('../routes/wallet.js');
  console.log('✅ Wallet routes imported successfully');
  
  const notificationsRoutes = await import('../routes/notifications.js');
  console.log('✅ Notifications routes imported successfully');
  
  const studentRoutes = await import('../routes/student.js');
  console.log('✅ Student routes imported successfully');
  
  const facultyRoutes = await import('../routes/faculty.js');
  console.log('✅ Faculty routes imported successfully');
  
  const adminRoutes = await import('../routes/admin.js');
  console.log('✅ Admin routes imported successfully');
  
  const gamificationRoutes = await import('../routes/gamification.js');
  console.log('✅ Gamification routes imported successfully');
  
  const navigationRoutes = await import('../routes/navigation.js');
  console.log('✅ Navigation routes imported successfully');
  
  console.log('\n🎉 All route imports successful!');
  console.log('✅ Server should start without routing errors');
  
  // Test basic Express app creation
  dotenv.config();
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Test route mounting
  app.use('/api/auth', authRoutes.default);
  app.use('/api/timetable', timetableRoutes.default);
  app.use('/api/events', eventsRoutes.default);
  app.use('/api/food', foodRoutes.default);
  app.use('/api/bookings', bookingsRoutes.default);
  app.use('/api/ai', aiRoutes.default);
  app.use('/api/wallet', walletRoutes.default);
  app.use('/api/notifications', notificationsRoutes.default);
  app.use('/api/student', studentRoutes.default);
  app.use('/api/faculty', facultyRoutes.default);
  app.use('/api/admin', adminRoutes.default);
  app.use('/api/gamification', gamificationRoutes.default);
  app.use('/api/navigation', navigationRoutes.default);
  
  console.log('✅ All routes mounted successfully');
  console.log('✅ Express app configuration complete');
  
} catch (error) {
  console.error('❌ Error during testing:', error.message);
  console.error('Stack:', error.stack);
}
