const VnSocialProvider = require('../providers/VnSocialProvider');

/**
 * Service xử lý business logic cho VnSocial
 */
class VnSocialService {
  /**
   * Lấy danh sách chủ đề
   * @param {String} type - 'keyword' (TOPIC_POLICY) hoặc 'source' (PERSONAL_POST)
   */
  async getTopics(type = null) {
    let apiType = null;
    
    if (type === 'keyword') {
      apiType = 'TOPIC_POLICY';
    } else if (type === 'source') {
      apiType = 'PERSONAL_POST';
    }

    const response = await VnSocialProvider.getProjects(apiType);
    
    return {
      topics: response.object || [],
      total: response.object?.length || 0
    };
  }

  /**
   * Lấy bài viết theo từ khóa
   * @param {Object} filters - {projectId, source, startDate, endDate, page, limit, sentiment, province}
   */
  async getPostsByKeyword(filters) {
    const {
      projectId,
      source,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sentiment = null,
      reactionary = false,
      province = null
    } = filters;

    // Convert dates to milliseconds
    const start_time = new Date(startDate).getTime();
    const end_time = new Date(endDate).getTime();
    
    // Calculate pagination
    const from = (page - 1) * limit;

    // Prepare sentiment filter
    let senti = ['negative', 'neutral', 'positive'];
    if (sentiment) {
      if (Array.isArray(sentiment)) {
        senti = sentiment;
      } else {
        senti = [sentiment];
      }
    }

    const params = {
      project_id: projectId,
      source,
      start_time,
      end_time,
      from,
      size: limit,
      reactionary,
      senti,
      province
    };

    const response = await VnSocialProvider.getPostsByKeyword(params);
    
    return {
      posts: response.object || [],
      page,
      limit,
      total: response.object?.length || 0
    };
  }

  /**
   * Lấy bài viết theo nguồn
   * @param {Object} filters - {sourceId, startDate, endDate, page, limit, sentiment}
   */
  async getPostsBySource(filters) {
    const {
      sourceId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sentiment = null
    } = filters;

    // Convert dates to milliseconds
    const start_time = new Date(startDate).getTime();
    const end_time = new Date(endDate).getTime();
    
    // Calculate pagination
    const from = (page - 1) * limit;

    // Prepare sentiment filter
    let senti = ['negative', 'neutral', 'positive'];
    if (sentiment) {
      if (Array.isArray(sentiment)) {
        senti = sentiment;
      } else {
        senti = [sentiment];
      }
    }

    const params = {
      source_id: sourceId,
      start_time,
      end_time,
      from,
      size: limit,
      senti
    };

    const response = await VnSocialProvider.getPostsBySource(params);
    
    return {
      posts: response.object || [],
      page,
      limit,
      total: response.object?.length || 0
    };
  }

  /**
   * Lấy từ khóa nổi bật
   * @param {Object} filters - {projectId, sources, startDate, endDate}
   */
  async getHotKeywords(filters) {
    const {
      projectId,
      sources = [],
      startDate,
      endDate
    } = filters;

    // Convert dates to milliseconds
    const start_time = new Date(startDate).getTime();
    const end_time = new Date(endDate).getTime();

    // Ensure sources is array
    const sourcesArray = Array.isArray(sources) ? sources : [sources];

    const params = {
      project_id: projectId,
      sources: sourcesArray,
      start_time,
      end_time
    };

    const response = await VnSocialProvider.getHotKeywords(params);
    
    return {
      keywords: response.object?.keyword || [],
      total: response.object?.total || 0
    };
  }

  /**
   * Lấy bài viết nổi bật
   * @param {Object} filters - {projectId, source, startDate, endDate}
   */
  async getHotPosts(filters) {
    const {
      projectId,
      source,
      startDate,
      endDate
    } = filters;

    // Convert dates to milliseconds
    const start_time = new Date(startDate).getTime();
    const end_time = new Date(endDate).getTime();

    const params = {
      project_id: projectId,
      source,
      start_time,
      end_time
    };

    const response = await VnSocialProvider.getHotPosts(params);
    
    return {
      posts: response.object || [],
      total: response.object?.length || 0
    };
  }

  /**
   * Lấy thống kê tổng quan
   * @param {String} projectId
   * @param {String} startDate
   * @param {String} endDate
   * @param {Array} sources - ['baochi', 'facebook', 'forum', 'youtube', 'tiktok']
   */
  async getStatistics(projectId, startDate, endDate, sources = []) {
    const start_time = new Date(startDate).getTime();
    const end_time = new Date(endDate).getTime();

    // Get hot keywords and posts in parallel
    const [keywords, hotPosts] = await Promise.all([
      this.getHotKeywords({
        projectId,
        sources,
        startDate,
        endDate
      }),
      // Get hot posts for each source
      Promise.all(
        (sources.length > 0 ? sources : ['facebook', 'baochi', 'youtube']).map(source =>
          this.getHotPosts({
            projectId,
            source,
            startDate,
            endDate
          }).catch(() => ({ posts: [], total: 0 }))
        )
      )
    ]);

    // Combine hot posts from all sources
    const allHotPosts = hotPosts.reduce((acc, result) => {
      return [...acc, ...(result.posts || [])];
    }, []);

    return {
      keywords: keywords.keywords.slice(0, 10), // Top 10 keywords
      hotPosts: allHotPosts.slice(0, 5), // Top 5 hot posts
      period: {
        start: startDate,
        end: endDate
      }
    };
  }
}

module.exports = new VnSocialService();
