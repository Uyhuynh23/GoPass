const VnSocialService = require('../services/VnSocialService');

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

      res.json({
        success: true,
        message: 'Lấy danh sách chủ đề thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tìm bài viết theo từ khóa
   * POST /api/vnsocial/posts/search-by-keyword
   * Body: {projectId, source, startDate, endDate, page, limit, sentiment, reactionary, province}
   */
  async searchPostsByKeyword(req, res, next) {
    try {
      const {
        projectId,
        source,
        startDate,
        endDate,
        page,
        limit,
        sentiment,
        reactionary,
        province
      } = req.body;

      // Validation
      if (!projectId || !source || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: projectId, source, startDate, endDate là bắt buộc'
        });
      }

      const result = await VnSocialService.getPostsByKeyword({
        projectId,
        source,
        startDate,
        endDate,
        page,
        limit,
        sentiment,
        reactionary,
        province
      });

      res.json({
        success: true,
        message: 'Tìm bài viết thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tìm bài viết theo nguồn
   * POST /api/vnsocial/posts/search-by-source
   * Body: {sourceId, startDate, endDate, page, limit, sentiment}
   */
  async searchPostsBySource(req, res, next) {
    try {
      const {
        sourceId,
        startDate,
        endDate,
        page,
        limit,
        sentiment
      } = req.body;

      // Validation
      if (!sourceId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: sourceId, startDate, endDate là bắt buộc'
        });
      }

      const result = await VnSocialService.getPostsBySource({
        sourceId,
        startDate,
        endDate,
        page,
        limit,
        sentiment
      });

      res.json({
        success: true,
        message: 'Tìm bài viết thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy từ khóa nổi bật
   * POST /api/vnsocial/keywords/hot
   * Body: {projectId, sources, startDate, endDate}
   */
  async getHotKeywords(req, res, next) {
    try {
      const {
        projectId,
        sources,
        startDate,
        endDate
      } = req.body;

      // Validation
      if (!projectId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: projectId, startDate, endDate là bắt buộc'
        });
      }

      const result = await VnSocialService.getHotKeywords({
        projectId,
        sources,
        startDate,
        endDate
      });

      res.json({
        success: true,
        message: 'Lấy từ khóa nổi bật thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy bài viết nổi bật
   * POST /api/vnsocial/posts/hot
   * Body: {projectId, source, startDate, endDate}
   */
  async getHotPosts(req, res, next) {
    try {
      const {
        projectId,
        source,
        startDate,
        endDate
      } = req.body;

      // Validation
      if (!projectId || !source || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: projectId, source, startDate, endDate là bắt buộc'
        });
      }

      const result = await VnSocialService.getHotPosts({
        projectId,
        source,
        startDate,
        endDate
      });

      res.json({
        success: true,
        message: 'Lấy bài viết nổi bật thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thống kê tổng quan
   * POST /api/vnsocial/statistics
   * Body: {projectId, startDate, endDate, sources}
   */
  async getStatistics(req, res, next) {
    try {
      const {
        projectId,
        startDate,
        endDate,
        sources
      } = req.body;

      // Validation
      if (!projectId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: projectId, startDate, endDate là bắt buộc'
        });
      }

      const result = await VnSocialService.getStatistics(
        projectId,
        startDate,
        endDate,
        sources
      );

      res.json({
        success: true,
        message: 'Lấy thống kê thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VnSocialController();
