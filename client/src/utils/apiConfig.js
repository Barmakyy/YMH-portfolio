// Centralized API URL configuration
// Uses localhost in development, production URL for build
export const getApiUrl = () => {
  return import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : (import.meta.env.VITE_API_URL || 'https://ymh-portfolio.onrender.com/api');
};

export const API_URL = getApiUrl();
