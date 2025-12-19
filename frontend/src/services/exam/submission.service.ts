import { AnswerData, ExamSubmission } from "@/features/exam/types";
import { examService } from "./exam.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const submissionService = {
  saveAnswers: async (examId: string, answers: AnswerData[]) => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  // --- HÀM NỘP BÀI (Phiên bản Fake API: Tự chấm điểm tại Client) ---
  submitExam: async (
    examId: string,
    answers: AnswerData[],
    studentId: string = "student-01",
    contestId: string | null = null // Nhận thêm contestId
  ) => {
    try {
      // 1. "Giả lập Server": Tải toàn bộ dữ liệu cần thiết về để chấm
      const [examRes, questionsRes, examQuestionsRes] = await Promise.all([
        fetch(`${API_URL}/exams/${examId}`),
        fetch(`${API_URL}/questions`), // Lấy bảng câu hỏi gốc (chứa đáp án đúng)
        fetch(`${API_URL}/exam_questions?examId=${examId}`), // Lấy điểm số cấu hình
      ]);

      const examInfo = await examRes.json();
      const allQuestions = await questionsRes.json();
      const examQuestionsConfig = await examQuestionsRes.json();

      // 2. Logic chấm điểm (Sau này Backend sẽ làm việc này)
      let totalScore = 0;
      const gradedAnswers = answers.map((userAns) => {
        // Tìm câu hỏi gốc để lấy đáp án đúng
        const originalQ = allQuestions.find(
          (q: any) => q.id === userAns.questionId
        );
        // Tìm cấu hình điểm cho câu này trong đề
        const configQ = examQuestionsConfig.find(
          (eq: any) => eq.questionId === userAns.questionId
        );

        // Điểm tối đa của câu hỏi này
        const maxScore = configQ?.maxScore || originalQ?.points || 0.25;

        if (!originalQ)
          return { ...userAns, score: 0, feedback: "Lỗi dữ liệu" };

        // So sánh đáp án (Logic đơn giản cho trắc nghiệm)
        const correctKey = originalQ.correctAnswer;
        // User chọn (xử lý cả trường hợp mảng hoặc string)
        const userValue = Array.isArray(userAns.answer)
          ? userAns.answer[0]
          : userAns.answer;

        const isCorrect =
          String(userValue).trim().toUpperCase() ===
          String(correctKey).trim().toUpperCase();

        const earnedScore = isCorrect ? maxScore : 0;
        totalScore += earnedScore;

        return {
          questionId: userAns.questionId,
          answer: userAns.answer, // Lưu lại cái user đã chọn
          isAnswered: true,
          score: earnedScore,
          isCorrect: isCorrect, // Flag đúng sai để hiện màu
          feedback: isCorrect
            ? "Chính xác!"
            : `Sai. Đáp án đúng là: ${correctKey}`, // Feedback giả lập
        };
      });

      // 3. Tạo object Submission hoàn chỉnh (Đã có điểm)
      const newSubmission = {
        examId,
        studentId,
        contestId, // Lưu contestId nếu có
        status: "graded",
        startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Mock time
        submittedAt: new Date().toISOString(),
        totalScore: parseFloat(totalScore.toFixed(2)),
        maxScore: examInfo.totalPoints || 10,
        attemptNumber: 1,
        answers: gradedAnswers, // Mảng này đã chứa điểm và feedback từng câu
      };

      // 4. Lưu vào Json-server
      const res = await fetch(`${API_URL}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubmission),
      });

      if (!res.ok) throw new Error("Lỗi lưu bài");

      // 5. Nếu là Contest, update luôn bảng Participation (Giả lập trigger của DB)
      if (contestId) {
        // Logic update participation ở đây (fetch participation về -> cộng điểm -> PATCH lại)
        // Bạn có thể bỏ qua bước này nếu chỉ test review bài thi
      }

      return await res.json();
    } catch (error) {
      console.error("Lỗi nộp bài (Fake Service):", error);
      throw error;
    }
  },

  // --- HÀM LẤY CHI TIẾT (Để Review) ---
  getSubmissionDetails: async (submissionId: string) => {
    try {
      // 1. Lấy bài làm của user
      const subRes = await fetch(`${API_URL}/submissions/${submissionId}`, {
        cache: "no-store",
      });
      if (!subRes.ok) return null;
      const submissionData = await subRes.json();

      // 2. Lấy cấu trúc đề thi
      const examData = await examService.getExamById(submissionData.examId);
      if (!examData) return null;

      // 3. QUAN TRỌNG: Lấy lại bảng Questions gốc để "lộ" đáp án và lời giải
      // (Vì examService mặc định sẽ ẩn đáp án để bảo mật lúc làm bài)
      const questionsRes = await fetch(`${API_URL}/questions`);
      const allQuestions = await questionsRes.json();

      // 4. Ghép đáp án đúng + lời giải vào cấu trúc đề để hiển thị
      const questionsWithReviewData = examData.questions.map((q) => {
        const rawQ = allQuestions.find((item: any) => item.id === q.questionId);
        return {
          ...q,
          question: {
            ...q.question,
            // Bổ sung các trường "nhạy cảm" để Review
            correctAnswer: rawQ?.correctAnswer,
            explanation: rawQ?.explanation,
          },
        };
      });

      // 5. Trả về cấu trúc mà ReviewExamClient cần
      return {
        submission: submissionData,
        exam: examData, // Thông tin đề
        questions: questionsWithReviewData, // Danh sách câu hỏi kèm lời giải
      };
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null;
    }
  },
};
