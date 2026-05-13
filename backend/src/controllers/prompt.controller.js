const Prompt = require("../models/prompt.model");

// GET /api/v1/concepts — fetch all concepts (paginated)
const getAllConcepts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Prompt.countDocuments();
        const concepts = await Prompt.find().skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/:id — fetch single concept
const getConceptById = async (req, res) => {
    try {
        const concept = await Prompt.findById(req.params.id);

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, data: concept });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// POST /api/v1/concepts — create new concept
const createConcept = async (req, res) => {
    try {
        const concept = await Prompt.create(req.body);

        res.status(201).json({ success: true, message: "Concept created successfully", data: concept });
    } catch (error) {
        res.status(400).json({ success: false, message: "Could not create concept" });
    }
};

// PUT /api/v1/concepts/:id — replace complete concept
const replaceConcept = async (req, res) => {
    try {
        const concept = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            overwrite: true,
        });

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, message: "Concept replaced successfully", data: concept });
    } catch (error) {
        res.status(400).json({ success: false, message: "Could not replace concept" });
    }
};

// PATCH /api/v1/concepts/:id — update specific fields
const updateConcept = async (req, res) => {
    try {
        const concept = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, message: "Concept updated successfully", data: concept });
    } catch (error) {
        res.status(400).json({ success: false, message: "Could not update concept" });
    }
};

// DELETE /api/v1/concepts/:id — delete concept
const deleteConcept = async (req, res) => {
    try {
        const concept = await Prompt.findByIdAndDelete(req.params.id);

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, message: "Concept deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getAllConcepts,
    getConceptById,
    createConcept,
    replaceConcept,
    updateConcept,
    deleteConcept,
};
