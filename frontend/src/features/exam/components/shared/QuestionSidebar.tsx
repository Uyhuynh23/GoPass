// src/features/exam/components/shared/QuestionSidebar.tsx
"use client";

import React, { useState, useMemo } from "react";
import { getSectionBadgeStyle } from "@/utils/exam";

export interface QuestionStatus {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isActive: boolean;
  isCorrect?: boolean;
  score?: number;
}

interface QuestionSidebarProps {
  sections: Record<string, QuestionStatus[]>;
  onQuestionClick: (questionId: string) => void;
  isReviewMode?: boolean;
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  sections,
  onQuestionClick,
  isReviewMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // --- LOGIC STYLE CHO TỪNG CHẾ ĐỘ ---
  const getQuestionButtonClass = (q: QuestionStatus): string => {
    // 1. Style chung cho trạng thái Active
    const activeClass = q.isActive
      ? isReviewMode
        ? "ring-2 ring-offset-2 ring-slate-400 font-bold shadow-md scale-110 z-10"
        : "bg-[#00747F] text-white border-[#00747F] font-bold shadow-md ring-2 ring-[#00747F]/20 z-10"
      : "";

    // 2. CHẾ ĐỘ REVIEW
    if (isReviewMode) {
      if (q.isActive) {
        if (!q.isAnswered)
          return `bg-amber-50 text-amber-600 border-amber-300 ${activeClass}`;
        if (q.isCorrect)
          return `bg-emerald-500 text-white border-emerald-600 ${activeClass}`;
        return `bg-red-500 text-white border-red-600 ${activeClass}`;
      }
      if (!q.isAnswered)
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      if (q.isCorrect)
        return "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600";
      return "bg-red-500 text-white border-red-600 hover:bg-red-600";
    }

    // 3. CHẾ ĐỘ TAKE EXAM
    if (q.isActive) return activeClass;
    if (q.isFlagged)
      return "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100";
    if (q.isAnswered)
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";

    return "bg-white text-gray-600 border-gray-200 hover:border-[#00747F] hover:text-[#00747F]";
  };

  // Helper để render nút câu hỏi (tránh lặp code ở JSX dưới)
  const renderQuestionButton = (q: QuestionStatus) => (
    <button
      key={q.questionId}
      onClick={() => onQuestionClick(q.questionId)}
      className={`
        h-9 w-9 rounded-lg border text-sm font-medium 
        transition-all duration-200 flex items-center justify-center
        ${getQuestionButtonClass(q)}
      `}
    >
      {q.order}
    </button>
  );

  // Flatten tất cả câu hỏi cho Review Mode
  const allQuestionsReview = useMemo(() => {
    if (!isReviewMode) return [];
    // Gộp tất cả mảng con thành 1 mảng và sắp xếp theo order
    return Object.values(sections)
      .flat()
      .sort((a, b) => a.order - b.order);
  }, [sections, isReviewMode]);

  return (
    <div className="relative h-full z-20 flex">
      <aside
        className={`
          flex-shrink-0 flex flex-col h-full bg-white border-r border-gray-200 shadow-[2px_0_10px_rgba(0,0,0,0.03)]
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "w-[280px] opacity-100" : "w-0 opacity-0 border-none"}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm min-w-[280px]">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
            <svg
              className="w-4 h-4 text-[#00747F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Danh sách câu hỏi
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar min-w-[280px]">
          {/* LEGEND (CHÚ THÍCH) */}
          <div className="mb-6 grid grid-cols-2 gap-y-3 gap-x-2">
            {!isReviewMode ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Chưa làm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00747F] rounded-full shadow-sm"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Đang chọn
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Đã làm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Đánh dấu
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 border border-emerald-600 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Đúng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 border border-red-600 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">Sai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-50 border border-amber-300 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Chưa trả lời
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-slate-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Đang xem
                  </span>
                </div>
              </>
            )}
          </div>

          {/* GRID CÂU HỎI */}
          <div className="space-y-6">
            {isReviewMode ? (
              /* --- LOGIC MỚI: REVIEW MODE --- */
              /* Hiển thị 1 Grid duy nhất, không có Header Section */
              <div className="grid grid-cols-5 gap-2">
                {allQuestionsReview.map((q) => renderQuestionButton(q))}
              </div>
            ) : (
              /* --- LOGIC CŨ: EXAM MODE --- */
              /* Hiển thị chia theo Sections */
              Object.entries(sections).map(
                ([sectionName, sectionQuestions]) => {
                  const badgeStyle = getSectionBadgeStyle(sectionName);
                  return (
                    <div key={sectionName} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeStyle.className} bg-opacity-10 border-opacity-20`}
                        >
                          {sectionName}
                        </span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {sectionQuestions.map((q) => renderQuestionButton(q))}
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400 font-medium min-w-[280px]">
          Tổng số: {Object.values(sections).flat().length} câu hỏi
        </div>
      </aside>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute top-1/2 -translate-y-1/2 z-30
          w-6 h-12 bg-white border border-gray-200 shadow-md rounded-r-lg flex items-center justify-center
          text-gray-400 hover:text-[#00747F] hover:bg-gray-50 transition-all duration-300
          ${isOpen ? "left-[280px]" : "left-0"}
        `}
        title={isOpen ? "Thu gọn danh sách" : "Mở danh sách câu hỏi"}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default QuestionSidebar;
