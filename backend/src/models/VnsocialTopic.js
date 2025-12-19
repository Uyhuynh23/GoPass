const mongoose = require("mongoose");

const vnsocialTopicSchema = new mongoose.Schema(
  {
    // ID từ VnSocial API (project_id)
    externalId: {
      type: String,
      required: true,
      unique: true,
    },

    // Tên topic
    name: {
      type: String,
      required: true,
    },

    // Mô tả
    description: {
      type: String,
    },

    // Loại topic
    type: {
      type: String,
      enum: ["TOPIC_POLICY", "PERSONAL_POST"],
      default: "TOPIC_POLICY",
    },

    // Metadata từ API
    metadata: mongoose.Schema.Types.Mixed,

    // Cache TTL
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vnsocialTopicSchema.index({ externalId: 1 });
vnsocialTopicSchema.index({ lastSyncedAt: 1 });

module.exports = mongoose.model("VnsocialTopic", vnsocialTopicSchema);
