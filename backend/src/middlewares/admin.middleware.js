const authorizeAdmin = (req, res, next) => {
    // req.user is set by the authenticate middleware
    if (req.user && req.user.role === "admin") {
        // User is an admin, allow access
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
        });
    }
};

module.exports = { authorizeAdmin };
