// src/services/exam/submission.service.ts
import { AnswerData, ExamSubmission } from "@/features/exam/types";
import { examService } from "./exam.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const submissionService = {
  saveAnswers: async (examId: string, answers: AnswerData[]) => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  submitExam: async (
    examId: string,
    answers: AnswerData[],
    studentId: string = "student-01"
  ) => {
    try {
      // B1: Lấy dữ liệu thô để chấm điểm (Manual Join)
      const [examQuestionsRes, allQuestionsRes, examRes] = await Promise.all([
        fetch(`${API_URL}/exam_questions?examId=${examId}`),
        fetch(`${API_URL}/questions`),
        fetch(`${API_URL}/exams/${examId}`),
      ]);

      const rawExamQuestions = await examQuestionsRes.json();
      const allQuestions = await allQuestionsRes.json();
      const examInfo = await examRes.json();

      let totalScore = 0;
      const maxPoints = examInfo.totalPoints || 10;

      // B2: Chấm điểm
      const gradedAnswers = answers.map((userAns) => {
        // Tìm liên kết
        const linkRecord = rawExamQuestions.find(
          (eq: any) => eq.questionId === userAns.questionId
        );
        // Tìm câu hỏi gốc
        const questionRecord = allQuestions.find(
          (q: any) => q.id === userAns.questionId
        );

        if (!questionRecord) {
          return { ...userAns, score: 0, feedback: "Lỗi dữ liệu" };
        }

        const correctKey = questionRecord.correctAnswer;
        const maxScore = linkRecord?.maxScore || 0;

        // So sánh đáp án
        let isCorrect = false;
        const userValue = Array.isArray(userAns.answer)
          ? userAns.answer[0]
          : userAns.answer;

        if (
          String(userValue).trim().toLowerCase() ===
          String(correctKey).trim().toLowerCase()
        ) {
          isCorrect = true;
        }

        const earnedScore = isCorrect ? maxScore : 0;
        totalScore += earnedScore;

        return {
          ...userAns,
          score: earnedScore,
          feedback: isCorrect
            ? "Chính xác!"
            : `Sai. Đáp án đúng là: ${correctKey}`,
        };
      });

      // B3: Tạo Submission
      const newSubmission = {
        examId: examId,
        studentId: studentId,
        status: "graded",
        startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        submittedAt: new Date().toISOString(),
        totalScore: parseFloat(totalScore.toFixed(2)),
        maxScore: maxPoints,
        attemptNumber: 1,
        answers: gradedAnswers,
      };

      const res = await fetch(`${API_URL}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubmission),
      });

      if (!res.ok) throw new Error("Lỗi lưu bài");
      return await res.json();
    } catch (error) {
      console.error("Lỗi nộp bài:", error);
      throw error;
    }
  },

  getSubmissionDetails: async (submissionId: string) => {
    try {
      const subRes = await fetch(`${API_URL}/submissions/${submissionId}`, {
        cache: "no-store",
      });
      if (!subRes.ok) return null;
      const submissionData = await subRes.json();

      // Gọi lại examService để lấy cấu trúc đề (Service này đã sửa ở Bước 1 nên an toàn)
      const examData = await examService.getExamById(submissionData.examId);
      if (!examData) return null;

      // Tuy nhiên, examService đã XÓA đáp án. Để Review, ta cần gọi lại bảng questions để lấy đáp án.
      // Vì đây là giả lập, ta fetch lại questions một lần nữa cho chắc.
      const questionsRes = await fetch(`${API_URL}/questions`);
      const allQuestions = await questionsRes.json();

      // Ghép lại đáp án vào questions của examData
      const questionsWithAnswers = examData.questions.map((q) => {
        const rawQ = allQuestions.find((item: any) => item.id === q.questionId);
        return {
          ...q.question,
          _id: q.questionId,
          correctAnswer: rawQ?.correctAnswer, // Bổ sung lại đáp án
          explanation: rawQ?.explanation, // Bổ sung lại lời giải
        };
      });

      const submission: ExamSubmission = {
        ...submissionData,
        _id: submissionData.id,
        answers: submissionData.answers.map((ans: any) => ({
          ...ans,
          answerText: typeof ans.answer === "string" ? ans.answer : undefined,
          selectedOptions: Array.isArray(ans.answer)
            ? ans.answer
            : typeof ans.answer === "string"
            ? [ans.answer]
            : [],
        })),
      };

      return {
        submission: submission,
        exam: examData,
        questions: questionsWithAnswers,
      };
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      return null;
    }
  },
};
