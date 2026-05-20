const Prompt = require("../models/prompt.model");

// GET /api/v1/discovery/roadmap/backend
const getBackendRoadmap = async (req, res) => {
    try {
        // Fetch concepts related to backend architecture or patterns
        // Using regex case-insensitive matching for beginner-friendly learning path
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

module.exports = {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevOpsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
};
