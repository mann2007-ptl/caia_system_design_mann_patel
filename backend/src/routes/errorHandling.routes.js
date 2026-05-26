const express = require("express");
const router = express.Router();

const {
    simulateNotFound,
    simulateServerError,
    simulateDatabaseError,
    simulateValidationError,
    simulateTokenExpired
} = require("../controllers/errorHandling.controller");

router.get("/not-found", simulateNotFound);
router.get("/server-error", simulateServerError);
router.get("/database", simulateDatabaseError);
router.get("/validation", simulateValidationError);
router.get("/token-expired", simulateTokenExpired);

module.exports = router;
