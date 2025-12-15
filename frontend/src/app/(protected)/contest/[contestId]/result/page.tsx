import React from "react";
import ContestResult from "@/features/contest/components/ContestResult";
import { MOCK_CONTEST_DETAIL } from "@/features/contest/data/mock-contest";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { contestId } = await params;

  // Kiểm tra xem dữ liệu mock có đầy đủ không trước khi truyền
  return <ContestResult data={MOCK_CONTEST_DETAIL} />;
}
