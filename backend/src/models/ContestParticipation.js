const mongoose = require('mongoose');

const contestParticipationSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: null,
    },
    percentile: {
      type: Number,
      default: null,
    },
    completedExams: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Exam',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

contestParticipationSchema.index({ contestId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ContestParticipation', contestParticipationSchema);