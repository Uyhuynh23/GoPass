// src/features/dashboard/data/mock-history.ts
import { HistoryItem, HistoryStats } from "../../types/student";

export const MOCK_HISTORY_STATS: HistoryStats = {
  totalExams: 12,
  avgScore: 8.2,
  totalContests: 3,
  totalPractice: 9,
  highestScore: 9.5,
  bestSubject: "Tiếng Anh",
  totalTime: 540,
};

export const MOCK_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 1,
    title: "Đề thi thử Tiếng Anh - Đề 15",
    type: "practice_global", // Practice (System/Global)
    subject: "Tiếng Anh",
    duration: 60,
    score: 9.5,
    maxScore: 10,
    completedDate: "2025-11-28 14:30",
  },
  {
    id: 2,
    title: "Cuộc thi THPT QG Tháng 12 - Toán",
    type: "contest", // Contest (Always Global)
    subject: "Toán",
    duration: 90,
    score: 7.8,
    maxScore: 10,
    rank: "#145",
    completedDate: "2025-11-28 10:15",
  },
  {
    id: 3,
    title: "Luyện tập Vật Lý - Dao động cơ",
    type: "practice_global", // Practice (System/Global)
    subject: "Vật Lý",
    duration: 45,
    score: 7.2,
    maxScore: 10,
    completedDate: "2025-11-27 16:00",
  },
  {
    id: 4,
    title: "Kiểm tra Văn - Nghị luận xã hội",
    type: "practice_class", // Practice (Class specific)
    subject: "Ngữ Văn",
    duration: 120,
    score: 8.0,
    maxScore: 10,
    className: "Lớp 12A1",
    completedDate: "2025-11-26 09:00",
  },
  {
    id: 5,
    title: "Cuộc thi THPT QG Tháng 12 - Tiếng Anh",
    type: "contest",
    subject: "Tiếng Anh",
    duration: 60,
    score: 8.5,
    maxScore: 10,
    rank: "#89",
    completedDate: "2025-11-25 14:00",
  },
];