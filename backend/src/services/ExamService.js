const ExamRepository = require('../repositories/ExamRepository');
const ExamQuestionRepository = require('../repositories/ExamQuestionRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const QuestionRepository = require('../repositories/QuestionRepository');
const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ContestParticipationRepository = require('../repositories/ContestParticipationRepository');

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
  async getExamDetail(examId, userId, includeAnswers = false, assignmentId = null, contestId = null) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    // Get exam questions with populated question details
    const examQuestions = await ExamQuestionRepository.findByExam(examId, {
      populate: 'questionId',
    });

    // Map to frontend format
    const questions = examQuestions.map(eq => {
      const question = eq.questionId;
      
      return {
        _id: eq._id,
        examId: eq.examId,
        questionId: question._id,
        order: eq.order,
        section: eq.section || null,
        maxScore: eq.maxScore,
        question: {
          _id: question._id,
          type: question.type,
          content: question.content,
          options: question.options || [],
          correctAnswer: includeAnswers ? question.correctAnswer : null,
          explanation: includeAnswers ? question.explanation : null,
          difficulty: question.difficulty,
          subject: question.subject,
          tags: question.tags || [],
          points: question.points,
          linkedPassageId: question.linkedPassageId || null,
          image: question.image || null,
          tableData: question.tableData || null,
          isPublic: question.isPublic,
          createdBy: question.createdBy,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        }
      };
    });

    // Get assignment if assignmentId provided
    let assignment = null;
    if (assignmentId) {
      assignment = await ExamAssignmentRepository.findById(assignmentId);
    }

    // Get user's latest submission for this exam
    let userSubmission = null;
    if (assignmentId) {
      userSubmission = await ExamSubmissionRepository.findOne({
        assignmentId,
        studentId: userId,
      }, { sort: { createdAt: -1 } });
    } else if (contestId) {
      userSubmission = await ExamSubmissionRepository.findOne({
        examId,
        studentId: userId,
        contestId,
      }, { sort: { createdAt: -1 } });
    } else {
      userSubmission = await ExamSubmissionRepository.findOne({
        examId,
        studentId: userId,
        assignmentId: null,
        contestId: null,
      }, { sort: { createdAt: -1 } });
    }

    return {
      ...exam.toObject(),
      questions,
      assignment,
      userSubmission,
      readingPassages: exam.readingPassages || [],
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

  // NEW: Create submission (start exam)
  async createSubmission(examId, studentId, assignmentId = null, contestId = null) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    // Check if assignment-based exam
    if (assignmentId) {
      const assignment = await ExamAssignmentRepository.findById(assignmentId);
      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Check time window
      const now = new Date();
      if (now < assignment.startTime) {
        throw new Error('Exam has not started yet');
      }
      if (now > assignment.endTime && !assignment.allowLateSubmission) {
        throw new Error('Exam assignment has ended');
      }

      // Check class membership
      const isMember = await ClassMemberRepository.isMember(assignment.classId, studentId);
      if (!isMember) {
        throw new Error('You don\'t have permission to access this exam');
      }

      // Check for existing in-progress submission
      const existing = await ExamSubmissionRepository.findOne({
        assignmentId,
        studentId,
        status: 'in_progress',
      });

      if (existing) {
        return existing;
      }

      // Check attempts
      const attempts = await ExamSubmissionRepository.count({
        assignmentId,
        studentId,
      });

      if (attempts >= assignment.maxAttempts) {
        throw new Error('Maximum attempts exceeded');
      }

      // Calculate max score
      const maxScore = await ExamQuestionRepository.calculateTotalScore(examId);

      // Create submission
      const submission = await ExamSubmissionRepository.create({
        assignmentId,
        examId,
        studentId,
        contestId: null,
        status: 'in_progress',
        startedAt: new Date(),
        maxScore,
        attemptNumber: attempts + 1,
      });

      return submission;
    }

    // For contest or standalone exams
    const existing = await ExamSubmissionRepository.findOne({
      examId,
      studentId,
      contestId: contestId || null,
      assignmentId: null,
      status: 'in_progress',
    });

    if (existing) {
      return existing;
    }

    const maxScore = await ExamQuestionRepository.calculateTotalScore(examId);
    const attempts = await ExamSubmissionRepository.count({
      examId,
      studentId,
      contestId: contestId || null,
    });

    const submission = await ExamSubmissionRepository.create({
      assignmentId: null,
      examId,
      studentId,
      contestId: contestId || null,
      status: 'in_progress',
      startedAt: new Date(),
      maxScore,
      attemptNumber: attempts + 1,
    });

    return submission;
  }

  // NEW: Get user's submissions for an exam
  async getMySubmissions(examId, studentId, assignmentId = null) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    const filter = {
      examId,
      studentId,
    };

    if (assignmentId) {
      filter.assignmentId = assignmentId;
    }

    const submissions = await ExamSubmissionRepository.find(filter, {
      sort: { attemptNumber: -1 },
    });

    return submissions;
  }
}

module.exports = new ExamService();
