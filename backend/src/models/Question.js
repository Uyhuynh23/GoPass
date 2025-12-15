const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["multiple_choice", "essay", "short_answer", "true_false"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    correctAnswer: {
      type: String, // For short_answer or essay reference
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    subject: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    points: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
questionSchema.index({ subject: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Question", questionSchema);
