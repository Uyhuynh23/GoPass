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
  ExamState, // Import từ file types/index.ts của bạn
  AnswerData,
} from "../types";
import { submissionService } from "@/services/exam/submission.service";
import { examStorage } from "@/utils/storage.utils";

// --- TYPES ---
interface ExamContextType {
  // Data
  exam: ExamWithDetails;
  submission: ExamSubmission | null;
  currentQuestion: ExamQuestion | null;

  // State
  examState: ExamState;
  timeRemaining: number;
  isTimeUp: boolean;

  // State Setters
  setExamState: (state: Partial<ExamState>) => void;

  // Navigation
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;

  // Actions
  updateAnswer: (questionId: string, answer: AnswerData) => void;
  getAnswer: (questionId: string) => AnswerData | undefined;
  toggleFlag: (questionId: string) => void;

  // Async Actions
  submitExam: () => Promise<void>;
  autoSaveToApi: () => Promise<void>;
}

// --- CONTEXT ---
const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within ExamProvider");
  }
  return context;
};

// --- PROVIDER ---
interface ExamProviderProps {
  children: ReactNode;
  initialExam: ExamWithDetails;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({
  children,
  initialExam,
}) => {
  // --- 1. CORE STATE ---
  const [exam] = useState<ExamWithDetails>(initialExam);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Khởi tạo state mặc định
  const [examState, setExamStateRaw] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: initialExam.durationMinutes * 60,
    isSubmitting: false,
    autoSaveStatus: "idle",
  });

  // Ref để tránh stale closure trong setInterval (nếu cần dùng trong timer phức tạp)
  const examStateRef = useRef(examState);
  useEffect(() => {
    examStateRef.current = examState;
  }, [examState]);

  // Helper update state an toàn
  const setExamState = useCallback((partial: Partial<ExamState>) => {
    setExamStateRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const currentQuestion =
    exam.questions[examState.currentQuestionIndex] || null;

  // --- 2. INITIALIZATION & TIME CALCULATION (Quan Trọng) ---
  useEffect(() => {
    // Load dữ liệu từ LocalStorage
    const savedProgress = examStorage.load(initialExam._id);

    if (savedProgress) {
      console.log("🔄 Found saved progress. Calculating real time...");

      // --- LOGIC TÍNH THỜI GIAN TRÔI QUA KHI RỜI TRANG ---
      const now = Date.now();
      // Lấy lastSaved từ storage (ép kiểu any vì ExamState gốc không có field này)
      const lastSaved = (savedProgress as any).lastSaved || now;

      // Tính số giây đã trôi qua từ lần save cuối
      const secondsPassed = Math.floor((now - lastSaved) / 1000);

      // Thời gian còn lại thực tế = Thời gian đã lưu - Thời gian trôi qua
      const realTimeRemaining =
        (savedProgress.timeRemaining || 0) - secondsPassed;

      console.log(
        `⏱️ Saved: ${savedProgress.timeRemaining}s | Passed: ${secondsPassed}s | Real: ${realTimeRemaining}s`
      );

      if (realTimeRemaining <= 0) {
        // Nếu đã hết giờ trong lúc rời trang
        setExamStateRaw((prev) => ({
          ...prev,
          ...savedProgress,
          timeRemaining: 0,
        }));
        setIsTimeUp(true); // Trigger nộp bài
      } else {
        // Nếu vẫn còn giờ, khôi phục trạng thái và set thời gian mới
        setExamStateRaw((prev) => ({
          ...prev,
          ...savedProgress,
          timeRemaining: realTimeRemaining,
        }));
      }
    }
  }, [initialExam._id]);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    if (isTimeUp || examState.isSubmitting) return;

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
  }, [isTimeUp, examState.isSubmitting]);

  // Tự động nộp khi hết giờ
  useEffect(() => {
    if (isTimeUp && !examState.isSubmitting) {
      console.log("⏰ Time is up! Auto submitting...");
      submitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp]);

  // --- 4. PERSISTENCE (AUTO-SAVE) ---
  // Lưu mỗi khi có thay đổi quan trọng (trả lời, flag)
  useEffect(() => {
    if (examState.answers.size > 0 || examState.flaggedQuestions.size > 0) {
      examStorage.save(initialExam._id, examState);
    }
  }, [
    examState.answers,
    examState.flaggedQuestions,
    examState.currentQuestionIndex,
    initialExam._id,
  ]);

  // Backup save: Lưu định kỳ mỗi 5s để cập nhật timeRemaining liên tục
  // Giúp giảm sai số nếu user tắt trình duyệt đột ngột mà chưa trả lời thêm câu nào
  useEffect(() => {
    const interval = setInterval(() => {
      examStorage.save(initialExam._id, examStateRef.current);
    }, 5000);
    return () => clearInterval(interval);
  }, [initialExam._id]);

  // --- 5. HANDLERS ---
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < exam.questions.length) {
      setExamState({ currentQuestionIndex: index });
    }
  };

  const goToNextQuestion = () => {
    if (examState.currentQuestionIndex < exam.questions.length - 1) {
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex + 1,
      });
    }
  };

  const goToPreviousQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex - 1,
      });
    }
  };

  const updateAnswer = (questionId: string, answer: AnswerData) => {
    const newAnswers = new Map(examState.answers);
    newAnswers.set(questionId, {
      ...answer,
      lastModified: new Date(),
    });
    setExamState({ answers: newAnswers });
  };

  const getAnswer = (questionId: string): AnswerData | undefined => {
    return examState.answers.get(questionId);
  };

  const toggleFlag = (questionId: string) => {
    const newFlags = new Set(examState.flaggedQuestions);
    if (newFlags.has(questionId)) {
      newFlags.delete(questionId);
    } else {
      newFlags.add(questionId);
    }
    setExamState({ flaggedQuestions: newFlags });
  };

  // --- 6. API ACTIONS ---
  const autoSaveToApi = async () => {
    if (examState.answers.size === 0) return;
    setExamState({ autoSaveStatus: "saving" });

    try {
      const answersArray = Array.from(examState.answers.values());
      await submissionService.saveAnswers(exam._id, answersArray);
      setExamState({ autoSaveStatus: "saved" });
      setTimeout(() => setExamState({ autoSaveStatus: "idle" }), 2000);
    } catch (error) {
      console.error("Auto-save API failed:", error);
      setExamState({ autoSaveStatus: "error" });
    }
  };

  const submitExam = async () => {
    if (examState.isSubmitting) return;
    setExamState({ isSubmitting: true });

    // Lưu state cuối cùng vào LocalStorage để backup
    examStorage.save(initialExam._id, examState);

    try {
      const answersArray = Array.from(examState.answers.values());
      console.log("🚀 Submitting exam...", { count: answersArray.length });

      await submissionService.submitExam(exam._id, answersArray);

      // XÓA LOCAL STORAGE SAU KHI NỘP THÀNH CÔNG
      examStorage.clear(initialExam._id);

      console.log("✅ Submit success & Cache cleared");
    } catch (error) {
      console.error("❌ Submit failed:", error);
      alert("Nộp bài thất bại. Vui lòng thử lại.");
      setExamState({ isSubmitting: false });
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
