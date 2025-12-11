// src/features/exam/components/question-types/TrueFalseInput.tsx
"use client";

import React from "react";

interface Option {
  text: string;
  isCorrect?: boolean;
}

interface TrueFalseInputProps {
  options: Option[];
  selectedOption?: string;
  onChange: (value: string) => void;
  subQuestions?: Array<{
    id: string;
    text: string;
    selectedValue?: "Đúng" | "Sai";
  }>;
  onSubQuestionChange?: (id: string, value: "Đúng" | "Sai") => void;
}

/**
 * True/False toggle input
 * For single true/false or multi-part true/false questions
 */
const TrueFalseInput: React.FC<TrueFalseInputProps> = ({
  options,
  selectedOption,
  onChange,
  subQuestions,
  onSubQuestionChange,
}) => {
  // Multi-part true/false (like in Math exam image)
  if (subQuestions && onSubQuestionChange) {
    return (
      <div className="space-y-4">
        {subQuestions.map((sq) => {
          const value = sq.selectedValue;

          return (
            <div
              key={sq.id}
              className={`bg-white rounded-2xl border-2 p-6 shadow-sm transition-all ${
                value
                  ? value === "Đúng"
                    ? "border-green-400 ring-2 ring-green-200/50"
                    : "border-red-400 ring-2 ring-red-200/50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 rounded-xl flex items-center justify-center text-base shadow-sm border-2 border-purple-300">
                  <span className="font-bold">{sq.id})</span>
                </div>
                <p className="flex-1 text-base text-gray-800 leading-relaxed pt-1.5">
                  {sq.text}
                </p>
              </div>

              <div className="ml-14 flex items-center gap-3 flex-wrap">
                {/* True Button */}
                <button
                  onClick={() => onSubQuestionChange(sq.id, "Đúng")}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
                    value === "Đúng"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-400/50 scale-105"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50 shadow-sm"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 ${
                      value === "Đúng"
                        ? "fill-current"
                        : "group-hover:text-green-500"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="font-medium">Đúng</span>
                </button>

                {/* False Button */}
                <button
                  onClick={() => onSubQuestionChange(sq.id, "Sai")}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
                    value === "Sai"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-2 ring-red-400/50 scale-105"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50 shadow-sm"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 ${
                      value === "Sai"
                        ? "fill-current"
                        : "group-hover:text-red-500"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <span className="font-medium">Sai</span>
                </button>

                {value && (
                  <span
                    className={`text-xs ml-2 font-medium ${
                      value === "Đúng" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ✓ Đã chọn
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Hint */}
        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r p-4 flex items-start gap-3">
          <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
          <div className="text-sm text-gray-700">
            <p>
              <strong>Hướng dẫn:</strong> Trong mỗi ý a), b), c), d), thí sinh
              chọn <strong>Đúng</strong> hoặc <strong>Sai</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Simple true/false (single question)
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const isSelected = selectedOption === option.text;

        return (
          <button
            key={option.text}
            onClick={() => onChange(option.text)}
            className={`
              flex-1 py-3 rounded-lg text-sm font-semibold transition-all border-2
              ${
                isSelected
                  ? option.text === "Đúng"
                    ? "bg-green-500 border-green-600 text-white shadow-md"
                    : "bg-red-500 border-red-600 text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }
            `}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
};

export default TrueFalseInput;
