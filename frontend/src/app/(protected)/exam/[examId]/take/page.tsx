// src/app/(protected)/exam/[examId]/take/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import { examService } from "@/services/exam/exam.service";
import TakeExamClient from "./TakeExamClient";

export default async function TakeExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  // 1. Resolve Params (Next.js 15)
  const { examId } = await params;

  // 2. Fetch Data (Server-side)
  // Gọi service (đã được giả lập async)
  const exam = await examService.getExamById(examId);

  // 3. Handle 404
  if (!exam) {
    notFound();
  }

  // 4. Render Client Interface
  return <TakeExamClient exam={exam} />;
}
