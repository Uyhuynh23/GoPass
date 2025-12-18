"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StartExamPanel } from "@/features/exam/components/exam-instructions";
import { ExamWithDetails } from "@/features/exam/types";
import { examStorage } from "@/utils/exam-storage";

interface Props {
  exam: ExamWithDetails;
}

export default function ExamDetailClient({ exam }: Props) {
  const router = useRouter();
  const [hasProgress, setHasProgress] = useState(false);

  // Check storage khi mount (Client-side only)
  useEffect(() => {
    setHasProgress(examStorage.hasProgress(exam._id));
  }, [exam._id]);

  const handleStartNew = () => {
    // Nếu bắt đầu mới -> Xóa dữ liệu cũ
    examStorage.clear(exam._id);
    router.push(`/exam/${exam._id}/take`);
  };

  const handleContinue = () => {
    // Giữ nguyên dữ liệu -> Context sẽ tự load
    router.push(`/exam/${exam._id}/take`);
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
    />
  );
}
