const mongoose = require("mongoose");

const forumCommentSchema = new mongoose.Schema(
  {
    // Forum topic mà comment này thuộc về
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumTopic",
      required: true,
    },

    // Người viết comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nội dung comment
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Reply cho comment khác (nếu là nested reply)
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumComment",
      default: null,
    },

    // Số lượng likes
    likesCount: {
      type: Number,
      default: 0,
    },

    // Danh sách user đã like (để check duplicate)
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Trạng thái
    status: {
      type: String,
      enum: ["active", "deleted", "hidden"],
      default: "active",
    },

    // Đánh dấu là AI seed comment
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
forumCommentSchema.index({ topicId: 1, createdAt: -1 });
forumCommentSchema.index({ userId: 1 });
forumCommentSchema.index({ parentCommentId: 1 });
forumCommentSchema.index({ status: 1 });

module.exports = mongoose.model("ForumComment", forumCommentSchema);
