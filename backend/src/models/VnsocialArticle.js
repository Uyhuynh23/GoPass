const mongoose = require("mongoose");

const vnsocialArticleSchema = new mongoose.Schema(
  {
    // docId từ VnSocial API
    externalId: {
      type: String,
      required: true,
      unique: true,
    },

    // Topic mà article này thuộc về
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VnsocialTopic",
      required: true,
    },

    // Tiêu đề
    title: {
      type: String,
      required: true,
    },

    // Nội dung
    content: {
      type: String,
    },

    // URL bài viết
    url: {
      type: String,
    },

    // Nguồn (facebook, baochi, youtube, etc.)
    source: {
      type: String,
      required: true,
    },

    // Tác giả
    author: {
      type: String,
    },

    // Ngày xuất bản
    publishedDate: {
      type: Date,
    },

    // Sentiment
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },

    // Raw payload từ API
    rawPayload: mongoose.Schema.Types.Mixed,

    // Cache TTL
    lastFetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vnsocialArticleSchema.index({ externalId: 1 });
vnsocialArticleSchema.index({ topicId: 1, publishedDate: -1 });
vnsocialArticleSchema.index({ source: 1 });
vnsocialArticleSchema.index({ lastFetchedAt: 1 });

module.exports = mongoose.model("VnsocialArticle", vnsocialArticleSchema);
