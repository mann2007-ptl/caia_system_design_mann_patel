const Prompt = require("../models/prompt.model");

/**
 * @desc    Protected route for concepts
 * @route   GET /api/v1/protected/concepts
 * @access  Private
 */
const getProtectedConcepts = async (req, res) => {
    try {
        // Sort by createdAt descending so newest concepts show up first
        const concepts = await Prompt.find().sort({ createdAt: -1 }).limit(20);

        res.status(200).json({
            success: true,
            message: "Successfully accessed protected concepts route",
            data: {
                count: concepts.length,
                concepts: concepts.map(c => ({
                    id: c._id,
                    title: c.prompt,
                    description: c.response
                })),
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Protected concept creation
 * @route   POST /api/v1/protected/concepts
 * @access  Private
 */
const createProtectedConcept = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const newConcept = await Prompt.create({
            prompt: title,
            response: description,
            metadata: {
                category: "Protected Collection",
                subcategory: "User Uploads",
                concept: title,
                question_type: "Custom",
                generated_at: new Date()
            }
        });

        res.status(201).json({
            success: true,
            message: "Concept created successfully via protected route",
            data: {
                id: newConcept._id,
                title: newConcept.prompt,
                description: newConcept.response,
                createdBy: req.user._id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Protected update
 * @route   PATCH /api/v1/protected/concepts/:id
 * @access  Private
 */
const updateProtectedConcept = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updates = {};
        if (title) updates.prompt = title;
        if (description) updates.response = description;

        const updatedConcept = await Prompt.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedConcept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            message: `Concept ${id} updated successfully via protected route`,
            data: {
                id: updatedConcept._id,
                title: updatedConcept.prompt,
                description: updatedConcept.response,
                updatedBy: req.user._id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Protected deletion
 * @route   DELETE /api/v1/protected/concepts/:id
 * @access  Private
 */
const deleteProtectedConcept = async (req, res) => {
    try {
        const { id } = req.params;

        const concept = await Prompt.findByIdAndDelete(id);

        if (!concept) {
            return res.status(404).json({ success: false, message: "Concept not found" });
        }

        res.status(200).json({
            success: true,
            message: `Concept ${id} deleted successfully via protected route`,
            data: {
                deletedId: id,
                deletedBy: req.user._id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Admin protected dashboard
 * @route   GET /api/v1/admin/protected/dashboard
 * @access  Private/Admin
 */
const getAdminDashboard = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to the admin dashboard",
            data: {
                stats: {
                    totalUsers: 1500,
                    activeUsers: 300,
                    totalConcepts: 450,
                    pendingReviews: 12
                },
                adminInfo: {
                    id: req.user._id,
                    username: req.user.username,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * @desc    Test logger middleware
 * @route   GET /api/v1/middleware/logger
 * @access  Public
 */
const testLoggerMiddleware = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logger middleware executed successfully. Check your server console for the log."
    });
};

/**
 * @desc    Test auth middleware
 * @route   GET /api/v1/middleware/auth
 * @access  Private
 */
const testAuthMiddleware = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth middleware executed successfully. You are authenticated!",
        user: req.user
    });
};

/**
 * @desc    Test rate limiting middleware
 * @route   GET /api/v1/middleware/rate-limit
 * @access  Public
 */
const testRateLimitMiddleware = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Rate limit middleware executed successfully.",
        rateLimitData: req.rateLimit
    });
};

/**
 * @desc    Test cache middleware
 * @route   GET /api/v1/middleware/cache
 * @access  Public
 */
const testCacheMiddleware = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Cache middleware executed successfully.",
        cacheStatus: req.cacheStatus
    });
};

/**
 * @desc    Test compression middleware
 * @route   GET /api/v1/middleware/compression
 * @access  Public
 */
const testCompressionMiddleware = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Compression middleware executed successfully. Check your response headers for 'X-Mock-Content-Encoding: gzip'."
    });
};

module.exports = {
    getProtectedConcepts,
    createProtectedConcept,
    updateProtectedConcept,
    deleteProtectedConcept,
    getAdminDashboard,
    testLoggerMiddleware,
    testAuthMiddleware,
    testRateLimitMiddleware,
    testCacheMiddleware,
    testCompressionMiddleware
};
