const mongoose = require("mongoose");

/**
 * ForumPackage - Gói nội dung forum từ một article
 * Mỗi package chứa: packageTitle, packageSummary và liên kết đến nhiều ForumTopics
 */
const forumPackageSchema = new mongoose.Schema(
  {
    // Tiêu đề gói (do AI sinh ra từ article)
    packageTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // Tóm tắt nội dung gói (150-300 từ)
    packageSummary: {
      type: String,
      required: true,
    },

    // Bài viết gốc từ VnSocial
    sourceArticle: {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VnsocialArticle",
        required: true,
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

    // Các ForumTopic thuộc package này
    forumTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ForumTopic",
      },
    ],

    // Trạng thái
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
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
forumPackageSchema.index({ createdBy: 1 });
forumPackageSchema.index({ status: 1, createdAt: -1 });
forumPackageSchema.index({ "vnsocialTopic.topicId": 1 });
forumPackageSchema.index({ "sourceArticle.articleId": 1 });
forumPackageSchema.index({ tags: 1 });

module.exports = mongoose.model("ForumPackage", forumPackageSchema);
