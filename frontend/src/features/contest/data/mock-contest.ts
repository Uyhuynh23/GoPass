// src/features/contest/data/mock-contest.ts
import { ContestDetail } from "../types";
import { mockExam } from "@/features/exam/data/mock-exam";

const getExamInfo = (id: string) => {
  const found = mockExam.find((e) => e._id === id);
  if (!found) {
    return { title: "Đề thi", subject: "Môn thi", duration: 0, questions: 0 };
  }
  return {
    title: found.title,
    subject: found.subject,
    duration: found.durationMinutes,
    questions: found.totalQuestions || 0,
  };
};

const mathExam = getExamInfo("exam-001");
const englishExam = getExamInfo("exam-003");
const litExam = getExamInfo("exam-002");

export const MOCK_CONTEST_DETAIL: ContestDetail = {
  _id: "contest-olympic-2025",
  name: "Olympic THPT Quốc Gia 2025",
  description: "Kỳ thi thử toàn diện với 3 môn: Toán, Tiếng Anh, Ngữ Văn.",
  startTime: "2025-11-28T08:00:00Z",
  endTime: "2025-12-05T23:59:00Z",
  ownerId: "admin-system",
  isPublic: true,
  status: "ongoing",
  createdAt: "2025-11-20T00:00:00Z",
  updatedAt: "2025-11-20T00:00:00Z",
  participantsCount: 1250,

  subjects: [
    {
      contestId: "contest-olympic-2025",
      examId: "exam-001",
      order: 1,
      weight: 1,
      examTitle: mathExam.title,
      subject: mathExam.subject,
      durationMinutes: mathExam.duration,
      totalQuestions: mathExam.questions,

      // ✅ Đã làm xong nhưng KHÔNG có userScore
      userStatus: "completed",
    },
    {
      contestId: "contest-olympic-2025",
      examId: "exam-003",
      order: 2,
      weight: 1,
      examTitle: englishExam.title,
      subject: englishExam.subject,
      durationMinutes: englishExam.duration,
      totalQuestions: englishExam.questions,

      userStatus: "ready",
    },
    {
      contestId: "contest-olympic-2025",
      examId: "exam-002",
      order: 3,
      weight: 2,
      examTitle: litExam.title,
      subject: litExam.subject,
      durationMinutes: litExam.duration,
      totalQuestions: litExam.questions,

      userStatus: "locked",
    },
  ],

  // Kết quả tổng (Chỉ dùng cho trang Result/Leaderboard khi đã kết thúc contest)
  userResult: {
    totalScore: 25.5,
    maxScore: 30,
    rank: 4,
    percentile: 99.8,
    breakdown: [
      { examId: "exam-001", score: 8.5 },
      { examId: "exam-003", score: 9.0 },
      { examId: "exam-002", score: 8.0 },
    ],
  },

  leaderboard: [
    {
      rank: 1,
      name: "Nguyễn Văn An",
      id: "HS001",
      totalScore: 28.0,
      avatar: "A",
    },
    {
      rank: 2,
      name: "Trần Thị Bình",
      id: "HS002",
      totalScore: 27.5,
      avatar: "T",
    },
    {
      rank: 3,
      name: "Lê Hoàng Cường",
      id: "HS003",
      totalScore: 27.0,
      avatar: "L",
    },
    {
      rank: 4,
      name: "Phạm Minh Đức",
      id: "student-01",
      totalScore: 26.0,
      avatar: "M",
      isMe: true,
    },
    {
      rank: 5,
      name: "Hoàng Thị Em",
      id: "HS005",
      totalScore: 25.5,
      avatar: "H",
    },
  ],
};
