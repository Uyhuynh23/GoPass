const mongoose = require("mongoose");

/**
 * ForumTopic - Đề tài thảo luận cụ thể
 * Mỗi ForumTopic thuộc về một ForumPackage
 * ForumTopic chứa: topicTitle, seedComment (~200 chữ), essayPrompt
 */
const forumTopicSchema = new mongoose.Schema(
  {
    // Tiêu đề topic cụ thể (topicTitle trong AI response)
    // Ví dụ: "Ảnh hưởng của mạng xã hội đến sức khỏe tinh thần của thanh thiếu niên"
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Package mà topic này thuộc về
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumPackage",
      required: true,
    },

    // Bài viết gốc từ VnSocial (để tiện truy vấn)
    sourceArticle: {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VnsocialArticle",
      },
      title: String,
      url: String,
    },

    // Topic từ VnSocial (để tiện truy vấn)
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

    // Seed comment - Đoạn văn nghị luận hoàn chỉnh (~200 chữ)
    // Có đầy đủ: mở đoạn, thân đoạn, kết đoạn
    // Là mẫu gợi ý lập luận cho học sinh
    seedComment: {
      type: String,
      required: true,
    },

    // Đề bài nghị luận văn học liên quan đến topic này
    essayPrompt: {
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

    // Raw payload từ SmartBot (để debug) - không cần nữa vì đã lưu ở ForumPackage
    // rawSmartbotPayload: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Indexes
forumTopicSchema.index({ packageId: 1 });
forumTopicSchema.index({ createdBy: 1 });
forumTopicSchema.index({ status: 1, createdAt: -1 });
forumTopicSchema.index({ "vnsocialTopic.topicId": 1 });
forumTopicSchema.index({ tags: 1 });

module.exports = mongoose.model("ForumTopic", forumTopicSchema);
