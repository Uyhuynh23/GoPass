export type UserRole = 'admin' | 'student' | 'teacher';

export type ExamType = 'contest' | 'public' | 'class';

export type ExamStatus = 'upcoming' | 'active' | 'completed';

export interface Exam {
  id: string;
  title: string;
  type: ExamType;
  status: ExamStatus;
  subject: string;
  duration: number; // in minutes
  questionCount: number;
  participantCount: number;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalExams: number;
  contestExams: number;
  publicExams: number;
  totalParticipants: number;
}

export interface DashboardData {
  stats: DashboardStats;
  exams: Exam[];
}
