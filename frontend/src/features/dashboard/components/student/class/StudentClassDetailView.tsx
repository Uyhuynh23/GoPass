"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClassDetail } from "@/features/dashboard/types/student/";
import ClassAssignmentItem from "./ClassAssignmentItem";

// ==========================================
// 1. TYPES & HELPER
// ==========================================

type AvailabilityFilter = 'all' | 'ongoing' | 'upcoming' | 'ended';
type CompletionFilter = 'all' | 'completed' | 'not_completed';

const getAvailability = (startStr: string, endStr: string) => {
  const now = new Date();
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (now > end) return 'ended';
  if (now >= start && now <= end) return 'ongoing';
  return 'upcoming';
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

interface StudentClassDetailViewProps {
  classData: ClassDetail;
}

const StudentClassDetailView: React.FC<StudentClassDetailViewProps> = ({ classData }) => {
  const router = useRouter();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  // --- LOGIC FILTER ---
  const filteredAssignments = useMemo(() => {
    return classData.assignments.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const availability = getAvailability(item.startTime, item.endTime);
      let matchesAvailability = true;
      if (availabilityFilter !== 'all') matchesAvailability = availability === availabilityFilter;

      const isCompleted = item.status === 'completed';
      let matchesCompletion = true;
      if (completionFilter === 'completed') matchesCompletion = isCompleted;
      else if (completionFilter === 'not_completed') matchesCompletion = !isCompleted;

      return matchesSearch && matchesAvailability && matchesCompletion;
    });
  }, [classData.assignments, searchTerm, availabilityFilter, completionFilter]);

  // --- STATS CALCULATION ---
  const totalAssignments = classData.assignments.filter((a) => {
    const availability = getAvailability(a.startTime, a.endTime);
    return availability === 'ongoing' || availability === 'ended';
  }).length;

  const assignmentsDone = classData.assignments.filter((a) => {
    const availability = getAvailability(a.startTime, a.endTime);
    return (availability === 'ongoing' || availability === 'ended') && a.status === 'completed';
  }).length;

  const assignmentsLeft = classData.assignments.filter((a) => {
    const availability = getAvailability(a.startTime, a.endTime);
    const isCompleted = a.status === 'completed';
    return availability === 'ongoing' && !isCompleted;
  }).length;
  const progressPercent = totalAssignments > 0 ? Math.round((assignmentsDone / totalAssignments) * 100) : 0;

  // --- HANDLERS ---
  const handleBack = () => router.back();
  const handleStartAssignment = (id: string | number) => console.log(`Start: ${id}`);
  const handleViewResult = (id: string | number) => console.log(`Result: ${id}`);

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- HEADER BANNER --- */}
      <div className="rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

        <button onClick={handleBack} className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium mb-6 w-fit relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg> Quay lại
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{classData.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
              <span>{classData.teacher}</span>
              <span className="opacity-60">•</span>
              <span>Mã: {classData.code}</span>
              <span className="opacity-60">•</span>
              <span>{classData.studentsCount} học sinh</span>
            </div>
          </div>
          <div className="flex gap-2 self-start md:self-end">
            <span className="bg-white/20 px-3 py-1.5 rounded text-sm font-medium">{classData.subject}</span>
          </div>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Tổng số bài thi</p>
            <p className="text-3xl font-medium text-gray-800 mt-1">{totalAssignments}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
        </div>
        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Đã hoàn thành</p>
            <p className="text-3xl font-medium text-gray-800 mt-1">{assignmentsDone}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
        {/* Avg Score */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Điểm trung bình</p>
            <p className="text-3xl font-medium text-blue-600 mt-1">{classData.stats.avgScore}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
        </div>
        {/* Rank */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Xếp hạng</p>
            <p className="text-3xl font-medium text-purple-600 mt-1">#{classData.stats.rank}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center shadow-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
        </div>
      </div>

     {/* --- PROGRESS SECTION --- */}
      {/* Container: Nền trắng, viền, bo góc, overflow-hidden */}
      <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
        
        {/* HEADER: Chỉ phần này có nền xanh */}
        <div className="bg-teal-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-teal-200">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
              Tiến độ học tập
          </h2>
        </div>
        
        {/* BODY: Nội dung bên dưới nền trắng */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
            {/* Left: Progress Bar */}
            <div className="flex-1">
               <div className="flex justify-between items-end mb-2 text-xs font-medium text-gray-500">
                  <span>Hoàn thành</span>
                  <span>{assignmentsDone}/{totalAssignments}</span>
               </div>
               <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
               </div>
            </div>

            {/* Right: Info Boxes */}
            <div className="flex gap-3 shrink-0">
               <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 w-24 text-center">
                  <div className="flex justify-center text-teal-500 mb-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Tiến độ</div>
                  <div className="text-lg font-bold text-teal-700">{progressPercent}%</div>
               </div>
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 w-24 text-center">
                  <div className="flex justify-center text-blue-500 mb-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Còn lại</div>
                  <div className="text-lg font-bold text-blue-700">{assignmentsLeft} bài</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. ASSIGNMENTS LIST CONTAINER (UPDATED HEADER) */}
      {/* ========================================================= */}
      
      {/* Container: Bỏ p-6 cũ, thêm overflow-hidden để header không bị lòi ra ngoài bo góc */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[500px] overflow-hidden">
        
        {/* --- [NEW] HEADER BANNER THEO YÊU CẦU --- */}
        <div className="bg-teal-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-teal-200">
          <h2 className="font-bold text-teal-900 flex items-center gap-3 text-lg">
            <span className="text-teal-600 bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </span>
            Danh sách bài thi
          </h2>
          
          {/* Badge đếm số lượng */}
          <span className="text-xs font-bold text-teal-700 bg-white px-3 py-1 rounded-full border border-teal-100 shadow-sm">
             {filteredAssignments.length} bài
          </span>
        </div>

        {/* --- BODY (FILTER & LIST) --- */}
        <div className="p-6"> {/* Thêm padding cho nội dung bên dưới header */}

          {/* Filter Toolbar (No Ring) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-6">
              <input
                type="text"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm transition-colors"
                placeholder="Nhập tên bài tập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white relative transition-colors focus-within:border-gray-500 focus-within:ring-0">
                <span className="text-gray-500 text-sm whitespace-nowrap mr-2 select-none">Thời gian:</span>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-900 focus:ring-0 focus:outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="all">Tất cả</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="upcoming">Sắp mở</option>
                  <option value="ended">Đã kết thúc</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white relative transition-colors focus-within:border-gray-500 focus-within:ring-0">
                <span className="text-gray-500 text-sm whitespace-nowrap mr-2 select-none">Trạng thái:</span>
                <select
                  value={completionFilter}
                  onChange={(e) => setCompletionFilter(e.target.value as CompletionFilter)}
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-900 focus:ring-0 focus:outline-none cursor-pointer appearance-none z-10"
                >
                  <option value="all">Tất cả</option>
                  <option value="completed">Đã làm xong</option>
                  <option value="not_completed">Chưa làm bài</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-3">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((item) => (
                <ClassAssignmentItem
                  key={item.id}
                  assignment={item}
                  onStart={handleStartAssignment}
                  onViewResult={handleViewResult}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">Không tìm thấy bài tập nào</p>
                <button 
                  onClick={() => { setSearchTerm(""); setAvailabilityFilter("all"); setCompletionFilter("all"); }}
                  className="mt-2 text-sm text-teal-600 hover:underline font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClassDetailView;