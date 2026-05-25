/**
 * Beginner-friendly caching middleware mock
 * In a real app, this would check Redis memory to see if data exists before passing to controller.
 */
const checkCache = (req, res, next) => {
    // Mock cache logic: pretend it's a cache miss so the controller executes
    req.cacheStatus = "miss";
    next();
};

module.exports = { checkCache };
