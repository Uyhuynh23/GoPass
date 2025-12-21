import React from "react";
import { useRouter } from "next/navigation";
import { StudentContest } from "@/features/dashboard/types/student";

interface ContestCardProps {
  contest: StudentContest;
  onJoin: (id: number) => void;
  onViewResult: (id: number) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, onJoin, onViewResult }) => {
  const router = useRouter();
  const isOngoing = contest.status === "ongoing";
  const isUpcoming = contest.status === "upcoming";
  const isCompleted = contest.status === "completed";

  // Dynamic Styles based on status
  const cardOpacity = isUpcoming ? "opacity-80 hover:opacity-100" : "hover:shadow-md";
  const borderColor = isOngoing ? "border-teal-100" : isUpcoming ? "border-gray-200" : "border-gray-100";

  return (
    <div className={`bg-white p-5 rounded-xl border ${borderColor} ${cardOpacity} transition-all`}>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        
        {/* Left Side: Info */}
        <div className="space-y-2 flex-1 w-full">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {contest.subjects.map((sub) => (
              <span key={sub} className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                isOngoing ? "bg-teal-50 text-teal-700 border-teal-100" : "bg-gray-100 text-gray-500 border-gray-200"
              }`}>
                {sub}
              </span>
            ))}
          </div>

          <h4 className="font-bold text-gray-800 text-lg">{contest.title}</h4>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {contest.startDate} {contest.endDate ? `- ${contest.endDate}` : ""}
            </span>
            
            {/* Participants (Only show if not completed) */}
            {!isCompleted && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {contest.participants} tham gia
              </span>
            )}

            {/* Results (Only show if completed) */}
            {isCompleted && (
              <>
                {contest.rank && (
                  <span className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    🏆 Hạng {contest.rank}
                  </span>
                )}
                {contest.score && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    ✨ Điểm: {contest.score}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="shrink-0 w-full md:w-auto">
          {isOngoing && (
            <button 
              onClick={() => router.push(`/contest/${contest.id}`)}
              className="w-full md:w-auto px-6 py-2 bg-teal-600 text-white font-bold text-sm rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Tham gia
            </button>
          )}

          {isUpcoming && (
            <button className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-400 font-medium text-sm rounded-lg bg-gray-50 cursor-not-allowed flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Sắp bắt đầu
            </button>
          )}

          {isCompleted && (
            <button 
              onClick={() => onViewResult(contest.id)}
              className="w-full md:w-auto px-6 py-2 border border-teal-200 text-teal-700 font-medium text-sm rounded-lg hover:bg-teal-50 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Xem kết quả
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Only for Ongoing) */}
      {isOngoing && contest.progress && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-orange-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Chưa hoàn thành: {contest.progress.total - contest.progress.completed}/{contest.progress.total} môn
            </span>
          </div>
          <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${(contest.progress.completed / contest.progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestCard;