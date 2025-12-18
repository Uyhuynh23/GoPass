import React from "react";
import { notFound } from "next/navigation";
import ContestResult from "@/features/contest/components/ContestResult";
import { contestService } from "@/services/contest/contest.service";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { contestId } = await params;

  // 1. Fetch dữ liệu chi tiết (đã bao gồm participation chứa rank, percentile)
  const contestDetail = await contestService.getContestDetail(contestId);

  if (!contestDetail) return notFound();

  return <ContestResult data={contestDetail} />;
}
