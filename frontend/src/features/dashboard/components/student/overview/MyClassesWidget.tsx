// src/features/dashboard/components/student/MyClassesWidget.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { MOCK_MY_CLASSES } from "@/features/dashboard/data/mock-my-classes";
import { ClassSummary } from "@/features/dashboard/types/student";

// --- INTERNAL: Join Class Modal (Unchanged) ---
interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(classCode);
      onClose();
      setClassCode("");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Tham gia lớp học</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 pt-2">
          <p className="text-sm text-gray-500 mb-6">Nhập mã lớp học do giáo viên cung cấp</p>
          <div className="space-y-2 mb-6">
            <input 
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="VÍ DỤ: CLASS001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 outline-none uppercase"
              autoFocus
            />
          </div>
          <button type="submit" disabled={!classCode.trim() || isLoading} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 shadow-lg disabled:opacity-50 transition-all">
            {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN WIDGET ---
const MyClassesWidget = () => {
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // VIEW MODE: false = Active Classes (Default), true = Pending Classes
  const [isViewPending, setIsViewPending] = useState(false); 
  
  const [myClasses, setMyClasses] = useState<ClassSummary[]>(MOCK_MY_CLASSES);

  // --- Logic: Prepare Lists ---
  const pendingCount = myClasses.filter(c => c.status === 'pending').length;

  // Determine which list to show based on view mode
  const currentList = myClasses.filter(c => 
    (isViewPending ? c.status === 'pending' : c.status === 'active')
  );

  // Apply Search Filter to the CURRENT list
  const filteredList = currentList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
  const handleJoinSubmit = (code: string) => {
    const newPendingClass: ClassSummary = {
      id: `P-${Date.now()}`,
      name: `Lớp Mới (${code})`,
      code: code,
      students: 0,
      status: 'pending',
      teacher: "Đang chờ duyệt...",
      requestDate: new Date().toISOString().split('T')[0]
    };
    setMyClasses(prev => [newPendingClass, ...prev]);
    setIsViewPending(true);
  };

  const handleCancelRequest = (id: string) => {
    setMyClasses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl border border-teal-50 shadow-sm h-full flex flex-col max-h-[700px]">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="text-teal-600 bg-teal-50 p-1.5 rounded-lg">
                {isViewPending ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                )}
              </span>
              {/* Dynamic Title */}
              {isViewPending ? "Lớp đang chờ duyệt" : "Lớp học của tôi"}
            </h3>

            {/* TOGGLE BUTTON */}
            {/* Fix: Always show button if currently viewing pending list OR if there are pending classes */}
            {(pendingCount > 0 || isViewPending) && (
              <button 
                onClick={() => setIsViewPending(!isViewPending)}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border
                  ${isViewPending 
                    ? "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200" // "Back" style
                    : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100" // "Pending" style
                  }
                `}
              >
                {isViewPending ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Về lớp của tôi
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Chờ duyệt ({pendingCount})
                  </>
                )}
              </button>
            )}
          </div>

          {!isViewPending && (
            <button className="text-xs text-gray-400 hover:text-teal-600">Tất cả ▼</button>
          )}
        </div>

        {/* --- SEARCH FILTER --- */}
        <div className="mb-4 relative shrink-0">
          <input 
            type="text"
            placeholder={isViewPending ? "Tìm kiếm lớp đang chờ..." : "Tìm kiếm lớp học..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* --- MAIN LIST AREA --- */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredList.length > 0 ? (
            filteredList.map((cls) => (
              isViewPending ? (
                // --- RENDER PENDING ITEM ---
                <div key={cls.id} className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex justify-between items-center animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 font-bold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{cls.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{cls.teacher || "Giáo viên"}</span> • <span>{cls.requestDate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-200 shadow-sm">
                      Chờ duyệt
                    </span>
                    <button 
                      onClick={() => handleCancelRequest(cls.id)}
                      className="text-[10px] text-gray-400 hover:text-red-500 hover:underline flex items-center gap-0.5 transition-colors"
                    >
                      Hủy yêu cầu
                    </button>
                  </div>
                </div>
              ) : (
                // --- RENDER ACTIVE ITEM ---
                <div 
                  key={cls.id} 
                  onClick={() => router.push(`/dashboard/classes/${cls.id}`)}
                  className="group flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-md hover:border-teal-100 transition-all cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-teal-600 font-bold transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 text-sm truncate" title={cls.name}>{cls.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">Mã: {cls.code}</p>
                    </div>
                  </div>
                  <span className="shrink-0 bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors ml-2">
                    {cls.students} HS
                  </span>
                </div>
              )
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
              <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p>Không tìm thấy lớp học nào</p>
            </div>
          )}
        </div>
        
        {/* --- FIXED FOOTER BUTTON --- */}
        <button 
          onClick={() => setIsJoinModalOpen(true)}
          className="shrink-0 w-full py-3 mt-4 border border-dashed border-teal-300 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>+</span> Tham gia lớp học mới
        </button>
      </div>

      <JoinClassModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onSubmit={handleJoinSubmit}
      />
    </>
  );
};

export default MyClassesWidget;