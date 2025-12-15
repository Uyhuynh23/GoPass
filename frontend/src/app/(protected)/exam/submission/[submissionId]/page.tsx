import React from "react";
import { notFound } from "next/navigation";
import { submissionService } from "@/services/exam/submission.service";
import ReviewExamClient from "./ReviewExamClient";

export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  // 1. Fetch Submission Data (Kèm Exam & Questions)
  // Backend cần trả về structure: { submission, exam, questions }
  const data = await submissionService.getSubmissionDetails(submissionId);

  if (!data) return notFound();

  return <ReviewExamClient data={data} />;
}
