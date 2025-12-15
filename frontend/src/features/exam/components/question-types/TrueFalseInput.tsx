"use client";

import React from "react";
import { QuestionOption } from "@/features/exam/types/question";

interface TrueFalseInputProps {
  options: QuestionOption[];
  selectedAnswer?: Record<string, string>; // { "opt1": "Đúng", "opt2": "Sai" }
  onChange: (value: Record<string, string>) => void;
  // New props review
  correctAnswer?: Record<string, string> | null; // { "opt1": "Sai", ... }
  disabled?: boolean;
}

const TrueFalseInput: React.FC<TrueFalseInputProps> = ({
  options = [],
  selectedAnswer = {},
  onChange,
  correctAnswer,
  disabled = false,
}) => {
  const handleSubChange = (optionId: string, value: "Đúng" | "Sai") => {
    if (disabled) return;
    const newAnswers = { ...selectedAnswer, [optionId]: value };
    onChange(newAnswers);
  };

  const isReviewMode = !!correctAnswer;

  // Helper render nút bấm
  const renderButton = (
    optId: string,
    type: "Đúng" | "Sai",
    userVal: string | undefined,
    correctVal: string | undefined
  ) => {
    const isSelected = userVal === type;
    const isIdeallyCorrect = correctVal === type; // Đây là đáp án đúng thực tế

    let btnClass = "bg-white border border-slate-300 text-slate-500";

    if (isReviewMode) {
      if (isIdeallyCorrect) {
        // Nếu đây là đáp án đúng -> Luôn màu xanh
        btnClass =
          "bg-green-600 text-white border-green-600 shadow-md opacity-100";
      } else if (isSelected && !isIdeallyCorrect) {
        // Nếu user chọn nút này NHƯNG SAI -> Màu đỏ
        btnClass =
          "bg-rose-500 text-white border-rose-500 shadow-md opacity-100";
      } else {
        // Các nút còn lại -> Mờ đi
        btnClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-50";
      }
    } else {
      // Chế độ làm bài bình thường
      if (isSelected) {
        btnClass =
          type === "Đúng"
            ? "bg-green-600 text-white shadow-md transform scale-105"
            : "bg-rose-500 text-white shadow-md transform scale-105";
      } else {
        btnClass =
          type === "Đúng"
            ? "bg-white border border-slate-300 text-slate-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
            : "bg-white border border-slate-300 text-slate-500 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50";
      }
    }

    return (
      <button
        onClick={() => handleSubChange(optId, type)}
        disabled={disabled}
        className={`group flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${btnClass}`}
      >
        <span>{type}</span>
        {/* Render Icons trong chế độ Review */}
        {isReviewMode && isIdeallyCorrect && (
          <svg
            className="w-4 h-4"
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
        )}
        {isReviewMode && isSelected && !isIdeallyCorrect && (
          <svg
            className="w-4 h-4"
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
        )}

        {/* Render Dot trong chế độ thường */}
        {!isReviewMode && isSelected && (
          <div className="w-2 h-2 bg-white rounded-full ml-1" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4 w-full">
      {options.map((opt) => {
        const userVal = selectedAnswer[opt.id];
        // Parse correctAnswer nếu nó ở dạng string JSON, hoặc lấy trực tiếp
        let correctVal: string | undefined = undefined;
        if (correctAnswer) {
          correctVal = correctAnswer[opt.id];
        }

        // Style border container chính
        let containerBorder = "border-slate-200";
        if (isReviewMode && correctVal) {
          // Nếu làm đúng hết ý này -> Viền xanh, ngược lại -> Viền đỏ
          const isRowCorrect = userVal === correctVal;
          containerBorder = isRowCorrect
            ? "border-green-400 ring-1 ring-green-100 bg-green-50/20"
            : "border-rose-400 ring-1 ring-rose-100 bg-rose-50/20";
        } else if (userVal) {
          // Chế độ làm bài
          containerBorder =
            userVal === "Đúng"
              ? "border-green-400 ring-2 ring-green-100"
              : "border-rose-400 ring-2 ring-rose-100";
        }

        return (
          <div
            key={opt.id}
            className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 ${containerBorder}`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-200">
                {opt.id})
              </div>
              <p className="flex-1 text-base text-slate-700 leading-relaxed pt-1 font-medium">
                {opt.content}
              </p>
            </div>

            {/* Buttons Group */}
            <div className="ml-12 flex items-center gap-3">
              {renderButton(opt.id, "Đúng", userVal, correctVal)}
              {renderButton(opt.id, "Sai", userVal, correctVal)}
            </div>
          </div>
        );
      })}

      {!isReviewMode && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2 text-sm text-slate-500 italic">
          <span>Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.</span>
        </div>
      )}
    </div>
  );
};

export default TrueFalseInput;
