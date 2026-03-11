// ============================================================
// API Helper - All backend communication goes here
// Change BASE_URL to your Render backend URL when deployed
// ============================================================

const BASE_URL = 'http://localhost:5000/api'; // Change this after deployment

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic fetch function
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (err) {
    throw err;
  }
}

// Auth APIs
const Auth = {
  register: (data) => apiRequest('/auth/register', 'POST', data),
  login: (data) => apiRequest('/auth/login', 'POST', data),
  adminLogin: (data) => apiRequest('/auth/admin/login', 'POST', data),
};

// House APIs
const Houses = {
  getAll: (params = '') => apiRequest(`/houses${params}`),
  getById: (id) => apiRequest(`/houses/${id}`),
  add: (data) => apiRequest('/admin/houses', 'POST', data),
  update: (id, data) => apiRequest(`/admin/houses/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/admin/houses/${id}`, 'DELETE'),
};

// Admin APIs
const Admin = {
  getUsers: () => apiRequest('/admin/users'),
  getBookings: () => apiRequest('/admin/bookings'),
};

// Booking
const Bookings = {
  create: (data) => apiRequest('/book', 'POST', data),
};
