const BaseRepository = require("./BaseRepository");
const ForumComment = require("../models/ForumComment");

class ForumCommentRepository extends BaseRepository {
  constructor() {
    super(ForumComment);
  }

  /**
   * Lấy comments của một topic (chỉ top-level, không có parentCommentId)
   */
  async getTopicComments(topicId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const filter = {
      topicId,
      parentCommentId: null,
      status: "active",
    };

    const [comments, total] = await Promise.all([
      this.find(filter, {
        sort: { createdAt: -1 },
        limit,
        skip,
        populate: "userId",
      }),
      this.count(filter),
    ]);

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy replies của một comment
   */
  async getCommentReplies(parentCommentId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const filter = {
      parentCommentId,
      status: "active",
    };

    const [replies, total] = await Promise.all([
      this.find(filter, {
        sort: { createdAt: 1 },
        limit,
        skip,
        populate: "userId",
      }),
      this.count(filter),
    ]);

    return {
      replies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Toggle like/unlike comment
   */
  async toggleLike(commentId, userId) {
    const comment = await this.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const hasLiked = comment.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      return await this.model.findByIdAndUpdate(
        commentId,
        {
          $pull: { likedBy: userId },
          $inc: { likesCount: -1 },
        },
        { new: true }
      );
    } else {
      // Like
      return await this.model.findByIdAndUpdate(
        commentId,
        {
          $addToSet: { likedBy: userId },
          $inc: { likesCount: 1 },
        },
        { new: true }
      );
    }
  }

  /**
   * Soft delete comment
   */
  async softDelete(commentId) {
    return await this.update(commentId, { status: "deleted" });
  }
}

module.exports = new ForumCommentRepository();
