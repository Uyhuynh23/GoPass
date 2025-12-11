import React from "react";
import { ClassAssignment } from "@/features/dashboard/types/class";

interface ClassAssignmentItemProps {
  assignment: ClassAssignment;
  onStart: (id: number) => void;
  onViewResult: (id: number) => void;
}

const ClassAssignmentItem: React.FC<ClassAssignmentItemProps> = ({ 
  assignment, 
  onStart, 
  onViewResult 
}) => {
  const isCompleted = assignment.status === "completed";
  const isOngoing = assignment.status === "ongoing";

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-teal-200 hover:shadow-sm transition-all bg-gray-50/50 hover:bg-white gap-4">
      {/* Left: Icon & Info */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
          {isCompleted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm group-hover:text-teal-700 transition-colors">
            {assignment.title}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Hạn: {assignment.deadline}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {assignment.duration}p
            </span>
            {/* Status Badge */}
            {isOngoing && (
              <span className="text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded font-bold">Đang diễn ra</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Score or Button */}
      <div className="md:text-right flex items-center justify-between md:block w-full md:w-auto">
        {isCompleted ? (
          <div>
            <span className="block text-lg font-bold text-emerald-600">
              {assignment.score}/{assignment.maxScore}
            </span>
            <button 
              onClick={() => onViewResult(assignment.id)}
              className="text-xs text-teal-600 hover:underline"
            >
              Xem chi tiết
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onStart(assignment.id)}
            className="w-full md:w-auto px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Bắt đầu</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassAssignmentItem;