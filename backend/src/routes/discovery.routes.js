const express = require("express");
const router = express.Router();

const {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevOpsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
    getPersonalizedRecommendations,
    getTrendingConcepts,
    getHiddenGems,
    getExpertPicks,
    getDailyChallenge,
} = require("../controllers/discovery.controller");

// Definition of discovery routes for roadmaps and concepts

// GET /api/v1/discovery/roadmap/backend
router.get("/roadmap/backend", getBackendRoadmap);

// GET /api/v1/discovery/roadmap/frontend
router.get("/roadmap/frontend", getFrontendRoadmap);

// GET /api/v1/discovery/roadmap/devops
router.get("/roadmap/devops", getDevOpsRoadmap);

// GET /api/v1/discovery/roadmap/system-design
router.get("/roadmap/system-design", getSystemDesignRoadmap);

// GET /api/v1/discovery/suggest-next/:id
router.get("/suggest-next/:id", suggestNextConcept);

// GET /api/v1/discovery/recommended/:userId
router.get("/recommended/:userId", getPersonalizedRecommendations);

// GET /api/v1/discovery/trending
router.get("/trending", getTrendingConcepts);

// GET /api/v1/discovery/hidden-gems
router.get("/hidden-gems", getHiddenGems);

// GET /api/v1/discovery/expert-picks
router.get("/expert-picks", getExpertPicks);

// GET /api/v1/discovery/daily-challenge
router.get("/daily-challenge", getDailyChallenge);

module.exports = router;
