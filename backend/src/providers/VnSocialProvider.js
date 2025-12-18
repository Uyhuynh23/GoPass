const axios = require('axios');

/**
 * VnSocial API Provider
 * Tích hợp với hệ thống VnSocial để lấy dữ liệu mạng xã hội
 */
class VnSocialProvider {
  constructor() {
    this.baseUrl = 'https://api-vnsocialplus.vnpt.vn/social-api/v1';
    this.oauthUrl = 'https://vnsocial.vnpt.vn/oauth/login';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Đăng nhập và lấy access token
   */
  async login(username, password) {
    try {
      console.log('🔐 VnSocial: Attempting login with username:', username);
      console.log('🔐 VnSocial: OAuth URL:', this.oauthUrl);
      
      const response = await axios.post(
        this.oauthUrl,
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ VnSocial: Login response received');
      console.log('📦 VnSocial: Response status:', response.status);
      console.log('📦 VnSocial: Response data:', JSON.stringify(response.data, null, 2));
      console.log('🔍 VnSocial: Checking token fields:');
      console.log('  - response.data exists?', !!response.data);
      console.log('  - response.data.object?.token?', !!response.data?.object?.token);
      console.log('  - response.data.token?', !!response.data?.token);
      console.log('  - response.data.token value:', response.data?.token);

      // Check multiple possible response structures
      if (response.data) {
        // Structure 1: { object: { token: "..." } }
        if (response.data.object && response.data.object.token) {
          this.accessToken = response.data.object.token;
          this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
          console.log('✅ VnSocial: Token saved successfully (structure 1)');
          return this.accessToken;
        }
        
        // Structure 2: { token: "..." }
        if (response.data.token) {
          this.accessToken = response.data.token;
          this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
          console.log('✅ VnSocial: Token saved successfully (structure 2)');
          return this.accessToken;
        }
        
        // Structure 3: { data: { token: "..." } }
        if (response.data.data && response.data.data.token) {
          this.accessToken = response.data.data.token;
          this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
          console.log('✅ VnSocial: Token saved successfully (structure 3)');
          return this.accessToken;
        }
        
        // Structure 4: { access_token: "..." } or { accessToken: "..." }
        if (response.data.access_token || response.data.accessToken) {
          this.accessToken = response.data.access_token || response.data.accessToken;
          this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
          console.log('✅ VnSocial: Token saved successfully (structure 4)');
          return this.accessToken;
        }
      }

      console.error('❌ VnSocial: Invalid login response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid login response - no token found in response');
    } catch (error) {
      console.error('❌ VnSocial login error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: this.oauthUrl
      });
      throw new Error(`Failed to login to VnSocial: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Kiểm tra và refresh token nếu cần
   */
  async ensureToken() {
    if (!this.accessToken || (this.tokenExpiry && Date.now() >= this.tokenExpiry)) {
      console.log('🔄 VnSocial: Token expired or not found, refreshing...');
      
      const username = process.env.VNSOCIAL_USERNAME;
      const password = process.env.VNSOCIAL_PASSWORD;

      if (!username || !password) {
        console.error('❌ VnSocial: Missing credentials in .env file');
        throw new Error('VnSocial credentials not configured. Please set VNSOCIAL_USERNAME and VNSOCIAL_PASSWORD in .env');
      }

      await this.login(username, password);
    } else {
      console.log('✅ VnSocial: Using existing valid token');
    }

    return this.accessToken;
  }

  /**
   * Lấy danh sách chủ đề đã cài đặt
   * @param {String} type - TOPIC_POLICY (từ khóa) hoặc PERSONAL_POST (nguồn)
   */
  async getProjects(type = null) {
    try {
      console.log('📋 VnSocial: Fetching projects, type:', type || 'all');
      const token = await this.ensureToken();
      
      const params = type ? { type } : {};
      
      const response = await axios.get(`${this.baseUrl}/projects`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        params
      });

      console.log('✅ VnSocial: Projects retrieved successfully, count:', response.data?.object?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ VnSocial getProjects error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: `${this.baseUrl}/projects`
      });
      throw new Error(`Failed to get projects from VnSocial: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Lấy tin bài chủ đề theo từ khóa
   */
  async getPostsByKeyword(params) {
    try {
      console.log('📰 VnSocial: Fetching posts by keyword with params:', JSON.stringify(params, null, 2));
      const token = await this.ensureToken();
      
      // Extract and ensure all required fields have values
      const project_id = params.project_id;
      const source = params.source;
      const start_time = params.start_time;
      const end_time = params.end_time;
      const from = params.from ?? 0; // Use nullish coalescing to handle undefined/null
      const size = params.size ?? 10;
      const reactionary = params.reactionary ?? false;
      const senti = params.senti ?? ['negative', 'neutral', 'positive'];
      const time_type = params.time_type ?? 'createDate';
      const province = params.province;

      // Validate required fields
      if (!project_id || !source || start_time === undefined || start_time === null || end_time === undefined || end_time === null) {
        throw new Error('Missing required fields: project_id, source, start_time, end_time');
      }

      const requestBody = {
        project_id,
        source,
        start_time,
        end_time,
        from,
        size,
        reactionary,
        senti,
        time_type
      };

      // Only add province if it has a value
      if (province && typeof province === 'string' && province.trim() !== '') {
        requestBody.province = province;
      }

      console.log('📤 VnSocial: Request body:', JSON.stringify(requestBody, null, 2));
      console.log('🔍 VnSocial: Validating required fields:');
      console.log('  - project_id:', project_id, typeof project_id);
      console.log('  - source:', source, typeof source);
      console.log('  - start_time:', start_time, typeof start_time);
      console.log('  - end_time:', end_time, typeof end_time);
      console.log('  - from:', from, typeof from);
      console.log('  - size:', size, typeof size);
      console.log('  - reactionary:', reactionary, typeof reactionary);
      console.log('  - senti:', senti, Array.isArray(senti) ? `Array[${senti.length}]` : typeof senti);

      const response = await axios.post(
        `${this.baseUrl}/projects/posts`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );

      console.log('✅ VnSocial: Posts retrieved successfully, count:', response.data?.object?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ VnSocial getPostsByKeyword error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: `${this.baseUrl}/projects/posts`,
        requestParams: params
      });
      throw new Error(`Failed to get posts by keyword from VnSocial: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Lấy tin bài chủ đề theo nguồn
   */
  async getPostsBySource(params) {
    try {
      const token = await this.ensureToken();
      
      const {
        source_id,
        start_time,
        end_time,
        from = 0,
        size = 10,
        senti = ['negative', 'neutral', 'positive'],
        time_type = 'createDate'
      } = params;

      console.log('📰 VnSocial: Fetching posts by source with params:', JSON.stringify(params, null, 2));

      const requestBody = {
        source_id,
        start_time,
        end_time,
        from,
        size,
        senti,
        time_type
      };

      console.log('📤 VnSocial: Request body for source-follow/posts:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${this.baseUrl}/source-follow/posts`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );

      console.log('✅ VnSocial: Posts by source retrieved successfully');
      return response.data;
    } catch (error) {
      console.error('❌ VnSocial getPostsBySource error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        requestParams: params
      });
      throw new Error(`Failed to get posts by source from VnSocial: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Lấy từ khóa nổi bật
   */
  async getHotKeywords(params) {
    try {
      const token = await this.ensureToken();
      
      const {
        project_id,
        sources = [],
        start_time,
        end_time
      } = params;

      const requestBody = {
        project_id,
        sources,
        start_time,
        end_time
      };

      const response = await axios.post(
        `${this.baseUrl}/projects/hot-keywords`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('VnSocial getHotKeywords error:', error.response?.data || error.message);
      throw new Error('Failed to get hot keywords from VnSocial');
    }
  }

  /**
   * Lấy bài viết nổi bật
   */
  async getHotPosts(params) {
    try {
      const token = await this.ensureToken();
      
      const {
        project_id,
        source,
        start_time,
        end_time
      } = params;

      const requestBody = {
        project_id,
        source,
        start_time,
        end_time
      };

      const response = await axios.post(
        `${this.baseUrl}/projects/hot-posts`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('VnSocial getHotPosts error:', error.response?.data || error.message);
      throw new Error('Failed to get hot posts from VnSocial');
    }
  }
}

module.exports = new VnSocialProvider();
