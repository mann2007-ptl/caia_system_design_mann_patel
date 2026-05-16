const Prompt = require("../models/prompt.model");

// GET /api/v1/filter/category?name=Microservices
const filterByCategory = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.category": new RegExp(name, "i") };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this category" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/difficulty?level=beginner
const filterByDifficulty = async (req, res) => {
    try {
        const { level } = req.query;
        if (!level) {
            return res.status(400).json({ success: false, message: "Query parameter 'level' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.difficulty": new RegExp(level, "i") };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this difficulty level" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/pattern?name=Saga
const filterByPattern = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            $or: [
                { "metadata.subcategory": new RegExp(name, "i") },
                { "metadata.concept": new RegExp(name, "i") }
            ]
        };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this pattern" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/language?name=Go
const filterByLanguage = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.language": new RegExp(name, "i") };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this language" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/date?after=2025-01-01
const filterByDate = async (req, res) => {
    try {
        const { after } = req.query;
        if (!after) {
            return res.status(400).json({ success: false, message: "Query parameter 'after' is required" });
        }

        const date = new Date(after);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.generated_at": { $gte: date } };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found after this date" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/tags?list=redis,kafka
const filterByTags = async (req, res) => {
    try {
        const { list } = req.query;
        if (!list) {
            return res.status(400).json({ success: false, message: "Query parameter 'list' is required" });
        }

        const tags = list.split(",").map(tag => new RegExp(tag.trim(), "i"));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.concept": { $in: tags } };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for these tags" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/bookmarks
const fetchBookmarks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isBookmarked: true };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No bookmarked concepts found" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/trending
const fetchTrending = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Prompt.countDocuments();

        // Sort by createdAt and views for trending
        const results = await Prompt.find()
            .sort({ createdAt: -1, views: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/popular
const fetchPopular = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Prompt.countDocuments();

        // Sort purely by views
        const results = await Prompt.find()
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/filter/unexplored
const fetchUnexplored = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { $or: [{ views: 0 }, { views: { $exists: false } }, { views: null }] };

        const total = await Prompt.countDocuments(filter);
        if (total === 0) {
            return res.status(404).json({ success: false, message: "No unexplored concepts found" });
        }

        const results = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage,
    filterByDate,
    filterByTags,
    fetchBookmarks,
    fetchTrending,
    fetchPopular,
    fetchUnexplored,
};
