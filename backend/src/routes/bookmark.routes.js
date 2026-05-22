const express = require("express");
const router = express.Router();

const {
    bookmarkConcept,
    removeBookmark,
    getAllBookmarks,
    addNotes,
    getNotes,
} = require("../controllers/bookmark.controller");

// ──────────────────────────────────────────────
//  BOOKMARK ROUTES  →  mounted at /api/v1/bookmarks
// ──────────────────────────────────────────────

// POST /api/v1/bookmarks/:conceptId — bookmark a concept
router.post("/bookmarks/:conceptId", bookmarkConcept);

// DELETE /api/v1/bookmarks/:conceptId — remove bookmark
router.delete("/bookmarks/:conceptId", removeBookmark);

// GET /api/v1/bookmarks — fetch all bookmarked concepts
router.get("/bookmarks", getAllBookmarks);

// ──────────────────────────────────────────────
//  NOTES ROUTES  →  mounted at /api/v1/notes
// ──────────────────────────────────────────────

// POST /api/v1/notes/:conceptId — add notes to a concept
router.post("/notes/:conceptId", addNotes);

// GET /api/v1/notes/:conceptId — fetch notes for a concept
router.get("/notes/:conceptId", getNotes);

module.exports = router;
