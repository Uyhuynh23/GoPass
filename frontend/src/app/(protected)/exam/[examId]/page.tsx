"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { examService } from "@/services/exam/exam.service";
import ExamDetailClient from "./ExamDetailClient";

export default function ExamDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params?.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!examId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Get assignmentId and contestId from searchParams if present
        const assignmentId = searchParams?.get("assignmentId") || undefined;
        const contestId = searchParams?.get("contestId") || undefined;

        // Fetch exam data with optional assignment/contest context
        const examData = await examService.getExamById(
          examId,
          assignmentId,
          contestId
        );

        if (!examData) {
          setError(true);
        } else {
          setExam(examData);
        }
      } catch (err) {
        console.error("Error loading exam:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId, searchParams]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Exam Not Found
          </h1>
          <p className="text-gray-600">
            The exam you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <ExamDetailClient exam={exam} />;
}
