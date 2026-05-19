const express = require("express");
const router = express.Router();

const {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages
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

module.exports = router;
