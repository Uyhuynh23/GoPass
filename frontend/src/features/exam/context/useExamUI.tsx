// src/features/exam/context/useExamUI.ts
import { useMemo } from "react";
import { useExam } from "./ExamContext";
import { getLayoutForQuestion } from "@/utils/exam.utils";

export const useExamUI = () => {
  const { exam, examState, currentQuestion } = useExam();

  // 1. Logic tính toán Layout & Bài đọc
  const uiLayout = useMemo(() => {
    if (!exam || !currentQuestion) return null;

    const config = getLayoutForQuestion(exam.subject, currentQuestion.section);

    // Tìm bài đọc liên quan (nếu có)
    const passageId = currentQuestion.question?.linkedPassageId;
    const passage = passageId
      ? exam.readingPassages?.find((p) => p.id === passageId)
      : null;

    // Quyết định có chia đôi màn hình không
    const isSplitView = config.type === "reading-passage" && !!passage;

    return { config, passage, isSplitView };
  }, [exam, currentQuestion]);

  // 2. Logic nhóm câu hỏi theo Section (Sidebar)
  const sectionsData = useMemo(() => {
    if (!exam) return {};

    return exam.questions.reduce((acc, q, idx) => {
      const section = q.section || "Phần I";
      if (!acc[section]) acc[section] = [];

      acc[section].push({
        questionId: q.questionId,
        order: idx + 1,
        isAnswered:
          examState.answers.has(q.questionId) &&
          examState.answers.get(q.questionId)!.isAnswered,
        isFlagged: examState.flaggedQuestions.has(q.questionId),
        isActive: idx === examState.currentQuestionIndex,
      });
      return acc;
    }, {} as Record<string, any[]>);
  }, [
    exam,
    examState.answers,
    examState.flaggedQuestions,
    examState.currentQuestionIndex,
  ]);

  // 3. Logic Thống kê (Dialog Submit)
  const stats = useMemo(() => {
    if (!exam) return { answered: 0, total: 0, unanswered: [], flagged: [] };

    const total = exam.questions.length;
    const answered = Array.from(examState.answers.values()).filter(
      (a) => a.isAnswered
    ).length;

    const unanswered = exam.questions
      .map((q, idx) => ({
        number: idx + 1,
        section: q.section || "Phần I",
        questionId: q.questionId,
      }))
      .filter(
        (q) =>
          !examState.answers.has(q.questionId) ||
          !examState.answers.get(q.questionId)!.isAnswered
      );

    const flagged = exam.questions
      .map((q, idx) => ({
        number: idx + 1,
        section: q.section || "Phần I",
        questionId: q.questionId,
      }))
      .filter((q) => examState.flaggedQuestions.has(q.questionId));

    return { total, answered, unanswered, flagged };
  }, [exam, examState.answers, examState.flaggedQuestions]);

  // 4. Logic Navigation Check
  const navStatus = useMemo(() => {
    if (!exam || !currentQuestion)
      return { isLastInSection: false, isLastQuestion: false };

    const currentSectionQuestions = exam.questions.filter(
      (q) => q.section === currentQuestion.section
    );
    const currentIndexInSection = currentSectionQuestions.findIndex(
      (q) => q.questionId === currentQuestion.questionId
    );

    return {
      isLastInSection:
        currentIndexInSection === currentSectionQuestions.length - 1,
      isLastQuestion:
        examState.currentQuestionIndex === exam.questions.length - 1,
    };
  }, [exam, currentQuestion, examState.currentQuestionIndex]);

  return {
    uiLayout,
    sectionsData,
    stats,
    navStatus,
  };
};
