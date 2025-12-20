const express = require('express');
const router = express.Router();
const { StudentController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

// Student statistics endpoints
router.get('/stats', authorize('student'), StudentController.getStudentStats);
router.get('/history', authorize('student'), StudentController.getStudentHistory);
router.get('/activity', authorize('student'), StudentController.getStudentActivity);

// Student practice exams endpoint
router.get('/practice', authorize('student'), StudentController.getPracticeExams);

// Student contests endpoint
router.get('/contests', authorize('student'), StudentController.getStudentContests);

module.exports = router;
