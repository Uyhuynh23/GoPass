"use client";

import React from "react";
import CreateContestView from "@/features/dashboard/components/admin/contest/CreateContestView";
import StudentContestsView from "@/features/dashboard/components/student/contest/StudentContestsView";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

export default function ContestsPage() {
  const { userRole } = useDashboard();

  // Admin sees contest creation, students see contest list
  return userRole === "admin" ? <CreateContestView /> : <StudentContestsView />;
}
