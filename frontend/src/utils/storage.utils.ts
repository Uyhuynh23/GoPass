// src/utils/storage.utils.ts
import { ExamState, AnswerData } from "@/features/exam/types";

const STORAGE_PREFIX = "exam_progress_";

// Helper: Convert Map/Set to JSON-friendly format
const serializeState = (state: ExamState) => {
  return {
    ...state,
    answers: Array.from(state.answers.entries()), // Map -> Array
    flaggedQuestions: Array.from(state.flaggedQuestions), // Set -> Array
    lastSaved: Date.now(),
  };
};

// Helper: Convert JSON back to Map/Set
const deserializeState = (savedData: any): Partial<ExamState> => {
  return {
    ...savedData,
    answers: new Map<string, AnswerData>(savedData.answers), // Array -> Map
    flaggedQuestions: new Set<string>(savedData.flaggedQuestions), // Array -> Set
  };
};

export const examStorage = {
  save: (examId: string, state: ExamState) => {
    if (typeof window === "undefined") return;
    try {
      const serialized = serializeState(state);
      localStorage.setItem(
        `${STORAGE_PREFIX}${examId}`,
        JSON.stringify(serialized)
      );
    } catch (e) {
      console.error("Save progress failed", e);
    }
  },

  load: (examId: string): Partial<ExamState> | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${examId}`);
      if (!raw) return null;
      return deserializeState(JSON.parse(raw));
    } catch (e) {
      console.error("Load progress failed", e);
      return null;
    }
  },

  clear: (examId: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${STORAGE_PREFIX}${examId}`);
  },

  hasProgress: (examId: string): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(`${STORAGE_PREFIX}${examId}`);
  },
};
