const express = require("express");
const router = express.Router();

// Import middlewares
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { requestLogger } = require("../middlewares/logger.middleware");
const { rateLimiter } = require("../middlewares/rateLimit.middleware");
const { checkCache } = require("../middlewares/cache.middleware");
const { mockCompression } = require("../middlewares/compression.middleware");

// Import controllers
const {
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
} = require("../controllers/protected.controller");

// Protected Concept Routes (Requires Authentication)
router.get("/protected/concepts", authenticate, getProtectedConcepts);
router.post("/protected/concepts", authenticate, createProtectedConcept);
router.patch("/protected/concepts/:id", authenticate, updateProtectedConcept);
router.delete("/protected/concepts/:id", authenticate, deleteProtectedConcept);

// Admin Protected Dashboard (Requires Authentication + Admin Role)
router.get("/admin/protected/dashboard", authenticate, authorizeAdmin, getAdminDashboard);

// Middleware Demo Routes
router.get("/middleware/logger", requestLogger, testLoggerMiddleware);
router.get("/middleware/auth", authenticate, testAuthMiddleware);
router.get("/middleware/rate-limit", rateLimiter, testRateLimitMiddleware);
router.get("/middleware/cache", checkCache, testCacheMiddleware);
router.get("/middleware/compression", mockCompression, testCompressionMiddleware);

module.exports = router;
