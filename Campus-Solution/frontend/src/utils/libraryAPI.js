const API_BASE_URL = 'http://localhost:5000/api';

const libraryAPI = {
  // Books
  getBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/library/books?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  addBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/library/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    return response.json();
  },

  // Borrowing
  borrowBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/library/borrow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookId })
    });
    return response.json();
  },

  returnBook: async (borrowId) => {
    const response = await fetch(`${API_BASE_URL}/library/return`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ borrowId })
    });
    return response.json();
  },

  renewBook: async (borrowId) => {
    const response = await fetch(`${API_BASE_URL}/library/renew`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ borrowId })
    });
    return response.json();
  },

  // User's books
  getMyBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/library/my-books`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Fine payment
  payFine: async (borrowId, paymentMethod) => {
    const response = await fetch(`${API_BASE_URL}/library/pay-fine`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ borrowId, paymentMethod })
    });
    return response.json();
  },

  // Admin functions
  getAdminBorrows: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/library/admin/borrows?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Admin: Add new book
  addBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/library/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    return response.json();
  }
};

export default libraryAPI;
