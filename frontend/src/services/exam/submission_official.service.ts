import { AnswerData, ExamSubmission } from "@/features/exam/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const submissionService = {
  // Hàm này chỉ lưu tạm (nháp) nếu cần
  saveAnswers: async (examId: string, answers: AnswerData[]) => {
    // Gọi API save draft (nếu có backend hỗ trợ)
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  // ✅ HÀM NỘP BÀI CHUẨN: Chỉ gửi answers, KHÔNG tính toán
  submitExam: async (
    examId: string,
    answers: AnswerData[],
    studentId: string = "student-01",
    contestId: string | null = null
  ) => {
    try {
      // Chuẩn bị payload đơn giản để gửi về server
      const payload = {
        examId,
        studentId,
        contestId, // Gửi kèm nếu là bài thi trong Contest
        answers: answers.map((a) => ({
          questionId: a.questionId,
          // Chuẩn hóa dữ liệu answer trước khi gửi (đảm bảo đúng format backend cần)
          selectedOptions: Array.isArray(a.answer)
            ? a.answer
            : [a.answer].filter(Boolean),
          answerText: typeof a.answer === "string" ? a.answer : undefined,
        })),
        startedAt:
          localStorage.getItem(`exam_start_${examId}`) ||
          new Date().toISOString(),
      };

      // Gửi POST request về Server
      const res = await fetch(`${API_URL}/submissions/submit`, {
        // Endpoint riêng để xử lý chấm điểm
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      // Server sẽ trả về object ExamSubmission đã có điểm và feedback
      const result = await res.json();
      return result;
    } catch (error) {
      console.error("Lỗi nộp bài:", error);
      throw error;
    }
  },

  getSubmissionDetails: async (submissionId: string) => {
    // Hàm này giữ nguyên, chỉ gọi GET để xem lại kết quả
    try {
      const res = await fetch(`${API_URL}/submissions/${submissionId}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null;
    }
  },
};
