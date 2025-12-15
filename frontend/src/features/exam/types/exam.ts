// src/features/exam/types/exam.ts
export type ExamMode = "practice" | "test" | "contest";
export type ExamStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

export interface Exam {
  _id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  mode: ExamMode;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdBy: string;
  isPublished: boolean;
  totalQuestions?: number;
  totalPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAssignment {
  _id: string;
  examId: string;
  classId: string;
  startTime: string;
  endTime: string;
  shuffleQuestions: boolean;
  allowLateSubmission: boolean;
  maxAttempts: number;
  exam?: Exam;
  createdAt: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
}

export interface ExamWithDetails extends Exam {
  questions: import("./question").ExamQuestion[];
  assignment?: ExamAssignment;
  userSubmission?: import("./submission").ExamSubmission;
  readingPassage?: ReadingPassage; // For English exams
}
