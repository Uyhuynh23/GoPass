// src/services/contest/contest.service.ts
import {
  ContestDetail,
  ContestSubjectUI,
  LeaderboardItem,
} from "@/features/contest/types";
import { httpClient } from "@/lib/http";

// ✅ 1. Định nghĩa Interface cho dữ liệu Exam lấy từ API (để Map hiểu)
// Lưu ý: API json-server trả về "id", trong khi Type Exam gốc dùng "_id"
// Nên ta dùng interface này để hứng dữ liệu thô (raw data) trước.
interface ExamLookup {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions?: number; // Có thể null/undefined trong DB
}

export const contestService = {
  /**
   * Lấy chi tiết Contest đầy đủ (Info + Subjects + Participation của User hiện tại)
   */
  getContestDetail: async (
    contestId: string,
  ): Promise<ContestDetail | null> => {
    try {
      const response = await httpClient.get<{ success: boolean; data: any }>(
        `/contests/${contestId}`,
        { requiresAuth: false }
      );

      if (!response?.success || !response.data) return null;
      const contestData = response.data;

      const examsConfig = contestData.exams || [];
      const participation = contestData.participation || null;
      const completedExams = new Set(participation?.completedExams || []);

      const subjects: ContestSubjectUI[] = examsConfig.map(
        (cfg: any, index: number) => {
          const examInfo: ExamLookup | undefined = cfg.examId || cfg.exam;

          let status: "locked" | "ready" | "completed" = "locked";
          if (completedExams.has(cfg.examId?._id || cfg.examId)) {
            status = "completed";
          } else if (index === 0) {
            status = "ready";
          } else {
            const prevExam = examsConfig[index - 1];
            const prevId = prevExam.examId?._id || prevExam.examId;
            if (completedExams.has(prevId)) status = "ready";
          }

          return {
            contestExamId: cfg._id || cfg.id,
            examId: cfg.examId?._id || cfg.examId,
            order: cfg.order,
            weight: cfg.weight,
            title: examInfo?.title || "Bài thi đang cập nhật",
            subject: examInfo?.subject || "Môn thi",
            durationMinutes: examInfo?.durationMinutes || 0,
            totalQuestions: examInfo?.totalQuestions || 0,
            userStatus: status,
          };
        }
      );

      return {
        _id: contestData._id,
        name: contestData.name,
        description: contestData.description,
        startTime: contestData.startTime,
        endTime: contestData.endTime,
        ownerId: contestData.ownerId,
        isPublic: contestData.isPublic,
        status: contestData.status,
        participantsCount: contestData.participantsCount,
        createdAt: contestData.createdAt,
        updatedAt: contestData.updatedAt,
        subjects,
        participation,
        leaderboard: [],
      };
    } catch (error) {
      console.error("Lỗi getContestDetail:", error);
      return null;
    }
  },

  /**
   * Lấy Bảng xếp hạng (Leaderboard)
   */
  getContestLeaderboard: async (
    contestId: string
  ): Promise<LeaderboardItem[]> => {
    try {
      const res = await httpClient.get<{ success: boolean; data: any }>(
        `/contests/${contestId}/leaderboard`,
        { requiresAuth: false }
      );

      if (!res?.success || !res.data) return [];

      return (res.data as any[]).map((entry: any) => {
        const user = entry.student || entry.user || {};
        return {
          userId: user._id || user.id || "",
          name: user.name || "Người dùng ẩn danh",
          avatar: user.avatar || "",
          totalScore: entry.totalScore || 0,
          rank: entry.rank || 0,
          completedExamsCount: entry.examsCompleted || 0,
          isMe: false,
        };
      });
    } catch (error) {
      console.error("Lỗi getContestLeaderboard:", error);
      return [];
    }
  },

  /**
   * Đăng ký tham gia contest (gọi API thật)
   */
  joinContest: async (contestId: string, userId: string) => {
    try {
      const res = await httpClient.post<{ success: boolean; data?: any; message?: string }>(
        `/contests/${contestId}/join`,
        { userId },
        { requiresAuth: true }
      );
      console.log("Kết quả joinContest:", res);

      return {
        success: !!res?.success,
        message: res?.message,
        data: res?.data,
      };
    } catch (error) {
      console.error("Lỗi joinContest:", error);
      return { success: false };
    }
  },
  
};
