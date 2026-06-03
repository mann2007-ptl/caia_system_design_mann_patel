const Prompt = require("../models/prompt.model");

// GET /api/v1/discovery/roadmap/backend
const getBackendRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to backend architecture or patterns
        const backendConcepts = await Prompt.find({ "metadata.category": /backend/i }).limit(20);

        res.status(200).json({
            success: true,
            title: "Backend Learning Roadmap",
            description: "A beginner-friendly guided path to learn backend concepts, APIs, and databases.",
            count: backendConcepts.length,
            data: backendConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/frontend
const getFrontendRoadmap = async (req, res) => {
    try {
        const frontendConcepts = await Prompt.find({ "metadata.category": /frontend/i }).limit(20);

        res.status(200).json({
            success: true,
            title: "Frontend Learning Roadmap",
            description: "A beginner-friendly guided path to learn frontend UI/UX, frameworks, and web vitals.",
            count: frontendConcepts.length,
            data: frontendConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/devops
const getDevOpsRoadmap = async (req, res) => {
    try {
        const devopsConcepts = await Prompt.find({ "metadata.category": /devops/i }).limit(20);

        res.status(200).json({
            success: true,
            title: "DevOps Learning Roadmap",
            description: "A beginner-friendly guided path to learn CI/CD, deployments, and cloud infrastructure.",
            count: devopsConcepts.length,
            data: devopsConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/roadmap/system-design
const getSystemDesignRoadmap = async (req, res) => {
    try {
        const systemDesignConcepts = await Prompt.find({ "metadata.category": /system design/i }).limit(20);

        res.status(200).json({
            success: true,
            title: "System Design Roadmap",
            description: "A beginner-friendly step-by-step path to master core system design concepts and scalability.",
            count: systemDesignConcepts.length,
            data: systemDesignConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/suggest-next/:id
const suggestNextConcept = async (req, res) => {
    try {
        const promptId = req.params.id;

        // Find the current concept based on its ID
        const currentConcept = await Prompt.findById(promptId);

        if (!currentConcept) {
            return res.status(404).json({ success: false, message: "Current concept not found" });
        }

        // Find a suggestion in the same category or subcategory that is not the current concept
        const suggestion = await Prompt.findOne({
            "metadata.category": currentConcept.metadata.category,
            _id: { $ne: promptId }
        });

        res.status(200).json({
            success: true,
            message: suggestion ? "Suggested next concept ready!" : "No further concepts in this category.",
            data: suggestion || null,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/recommended/:userId
const getPersonalizedRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        // For a beginner implementation, we fetch a few simple concepts as "recommendations"
        const recommendedConcepts = await Prompt.find().limit(5);

        res.status(200).json({
            success: true,
            title: "Your Personalized Recommendations",
            description: `Hand-picked concepts suggested to help you learn better, user ${userId}.`,
            count: recommendedConcepts.length,
            data: recommendedConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/trending
const getTrendingConcepts = async (req, res) => {
    try {
        // Trending means highly viewed. We sort by views descending
        const trendingConcepts = await Prompt.find().sort({ views: -1 }).limit(10);

        res.status(200).json({
            success: true,
            title: "Trending Concepts",
            description: "The most popular topics everyone is reading right now.",
            count: trendingConcepts.length,
            data: trendingConcepts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/hidden-gems
const getHiddenGems = async (req, res) => {
    try {
        // Hidden gems: low views, perhaps newly added
        const hiddenGems = await Prompt.find({ views: { $lte: 5 } }).limit(5);

        res.status(200).json({
            success: true,
            title: "Hidden Gems",
            description: "Explore these lesser-known but highly valuable concepts.",
            count: hiddenGems.length,
            data: hiddenGems
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/expert-picks
const getExpertPicks = async (req, res) => {
    try {
        // Expert picks might be advanced concepts. We filter by difficulty.
        const expertPicks = await Prompt.find({ "metadata.difficulty": { $in: [new RegExp("advanced", "i"), new RegExp("expert", "i")] } }).limit(5);

        res.status(200).json({
            success: true,
            title: "Expert Picks",
            description: "Highly recommended advanced concepts selected by industry experts.",
            count: expertPicks.length,
            data: expertPicks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/discovery/daily-challenge
const getDailyChallenge = async (req, res) => {
    try {
        // Daily challenge could return a single random concept to focus on.
        // Using MongoDB $sample aggregation gets a random document
        const dailyChallenge = await Prompt.aggregate([{ $sample: { size: 1 } }]);

        res.status(200).json({
            success: true,
            title: "Daily System Design Challenge",
            description: "Your random challenge for today. Let's see if you can tackle it!",
            data: dailyChallenge.length ? dailyChallenge[0] : null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevOpsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
    getPersonalizedRecommendations,
    getTrendingConcepts,
    getHiddenGems,
    getExpertPicks,
    getDailyChallenge,
};
