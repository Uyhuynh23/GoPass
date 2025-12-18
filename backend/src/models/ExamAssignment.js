const mongoose = require("mongoose");

const examAssignmentSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    maxAttempts: {
      type: Number,
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

// Index for queries
examAssignmentSchema.index({ examId: 1 });
examAssignmentSchema.index({ classId: 1 });
examAssignmentSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model("ExamAssignment", examAssignmentSchema);
