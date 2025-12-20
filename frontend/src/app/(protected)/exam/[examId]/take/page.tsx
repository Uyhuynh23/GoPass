"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { examService } from "@/services/exam/exam.service";
import TakeExamClient from "./TakeExamClient";

export default function TakeExamPage() {
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

        // Fetch exam data with context
        console.log("📖 Fetching exam data...", {
          examId,
          assignmentId,
          contestId,
        });
        const examData = await examService.getExamById(
          examId,
          assignmentId,
          contestId
        );

        if (!examData) {
          setError(true);
          return;
        }

        // Check if user has an active submission
        if (!examData.userSubmission) {
          console.log("⚠️ No submission found, creating one...");

          // Create a new submission
          const submission = await examService.createSubmission(
            examId,
            assignmentId,
            contestId
          );

          if (!submission) {
            console.error("❌ Failed to create submission");
            setError(true);
            return;
          }

          console.log("✅ Submission created:", submission._id);

          // Attach submission to exam data
          examData.userSubmission = submission;
        } else {
          console.log(
            "✅ Found existing submission:",
            examData.userSubmission._id
          );
        }

        setExam(examData);
      } catch (err) {
        console.error("❌ Error loading exam:", err);
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

  return <TakeExamClient exam={exam} />;
}
