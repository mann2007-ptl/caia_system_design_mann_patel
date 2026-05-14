const express = require("express");
const router = express.Router();

const {
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
} = require("../controllers/taxonomy.controller");

router.get("/categories", getAllCategories);
router.get("/categories/:category", getCategoryDetails);
router.get("/categories/:category/concepts", getConceptsByCategory);
router.get("/subcategories", getAllSubcategories);

module.exports = router;
