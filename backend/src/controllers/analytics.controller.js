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

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages
};
