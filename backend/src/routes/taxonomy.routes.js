const express = require("express");
const router = express.Router();

const {
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
    getAllLanguages,
    getConceptsByLanguage,
    getAllDifficulties,
    getConceptsByDifficulty,
    getAllQuestionTypes,
    getConceptsByQuestionType,
    getMicroservicesConcepts,
} = require("../controllers/taxonomy.controller");

router.get("/categories", getAllCategories);
router.get("/categories/:category", getCategoryDetails);
router.get("/categories/:category/concepts", getConceptsByCategory);
router.get("/subcategories", getAllSubcategories);
router.get("/tags", getAllTags);
router.get("/tags/:tag", getConceptsByTag);
router.get("/patterns", getAllPatterns);
router.get("/patterns/:patternName", getConceptsByPattern);

// --- Language routes ---
router.get("/languages", getAllLanguages);
router.get("/languages/:language", getConceptsByLanguage);

// --- Difficulty routes ---
router.get("/difficulty", getAllDifficulties);
router.get("/difficulty/:level", getConceptsByDifficulty);

// --- Question-type routes ---
router.get("/question-types", getAllQuestionTypes);
router.get("/question-types/:type", getConceptsByQuestionType);

// --- Architecture routes ---
router.get("/architectures/microservices", getMicroservicesConcepts);

module.exports = router;
