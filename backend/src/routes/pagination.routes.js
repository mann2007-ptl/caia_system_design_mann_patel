const express = require("express");
const router = express.Router();

const {
    getStandardPagination,
    getCursorPagination,
    getInfiniteScrolling,
    getPaginatedLatestConcepts
} = require("../controllers/pagination.controller");

// Route: GET /api/v1/concepts/scroll
// Description: Cursor pagination approach
router.get("/scroll", getCursorPagination);

// Route: GET /api/v1/concepts/infinite
// Description: Infinite scrolling approach with page
router.get("/infinite", getInfiniteScrolling);

// Route: GET /api/v1/concepts/latest
// Description: Retrieve a paginated list of the most recent concepts
router.get("/latest", getPaginatedLatestConcepts);

// Route: GET /api/v1/concepts
// Description: Standard pagination mechanism. 
// Handles both: ?page=1&limit=10 AND ?page=2&limit=20 dynamically.
router.get("/", getStandardPagination);

module.exports = router;
