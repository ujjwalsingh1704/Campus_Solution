const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Suppress console errors for demo mode - backend not available
    // console.error('API Error:', error);
    
    // Check if it's a network error (server not running)
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('DEMO_MODE'); // Special error code for demo mode
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Timetable API
export const timetableAPI = {
  getAll: () => apiRequest('/timetable'),
  create: (timetable) => apiRequest('/timetable', {
    method: 'POST',
    body: JSON.stringify(timetable),
  }),
  update: (id, timetable) => apiRequest(`/timetable/${id}`, {
    method: 'PUT',
    body: JSON.stringify(timetable),
  }),
  delete: (id) => apiRequest(`/timetable/${id}`, {
    method: 'DELETE',
  }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  create: (event) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  }),
  register: (eventId) => apiRequest(`/events/${eventId}/register`, {
    method: 'POST',
  }),
  update: (id, event) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  }),
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),
  // Approval workflow endpoints
  updateStatus: (eventId, status) => apiRequest(`/events/${eventId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  getPending: () => apiRequest('/events/pending'),
  getByStatus: (status) => apiRequest(`/events/by-status/${status}`),
  getMyRegistrations: () => apiRequest('/events/my-registrations'),
};

// Food Orders API
export const foodAPI = {
  getMenu: () => apiRequest('/food/menu'),
  getOrders: () => apiRequest('/food/orders'),
  getAllOrders: () => apiRequest('/food/orders/all'),
  createOrder: (order) => apiRequest('/food/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  updateOrderStatus: (orderId, status) => apiRequest(`/food/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings'),
  create: (booking) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  }),
  updateStatus: (id, status) => apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getResources: () => apiRequest('/bookings/resources'),
};

// AI Assistant API
export const aiAPI = {
  chat: (message) => apiRequest('/ai/assistant', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
};

// Campus Navigation API
export const navigationAPI = {
  getMap: () => apiRequest('/navigation/map'),
  getDirections: (from, to) => apiRequest('/navigation/directions', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  }),
  getPOIs: () => apiRequest('/navigation/pois'),
  updatePOI: (id, poi) => apiRequest(`/navigation/pois/${id}`, {
    method: 'PUT',
    body: JSON.stringify(poi),
  }),
};

// Gamification API
export const gamificationAPI = {
  getProfile: () => apiRequest('/gamification/profile'),
  getLeaderboard: () => apiRequest('/gamification/leaderboard'),
  getBadges: () => apiRequest('/gamification/badges'),
  awardPoints: (userId, points, reason) => apiRequest('/gamification/award', {
    method: 'POST',
    body: JSON.stringify({ userId, points, reason }),
  }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiRequest('/notifications'),
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
  create: (notification) => apiRequest('/notifications', {
    method: 'POST',
    body: JSON.stringify(notification),
  }),
  getUnreadCount: () => apiRequest('/notifications/unread-count'),
};

// User Management API (Admin only)
export const userManagementAPI = {
  getAllUsers: () => apiRequest('/admin/users'),
  createUser: (userData) => apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  updateUser: (id, userData) => apiRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
  bulkUpload: (users) => apiRequest('/admin/users/bulk', {
    method: 'POST',
    body: JSON.stringify({ users }),
  }),
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getDashboardStats: () => apiRequest('/admin/analytics/dashboard'),
  getBookingHeatmap: () => apiRequest('/admin/analytics/bookings-heatmap'),
  getSalesData: (period) => apiRequest(`/admin/analytics/sales?period=${period}`),
  getEventParticipation: () => apiRequest('/admin/analytics/event-participation'),
  getUserActivity: () => apiRequest('/admin/analytics/user-activity'),
};

// Faculty API
export const facultyAPI = {
  getTimetable: () => apiRequest('/faculty/timetable'),
  updateTimetable: (timetable) => apiRequest('/faculty/timetable', {
    method: 'PUT',
    body: JSON.stringify(timetable),
  }),
  getBookingRequests: () => apiRequest('/faculty/booking-requests'),
  approveBooking: (id) => apiRequest(`/faculty/booking-requests/${id}/approve`, {
    method: 'PUT',
  }),
  rejectBooking: (id, reason) => apiRequest(`/faculty/booking-requests/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }),
  getAttendance: (classId) => apiRequest(`/faculty/attendance/${classId}`),
  markAttendance: (classId, attendance) => apiRequest(`/faculty/attendance/${classId}`, {
    method: 'POST',
    body: JSON.stringify(attendance),
  }),
  createAnnouncement: (announcement) => apiRequest('/faculty/announcements', {
    method: 'POST',
    body: JSON.stringify(announcement),
  }),
};

// Student API
export const studentAPI = {
  getPersonalizedTimetable: () => apiRequest('/student/timetable'),
  getEnrolledCourses: () => apiRequest('/student/courses'),
  getGrades: () => apiRequest('/student/grades'),
  getAttendance: () => apiRequest('/student/attendance'),
  updateProfile: (profile) => apiRequest('/student/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  }),
};

// Wallet API
export const walletAPI = {
  getBalance: () => apiRequest('/wallet/balance'),
  getTransactions: () => apiRequest('/wallet/transactions'),
  topUp: (amount, paymentMethod) => apiRequest('/wallet/topup', {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  }),
  processPayment: (amount, description) => apiRequest('/wallet/payment', {
    method: 'POST',
    body: JSON.stringify({ amount, description }),
  }),
};

// Enhanced Food API with more features
export const enhancedFoodAPI = {
  ...foodAPI,
  getMenuByCategory: (category) => apiRequest(`/food/menu?category=${category}`),
  getPopularItems: () => apiRequest('/food/menu/popular'),
  getEcoFriendlyOptions: () => apiRequest('/food/menu/eco-friendly'),
  applyDiscount: (orderId, discountCode) => apiRequest(`/food/orders/${orderId}/discount`, {
    method: 'POST',
    body: JSON.stringify({ discountCode }),
  }),
  getOrderQueue: () => apiRequest('/food/queue'),
  requestRefund: (orderId, reason) => apiRequest(`/food/orders/${orderId}/refund`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
};

// Subjects API
export const subjectsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/subjects${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/subjects/${id}`),
  create: (subject) => apiRequest('/subjects', {
    method: 'POST',
    body: JSON.stringify(subject),
  }),
  update: (id, subject) => apiRequest(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subject),
  }),
  delete: (id) => apiRequest(`/subjects/${id}`, {
    method: 'DELETE',
  }),
  assignFaculty: (id, facultyIds) => apiRequest(`/subjects/${id}/assign-faculty`, {
    method: 'POST',
    body: JSON.stringify({ facultyIds }),
  }),
  getByDepartment: (department, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/subjects/department/${department}${queryString ? `?${queryString}` : ''}`);
  },
  getAvailableFaculty: () => apiRequest('/subjects/faculty/available'),
};

export default apiRequest;
