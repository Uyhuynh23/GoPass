// src/services/contest/contest.service.ts
import {
  ContestDetail,
  ContestSubjectUI,
  LeaderboardItem,
  UserInfo,
} from "@/features/contest/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    userId: string = "student-01"
  ): Promise<ContestDetail | null> => {
    try {
      // 1. Gọi các API cơ bản song song
      const [contestRes, examsConfigRes, partRes] = await Promise.all([
        fetch(`${API_URL}/contests/${contestId}`, { cache: "no-store" }),
        fetch(
          `${API_URL}/contest_exams?contestId=${contestId}&_sort=order&_order=asc`,
          { cache: "no-store" }
        ),
        fetch(
          `${API_URL}/contest_participations?contestId=${contestId}&userId=${userId}`,
          { cache: "no-store" }
        ),
      ]);

      if (!contestRes.ok) return null;

      const contestData = await contestRes.json();
      const examsConfig = await examsConfigRes.json();
      const partDataArray = await partRes.json();

      // 2. Fetch thông tin chi tiết của các bài thi (Title, Duration...)
      // Tạo query string dạng: id=exam-001&id=exam-002...
      const examIdsQuery = examsConfig
        .map((cfg: any) => `id=${cfg.examId}`)
        .join("&");

      const examsDetailRes = await fetch(`${API_URL}/exams?${examIdsQuery}`, {
        cache: "no-store",
      });

      // ✅ Ép kiểu kết quả trả về thành mảng ExamLookup[]
      const examsDetail = (await examsDetailRes.json()) as ExamLookup[];

      // ✅ Tạo Map với kiểu dữ liệu rõ ràng <string, ExamLookup>
      const examsMap = new Map<string, ExamLookup>(
        examsDetail.map((e) => [e.id, e])
      );

      // 3. Xử lý Logic Participation
      const participation = partDataArray.length > 0 ? partDataArray[0] : null;
      const completedExams = new Set(participation?.completedExams || []);

      // 4. Map dữ liệu (Ghép Config + Exam Detail)
      const subjects: ContestSubjectUI[] = examsConfig.map(
        (cfg: any, index: number) => {
          // Lấy thông tin chi tiết từ Map (TypeScript giờ đã hiểu examInfo là ExamLookup | undefined)
          const examInfo = examsMap.get(cfg.examId);

          // Logic Domino (Mở khóa)
          let status: "locked" | "ready" | "completed" = "locked";
          if (completedExams.has(cfg.examId)) {
            status = "completed";
          } else {
            if (index === 0) {
              status = "ready";
            } else {
              const prevExamId = examsConfig[index - 1].examId;
              if (completedExams.has(prevExamId)) {
                status = "ready";
              }
            }
          }

          return {
            contestExamId: cfg.id,
            examId: cfg.examId,
            order: cfg.order,
            weight: cfg.weight,
            // ✅ Hết lỗi: TypeScript đã nhận diện được các thuộc tính của examInfo
            title: examInfo?.title || "Bài thi đang cập nhật",
            subject: examInfo?.subject || "Môn thi",
            durationMinutes: examInfo?.durationMinutes || 0,
            totalQuestions: examInfo?.totalQuestions || 0,
            userStatus: status,
          };
        }
      );

      return {
        _id: contestData.id,
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
        subjects: subjects,
        participation: participation,
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
      const res = await fetch(
        `${API_URL}/contest_participations?contestId=${contestId}&_sort=totalScore&_order=desc`,
        { cache: "no-store" }
      );
      if (!res.ok) return [];
      const participations = await res.json();

      const usersRes = await fetch(`${API_URL}/users`, { cache: "no-store" });
      const allUsers = (await usersRes.json()) as UserInfo[];
      const userMap = new Map<string, UserInfo>(allUsers.map((u) => [u.id, u]));

      return participations.map((p: any, index: number) => {
        const user = userMap.get(p.userId);
        return {
          userId: p.userId,
          name: user?.name || "Người dùng ẩn danh",
          avatar: user?.avatar || "",
          totalScore: p.totalScore,
          rank: index + 1,
          completedExamsCount: p.completedExams?.length || 0,
          isMe: p.userId === "student-01",
        };
      });
    } catch (error) {
      console.error("Lỗi getContestLeaderboard:", error);
      return [];
    }
  },

  /**
   * ✅ MỚI: Hàm đăng ký tham gia contest (Dùng cho nút "Tham gia")
   */
  joinContest: async (contestId: string, userId: string = "student-01") => {
    try {
      // 1. Kiểm tra xem đã tham gia chưa (để tránh spam)
      const checkRes = await fetch(
        `${API_URL}/contest_participations?contestId=${contestId}&userId=${userId}`
      );
      const existing = await checkRes.json();
      if (existing.length > 0) {
        return { success: true, message: "Đã tham gia rồi" };
      }

      // 2. Tạo bản ghi tham gia mới (POST)
      const newParticipation = {
        contestId,
        userId,
        enrolledAt: new Date().toISOString(),
        completedExams: [], // Mới vào chưa làm gì
        totalScore: 0,
        rank: null,
        percentile: null,
      };

      await fetch(`${API_URL}/contest_participations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParticipation),
      });

      // 3. Tăng biến đếm người tham gia (Logic thủ công: Get -> Patch)
      // Lấy số lượng hiện tại
      const contestRes = await fetch(`${API_URL}/contests/${contestId}`);
      const contestInfo = await contestRes.json();
      const currentCount = contestInfo.participantsCount || 0;

      // Cập nhật số lượng mới (+1)
      await fetch(`${API_URL}/contests/${contestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantsCount: currentCount + 1 }),
      });

      return { success: true };
    } catch (error) {
      console.error("Lỗi joinContest:", error);
      return { success: false };
    }
  },
};
