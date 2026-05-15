const express = require("express");
const router = express.Router();

const {
    globalSearch,
    searchByTitle,
    searchByContent,
    searchByTags,
    searchByPatterns,
    searchByLanguage,
    searchByCategory,
    searchByDifficulty,
    fuzzySearch,
    autocomplete,
} = require("../controllers/search.controller");

// --- Search routes ---
router.get("/", globalSearch);
router.get("/title", searchByTitle);
router.get("/content", searchByContent);
router.get("/tags", searchByTags);
router.get("/patterns", searchByPatterns);

// --- Additional Search Routes ---
router.get("/language", searchByLanguage);
router.get("/category", searchByCategory);
router.get("/difficulty", searchByDifficulty);
router.get("/fuzzy", fuzzySearch);
router.get("/autocomplete", autocomplete);

module.exports = router;
