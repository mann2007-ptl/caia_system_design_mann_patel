const Prompt = require("../models/prompt.model");

// GET /api/v1/concepts?sort=title
// Description: Sort by title (alphabetically). We use metadata.concept as the title.
const sortByTitle = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 1 means ascending order (A to Z)
        const concepts = await Prompt.find()
            .sort({ "metadata.concept": 1 })
            .skip(skip)
            .limit(limit);

        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in sortByTitle:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts?sort=-createdAt
// Description: Sort newest first
const sortNewestFirst = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // -1 means descending order (Newest first)
        const concepts = await Prompt.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in sortNewestFirst:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts?sort=createdAt
// Description: Sort oldest first
const sortOldestFirst = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 1 means ascending order (Oldest first)
        const concepts = await Prompt.find()
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in sortOldestFirst:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts?sort=views
// Description: Sort by views
const sortByViews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // -1 means descending order (Highest views first)
        const concepts = await Prompt.find()
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in sortByViews:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts?sort=bookmarks
// Description: Sort by bookmarks (Show bookmarked items first)
const sortByBookmarks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // -1 puts the true values (bookmarked) ahead of false values (unbookmarked)
        const concepts = await Prompt.find()
            .sort({ isBookmarked: -1, createdAt: -1 }) // Tie-breaker is newest first
            .skip(skip)
            .limit(limit);

        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in sortByBookmarks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    sortByTitle,
    sortNewestFirst,
    sortOldestFirst,
    sortByViews,
    sortByBookmarks
};
