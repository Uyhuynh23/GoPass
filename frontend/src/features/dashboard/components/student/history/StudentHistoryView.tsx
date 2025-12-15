"use client";

import React, { useState, useEffect } from "react";
import HistoryItemCard from "./HistoryItemCard";
import HistoryStatsOverview from "./HistoryStatsOverview";

// Import Types và API
import { HistoryItem, HistoryStats } from "@/features/dashboard/types/student/";
import { fetchStudentHistory } from "@/services/student/studentStatsApi";

const StudentHistoryView = () => {
  // State Data
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // State Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [timeSort, setTimeSort] = useState<string>("newest"); // "newest" | "oldest"

  // Hardcode ID (Sau này lấy từ Auth)
  const currentStudentId = "u_student_01";

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchStudentHistory(currentStudentId);
      setHistoryList(data.list);
      setStats(data.stats);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- LOGIC FILTER & SORT ---
  const processedHistory = historyList
    .filter((item) => {
      // 1. Filter by Type
      if (typeFilter === "all") return true;
      return item.type === typeFilter;
    })
    .sort((a, b) => {
      // 2. Sort by Time
      // Chuyển đổi chuỗi ngày "DD/MM/YYYY" sang Date object để so sánh
      // Lưu ý: data trả về đang là "dd/mm/yyyy"
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`).getTime();
      };

      const timeA = parseDate(a.completedDate);
      const timeB = parseDate(b.completedDate);

      if (timeSort === "newest") return timeB - timeA; // Giảm dần
      return timeA - timeB; // Tăng dần (oldest)
    });

  const handleReview = (id: number | string) => console.log(`Review: ${id}`);
  const handleLeaderboard = (id: number | string) => console.log(`Leaderboard: ${id}`);

  if (loading || !stats) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="pb-10 space-y-8">
      
      {/* --- 1. MAIN HISTORY LIST --- */}
      <div className="border border-teal-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        
        {/* Header Title */}
        <div className="bg-teal-50/50 px-6 py-4 border-b border-teal-100">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            Lịch sử làm bài
          </h2>
        </div>

        {/* --- FILTER TOOLBAR --- */}
        <div className="px-6 pt-6 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Filter 1: Loại bài (Type) */}
            <div>
              <div className="flex items-center w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white relative transition-all hover:border-teal-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <span className="text-gray-500 text-sm whitespace-nowrap mr-3 select-none font-medium">Loại bài:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 focus:outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="all">Tất cả hoạt động</option>
                  <option value="contest">Contest (Thi đấu)</option>
                  <option value="practice_class">Bài tập lớp</option>
                  <option value="practice_global">Luyện tập tự do</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Filter 2: Thời gian (Sort) */}
            <div>
              <div className="flex items-center w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white relative transition-all hover:border-teal-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <span className="text-gray-500 text-sm whitespace-nowrap mr-3 select-none font-medium">Thời gian:</span>
                <select
                  value={timeSort}
                  onChange={(e) => setTimeSort(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 focus:outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="newest">Mới nhất trước</option>
                  <option value="oldest">Cũ nhất trước</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* List Content */}
        <div className="p-6 bg-white space-y-4">
          {processedHistory.length > 0 ? (
            processedHistory.map((item) => (
              <HistoryItemCard
                key={item.id}
                item={item}
                onReview={() => handleReview(item.id)}
                onLeaderboard={() => handleLeaderboard(item.id)}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy bài làm nào phù hợp.</p>
              <button 
                onClick={() => { setTypeFilter("all"); setTimeSort("newest"); }}
                className="mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- 2. STATISTICS SUMMARY FOOTER --- */}
      <HistoryStatsOverview stats={stats} />

    </div>
  );
};

export default StudentHistoryView;