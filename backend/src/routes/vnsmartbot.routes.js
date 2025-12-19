const express = require('express');
const router = express.Router();
const VnSmartBotController = require('../controllers/VnSmartBotController');
const { authenticate } = require('../middleware');

/**
 * Routes cho vnSmartBot integration
 */

// Health check - không cần authentication cho monitoring
router.get('/health', VnSmartBotController.healthCheck);

// Gửi tin nhắn và nhận response streaming (SSE)
router.post('/conversation/stream', authenticate, VnSmartBotController.conversationStream);

// Gửi tin nhắn và nhận response thông thường
router.post('/conversation', authenticate, VnSmartBotController.conversation);

// Gửi tin nhắn với variables (metadata)
router.post('/conversation-with-variables', authenticate, VnSmartBotController.conversationWithVariables);

// Xử lý button action từ card_data
router.post('/button-action', authenticate, VnSmartBotController.handleButtonAction);

module.exports = router;
