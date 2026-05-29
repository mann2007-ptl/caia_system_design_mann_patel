// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        PROFILE: '/auth/profile',
        REFRESH_TOKEN: '/auth/refresh-token',
    },
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
    VERIFY_EMAIL: '/verify-email',
    DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/admin/dashboard',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    REMEMBER_ME: 'rememberMe',
};

// User Roles
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

// Validation Messages
export const VALIDATION = {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password must be at least 6 characters',
    PASSWORD_MATCH: 'Passwords must match',
    NAME_REQUIRED: 'Name is required',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
};
