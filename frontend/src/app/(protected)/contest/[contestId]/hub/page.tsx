import React from "react";
import { notFound } from "next/navigation";
import ContestHub from "@/features/contest/components/ContestHub";
import { contestService } from "@/services/contest/contest.service";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ContestHubPage({ params }: Props) {
  const { contestId } = await params;

  // 1. Fetch dữ liệu từ API
  const contestDetail = await contestService.getContestDetail(contestId);

  if (!contestDetail) return notFound();

  return <ContestHub data={contestDetail} />;
}
