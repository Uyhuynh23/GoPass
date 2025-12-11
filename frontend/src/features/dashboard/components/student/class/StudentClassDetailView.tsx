"use client";

import React from "react";
import { useRouter } from "next/navigation"; 
import { ClassDetail } from "@/features/dashboard/types/class";
import ClassAssignmentItem from "./ClassAssignmentItem"; // Import component con

interface StudentClassDetailViewProps {
  classData: ClassDetail;
}

const StudentClassDetailView: React.FC<StudentClassDetailViewProps> = ({ classData }) => {
  const router = useRouter();

  // --- Handlers ---
  const handleBack = () => router.back();
  const handleStartAssignment = (id: number) => console.log(`Start: ${id}`);
  const handleViewResult = (id: number) => console.log(`Result: ${id}`);

  return (
    <div className="space-y-6 pb-10">
      {/* --- 1. Header Banner --- */}
      <div className="rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

        <button 
          onClick={handleBack}
          className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors w-fit relative z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Quay lại
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{classData.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {classData.teacher}
              </span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="flex items-center gap-1.5">
                Mã lớp: <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs">{classData.code}</span>
              </span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {classData.studentsCount} học sinh
              </span>
            </div>
            <p className="text-sm text-white/70 max-w-2xl italic">{classData.description}</p>
          </div>
          <div className="flex gap-2 self-start md:self-end">
            <span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium">{classData.subject}</span>
            <span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Từ {classData.startDate}
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">#{classData.stats.rank}</div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Xếp hạng lớp</p>
            <p className="text-gray-900 font-medium">Trên tổng số {classData.stats.totalStudents} HS</p>
          </div>
        </div>
        {/* Assignments */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Bài tập hoàn thành</p>
            <p className="text-gray-900 font-bold">{classData.stats.assignmentsDone}/{classData.stats.totalAssignments}</p>
          </div>
        </div>
        {/* Score */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">{classData.stats.avgScore}</div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Điểm trung bình</p>
            <p className="text-gray-900 font-medium">{classData.stats.avgScore >= 8 ? "Giỏi" : "Khá"}</p>
          </div>
        </div>
      </div>

      {/* --- 3. Progress Bar --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><span className="text-teal-500">📈</span> Tiến độ học tập</h3>
          <span className="text-sm text-gray-500">{Math.round((classData.stats.assignmentsDone / classData.stats.totalAssignments) * 100)}% hoàn thành</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${(classData.stats.assignmentsDone / classData.stats.totalAssignments) * 100}%` }}></div>
        </div>
      </div>

      {/* --- 4. Assignments List (Using Component) --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="text-teal-600 bg-teal-50 p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </span>
          Danh sách bài thi & Kiểm tra
        </h3>

        <div className="space-y-3">
          {classData.assignments.map((item) => (
            <ClassAssignmentItem
              key={item.id}
              assignment={item}
              onStart={handleStartAssignment}
              onViewResult={handleViewResult}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentClassDetailView;