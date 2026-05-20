const express = require("express");
const router = express.Router();

const {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getTopViewedConcepts,
    getTopBookmarkedConcepts,
    getTrendingAnalytics,
    getMonthlyGrowth,
    getTopSearchedKeywords
} = require("../controllers/analytics.controller");

// ==========================================
// ANALYTICS ROUTES
// ==========================================

// Matches: /api/v1/analytics/total-concepts
router.get("/total-concepts", getTotalConcepts);

// Matches: /api/v1/analytics/category-distribution
router.get("/category-distribution", getCategoryDistribution);

// Matches: /api/v1/analytics/difficulty-stats
router.get("/difficulty-stats", getDifficultyStats);

// Matches: /api/v1/analytics/patterns/top
router.get("/patterns/top", getTopPatterns);

// Matches: /api/v1/analytics/languages/top
router.get("/languages/top", getTopLanguages);

// Matches: /api/v1/analytics/views/top
router.get("/views/top", getTopViewedConcepts);

// Matches: /api/v1/analytics/bookmarks/top
router.get("/bookmarks/top", getTopBookmarkedConcepts);

// Matches: /api/v1/analytics/trending
router.get("/trending", getTrendingAnalytics);

// Matches: /api/v1/analytics/growth
router.get("/growth", getMonthlyGrowth);

// Matches: /api/v1/analytics/searches/top
router.get("/searches/top", getTopSearchedKeywords);

module.exports = router;

