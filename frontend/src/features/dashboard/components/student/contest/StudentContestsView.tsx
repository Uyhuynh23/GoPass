"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation"; 
import { MOCK_CONTESTS } from "@/features/dashboard/data/mock-contests";
import ContestCard from "./ContestCard"; // Import component con

const StudentContestsView = () => {
  const [filterSubject, setFilterSubject] = useState("all");

  // --- Logic: Filter Contests ---
  const filteredContests = MOCK_CONTESTS.filter((contest) => {
    if (filterSubject === "all") return true;
    return contest.subjects.includes(filterSubject);
  });

  // Group by status
  const ongoing = filteredContests.filter((c) => c.status === "ongoing");
  const upcoming = filteredContests.filter((c) => c.status === "upcoming");
  const completed = filteredContests.filter((c) => c.status === "completed");

  const subjectOptions = ["Toán", "Ngữ Văn", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học", "Lịch Sử", "Địa Lý"];

  // --- Handlers ---
  const handleJoin = (id: number) => console.log(`Join: ${id}`);
  const handleViewResult = (id: number) => console.log(`Result: ${id}`);

  return (
    <div className="pb-10 space-y-8">
      {/* --- HEADER SECTION --- */}
      <div className="rounded-2xl overflow-hidden shadow-sm relative bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              </span>
              Các cuộc thi
            </h2>
            <p className="text-teal-50 mt-2 max-w-xl text-sm md:text-base opacity-90">
              Tham gia các kỳ thi trực tuyến và cạnh tranh với học sinh toàn quốc.
            </p>
          </div>

          <div className="relative w-full md:w-auto">
            <select
              className="w-full md:w-56 appearance-none bg-white/10 border border-white/30 text-white py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent cursor-pointer text-sm font-medium hover:bg-white/20 transition-all"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all" className="text-gray-700">Tất cả môn học</option>
              {subjectOptions.map(sub => (
                <option key={sub} value={sub} className="text-gray-700">{sub}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: ONGOING --- */}
      {ongoing.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-teal-700 text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            Đang diễn ra
          </h3>
          <div className="grid gap-4">
            {ongoing.map((contest) => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                onJoin={handleJoin} 
                onViewResult={handleViewResult} 
              />
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 2: UPCOMING --- */}
      {upcoming.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-teal-700 text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Sắp diễn ra
          </h3>
          <div className="grid gap-4">
            {upcoming.map((contest) => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                onJoin={handleJoin} 
                onViewResult={handleViewResult} 
              />
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 3: COMPLETED --- */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-teal-700 text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Đã hoàn thành
          </h3>
          <div className="grid gap-4">
            {completed.map((contest) => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                onJoin={handleJoin} 
                onViewResult={handleViewResult} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentContestsView;