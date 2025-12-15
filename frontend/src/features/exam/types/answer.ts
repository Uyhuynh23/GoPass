// src/features/exam/types/answer.ts
export interface AnswerData {
  questionId: string;
  answer?: string | string[]; // Unified answer field
  answerText?: string; // Legacy support
  selectedOptions?: string[]; // Legacy support
  isAnswered: boolean;
  lastModified: Date;
  score?: number;
  feedback?: string;
}

export interface QuestionNavigationItem {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isCurrentQuestion: boolean;
}
