import React from "react";
import { notFound } from "next/navigation";
import ContestLeaderboard from "@/features/contest/components/ContestLeaderboard";
import { contestService } from "@/services/contest/contest.service";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function LeaderboardPage({ params }: Props) {
  const { contestId } = await params;

  // 1. Fetch song song: Info Contest + Bảng xếp hạng
  const [contestDetail, leaderboard] = await Promise.all([
    contestService.getContestDetail(contestId),
    contestService.getContestLeaderboard(contestId),
  ]);

  if (!contestDetail) return notFound();

  // 2. Gán leaderboard vừa fetch vào object detail để truyền xuống UI
  const dataWithLeaderboard = {
    ...contestDetail,
    leaderboard: leaderboard,
  };

  return <ContestLeaderboard data={dataWithLeaderboard} />;
}
