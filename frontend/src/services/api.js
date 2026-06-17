import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

// Determine default base URL based on environment
const isProd = import.meta.env.PROD;
const defaultBaseUrl = isProd 
    ? 'https://caia-system-design-mann-patel.onrender.com/api/v1' 
    : 'http://localhost:3000/api/v1';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request interceptor — attach JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear stored auth data
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
