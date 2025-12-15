import React from "react";
import { ClassAssignment } from "@/features/dashboard/types/student/";

interface ClassAssignmentItemProps {
  assignment: ClassAssignment;
  onStart: (id: string | number) => void;
  onViewResult: (id: string | number) => void;
}

const ClassAssignmentItem: React.FC<ClassAssignmentItemProps> = ({
  assignment,
  onStart,
  onViewResult,
}) => {
  const { status, attemptLimit, myAttemptCount, startTime, endTime } = assignment;

  // --- 1. LOGIC ---
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let availability: 'upcoming' | 'ongoing' | 'ended' = 'upcoming';
  if (now > end) availability = 'ended';
  else if (now >= start && now <= end) availability = 'ongoing';
  
  const isSubmitted = status === 'completed';
  const isExpired = now > end;
  const hasAttemptsLeft = attemptLimit === -1 || myAttemptCount < attemptLimit;
  const canRetake = hasAttemptsLeft && !isExpired;

  // --- 2. RENDER BADGES ---
  const renderStatusBadge = () => {
    if (isSubmitted) {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           Đã hoàn thành
        </span>
      );
    }
    switch (availability) {
      case 'ongoing':
        return (
          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
             <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
             Đang diễn ra
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
             Sắp mở
          </span>
        );
      case 'ended':
        return (
          <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
             Đã kết thúc
          </span>
        );
    }
  };

  return (
    <div className="group bg-white p-5 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      
      {/* Left Column: Exam Info */}
      <div className="flex-1 space-y-2 w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-gray-800 text-base group-hover:text-teal-700 transition-colors">
            {assignment.title}
          </h3>
          {renderStatusBadge()}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Hạn: {assignment.deadlineDisplay}
          </span>

          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {assignment.duration} phút
          </span>

          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             {assignment.submittedCount}/{assignment.totalStudents} đã nộp
          </span>

          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             Lượt: {myAttemptCount}/{attemptLimit === -1 ? '∞' : attemptLimit}
          </span>
        </div>
      </div>

      {/* Right Column: Action Buttons & Score */}
      <div className="flex flex-col items-end gap-3 shrink-0 mt-3 md:mt-0 w-full md:w-auto">
        
        {isSubmitted ? (
          /* CASE: COMPLETED (Điểm số to nằm trên, nút nằm dưới) */
          <div className="flex flex-col items-end gap-2">
             
             {/* 1. Điểm số nổi bật */}
             <div className="text-right">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5 block">
                  Kết quả
                </span>
                <div className="flex items-baseline justify-end leading-none">
                  <span className="text-2xl font-bold text-emerald-600">
                    {assignment.score}
                  </span>
                  <span className="text-sm text-gray-400 font-medium ml-1">
                    /{assignment.maxScore}
                  </span>
                </div>
             </div>

             {/* 2. Group Nút bấm */}
             <div className="flex items-center gap-2 mt-1">
               <button 
                 onClick={() => onViewResult(assignment.id)}
                 className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 transition-all bg-white shadow-sm"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 Xem lại
               </button>

               {canRetake && (
                 <button 
                   onClick={() => onStart(assignment.id)}
                   className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 transition-all bg-white shadow-sm"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   Làm lại
                 </button>
               )}
             </div>
          </div>
        ) : (
          /* CASE: NOT COMPLETED */
          <div className="w-full md:w-auto pt-2 md:pt-0"> 
             {availability === 'ongoing' ? (
                <button 
                  onClick={() => onStart(assignment.id)}
                  className="w-full md:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Bắt đầu
                </button>
             ) : availability === 'ended' ? (
                <span className="px-4 py-2 text-gray-400 text-sm font-medium bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
                   Đã đóng
                </span>
             ) : (
                <span className="px-4 py-2 text-amber-600 text-sm font-medium bg-amber-50 border border-amber-100 rounded-lg cursor-not-allowed">
                   Chưa mở
                </span>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassAssignmentItem;