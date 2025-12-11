// src/features/dashboard/types/class.ts

export interface ClassAssignment {
  id: number;
  title: string;
  deadline: string;
  duration: number; // minutes
  status: "upcoming" | "completed" | "late" | "ongoing";
  score: number | null;
  maxScore: number;
}

export interface ClassStats {
  rank: number;
  totalStudents: number; // For rank context (e.g., 8/45)
  assignmentsDone: number;
  totalAssignments: number;
  avgScore: number;
}

export interface ClassDetail {
  id: string; // e.g., "C01"
  code: string; // e.g., "CLASS001"
  name: string; // e.g., "Lớp 12A1..."
  subject: string; // e.g., "Toán học"
  teacher: string;
  studentsCount: number;
  startDate: string;
  description: string;
  stats: ClassStats;
  assignments: ClassAssignment[];
}