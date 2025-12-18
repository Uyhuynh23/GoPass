"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamProvider, useExam } from "@/features/exam/context/ExamContext";
import { useExamUI } from "@/features/exam/context/useExamUI";
import {
  ExamHeader,
  QuestionSidebar,
  QuestionCard,
  ReadingPassagePanel,
  QuestionNavigationButtons,
} from "@/features/exam/components/shared";
import {
  ExitExamDialog,
  SubmitConfirmationDialog,
  SubmitSuccessDialog,
} from "@/features/exam/components/exam-instructions";
import { formatTimeRemaining, formatSubmissionTime } from "@/utils/date-time";
import { ExamWithDetails } from "@/features/exam/types";
import { updateExamStatus } from "@/utils/contest-storage";
import { examStorage } from "@/utils/exam-storage";
import confetti from "canvas-confetti";
import { getContestProgress } from "@/utils/contest-storage";

// ==========================================
// 1. CUSTOM HOOKS (Tách biệt Logic)
// ==========================================

/** Hook: Xử lý điều hướng và cập nhật trạng thái Contest ban đầu */
const useExamNavigation = (examId: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const contestId = searchParams.get("contestId");

  // Đánh dấu trạng thái 'ongoing' ngay khi vào bài (nếu là contest)
  useEffect(() => {
    if (contestId && examId) {
      updateExamStatus(contestId, examId, "ongoing");
    }
  }, [contestId, examId]);

  const handleNavigateBack = useCallback(() => {
    if (returnUrl) {
      router.push(decodeURIComponent(returnUrl));
    } else {
      router.push(contestId ? `/contest/${contestId}/hub` : `/exam/${examId}`);
    }
  }, [returnUrl, router, contestId, examId]);

  const handleNavigateDashboard = useCallback(() => {
    if (returnUrl) {
      router.push(decodeURIComponent(returnUrl));
    } else {
      router.push("/dashboard");
    }
  }, [returnUrl, router]);

  return { contestId, handleNavigateBack, handleNavigateDashboard };
};

/** Hook: Xử lý logic nộp bài (Gọi API + Dọn dẹp Storage) */
const useExamSubmission = (
  examId: string,
  contestId: string | null,
  submitExamCtx: () => Promise<void>
) => {
  const [dialogs, setDialogs] = useState({
    submit: false,
    exit: false,
    success: false,
    contestCompleted: false,
  });

  const handleFinishExam = useCallback(async () => {
    // 1. Submit dữ liệu (Context logic)
    await submitExamCtx();
    let isLastExam = false;
    // 2. Xử lý Side-effects của Contest (Local Cleanup)
    if (contestId && examId) {
      // Đánh dấu hoàn thành để Hub hiển thị đúng
      updateExamStatus(contestId, examId, "completed");
      // XÓA STORAGE: Để lần sau vào không bị resume bài cũ
      examStorage.clear(examId);
      // Kiểm tra nếu đây là exam cuối cùng trong contest
      const progress = getContestProgress(contestId);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });

      isLastExam = true;
    }

    // 3. Hiển thị Dialog thành công
    setDialogs((prev) => ({
      ...prev,
      submit: false,
      success: true,
      contestCompleted: isLastExam,
    }));
  }, [contestId, examId, submitExamCtx]);

  return { dialogs, setDialogs, handleFinishExam };
};

/** Hook: Tự động nộp bài khi hết giờ & Reset bài thi bỏ dở */
const useAutoSubmit = (
  examId: string,
  timeRemaining: number,
  isSuccessDialogOpen: boolean,
  onAutoSubmit: () => void
) => {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Logic chạy 1 lần duy nhất khi mount
    if (isFirstLoad.current) {
      isFirstLoad.current = false;

      // ✅ RESET BÀI CŨ: Nếu vừa vào đã thấy hết giờ -> User đã bỏ dở từ lâu
      if (timeRemaining <= 0) {
        console.log("🚫 Phát hiện bài thi cũ quá hạn -> Reset session");
        examStorage.clear(examId);
        window.location.reload(); // Reload để Context khởi tạo lại bài mới
        return;
      }
    }

    // Logic chạy liên tục: Nếu đang làm (active) mà hết giờ -> Auto submit
    if (timeRemaining <= 0 && !isSuccessDialogOpen) {
      console.log("⏳ Hết giờ khi đang online -> Auto Submit");
      onAutoSubmit();
    }
  }, [timeRemaining, isSuccessDialogOpen, onAutoSubmit, examId]);
};

// ==========================================
// 2. SUB-COMPONENTS (Tách biệt UI)
// ==========================================

