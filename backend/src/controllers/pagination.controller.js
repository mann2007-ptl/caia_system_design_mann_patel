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

module.exports = {
    getStandardPagination,
    getCursorPagination,
    getInfiniteScrolling,
    getPaginatedLatestConcepts
};
