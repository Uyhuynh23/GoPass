import React from "react";
import { HistoryStats } from "@/features/dashboard/types/student";

interface HistoryStatsOverviewProps {
  stats: HistoryStats;
}

const HistoryStatsOverview: React.FC<HistoryStatsOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <h4 className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wide">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        Thống kê tổng quan
      </h4>

      {/* Gradient Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-xl overflow-hidden text-white font-bold text-center">
        <div className="bg-teal-500 p-4 md:p-6 flex flex-col justify-center">
          <span className="text-[10px] md:text-xs opacity-80 uppercase mb-1">Tổng bài thi</span>
          <span className="text-2xl md:text-3xl">{stats.totalExams}</span>
        </div>
        <div className="bg-teal-600 p-4 md:p-6 flex flex-col justify-center">
          <span className="text-[10px] md:text-xs opacity-80 uppercase mb-1">Điểm TB</span>
          <span className="text-2xl md:text-3xl">{stats.avgScore}</span>
        </div>
        <div className="bg-blue-500 p-4 md:p-6 flex flex-col justify-center">
          <span className="text-[10px] md:text-xs opacity-80 uppercase mb-1">Contest</span>
          <span className="text-2xl md:text-3xl">{stats.totalContests}</span>
        </div>
        <div className="bg-purple-600 p-4 md:p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <span className="text-[10px] md:text-xs opacity-80 uppercase mb-1">Luyện tập</span>
          <span className="text-2xl md:text-3xl">{stats.totalPractice}</span>
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Điểm cao nhất</p>
            <p className="text-2xl font-bold text-teal-600">{stats.highestScore}</p>
            <p className="text-xs text-gray-400">Môn: {stats.bestSubject}</p>
          </div>
          <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tổng thời gian</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalTime}</p>
            <p className="text-xs text-gray-400">phút luyện tập</p>
          </div>
          <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
    </div>
  );
};

export default HistoryStatsOverview;