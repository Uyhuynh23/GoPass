"use client";

import React, { useState } from "react";
import { MOCK_HISTORY_ITEMS, MOCK_HISTORY_STATS } from "@/features/dashboard/data/mock-history";
import HistoryItemCard from "./HistoryItemCard"; // 1. Import Card
import HistoryStatsOverview from "./HistoryStatsOverview"; // 2. Import Stats

const StudentHistoryView = () => {
  const [filterType, setFilterType] = useState<string>("all");

  // --- Logic: Filter History ---
  const filteredHistory = MOCK_HISTORY_ITEMS.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  // --- Handlers ---
  const handleReview = (id: number) => console.log(`Review: ${id}`);
  const handleLeaderboard = (id: number) => console.log(`Leaderboard: ${id}`);

  return (
    <div className="pb-10 space-y-8">
      
      {/* --- 1. MAIN HISTORY LIST --- */}
      <div className="border border-teal-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        
        {/* Header */}
        <div className="bg-teal-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-teal-100">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            Lịch sử làm bài
          </h2>

          {/* Filter Dropdown */}
          <div className="relative">
             <select 
               className="appearance-none bg-white border border-teal-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-sm font-medium hover:border-teal-300 transition-colors shadow-sm"
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
             >
               <option value="all">Tất cả hoạt động</option>
               <option value="contest">Contest</option>
               <option value="practice_global">Luyện tập (Hệ thống)</option>
               <option value="practice_class">Bài tập lớp</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
             </div>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 bg-white space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <HistoryItemCard
                key={item.id}
                item={item}
                onReview={handleReview}
                onLeaderboard={handleLeaderboard}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center">
              <svg className="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <p>Chưa có dữ liệu lịch sử nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- 2. STATISTICS SUMMARY FOOTER --- */}
      <HistoryStatsOverview stats={MOCK_HISTORY_STATS} />

    </div>
  );
};

export default StudentHistoryView;