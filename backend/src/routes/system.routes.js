const express = require("express");
const router = express.Router();

// Import controllers
const {
    checkHealth,
    getSystemStatus,
    getApiVersion,
    getSystemConfig,
    getSystemUptime,
    getCacheStatus,
    getStorageStatus,
    getDatabaseStatus,
    reindexSearch,
    restartSystem
} = require("../controllers/system.controller");

// Health check route
router.get("/health", checkHealth);

// System routes
router.get("/system/status", getSystemStatus);
router.get("/system/version", getApiVersion);
router.get("/system/config", getSystemConfig);
router.get("/system/uptime", getSystemUptime);
router.get("/system/cache/status", getCacheStatus);
router.get("/system/storage/status", getStorageStatus);
router.get("/system/database/status", getDatabaseStatus);
router.post("/system/reindex", reindexSearch);
router.post("/system/restart", restartSystem);

module.exports = router;
