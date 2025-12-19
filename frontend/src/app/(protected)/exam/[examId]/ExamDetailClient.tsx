"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StartExamPanel } from "@/features/exam/components/exam-instructions";
import { ExamWithDetails } from "@/features/exam/types";
import { examStorage } from "@/utils/exam-storage";
import { examService } from "@/services/exam/exam.service";

interface Props {
  exam: ExamWithDetails;
}

export default function ExamDetailClient({ exam }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasProgress, setHasProgress] = useState(false);
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false);

  // Get assignment/contest IDs from URL if present
  const assignmentId = searchParams?.get("assignmentId") || undefined;
  const contestId = searchParams?.get("contestId") || undefined;

  // Check storage khi mount (Client-side only)
  useEffect(() => {
    setHasProgress(examStorage.hasProgress(exam._id));
  }, [exam._id]);

  const handleStartNew = async () => {
    try {
      setIsCreatingSubmission(true);

      // Clear old progress
      examStorage.clear(exam._id);

      console.log("🆕 Creating new submission...", {
        examId: exam._id,
        assignmentId,
        contestId,
      });

      // Create submission via API
      const submission = await examService.createSubmission(
        exam._id,
        assignmentId,
        contestId
      );

      if (!submission) {
        alert("Failed to start exam. Please try again.");
        setIsCreatingSubmission(false);
        return;
      }

      console.log("✅ Submission created:", submission._id);

      // Build URL with query params
      const params = new URLSearchParams();
      if (assignmentId) params.append("assignmentId", assignmentId);
      if (contestId) params.append("contestId", contestId);
      const queryString = params.toString();

      // Navigate to take page
      router.push(
        `/exam/${exam._id}/take${queryString ? `?${queryString}` : ""}`
      );
    } catch (error) {
      console.error("❌ Error starting exam:", error);
      alert("Failed to start exam. Please try again.");
      setIsCreatingSubmission(false);
    }
  };

  const handleContinue = () => {
    // Giữ nguyên dữ liệu -> Context sẽ tự load
    const params = new URLSearchParams();
    if (assignmentId) params.append("assignmentId", assignmentId);
    if (contestId) params.append("contestId", contestId);
    const queryString = params.toString();

    router.push(
      `/exam/${exam._id}/take${queryString ? `?${queryString}` : ""}`
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <StartExamPanel
      examTitle={exam.title}
      examSubject={exam.subject}
      durationMinutes={exam.durationMinutes}
      totalQuestions={exam.totalQuestions || 0}
      totalPoints={exam.totalPoints || 0}
      onStartExam={handleStartNew}
      onContinueExam={handleContinue}
      hasProgress={hasProgress}
      onCancel={handleCancel}
      isLoading={isCreatingSubmission}
    />
  );
}
