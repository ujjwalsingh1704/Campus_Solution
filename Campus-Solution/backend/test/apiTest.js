import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test functions
const testHealthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.message);
    return true;
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return false;
  }
};

const testUserRegistration = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ User Registration:', data.message);
      return data.token;
    } else {
      console.log('❌ User Registration Failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ User Registration Error:', error.message);
    return null;
  }
};

const testUserLogin = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ User Login:', data.message);
      return data.token;
    } else {
      console.log('❌ User Login Failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ User Login Error:', error.message);
    return null;
  }
};

const testProtectedRoute = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/timetable`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Protected Route (Timetable):', `Retrieved ${data.length || 0} entries`);
      return true;
    } else {
      console.log('❌ Protected Route Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Protected Route Error:', error.message);
    return false;
  }
};

const testMenuAPI = async () => {
  try {
    const response = await fetch(`${API_BASE}/food/menu`);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Menu API:', `Retrieved ${data.length || 0} menu items`);
      return true;
    } else {
      console.log('❌ Menu API Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Menu API Error:', error.message);
    return false;
  }
};

const testEventsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE}/events`);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Events API:', `Retrieved ${data.length || 0} events`);
      return true;
    } else {
      console.log('❌ Events API Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Events API Error:', error.message);
    return false;
  }
};

const testResourcesAPI = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/resources`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Resources API:', `Retrieved ${data.length || 0} resources`);
      return true;
    } else {
      console.log('❌ Resources API Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Resources API Error:', error.message);
    return false;
  }
};

const testAIAssistant = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        message: 'Hello, can you help me with campus information?'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ AI Assistant:', 'Response received');
      return true;
    } else {
      console.log('❌ AI Assistant Failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ AI Assistant Error:', error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🧪 Starting Backend API Tests...\n');
  
  // Test 1: Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('❌ Server is not running. Please start the server first.');
    return;
  }
  
  // Test 2: User Registration
  let token = await testUserRegistration();
  
  // Test 3: User Login (if registration failed, try login)
  if (!token) {
    token = await testUserLogin();
  }
  
  if (!token) {
    console.log('❌ Authentication failed. Cannot test protected routes.');
    return;
  }
  
  // Test 4: Protected Route
  await testProtectedRoute(token);
  
  // Test 5: Menu API
  await testMenuAPI();
  
  // Test 6: Events API
  await testEventsAPI();
  
  // Test 7: Resources API
  await testResourcesAPI(token);
  
  // Test 8: AI Assistant
  await testAIAssistant(token);
  
  console.log('\n🎉 Backend API Testing Complete!');
};

// Run tests
runTests().catch(console.error);
