import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api'
  : (import.meta.env.VITE_API_URL || 'https://ymh-portfolio.onrender.com/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.expired) {
      // Dispatch custom event for session expiration
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
