// src/features/dashboard/components/student/StudentDashboardView.tsx
"use client";

import React from "react";
import StudentStatsGrid from "./StudentStatsGrid";
import MyClassesWidget from "./MyClassesWidget";
import SubjectPerformanceWidget from "./SubjectPerformanceWidget";
import ActivityChartWidget from "./ActivityChartWidget";
import { mockStudentData } from "@/features/dashboard/data/student/mock-student";
import { calculateStudentStats } from "@/utils/studentStatsHelper";

const StudentDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 pb-10">
      {/* 1. Top Section: 4 Stats Cards (Teal, Green, Blue, Pink) */}
      <StudentStatsGrid/>

      {/* 2. Middle Section: My Classes Widget (Full Width) */}
      <div className="grid grid-cols-1 gap-6">
        <MyClassesWidget />
      </div>

      {/* 3. Bottom Section: Activity Chart & Subject Performance (Split 50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <ActivityChartWidget/>
        <SubjectPerformanceWidget />
      </div>
    </div>
  );
};

export default StudentDashboardView;