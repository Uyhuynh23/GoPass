"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClassDetail, ClassAssignment } from "@/features/dashboard/types/class";
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
      // 1. Search Logic
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Availability Logic
      const availability = getAvailability(item.startTime, item.endTime);
      let matchesAvailability = true;
      if (availabilityFilter !== 'all') {
        matchesAvailability = availability === availabilityFilter;
      }

      // 3. Completion Logic
      const isCompleted = item.status === 'completed';
      let matchesCompletion = true;
      if (completionFilter === 'completed') {
        matchesCompletion = isCompleted;
      } else if (completionFilter === 'not_completed') {
        matchesCompletion = !isCompleted;
      }

      return matchesSearch && matchesAvailability && matchesCompletion;
    });
  }, [classData.assignments, searchTerm, availabilityFilter, completionFilter]);

  // --- HANDLERS ---
  const handleBack = () => router.back();
  const handleStartAssignment = (id: string | number) => console.log(`Start: ${id}`);
  const handleViewResult = (id: string | number) => console.log(`Result: ${id}`);

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- HEADER BANNER (Giữ nguyên phần Header đẹp cũ) --- */}
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

      {/* --- STATS & PROGRESS --- */}
      {/* ... (Phần Stats giữ nguyên hoặc ẩn bớt nếu cần gọn) ... */}

      {/* ========================================================= */}
      {/* 4. ASSIGNMENTS LIST & FILTER (ĐÃ CHỈNH SỬA) */}
      {/* ========================================================= */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-gray-800 text-lg">
            Danh sách bài thi
          </h3>
          <span className="text-sm font-medium text-gray-600">
            {filteredAssignments.length} kết quả
          </span>
        </div>

        {/* --- FILTER TOOLBAR (NO RING, JUST BORDER) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          
          {/* 1. Search */}
          <div className="md:col-span-6">
            <input
              type="text"
              // focus:ring-0 -> Tắt ring bóng mờ
              // focus:border-gray-500 -> Khi bấm vào chỉ đổi màu viền đậm hơn chút
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 text-sm transition-colors"
              placeholder="Nhập tên bài tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 2. Filter Availability */}
          <div className="md:col-span-3">
            {/* Wrapper: Khi focus vào con bên trong, wrapper đổi viền sang gray-500 */}
            <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white relative transition-colors focus-within:border-gray-500 focus-within:ring-0">
              <span className="text-gray-500 text-sm whitespace-nowrap mr-2 select-none">
                Thời gian:
              </span>
              
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
                // focus:ring-0 -> Tắt ring của chính thẻ select
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

          {/* 3. Filter Completion */}
          <div className="md:col-span-3">
             {/* Tương tự: focus-within:border-gray-500 */}
             <div className="flex items-center w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white relative transition-colors focus-within:border-gray-500 focus-within:ring-0">
              <span className="text-gray-500 text-sm whitespace-nowrap mr-2 select-none">
                Trạng thái:
              </span>
              
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

        {/* --- LIST ITEMS --- */}
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
            // Empty State - Tối giản
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
  );
};

export default StudentClassDetailView;