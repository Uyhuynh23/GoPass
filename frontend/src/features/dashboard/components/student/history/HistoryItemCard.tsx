import React from "react";
import { HistoryItem, HistoryType } from "@/features/dashboard/types/student/";

interface HistoryItemCardProps {
  item: HistoryItem;
  onReview: (id: string | number) => void;
  onLeaderboard: (id: string | number) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onReview, onLeaderboard }) => {
  // Logic for badges specific to this card
  const getBadgeConfig = (type: HistoryType) => {
    switch (type) {
      case "contest":
        return {
          label: "Contest",
          style: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        };
      case "practice_class":
        return {
          label: "Bài tập lớp",
          style: "bg-purple-100 text-purple-700 border-purple-200",
          icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        };
      default: // practice_global
        return {
          label: "Luyện tập",
          style: "bg-teal-100 text-teal-700 border-teal-200",
          icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        };
    }
  };

  const badge = getBadgeConfig(item.type);

  return (
    <div className="group bg-white p-5 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Left: Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-gray-800 text-base group-hover:text-teal-700 transition-colors">
            {item.title}
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.style}`}>
            {badge.icon}
            {badge.label}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            {item.subject}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {item.duration} phút
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Điểm: {item.score}/{item.maxScore}
          </span>
          {item.rank && (
            <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
              Hạng {item.rank}
            </span>
          )}
          {item.className && (
            <span className="flex items-center gap-1 text-purple-600 font-bold bg-purple-50 border border-purple-100 px-2 py-1 rounded-md">
              {item.className}
            </span>
          )}
          <span className="text-gray-400 pl-2 border-l border-gray-200">
            {item.completedDate}
          </span>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={() => onReview(item.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 text-teal-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 transition-all bg-white shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Xem lại
        </button>
        
        {item.type === 'contest' && (
          <button 
            onClick={() => onLeaderboard(item.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition-all bg-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            BXH
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryItemCard;