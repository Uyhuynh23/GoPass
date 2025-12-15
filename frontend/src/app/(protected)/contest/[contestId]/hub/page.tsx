import React from "react";
import ContestHub from "@/features/contest/components/ContestHub";
import { MOCK_CONTEST_DETAIL } from "@/features/contest/data/mock-contest";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ContestHubPage({ params }: Props) {
  // 1. Lấy contestId (để đúng chuẩn Next.js, dù chưa dùng tới để fetch)
  const { contestId } = await params;

  // 2. Truyền trực tiếp Mock Data vào Component
  return <ContestHub data={MOCK_CONTEST_DETAIL} />;
}
