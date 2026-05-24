const express = require("express");
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    banUser,
    unbanUser,
} = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

// All admin routes require authentication + admin role
// authenticate -> checks if user is logged in (valid JWT)
// authorizeAdmin -> checks if logged-in user has "admin" role

router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.get("/:id", authenticate, authorizeAdmin, getUserById);
router.patch("/:id/role", authenticate, authorizeAdmin, updateUserRole);
router.patch("/:id/ban", authenticate, authorizeAdmin, banUser);
router.patch("/:id/unban", authenticate, authorizeAdmin, unbanUser);

module.exports = router;
