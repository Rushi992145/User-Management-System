import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - cookies are automatically sent with withCredentials: true
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      // Cookies will be cleared by the backend on logout
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  getCurrentUser: () => api.get('/users/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Admin API
export const adminAPI = {
  getAllUsers: (page = 1, limit = 10) => api.get(`/users/all?page=${page}&limit=${limit}`),
  activateUser: (userId) => api.put(`/users/activate/${userId}`),
  deactivateUser: (userId) => api.put(`/users/deactivate/${userId}`),
};

export default api;

