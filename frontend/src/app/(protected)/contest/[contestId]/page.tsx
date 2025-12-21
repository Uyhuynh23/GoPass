"use client";

import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import ContestLanding from "@/features/contest/components/ContestLanding";
import { contestService } from "@/services/contest/contest.service";
import { useAuth } from "@/features/auth/context/AuthContext";

interface Props {
  params: Promise<{ contestId: string }>;
}

export default function ContestEntryPage({ params }: Props) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [landingData, setLandingData] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (loading) return;
      // Allow viewing without auth (detail is public). Only gate join/start in component.

      try {
        setIsFetching(true);
        const { contestId } = await params;
        const contestDetail = await contestService.getContestDetail(contestId);
        if (!contestDetail) {
          setFetchError("not-found");
          return;
        }

        const subjects = contestDetail.subjects || [];
        const completedCount = subjects.filter(
          (s) => s.userStatus === "completed"
        ).length;
        const totalCount = subjects.length;

        const hasJoined = !!contestDetail.participation;
        const isFinished = completedCount === totalCount && totalCount > 0;

        setLandingData({
          id: contestDetail._id,
          name: contestDetail.name,
          description: contestDetail.description || "",
          startTime: contestDetail.startTime,
          endTime: contestDetail.endTime,
          participantCount: contestDetail.participantsCount,
          userProgress: {
            hasJoined,
            completed: completedCount,
            total: totalCount,
            isFinished,
          },
        });
      } catch (err: any) {
        console.error("Failed to load contest detail:", err);
        setFetchError(err?.message || "error");
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [user, loading, params, router]);

  if (fetchError === "not-found") return notFound();

  if (loading || isFetching || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải cuộc thi...
      </div>
    );
  }

  return <ContestLanding data={landingData} />;
}
