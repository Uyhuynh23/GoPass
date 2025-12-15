// src/features/exam/types/index.ts
export * from "./exam";
export * from "./question";
export * from "./submission";
export * from "./answer";
export * from "./exam-config";

// UI State Types
export interface ExamState {
  currentQuestionIndex: number;
  answers: Map<string, import("./answer").AnswerData>;
  flaggedQuestions: Set<string>;
  timeRemaining: number; // seconds
  isSubmitting: boolean;
  autoSaveStatus: "idle" | "saving" | "saved" | "error";
}
