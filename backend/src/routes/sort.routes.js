const express = require("express");
const router = express.Router();

const {
    sortByTitle,
    sortNewestFirst,
    sortOldestFirst,
    sortByViews,
    sortByBookmarks,
    sortByDifficulty,
    sortByCategory,
    sortByLanguage,
    sortByPopularity,
    sortByUpdatedAt
} = require("../controllers/sort.controller");

// ==========================================
// SORTING ROUTES
// ==========================================
// We use a single route "/" to detect the "sort" query parameter.
// This allows cleanly mapping "?sort=..." to the 10 requested route functions.
// If the sort parameter doesn't match our cases, we call next() to pass 
// the request down to standard pagination or other routers.

router.get("/", (req, res, next) => {
    const sortParams = req.query.sort;

    if (!sortParams) {
        // No sort param found, pass to the next route handler (e.g. standard pagination)
        return next();
    }

    // Switch case for the 10 different sorting requested endpoints
    switch (sortParams) {
        case "title":
            return sortByTitle(req, res);

        case "-createdAt":
            return sortNewestFirst(req, res);

        case "createdAt":
            return sortOldestFirst(req, res);

        case "views":
            return sortByViews(req, res);

        case "bookmarks":
            return sortByBookmarks(req, res);

        case "difficulty":
            return sortByDifficulty(req, res);

        case "category":
            return sortByCategory(req, res);

        case "language":
            return sortByLanguage(req, res);

        case "popularity":
            return sortByPopularity(req, res);

        case "updatedAt":
            return sortByUpdatedAt(req, res);

        default:
            // If it's a sort parameter we don't recognize, we simply pass to the next handler
            return next();
    }
});

module.exports = router;
