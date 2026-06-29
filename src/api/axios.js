import axios from 'axios';
import useErrorStore from '../store/error.store.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // This is CRITICAL for sending HttpOnly cookies automatically!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for network timeouts / disconnected
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      useErrorStore.getState().setError('timeout', 'Unable to reach the server. Please check your internet connection or try again later.');
    } else if (error.response) {
      const status = error.response.status;
      
      // We only catch 401/403/429/500 globally. 
      // 400s (bad requests) and 404s are usually handled by the local forms.
      if (status === 401) {
        useErrorStore.getState().setError('unauthorized', 'Your session has expired or you are not authorized. Please log in again.');
      } else if (status === 403) {
        useErrorStore.getState().setError('unauthorized', 'You do not have permission to access this resource.');
      } else if (status === 429) {
        useErrorStore.getState().setError('ratelimit', 'You are making requests too quickly. Please slow down and wait a moment.');
      } else if (status >= 500) {
        useErrorStore.getState().setError('server', 'The server encountered an unexpected condition. Our team has been notified.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
