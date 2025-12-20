// src/features/dashboard/components/student/SubjectPerformanceWidget.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchSubjectPerformance } from "@/services/student/studentStatsApi";
import { SubjectPerformance } from "@/features/dashboard/types/student";

const SubjectPerformanceWidget = () => {
  const [subjects, setSubjects] = useState<SubjectPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubjectPerformance = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSubjectPerformance();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to load subject performance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjectPerformance();
  }, []);

  // Helper function to determine color based on score
  const getColorConfig = (score: number) => {
    if (score >= 8.0) {
      return {
        bar: "bg-emerald-500",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
        bg: "bg-emerald-100", // Optional: lighter background for contrast
      };
    } else if (score >= 6.5) {
      return {
        bar: "bg-teal-600",
        text: "text-teal-700",
        dot: "bg-teal-600",
        bg: "bg-teal-100",
      };
    } else {
      return {
        bar: "bg-yellow-500",
        text: "text-yellow-600",
        dot: "bg-yellow-500",
        bg: "bg-yellow-100",
      };
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-teal-50 shadow-sm h-full flex flex-col">
      {/* Widget Header */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
           <span className="text-purple-500 bg-purple-50 p-1.5 rounded-lg">📊</span> 
           Thành tích theo môn học
        </h3>
        <p className="text-xs text-gray-400 mt-1 pl-9">
          Điểm trung bình các bài thi đã hoàn thành
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : subjects.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
          <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">Chưa có dữ liệu</p>
          <p className="text-xs mt-1">Hoàn thành bài thi để xem thống kê</p>
        </div>
      ) : (
        /* Subject List */
        <div className="space-y-5 flex-1">
          {subjects.map((sub, idx) => {
            const colors = getColorConfig(sub.score);
            
            return (
              <div key={idx}>
                {/* Label Row */}
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {/* Dynamic colored dot */}
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span> 
                    {sub.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {sub.total} bài thi 
                    {/* Dynamic colored score text */}
                    <span className={`font-bold text-sm ml-1 ${colors.text}`}>
                      {sub.score}
                    </span>
                    /10
                  </span>
                </div>
                
                {/* Progress Bar Background */}
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  {/* Dynamic colored progress bar */}
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                    style={{ width: `${(sub.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend / Footer */}
      <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Giỏi (≥8.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span> Khá (6.5-7.9)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> TB ({'<'}6.5)
          </span>
       </div>
    </div>
  );
};

export default SubjectPerformanceWidget;