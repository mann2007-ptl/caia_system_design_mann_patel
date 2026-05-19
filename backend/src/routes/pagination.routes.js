const express = require("express");
const router = express.Router();

const {
    getStandardPagination,
    getCursorPagination,
    getInfiniteScrolling,
    getPaginatedLatestConcepts,
    getPaginatedTrending,
    getPaginatedBookmarks
} = require("../controllers/pagination.controller");

// ==========================================
// PURE PAGINATION ROUTES
// ==========================================

// These routes will match based on where they are mounted in app.js

// Matches: /api/v1/concepts/trending
router.get("/trending", getPaginatedTrending);

// Matches: /api/v1/concepts/bookmarks
router.get("/bookmarks", getPaginatedBookmarks);

// Matches: /api/v1/concepts/scroll
router.get("/scroll", getCursorPagination);

// Matches: /api/v1/concepts/infinite
router.get("/infinite", getInfiniteScrolling);

// Matches: /api/v1/concepts/latest
router.get("/latest", getPaginatedLatestConcepts);

// Matches: /api/v1/concepts/
router.get("/", getStandardPagination);

module.exports = router;
