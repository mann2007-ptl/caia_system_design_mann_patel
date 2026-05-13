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

// GET /api/v1/concepts/random — fetch one random concept
const getRandomConcept = async (req, res) => {
    try {
        const concepts = await Prompt.aggregate([{ $sample: { size: 1 } }]);

        res.status(200).json({ success: true, data: concepts[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/latest — fetch 10 most recently added concepts
const getLatestConcepts = async (req, res) => {
    try {
        const concepts = await Prompt.find().sort({ createdAt: -1 }).limit(10);

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/trending — fetch trending categories (most concepts per category)
const getTrendingConcepts = async (req, res) => {
    try {
        const trending = await Prompt.aggregate([
            { $group: { _id: "$metadata.category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, category: "$_id", count: 1 } },
        ]);

        res.status(200).json({ success: true, data: trending });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/popular — fetch top 10 most viewed concepts
const getPopularConcepts = async (req, res) => {
    try {
        const concepts = await Prompt.find().sort({ views: -1 }).limit(10);

        res.status(200).json({ success: true, count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/:id — fetch single concept (also increments views)
const getConceptById = async (req, res) => {
    try {
        const concept = await Prompt.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, data: concept });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/:id/summary — fetch only key fields of a concept
const getConceptSummary = async (req, res) => {
    try {
        const concept = await Prompt.findById(req.params.id).select(
            "prompt metadata.category metadata.subcategory metadata.concept"
        );

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, data: concept });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/:id/history — fetch version history (timestamps)
const getConceptHistory = async (req, res) => {
    try {
        const concept = await Prompt.findById(req.params.id).select(
            "prompt createdAt updatedAt"
        );

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: concept._id,
                prompt: concept.prompt,
                createdAt: concept.createdAt,
                updatedAt: concept.updatedAt,
                isModified: concept.createdAt?.toString() !== concept.updatedAt?.toString(),
            },
        });
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

// PATCH /api/v1/concepts/:id/archive — soft-delete (archive) a concept
const archiveConcept = async (req, res) => {
    try {
        // Find the concept and set isArchived to true
        const concept = await Prompt.findByIdAndUpdate(
            req.params.id,
            { isArchived: true },
            { new: true } // return the updated document
        );

        // If no concept found with that id, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, message: "Concept archived successfully", data: concept });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// PATCH /api/v1/concepts/:id/restore — restore an archived concept
const restoreConcept = async (req, res) => {
    try {
        // Find the concept and set isArchived back to false
        const concept = await Prompt.findByIdAndUpdate(
            req.params.id,
            { isArchived: false },
            { new: true } // return the updated document
        );

        // If no concept found with that id, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({ success: true, message: "Concept restored successfully", data: concept });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/:id/related — fetch concepts with same category or subcategory
const getRelatedConcepts = async (req, res) => {
    try {
        // Step 1: Find the original concept so we know its category & subcategory
        const concept = await Prompt.findById(req.params.id);

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        // Step 2: Find other concepts that share the same category OR subcategory
        //         but exclude the original concept itself using $ne (not equal)
        const related = await Prompt.find({
            _id: { $ne: concept._id }, // exclude current concept
            $or: [
                { "metadata.category": concept.metadata.category },
                { "metadata.subcategory": concept.metadata.subcategory },
            ],
        }).limit(10); // return at most 10 related concepts

        res.status(200).json({ success: true, count: related.length, data: related });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getAllConcepts,
    getRandomConcept,
    getLatestConcepts,
    getTrendingConcepts,
    getPopularConcepts,
    getConceptById,
    getConceptSummary,
    getConceptHistory,
    createConcept,
    replaceConcept,
    updateConcept,
    deleteConcept,
    archiveConcept,
    restoreConcept,
    getRelatedConcepts,
};
