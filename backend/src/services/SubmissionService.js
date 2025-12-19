const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const ExamAnswerRepository = require('../repositories/ExamAnswerRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const ExamRepository = require('../repositories/ExamRepository');
const ExamQuestionRepository = require('../repositories/ExamQuestionRepository');
const QuestionRepository = require('../repositories/QuestionRepository');
const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ContestParticipationRepository = require('../repositories/ContestParticipationRepository');

class SubmissionService {
  // Start exam
  async startExam(assignmentId, studentId) {
    const assignment = await ExamAssignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Check if assignment is active
    const now = new Date();
    if (now < assignment.startTime) {
      throw new Error('Exam has not started yet');
    }
    if (now > assignment.endTime && !assignment.allowLateSubmission) {
      throw new Error('Exam has ended');
    }

    // Check if student is member of the class
    const isMember = await ClassMemberRepository.isMember(assignment.classId, studentId);
    if (!isMember) {
      throw new Error('You are not a member of this class');
    }

    // Check existing submissions
    const existingSubmission = await ExamSubmissionRepository.findInProgressSubmission(
      assignmentId,
      studentId
    );

    if (existingSubmission) {
      return existingSubmission;
    }

    // Check attempts
    const attempts = await ExamSubmissionRepository.getStudentAttempts(assignmentId, studentId);
    if (attempts >= assignment.maxAttempts) {
      throw new Error('Maximum attempts reached');
    }

    // Calculate max score
    const maxScore = await ExamQuestionRepository.calculateTotalScore(assignment.examId);

    // Create new submission
    const submission = await ExamSubmissionRepository.create({
      assignmentId,
      examId: assignment.examId,
      studentId,
      status: 'in_progress',
      maxScore,
      attemptNumber: attempts + 1,
    });

    return submission;
  }

  // Save answer
  async saveAnswer(submissionId, dto) {
    const { questionId, answerText, selectedOptions } = dto;

    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'in_progress') {
      throw new Error('Cannot save answer for submitted exam');
    }

    // Get question max score
    const examQuestion = await ExamQuestionRepository.findOne({
      examId: submission.examId,
      questionId,
    });

    const answer = await ExamAnswerRepository.upsertAnswer(submissionId, questionId, {
      answerText,
      selectedOptions,
      maxScore: examQuestion?.maxScore || 1,
    });

    return answer;
  }

  // Auto-save batch of answers
  async autoSave(submissionId, answers) {
    const results = [];

    for (const answerDto of answers) {
      const answer = await this.saveAnswer(submissionId, answerDto);
      results.push(answer);
    }

    return results;
  }

  // Submit exam
  async submitExam(submissionId, studentId, answers = [], timeSpentSeconds = 0) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.studentId.toString() !== studentId.toString()) {
      throw new Error('Unauthorized');
    }

    if (submission.status !== 'in_progress') {
      throw new Error('Submission has already been finalized');
    }

    // Save final answers if provided
    if (answers && answers.length > 0) {
      for (const answerDto of answers) {
        await this.saveAnswer(submissionId, answerDto);
      }
    }

    // Get all answers for grading
    const savedAnswers = await ExamAnswerRepository.findBySubmission(submissionId);

    // Get all questions with correct answers
    const examQuestions = await ExamQuestionRepository.findByExam(submission.examId, {
      populate: 'questionId',
    });

    let totalScore = 0;
    let gradedCount = 0;
    let pendingManualGrading = 0;

    // Auto-grade each answer
    for (const answer of savedAnswers) {
      const examQuestion = examQuestions.find(
        eq => eq.questionId._id.toString() === answer.questionId.toString()
      );

      if (!examQuestion) continue;

      const question = examQuestion.questionId;
      const maxScore = answer.maxScore || examQuestion.maxScore || 1;

      let score = 0;
      let isAutoGraded = false;
      let feedback = '';

      // Auto-grade based on question type
      if (question.type === 'multiple_choice') {
        const userAnswer = Array.isArray(answer.selectedOptions) && answer.selectedOptions.length > 0
          ? answer.selectedOptions[0]
          : '';
        const correctAnswer = question.correctAnswer;

        if (userAnswer.trim().toUpperCase() === String(correctAnswer).trim().toUpperCase()) {
          score = maxScore;
          feedback = 'Correct!';
        } else {
          score = 0;
          feedback = `Incorrect. Correct answer is ${correctAnswer}.`;
        }
        isAutoGraded = true;
        gradedCount++;
      } else if (question.type === 'true_false') {
        // True/False with partial credit
        const userAnswer = answer.selectedOptions || {};
        const correctAnswer = question.correctAnswer || {};

        if (typeof correctAnswer === 'object') {
          let correct = 0;
          let total = 0;

          for (let key in correctAnswer) {
            total++;
            if (String(userAnswer[key]) === String(correctAnswer[key])) {
              correct++;
            }
          }

          if (total > 0) {
            score = (correct / total) * maxScore;
            if (correct === total) {
              feedback = 'All correct!';
            } else if (correct > 0) {
              feedback = `Partially correct. ${correct}/${total} options correct.`;
            } else {
              feedback = 'Incorrect.';
            }
          }
        } else {
          // Simple true/false
          const userValue = userAnswer[Object.keys(userAnswer)[0]];
          if (String(userValue) === String(correctAnswer)) {
            score = maxScore;
            feedback = 'Correct!';
          } else {
            score = 0;
            feedback = 'Incorrect.';
          }
        }
        isAutoGraded = true;
        gradedCount++;
      } else if (question.type === 'short_answer') {
        // Simple string comparison for short answers
        const userAnswer = (answer.answerText || '').trim().toLowerCase();
        const correctAnswer = String(question.correctAnswer || '').trim().toLowerCase();

        if (userAnswer === correctAnswer) {
          score = maxScore;
          feedback = 'Correct!';
          isAutoGraded = true;
          gradedCount++;
        } else {
          // Mark for manual grading
          score = 0;
          feedback = 'Pending manual grading';
          pendingManualGrading++;
        }
      } else if (question.type === 'essay') {
        // Essays always need manual grading
        score = 0;
        feedback = 'Pending manual grading';
        pendingManualGrading++;
      }

      totalScore += score;

      // Update answer with score and feedback
      await ExamAnswerRepository.update(answer._id, {
        score,
        feedback,
        isAutoGraded,
      });
    }

    // Update submission
    const status = pendingManualGrading > 0 ? 'submitted' : 'graded';
    await ExamSubmissionRepository.update(submissionId, {
      status,
      totalScore: parseFloat(totalScore.toFixed(2)),
      submittedAt: new Date(),
      durationSeconds: timeSpentSeconds,
    });

    // If contest, update participation score
    if (submission.contestId) {
      try {
        const participation = await ContestParticipationRepository.findOne({
          contestId: submission.contestId,
          studentId,
        });

        if (participation) {
          await ContestParticipationRepository.addExamScore(
            participation._id,
            submission.examId,
            totalScore
          );
        }
      } catch (error) {
        console.error('Error updating contest participation:', error);
      }
    }

    return {
      submissionId,
      status,
      totalScore: parseFloat(totalScore.toFixed(2)),
      maxScore: submission.maxScore,
      submittedAt: new Date(),
      gradedAnswers: gradedCount,
      pendingManualGrading,
    };
  }

  // Get submission detail
  async getSubmissionDetail(submissionId, userId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    // Check permission: user must be the student or a teacher
    // For now, simplified check - you can enhance with teacher verification
    if (submission.studentId.toString() !== userId.toString()) {
      // Could add teacher check here
      // For now, allow if submission is graded/submitted
      if (submission.status === 'in_progress') {
        throw new Error('You don\'t have permission to view this submission');
      }
    }

    // Get exam with full details including correct answers and explanations
    const exam = await ExamRepository.findById(submission.examId);
    const examQuestions = await ExamQuestionRepository.findByExam(submission.examId, {
      populate: 'questionId',
    });

    // Get answers
    const answers = await ExamAnswerRepository.findBySubmission(submissionId);

    // Map questions with correct answers (for review mode)
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
          correctAnswer: question.correctAnswer, // INCLUDE for review
          explanation: question.explanation, // INCLUDE for review
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

    return {
      submission: {
        ...submission.toObject(),
        answers: answers.map(a => ({
          _id: a._id,
          submissionId: a.submissionId,
          questionId: a.questionId,
          answerText: a.answerText,
          selectedOptions: a.selectedOptions,
          score: a.score,
          maxScore: a.maxScore,
          feedback: a.feedback,
          isAutoGraded: a.isAutoGraded,
          isManuallyGraded: a.isManuallyGraded,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        })),
      },
      exam: {
        ...exam.toObject(),
        questions,
        readingPassages: exam.readingPassages || [],
      },
    };
  }

  // Get or create submission for assignment
  async getOrCreateSubmission(assignmentId, studentId) {
    let submission = await ExamSubmissionRepository.findInProgressSubmission(
      assignmentId,
      studentId
    );

    if (!submission) {
      submission = await this.startExam(assignmentId, studentId);
    }

    return submission;
  }

  // NEW: Auto-save answers (batch update)
  async autoSaveAnswers(submissionId, userId, answers) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.studentId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    if (submission.status !== 'in_progress') {
      throw new Error('Submission has already been finalized');
    }

    let savedCount = 0;

    for (const answerDto of answers) {
      await this.saveAnswer(submissionId, answerDto);
      savedCount++;
    }

    // Update submission timestamp
    await ExamSubmissionRepository.update(submissionId, {
      updatedAt: new Date(),
    });

    return {
      submissionId,
      savedCount,
      lastSavedAt: new Date(),
    };
  }

  // NEW: Get submission answers
  async getSubmissionAnswers(submissionId, userId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.studentId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    const answers = await ExamAnswerRepository.findBySubmission(submissionId);

    return {
      submissionId,
      status: submission.status,
      answers: answers.map(a => ({
        _id: a._id,
        submissionId: a.submissionId,
        questionId: a.questionId,
        answerText: a.answerText,
        selectedOptions: a.selectedOptions,
        score: submission.status === 'in_progress' ? 0 : a.score,
        maxScore: a.maxScore,
        isAutoGraded: a.isAutoGraded,
        isManuallyGraded: a.isManuallyGraded,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  // NEW: Manual grading
  async manualGrade(submissionId, teacherId, grades) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    // TODO: Verify teacher has permission to grade this submission
    // For now, simplified - you can add class membership check

    let gradedCount = 0;
    let newTotalScore = submission.totalScore;

    for (const grade of grades) {
      const answer = await ExamAnswerRepository.findById(grade.answerId);
      if (!answer || answer.submissionId.toString() !== submissionId.toString()) {
        continue;
      }

      // Update score - subtract old score, add new score
      newTotalScore = newTotalScore - answer.score + grade.score;

      await ExamAnswerRepository.update(grade.answerId, {
        score: grade.score,
        feedback: grade.feedback,
        isManuallyGraded: true,
      });

      gradedCount++;
    }

    // Update submission total score and status
    await ExamSubmissionRepository.update(submissionId, {
      totalScore: parseFloat(newTotalScore.toFixed(2)),
      status: 'graded',
    });

    return {
      submissionId,
      gradedCount,
      newTotalScore: parseFloat(newTotalScore.toFixed(2)),
      maxScore: submission.maxScore,
      status: 'graded',
    };
  }

  // NEW: Get active submissions
  async getMyActiveSubmissions(studentId) {
    const submissions = await ExamSubmissionRepository.find({
      studentId,
      status: 'in_progress',
    }, {
      populate: 'examId assignmentId',
      sort: { startedAt: -1 },
    });

    return submissions.map(s => {
      const exam = s.examId;
      const assignment = s.assignmentId;

      // Calculate time remaining
      let timeRemaining = null;
      if (exam && exam.durationMinutes) {
        const elapsedSeconds = Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000);
        const totalSeconds = exam.durationMinutes * 60;
        timeRemaining = Math.max(0, totalSeconds - elapsedSeconds);
      }

      return {
        _id: s._id,
        examId: s.examId._id || s.examId,
        examTitle: exam ? exam.title : 'Unknown Exam',
        startedAt: s.startedAt,
        timeRemaining,
        assignmentId: assignment ? assignment._id : null,
        contestId: s.contestId,
      };
    });
  }
}

module.exports = new SubmissionService();
