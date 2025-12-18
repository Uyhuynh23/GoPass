const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "ended"],
      default: "upcoming",
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

// Index for queries
contestSchema.index({ ownerId: 1 });
contestSchema.index({ startTime: 1, endTime: 1 });
contestSchema.index({ status: 1 });

module.exports = mongoose.model("Contest", contestSchema);
