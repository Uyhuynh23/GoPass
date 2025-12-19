const BaseRepository = require("./BaseRepository");
const UsedArticle = require("../models/UsedArticle");

class UsedArticleRepository extends BaseRepository {
  constructor() {
    super(UsedArticle);
  }

  /**
   * Đánh dấu article đã được sử dụng
   */
  async markAsUsed(articleId, topicId, usedBy, forumTopicId = null) {
    return await this.create({
      articleId,
      topicId,
      usedBy,
      forumTopicId,
      usedAt: new Date(),
    });
  }

  /**
   * Kiểm tra article đã được sử dụng trong X giờ gần đây chưa
   */
  async wasRecentlyUsed(articleId, topicId, hoursAgo = 24) {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const used = await this.findOne({
      articleId,
      topicId,
      usedAt: { $gte: cutoffTime },
    });

    return !!used;
  }

  /**
   * Lấy danh sách article IDs đã sử dụng cho một topic
   */
  async getUsedArticleIds(topicId, hoursAgo = 24) {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const usedArticles = await this.find({
      topicId,
      usedAt: { $gte: cutoffTime },
    });

    return usedArticles.map((ua) => ua.articleId.toString());
  }

  /**
   * Xóa các bản ghi đã hết hạn (manual cleanup, TTL index tự động xóa)
   */
  async cleanupExpired() {
    return await this.model.deleteMany({
      expireAt: { $lt: new Date() },
    });
  }
}

module.exports = new UsedArticleRepository();
