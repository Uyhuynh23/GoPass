// src/features/dashboard/types/class.ts

// Cập nhật trạng thái để cover đủ các trường hợp logic
export type AssignmentStatus = "completed" | "incomplete" | "ongoing" | "upcoming";

export interface ClassAssignment {
  id: number | string;
  examId: string;
  title: string;
  
  startTime: string;
  endTime: string;
  deadlineDisplay: string;
  
  duration: number;
  questionCount: number;
  
  status: AssignmentStatus;
  
  score: number | null;
  maxScore: number;
  
  attemptLimit: number;    // -1 là vô hạn, >0 là số lượt tối đa
  myAttemptCount: number;  // Số lần user hiện tại đã làm
 
  submittedCount: number;  // Tổng số HS trong lớp đã nộp
  totalStudents: number;
}

export interface ClassStats {
  rank: number;
  totalStudents: number;
  assignmentsDone: number;
  totalAssignments: number;
  avgScore: number;
}

export interface ClassDetail {
  id: string;
  code: string;
  name: string;
  subject: string;
  teacher: string;
  studentsCount: number;
  description: string;
  stats: ClassStats;
  assignments: ClassAssignment[];
}