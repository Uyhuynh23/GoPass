const express = require("express");
const router = express.Router();
const ForumController = require("../controllers/ForumController");
const { authenticate, authorize } = require("../middleware");

/**
 * Generate forum topics (Admin only)
 */
router.post(
  "/topics/generate",
  authenticate,
  authorize("admin"),
  ForumController.generateTopics
);

/**
 * Get list of forum topics (Public)
 */
router.get("/topics", authenticate, ForumController.getTopics);

/**
 * Get forum topic detail (Public)
 */
router.get("/topics/:id", authenticate, ForumController.getTopicDetail);

/**
 * Create comment for forum topic (Authenticated)
 */
router.post(
  "/topics/:id/comments",
  authenticate,
  ForumController.createComment
);

/**
 * Create reply for comment (Authenticated)
 */
router.post("/comments/:id/replies", authenticate, ForumController.createReply);

/**
 * Like forum topic (Authenticated)
 */
router.post("/topics/:id/like", authenticate, ForumController.likeTopic);

/**
 * Unlike forum topic (Authenticated)
 */
router.delete("/topics/:id/like", authenticate, ForumController.unlikeTopic);

module.exports = router;
