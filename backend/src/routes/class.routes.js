const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Teacher routes
router.post('/', authorize('teacher'), ClassController.createClass);
router.get('/my-classes', authorize('teacher'), ClassController.getTeachingClasses);
router.put('/:classId', authorize('teacher'), ClassController.updateClass);
router.delete('/:classId', authorize('teacher'), ClassController.deleteClass);
router.get('/:classId/join-requests', authorize('teacher'), ClassController.getJoinRequests);
router.put('/:classId/join-requests/:requestId', authorize('teacher'), ClassController.processJoinRequest);
router.delete('/:classId/members/:studentUserId', authorize('teacher'), ClassController.removeMember);

// Student routes
router.get( '/enrolled', authorize('student'), ClassController.getEnrolledClasses);
router.get('/pending-requests', authorize('student'), ClassController.getPendingRequests);
router.post('/join', authorize('student'), ClassController.joinByCode);
router.delete('/cancel-request/:requestId', authorize('student'), ClassController.cancelJoinRequest);
router.get('/my-enrolled', authorize('student'), ClassController.getLearningClasses);

// Shared routes
router.get('/:classId', ClassController.getClassDetail);
router.get('/:classId/assignments', ClassController.getClassAssignments);
router.get('/:classId/members', ClassController.getClassMembers);

module.exports = router;
