const express = require("express");
const router = express.Router();

const {
    getAllConcepts,
    getRandomConcept,
    getLatestConcepts,
    getTrendingConcepts,
    getPopularConcepts,
    getConceptById,
    getConceptSummary,
    getConceptHistory,
    createConcept,
    replaceConcept,
    updateConcept,
    deleteConcept,
    archiveConcept,
    restoreConcept,
    getRelatedConcepts,
} = require("../controllers/prompt.controller");

// Special routes (MUST come before /:id routes)
router.get("/random", getRandomConcept);
router.get("/latest", getLatestConcepts);
router.get("/trending", getTrendingConcepts);
router.get("/popular", getPopularConcepts);

// Base CRUD routes
router.get("/", getAllConcepts);
router.get("/:id", getConceptById);
router.get("/:id/summary", getConceptSummary);
router.get("/:id/history", getConceptHistory);
router.get("/:id/related", getRelatedConcepts);
router.post("/", createConcept);
router.put("/:id", replaceConcept);
router.patch("/:id", updateConcept);
router.patch("/:id/archive", archiveConcept);
router.patch("/:id/restore", restoreConcept);
router.delete("/:id", deleteConcept);

module.exports = router;
