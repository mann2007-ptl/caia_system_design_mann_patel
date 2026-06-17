const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// Helper to generate access token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "15m",
    });
};

// Helper to generate refresh token
const generateRefreshToken = (id) => {
    return jwt.sign(
        { id },
        process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret",
        {
            expiresIn: "7d",
        },
    );
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password directly (10 is the salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid user data",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Authenticate user & get tokens
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email and include password for comparison
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Block banned users from logging in
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: "Your account has been suspended. Please contact support.",
            });
        }

        // Block deleted (soft-deleted) users from logging in
        if (user.isDeleted) {
            return res.status(403).json({
                success: false,
                message: "This account no longer exists.",
            });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.json({
                success: true,
                message: "Login successful",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
    try {
        // Since we are using standard JWT tokens, the server can't truly invalidate them natively
        // without a token blacklist. For standard behavior, we instruct the client to discard tokens.
        res.status(200).json({
            success: true,
            message:
                "User logged out successfully. Please remove your tokens locally.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Refresh JWT token using a valid refresh token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        // Verify the refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret",
            async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid or expired refresh token",
                    });
                }

                // Check if user still exists
                const user = await User.findById(decoded.id);

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "User attached to this token no longer exists",
                    });
                }

                // Block banned users from refreshing tokens
                if (user.isBanned) {
                    return res.status(403).json({
                        success: false,
                        message: "Your account has been suspended.",
                    });
                }

                // Block deleted users from refreshing tokens
                if (user.isDeleted) {
                    return res.status(403).json({
                        success: false,
                        message: "This account no longer exists.",
                    });
                }

                // Generate new access token
                const newAccessToken = generateAccessToken(user._id);

                res.status(200).json({
                    success: true,
                    message: "Token refreshed successfully",
                    accessToken: newAccessToken,
                });
            },
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Get user profile details
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        // req.user is set by the authMiddleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
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

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Find user by ID from the decoded token
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Delete user profile
 * @route   DELETE /api/v1/auth/profile
 * @access  Private
 */
const deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Forgot password (Generate reset token)
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "There is no user with that email address",
            });
        }

        // Generate simple reset token (10 chars random string for beginner friendliness)
        const resetToken = Math.random().toString(36).substring(2, 12);

        // Set token and expire time (10 minutes)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset token generated. Use this token in the reset password route.",
            resetToken: resetToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Find user by token and ensure token is not expired
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Hash new password directly (10 is the salt rounds)
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear tokens
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful! You can now log in.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/**
 * @desc    Verify user email
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Verify email
        user.isEmailVerified = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
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
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    deleteProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
};
