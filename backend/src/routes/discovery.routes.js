const express = require("express");
const router = express.Router();

const {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevOpsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
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

module.exports = router;
