const express = require("express");
const router = express.Router();

const {
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
} = require("../controllers/taxonomy.controller");

router.get("/categories", getAllCategories);
router.get("/categories/:category", getCategoryDetails);
router.get("/categories/:category/concepts", getConceptsByCategory);
router.get("/subcategories", getAllSubcategories);
router.get("/tags", getAllTags);
router.get("/tags/:tag", getConceptsByTag);
router.get("/patterns", getAllPatterns);
router.get("/patterns/:patternName", getConceptsByPattern);

module.exports = router;
