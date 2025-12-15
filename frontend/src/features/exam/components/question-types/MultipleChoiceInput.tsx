"use client";

import React from "react";
import { QuestionOption } from "@/features/exam/types/question";
import MathText from "@/components/ui/MathText";

interface MultipleChoiceInputProps {
  options: QuestionOption[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  // New props cho Review Mode
  correctAnswerId?: string; // ID của đáp án đúng
  disabled?: boolean;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  options,
  selectedOptions,
  onChange,
  correctAnswerId,
  disabled = false,
}) => {
  const handleSelect = (optionId: string) => {
    if (disabled) return;
    onChange([optionId]);
  };

  const isReviewMode = !!correctAnswerId;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrect = option.id === correctAnswerId;
          const label = option.id || String.fromCharCode(65 + index);

          // --- LOGIC STYLE ---
          let containerClass =
            "bg-white border-slate-200 hover:border-[#00747F]/60 hover:bg-slate-50";
          let badgeClass =
            "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#00747F] border border-slate-200";
          let textClass = "text-slate-700 font-medium";
          let radioClass =
            "border-slate-300 bg-white group-hover:border-[#00747F]";

          // 1. CHẾ ĐỘ REVIEW
          if (isReviewMode) {
            containerClass = "bg-slate-50 border-slate-200 opacity-60"; // Mặc định làm mờ

            if (isCorrect) {
              // Đáp án ĐÚNG -> Luôn XANH (dù user có chọn hay không)
              containerClass =
                "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 opacity-100 z-10";
              badgeClass = "bg-emerald-500 text-white border-emerald-500";
              textClass = "text-emerald-800 font-bold";
              radioClass = "border-emerald-500 bg-emerald-500";
            } else if (isSelected) {
              // User chọn SAI -> ĐỎ
              containerClass =
                "bg-red-50 border-red-500 ring-1 ring-red-500 opacity-100 z-10";
              badgeClass = "bg-red-500 text-white border-red-500";
              textClass = "text-red-800 font-medium";
              radioClass = "border-red-500 bg-red-500";
            }
          }
          // 2. CHẾ ĐỘ LÀM BÀI (Bình thường)
          else if (isSelected) {
            containerClass = "bg-teal-50 border-[#00747F] shadow-md z-10";
            badgeClass = "bg-[#00747F] text-white";
            textClass = "text-[#00747F] font-semibold";
            radioClass = "border-[#00747F] bg-[#00747F]";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={disabled}
              className={`
                relative w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group
                ${containerClass}
                ${disabled ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {/* Badge (A, B, C...) */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors ${badgeClass}`}
              >
                {label}
              </div>

              {/* Text Content */}
              <span className={`flex-1 text-base ${textClass}`}>
                <MathText
                  content={option.content || (option as any).text || ""}
                />
              </span>

              {/* Radio Circle / Icons */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${radioClass}`}
              >
                {isReviewMode ? (
                  isCorrect ? (
                    // Icon tích xanh cho đáp án đúng
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isSelected ? (
                    // Icon X đỏ cho đáp án sai
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : null
                ) : (
                  // Dot trắng khi đang làm bài
                  isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-in zoom-in" />
                  )
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isReviewMode && (
        <p className="text-xs text-slate-400 mt-2 italic px-1">
          * Chọn 1 phương án đúng nhất
        </p>
      )}
    </div>
  );
};

export default MultipleChoiceInput;
