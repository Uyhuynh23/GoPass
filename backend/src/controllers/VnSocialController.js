const VnSocialService = require("../services/VnSocialService");

/**
 * Controller xử lý các request liên quan đến VnSocial
 */
class VnSocialController {
  /**
   * Lấy danh sách chủ đề/dự án
   * GET /api/vnsocial/topics?type=keyword|source
   */
  async getTopics(req, res, next) {
    try {
      const { type } = req.query;

      const result = await VnSocialService.getTopics(type);

      // Debug: Log full response
      console.log("🔍 DEBUG Topics Response:", JSON.stringify(result, null, 2));

      res.json({
        success: true,
        message: "Lấy danh sách chủ đề thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tìm bài viết theo từ khóa
   * POST /api/vnsocial/posts/search-by-keyword
   * Body: {project_id, source, start_time, end_time, from, size, senti, reactionary, province, time_type}
   */
  async searchPostsByKeyword(req, res, next) {
    try {
      const {
        project_id,
        source,
        start_time,
        end_time,
        from,
        size,
        senti,
        reactionary,
        province,
        time_type,
      } = req.body;

      // Debug: Log request
      console.log(
        "🔍 DEBUG Search Request:",
        JSON.stringify(req.body, null, 2)
      );

      // Validation
      if (
        !project_id ||
        !source ||
        start_time === undefined ||
        end_time === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin: project_id, source, start_time, end_time là bắt buộc",
        });
      }

      const result = await VnSocialService.getPostsByKeyword({
        project_id,
        source,
        start_time,
        end_time,
        from,
        size,
        senti,
        reactionary,
        province,
        time_type,
      });

      res.json({
        success: true,
        message: "Tìm bài viết thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tìm bài viết theo nguồn
   * POST /api/vnsocial/posts/search-by-source
   * Body: {source_id, start_time, end_time, from, size, senti, time_type}
   */
  async searchPostsBySource(req, res, next) {
    try {
      const { source_id, start_time, end_time, from, size, senti, time_type } =
        req.body;

      // Validation
      if (!source_id || start_time === undefined || end_time === undefined) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin: source_id, start_time, end_time là bắt buộc",
        });
      }

      const result = await VnSocialService.getPostsBySource({
        source_id,
        start_time,
        end_time,
        from,
        size,
        senti,
        time_type,
      });

      res.json({
        success: true,
        message: "Tìm bài viết thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy từ khóa nổi bật
   * POST /api/vnsocial/keywords/hot
   * Body: {project_id, sources, start_time, end_time}
   */
  async getHotKeywords(req, res, next) {
    try {
      const { project_id, sources, start_time, end_time } = req.body;

      // Validation
      if (!project_id || start_time === undefined || end_time === undefined) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin: project_id, start_time, end_time là bắt buộc",
        });
      }

      const result = await VnSocialService.getHotKeywords({
        project_id,
        sources,
        start_time,
        end_time,
      });

      res.json({
        success: true,
        message: "Lấy từ khóa nổi bật thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy bài viết nổi bật
   * POST /api/vnsocial/posts/hot
   * Body: {project_id, source, start_time, end_time}
   */
  async getHotPosts(req, res, next) {
    try {
      const { project_id, source, start_time, end_time } = req.body;

      // Validation
      if (
        !project_id ||
        !source ||
        start_time === undefined ||
        end_time === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin: project_id, source, start_time, end_time là bắt buộc",
        });
      }

      const result = await VnSocialService.getHotPosts({
        project_id,
        source,
        start_time,
        end_time,
      });

      res.json({
        success: true,
        message: "Lấy bài viết nổi bật thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thống kê tổng quan
   * POST /api/vnsocial/statistics
   * Body: {project_id, start_time, end_time, sources}
   */
  async getStatistics(req, res, next) {
    try {
      const { project_id, start_time, end_time, sources } = req.body;

      // Validation
      if (!project_id || start_time === undefined || end_time === undefined) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin: project_id, start_time, end_time là bắt buộc",
        });
      }

      const result = await VnSocialService.getStatistics(
        project_id,
        start_time,
        end_time,
        sources
      );

      res.json({
        success: true,
        message: "Lấy thống kê thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách debate topics từ bài báo nổi bật
   * POST /api/vnsocial/social-debates
   * Body: {start_time, end_time, source}
   */
  // Đổi từ req.query sang req.body cho đồng nhất với POST request
  async getSocialDebateTopics(req, res, next) {
    try {
      const SocialDebateService = require("../services/SocialDebateService");
      // Lấy từ body vì đây là POST route
      const { start_time, end_time, source } = req.body;

      if (!start_time || !end_time) {
        return res.status(400).json({
          success: false,
          message:
            "start_time and end_time (in ms) are required in request body",
        });
      }

      const senderId = req.user?._id?.toString() || "admin_system";
      const debateTopics = await SocialDebateService.getSocialDebateTopics(
        { start_time, end_time, source },
        senderId
      );

      res.json({
        success: true,
        data: { topics: debateTopics, total: debateTopics.length },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sync topics từ VnSocial API và lưu vào DB
   * POST /api/vnsocial/topics/sync
   * Body: { type }
   */
  async syncTopics(req, res, next) {
    try {
      const { type } = req.body;

      const result = await VnSocialService.syncTopicsToDatabase(type);

      res.json({
        success: true,
        message: `Synced ${result.synced} topics to database`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VnSocialController();
