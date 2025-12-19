const mongoose = require("mongoose");

const forumTopicSchema = new mongoose.Schema(
  {
    // Tiêu đề forum topic (do AI sinh ra, khác với article title)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Tóm tắt nội dung (do AI sinh ra)
    summary: {
      type: String,
      required: true,
    },

    // Câu hỏi tranh luận (do AI sinh ra)
    debateQuestion: {
      type: String,
      required: true,
    },

    // Bài viết gốc từ VnSocial
    sourceArticle: {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VnsocialArticle",
      },
      title: String,
      url: String,
    },

    // Topic từ VnSocial
    vnsocialTopic: {
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VnsocialTopic",
      },
      name: String,
    },

    // Người tạo (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // AI seed comment (comment mồi)
    seedComment: {
      type: String,
      required: true,
    },

    // Trạng thái
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },

    // Thống kê
    stats: {
      totalComments: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
    },

    // Tags để categorize
    tags: [String],

    // Raw payload từ SmartBot (để debug)
    rawSmartbotPayload: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Indexes
forumTopicSchema.index({ createdBy: 1 });
forumTopicSchema.index({ status: 1, createdAt: -1 });
forumTopicSchema.index({ "vnsocialTopic.topicId": 1 });
forumTopicSchema.index({ tags: 1 });

module.exports = mongoose.model("ForumTopic", forumTopicSchema);
