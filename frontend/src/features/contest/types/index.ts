// src/features/contest/types/index.ts

// Import Type có sẵn từ Exam Feature (để tái sử dụng)
import { Exam } from "@/features/exam/types/exam";
import { ExamSubmission } from "@/features/exam/types/submission";

// 1. Type cho thực thể Contest (Tương ứng bảng 'contests')
export interface Contest {
  _id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  ownerId: string;
  isPublic: boolean;
  status: "upcoming" | "ongoing" | "ended";
  participantsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Type cho bảng trung gian Contest - Exam (Tương ứng bảng 'contest_exams')
export interface ContestExamConfig {
  _id: string;
  contestId: string;
  examId: string;
  order: number;
  weight: number;
}

// 3. Type cho UI hiển thị danh sách môn thi (Aggregated Data)
export interface ContestSubjectUI {
  contestExamId: string;
  examId: string;
  order: number;
  weight: number;

  // Metadata lấy từ Exam
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;

  // Trạng thái tính toán tại Client
  userStatus: "locked" | "ready" | "completed";
}

// 4. ✅ BỔ SUNG: Type cho Leaderboard (Bảng xếp hạng)
export interface LeaderboardItem {
  userId: string;
  name: string;
  avatar: string;
  totalScore: number;
  rank: number;
  completedExamsCount: number;
  isMe?: boolean; // Flag để highlight dòng của mình
}

// 5. ✅ CẬP NHẬT: Type cho Contest Participation (Kết quả thi đấu)
export interface ContestParticipation {
  _id: string;
  contestId: string;
  userId: string;
  enrolledAt: string;

  // Tiến độ làm bài
  completedExams: string[]; // Mảng ID các bài thi đã xong

  // Kết quả tổng hợp (Backend tính toán và update sau mỗi lần nộp)
  totalScore: number;
  rank?: number; // ✅ Bổ sung: Thứ hạng hiện tại
  percentile?: number; // ✅ Bổ sung: Top % (ví dụ: top 10%)

  // ✅ Bổ sung: Danh sách bài làm chi tiết (Map sang bảng ExamSubmission)
  // Field này thường dùng khi hiển thị trang Kết quả chi tiết (Result Page)
  submissions?: ExamSubmission[];
}

// 6. Type tổng hợp trả về cho Page (Contest Detail Page)
export interface ContestDetail extends Contest {
  // Danh sách môn thi đã được merge trạng thái
  subjects: ContestSubjectUI[];

  // Thông tin tham gia của User hiện tại (nếu có)
  participation?: ContestParticipation | null;

  // ✅ Bổ sung: Bảng xếp hạng (Thường chỉ trả về Top 10 hoặc khi Contest đã end)
  leaderboard?: LeaderboardItem[];
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}
