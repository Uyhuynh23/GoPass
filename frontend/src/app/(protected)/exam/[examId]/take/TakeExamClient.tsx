// src/app/(protected)/exam/[examId]/take/TakeExamClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  formatTimeRemaining,
  formatSubmissionTime,
} from "@/utils/date-time.utils";
import { ExamWithDetails } from "@/features/exam/types";

// --- INNER COMPONENT: Sử dụng Hooks và Context ---
const ExamInterface = () => {
  const router = useRouter();

  // 1. Hooks: Context & UI Logic
  const {
    exam,
    currentQuestion,
    examState,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    updateAnswer,
    toggleFlag,
    submitExam,
    timeRemaining,
  } = useExam();

  const { uiLayout, sectionsData, stats, navStatus } = useExamUI();

  // 2. Local State for Dialogs
  const [dialogs, setDialogs] = useState({
    submit: false,
    exit: false,
    success: false,
  });

  // 3. Loading Guard (An toàn)
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

  // 4. Action Handlers
  const handleAnswerChange = (
    answer: string | string[] | Record<string, string>
  ) => {
    let finalAnswer: string | string[];
    if (typeof answer === "string" || Array.isArray(answer)) {
      finalAnswer = answer;
    } else {
      finalAnswer = JSON.stringify(answer);
    }

    updateAnswer(currentQuestion.questionId, {
      questionId: currentQuestion.questionId,
      answer: finalAnswer,
      isAnswered: true,
      lastModified: new Date(),
    });
  };

  const actions = {
    openSubmit: () => setDialogs((prev) => ({ ...prev, submit: true })),
    closeSubmit: () => setDialogs((prev) => ({ ...prev, submit: false })),
    confirmSubmit: () => {
      setDialogs((prev) => ({ ...prev, submit: false }));
      submitExam();
      // Giả lập delay success để UX mượt hơn
      setTimeout(() => setDialogs((prev) => ({ ...prev, success: true })), 300);
    },
    openExit: () => setDialogs((prev) => ({ ...prev, exit: true })),
    closeExit: () => setDialogs((prev) => ({ ...prev, exit: false })),
    confirmExit: () => router.push(`/exam/${exam._id}`),
    goToDashboard: () => router.push("/dashboard"),
  };

  // 5. Render Blocks
  const mainQuestionContent = (
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

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      <ExamHeader
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        timeRemaining={timeRemaining}
        onExit={actions.openExit}
        onSubmit={actions.openSubmit}
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

        {/* Content Area (Split View or Standard) */}
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
                {mainQuestionContent}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">{mainQuestionContent}</div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <ExitExamDialog
        isOpen={dialogs.exit}
        onClose={actions.closeExit}
        onConfirm={actions.confirmExit}
      />
      <SubmitConfirmationDialog
        isOpen={dialogs.submit}
        onClose={actions.closeSubmit}
        onConfirm={actions.confirmSubmit}
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
        onGoToDashboard={actions.goToDashboard}
      />
    </div>
  );
};

// --- MAIN CLIENT COMPONENT: Wrapper ---
interface TakeExamClientProps {
  exam: ExamWithDetails;
}

export default function TakeExamClient({ exam }: TakeExamClientProps) {
  // Wrap ExamInterface trong Provider để Hooks hoạt động
  return (
    <ExamProvider initialExam={exam}>
      <ExamInterface />
    </ExamProvider>
  );
}
