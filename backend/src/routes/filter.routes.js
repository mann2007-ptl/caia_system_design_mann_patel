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

module.exports = router;
