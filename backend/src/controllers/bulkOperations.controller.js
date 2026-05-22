const Prompt = require("../models/prompt.model");

// ──────────────────────────────────────────────
//  BULK OPERATIONS ROUTES
// ──────────────────────────────────────────────

// POST /api/v1/concepts/bulk/create — bulk create multiple concepts at once
const bulkCreateConcepts = async (req, res) => {
    try {
        const { concepts } = req.body; // get the array of concepts from request body

        // Basic validation — concepts array is required
        if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of concepts" });
        }

        // insertMany() creates multiple documents in one go — very efficient!
        const createdConcepts = await Prompt.insertMany(concepts);

        res.status(201).json({
            success: true,
            message: `${createdConcepts.length} concepts created successfully`,
            count: createdConcepts.length,
            data: createdConcepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// PATCH /api/v1/concepts/bulk/update — bulk update multiple concepts at once
const bulkUpdateConcepts = async (req, res) => {
    try {
        const { ids, updateData } = req.body; // get array of IDs and the fields to update

        // Basic validation — both ids array and updateData are required
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of concept IDs" });
        }
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "Please provide fields to update" });
        }

        // updateMany() updates all documents that match the filter
        // $in operator matches any ID in the provided array
        const result = await Prompt.updateMany(
            { _id: { $in: ids } },
            { $set: updateData }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} concepts updated successfully`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// DELETE /api/v1/concepts/bulk/delete — bulk delete multiple concepts at once
const bulkDeleteConcepts = async (req, res) => {
    try {
        const { ids } = req.body; // get the array of concept IDs to delete

        // Basic validation — ids array is required
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of concept IDs" });
        }

        // deleteMany() removes all documents matching the filter
        const result = await Prompt.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} concepts deleted successfully`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// PATCH /api/v1/concepts/bulk/archive — bulk archive (soft-delete) multiple concepts
const bulkArchiveConcepts = async (req, res) => {
    try {
        const { ids } = req.body; // get the array of concept IDs to archive

        // Basic validation — ids array is required
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of concept IDs" });
        }

        // Set isArchived to true for all matching concepts
        const result = await Prompt.updateMany(
            { _id: { $in: ids } },
            { $set: { isArchived: true } }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} concepts archived successfully`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// PATCH /api/v1/concepts/bulk/restore — bulk restore multiple archived concepts
const bulkRestoreConcepts = async (req, res) => {
    try {
        const { ids } = req.body; // get the array of concept IDs to restore

        // Basic validation — ids array is required
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of concept IDs" });
        }

        // Set isArchived back to false for all matching concepts
        const result = await Prompt.updateMany(
            { _id: { $in: ids } },
            { $set: { isArchived: false } }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} concepts restored successfully`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    bulkCreateConcepts,
    bulkUpdateConcepts,
    bulkDeleteConcepts,
    bulkArchiveConcepts,
    bulkRestoreConcepts,
};
