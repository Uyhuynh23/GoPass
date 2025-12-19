const VnSocialProvider = require("../providers/VnSocialProvider");

class VnSocialService {
  async getTopics(type = null) {
    let apiType = null;
    if (type === "keyword") apiType = "TOPIC_POLICY";
    else if (type === "source") apiType = "PERSONAL_POST";

    const response = await VnSocialProvider.getProjects(apiType);

    const topics = response.object?.data || response.object || [];
    const total = response.object?.total || topics.length || 0;

    return { topics, total };
  }

  async getPostsByKeyword(params) {
    const {
      project_id,
      source,
      start_time,
      end_time,
      from = 0,
      size = 10,
      senti = ["negative", "neutral", "positive"],
      reactionary = false,
      province,
      time_type = "createDate",
    } = params;

    const apiParams = {
      project_id,
      source,
      start_time,
      end_time,
      from,
      size,
      reactionary,
      senti,
      time_type,
    };
    if (province) apiParams.province = province;

    const response = await VnSocialProvider.getPostsByKeyword(apiParams);

    const posts = response.object?.data || response.object || [];
    const totalCount = response.object?.total || posts.length || 0;

    return { posts, total: totalCount };
  }

  async getPostsBySource(params) {
    const {
      source_id,
      start_time,
      end_time,
      from = 0,
      size = 10,
      senti = ["negative", "neutral", "positive"],
      time_type = "createDate",
    } = params;

    const apiParams = {
      source_id,
      start_time,
      end_time,
      from,
      size,
      senti,
      time_type,
    };
    const response = await VnSocialProvider.getPostsBySource(apiParams);

    return {
      posts: response.object?.data || response.object || [],
      total: response.object?.total || 0,
    };
  }

  async getHotKeywords(params) {
    const { project_id, sources = [], start_time, end_time } = params;
    const sourcesArray = Array.isArray(sources) ? sources : [sources];

    const response = await VnSocialProvider.getHotKeywords({
      project_id,
      sources: sourcesArray,
      start_time,
      end_time,
    });

    return {
      keywords: response.object?.keyword || [],
      total: response.object?.total || 0,
    };
  }

  async getHotPosts(params) {
    const { project_id, source, start_time, end_time } = params;

    const response = await VnSocialProvider.getHotPosts({
      project_id,
      source,
      start_time,
      end_time,
    });

    // VnSocial hot-posts API returns response.object as array directly (not response.object.data)
    const posts = Array.isArray(response.object)
      ? response.object
      : response.object?.data || [];

    return {
      posts: posts,
      total: posts.length,
    };
  }

  async getStatistics(project_id, start_time, end_time, sources = []) {
    const [keywords, hotPosts] = await Promise.all([
      this.getHotKeywords({ project_id, sources, start_time, end_time }),
      Promise.all(
        (sources.length > 0 ? sources : ["facebook", "baochi", "youtube"]).map(
          (source) =>
            this.getHotPosts({
              project_id,
              source,
              start_time,
              end_time,
            }).catch(() => ({ posts: [], total: 0 }))
        )
      ),
    ]);

    const allHotPosts = hotPosts.reduce(
      (acc, result) => [...acc, ...(result.posts || [])],
      []
    );

    return {
      keywords: keywords.keywords.slice(0, 10),
      hotPosts: allHotPosts.slice(0, 5),
      period: { start_time, end_time },
    };
  }

  /**
   * Lấy danh sách topics với bài báo nổi bật nhất của từng topic
   * @param {Object} params - Tham số thời gian và source
   * @returns {Promise<Array>} Array of {topic, hotPost}
   */
  async getTopicsWithHotPosts(params) {
    const { start_time, end_time, source = "baochi" } = params;

    // VnSocial hot-posts API uses MILLISECONDS (not seconds!)
    // Keep timestamps as-is if they're already milliseconds
    let startTimestamp = parseInt(start_time);
    let endTimestamp = parseInt(end_time);

    // Lấy danh sách topics
    const { topics } = await this.getTopics("keyword");

    if (!topics || topics.length === 0) {
      return [];
    }

    // Với mỗi topic, lấy bài báo nổi bật nhất
    const topicsWithPosts = await Promise.all(
      topics.map(async (topic) => {
        try {
          const { posts } = await this.getHotPosts({
            project_id: topic.id,
            source,
            start_time: startTimestamp,
            end_time: endTimestamp,
          });

          // Lấy bài báo đầu tiên (nổi bật nhất)
          const hotPost = posts && posts.length > 0 ? posts[0] : null;

          return {
            topic: {
              id: topic.id,
              name: topic.name || topic.projectName,
              description: topic.description,
            },
            hotPost: hotPost
              ? {
                  id: hotPost.docId || hotPost.id,
                  title: hotPost.title,
                  // Facebook posts have all content in 'title' field, 'content' and 'description' are empty
                  content:
                    hotPost.content ||
                    hotPost.description ||
                    hotPost.title ||
                    "",
                  url: hotPost.postLink || hotPost.url,
                  source: hotPost.domain || hotPost.sourceName || "facebook",
                  author: hotPost.userName || hotPost.author,
                  publishedDate: hotPost.createDate || hotPost.publishedDate,
                  sentiment: hotPost.senti || hotPost.sentiment,
                }
              : null,
          };
        } catch (error) {
          console.error(
            `Error getting hot post for topic ${topic.id}:`,
            error.message
          );
          return {
            topic: {
              id: topic.id,
              name: topic.name || topic.projectName,
              description: topic.description,
            },
            hotPost: null,
          };
        }
      })
    );

    // Lọc bỏ các topic không có bài báo
    const validResults = topicsWithPosts.filter(
      (item) => item.hotPost !== null
    );

    return validResults;
  }

  /**
   * Sync topics từ API và lưu vào database
   * @param {string} type - 'keyword' hoặc 'source'
   * @returns {Promise<Object>} Result with synced count
   */
  async syncTopicsToDatabase(type = "keyword") {
    const VnsocialTopicRepository = require("../repositories/VnsocialTopicRepository");

    // Fetch topics từ API
    const { topics } = await this.getTopics(type);

    if (!topics || topics.length === 0) {
      return {
        synced: 0,
        message: "No topics found to sync",
      };
    }

    // Prepare data cho batch upsert
    const topicsToSync = topics.map((topic) => ({
      externalId: topic.id,
      name: topic.name || topic.projectName,
      description: topic.description,
      type: type === "keyword" ? "TOPIC_POLICY" : "PERSONAL_POST",
      metadata: topic,
    }));

    // Batch upsert
    const result = await VnsocialTopicRepository.batchUpsert(topicsToSync);

    return {
      synced: topicsToSync.length,
      upserted: result.upsertedCount || 0,
      modified: result.modifiedCount || 0,
      message: `Successfully synced ${topicsToSync.length} topics`,
    };
  }
}

module.exports = new VnSocialService();
