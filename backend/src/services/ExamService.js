const ExamRepository = require("../repositories/ExamRepository");
const ExamQuestionRepository = require("../repositories/ExamQuestionRepository");
const ExamAssignmentRepository = require("../repositories/ExamAssignmentRepository");
const QuestionRepository = require("../repositories/QuestionRepository");
const vnSmartBotProvider = require("../providers/VnSmartBotProvider");
const { ESSAY_EXPLANATION_GENERATION_PROMPT } = require("../config/prompts");

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
      totalPoints,
    } = dto;

    const exam = await ExamRepository.create({
      title,
      description,
      subject,
      durationMinutes,
      mode: mode || "practice",
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
      throw new Error("Exam not found");
    }

    const questions = await ExamQuestionRepository.findByExam(examId, {
      populate: "questionId",
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
      throw new Error("Exam not found");
    }

    if (exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error("Unauthorized to update this exam");
    }

    const updateData = {};
    const allowedFields = [
      "title",
      "description",
      "subject",
      "durationMinutes",
      "mode",
      "shuffleQuestions",
      "showResultsImmediately",
      "readingPassages",
      "totalQuestions",
      "totalPoints",
    ];
    allowedFields.forEach((field) => {
      if (dto[field] !== undefined) updateData[field] = dto[field];
    });

    return await ExamRepository.update(examId, updateData);
  }

  // Delete exam
  async deleteExam(examId, teacherId) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    if (exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error("Unauthorized to delete this exam");
    }

    await ExamQuestionRepository.deleteByExam(examId);
    await ExamRepository.delete(examId);

    return { message: "Exam deleted successfully" };
  }

  // Add questions to exam
  async addQuestions(examId, teacherId, dtos) {
    const exam = await ExamRepository.findById(examId);
    if (!exam || exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error("Unauthorized");
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
        section: dto.section || "",
      });
      addedQuestions.push(examQuestion);
    }

    return addedQuestions;
  }

  // Remove question from exam
  async removeQuestion(examId, teacherId, examQuestionId) {
    const exam = await ExamRepository.findById(examId);
    if (!exam || exam.createdBy.toString() !== teacherId.toString()) {
      throw new Error("Unauthorized");
    }

    await ExamQuestionRepository.delete(examQuestionId);
    return { message: "Question removed successfully" };
  }

  // Assign exam to class
  async assignToClass(examId, classId, teacherId, dto) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    const {
      startTime,
      endTime,
      shuffleQuestions,
      allowLateSubmission,
      maxAttempts,
    } = dto;

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
      mode: "practice",
    });

    // Select questions based on config
    const selectedQuestions = [];

    for (const qConfig of questionCounts) {
      const filter = {
        subject,
        difficulty: qConfig.difficulty,
        type: qConfig.type,
      };

      const questions = await QuestionRepository.selectRandomQuestions(
        filter,
        qConfig.count
      );
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

  /**
   * Tạo đề thi từ forum topic (có essay prompt)
   * @param {string} forumTopicId - ID của forum topic
   * @param {string} userId - ID của user tạo đề thi
   * @param {Object} options - Tùy chọn: title, durationMinutes, etc.
   * @returns {Promise<Object>} - Exam đã tạo
   */
  async generateExamFromForumTopic(forumTopicId, userId, options = {}) {
    const ForumTopic = require("../models/ForumTopic");

    const topic = await ForumTopic.findById(forumTopicId);
    if (!topic) {
      throw new Error("Forum topic not found");
    }

    if (!topic.essayPrompt) {
      throw new Error("Forum topic does not have essay prompt");
    }

    return await this.generateExamFromEssayPrompt(topic.essayPrompt, userId, {
      title: options.title || `Đề thi thử - ${topic.title}`,
      subject: "Ngữ Văn",
      durationMinutes: options.durationMinutes || 45,
      relatedTopic: {
        topicId: topic._id,
        topicTitle: topic.title,
      },
      ...options,
    });
  }

  /**
   * Tạo đề thi từ essay prompt
   * @param {string} essayPrompt - Đề bài nghị luận
   * @param {string} userId - ID của user tạo đề thi
   * @param {Object} options - Tùy chọn
   * @returns {Promise<Object>} - Exam đã tạo
   */
  async generateExamFromEssayPrompt(essayPrompt, userId, options = {}) {
    try {
      const {
        title = "Đề thi thử Ngữ Văn",
        subject = "Ngữ Văn",
        durationMinutes = 45,
        generateExplanation = true,
        relatedTopic = null,
      } = options;

      // 1. Tạo câu hỏi (Question) từ essay prompt
      let explanation = "";

      if (generateExplanation) {
        // Gọi AI để tạo explanation
        explanation = await this._generateEssayExplanation(essayPrompt);
      }

      // Tạo Question
      const question = await QuestionRepository.create({
        type: "essay",
        content: essayPrompt,
        options: [],
        correctAnswer: null,
        explanation: explanation,
        difficulty: "hard",
        subject: subject,
        tags: ["viết", "nghị luận"],
        points: 5,
        isPublic: true,
        createdBy: userId,
      });

      // 2. Tạo Exam
      const exam = await ExamRepository.create({
        title: title,
        description: `Đề thi thử môn ${subject}. Thời gian: ${durationMinutes} phút (không kể thời gian giao đề).`,
        subject: subject,
        durationMinutes: durationMinutes,
        mode: "practice_test",
        shuffleQuestions: false,
        showResultsImmediately: false,
        isPublished: true,
        totalQuestions: 1,
        totalPoints: 5,
        readingPassages: [],
        createdBy: userId,
      });

      // 3. Tạo ExamQuestion (liên kết Exam với Question)
      await ExamQuestionRepository.create({
        examId: exam._id,
        questionId: question._id,
        order: 1,
        maxScore: 5,
        section: "Viết",
        points: 5,
      });

      // 4. Populate và return
      const populatedExam = await ExamRepository.findById(exam._id);
      const examQuestions = await ExamQuestionRepository.findByExam(exam._id, {
        populate: "questionId",
      });

      return {
        success: true,
        data: {
          exam: populatedExam,
          questions: examQuestions,
          relatedTopic: relatedTopic,
        },
      };
    } catch (error) {
      console.error("Error generating exam from essay prompt:", error);
      throw error;
    }
  }

  /**
   * Tạo explanation cho câu hỏi essay sử dụng AI
   * @private
   * @param {string} essayPrompt - Đề bài nghị luận
   * @returns {Promise<string>} - HTML explanation
   */
  async _generateEssayExplanation(essayPrompt) {
    try {
      const systemPrompt = ESSAY_EXPLANATION_GENERATION_PROMPT;

      const userMessage = `ĐỀ BÀI:
${essayPrompt}

Hãy tạo hướng dẫn giải theo đúng format HTML đã chỉ định.`;

      // Gọi VnSmartBot
      const response = await vnSmartBotProvider.sendMessage({
        sender_id: "essay_explanation_generator",
        text: userMessage,
        input_channel: "platform",
        session_id: `essay_exp_${Date.now()}`,
        settings: {
          system_prompt: systemPrompt,
          advance_prompt:
            "Bạn PHẢI trả về CHÍNH XÁC HTML hợp lệ. KHÔNG thêm bất kỳ văn bản nào khác ngoài HTML. KHÔNG sử dụng markdown formatting.",
        },
      });

      // Parse response
      let parsedResponse = response;

      // Xử lý SSE format nếu cần
      if (typeof response === "string" && response.startsWith("data:")) {
        try {
          const jsonStr = response.substring(5).trim();
          parsedResponse = JSON.parse(jsonStr);
        } catch (error) {
          console.error("Failed to parse SSE response");
        }
      }

      // Extract text từ response
      let explanationHtml = "";

      const cardData = parsedResponse?.object?.sb?.card_data;
      if (cardData && cardData.length > 0) {
        const textCard = cardData.find(
          (card) => card.type === "text" && card.text
        );
        if (textCard) {
          explanationHtml = textCard.text;
        }
      } else if (typeof parsedResponse === "string") {
        explanationHtml = parsedResponse;
      } else if (parsedResponse.text) {
        explanationHtml = parsedResponse.text;
      }

      // Clean up HTML - remove markdown if any
      explanationHtml = explanationHtml.trim();
      if (explanationHtml.startsWith("```html")) {
        explanationHtml = explanationHtml
          .replace(/```html\n?/g, "")
          .replace(/```\n?$/g, "");
      } else if (explanationHtml.startsWith("```")) {
        explanationHtml = explanationHtml
          .replace(/```\n?/g, "")
          .replace(/```\n?$/g, "");
      }

      return explanationHtml;
    } catch (error) {
      console.error("Error generating essay explanation:", error);
      // Return default explanation nếu AI fails
      return `<p><b>Phương pháp:</b></p>
<p>Vận dụng kiến thức đã học về viết bài văn nghị luận.</p>
<p>Lựa chọn được các thao tác lập luận phù hợp, kết hợp nhuần nhuyễn lí lẽ và dẫn chứng.</p>
<p><b>Cách giải:</b> Có thể triển khai theo hướng:</p>
<ol>
  <li><b>Mở bài:</b> Xác định đúng vấn đề nghị luận.</li>
  <li><b>Thân bài:</b> Phân tích nhiều khía cạnh của vấn đề, nêu ý kiến cá nhân với lí lẽ và dẫn chứng thuyết phục.</li>
  <li><b>Kết bài:</b> Khái quát vấn đề nghị luận.</li>
</ol>`;
    }
  }

  /**
   * Tạo đề thi với nhiều câu hỏi từ nhiều forum topics
   * @param {Array<string>} forumTopicIds - Danh sách forum topic IDs
   * @param {string} userId - ID của user tạo đề thi
   * @param {Object} options - Tùy chọn
   * @returns {Promise<Object>} - Exam đã tạo
   */
  async generateExamFromMultipleTopics(forumTopicIds, userId, options = {}) {
    const ForumTopic = require("../models/ForumTopic");

    if (!forumTopicIds || forumTopicIds.length === 0) {
      throw new Error("At least one forum topic ID is required");
    }

    const {
      title = "Đề thi thử Ngữ Văn",
      subject = "Ngữ Văn",
      durationMinutes = 120,
      generateExplanations = true,
    } = options;

    // 1. Lấy tất cả forum topics
    const topics = await ForumTopic.find({
      _id: { $in: forumTopicIds },
    });

    if (topics.length === 0) {
      throw new Error("No valid forum topics found");
    }

    // Filter topics có essayPrompt
    const validTopics = topics.filter((t) => t.essayPrompt);
    if (validTopics.length === 0) {
      throw new Error("No topics with essay prompts found");
    }

    // 2. Tạo câu hỏi cho mỗi topic
    const questions = [];
    for (let i = 0; i < validTopics.length; i++) {
      const topic = validTopics[i];

      let explanation = "";
      if (generateExplanations) {
        explanation = await this._generateEssayExplanation(topic.essayPrompt);
      }

      const question = await QuestionRepository.create({
        type: "essay",
        content: `Câu ${i + 1}. ${topic.essayPrompt}`,
        options: [],
        correctAnswer: null,
        explanation: explanation,
        difficulty: "hard",
        subject: subject,
        tags: ["viết", "nghị luận"],
        points: 5,
        isPublic: true,
        createdBy: userId,
      });

      questions.push(question);
    }

    // 3. Tạo Exam
    const exam = await ExamRepository.create({
      title: title,
      description: `Đề thi thử môn ${subject}. Thời gian: ${durationMinutes} phút (không kể thời gian giao đề). ${questions.length} câu hỏi tự luận.`,
      subject: subject,
      durationMinutes: durationMinutes,
      mode: "practice_global",
      shuffleQuestions: false,
      showResultsImmediately: false,
      isPublished: true,
      totalQuestions: questions.length,
      totalPoints: questions.length * 5,
      readingPassages: [],
      createdBy: userId,
    });

    // 4. Tạo ExamQuestions
    for (let i = 0; i < questions.length; i++) {
      await ExamQuestionRepository.create({
        examId: exam._id,
        questionId: questions[i]._id,
        order: i + 1,
        maxScore: 5,
        section: "Viết",
        points: 5,
      });
    }

    // 5. Return
    const populatedExam = await ExamRepository.findById(exam._id);
    const examQuestions = await ExamQuestionRepository.findByExam(exam._id, {
      populate: "questionId",
    });

    return {
      success: true,
      data: {
        exam: populatedExam,
        questions: examQuestions,
        relatedTopics: validTopics.map((t) => ({
          topicId: t._id,
          topicTitle: t.title,
        })),
      },
    };
  }
}

module.exports = new ExamService();
