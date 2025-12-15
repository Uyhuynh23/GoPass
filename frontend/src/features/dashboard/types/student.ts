import { Exam, ExamStatus } from "./index";

export interface StudentExam {
  id: string;
  title: string;
  class: string;
  status: "upcoming" | "in-progress" | "completed";
  score: number | null;
  maxScore: number;
  duration: number; // in minutes
  submittedDate: string | null;
  dueDate: string;
}

export type ClassStatus = 'active' | 'pending' | 'rejected';

export interface ClassSummary {
  id: string;            // ID của lớp (VD: c_math_01)
  name: string;
  code: string;
  students: number;
  status: ClassStatus;
  teacher?: string;      // Tên giáo viên
  requestDate?: string;  // Ngày tham gia/yêu cầu
  requestId?: string;   // ID của yêu cầu tham gia lớp (nếu có)
}


// --- UPDATED: Matched with the 4 new UI stats cards ---
export interface StudentStats {
  joinedClasses: number;    // Teal Card: "Joined Classes"
  examsTaken: number;       // Green Card: "Exams Taken"
  averageScore: number;     // Blue Card: "Average Score"
  daysUntilExam: number;    // Pink Card: "Days Remaining (THPT QG)"
}

// src/features/dashboard/types/student.ts

export interface PerformanceDataPoint {
  date: string;   // Changed from 'month' to 'date' (e.g., "24/11")
  hours: number;  // New: Hours studied (for Teal bar)
  exams: number;  // New: Number of exams (for Purple bar)
  score: number;  // Kept for reference or future use
}

export interface StudentDashboardData {
  stats: StudentStats;
  exams: StudentExam[];
  performanceData: PerformanceDataPoint[];
}

export interface StudentContest {
  id: number;
  title: string;
  subjects: string[];
  startDate: string;
  endDate: string;
  participants: number;
  status: "ongoing" | "upcoming" | "completed";
  // Specific fields based on status
  progress?: { completed: number; total: number }; // For ongoing contests
  rank?: string; // For completed contests (e.g., "45/523")
  score?: number; // For completed contests
}

// src/features/dashboard/types/student.ts

export type HistoryType = "contest" | "practice_global" | "practice_class";

export interface HistoryItem {
  id: number;
  title: string;
  type: HistoryType; // Updated type definition
  subject: string;
  duration: number; // minutes
  score: number;
  maxScore: number;
  completedDate: string;
  
  // Optional fields based on type
  rank?: string;       // Only for contest
  className?: string;  // Only for practice_class
}

export interface HistoryStats {
  totalExams: number;
  avgScore: number;
  totalContests: number;
  totalPractice: number;
  highestScore: number;
  bestSubject: string;
  totalTime: number;
}

export interface PracticeExam {
  id: number;
  title: string;
  subject: string;
  duration: number; // phút
  questionCount: number;
  status: "new" | "completed" | "in-progress";
  tags: string[];
  score?: number;
  maxScore?: number;
  completedDate?: string;
}