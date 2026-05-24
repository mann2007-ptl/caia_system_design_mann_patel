const User = require("../models/user.model");

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

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    banUser,
    unbanUser,
};