const MainQuestionArea = () => {
  // Lấy data từ context
  const {
    exam,
    currentQuestion,
    examState,
    updateAnswer,
    toggleFlag,
    goToNextQuestion,
    goToPreviousQuestion,
  } = useExam();
  const { navStatus } = useExamUI();

  // 🔴 FIX LỖI CURRENT QUESTION: Thêm guard clause
  if (!exam || !currentQuestion) return null;

  const handleAnswerChange = (
    answer: string | string[] | Record<string, string>
  ) => {
    const finalAnswer =
      typeof answer === "string" || Array.isArray(answer)
        ? answer
        : JSON.stringify(answer);
    updateAnswer(currentQuestion.questionId, {
      questionId: currentQuestion.questionId,
      answer: finalAnswer,
      isAnswered: true,
      lastModified: new Date(),
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full pb-8">
          <QuestionCard
            question={currentQuestion.question!}
            questionNumber={examState.currentQuestionIndex + 1}
            sectionName={currentQuestion.section || "Phần I"}
            points={
              currentQuestion.maxScore || currentQuestion.question?.points || 1
            }
            selectedAnswer={
              examState.answers.get(currentQuestion.questionId)?.answer
            }
            onAnswerChange={handleAnswerChange}
            isFlagged={examState.flaggedQuestions.has(
              currentQuestion.questionId
            )}
            onToggleFlag={() => toggleFlag(currentQuestion.questionId)}
          />
        </div>
      </div>
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
};

// ==========================================
// 3. MAIN COMPONENT (Kết nối mọi thứ)
// ==========================================

const ExamInterface = () => {
  const {
    exam,
    currentQuestion,
    examState,
    submitExam,
    timeRemaining,
    goToQuestion,
  } = useExam();
  const { uiLayout, sectionsData, stats } = useExamUI();

  // 1. Kết nối Navigation Hook
  const { contestId, handleNavigateBack, handleNavigateDashboard } =
    useExamNavigation(exam?._id || "");

  // 2. Kết nối Submission Hook
  const { dialogs, setDialogs, handleFinishExam } = useExamSubmission(
    exam?._id || "",
    contestId,
    submitExam
  );

  // 3. Kết nối Auto-Submit Hook
  useAutoSubmit(
    exam?._id || "",
    timeRemaining,
    dialogs.success,
    handleFinishExam
  );

  // Guard: Chờ dữ liệu load xong mới render
  if (!exam || !currentQuestion || !uiLayout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#00747F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải giao diện...</p>
        </div>
      </div>
    );
  }

  // --- UI Render ---
  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      <ExamHeader
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        timeRemaining={timeRemaining}
        onExit={() => setDialogs((prev) => ({ ...prev, exit: true }))}
        onSubmit={() => setDialogs((prev) => ({ ...prev, submit: true }))}
        isSubmitting={examState.isSubmitting}
      />

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 h-full bg-white border-r border-gray-200 z-10 shadow-sm hidden lg:block">
          <QuestionSidebar
            sections={sectionsData}
            onQuestionClick={(qId) => {
              const idx = exam.questions.findIndex((q) => q.questionId === qId);
              goToQuestion(idx);
            }}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative">
          {uiLayout.isSplitView ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto p-0 hidden md:block custom-scrollbar">
                <ReadingPassagePanel
                  title={uiLayout.passage?.title || "Văn bản đọc hiểu"}
                  content={uiLayout.passage?.content || ""}
                  audioUrl={uiLayout.passage?.audioUrl}
                />
              </div>
              <div className="w-full md:w-1/2 overflow-hidden">
                <MainQuestionArea />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <MainQuestionArea />
            </div>
          )}
        </main>
      </div>

      {/* --- Dialogs --- */}
      <ExitExamDialog
        isOpen={dialogs.exit}
        onClose={() => setDialogs((prev) => ({ ...prev, exit: false }))}
        onConfirm={handleNavigateBack} // Thoát thì quay về Hub
      />

      <SubmitConfirmationDialog
        isOpen={dialogs.submit}
        onClose={() => setDialogs((prev) => ({ ...prev, submit: false }))}
        onConfirm={handleFinishExam} // Nộp bài -> Clean storage
        timeRemaining={formatTimeRemaining(timeRemaining)}
        answeredCount={stats.answered}
        totalQuestions={stats.total}
        unansweredQuestions={stats.unanswered}
        flaggedQuestions={stats.flagged}
      />

      <SubmitSuccessDialog
        isOpen={dialogs.success}
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        submittedAt={formatSubmissionTime()}
        completionStatus={{
          answered: stats.answered,
          total: stats.total,
        }}
        onGoToDashboard={handleNavigateDashboard}
        actionLabel={
          contestId ? "Quay về Hub Cuộc thi" : "Về trang chủ Dashboard"
        }
        isContestMode={!!contestId}
      />
    </div>
  );
};

// ==========================================
// 4. PROVIDER WRAPPER
// ==========================================

interface TakeExamClientProps {
  exam: ExamWithDetails;
}

export default function TakeExamClient({ exam }: TakeExamClientProps) {
  return (
    <ExamProvider initialExam={exam}>
      <ExamInterface />
    </ExamProvider>
  );
}
