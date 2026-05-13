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
router.post("/", createConcept);
router.put("/:id", replaceConcept);
router.patch("/:id", updateConcept);
router.delete("/:id", deleteConcept);

module.exports = router;
