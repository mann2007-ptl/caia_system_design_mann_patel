const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

            // Get user from the token and exclude password
            req.user = await User.findById(decoded.id).select("-password");

            // If user doesn't exist anymore
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User attached to this token no longer exists",
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }
};

module.exports = { authenticate };
