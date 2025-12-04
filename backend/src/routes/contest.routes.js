const express = require('express');
const router = express.Router();
const ContestController = require('../controllers/ContestController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Teacher/Admin routes
router.post('/', authorize('teacher', 'admin'), ContestController.createContest);
router.put('/:contestId', authorize('teacher', 'admin'), ContestController.updateContest);
router.delete('/:contestId', authorize('teacher', 'admin'), ContestController.deleteContest);
router.post('/:contestId/exams', authorize('teacher', 'admin'), ContestController.addExamToContest);
router.delete('/:contestId/exams/:contestExamId', authorize('teacher', 'admin'), ContestController.removeExamFromContest);

// Shared routes
router.get('/:contestId', ContestController.getContestDetail);
router.get('/:contestId/leaderboard', ContestController.getLeaderboard);

module.exports = router;
