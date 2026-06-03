import api from './api';

// ═══════════════════════════════════════════
//  CONCEPT SERVICES
// ═══════════════════════════════════════════

export const conceptService = {
    getAll: (params = {}) => api.get('/concepts', { params }),
    getById: (id) => api.get(`/concepts/${id}`),
    getRandom: () => api.get('/concepts/random'),
    getLatest: () => api.get('/concepts/latest'),
    getTrending: () => api.get('/concepts/trending'),
    getPopular: () => api.get('/concepts/popular'),
    create: (data) => api.post('/concepts', data),
    update: (id, data) => api.patch(`/concepts/${id}`, data),
    replace: (id, data) => api.put(`/concepts/${id}`, data),
    delete: (id) => api.delete(`/concepts/${id}`),
    archive: (id) => api.patch(`/concepts/${id}/archive`),
    restore: (id) => api.patch(`/concepts/${id}/restore`),
    getRelated: (id) => api.get(`/concepts/${id}/related`),
};

// ═══════════════════════════════════════════
//  BOOKMARK SERVICES
// ═══════════════════════════════════════════

export const bookmarkService = {
    getAll: () => api.get('/bookmarks'),
    add: (conceptId) => api.post(`/bookmarks/${conceptId}`),
    remove: (conceptId) => api.delete(`/bookmarks/${conceptId}`),
};

// ═══════════════════════════════════════════
//  NOTE SERVICES
// ═══════════════════════════════════════════

export const noteService = {
    getByConceptId: (conceptId) => api.get(`/notes/${conceptId}`),
    add: (conceptId, data) => api.post(`/notes/${conceptId}`, data),
    update: (noteId, data) => api.patch(`/notes/${noteId}`, data),
    delete: (noteId) => api.delete(`/notes/${noteId}`),
};

// ═══════════════════════════════════════════
//  VOTE SERVICES
// ═══════════════════════════════════════════

export const voteService = {
    vote: (conceptId, data) => api.post(`/votes/${conceptId}`, data),
    getTopVoted: () => api.get('/votes/top'),
};

// ═══════════════════════════════════════════
//  TAXONOMY SERVICES
// ═══════════════════════════════════════════

export const taxonomyService = {
    getCategories: () => api.get('/categories'),
    getLanguages: () => api.get('/languages'),
    getDifficulties: () => api.get('/difficulty'),
    getQuestionTypes: () => api.get('/question-types'),
    getSubcategories: () => api.get('/subcategories'),
};

// ═══════════════════════════════════════════
//  SEARCH SERVICES
// ═══════════════════════════════════════════

export const searchService = {
    global: (params) => api.get('/search', { params }),
    autocomplete: (params) => api.get('/search/autocomplete', { params }),
};

// ═══════════════════════════════════════════
//  ANALYTICS SERVICES
// ═══════════════════════════════════════════

export const analyticsService = {
    getTotalConcepts: () => api.get('/analytics/total-concepts'),
    getCategoryDistribution: () => api.get('/analytics/category-distribution'),
    getDifficultyStats: () => api.get('/analytics/difficulty-stats'),
    getTopLanguages: () => api.get('/analytics/languages/top'),
    getTopPatterns: () => api.get('/analytics/patterns/top'),
    getEngagement: () => api.get('/analytics/engagement'),
};

// ═══════════════════════════════════════════
//  ADMIN SERVICES
// ═══════════════════════════════════════════

export const adminService = {
    getAllUsers: (params = {}) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
    banUser: (id) => api.patch(`/admin/users/${id}/ban`),
    unbanUser: (id) => api.patch(`/admin/users/${id}/unban`),
    getSystemHealth: () => api.get('/admin/system/health'),
    getProtectedDashboard: () => api.get('/admin/protected/dashboard'),
};

// ═══════════════════════════════════════════
//  PROFILE SERVICES
// ═══════════════════════════════════════════

export const profileService = {
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.patch('/auth/profile', data),
};
