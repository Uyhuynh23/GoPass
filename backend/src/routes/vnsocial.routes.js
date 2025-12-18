const express = require('express');
const router = express.Router();
const VnSocialController = require('../controllers/VnSocialController');
const { authenticate } = require('../middleware');

/**
 * Tất cả routes VnSocial đều yêu cầu xác thực
 */

// Lấy danh sách chủ đề/dự án
router.get('/topics', authenticate, VnSocialController.getTopics);

// Tìm bài viết theo từ khóa
router.post('/posts/search-by-keyword', authenticate, VnSocialController.searchPostsByKeyword);

// Tìm bài viết theo nguồn
router.post('/posts/search-by-source', authenticate, VnSocialController.searchPostsBySource);

// Lấy từ khóa nổi bật
router.post('/keywords/hot', authenticate, VnSocialController.getHotKeywords);

// Lấy bài viết nổi bật
router.post('/posts/hot', authenticate, VnSocialController.getHotPosts);

// Lấy thống kê tổng quan
router.post('/statistics', authenticate, VnSocialController.getStatistics);

module.exports = router;
