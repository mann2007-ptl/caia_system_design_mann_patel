const Prompt = require("../models/prompt.model");

// GET /api/v1/analytics/total-concepts
// Description: Returns the total number of concepts in the database
const getTotalConcepts = async (req, res) => {
    try {
        // countDocuments() counts all documents in the collection
        const total = await Prompt.countDocuments();

        res.status(200).json({
            success: true,
            totalConcepts: total
        });
    } catch (error) {
        console.error("Error in getTotalConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/category-distribution
// Description: Returns how many concepts exist in each category
const getCategoryDistribution = async (req, res) => {
    try {
        // Aggregation pipeline groups documents by category and counts them
        const distribution = await Prompt.aggregate([
            // Step 1: Group all documents by their category field
            {
                $group: {
                    _id: "$metadata.category",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (highest first)
            { $sort: { count: -1 } },
            // Step 3: Rename _id to category for cleaner output
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalCategories: distribution.length,
            data: distribution
        });
    } catch (error) {
        console.error("Error in getCategoryDistribution:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/difficulty-stats
// Description: Returns the count of concepts for each difficulty level
const getDifficultyStats = async (req, res) => {
    try {
        // Aggregation pipeline groups documents by difficulty and counts them
        const stats = await Prompt.aggregate([
            // Step 1: Group all documents by their difficulty field
            {
                $group: {
                    _id: "$metadata.difficulty",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (highest first)
            { $sort: { count: -1 } },
            // Step 3: Rename _id to difficulty for cleaner output
            {
                $project: {
                    _id: 0,
                    difficulty: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalDifficultyLevels: stats.length,
            data: stats
        });
    } catch (error) {
        console.error("Error in getDifficultyStats:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/patterns/top
// Description: Returns the top patterns (subcategories) sorted by how many concepts they have
const getTopPatterns = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topPatterns = await Prompt.aggregate([
            // Step 1: Group all documents by their subcategory (pattern) field
            {
                $group: {
                    _id: "$metadata.subcategory",
                    count: { $sum: 1 }
                }
            },
            // Step 2: Sort by count in descending order (most concepts first)
            { $sort: { count: -1 } },
            // Step 3: Limit the results to the top N patterns
            { $limit: limit },
            // Step 4: Rename _id to pattern for cleaner output
            {
                $project: {
                    _id: 0,
                    pattern: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topPatterns
        });
    } catch (error) {
        console.error("Error in getTopPatterns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/languages/top
// Description: Returns the top programming languages sorted by how many concepts they have
const getTopLanguages = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topLanguages = await Prompt.aggregate([
            // Step 1: Only include documents that have a non-empty language field
            {
                $match: {
                    "metadata.language": { $ne: "" }
                }
            },
            // Step 2: Group all documents by their language field
            {
                $group: {
                    _id: "$metadata.language",
                    count: { $sum: 1 }
                }
            },
            // Step 3: Sort by count in descending order (most concepts first)
            { $sort: { count: -1 } },
            // Step 4: Limit the results to the top N languages
            { $limit: limit },
            // Step 5: Rename _id to language for cleaner output
            {
                $project: {
                    _id: 0,
                    language: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topLanguages
        });
    } catch (error) {
        console.error("Error in getTopLanguages:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/views/top
// Description: Returns the most viewed concepts sorted by view count (highest first)
const getTopViewedConcepts = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        // Find all concepts, sort by views descending, and limit results
        const topViewed = await Prompt.find()
            .sort({ views: -1 })   // -1 means descending (highest views first)
            .limit(limit)
            .select("metadata.concept metadata.category views"); // Only return needed fields

        res.status(200).json({
            success: true,
            limit: limit,
            data: topViewed
        });
    } catch (error) {
        console.error("Error in getTopViewedConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/bookmarks/top
// Description: Returns the most bookmarked concepts (only those that are bookmarked)
const getTopBookmarkedConcepts = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        // Find only bookmarked concepts, sort by views as a secondary ranking
        const topBookmarked = await Prompt.find({ isBookmarked: true })
            .sort({ views: -1 })   // Among bookmarked items, show most viewed first
            .limit(limit)
            .select("metadata.concept metadata.category views isBookmarked");

        res.status(200).json({
            success: true,
            limit: limit,
            totalBookmarked: topBookmarked.length,
            data: topBookmarked
        });
    } catch (error) {
        console.error("Error in getTopBookmarkedConcepts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/trending
// Description: Returns trending categories with their total views and concept counts
const getTrendingAnalytics = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const trending = await Prompt.aggregate([
            // Step 1: Group documents by category
            {
                $group: {
                    _id: "$metadata.category",
                    totalViews: { $sum: "$views" },       // Sum up all views in this category
                    conceptCount: { $sum: 1 },             // Count how many concepts are in this category
                    bookmarkedCount: {                      // Count how many are bookmarked
                        $sum: { $cond: ["$isBookmarked", 1, 0] }
                    }
                }
            },
            // Step 2: Sort by totalViews descending (most viewed categories first)
            { $sort: { totalViews: -1 } },
            // Step 3: Limit to top N categories
            { $limit: limit },
            // Step 4: Rename _id to category for cleaner output
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalViews: 1,
                    conceptCount: 1,
                    bookmarkedCount: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: trending
        });
    } catch (error) {
        console.error("Error in getTrendingAnalytics:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/growth
// Description: Returns monthly growth stats (how many concepts were added each month)
const getMonthlyGrowth = async (req, res) => {
    try {
        const growth = await Prompt.aggregate([
            // Step 1: Group documents by year and month of their createdAt timestamp
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },     // Extract year from createdAt
                        month: { $month: "$createdAt" }    // Extract month from createdAt
                    },
                    count: { $sum: 1 }   // Count how many concepts were created in this month
                }
            },
            // Step 2: Sort chronologically (oldest month first)
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            // Step 3: Clean up the output format
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    conceptsAdded: "$count"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalMonths: growth.length,
            data: growth
        });
    } catch (error) {
        console.error("Error in getMonthlyGrowth:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/analytics/searches/top
// Description: Returns the most frequently appearing concept keywords (most searched topics)
const getTopSearchedKeywords = async (req, res) => {
    try {
        // Get the limit from query, default to 10
        const limit = parseInt(req.query.limit) || 10;

        const topKeywords = await Prompt.aggregate([
            // Step 1: Group documents by their concept name (acts as keyword)
            {
                $group: {
                    _id: "$metadata.concept",
                    count: { $sum: 1 }   // Count how many times this concept appears
                }
            },
            // Step 2: Sort by count descending (most common keywords first)
            { $sort: { count: -1 } },
            // Step 3: Limit to top N keywords
            { $limit: limit },
            // Step 4: Rename _id to keyword for cleaner output
            {
                $project: {
                    _id: 0,
                    keyword: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            limit: limit,
            data: topKeywords
        });
    } catch (error) {
        console.error("Error in getTopSearchedKeywords:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getTopViewedConcepts,
    getTopBookmarkedConcepts,
    getTrendingAnalytics,
    getMonthlyGrowth,
    getTopSearchedKeywords
};
