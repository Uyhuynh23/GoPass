const mongoose = require("mongoose");

const usedArticleSchema = new mongoose.Schema(
  {
    // Article đã được sử dụng
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VnsocialArticle",
      required: true,
    },

    // Topic mà article thuộc về
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VnsocialTopic",
      required: true,
    },

    // Forum topic được tạo ra từ article này
    forumTopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumTopic",
    },

    // Người sử dụng (admin)
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Thời gian sử dụng
    usedAt: {
      type: Date,
      default: Date.now,
    },

    // TTL: tự động xóa sau 24 giờ
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      expires: 0, // MongoDB TTL index
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
usedArticleSchema.index({ articleId: 1, topicId: 1 });
usedArticleSchema.index({ topicId: 1, usedAt: -1 });
usedArticleSchema.index({ expireAt: 1 }); // TTL index

module.exports = mongoose.model("UsedArticle", usedArticleSchema);
