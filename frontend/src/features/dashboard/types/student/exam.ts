//src/features/dashboard/types/student/exam.ts

// Dùng cho UI danh sách bài thi chính
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

// Dùng cho UI danh sách Contest
export interface StudentContest {
  id: number;
  title: string;
  subjects: string[];
  startDate: string;
  endDate: string;
  participants: number;
  status: "ongoing" | "upcoming" | "completed";
  progress?: { completed: number; total: number }; 
  rank?: string; 
  score?: number; 
}

// Dùng cho UI danh sách Luyện tập
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

// Dùng cho dữ liệu thô từ DB (bảng ExamSubmission)
export interface ExamSubmission {
  submission_id: string;
  exam_id: string;
  student_user_id: string;
  class_id: string;
  started_at: string;
  submitted_at: string | null;
  status: 'completed' | 'in_progress';
  objective_score?: number;
  final_score?: number | null;
}