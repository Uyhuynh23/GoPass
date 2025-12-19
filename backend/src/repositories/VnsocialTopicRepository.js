const BaseRepository = require("./BaseRepository");
const VnsocialTopic = require("../models/VnsocialTopic");

class VnsocialTopicRepository extends BaseRepository {
  constructor() {
    super(VnsocialTopic);
  }

  /**
   * Upsert topic từ VnSocial API
   */
  async upsertTopic(externalId, data) {
    return await this.model.findOneAndUpdate(
      { externalId },
      {
        ...data,
        lastSyncedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Lấy topic theo external ID
   */
  async findByExternalId(externalId) {
    return await this.findOne({ externalId });
  }

  /**
   * Lấy topics đã sync trong X giờ gần đây (để check cache)
   */
  async getRecentlySyncedTopics(hoursAgo = 24) {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    return await this.find({
      lastSyncedAt: { $gte: cutoffTime },
    });
  }

  /**
   * Batch upsert topics
   */
  async batchUpsert(topics) {
    const operations = topics.map((topic) => ({
      updateOne: {
        filter: { externalId: topic.externalId },
        update: {
          $set: {
            ...topic,
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    return await this.model.bulkWrite(operations);
  }
}

module.exports = new VnsocialTopicRepository();
