const Prompt = require("../models/prompt.model");

// ──────────────────────────────────────────────
//  BOOKMARK ROUTES
// ──────────────────────────────────────────────

// POST /api/v1/bookmarks/:conceptId — bookmark a concept
const bookmarkConcept = async (req, res) => {
    try {
        // Find the concept by its ID and set isBookmarked to true
        const concept = await Prompt.findByIdAndUpdate(
            req.params.conceptId,
            { isBookmarked: true },
            { new: true } // return the updated document
        );

        // If no concept found, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            message: "Concept bookmarked successfully",
            data: concept,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// DELETE /api/v1/bookmarks/:conceptId — remove bookmark from a concept
const removeBookmark = async (req, res) => {
    try {
        // Find the concept by its ID and set isBookmarked back to false
        const concept = await Prompt.findByIdAndUpdate(
            req.params.conceptId,
            { isBookmarked: false },
            { new: true } // return the updated document
        );

        // If no concept found, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully",
            data: concept,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/bookmarks — fetch all bookmarked concepts
const getAllBookmarks = async (req, res) => {
    try {
        // Find all concepts where isBookmarked is true
        const bookmarks = await Prompt.find({ isBookmarked: true });

        res.status(200).json({
            success: true,
            count: bookmarks.length,
            data: bookmarks,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ──────────────────────────────────────────────
//  NOTES ROUTES
// ──────────────────────────────────────────────

// POST /api/v1/notes/:conceptId — add or update notes for a concept
const addNotes = async (req, res) => {
    try {
        const { notes } = req.body; // get the notes text from request body

        // Basic validation — notes text is required
        if (!notes) {
            return res.status(400).json({ success: false, message: "Notes text is required" });
        }

        // Find the concept and update its notes field
        const concept = await Prompt.findByIdAndUpdate(
            req.params.conceptId,
            { notes: notes },
            { new: true } // return the updated document
        );

        // If no concept found, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notes added successfully",
            data: concept,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/notes/:conceptId — fetch notes for a specific concept
const getNotes = async (req, res) => {
    try {
        // Find the concept and return only the notes field
        const concept = await Prompt.findById(req.params.conceptId).select("prompt notes");

        // If no concept found, send 404
        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: concept._id,
                prompt: concept.prompt,
                notes: concept.notes,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    bookmarkConcept,
    removeBookmark,
    getAllBookmarks,
    addNotes,
    getNotes,
};
