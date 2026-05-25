const express = require("express");
const router = express.Router();

// Import controllers
const {
    checkHealth,
    getSystemStatus,
    getApiVersion,
    getSystemConfig,
    getSystemUptime
} = require("../controllers/system.controller");

// Health check route
router.get("/health", checkHealth);

// System routes
router.get("/system/status", getSystemStatus);
router.get("/system/version", getApiVersion);
router.get("/system/config", getSystemConfig);
router.get("/system/uptime", getSystemUptime);

module.exports = router;
