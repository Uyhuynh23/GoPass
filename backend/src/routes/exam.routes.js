const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/ExamController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Teacher routes
router.post('/', authorize('teacher'), ExamController.createExam);
router.put('/:examId', authorize('teacher'), ExamController.updateExam);
router.delete('/:examId', authorize('teacher'), ExamController.deleteExam);
router.post('/:examId/questions', authorize('teacher'), ExamController.addQuestionsToExam);
router.delete('/:examId/questions/:examQuestionId', authorize('teacher'), ExamController.removeQuestionFromExam);
router.post('/:examId/assign-to-class', authorize('teacher'), ExamController.assignExamToClass);
router.post('/generate-from-bank', authorize('teacher'), ExamController.generateExamFromBank);

// Shared routes
router.get('/:examId', ExamController.getExamDetail);

module.exports = router;
