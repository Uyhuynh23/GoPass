const ExamRepository = require('../repositories/ExamRepository');
const ExamQuestionRepository = require('../repositories/ExamQuestionRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const QuestionRepository = require('../repositories/QuestionRepository');

class ExamService {
  // Create exam
  async createExam(teacherId, dto) {
    const { 
      title, 
      description, 
      subject, 
      durationMinutes, 
      mode, 
      shuffleQuestions,
      showResultsImmediately,
      readingPassages,
      totalQuestions,
      totalPoints
    } = dto;

    const exam = await ExamRepository.create({
      title,
      description,
      subject,
      durationMinutes,
      mode: mode || 'practice',
      shuffleQuestions: shuffleQuestions || false,
      showResultsImmediately: showResultsImmediately || false,
      readingPassages: readingPassages || [],
      totalQuestions: totalQuestions || 0,
      totalPoints: totalPoints || 10,
      createdBy: teacherId,
      isPublished: false,
    });

    return exam;
  }

  // Get exam detail
  async getExamDetail(examId, userId) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    const questions = await ExamQuestionRepository.findByExam(examId, {
      populate: 'questionId',
    });

    return {
      ...exam.toObject(),
      questions,
    };
  }

  // Update exam
  async updateExam(examId, teacherId, dto) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to update this exam');
    }

    const updateData = {};
    const allowedFields = [
      'title', 
      'description', 
      'subject', 
      'durationMinutes', 
      'mode', 
      'shuffleQuestions',
      'showResultsImmediately',
      'readingPassages',
      'totalQuestions',
      'totalPoints'
    ];
    allowedFields.forEach(field => {
      if (dto[field] !== undefined) updateData[field] = dto[field];
    });

    return await ExamRepository.update(examId, updateData);
  }

  // Delete exam
  async deleteExam(examId, teacherId) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to delete this exam');
    }

    await ExamQuestionRepository.deleteByExam(examId);
    await ExamRepository.delete(examId);

    return { message: 'Exam deleted successfully' };
  }

  // Add questions to exam
  async addQuestions(examId, teacherId, dtos) {
    const exam = await ExamRepository.findById(examId);
    if (!exam || exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const addedQuestions = [];
    let order = await ExamQuestionRepository.getNextOrder(examId);

    for (const dto of dtos) {
      const examQuestion = await ExamQuestionRepository.create({
        examId,
        questionId: dto.questionId,
        order: order++,
        maxScore: dto.maxScore || 1,
        points: dto.points || dto.maxScore || 1,
        section: dto.section || '',
      });
      addedQuestions.push(examQuestion);
    }

    return addedQuestions;
  }

  // Remove question from exam
  async removeQuestion(examId, teacherId, examQuestionId) {
    const exam = await ExamRepository.findById(examId);
    if (!exam || exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    await ExamQuestionRepository.delete(examQuestionId);
    return { message: 'Question removed successfully' };
  }

  // Assign exam to class
  async assignToClass(examId, classId, teacherId, dto) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    const { startTime, endTime, shuffleQuestions, allowLateSubmission, maxAttempts } = dto;

    const assignment = await ExamAssignmentRepository.create({
      examId,
      classId,
      startTime,
      endTime,
      shuffleQuestions: shuffleQuestions || false,
      allowLateSubmission: allowLateSubmission || false,
      maxAttempts: maxAttempts || 1,
    });

    return assignment;
  }

  // Generate exam from question bank
  async generateExamFromBank(teacherId, config) {
    const { title, subject, durationMinutes, questionCounts } = config;

    // Create exam
    const exam = await this.createExam(teacherId, {
      title,
      subject,
      durationMinutes,
      mode: 'practice',
    });

    // Select questions based on config
    const selectedQuestions = [];
    
    for (const qConfig of questionCounts) {
      const filter = {
        subject,
        difficulty: qConfig.difficulty,
        type: qConfig.type,
      };

      const questions = await QuestionRepository.selectRandomQuestions(filter, qConfig.count);
      selectedQuestions.push(...questions);
    }

    // Add questions to exam
    const questionDtos = selectedQuestions.map((q, index) => ({
      questionId: q._id,
      maxScore: q.points || 1,
    }));

    await this.addQuestions(exam._id, teacherId, questionDtos);

    return exam;
  }
}

module.exports = new ExamService();
