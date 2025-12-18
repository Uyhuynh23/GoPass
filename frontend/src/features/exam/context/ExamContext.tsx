// src/features/exam/context/ExamContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import {
  ExamWithDetails,
  ExamQuestion,
  ExamSubmission,
  ExamState,
  AnswerData,
} from "../types";
import { submissionService } from "@/services/exam/submission.service";
import { examStorage } from "@/utils/exam-storage";

// --- TYPES ---
interface ExamContextType {
  exam: ExamWithDetails;
  submission: ExamSubmission | null;
  currentQuestion: ExamQuestion | null;
  examState: ExamState;
  timeRemaining: number;
  isTimeUp: boolean;
  setExamState: (state: Partial<ExamState>) => void;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  updateAnswer: (questionId: string, answer: AnswerData) => void;
  getAnswer: (questionId: string) => AnswerData | undefined;
  toggleFlag: (questionId: string) => void;
  submitExam: () => Promise<void>;
  autoSaveToApi: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error("useExam must be used within ExamProvider");
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
  initialExam: ExamWithDetails;
  isReviewMode?: boolean; // Chế độ xem lại
}

export const ExamProvider: React.FC<ExamProviderProps> = ({
  children,
  initialExam,
  isReviewMode = false,
}) => {
  // --- 1. CORE STATE ---
  const [exam] = useState<ExamWithDetails>(initialExam);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // State mặc định
  const [examState, setExamStateRaw] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: initialExam.durationMinutes * 60,
    isSubmitting: false,
    autoSaveStatus: "idle",
  });

  const examStateRef = useRef(examState);
  useEffect(() => {
    examStateRef.current = examState;
  }, [examState]);

  const setExamState = useCallback((partial: Partial<ExamState>) => {
    setExamStateRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const currentQuestion =
    exam.questions[examState.currentQuestionIndex] || null;

  // --- 2. INITIALIZATION (SỬA LOGIC QUAN TRỌNG TẠI ĐÂY) ---
  useEffect(() => {
    // Nếu đang chế độ Review -> Không làm gì cả
    if (isReviewMode) return;

    // CHECK 1: Nếu Server báo bài này user đã nộp rồi (status completed/graded)
    // Thì đây là lượt thi mới hoặc user đang cố reload lại trang cũ -> Xóa sạch cache
    const serverStatus = initialExam.userSubmission?.status;
    if (serverStatus === "submitted" || serverStatus === "graded") {
      console.log(
        "🧹 Previous attempt finished. Clearing storage for new attempt."
      );
      examStorage.clear(initialExam._id);
      return; // Dừng, không load cache cũ
    }

    // CHECK 2: Load dữ liệu từ LocalStorage
    const savedProgress = examStorage.load(initialExam._id);

    if (savedProgress) {
      // Logic tính thời gian (giữ nguyên)
      const now = Date.now();
      const lastSaved = (savedProgress as any).lastSaved || now;
      const secondsPassed = Math.floor((now - lastSaved) / 1000);
      const realTimeRemaining =
        (savedProgress.timeRemaining || 0) - secondsPassed;

      console.log(
        `⏱️ Restoring session: Real time remaining: ${realTimeRemaining}s`
      );

      if (realTimeRemaining <= 0) {
        setExamStateRaw((prev) => ({
          ...prev,
          ...savedProgress,
          timeRemaining: 0,
        }));
        setIsTimeUp(true);
      } else {
        setExamStateRaw((prev) => ({
          ...prev,
          ...savedProgress,
          timeRemaining: realTimeRemaining,
        }));
      }
    }
  }, [initialExam._id, initialExam.userSubmission, isReviewMode]);

  // --- 3. TIMER ---
  useEffect(() => {
    if (isTimeUp || examState.isSubmitting || isReviewMode) return;
    const interval = setInterval(() => {
      setExamStateRaw((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(interval);
          setIsTimeUp(true);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimeUp, examState.isSubmitting, isReviewMode]);

  // --- 4. PERSISTENCE (SỬA LOGIC CHẶN GHI ĐÈ) ---

  // Save khi có thay đổi
  useEffect(() => {
    // SỬA: Nếu đang Submitting hoặc Review -> TUYỆT ĐỐI KHÔNG LƯU
    if (examState.isSubmitting || isReviewMode) return;

    if (examState.answers.size > 0 || examState.flaggedQuestions.size > 0) {
      examStorage.save(initialExam._id, examState);
    }
  }, [
    examState.answers,
    examState.flaggedQuestions,
    examState.currentQuestionIndex,
    examState.isSubmitting, // Thêm dependency này
    initialExam._id,
    isReviewMode,
  ]);

  // Backup Save mỗi 5s
  useEffect(() => {
    // SỬA: Chặn backup khi đang nộp hoặc review
    if (isReviewMode) return;

    const interval = setInterval(() => {
      // Check lại ref lần nữa cho chắc
      if (!examStateRef.current.isSubmitting) {
        examStorage.save(initialExam._id, examStateRef.current);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [initialExam._id, isReviewMode]);

  // Auto-submit khi hết giờ
  useEffect(() => {
    if (isTimeUp && !examState.isSubmitting && !isReviewMode) {
      submitExam();
    }
  }, [isTimeUp, examState.isSubmitting, isReviewMode]);

  // --- HANDLERS (Giữ nguyên) ---
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < exam.questions.length)
      setExamState({ currentQuestionIndex: index });
  };
  const goToNextQuestion = () => {
    if (examState.currentQuestionIndex < exam.questions.length - 1)
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex + 1,
      });
  };
  const goToPreviousQuestion = () => {
    if (examState.currentQuestionIndex > 0)
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex - 1,
      });
  };
  const updateAnswer = (questionId: string, answer: AnswerData) => {
    if (isReviewMode) return;
    const newAnswers = new Map(examState.answers);
    newAnswers.set(questionId, { ...answer, lastModified: new Date() });
    setExamState({ answers: newAnswers });
  };
  const getAnswer = (questionId: string) => examState.answers.get(questionId);
  const toggleFlag = (questionId: string) => {
    if (isReviewMode) return;
    const newFlags = new Set(examState.flaggedQuestions);
    if (newFlags.has(questionId)) newFlags.delete(questionId);
    else newFlags.add(questionId);
    setExamState({ flaggedQuestions: newFlags });
  };

  const autoSaveToApi = async () => {
    if (examState.answers.size === 0 || isReviewMode) return;
    setExamState({ autoSaveStatus: "saving" });
    try {
      await submissionService.saveAnswers(
        exam._id,
        Array.from(examState.answers.values())
      );
      setExamState({ autoSaveStatus: "saved" });
      setTimeout(() => setExamState({ autoSaveStatus: "idle" }), 2000);
    } catch {
      setExamState({ autoSaveStatus: "error" });
    }
  };

  const submitExam = async () => {
    if (examState.isSubmitting || isReviewMode) return;

    // 1. Đánh dấu đang nộp để CHẶN mọi hành động save khác
    setExamState({ isSubmitting: true });

    try {
      const answersArray = Array.from(examState.answers.values());
      await submissionService.submitExam(exam._id, answersArray);

      // 2. Xóa sạch LocalStorage NGAY LẬP TỨC sau khi nộp thành công
      examStorage.clear(initialExam._id);
      console.log("✅ Cleared storage for", initialExam._id);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Nộp bài thất bại. Vui lòng thử lại.");
      setExamState({ isSubmitting: false }); // Mở khóa nếu lỗi để user nộp lại
    }
  };

  const value: ExamContextType = {
    exam,
    submission,
    currentQuestion,
    examState,
    timeRemaining: examState.timeRemaining,
    isTimeUp,
    setExamState,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    updateAnswer,
    getAnswer,
    toggleFlag,
    submitExam,
    autoSaveToApi,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};
