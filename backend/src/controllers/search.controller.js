const Prompt = require("../models/prompt.model");

// GET /api/v1/search?q=scaling — global keyword search across prompt, response, and metadata fields
const globalSearch = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Case-insensitive regex to match the keyword
        const regex = new RegExp(keyword, "i");

        // Search across multiple fields using $or
        const filter = {
            $or: [
                { prompt: regex },
                { response: regex },
                { "metadata.concept": regex },
                { "metadata.category": regex },
                { "metadata.subcategory": regex },
            ],
        };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
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

// GET /api/v1/search/title?q=redis — search inside prompt (title) field only
const searchByTitle = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { prompt: new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this title search" });
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

// GET /api/v1/search/content?q=database — search inside response field only
const searchByContent = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { response: new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this content search" });
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

// GET /api/v1/search/tags?q=caching — search inside metadata.concept (tags) field
const searchByTags = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.concept": new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this tag search" });
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

// GET /api/v1/search/patterns?q=CQRS — search inside metadata.subcategory (patterns) field
const searchByPatterns = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.subcategory": new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this pattern search" });
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

// GET /api/v1/search/language?q=python
const searchByLanguage = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.language": new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this language search" });
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

// GET /api/v1/search/category?q=distributed
const searchByCategory = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.category": new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this category search" });
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

// GET /api/v1/search/difficulty?q=advanced
const searchByDifficulty = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.difficulty": new RegExp(keyword, "i") };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this difficulty search" });
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

// GET /api/v1/search/fuzzy?q=kafaka
const fuzzySearch = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const fuzzyRegex = new RegExp(keyword.split("").join(".*"), "i");

        const filter = {
            $or: [
                { prompt: fuzzyRegex },
                { "metadata.concept": fuzzyRegex }
            ]
        };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this fuzzy search" });
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

// GET /api/v1/search/autocomplete?q=event
const autocomplete = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const filter = { prompt: new RegExp(keyword, "i") };
        const results = await Prompt.find(filter).select("prompt").limit(5);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/search/recent — fetch recently added concepts
const getRecentSearches = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Prompt.countDocuments();

        // Sort by createdAt descending
        const results = await Prompt.find()
            .sort({ createdAt: -1 })
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

// GET /api/v1/search/popular — fetch trending searches based on views
const getPopularSearches = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Prompt.countDocuments();

        // Sort by views descending
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

// GET /api/v1/search/voice?q=load balancing — voice tolerant search
const voiceSearch = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Clean punctuation and replace spaces with optional wildcard to tolerate voice dictation errors
        const cleaned = keyword.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const voiceRegex = new RegExp(cleaned.split(/\s+/).join(".*?"), "i");

        const filter = {
            $or: [
                { prompt: voiceRegex },
                { response: voiceRegex },
                { "metadata.concept": voiceRegex }
            ]
        };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No results found for this voice search" });
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

// GET /api/v1/search/exact?q=event sourcing — strict exact phrase bounded search
const exactSearch = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Escape regex special characters to ensure an exact literal match
        const escapedKeyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const exactRegex = new RegExp(`\\b${escapedKeyword}\\b`, "i");

        const filter = {
            $or: [
                { prompt: exactRegex },
                { response: exactRegex }
            ]
        };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No exact matches found" });
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

// GET /api/v1/search/regex?pattern=cache — raw developer regex search
const regexSearch = async (req, res) => {
    try {
        const pattern = req.query.pattern;

        if (!pattern) {
            return res.status(400).json({ success: false, message: "Query parameter 'pattern' is required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let rawRegex;
        try {
            // Test if developer provided a valid regex pattern
            rawRegex = new RegExp(pattern, "i");
        } catch (e) {
            return res.status(400).json({ success: false, message: "Invalid Regular Expression" });
        }

        const filter = {
            $or: [
                { prompt: rawRegex },
                { response: rawRegex }
            ]
        };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({ success: false, message: "No matches found for this regex" });
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
    globalSearch,
    searchByTitle,
    searchByContent,
    searchByTags,
    searchByPatterns,
    searchByLanguage,
    searchByCategory,
    searchByDifficulty,
    fuzzySearch,
    autocomplete,
    getRecentSearches,
    getPopularSearches,
    voiceSearch,
    exactSearch,
    regexSearch,
};
