import React from "react";
import ContestLanding from "@/features/contest/components/ContestLanding";
import { MOCK_CONTEST_DETAIL } from "@/features/contest/data/mock-contest";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ContestEntryPage({ params }: Props) {
  const { contestId } = await params;

  // Logic tính toán tiến độ (Simulation)
  // Trong thực tế, bạn sẽ check userStatus của từng môn trong contest detail
  const subjects = MOCK_CONTEST_DETAIL.subjects || [];
  const completedCount = subjects.filter(
    (s) => s.userStatus === "completed"
  ).length;
  const totalCount = subjects.length;
  const hasJoined = subjects.some((s) => s.userStatus !== "locked"); // Nếu có môn nào đã mở/làm -> Đã tham gia
  const isFinished = completedCount === totalCount && totalCount > 0;

  const landingData = {
    id: contestId,
    name: MOCK_CONTEST_DETAIL.name,
    description: MOCK_CONTEST_DETAIL.description || "",
    startTime: MOCK_CONTEST_DETAIL.startTime,
    endTime: MOCK_CONTEST_DETAIL.endTime,
    participantCount: 1247,

    // ✅ TRUYỀN DỮ LIỆU TIẾN ĐỘ
    userProgress: {
      hasJoined: true, // Mock là true để test nút "Tiếp tục"
      completed: completedCount,
      total: totalCount,
      isFinished: isFinished,
    },
  };

  return <ContestLanding data={landingData} />;
}
