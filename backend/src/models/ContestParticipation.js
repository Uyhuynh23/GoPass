const mongoose = require('mongoose');

const contestParticipationSchema = new mongoose.Schema({
  _id: { type: String },
  contestId: { type: String }, // Khóa ngoại dạng String
  userId: { type: String },    // Khóa ngoại dạng String
  enrolledAt: { type: Date },
  totalScore: { type: Number, default: 0 },
  rank: { type: Number },
  percentile: { type: Number },
  completedExams: [{ type: String }] // JSON của bạn để mảng các ID Exam
});

contestParticipationSchema.index({ contestId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ContestParticipation', contestParticipationSchema);