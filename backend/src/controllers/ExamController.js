const ExamService = require('../services/ExamService');

class ExamController {
  async createExam(req, res) {
    try {
      const exam = await ExamService.createExam(req.user.userId, req.body);
      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getExamDetail(req, res) {
    try {
      const exam = await ExamService.getExamDetail(req.params.examId, req.user.userId);
      res.status(200).json({ success: true, data: exam });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateExam(req, res) {
    try {
      const exam = await ExamService.updateExam(req.params.examId, req.user.userId, req.body);
      res.status(200).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteExam(req, res) {
    try {
      const result = await ExamService.deleteExam(req.params.examId, req.user.userId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addQuestionsToExam(req, res) {
    try {
      const questions = await ExamService.addQuestions(req.params.examId, req.user.userId, req.body.questions);
      res.status(201).json({ success: true, data: questions });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeQuestionFromExam(req, res) {
    try {
      const result = await ExamService.removeQuestion(req.params.examId, req.user.userId, req.params.examQuestionId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async assignExamToClass(req, res) {
    try {
      const assignment = await ExamService.assignToClass(
        req.params.examId,
        req.body.classId,
        req.user.userId,
        req.body
      );
      res.status(201).json({ success: true, data: assignment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async generateExamFromBank(req, res) {
    try {
      const exam = await ExamService.generateExamFromBank(req.user.userId, req.body);
      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // NEW: Create submission (start exam)
  async createSubmission(req, res) {
    try {
      const { assignmentId, contestId } = req.body;
      const submission = await ExamService.createSubmission(
        req.params.examId,
        req.user.userId,
        assignmentId,
        contestId
      );
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('permission') || error.message.includes('ended') || error.message.includes('exceeded') ? 403 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  // NEW: Get user's submissions for an exam
  async getMySubmissions(req, res) {
    try {
      const { assignmentId } = req.query;
      const submissions = await ExamService.getMySubmissions(
        req.params.examId,
        req.user.userId,
        assignmentId
      );
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ExamController();
