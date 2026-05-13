const express = require("express");
const router = express.Router();

const {
    getAllConcepts,
    getConceptById,
    createConcept,
    replaceConcept,
    updateConcept,
    deleteConcept,
} = require("../controllers/prompt.controller");

router.get("/", getAllConcepts);
router.get("/:id", getConceptById);
router.post("/", createConcept);
router.put("/:id", replaceConcept);
router.patch("/:id", updateConcept);
router.delete("/:id", deleteConcept);

module.exports = router;
