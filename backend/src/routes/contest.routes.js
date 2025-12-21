const express = require('express');
const router = express.Router();
const ContestController = require('../controllers/ContestController');
const { authenticate, authorize } = require('../middleware');

// Detail & leaderboard are public (no auth)
router.get('/:contestId', ContestController.getContestDetail);
router.get('/:contestId/leaderboard', ContestController.getLeaderboard);

// All routes below require authentication
router.use(authenticate);

// Join contest (any authenticated user)
router.post('/:contestId/join', ContestController.joinContest);

// Teacher/Admin routes
router.post('/', authorize('teacher', 'admin'), ContestController.createContest);
router.put('/:contestId', authorize('teacher', 'admin'), ContestController.updateContest);
router.delete('/:contestId', authorize('teacher', 'admin'), ContestController.deleteContest);
router.post('/:contestId/exams', authorize('teacher', 'admin'), ContestController.addExamToContest);
router.delete('/:contestId/exams/:contestExamId', authorize('teacher', 'admin'), ContestController.removeExamFromContest);

module.exports = router;
