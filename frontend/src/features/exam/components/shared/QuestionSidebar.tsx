// src/features/exam/components/shared/QuestionSidebar.tsx
"use client";

import React from "react";
import { getSectionBadgeStyle } from "../../config/question-sections.config";

export interface QuestionStatus {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isActive: boolean;
}

interface QuestionSidebarProps {
  sections: Record<string, QuestionStatus[]>; // Grouped by section name
  onQuestionClick: (questionId: string) => void;
}

/**
 * Sidebar showing question navigation grid grouped by sections
 */
const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  sections,
  onQuestionClick,
}) => {
  const getQuestionButtonClass = (q: QuestionStatus): string => {
    if (q.isActive) return "bg-blue-500 text-white border-blue-600";
    if (q.isFlagged) return "bg-yellow-400 text-gray-900 border-yellow-500";
    if (q.isAnswered) return "bg-green-100 text-green-700 border-green-300";
    return "bg-white text-gray-700 border-gray-300 hover:border-gray-400";
  };

  return (
    <aside className="w-[280px] bg-gray-50 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          Danh sách câu hỏi
        </h2>

        {/* Status Legend */}
        <div className="mb-6 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Chưa làm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
            <span className="text-gray-600">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
            <span className="text-gray-600">Đánh dấu</span>
          </div>
        </div>

        {/* Sections with question grids */}
        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, sectionQuestions]) => {
            const badgeStyle = getSectionBadgeStyle(sectionName);

            return (
              <div key={sectionName} className="space-y-3">
                {/* Section Header */}
                <div
                  className={`text-xs font-bold px-2 py-1 rounded inline-block ${badgeStyle}`}
                >
                  {sectionName}
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {sectionQuestions.map((q) => (
                    <button
                      key={q.questionId}
                      onClick={() => onQuestionClick(q.questionId)}
                      className={`
                        h-10 w-10 rounded-lg border text-sm font-semibold shadow-sm
                        transition-all duration-150 flex items-center justify-center
                        ${getQuestionButtonClass(q)}
                      `}
                    >
                      {q.order}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default QuestionSidebar;
