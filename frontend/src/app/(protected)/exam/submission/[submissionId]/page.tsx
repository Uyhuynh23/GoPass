"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound as clientNotFound } from "next/navigation";
import { submissionService } from "@/services/exam/submission.service";
import ReviewExamClient from "./ReviewExamClient";

export default function ReviewSubmissionPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!submissionId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const submissionData = await submissionService.getSubmissionDetails(
          submissionId
        );

        if (!submissionData) {
          setError(true);
        } else {
          setData(submissionData);
        }
      } catch (err) {
        console.error("Error loading submission:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Submission Not Found
          </h1>
          <p className="text-gray-600">
            The submission you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <ReviewExamClient data={data} />;
}
