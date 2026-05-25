/**
 * Beginner-friendly compression middleware mock
 * In a real application, you would just do: `const compression = require('compression')`
 */
const mockCompression = (req, res, next) => {
    // Mock attaching a compression header
    // We use "X-Mock-Content-Encoding" here so Postman doesn't actually try to unzip the plain-text JSON response and crash!
    res.setHeader('X-Mock-Content-Encoding', 'gzip');
    next();
};

module.exports = { mockCompression };
