const BaseRepository = require("./BaseRepository");
const VnsocialArticle = require("../models/VnsocialArticle");

class VnsocialArticleRepository extends BaseRepository {
  constructor() {
    super(VnsocialArticle);
  }

  /**
   * Upsert article từ VnSocial API
   */
  async upsertArticle(externalId, data) {
    return await this.model.findOneAndUpdate(
      { externalId },
      {
        ...data,
        lastFetchedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Lấy article theo external ID
   */
  async findByExternalId(externalId) {
    return await this.findOne({ externalId });
  }

  /**
   * Lấy articles theo topic
   */
  async getArticlesByTopic(topicId, { source, page = 1, limit = 10 } = {}) {
    const filter = { topicId };
    if (source) filter.source = source;

    const skip = (page - 1) * limit;

    return await this.find(filter, {
      sort: { publishedDate: -1 },
      limit,
      skip,
    });
  }

  /**
   * Batch upsert articles
   */
  async batchUpsert(articles) {
    const operations = articles.map((article) => ({
      updateOne: {
        filter: { externalId: article.externalId },
        update: {
          $set: {
            ...article,
            lastFetchedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    return await this.model.bulkWrite(operations);
  }
}

module.exports = new VnsocialArticleRepository();
