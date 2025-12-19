const BaseRepository = require("./BaseRepository");
const ForumTopic = require("../models/ForumTopic");

class ForumTopicRepository extends BaseRepository {
  constructor() {
    super(ForumTopic);
  }

  /**
   * Lấy danh sách forum topics với pagination và filter
   */
  async getTopics({ status, tags, page = 1, limit = 20 }) {
    const filter = {};
    if (status) filter.status = status;
    if (tags && tags.length > 0) filter.tags = { $in: tags };

    const skip = (page - 1) * limit;

    const [topics, total] = await Promise.all([
      this.find(filter, {
        sort: { createdAt: -1 },
        limit,
        skip,
        populate: "createdBy",
      }),
      this.count(filter),
    ]);

    return {
      topics,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy chi tiết topic với comments
   */
  async getTopicWithComments(topicId) {
    return await this.model
      .findById(topicId)
      .populate("createdBy", "name email")
      .populate("sourceArticle.articleId")
      .populate("vnsocialTopic.topicId");
  }

  /**
   * Tăng số lượng comments
   */
  async incrementCommentsCount(topicId) {
    return await this.model.findByIdAndUpdate(
      topicId,
      { $inc: { "stats.totalComments": 1 } },
      { new: true }
    );
  }

  /**
   * Tăng số lượng likes
   */
  async incrementLikesCount(topicId) {
    return await this.model.findByIdAndUpdate(
      topicId,
      { $inc: { "stats.totalLikes": 1 } },
      { new: true }
    );
  }

  /**
   * Giảm số lượng likes
   */
  async decrementLikesCount(topicId) {
    return await this.model.findByIdAndUpdate(
      topicId,
      { $inc: { "stats.totalLikes": -1 } },
      { new: true }
    );
  }

  /**
   * Tăng số lượng views
   */
  async incrementViewsCount(topicId) {
    return await this.model.findByIdAndUpdate(
      topicId,
      { $inc: { "stats.totalViews": 1 } },
      { new: true }
    );
  }
}

module.exports = new ForumTopicRepository();
