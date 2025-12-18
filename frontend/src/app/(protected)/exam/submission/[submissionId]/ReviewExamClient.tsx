"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  QuestionSidebar,
  QuestionCard,
  ReadingPassagePanel,
  QuestionNavigationButtons,
} from "@/features/exam/components/shared";
import { QuestionStatus } from "@/features/exam/components/shared/QuestionSidebar";
import { useExamUI } from "@/features/exam/context/useExamUI";
import { ExamProvider, useExam } from "@/features/exam/context/ExamContext";
import {
  ExamWithDetails,
  ExamSubmission,
  ExamAnswer,
  AnswerData,
} from "@/features/exam/types";

// --- INNER COMPONENT ---
const ReviewContent = ({ submission }: { submission: ExamSubmission }) => {
  const router = useRouter();

  const {
    exam,
    currentQuestion,
    examState,
    goToQuestion,
    setExamState,
    goToNextQuestion,
    goToPreviousQuestion,
  } = useExam();

  // useExamUI sẽ tự động kiểm tra linkedPassageId để quyết định hiển thị Layout nào
  const { uiLayout, navStatus, sectionsData } = useExamUI();

  // 1. Hydrate State
  useEffect(() => {
    if (submission && submission.answers) {
      const answersMap = new Map<string, AnswerData>();
      submission.answers.forEach((ans: ExamAnswer) => {
        answersMap.set(ans.questionId, {
          questionId: ans.questionId,
          answer: ans.answerText || ans.selectedOptions || "",
          isAnswered: true,
          lastModified: new Date(ans.createdAt || Date.now()),
          score: ans.score,
          feedback: ans.feedback,
        });
      });
      setExamState({ answers: answersMap });
    }
  }, [submission, setExamState]);

  // 2. Sidebar Data Logic
  const sidebarSections: Record<string, QuestionStatus[]> = useMemo(() => {
    const questions = exam.questions || [];
    const mappedQuestions = questions.map((q: any, index: number) => {
      const qId = q.questionId || q._id;
      const answerData = examState.answers.get(qId);

      const maxScore = q.maxScore || q.question?.maxScore || 1;
      const userScore = answerData?.score ?? 0;
      const isAnswered = !!(
        answerData?.answer ||
        (Array.isArray(answerData?.answer) && answerData.answer.length > 0)
      );

      // Logic tính đúng sai (chấp nhận sai số nhỏ do float)
      const isCorrect = isAnswered && Math.abs(userScore - maxScore) < 0.0001;

      return {
        questionId: qId,
        order: q.order ?? index + 1,
        isAnswered: isAnswered,
        isFlagged: false,
        isActive: currentQuestion?.questionId === qId,
        isCorrect: isCorrect,
        score: userScore,
      };
    });

    // Nếu sectionsData (từ useExamUI) có dữ liệu -> Dùng logic chia phần của UI
    if (sectionsData && Object.keys(sectionsData).length > 0) {
      const result: Record<string, QuestionStatus[]> = {};
      Object.keys(sectionsData).forEach((sectionKey) => {
        // Lọc lấy các câu hỏi thuộc section này từ list đã map
        // Đây là logic map đơn giản, thực tế cần so sánh ID
        const sectionQuestionIds = sectionsData[sectionKey].map(
          (q: any) => q.questionId || q._id
        );
        result[sectionKey] = mappedQuestions.filter((mq) =>
          sectionQuestionIds.includes(mq.questionId)
        );
      });
      return result;
    }

    // Fallback nếu không có section data
    return { "DANH SÁCH": mappedQuestions };
  }, [exam.questions, examState.answers, currentQuestion, sectionsData]);

  // 3. Guards
  if (!currentQuestion || !uiLayout) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 bg-[#F8F9FA]">
        <p>Đang tải bài thi...</p>
      </div>
    );
  }

  const userAnswerData = submission.answers.find(
    (a) => a.questionId === currentQuestion.questionId
  );
  const questionDetail = currentQuestion.question;

  // 4. Main Content Component
  const mainContent = (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full pb-8">
          <QuestionCard
            question={questionDetail!}
            questionNumber={examState.currentQuestionIndex + 1}
            sectionName={currentQuestion.section || "Phần thi"}
            points={currentQuestion.maxScore || 1}
            isReviewMode={true}
            selectedAnswer={
              userAnswerData?.answerText || userAnswerData?.selectedOptions
            }
            userScore={userAnswerData?.score}
            maxScore={currentQuestion.maxScore}
            correctAnswer={questionDetail?.correctAnswer}
            feedback={userAnswerData?.feedback}
            explanation={questionDetail?.explanation}
            onAnswerChange={() => {}}
            onToggleFlag={() => {}}
            isFlagged={false}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 z-20">
        <div className="max-w-5xl mx-auto w-full">
          <QuestionNavigationButtons
            currentQuestionIndex={examState.currentQuestionIndex}
            totalQuestions={exam.questions.length}
            isLastInSection={navStatus.isLastInSection}
            isLastQuestion={navStatus.isLastQuestion}
            onPrevious={goToPreviousQuestion}
            onNext={goToNextQuestion}
            onNextSection={goToNextQuestion}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      {/* HEADER code giữ nguyên... */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 w-full z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-[#00747F] font-medium flex gap-1"
          >
            Quay lại
          </button>
          <h1 className="font-bold text-lg text-slate-800 line-clamp-1">
            {exam.title}
          </h1>
        </div>
      </div>

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 h-full bg-white border-r border-gray-200 hidden lg:block">
          <QuestionSidebar
            sections={sidebarSections}
            onQuestionClick={(qId) => {
              const idx = exam.questions.findIndex(
                (q) => (q.questionId || q._id) === qId
              );
              if (idx !== -1) goToQuestion(idx);
            }}
            isReviewMode={true}
          />
        </div>

        {/* MAIN AREA - Logic Split View */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative">
          {uiLayout.isSplitView ? (
            <div className="flex-1 flex overflow-hidden">
              {/* CỘT TRÁI: READING PASSAGE */}
              <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto p-0 hidden md:block custom-scrollbar">
                <ReadingPassagePanel
                  title={uiLayout.passage?.title || "Văn bản đọc hiểu"}
                  content={uiLayout.passage?.content || ""}
                  audioUrl={uiLayout.passage?.audioUrl}
                />
              </div>
              {/* CỘT PHẢI: CÂU HỎI */}
              <div className="w-full md:w-1/2 overflow-hidden border-l border-gray-100">
                {mainContent}
              </div>
            </div>
          ) : (
            // SINGLE VIEW
            <div className="flex-1 overflow-hidden">{mainContent}</div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- MAIN WRAPPER (FIX LOGIC MAPPING) ---
export default function ReviewExamClient({
  data,
}: {
  data: {
    submission: ExamSubmission;
    exam: any;
    questions: any[];
  };
}) {
  // ✅ FIX: Chuẩn bị dữ liệu initialExam cẩn thận để giữ linkedPassageId
  const initialExam: ExamWithDetails = {
    ...data.exam, // 1. Giữ lại toàn bộ field gốc của exam (bao gồm readingPassages)

    questions: data.exam.questions.map((examQ: any) => {
      // Tìm chi tiết câu hỏi từ mảng questions data
      const detail = data.questions.find(
        (q: any) => q._id === examQ.questionId
      );

      // Merge dữ liệu
      return {
        ...examQ, // Giữ structure (order, maxScore, linkedPassageId ở level này nếu có)

        // Merge detail vào, nhưng ưu tiên giữ linkedPassageId nếu examQ đã có
        ...detail,

        // Đảm bảo linkedPassageId không bị mất. Nó có thể nằm ở:
        // 1. examQ (cấu trúc đề)
        // 2. detail (object câu hỏi gốc)
        // 3. detail.question (nếu lồng nhau)
        linkedPassageId:
          examQ.linkedPassageId ||
          detail?.linkedPassageId ||
          detail?.question?.linkedPassageId,

        question: detail || examQ.question, // Nội dung câu hỏi
        questionId: examQ.questionId, // ID chuẩn
        examId: data.exam._id,
      };
    }),

    userSubmission: data.submission,
  };

  return (
    <ExamProvider initialExam={initialExam} isReviewMode={true}>
      <ReviewContent submission={data.submission} />
    </ExamProvider>
  );
}
