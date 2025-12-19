const mongoose = require('mongoose');

const classJoinRequestSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  studentUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for faster queries
classJoinRequestSchema.index({ classId: 1, status: 1 });
classJoinRequestSchema.index({ studentUserId: 1 });

module.exports = mongoose.model('ClassJoinRequest', classJoinRequestSchema);
