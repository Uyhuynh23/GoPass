const mongoose = require("mongoose");

const examQuestionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique question per exam and order
examQuestionSchema.index({ examId: 1, questionId: 1 }, { unique: true });
examQuestionSchema.index({ examId: 1, order: 1 });

module.exports = mongoose.model("ExamQuestion", examQuestionSchema);
