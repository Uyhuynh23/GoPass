const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true,
  },
  classCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  teacherUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  requireApproval: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
classSchema.index({ classCode: 1 });
classSchema.index({ teacherUserId: 1 });

module.exports = mongoose.model('Class', classSchema);
