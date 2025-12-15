// src/features/contest/types/index.ts

export interface Contest {
  _id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  ownerId: string;
  isPublic: boolean;
  status: "upcoming" | "ongoing" | "ended";
  createdAt: string;
  updatedAt: string;
  participantsCount?: number;
}

export interface ContestSubject {
  contestId: string;
  examId: string;
  order: number;
  weight: number;
  examTitle: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  // Trạng thái user
  userStatus: "locked" | "ready" | "completed";
}

interface ExamBreakdown {
  examId: string;
  score: number;
}

interface LeaderboardItem {
  rank: number;
  name: string;
  id: string;
  totalScore: number;
  avatar: string;
  isMe?: boolean;
}

export interface ContestDetail extends Contest {
  subjects: ContestSubject[];
  leaderboard?: LeaderboardItem[];
  userResult?: {
    maxScore: number;
    totalScore: number;
    rank: number;
    percentile: number;
    breakdown: ExamBreakdown[];
  };
}
