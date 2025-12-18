import React from "react";
import { notFound } from "next/navigation";
import ContestLanding from "@/features/contest/components/ContestLanding";
import { contestService } from "@/services/contest/contest.service";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ContestEntryPage({ params }: Props) {
  const { contestId } = await params;

  // 1. Gọi API lấy dữ liệu thật
  const contestDetail = await contestService.getContestDetail(contestId);

  if (!contestDetail) return notFound();

  // 2. Tính toán các chỉ số cho UI Landing
  const subjects = contestDetail.subjects || [];
  const completedCount = subjects.filter(
    (s) => s.userStatus === "completed"
  ).length;
  const totalCount = subjects.length;

  // Check xem user đã tham gia chưa (có record participation)
  const hasJoined = !!contestDetail.participation;
  const isFinished = completedCount === totalCount && totalCount > 0;

  // 3. Map sang format mà Component ContestLanding cần
  const landingData = {
    id: contestDetail._id,
    name: contestDetail.name,
    description: contestDetail.description || "",
    startTime: contestDetail.startTime,
    endTime: contestDetail.endTime,
    participantCount: contestDetail.participantsCount,

    userProgress: {
      hasJoined: hasJoined,
      completed: completedCount,
      total: totalCount,
      isFinished: isFinished,
    },
  };

  return <ContestLanding data={landingData} />;
}
