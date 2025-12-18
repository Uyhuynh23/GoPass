// src/features/exam/types/submission.ts
import { Exam } from "./exam";
import { Question } from "./question";

export type SubmissionStatus = "in_progress" | "submitted" | "graded" | "late";

export interface ExamSubmission {
  _id: string;
  assignmentId: string;
  examId: string;
  studentId: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore: number;
  maxScore: number;
  attemptNumber: number;
  answers: ExamAnswer[];
  exam?: Exam;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAnswer {
  _id: string;
  submissionId: string;
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  score: number;
  maxScore: number;
  feedback?: string;
  isAutoGraded: boolean;
  isManuallyGraded: boolean;
  question?: Question;
  createdAt: string;
  updatedAt: string;
}
