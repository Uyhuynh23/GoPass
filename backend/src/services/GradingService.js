const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const ExamAnswerRepository = require('../repositories/ExamAnswerRepository');
const ManualGradingRepository = require('../repositories/ManualGradingRepository');
const AiScoringProvider = require('../providers/AiScoringProvider');
const QuestionRepository = require('../repositories/QuestionRepository');

class GradingService {
  // Auto-grade submission
  async gradeSubmissionAuto(submissionId, actorId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'submitted') {
      throw new Error('Submission must be submitted before grading');
    }

    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: 'questionId',
    });

    let totalScore = 0;
    let correctQuestionsCount = 0;

    for (const answer of answers) {
      const question = answer.questionId;
      let score = 0;
      let feedback = '';
      let isCorrect = false;

      // Grade based on question type
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        // Check if selected options match correct answers using new options structure
        const correctOptionIds = question.options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.id); // Use 'id' instead of 'text'

        isCorrect = this.arraysEqual(
          answer.selectedOptions.sort(),
          correctOptionIds.sort()
        );

        score = isCorrect ? answer.maxScore : 0;
        feedback = isCorrect ? 'Correct' : 'Incorrect';

        await ExamAnswerRepository.gradeAnswer(answer._id, score, feedback, true);

      } else if (question.type === 'short_answer') {
        // Use AI to validate short answer
        const validation = await AiScoringProvider.validateAnswer(
          answer.answerText,
          question.correctAnswer,
          'short_answer'
        );

        isCorrect = validation.isCorrect;
        score = validation.isCorrect ? answer.maxScore : 0;
        feedback = validation.isCorrect 
          ? 'Correct' 
          : `Incorrect (Similarity: ${(validation.similarity * 100).toFixed(0)}%)`;

        await ExamAnswerRepository.gradeAnswer(answer._id, score, feedback, true);

      } else if (question.type === 'essay') {
        // Use AI scoring for essays
        const aiResult = await AiScoringProvider.scoreEssayAnswer(
          answer.answerText,
          question.content,
          {
            maxScore: answer.maxScore,
            subject: question.subject,
            difficulty: question.difficulty,
          }
        );

        score = aiResult.score;
        feedback = aiResult.feedback;
        // Consider essay correct if score >= 70% of maxScore
        isCorrect = score >= (answer.maxScore * 0.7);

        await ExamAnswerRepository.gradeAnswer(answer._id, score, feedback, true);
      }

      totalScore += score;
      if (isCorrect) correctQuestionsCount++;
    }

    // Update submission with total score, correctQuestionsCount and graded status
    await ExamSubmissionRepository.update(submissionId, {
      totalScore,
      correctQuestionsCount,
      status: 'graded',
    });

    return { totalScore, correctQuestionsCount, message: 'Submission graded successfully' };
  }

  // Manual grade answer
  async gradeAnswerManual(answerId, graderId, dto) {
    const { score, comment } = dto;

    const answer = await ExamAnswerRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    // Check if score is within max score
    if (score > answer.maxScore) {
      throw new Error(`Score cannot exceed ${answer.maxScore}`);
    }

    // Create or update manual grading
    const manualGrading = await ManualGradingRepository.createOrUpdate(
      answerId,
      graderId,
      score,
      comment
    );

    // Update answer with manual grade
    await ExamAnswerRepository.gradeAnswer(answerId, score, comment, false);

    // Recalculate submission score
    await this.recalculateSubmissionScore(answer.submissionId);

    return manualGrading;
  }

  // Get grading detail
  async getGradingDetail(submissionId, userId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: 'questionId',
    });

    const gradingDetails = [];

    for (const answer of answers) {
      const manualGrading = await ManualGradingRepository.findByAnswer(answer._id);

      gradingDetails.push({
        answer: answer,
        manualGrading: manualGrading,
      });
    }

    return {
      submission,
      gradingDetails,
    };
  }

  // Request AI suggestion for an answer
  async requestAiSuggestion(answerId, graderId) {
    const answer = await ExamAnswerRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    const question = await QuestionRepository.findById(answer.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const aiResult = await AiScoringProvider.scoreEssayAnswer(
      answer.answerText,
      question.content,
      {
        maxScore: answer.maxScore,
        subject: question.subject,
        difficulty: question.difficulty,
      }
    );

    return {
      suggestedScore: aiResult.score,
      feedback: aiResult.feedback,
      suggestions: aiResult.suggestions,
      confidence: aiResult.confidence,
    };
  }

  // Recalculate submission total score
  async recalculateSubmissionScore(submissionId) {
    const answers = await ExamAnswerRepository.findBySubmission(submissionId);
    
    const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
    
    await ExamSubmissionRepository.gradeSubmission(submissionId, totalScore);

    return totalScore;
  }

  // Helper: Compare arrays
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
}

module.exports = new GradingService();
