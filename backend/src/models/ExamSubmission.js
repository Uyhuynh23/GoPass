const mongoose = require("mongoose");
const examSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamAssignment',
    default: null,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    default: null,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded', 'late'],
    default: 'in_progress',
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    default: 10,
  },
  attemptNumber: {
    type: Number,
    default: 1,
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
});

// Index for queries
examSubmissionSchema.index({ examId: 1, studentId: 1 });
examSubmissionSchema.index({ assignmentId: 1, studentId: 1 });
examSubmissionSchema.index({ contestId: 1, studentId: 1 });
examSubmissionSchema.index({ studentId: 1 });
examSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema);
