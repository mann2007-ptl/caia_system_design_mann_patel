const express = require("express");
const router = express.Router();

const {
    validateConcept,
    validateConceptUpdate,
    validateSearch,
    validateTags,
    validateUpload
} = require("../controllers/validation.controller");

router.post("/concept", validateConcept);
router.patch("/concept/:id", validateConceptUpdate);
router.post("/search", validateSearch);
router.post("/tags", validateTags);
router.post("/upload", validateUpload);

module.exports = router;
