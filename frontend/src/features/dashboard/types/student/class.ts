//src/features/dashboard/types/student/class.ts

export type ClassStatus = 'active' | 'pending' | 'rejected';

// Dùng cho UI hiển thị danh sách lớp
export interface ClassSummary {
  id: string;            
  name: string;
  code: string;
  students: number;
  status: ClassStatus;
  teacher?: string;      
  requestDate?: string;  
  requestId?: string;   
}

// Dùng cho dữ liệu thô từ DB (bảng ClassMember)
export interface ClassMember {
  id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'approved' | 'pending' | 'rejected';
}


// Dùng cho Class cụ thể
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
  // ---------------------------

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