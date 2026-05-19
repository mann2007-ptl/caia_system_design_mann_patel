const Prompt = require("../models/prompt.model");

// GET /api/v1/concepts?page=1&limit=10 (Standard pagination)
// GET /api/v1/concepts?page=2&limit=20 (Fetch second page)
// Description: Standard pagination dynamically handles both page and limit queries.
const getStandardPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many documents to skip
        const skip = (page - 1) * limit;

        // Fetch paginated data and total count
        const concepts = await Prompt.find().skip(skip).limit(limit);
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
        console.error("Error in standard pagination:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/scroll?cursor=100
// Description: Cursor pagination 
const getCursorPagination = async (req, res) => {
    try {
        const cursor = req.query.cursor;
        const limit = parseInt(req.query.limit) || 10;

        let query = {};

        // If a cursor is provided, find documents with an ID greater than the cursor
        if (cursor) {
            const mongoose = require("mongoose");
            // Validate that the cursor is a proper 24-character hex MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cursor format. Cursor must be a valid MongoDB ObjectId (e.g., 60d5ec49c1242334abc...). Please do not use integers like 100."
                });
            }
            query = { _id: { $gt: cursor } };
        }

        // Fetch limited concepts based on cursor
        const concepts = await Prompt.find(query).limit(limit);

        // Determine the next cursor (the ID of the last document in the array)
        let nextCursor = null;
        if (concepts.length > 0) {
            nextCursor = concepts[concepts.length - 1]._id;
        }

        res.status(200).json({
            success: true,
            limit: limit,
            nextCursor: nextCursor,
            data: concepts
        });
    } catch (error) {
        console.error("Error in cursor pagination:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/infinite?page=1
// Description: Infinite scrolling 
const getInfiniteScrolling = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const concepts = await Prompt.find().skip(skip).limit(limit);
        const total = await Prompt.countDocuments();

        // Check if there is more data remaining
        const hasMore = skip + concepts.length < total;

        res.status(200).json({
            success: true,
            page: page,
            hasMore: hasMore,
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in infinite scrolling:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/latest?page=1&limit=5
// Description: Paginated latest concepts
const getPaginatedLatestConcepts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        // Sort by createdAt descending to get the latest first
        const concepts = await Prompt.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
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
        console.error("Error in paginated latest concepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/trending?page=1&limit=10 
// Description: Fetch concepts sorted by most views and latest creation
const getPaginatedTrending = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sort by views (popular) and then createdAt (newest)
        const concepts = await Prompt.find()
            .sort({ views: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in paginated trending:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/concepts/bookmarks?page=1&limit=10
// Description: Fetch only the concepts that are bookmarked
const getPaginatedBookmarks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isBookmarked: true };
        const concepts = await Prompt.find(filter).skip(skip).limit(limit);
        const total = await Prompt.countDocuments(filter);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalConcepts: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in paginated bookmarks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/categories?page=1&limit=20
// Description: Fetch a paginated list of all unique categories
const getPaginatedCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Use aggregation to get unique categories and paginate them
        const categories = await Prompt.aggregate([
            { $group: { _id: "$metadata.category" } },
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 0, name: "$_id" } }
        ]);

        // Count unique categories for totalPages calculation
        const totalResult = await Prompt.aggregate([
            { $group: { _id: "$metadata.category" } },
            { $count: "total" }
        ]);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalCategories: total,
            data: categories.map(c => c.name) // Return as simple array of strings
        });
    } catch (error) {
        console.error("Error in paginated categories:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/patterns?page=1&limit=20
// Description: Fetch a paginated list of all unique patterns (subcategories)
const getPaginatedPatterns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Use aggregation to get unique subcategories and paginate them
        const patterns = await Prompt.aggregate([
            { $group: { _id: "$metadata.subcategory" } },
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 0, name: "$_id" } }
        ]);

        const totalResult = await Prompt.aggregate([
            { $group: { _id: "$metadata.subcategory" } },
            { $count: "total" }
        ]);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPatterns: total,
            data: patterns.map(p => p.name)
        });
    } catch (error) {
        console.error("Error in paginated patterns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/search/results?q=keyword&page=1&limit=20
// Description: Simple keyword search with pagination
const getPaginatedSearchResults = async (req, res) => {
    try {
        const queryTerm = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (!queryTerm) {
            return res.status(400).json({ success: false, message: "Please providing a search term using ?q=" });
        }

        const regex = new RegExp(queryTerm, "i");
        const filter = {
            $or: [
                { prompt: regex },
                { response: regex },
                { "metadata.concept": regex },
                { "metadata.category": regex },
                { "metadata.subcategory": regex }
            ]
        };

        const concepts = await Prompt.find(filter).skip(skip).limit(limit);
        const total = await Prompt.countDocuments(filter);

        res.status(200).json({
            success: true,
            searchTerm: queryTerm,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            data: concepts
        });
    } catch (error) {
        console.error("Error in paginated search:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getStandardPagination,
    getCursorPagination,
    getInfiniteScrolling,
    getPaginatedLatestConcepts,
    getPaginatedTrending,
    getPaginatedBookmarks,
    getPaginatedCategories,
    getPaginatedPatterns,
    getPaginatedSearchResults
};
