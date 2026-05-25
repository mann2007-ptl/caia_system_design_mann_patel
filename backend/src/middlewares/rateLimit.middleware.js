/**
 * Beginner-friendly rate limiting middleware mock
 * In a production app, you would use 'express-rate-limit' or Redis.
 */
const rateLimiter = (req, res, next) => {
    // Mock attaching rate limit information to the request object
    req.rateLimit = {
        limit: 100,
        remaining: 99,
        resetTime: new Date(Date.now() + 15 * 60000)
    };
    next();
};

module.exports = { rateLimiter };
