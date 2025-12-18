const VnSocialProvider = require('../providers/VnSocialProvider');

class VnSocialService {
  async getTopics(type = null) {
    let apiType = null;
    if (type === 'keyword') apiType = 'TOPIC_POLICY';
    else if (type === 'source') apiType = 'PERSONAL_POST';

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
      senti = ['negative', 'neutral', 'positive'],
      reactionary = false,
      province,
      time_type = 'createDate'
    } = params;

    const apiParams = {
      project_id, source, start_time, end_time, from, size, reactionary, senti, time_type
    };
    if (province) apiParams.province = province;

    console.log('🔧 VnSocialService:', JSON.stringify(apiParams, null, 2));
    const response = await VnSocialProvider.getPostsByKeyword(apiParams);
    
    const posts = response.object?.data || response.object || [];
    const totalCount = response.object?.total || posts.length || 0;
    
    return { posts, total: totalCount };
  }

  async getPostsBySource(params) {
    const {
      source_id, start_time, end_time,
      from = 0, size = 10,
      senti = ['negative', 'neutral', 'positive'],
      time_type = 'createDate'
    } = params;

    const apiParams = { source_id, start_time, end_time, from, size, senti, time_type };
    const response = await VnSocialProvider.getPostsBySource(apiParams);
    
    return {
      posts: response.object?.data || response.object || [],
      total: response.object?.total || 0
    };
  }

  async getHotKeywords(params) {
    const { project_id, sources = [], start_time, end_time } = params;
    const sourcesArray = Array.isArray(sources) ? sources : [sources];
    
    const response = await VnSocialProvider.getHotKeywords({
      project_id, sources: sourcesArray, start_time, end_time
    });
    
    return {
      keywords: response.object?.keyword || [],
      total: response.object?.total || 0
    };
  }

  async getHotPosts(params) {
    const { project_id, source, start_time, end_time } = params;
    const response = await VnSocialProvider.getHotPosts({ project_id, source, start_time, end_time });
    
    return {
      posts: response.object?.data || response.object || [],
      total: response.object?.total || 0
    };
  }

  async getStatistics(project_id, start_time, end_time, sources = []) {
    const [keywords, hotPosts] = await Promise.all([
      this.getHotKeywords({ project_id, sources, start_time, end_time }),
      Promise.all(
        (sources.length > 0 ? sources : ['facebook', 'baochi', 'youtube']).map(source =>
          this.getHotPosts({ project_id, source, start_time, end_time })
          .catch(() => ({ posts: [], total: 0 }))
        )
      )
    ]);

    const allHotPosts = hotPosts.reduce((acc, result) => [...acc, ...(result.posts || [])], []);

    return {
      keywords: keywords.keywords.slice(0, 10),
      hotPosts: allHotPosts.slice(0, 5),
      period: { start_time, end_time }
    };
  }
}

module.exports = new VnSocialService();
