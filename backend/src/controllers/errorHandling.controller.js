const simulateNotFound = async (req, res) => {
    try {
        res.status(404).json({
            success: false,
            error: "Not Found",
            message: "The requested resource was not found on this server.",
            statusCode: 404
        });
    } catch (error) {
        console.error("Error in simulateNotFound:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const simulateServerError = async (req, res) => {
    try {
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: "An unexpected error occurred on the server.",
            statusCode: 500
        });
    } catch (error) {
        console.error("Error in simulateServerError:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const simulateDatabaseError = async (req, res) => {
    try {
        res.status(503).json({
            success: false,
            error: "Database Error",
            message: "Failed to connect to the database. The service is temporarily unavailable.",
            statusCode: 503
        });
    } catch (error) {
        console.error("Error in simulateDatabaseError:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const simulateValidationError = async (req, res) => {
    try {
        res.status(400).json({
            success: false,
            error: "Validation Error",
            message: "The request data failed validation.",
            statusCode: 400,
            errors: [
                "'title' is required and must be a string.",
                "'category' must be one of: Backend, Frontend, DevOps.",
                "'difficulty' must be one of: Beginner, Intermediate, Advanced."
            ]
        });
    } catch (error) {
        console.error("Error in simulateValidationError:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const simulateTokenExpired = async (req, res) => {
    try {
        res.status(401).json({
            success: false,
            error: "Token Expired",
            message: "Your authentication token has expired. Please login again to get a new token.",
            statusCode: 401
        });
    } catch (error) {
        console.error("Error in simulateTokenExpired:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    simulateNotFound,
    simulateServerError,
    simulateDatabaseError,
    simulateValidationError,
    simulateTokenExpired
};
