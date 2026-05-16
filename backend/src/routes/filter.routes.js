const express = require("express");
const {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage,
    filterByDate,
    filterByTags,
    fetchBookmarks,
    fetchTrending,
    fetchPopular,
    fetchUnexplored,
    fetchExpertOnly,
    fetchFrontend,
    fetchBackend,
    fetchDevops,
    fetchCloud,
} = require("../controllers/filter.controller");

const router = express.Router();

router.get("/category", filterByCategory);
router.get("/difficulty", filterByDifficulty);
router.get("/pattern", filterByPattern);
router.get("/language", filterByLanguage);
router.get("/date", filterByDate);

router.get("/tags", filterByTags);
router.get("/bookmarks", fetchBookmarks);
router.get("/trending", fetchTrending);
router.get("/popular", fetchPopular);
router.get("/unexplored", fetchUnexplored);

router.get("/expert-only", fetchExpertOnly);
router.get("/frontend", fetchFrontend);
router.get("/backend", fetchBackend);
router.get("/devops", fetchDevops);
router.get("/cloud", fetchCloud);

module.exports = router;
