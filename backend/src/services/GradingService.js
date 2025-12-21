const ExamSubmissionRepository = require("../repositories/ExamSubmissionRepository");
const ExamAnswerRepository = require("../repositories/ExamAnswerRepository");
const ManualGradingRepository = require("../repositories/ManualGradingRepository");
const AiScoringProvider = require("../providers/AiScoringProvider");
const QuestionRepository = require("../repositories/QuestionRepository");
const vnSmartBotProvider = require("../providers/VnSmartBotProvider");
const ExamRepository = require("../repositories/ExamRepository");

class GradingService {
  /**
   * Get all submissions for grading with filters
   */
  async getAllSubmissions(filters = {}) {
    const query = {};

    // Filter by status
    if (filters.status) {
      query.status = filters.status;
    }

    // Get all submissions
    const submissions = await ExamSubmissionRepository.find(query, {
      populate: [
        { path: 'studentUserId', select: 'name email' },
        { path: 'examId', select: 'title subject' },
      ],
      sort: { submittedAt: -1 },
    });

    // Filter by subject if needed (from exam)
    let filtered = submissions;
    if (filters.subject) {
      filtered = submissions.filter(
        (s) => s.examId && s.examId.subject === filters.subject
      );
    }

    return filtered;
  }

  /**
   * Get submission detail with all answers
   */
  async getSubmissionDetailWithAnswers(submissionId) {
    const submission = await ExamSubmissionRepository.findById(submissionId, {
      populate: [
        { path: 'studentUserId', select: 'name email' },
        { path: 'examId', select: 'title subject' },
      ],
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Get all answers with question details
    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: {
        path: 'questionId',
        select: 'content type explanation options maxScore',
      },
    });

    return {
      ...submission.toObject(),
      answers,
    };
  }

