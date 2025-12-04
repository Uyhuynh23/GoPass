const express = require('express');
const router = express.Router();
const GradingController = require('../controllers/GradingController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Teacher routes
router.post('/submissions/:submissionId/grade-auto', authorize('teacher'), GradingController.gradeSubmissionAuto);
router.post('/answers/:answerId/grade-manual', authorize('teacher'), GradingController.gradeAnswerManual);
router.post('/answers/:answerId/ai-suggest', authorize('teacher'), GradingController.aiSuggestScore);

// Shared routes
router.get('/submissions/:submissionId/grade', GradingController.getGradingDetail);

module.exports = router;
