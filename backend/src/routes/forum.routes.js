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
 * Get list of forum packages (Public)
 */
router.get("/packages", authenticate, ForumController.getPackages);

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

/**
 * Get single package
 */
router.get("/packages/:id", authenticate, ForumController.getPackageById);

/**
 * Update package (Admin only)
 */
router.put(
  "/packages/:id",
  authenticate,
  authorize("admin"),
  ForumController.updatePackage
);

/**
 * Delete package (Admin only)
 */
router.delete(
  "/packages/:id",
  authenticate,
  authorize("admin"),
  ForumController.deletePackage
);

/**
 * Update topic (Admin only)
 */
router.put(
  "/topics/:id",
  authenticate,
  authorize("admin"),
  ForumController.updateTopic
);

/**
 * Delete topic (Admin only)
 */
router.delete(
  "/topics/:id",
  authenticate,
  authorize("admin"),
  ForumController.deleteTopic
);

/**
 * Get comments for a topic
 */
router.get("/topics/:id/comments", authenticate, ForumController.getTopicComments);

/**
 * Update comment (Authenticated - owner only)
 */
router.put("/comments/:id", authenticate, ForumController.updateComment);

/**
 * Delete comment (Authenticated - owner only)
 */
router.delete("/comments/:id", authenticate, ForumController.deleteComment);

/**
 * Like comment (Authenticated)
 */
router.post("/comments/:id/like", authenticate, ForumController.likeComment);

/**
 * Unlike comment (Authenticated)
 */
router.delete("/comments/:id/like", authenticate, ForumController.unlikeComment);

module.exports = router;