  // Auto-grade submission
  async gradeSubmissionAuto(submissionId, actorId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    if (submission.status !== "submitted") {
      throw new Error("Submission must be submitted before grading");
    }

    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: "questionId",
    });

    let totalScore = 0;
    let correctQuestionsCount = 0;

    for (const answer of answers) {
      const question = answer.questionId;
      let score = 0;
      let feedback = "";
      let isCorrect = false;

      // Grade based on question type
      if (
        question.type === "multiple_choice" ||
        question.type === "true_false"
      ) {
        // Check if selected options match correct answers using new options structure
        const correctOptionIds = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id); // Use 'id' instead of 'text'

        isCorrect = this.arraysEqual(
          answer.selectedOptions.sort(),
          correctOptionIds.sort()
        );

        score = isCorrect ? answer.maxScore : 0;
        feedback = isCorrect ? "Correct" : "Incorrect";

        await ExamAnswerRepository.gradeAnswer(
          answer._id,
          score,
          feedback,
          true
        );
      } else if (question.type === "short_answer") {
        // Use AI to validate short answer
        const validation = await AiScoringProvider.validateAnswer(
          answer.answerText,
          question.correctAnswer,
          "short_answer"
        );

        isCorrect = validation.isCorrect;
        score = validation.isCorrect ? answer.maxScore : 0;
        feedback = validation.isCorrect
          ? "Correct"
          : `Incorrect (Similarity: ${(validation.similarity * 100).toFixed(
              0
            )}%)`;

        await ExamAnswerRepository.gradeAnswer(
          answer._id,
          score,
          feedback,
          true
        );
      } else if (question.type === "essay") {
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
        isCorrect = score >= answer.maxScore * 0.7;

        await ExamAnswerRepository.gradeAnswer(
          answer._id,
          score,
          feedback,
          true
        );
      }

      totalScore += score;
      if (isCorrect) correctQuestionsCount++;
    }

    // Update submission with total score, correctQuestionsCount and graded status
    await ExamSubmissionRepository.update(submissionId, {
      totalScore,
      correctQuestionsCount,
      status: "graded",
    });

    return {
      totalScore,
      correctQuestionsCount,
      message: "Submission graded successfully",
    };
  }

  // Manual grade answer
  async gradeAnswerManual(answerId, graderId, dto) {
    const { score, comment } = dto;

    const answer = await ExamAnswerRepository.findById(answerId);
    if (!answer) {
      throw new Error("Answer not found");
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
      throw new Error("Submission not found");
    }

    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: "questionId",
    });

    const gradingDetails = [];

    for (const answer of answers) {
      const manualGrading = await ManualGradingRepository.findByAnswer(
        answer._id
      );

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
      throw new Error("Answer not found");
    }

    const question = await QuestionRepository.findById(answer.questionId);
    if (!question) {
      throw new Error("Question not found");
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

    const totalScore = answers.reduce(
      (sum, answer) => sum + (answer.score || 0),
      0
    );

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

  /**
   * Auto-grade Ngữ Văn submission using SmartBot
   * @param {string} submissionId - ID của submission
   * @returns {Promise<Object>} Grading results
   */
  async autoGradeNguVan(submissionId) {
    console.log(
      "🎯 [GradingService] Starting Ngữ Văn auto-grading for:",
      submissionId
    );

    try {
      // 1. Lấy submission info
      const submission = await ExamSubmissionRepository.findById(submissionId, {
        populate: "examId",
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      // 2. Kiểm tra subject
      const exam = submission.examId;
      if (!exam || exam.subject !== "Ngữ Văn") {
        console.log("⏭️  Not Ngữ Văn subject, skipping auto-grading");
        return { success: false, message: "Not Ngữ Văn subject" };
      }

      console.log("✅ Subject confirmed: Ngữ Văn");

      // 3. Lấy tất cả examAnswers của submission này
      const examAnswers = await ExamAnswerRepository.findBySubmission(
        submissionId,
        {
          populate: "questionId",
        }
      );

      if (!examAnswers || examAnswers.length === 0) {
        throw new Error("No exam answers found for this submission");
      }

      console.log(`📝 Found ${examAnswers.length} answers to grade`);

      // 4. Lọc các câu cần chấm (có answerText và chưa chấm)
      const answersToGrade = examAnswers.filter((answer) => {
        return (
          answer.answerText &&
          answer.answerText.trim().length > 0 &&
          !answer.isAutoGraded &&
          !answer.isManuallyGraded
        );
      });

      if (answersToGrade.length === 0) {
        console.log("⏭️  No answers need grading");
        return {
          success: true,
          message: "No answers need grading",
          gradedCount: 0,
        };
      }

      console.log(`🎯 Need to grade ${answersToGrade.length} answers`);

      // 5. Chuẩn bị payload cho chatbot
      const items = answersToGrade.map((answer) => ({
        examAnswerId: answer._id.toString(),
        questionId: answer.questionId._id.toString(),
        maxScore: answer.maxScore || 1,
        explanation: answer.questionId.explanation || "",
        answerText: answer.answerText,
      }));

      // 6. Gọi chatbot để chấm
      console.log("🤖 Calling SmartBot for grading...");
      const gradingResults = await this._callSmartBotGrading({
        metadata: {
          submissionId: submissionId.toString(),
          subject: "Ngữ Văn",
        },
        items,
      });

      console.log("✅ Received grading results");

      // 7. Cập nhật kết quả vào DB
      let gradedCount = 0;
      let totalScore = 0;

      for (const result of gradingResults.results) {
        try {
          await ExamAnswerRepository.update(result.examAnswerId, {
            score: result.score,
            isAutoGraded: true,
            feedback: result.comment,
            gradedAt: new Date(),
          });

          totalScore += result.score;
          gradedCount++;

          console.log(
            `✅ Graded answer ${result.examAnswerId}: ${result.score}/${result.maxScore}`
          );
        } catch (error) {
          console.error(
            `❌ Error updating answer ${result.examAnswerId}:`,
            error.message
          );
        }
      }

      // 8. Cập nhật tổng điểm submission
      await ExamSubmissionRepository.update(submissionId, {
        totalScore,
        gradedAt: new Date(),
      });

      console.log(`🎉 Auto-grading completed: ${gradedCount} answers graded`);

      return {
        success: true,
        gradedCount,
        totalScore,
        results: gradingResults.results,
      };
    } catch (error) {
      console.error("❌ [GradingService] Error:", error.message);
      console.error("Stack:", error.stack);
      throw error;
    }
  }

  /**
   * Gọi SmartBot API để chấm bài
   * @private
   */
async _callSmartBotGrading(payload) {
    const prompt = this._buildGradingPrompt(payload);
    const cleanedPrompt = prompt.trim();
    console.log('🤖 [Grading] Using grading bot ID:', vnSmartBotProvider.gradingBotId);

    const response = await vnSmartBotProvider.sendMessage({
      sender_id: "grading_system",
      text: cleanedPrompt,
      input_channel: "platform",
      session_id: `grading_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      metadata: payload.metadata,
      bot_id: vnSmartBotProvider.gradingBotId, // Sử dụng bot riêng cho chấm điểm
    });

    // Parse response từ SmartBot
    let parsedResponse = response;

    // Xử lý SSE format nếu cần
    if (typeof response === "string" && response.startsWith("data:")) {
      try {
        const jsonStr = response.substring(5).trim();
        parsedResponse = JSON.parse(jsonStr);
      } catch (error) {
        throw new Error("Failed to parse SSE response from SmartBot");
      }
    }

    // Extract text từ response
    const cardData = parsedResponse?.object?.sb?.card_data;
    if (!cardData || cardData.length === 0) {
      throw new Error("No card_data in SmartBot response");
    }

    const textCard = cardData.find((card) => card.type === "text" && card.text);
    if (!textCard) {
      throw new Error("No text card in SmartBot response");
    }

    const aiText = textCard.text;

    console.log("🤖 [AI Grading Response]:");
    console.log("=".repeat(80));
    console.log(aiText);
    console.log("=".repeat(80));

    // Parse JSON response
    let gradingResults;
    try {
      let cleanedText = aiText.trim();

      // Remove any leading/trailing text before/after JSON
      // Try to find JSON object boundaries
      const jsonMatch = cleanedText.match(/\{[\s\S]*"results"[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      } else {
        // Extract JSON from markdown code block
        const jsonBlockMatch = cleanedText.match(/```json\s*\n([\s\S]*?)\n```/);
        if (jsonBlockMatch) {
          cleanedText = jsonBlockMatch[1].trim();
        } else if (cleanedText.includes("{") && cleanedText.includes("}")) {
          const firstBrace = cleanedText.indexOf("{");
          const lastBrace = cleanedText.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
          }
        }
      }

      console.log("🧹 [Cleaned JSON Text]:");
      console.log(cleanedText);
      console.log("=".repeat(80));

      gradingResults = JSON.parse(cleanedText);
      
      console.log("📋 [Parsed Results]:");
      console.log(JSON.stringify(gradingResults, null, 2));
      console.log("=".repeat(80));
    } catch (parseError) {
      console.error("❌ Error parsing grading response:", parseError.message);
      console.error("Full response:", aiText);
      throw new Error(
        `Failed to parse grading response: ${parseError.message}`
      );
    }

    // Validate response structure
    if (!gradingResults.results || !Array.isArray(gradingResults.results)) {
      console.error("❌ Invalid response structure:", JSON.stringify(gradingResults, null, 2));
      throw new Error("Invalid grading response structure - missing or invalid 'results' array");
    }

    if (gradingResults.results.length === 0) {
      console.warn("⚠️ Grading results array is empty");
    }

    console.log(`✅ Parsed ${gradingResults.results.length} grading results successfully`);

    return gradingResults;
  }

  /**
   * Xây dựng prompt cho chatbot
   * @private
   */
  _buildGradingPrompt(payload) {
    const itemsText = payload.items
      .map(
        (item, index) => `
=== CÂU ${index + 1} ===
examAnswerId: ${item.examAnswerId}
questionId: ${item.questionId}
maxScore: ${item.maxScore}

[EXPLANATION - Đáp án tham khảo]
${item.explanation}

[ANSWER TEXT - Bài làm của học sinh]
${item.answerText}
`
      )
      .join("\n");

    return `
Bạn là giám khảo chấm bài **Ngữ Văn THPT Việt Nam**.

NHIỆM VỤ:
Đọc EXPLANATION (giải thích/đáp án tham khảo) và ANSWER TEXT (bài làm của học sinh) dưới đây, sau đó chấm điểm theo các quy tắc sau:

YÊU CẦU CHẤM:
1. Nhận xét chi tiết về ưu điểm và nhược điểm của bài làm
2. Đưa ra ý nào thiếu sót so với explanation
3. Với những ý diễn đạt chưa trọn vẹn, thì bổ sung, làm rõ, và diễn đạt lại sao cho hay hơn
4. Đưa ra các lỗi về ngữ pháp, chính tả (nếu có)
5. Đưa ra lời khuyên để cải thiện bài làm
6. Chỉ chấm theo explanation + answerText
7. CHỈ dùng thang điểm làm tròn: ví dụ (5.75, 6.5, 9, 7,25,...)
8. Điểm cuối = min(điểm_sơ_bộ, maxScore)
9. Trả về JSON hợp lệ, KHÔNG kèm văn bản khác

OUTPUT FORMAT (BẮT BUỘC):
CHỈ TRẢ VỀ JSON OBJECT - KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO KHÁC!

{
  "results": [
    {
      "examAnswerId": "string",
      "questionId": "string",
      "roundedFrom": 0.75,
      "score": 0.5,
      "maxScore": 0.5,
      "comment": "Nhận xét chi tiết...",
      "warnings": []
    }
  ]
}

RÀNG BUỘC:
- Response BẮT ĐẦU bằng { và KẾT THÚC bằng }
- Không có markdown, không có code block
- Không có lời giải thích trước/sau JSON
- score phải làm tròn
- score <= maxScore

==================================================
DỮ LIỆU CẦN CHẤM:
==================================================
${itemsText}

Hãy chấm điểm và trả về JSON theo đúng format trên.
`;
  }
}

module.exports = new GradingService();
