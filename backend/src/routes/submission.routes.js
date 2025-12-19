const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// NEW: Get active submissions for current user
router.get('/my-active', SubmissionController.getMyActiveSubmissions);

// Student routes - Auto-save and submission
router.patch('/:submissionId/answers', SubmissionController.autoSaveAnswers);
router.post('/:submissionId/submit', SubmissionController.submitExam);
router.get('/:submissionId/answers', SubmissionController.getSubmissionAnswers);

// Teacher routes - Manual grading
router.patch('/:submissionId/grade', authorize('teacher'), SubmissionController.manualGrade);

// Shared routes (student can view own, teacher can view students')
router.get('/:submissionId', SubmissionController.getSubmissionDetail);

// Legacy routes (keeping for backward compatibility)
router.post('/assignments/:assignmentId/start', authorize('student'), SubmissionController.startExam);
router.post('/:submissionId/answers', authorize('student'), SubmissionController.saveAnswer);
router.post('/:submissionId/auto-save', authorize('student'), SubmissionController.autoSave);
router.get('/assignments/:assignmentId/my-submission', authorize('student'), SubmissionController.getMySubmission);

module.exports = router;
