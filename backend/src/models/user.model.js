const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // Don't return password in queries by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
