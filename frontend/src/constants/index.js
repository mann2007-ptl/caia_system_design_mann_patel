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
    CONCEPTS: {
        BASE: '/concepts',
        RANDOM: '/concepts/random',
        LATEST: '/concepts/latest',
        TRENDING: '/concepts/trending',
        POPULAR: '/concepts/popular',
    },
    BOOKMARKS: '/bookmarks',
    NOTES: '/notes',
    VOTES: '/votes',
    ADMIN: {
        USERS: '/admin/users',
        SYSTEM_HEALTH: '/admin/system/health',
    },
    ANALYTICS: {
        TOTAL: '/analytics/total-concepts',
        CATEGORY: '/analytics/category-distribution',
        DIFFICULTY: '/analytics/difficulty-stats',
        LANGUAGES: '/analytics/languages/top',
        PATTERNS: '/analytics/patterns/top',
    },
    TAXONOMY: {
        CATEGORIES: '/categories',
        LANGUAGES: '/languages',
        DIFFICULTIES: '/difficulty',
        QUESTION_TYPES: '/question-types',
        SUBCATEGORIES: '/subcategories',
    },
    SEARCH: '/search',
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
    CONCEPTS: '/concepts',
    CONCEPT_DETAILS: '/concepts/:id',
    BOOKMARKS: '/bookmarks',
    ARCHIVED: '/archived',
    NOTES: '/notes',
    PROFILE: '/profile',
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_CONCEPTS: '/admin/concepts',
    ADMIN_CONCEPT_CREATE: '/admin/concepts/create',
    ADMIN_CONCEPT_EDIT: '/admin/concepts/:id/edit',
    ADMIN_USERS: '/admin/users',
    ADMIN_USER_DETAILS: '/admin/users/:id',
    ADMIN_BOOKMARKS: '/admin/bookmarks',
    ADMIN_ARCHIVED: '/admin/archive',
    ADMIN_REPORTS: '/admin/reports',
    ADMIN_SYSTEM_HEALTH: '/admin/system-health',
    ADMIN_SETTINGS: '/admin/settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    REMEMBER_ME: 'rememberMe',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
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

// Difficulty Colors
export const DIFFICULTY_COLORS = {
    Easy: { bg: '#dcfce7', text: '#166534' },
    Medium: { bg: '#fef3c7', text: '#92400e' },
    Hard: { bg: '#fee2e2', text: '#991b1b' },
    Expert: { bg: '#ede9fe', text: '#5b21b6' },
};
