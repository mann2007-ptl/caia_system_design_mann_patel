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
    getRecentSearches,
    getPopularSearches,
    voiceSearch,
    exactSearch,
    regexSearch,
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

// --- Advanced Search Use-Cases ---
router.get("/recent", getRecentSearches);
router.get("/popular", getPopularSearches);
router.get("/voice", voiceSearch);
router.get("/exact", exactSearch);
router.get("/regex", regexSearch);

module.exports = router;
