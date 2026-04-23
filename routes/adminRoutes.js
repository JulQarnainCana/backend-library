const express = require("express");
const router = express.Router();
const { getAdminStats, getAllUsers, updateUserStatus } = require("../controllers/adminController");
// Pinalitan ang names dito para mag-match sa authMiddleware.js mo
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Dashboard Stats
router.get("/stats", protect, adminOnly, getAdminStats);

// User Management
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);

module.exports = router;