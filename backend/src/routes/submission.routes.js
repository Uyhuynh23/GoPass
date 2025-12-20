const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Student routes - SPECIFIC ROUTES FIRST
router.get('/my-submissions', authorize('student'), SubmissionController.getMySubmissions);
router.post('/assignments/:assignmentId/start', authorize('student'), SubmissionController.startExam);
router.get('/assignments/:assignmentId/my-submission', authorize('student'), SubmissionController.getMySubmission);
router.post('/:submissionId/answers', authorize('student'), SubmissionController.saveAnswer);
router.post('/:submissionId/auto-save', authorize('student'), SubmissionController.autoSave);
router.post('/:submissionId/submit', authorize('student'), SubmissionController.submitExam);

// Shared routes (student can view own, teacher can view students') - GENERIC PARAM ROUTES LAST
router.get('/:submissionId', SubmissionController.getSubmissionDetail);

module.exports = router;