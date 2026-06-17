const User = require("../models/user.model");

// Global variable for Maintenance Mode simulation
let isMaintenanceMode = false;

// =============================================
// @desc    Fetch all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
// =============================================
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database (password is excluded by default via select: false)
        const users = await User.find();

        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Fetch a single user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin only)
// =============================================
const getUserById = async (req, res) => {
    try {
        // Find user by the ID from the URL params
        const user = await User.findById(req.params.id);

        // If no user found with that ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Update a user's role
// @route   PATCH /api/v1/admin/users/:id/role
// @access  Private (Admin only)
// =============================================
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Validate that a role was provided
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required. Allowed values: 'user' or 'admin'",
            });
        }

        // Validate that the role is one of the allowed values
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed values: 'user' or 'admin'",
            });
        }

        // Find the user and update their role
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true } // Return updated doc & run schema validators
        );

        // If no user found with that ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `User role updated to '${role}' successfully`,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Ban a user
// @route   PATCH /api/v1/admin/users/:id/ban
// @access  Private (Admin only)
// =============================================
const banUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);

        // If no user found with that ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is already banned
        if (user.isBanned) {
            return res.status(400).json({
                success: false,
                message: "User is already banned",
            });
        }

        // Ban the user
        user.isBanned = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User banned successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Unban a user
// @route   PATCH /api/v1/admin/users/:id/unban
// @access  Private (Admin only)
// =============================================
const unbanUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);

        // If no user found with that ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is already unbanned
        if (!user.isBanned) {
            return res.status(400).json({
                success: false,
                message: "User is not banned",
            });
        }

        // Unban the user
        user.isBanned = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User unbanned successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Soft-delete a user (marks as deleted, blocks login)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin only)
// =============================================
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent deleting another admin
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete an admin account",
            });
        }

        // Soft-delete: mark as deleted & banned so the JWT middleware blocks them immediately
        user.isDeleted = true;
        user.isBanned = true;
        user.deletedAt = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "User deleted successfully. They can no longer log in.",
            data: { _id: user._id },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Restore a soft-deleted user
// @route   PATCH /api/v1/admin/users/:id/restore
// @access  Private (Admin only)
// =============================================
const restoreUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "User is not deleted",
            });
        }

        user.isDeleted = false;
        user.isBanned = false;
        user.deletedAt = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User restored successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Fetch audit logs
// @route   GET /api/v1/admin/logs
// @access  Private (Admin only)
// =============================================
const getAuditLogs = async (req, res) => {
    try {
        // Mock audit logs since we don't have a Mongo collection for them yet
        const mockAuditLogs = [
            { id: 1, action: "USER_BANNED", adminId: req.user._id, targetId: "user_123", timestamp: new Date() },
            { id: 2, action: "ROLE_UPDATED", adminId: req.user._id, targetId: "user_456", timestamp: new Date() }
        ];

        res.status(200).json({
            success: true,
            message: "Audit logs fetched successfully",
            count: mockAuditLogs.length,
            data: mockAuditLogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Get system health status
// @route   GET /api/v1/admin/system/health
// @access  Private (Admin only)
// =============================================
const getSystemHealth = async (req, res) => {
    try {
        // Get Mongoose status
        const mongoose = require("mongoose");
        const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

        const healthData = {
            status: "healthy",
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date(),
            database: dbStatus,
            memoryUsage: process.memoryUsage(),
        };

        res.status(200).json({
            success: true,
            message: "System health fetched successfully",
            data: healthData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Get system logs
// @route   GET /api/v1/admin/system/logs
// @access  Private (Admin only)
// =============================================
const getSystemLogs = async (req, res) => {
    try {
        // Mock system logs (warnings, errors)
        const mockSystemLogs = [
            { type: "WARNING", message: "High memory usage detected", timestamp: new Date() },
            { type: "ERROR", message: "Failed API request from IP 192.168.1.5", timestamp: new Date() }
        ];

        res.status(200).json({
            success: true,
            message: "System logs fetched successfully",
            count: mockSystemLogs.length,
            data: mockSystemLogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Clear API/Database Cache
// @route   DELETE /api/v1/admin/cache/clear
// @access  Private (Admin only)
// =============================================
const clearCache = async (req, res) => {
    try {
        // Since we don't have Redis or a real cache yet, we simulate the action
        res.status(200).json({
            success: true,
            message: "System cache cleared successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// =============================================
// @desc    Toggle Maintenance Mode
// @route   POST /api/v1/admin/system/maintenance
// @access  Private (Admin only)
// =============================================
const toggleMaintenance = async (req, res) => {
    try {
        // Toggle the global in-memory variable
        isMaintenanceMode = !isMaintenanceMode;

        res.status(200).json({
            success: true,
            message: `Maintenance mode is now ${isMaintenanceMode ? "ON" : "OFF"}`,
            isMaintenanceMode: isMaintenanceMode,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    banUser,
    unbanUser,
    getAuditLogs,
    getSystemHealth,
    getSystemLogs,
    clearCache,
    toggleMaintenance,
};
