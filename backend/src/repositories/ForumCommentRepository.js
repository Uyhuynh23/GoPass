const BaseRepository = require("./BaseRepository");
const ForumComment = require("../models/ForumComment");

class ForumCommentRepository extends BaseRepository {
  constructor() {
    super(ForumComment);
  }

  /**
   * Lấy comments của một topic (chỉ top-level, không có parentCommentId)
   * Recursively populates replies
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

    // Recursively populate replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this.getRepliesRecursive(comment._id);
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    return {
      comments: commentsWithReplies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Recursively fetch all replies for a comment
   */
  async getRepliesRecursive(parentCommentId) {
    const replies = await this.find(
      {
        parentCommentId,
        status: "active",
      },
      {
        sort: { createdAt: 1 },
        populate: "userId",
      }
    );

    // Recursively fetch replies for each reply
    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => {
        const nestedReplies = await this.getRepliesRecursive(reply._id);
        return {
          ...reply.toObject(),
          replies: nestedReplies,
        };
      })
    );

    return repliesWithNested;
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

  /**
   * Add like to comment
   */
  async addLike(commentId, userId) {
    return await this.model.findByIdAndUpdate(
      commentId,
      {
        $addToSet: { likedBy: userId },
        $inc: { likesCount: 1 },
      },
      { new: true }
    );
  }

  /**
   * Remove like from comment
   */
  async removeLike(commentId, userId) {
    return await this.model.findByIdAndUpdate(
      commentId,
      {
        $pull: { likedBy: userId },
        $inc: { likesCount: -1 },
      },
      { new: true }
    );
  }
}

module.exports = new ForumCommentRepository();
