const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const VnSocialController = require("../controllers/VnSocialController");
const { authenticate, authorize } = require("../middleware");

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

router.get("/users", AdminController.listUsers);
router.get("/users/:userId", AdminController.getUserDetail);
router.put("/users/:userId/status", AdminController.updateUserStatus);
router.post("/users/:userId/reset-password", AdminController.resetUserPassword);
router.get("/metrics", AdminController.getSystemMetrics);

// Admin-only route for generating social debate topics
router.post("/social-debates", VnSocialController.getSocialDebateTopics);

module.exports = router;
