const ForumService = require("../services/ForumService");

class ForumController {
  /**
   * Generate forum topics từ hot articles (Admin only)
   * POST /api/forum/topics/generate
   * Body: { topicId, count, source, startTime, endTime }
   */
  async generateTopics(req, res, next) {
    try {
      console.log("🚀 [ForumController.generateTopics] Request received");
      console.log("📝 Request body:", JSON.stringify(req.body, null, 2));
      console.log("👤 User:", req.user?.userId);

      const { topicId, count, source, startTime, endTime } = req.body;

      // Validate
      if (!topicId) {
        console.error("❌ Validation failed: topicId is required");
        return res.status(400).json({
          success: false,
          message: "topicId is required",
        });
      }

      const adminUserId = req.user.userId; // From authenticate middleware

      console.log("📞 Calling ForumService.generateForumTopics...");
      const forumTopics = await ForumService.generateForumTopics(
        {
          topicId,
          count: count || 3,
          source: source || "baochi",
          startTime,
          endTime,
        },
        adminUserId
      );

      console.log(
        `✅ [ForumController.generateTopics] Success: ${forumTopics.length} topics created`
      );
      res.status(201).json({
        success: true,
        message: `Generated ${forumTopics.length} forum topics`,
        data: {
          topics: forumTopics,
          total: forumTopics.length,
        },
      });
    } catch (error) {
      console.error(
        "❌ [ForumController.generateTopics] Error:",
        error.message
      );
      console.error("Stack trace:", error.stack);
      next(error);
    }
  }

  /**
   * Lấy danh sách forum topics
   * GET /api/forum/topics?status=published&page=1&limit=20
   */
  async getTopics(req, res, next) {
    try {
      const { status, tags, page, limit } = req.query;

      const result = await ForumService.getForumTopics({
        status,
        tags: tags ? tags.split(",") : undefined,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết forum topic với comments
   * GET /api/forum/topics/:id
   */
  async getTopicDetail(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ForumService.getForumTopicDetail(id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo comment cho forum topic
   * POST /api/forum/topics/:id/comments
   * Body: { content }
   */
  async createComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const comment = await ForumService.createComment(id, userId, content);

      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo reply cho comment
   * POST /api/forum/comments/:id/replies
   * Body: { content }
   */
  async createReply(req, res, next) {
    try {
      const { id } = req.params; // parent comment ID
      const { content } = req.body;
      const userId = req.user.userId;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const reply = await ForumService.createReply(id, userId, content);

      res.status(201).json({
        success: true,
        message: "Reply created successfully",
        data: reply,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like forum topic
   * POST /api/forum/topics/:id/like
   */
  async likeTopic(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await ForumService.likeTopic(id, userId);

      res.json({
        success: true,
        message: "Topic liked successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unlike forum topic
   * DELETE /api/forum/topics/:id/like
   */
  async unlikeTopic(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await ForumService.unlikeTopic(id, userId);

      res.json({
        success: true,
        message: "Topic unliked successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ForumController();
