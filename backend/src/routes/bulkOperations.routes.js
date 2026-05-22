const express = require("express");
const router = express.Router();

const {
    bulkCreateConcepts,
    bulkUpdateConcepts,
    bulkDeleteConcepts,
    bulkArchiveConcepts,
    bulkRestoreConcepts,
} = require("../controllers/bulkOperations.controller");

// ──────────────────────────────────────────────
//  BULK OPERATIONS ROUTES  →  mounted at /api/v1/concepts/bulk
// ──────────────────────────────────────────────

// POST /api/v1/concepts/bulk/create — bulk create multiple concepts
router.post("/create", bulkCreateConcepts);

// PATCH /api/v1/concepts/bulk/update — bulk update multiple concepts
router.patch("/update", bulkUpdateConcepts);

// DELETE /api/v1/concepts/bulk/delete — bulk delete multiple concepts
router.delete("/delete", bulkDeleteConcepts);

// PATCH /api/v1/concepts/bulk/archive — bulk archive multiple concepts
router.patch("/archive", bulkArchiveConcepts);

// PATCH /api/v1/concepts/bulk/restore — bulk restore archived concepts
router.patch("/restore", bulkRestoreConcepts);

module.exports = router;
