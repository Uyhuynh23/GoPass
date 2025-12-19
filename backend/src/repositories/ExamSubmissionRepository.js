const BaseRepository = require('./BaseRepository');
const ExamSubmission = require('../models/ExamSubmission');

class ExamSubmissionRepository extends BaseRepository {
  constructor() {
    super(ExamSubmission);
  }

  async findByAssignment(assignmentId, options = {}) {
    return await this.find({ assignmentId }, options);
  }

  async findByStudent(studentId, options = {}) {
    return await this.find({ studentId }, options);
  }

  async findByExam(examId, options = {}) {
    return await this.find({ examId }, options);
  }

  async findStudentSubmission(assignmentId, studentId) {
    return await this.findOne({ assignmentId, studentId });
  }

  async findInProgressSubmission(assignmentId, studentId) {
    return await this.findOne({ 
      assignmentId, 
      studentId,
      status: 'in_progress' 
    });
  }

  async submitSubmission(submissionId) {
    return await this.update(submissionId, {
      status: 'submitted',
      submittedAt: new Date(),
    });
  }

  async gradeSubmission(submissionId, totalScore) {
    return await this.update(submissionId, {
      status: 'graded',
      totalScore,
    });
  }

  async getStudentAttempts(assignmentId, studentId) {
    return await this.count({ assignmentId, studentId });
  }

  async calculateClassAverage(assignmentId) {
    const submissions = await this.find({ 
      assignmentId, 
      status: 'graded' 
    });
    
    if (submissions.length === 0) return 0;
    
    const total = submissions.reduce((sum, s) => sum + s.totalScore, 0);
    return total / submissions.length;
  }

  async findByExamAndStudent(examId, studentId, options = {}) {
    return await this.find({ examId, studentId }, options);
  }
}

module.exports = new ExamSubmissionRepository();
