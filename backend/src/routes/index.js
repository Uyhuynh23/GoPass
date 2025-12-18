const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const classRoutes = require('./class.routes');
const examRoutes = require('./exam.routes');
const submissionRoutes = require('./submission.routes');
const gradingRoutes = require('./grading.routes');
const questionBankRoutes = require('./questionbank.routes');
const contestRoutes = require('./contest.routes');
const adminRoutes = require('./admin.routes');
const vnsocialRoutes = require('./vnsocial.routes');

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/exams', examRoutes);
router.use('/submissions', submissionRoutes);
router.use('/grading', gradingRoutes);
router.use('/questions', questionBankRoutes);
router.use('/contests', contestRoutes);
router.use('/admin', adminRoutes);
router.use('/vnsocial', vnsocialRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
