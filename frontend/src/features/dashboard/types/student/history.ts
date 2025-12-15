//src/features/dashboard/types/student/history.ts
// src/features/dashboard/types/student.ts

export type HistoryType = 'contest' | 'practice_class' | 'practice_global';

export interface HistoryItem {
  id: number | string;
  title: string;
  subject: string;
  duration: number;        // phút
  score: number;
  maxScore: number;
  completedDate: string;   // DD/MM/YYYY
  type: HistoryType;
  rank?: number;           // Chỉ có nếu là contest
  className?: string;      // Chỉ có nếu là practice_class
}

export interface HistoryStats {
  totalExams: number;
  avgScore: number;
  totalContests: number;
  totalPractice: number;
  highestScore: number;
  bestSubject: string;
  totalTime: number;       // Tổng phút
}

// Type trả về của API (Gồm cả List và Stats)
export interface HistoryDataResponse {
  list: HistoryItem[];
  stats: HistoryStats;
}