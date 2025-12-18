const QuestionRepository = require('../repositories/QuestionRepository');

class QuestionBankService {
  // Create question
  async createQuestion(teacherId, dto) {
    const { 
      type, 
      content, 
      options, 
      correctAnswer, 
      explanation,
      linkedPassageId,
      image,
      tableData,
      difficulty, 
      subject, 
      tags, 
      points, 
      isPublic 
    } = dto;

    const question = await QuestionRepository.create({
      type,
      content,
      options,
      correctAnswer,
      explanation,
      linkedPassageId,
      image,
      tableData,
      difficulty: difficulty || 'medium',
      subject,
      tags: tags || [],
      points: points || 1,
      createdBy: teacherId,
      isPublic: isPublic || false,
    });

    return question;
  }

  // Get question detail
  async getQuestionDetail(questionId) {
    const question = await QuestionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  }

  // Update question
  async updateQuestion(questionId, teacherId, dto) {
    const question = await QuestionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    if (question.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to update this question');
    }

    const allowedFields = [
      'type', 
      'content', 
      'options', 
      'correctAnswer', 
      'explanation',
      'linkedPassageId',
      'image',
      'tableData',
      'difficulty', 
      'subject', 
      'tags', 
      'points', 
      'isPublic'
    ];
    const updateData = {};
    allowedFields.forEach(field => {
      if (dto[field] !== undefined) updateData[field] = dto[field];
    });

    return await QuestionRepository.update(questionId, updateData);
  }

  // Delete question
  async deleteQuestion(questionId, teacherId) {
    const question = await QuestionRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    if (question.createdBy.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to delete this question');
    }

    await QuestionRepository.delete(questionId);
    return { message: 'Question deleted successfully' };
  }

  // Search questions
  async searchQuestions(filter) {
    const { subject, difficulty, tags, type, createdBy, keyword, page = 1, limit = 20 } = filter;

    const searchFilter = {};
    if (subject) searchFilter.subject = subject;
    if (difficulty) searchFilter.difficulty = difficulty;
    if (type) searchFilter.type = type;
    if (createdBy) searchFilter.createdBy = createdBy;
    if (tags && tags.length > 0) searchFilter.tags = { $in: tags };

    let questions;
    if (keyword) {
      questions = await QuestionRepository.searchQuestions({ ...searchFilter, keyword });
    } else {
      questions = await QuestionRepository.find(searchFilter, {
        skip: (page - 1) * limit,
        limit,
        sort: { createdAt: -1 },
      });
    }

    const total = await QuestionRepository.count(searchFilter);

    return {
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Select questions for exam
  async selectQuestions(config) {
    const { subject, difficulty, type, count } = config;

    const filter = {};
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const questions = await QuestionRepository.selectRandomQuestions(filter, count);

    return questions;
  }
}

module.exports = new QuestionBankService();
