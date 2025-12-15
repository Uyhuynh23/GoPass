import React from "react";
import { ClassAssignment } from "@/features/dashboard/types/class";

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

  // --- 2. RENDER STYLES & BADGES ---

  // Badge trạng thái đề thi (Hàng 1) - Tinh giản, bỏ viền đậm
  const renderAvailabilityBadge = () => {
    switch (availability) {
      case 'ongoing':
        return (
          <span className="ml-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span> {/* Chấm tròn tĩnh */}
            Đang diễn ra
          </span>
        );
      case 'ended':
        return (
          <span className="ml-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
            Đã kết thúc
          </span>
        );
      case 'upcoming':
        return (
          <span className="ml-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700">
             <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Sắp mở
          </span>
        );
    }
  };

  // Trạng thái hoàn thành & Lượt làm (Hàng 2)
  const renderCompletionStatus = () => {
    return (
      <div className="flex items-center gap-3 text-sm mt-2">
        {isSubmitted ? (
          <span className="flex items-center gap-1.5 font-medium text-teal-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Đã hoàn thành
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-normal text-slate-500">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
            Chưa làm bài
          </span>
        )}

        <span className="text-slate-300">|</span>

        <span className={`text-xs ${(!isSubmitted && availability === 'ongoing') ? 'text-slate-700' : 'text-slate-400'}`}>
           Lượt làm: <span className="font-medium">{myAttemptCount}/{attemptLimit === -1 ? '∞' : attemptLimit}</span>
        </span>
      </div>
    );
  };

  // Xác định style cho container
  // Logic: Bài đang diễn ra thì nền trắng sáng, viền xanh nhẹ. Bài đã đóng/chưa mở thì nền xám nhẹ.
  let containerClass = "bg-white border-slate-200"; // Default
  if (availability === 'ongoing') containerClass = "bg-white border-blue-200 ring-1 ring-blue-50 shadow-sm"; 
  else if (availability === 'ended') containerClass = "bg-slate-50 border-slate-100 opacity-75"; 
  else if (availability === 'upcoming') containerClass = "bg-white border-dashed border-slate-200";

  return (
    <div className={`group flex flex-col md:flex-row items-center justify-between p-5 border rounded-xl mb-3 transition-all hover:border-blue-300 ${containerClass}`}>
      
      {/* --- KHỐI THÔNG TIN --- */}
      <div className="flex items-start gap-4 w-full md:w-auto">
        {/* Icon Box - Dùng nền nhẹ nhàng hơn */}
        <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${isSubmitted ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>

        <div className="flex-1 min-w-0"> {/* min-w-0 giúp text truncate đúng */}
          {/* HÀNG 1: Title & Badge */}
          <div className="flex items-center flex-wrap gap-y-1">
            <h4 className="font-semibold text-slate-800 text-base mr-1">
              {assignment.title}
            </h4>
            {renderAvailabilityBadge()}
          </div>
          
          {/* HÀNG 2: Trạng thái User */}
          {renderCompletionStatus()}

          {/* HÀNG 3: Metadata - Tăng độ tương phản text một chút */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2.5">
            <span className="flex items-center gap-1" title="Hạn nộp">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {assignment.deadlineDisplay}
            </span>
            <span className="flex items-center gap-1" title="Thời lượng">
               <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {assignment.duration} phút
            </span>
            <span className="flex items-center gap-1" title="Sĩ số nộp bài">
               <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               {assignment.submittedCount}/{assignment.totalStudents} đã nộp
            </span>
          </div>
        </div>
      </div>

      {/* --- KHỐI HÀNH ĐỘNG (BUTTONS) --- */}
      {/* --- KHỐI HÀNH ĐỘNG (BUTTONS) --- */}
      <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
        
        {isSubmitted ? (
          /* CASE: ĐÃ LÀM (COMPLETED) - NÂNG CẤP UI */
          <div className="flex flex-col items-end gap-2">
             {/* Điểm số */}
             <div className="text-right">
                <span className="text-2xl font-bold text-teal-600 leading-none">
                  {assignment.score}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-1">/ {assignment.maxScore} điểm</span>
             </div>
             
             {/* Group Nút bấm - Căn chỉnh lại cho nổi bật */}
             <div className="flex items-center gap-2">
                {/* 1. Nút Xem bài: Dùng nền trắng nhưng viền đậm và màu chữ rõ hơn (Secondary Action) */}
                <button 
                  onClick={() => onViewResult(assignment.id)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm"
                >
                  Xem bài
                </button>

                {/* 2. Nút Làm lại: Dùng màu nền đặc (Primary Action) để nổi bật như nút Bắt đầu */}
                {canRetake && (
                  <button 
                    onClick={() => onStart(assignment.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Làm lại
                  </button>
                )}
             </div>
          </div>
        ) : (
          /* CASE: CHƯA LÀM (Giữ nguyên nút đẹp cũ) */
          <div className="w-full md:w-auto">
             {availability === 'ongoing' && (
                <button 
                  onClick={() => onStart(assignment.id)}
                  className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Làm bài ngay</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             )}

             {availability === 'ended' && (
                <span className="inline-block px-4 py-2 text-slate-400 text-xs font-semibold bg-slate-100 rounded-lg border border-slate-200 cursor-not-allowed">
                   Đã đóng
                </span>
             )}

             {availability === 'upcoming' && (
                <span className="inline-block px-4 py-2 text-amber-600 text-xs font-semibold bg-amber-50 rounded-lg border border-amber-100 cursor-not-allowed">
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