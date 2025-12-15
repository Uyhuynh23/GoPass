import React from "react";
import ContestLeaderboard from "@/features/contest/components/ContestLeaderboard";
import { MOCK_CONTEST_DETAIL } from "@/features/contest/data/mock-contest";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function LeaderboardPage({ params }: Props) {
  const { contestId } = await params;

  // Ép kiểu (as any) nếu mock data của bạn thiếu một số trường optional
  // hoặc đảm bảo MOCK_CONTEST_DETAIL khớp hoàn toàn với interface ContestDetail
  return <ContestLeaderboard data={MOCK_CONTEST_DETAIL as any} />;
}
