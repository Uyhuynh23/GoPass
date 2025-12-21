const { describe, it, expect, beforeEach, vi, afterEach } = require('vitest');
const request = require('supertest');
const express = require('express');

describe('VnSocial Routes', () => {
  let app;
  let mockAuthenticate;
  let mockControllers;

  beforeEach(() => {
    vi.resetModules();

    mockAuthenticate = vi.fn((req, res, next) => {
      req.user = { id: 'test-user-id', role: 'student' };
      next();
    });

    mockControllers = {
      getTopics: vi.fn((req, res) => {
        const { type } = req.query;
        res.json({
          success: true,
          message: 'Lấy danh sách chủ đề thành công',
          data: [
            { id: '1', name: 'Topic 1', type: type || 'keyword' },
            { id: '2', name: 'Topic 2', type: type || 'keyword' },
          ],
        });
      }),
      syncTopics: vi.fn((req, res) => {
        res.json({
          success: true,
          message: 'Đồng bộ chủ đề thành công',
          data: { synced: 10, timestamp: new Date().toISOString() },
        });
      }),
      searchPostsByKeyword: vi.fn((req, res) => {
        const { project_id, source, start_time, end_time } = req.body;
        if (!project_id || !source || start_time === undefined || end_time === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin: project_id, source, start_time, end_time là bắt buộc',
          });
        }
        res.json({
          success: true,
          message: 'Tìm bài viết thành công',
          data: { total: 100, posts: [{ id: '1', title: 'Post 1' }] },
        });
      }),
      searchPostsBySource: vi.fn((req, res) => {
        const { source_id, start_time, end_time } = req.body;
        if (!source_id || start_time === undefined || end_time === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin: source_id, start_time, end_time là bắt buộc',
          });
        }
        res.json({
          success: true,
          message: 'Tìm bài viết thành công',
          data: { total: 50, posts: [{ id: '1', source: 'facebook' }] },
        });
      }),
      getHotKeywords: vi.fn((req, res) => {
        const { project_id, start_time, end_time } = req.body;
        if (!project_id || start_time === undefined || end_time === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin: project_id, start_time, end_time là bắt buộc',
          });
        }
        res.json({
          success: true,
          data: { keywords: [{ keyword: 'covid', count: 1000 }] },
        });
      }),
      getHotPosts: vi.fn((req, res) => {
        res.json({
          success: true,
          data: { posts: [{ id: '1', title: 'Hot Post 1', engagement: 5000 }] },
        });
      }),
      getStatistics: vi.fn((req, res) => {
        res.json({
          success: true,
          data: { total_posts: 10000, total_engagement: 50000 },
        });
      }),
      getSocialDebateTopics: vi.fn((req, res) => {
        res.json({
          success: true,
          data: { debates: [{ id: '1', topic: 'AI Ethics', article_count: 50 }] },
        });
      }),
    };

    vi.doMock('../../middleware', () => ({ authenticate: mockAuthenticate }));
    vi.doMock('../../controllers/VnSocialController', () => mockControllers);

    app = express();
    app.use(express.json());
    const vnsocialRoutes = require('../vnsocial.routes');
    app.use('/api/vnsocial', vnsocialRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/vnsocial/topics', () => {
    it('should get topics successfully with authentication', async () => {
      const response = await request(app)
        .get('/api/vnsocial/topics')
        .query({ type: 'keyword' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(mockControllers.getTopics).toHaveBeenCalled();
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should filter topics by type', async () => {
      const response = await request(app)
        .get('/api/vnsocial/topics')
        .query({ type: 'source' })
        .expect(200);

      expect(response.body.data[0].type).toBe('source');
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app).get('/api/vnsocial/topics').expect(401);
    });
  });

  describe('POST /api/vnsocial/topics/sync', () => {
    it('should sync topics successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/topics/sync')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.syncTopics).toHaveBeenCalled();
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app).post('/api/vnsocial/topics/sync').expect(401);
    });
  });

  describe('POST /api/vnsocial/posts/search-by-keyword', () => {
    it('should search posts by keyword successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/posts/search-by-keyword')
        .send({
          project_id: 'proj123',
          source: 'facebook',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.searchPostsByKeyword).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/vnsocial/posts/search-by-keyword')
        .send({ project_id: 'proj123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('bắt buộc');
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/posts/search-by-keyword')
        .send({
          project_id: 'proj123',
          source: 'facebook',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(401);
    });
  });

  describe('POST /api/vnsocial/posts/search-by-source', () => {
    it('should search posts by source successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/posts/search-by-source')
        .send({
          source_id: 'source123',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.searchPostsBySource).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/vnsocial/posts/search-by-source')
        .send({ source_id: 'source123' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/posts/search-by-source')
        .send({
          source_id: 'source123',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(401);
    });
  });

  describe('POST /api/vnsocial/keywords/hot', () => {
    it('should get hot keywords successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/keywords/hot')
        .send({
          project_id: 'proj123',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.getHotKeywords).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/vnsocial/keywords/hot')
        .send({ project_id: 'proj123' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/keywords/hot')
        .send({
          project_id: 'proj123',
          start_time: 1609459200,
          end_time: 1640995200,
        })
        .expect(401);
    });
  });

  describe('POST /api/vnsocial/posts/hot', () => {
    it('should get hot posts successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/posts/hot')
        .send({ project_id: 'proj123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.getHotPosts).toHaveBeenCalled();
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/posts/hot')
        .send({ project_id: 'proj123' })
        .expect(401);
    });
  });

  describe('POST /api/vnsocial/statistics', () => {
    it('should get statistics successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/statistics')
        .send({ project_id: 'proj123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.getStatistics).toHaveBeenCalled();
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/statistics')
        .send({ project_id: 'proj123' })
        .expect(401);
    });
  });

  describe('POST /api/vnsocial/social-debates', () => {
    it('should get social debate topics successfully', async () => {
      const response = await request(app)
        .post('/api/vnsocial/social-debates')
        .send({ limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockControllers.getSocialDebateTopics).toHaveBeenCalled();
    });

    it('should not require admin role', async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) => {
        req.user = { id: 'test-user', role: 'student' };
        next();
      });

      const response = await request(app)
        .post('/api/vnsocial/social-debates')
        .send({ limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/vnsocial/social-debates')
        .send({ limit: 5 })
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      mockControllers.getTopics.mockImplementationOnce((req, res) => {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      });

      const response = await request(app)
        .get('/api/vnsocial/topics')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });
});
