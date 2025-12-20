const SubmissionService = require('../services/SubmissionService');

class SubmissionController {
  async startExam(req, res) {
    try {
      const submission = await SubmissionService.startExam(req.params.assignmentId, req.user.userId);
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async saveAnswer(req, res) {
    try {
      const answer = await SubmissionService.saveAnswer(req.params.submissionId, req.body);
      res.status(200).json({ success: true, data: answer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async autoSave(req, res) {
    try {
      const answers = await SubmissionService.autoSave(req.params.submissionId, req.body.answers);
      res.status(200).json({ success: true, data: answers });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async submitExam(req, res) {
    try {
      console.log('📥 Submit Exam Request:', {
        submissionId: req.params.submissionId,
        userId: req.user.userId,
        answersCount: req.body.answers?.length || 0,
        timeSpent: req.body.timeSpentSeconds
      });

      const result = await SubmissionService.submitExam(
        req.params.submissionId, 
        req.user.userId,
        req.body.answers,
        req.body.timeSpentSeconds
      );

      console.log('✅ Submission successful:', {
        submissionId: result.submissionId,
        status: result.status,
        totalScore: result.totalScore
      });

      res.status(200).json({ success: true, message: 'Exam submitted successfully', data: result });
    } catch (error) {
      console.error('❌ Submit exam error:', error.message);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async getSubmissionDetail(req, res) {
    try {
      const submission = await SubmissionService.getSubmissionDetail(
        req.params.submissionId, 
        req.user.userId
      );
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('permission') ? 403 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async getMySubmission(req, res) {
    try {
      const submission = await SubmissionService.getOrCreateSubmission(req.params.assignmentId, req.user.userId);
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMySubmissions(req, res) {
    try {
      console.log('Query params:', req.query);
      const { examId, contestId, status, page, limit } = req.query;
      const submissions = await SubmissionService.getMySubmissions(req.user.userId, {
        examId,
        contestId,
        status,
        page,
        limit
      });
      res.status(200).json({ success: true, data: { submissions } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SubmissionController();
