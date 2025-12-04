const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Public class routes (for all authenticated users)
router.get('/', ClassController.getAllClasses);

// Teacher routes
router.post('/', authorize('teacher'), ClassController.createClass);
router.get('/my-teaching', authorize('teacher'), ClassController.getTeachingClasses);
router.put('/:classId', authorize('teacher'), ClassController.updateClass);
router.delete('/:classId', authorize('teacher'), ClassController.deleteClass);
router.post('/:classId/members', authorize('teacher'), ClassController.addMember);
router.delete('/:classId/members/:memberId', authorize('teacher'), ClassController.removeMember);
router.get('/:classId/join-requests', authorize('teacher'), ClassController.getJoinRequests);
router.post('/:classId/join-requests/:requestId/approve', authorize('teacher'), ClassController.approveJoinRequest);
router.post('/:classId/join-requests/:requestId/reject', authorize('teacher'), ClassController.rejectJoinRequest);
router.get('/:classId/progress', authorize('teacher'), ClassController.getClassProgress);

// Student routes
router.get('/my-learning', authorize('student'), ClassController.getLearningClasses);
router.post('/join-by-code', authorize('student'), ClassController.joinByCode);
router.post('/:classId/join-requests', authorize('student'), ClassController.requestJoinClass);

// Shared routes
router.get('/:classId', ClassController.getClassDetail);

module.exports = router;
