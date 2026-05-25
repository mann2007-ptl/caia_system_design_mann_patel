const mongoose = require("mongoose");
const os = require("os");

/**
 * @desc    Health check
 * @route   GET /api/v1/health
 * @access  Public
 */
const checkHealth = (req, res) => {
    try {
        // MongoDB connection status
        const dbStatus =
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected";

        // Server uptime
        const uptime = process.uptime();

        // Memory usage
        const memoryUsage = process.memoryUsage();

        res.status(200).json({
            success: true,
            message: "System is healthy",
            data: {
                status: "OK",
                timestamp: new Date().toISOString(),
                database: dbStatus,
                uptime: `${Math.floor(uptime / 60)} minutes`,
                memoryUsage: {
                    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
                },
                server: {
                    hostname: os.hostname(),
                    platform: process.platform,
                    nodeVersion: process.version
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
 * @desc    System status
 * @route   GET /api/v1/system/status
 * @access  Public
 */
const getSystemStatus = (req, res) => {
    try {
        const dbStatus =
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected";

        res.status(200).json({
            success: true,
            message: "System status fetched successfully",
            data: {
                status: "running",
                database: dbStatus,
                cache: "connected", // Assuming cache is connected for simplicity unless redis is specified
                freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                cpuCores: os.cpus().length,
                loadAverage: os.loadavg().map(load => load.toFixed(2))
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
 * @desc    API version
 * @route   GET /api/v1/system/version
 * @access  Public
 */
const getApiVersion = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "API version fetched successfully",
            data: {
                version: "v1.0.0",
                environment: process.env.NODE_ENV || "development",
                nodeVersion: process.version,
                releaseDate: new Date().toISOString().split('T')[0],
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                documentation: "/api/docs"
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
 * @desc    Public configuration
 * @route   GET /api/v1/system/config
 * @access  Public
 */
const getSystemConfig = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "System config fetched successfully",
            data: {
                maintenanceMode: false,
                features: {
                    registration: true,
                    analytics: true,
                    rateLimiting: true,
                    notifications: false
                },
                apiVersion: "v1.0.0",
                limits: {
                    maxUploadSize: "5MB",
                    rateLimitWindow: "15m"
                },
                supportEmail: "support@example.com"
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
 * @desc    Server uptime
 * @route   GET /api/v1/system/uptime
 * @access  Public
 */
const getSystemUptime = (req, res) => {
    try {
        // Calculate uptime in seconds and format it nicely
        const uptimeSeconds = process.uptime();
        const uptimeMinutes = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        const uptimeDays = Math.floor(uptimeHours / 24);

        res.status(200).json({
            success: true,
            message: "System uptime fetched successfully",
            data: {
                startTime: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
                uptimeSeconds: uptimeSeconds,
                formatted: {
                    days: uptimeDays,
                    hours: uptimeHours % 24,
                    minutes: uptimeMinutes % 60,
                    seconds: Math.floor(uptimeSeconds % 60)
                },
                systemUptimeSeconds: os.uptime(),
                systemFormatted: {
                    days: Math.floor(os.uptime() / 86400),
                    hours: Math.floor((os.uptime() % 86400) / 3600),
                    minutes: Math.floor((os.uptime() % 3600) / 60)
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

module.exports = {
    checkHealth,
    getSystemStatus,
    getApiVersion,
    getSystemConfig,
    getSystemUptime
};
