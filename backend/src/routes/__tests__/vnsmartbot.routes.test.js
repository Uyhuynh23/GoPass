const { describe, it, expect, beforeEach, vi, afterEach } = require('vitest');
const request = require('supertest');
const express = require('express');

describe('VnSmartBot Routes', () => {
  let app;
  let mockAuthenticate;
  let mockHealthCheck;
  let mockConversationStream;
  let mockConversation;
  let mockConversationWithVariables;
  let mockHandleButtonAction;

  beforeEach(() => {
    // Clear all modules from cache to get fresh mocks
    vi.resetModules();

    // Setup mock functions
    mockAuthenticate = vi.fn((req, res, next) => {
      req.user = { id: 'test-user-id', role: 'student' };
      next();
    });

    mockHealthCheck = vi.fn((req, res) => {
      res.json({ success: true, message: 'vnSmartBot is healthy' });
    });

    mockConversationStream = vi.fn((req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write('data: {"message":"test"}\\n\\n');
      res.write('data: [DONE]\\n\\n');
      res.end();
    });

    mockConversation = vi.fn((req, res) => {
      if (!req.body.sender_id || !req.body.text) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and text are required',
        });
      }
      res.json({
        success: true,
        data: {
          raw: { message: 'Response from bot' },
          parsed: { type: 'text', content: 'Response from bot' },
        },
      });
    });

    mockConversationWithVariables = vi.fn((req, res) => {
      res.json({
        success: true,
        data: {
          message: 'Response with variables',
          variables: { key: 'value' },
        },
      });
    });

    mockHandleButtonAction = vi.fn((req, res) => {
      if (!req.body.sender_id || !req.body.button) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and button are required',
        });
      }
      res.json({
        success: true,
        data: {
          action: 'completed',
          result: 'Action executed',
        },
      });
    });

    // Mock the middleware module
    vi.doMock('../../middleware', () => ({
      authenticate: mockAuthenticate,
    }));

    // Mock the controller module
    vi.doMock('../../controllers/VnSmartBotController', () => ({
      healthCheck: mockHealthCheck,
      conversationStream: mockConversationStream,
      conversation: mockConversation,
      conversationWithVariables: mockConversationWithVariables,
      handleButtonAction: mockHandleButtonAction,
    }));

    // Setup express app with mocked routes
    app = express();
    app.use(express.json());
    const vnsmartbotRoutes = require('../vnsmartbot.routes');
    app.use('/api/smartbot', vnsmartbotRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/smartbot/health', () => {
    it('should check health without authentication', async () => {
      const response = await request(app)
        .get('/api/smartbot/health')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'vnSmartBot is healthy',
      });
      expect(mockHealthCheck).toHaveBeenCalled();
    });
  });

  describe('POST /api/smartbot/conversation/stream', () => {
    it('should stream conversation with authentication', async () => {
      const response = await request(app)
        .post('/api/smartbot/conversation/stream')
        .send({
          sender_id: 'user123',
          text: 'Hello bot',
        })
        .expect(200);

      expect(mockConversationStream).toHaveBeenCalled();
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(response.headers['content-type']).toBe('text/event-stream');
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/smartbot/conversation/stream')
        .send({
          sender_id: 'user123',
          text: 'Hello bot',
        })
        .expect(401);
    });
  });

  describe('POST /api/smartbot/conversation', () => {
    it('should send conversation message successfully', async () => {
      const response = await request(app)
        .post('/api/smartbot/conversation')
        .send({
          sender_id: 'user123',
          text: 'Hello bot',
          input_channel: 'web',
          metadata: { source: 'test' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(mockConversation).toHaveBeenCalled();
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/smartbot/conversation')
        .send({
          sender_id: 'user123',
          // missing text
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/smartbot/conversation')
        .send({
          sender_id: 'user123',
          text: 'Hello',
        })
        .expect(401);
    });
  });

  describe('POST /api/smartbot/conversation-with-variables', () => {
    it('should send conversation with variables successfully', async () => {
      const response = await request(app)
        .post('/api/smartbot/conversation-with-variables')
        .send({
          sender_id: 'user123',
          text: 'Hello {{name}}',
          metadata: {
            variables: { name: 'John' },
          },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockConversationWithVariables).toHaveBeenCalled();
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/smartbot/conversation-with-variables')
        .send({
          sender_id: 'user123',
          text: 'Hello',
        })
        .expect(401);
    });
  });

  describe('POST /api/smartbot/button-action', () => {
    it('should handle button action successfully', async () => {
      const response = await request(app)
        .post('/api/smartbot/button-action')
        .send({
          sender_id: 'user123',
          button: {
            type: 'postback',
            payload: 'action_1',
            title: 'Click me',
          },
          session_id: 'session123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockHandleButtonAction).toHaveBeenCalled();
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/smartbot/button-action')
        .send({
          sender_id: 'user123',
          // missing button
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should require authentication', async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Unauthorized' });
      });

      await request(app)
        .post('/api/smartbot/button-action')
        .send({
          sender_id: 'user123',
          button: { type: 'postback', payload: 'test' },
        })
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      mockConversation.mockImplementationOnce((req, res) => {
        res.status(500).json({
          success: false,
          message: 'Error processing conversation',
          error: 'Internal server error',
        });
      });

      const response = await request(app)
        .post('/api/smartbot/conversation')
        .send({
          sender_id: 'user123',
          text: 'Hello',
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error processing conversation');
    });
  });
});
