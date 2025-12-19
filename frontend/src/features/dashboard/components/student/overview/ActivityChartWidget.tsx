// src/features/dashboard/components/student/ActivityChartWidget.tsx
"use client";

import React, { useEffect, useState } from "react";
import PerformanceChart from "./PerformanceChart";
import { PerformanceDataPoint } from "@/features/dashboard/types/student";
import { fetchStudentActivity } from "@/services/student/studentStatsApi"; // Import API

// Không cần Props nữa
const ActivityChartWidget: React.FC = () => {
  const [data, setData] = useState<PerformanceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcode ID
  const currentStudentId = "694425e97eff90a0a3cdc635";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const activityData = await fetchStudentActivity();
      setData(activityData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-teal-50 shadow-sm h-full flex flex-col min-h-[350px]">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="flex-1 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-teal-50 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          <span className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">📈</span> 
          Hoạt động 7 ngày qua
        </h3>
        <p className="text-xs text-gray-400 mt-1 pl-9">
          Số bài thi và thời gian học mỗi ngày
        </p>
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 min-h-[250px] w-full">
        {/* Truyền data thật vào chart */}
        <PerformanceChart data={data} />
      </div>
    </div>
  );
};

export default ActivityChartWidget;