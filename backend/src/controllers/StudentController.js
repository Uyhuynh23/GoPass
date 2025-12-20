const { StudentService } = require('../services');

class StudentController {
  async getStudentStats(req, res) {
    try {
      const stats = await StudentService.getStudentStats(req.user.userId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStudentHistory(req, res) {
    try {
      const history = await StudentService.getStudentHistory(req.user.userId);
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStudentActivity(req, res) {
    try {
      const activity = await StudentService.getStudentActivity(req.user.userId);
      res.status(200).json({ success: true, data: { activity } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getPracticeExams(req, res) {
    try {
      const { subject } = req.query;
      const data = await StudentService.getPracticeExams(req.user.userId, subject);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStudentContests(req, res) {
    try {
      const { status } = req.query;
      const data = await StudentService.getStudentContests(req.user.userId, status);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getSubjectPerformance(req, res) {
    try {
      const subjectPerformance = await StudentService.getSubjectPerformance(req.user.userId);
      res.status(200).json({ success: true, data: subjectPerformance });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new StudentController();
