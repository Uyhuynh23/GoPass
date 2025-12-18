// src/services/exam/exam.service.ts
import { ExamWithDetails } from "@/features/exam/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const examService = {
  getExamById: async (id: string): Promise<ExamWithDetails | null> => {
    try {
      // 1. Gọi 3 API riêng biệt để đảm bảo lấy đủ dữ liệu
      const [examRes, examQuestionsRes, allQuestionsRes] = await Promise.all([
        // Lấy thông tin đề
        fetch(`${API_URL}/exams/${id}`, { cache: "no-store" }),
        // Lấy danh sách liên kết câu hỏi (thứ tự, điểm số...)
        fetch(`${API_URL}/examquestions?examId=${id}&_sort=order&_order=asc`, {
          cache: "no-store",
        }),
        // Lấy TOÀN BỘ câu hỏi gốc (Cách an toàn nhất để tránh lỗi _expand)
        fetch(`${API_URL}/questions`, { cache: "no-store" }),
      ]);
      console.log('Fetched exam data from API',API_URL);
      console.log('Exam Response:',`${API_URL}/exams/${id}`);

      if (!examRes.ok || !examQuestionsRes.ok || !allQuestionsRes.ok) {
        console.error("Lỗi API: Không thể tải dữ liệu từ json-server");
        return null;
      }

      const examData = await examRes.json();
      const examQuestionsData = await examQuestionsRes.json();
      const allQuestionsData = await allQuestionsRes.json();

      // 2. MANUAL JOIN: Tự ghép dữ liệu bằng code JavaScript
      const mappedQuestions = examQuestionsData
        .map((eq: any) => {
          // Tìm câu hỏi gốc trong mảng allQuestionsData dựa trên questionId
          const originalQuestion = allQuestionsData.find(
            (q: any) => q.id === eq.questionId
          );

          // Nếu không tìm thấy câu hỏi gốc (dữ liệu rác), log warning và trả về null
          if (!originalQuestion) {
            console.warn(
              `Dữ liệu hỏng: Không tìm thấy questionId=${eq.questionId} trong bảng questions`
            );
            return null;
          }

          // Tách các trường nhạy cảm (Đáp án)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { correctAnswer, explanation, ...safeQuestionContent } =
            originalQuestion;

          return {
            _id: eq.id,
            examId: eq.examId,
            questionId: eq.questionId,
            order: eq.order,
            maxScore: eq.maxScore,
            section: eq.section,

            question: {
              ...safeQuestionContent,
              _id: originalQuestion.id, // Frontend dùng _id
              // Đảm bảo các trường quan trọng luôn có giá trị
              points: originalQuestion.points || eq.maxScore,
              tags: originalQuestion.tags || [],
              linkedPassageId: originalQuestion.linkedPassageId || null,
            },
          };
        })
        .filter((item: any) => item !== null); // Loại bỏ các item bị lỗi

      // 3. Trả về kết quả hoàn chỉnh
      return {
        ...examData,
        _id: examData.id,
        questions: mappedQuestions,
      };
    } catch (error) {
      console.error("Lỗi khi lấy đề thi (Service):", error);
      return null;
    }
  },
};
