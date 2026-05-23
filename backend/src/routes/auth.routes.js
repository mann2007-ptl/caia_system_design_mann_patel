const express = require("express");
const {
    register,
    login,
    logout,
    refreshToken,
    getProfile
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", authenticate, getProfile);

module.exports = router;
