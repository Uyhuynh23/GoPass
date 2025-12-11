// src/features/exam/components/shared/QuestionCard.tsx
"use client";

import React from "react";
import { Question } from "../../types";
import {
  MultipleChoiceInput,
  TrueFalseInput,
  ShortAnswerInput,
  EssayInput,
} from "../question-types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  sectionName: string;
  sectionBadgeColor: string;
  points: number;
  selectedAnswer?: string[] | string;
  onAnswerChange: (answer: string[] | string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  hint?: string;
  passage?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  sectionName,
  sectionBadgeColor,
  points,
  selectedAnswer,
  onAnswerChange,
  isFlagged,
  onToggleFlag,
  hint,
  passage,
}) => {
  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="mt-6">
            <MultipleChoiceInput
              options={question.options || []}
              selectedOptions={
                Array.isArray(selectedAnswer) ? selectedAnswer : []
              }
              onChange={onAnswerChange}
            />
          </div>
        );

      case "true_false":
        // Logic cho True/False (giữ nguyên để tránh lỗi)
        if (question.subQuestions) {
          // ... (Logic subQuestions cũ)
          return null; // Giản lược cho ví dụ này, bạn giữ code cũ phần True/False nhé
        }
        return (
          <div className="mt-6">
            <TrueFalseInput
              options={question.options || []}
              selectedOption={
                Array.isArray(selectedAnswer)
                  ? selectedAnswer[0]
                  : selectedAnswer
              }
              onChange={(value: string) => onAnswerChange([value])}
            />
          </div>
        );

      case "short_answer":
        // Logic mới: Chuyển đổi an toàn về string cho ShortAnswerInput
        let displayValue = "";
        if (typeof selectedAnswer === "string") {
          displayValue = selectedAnswer;
        } else if (Array.isArray(selectedAnswer) && selectedAnswer.length > 0) {
          displayValue = selectedAnswer[0];
        }

        return (
          <div className="mt-10 mb-4 w-full flex justify-center">
            <ShortAnswerInput
              value={displayValue}
              onChange={(val) => onAnswerChange(val)} // Truyền chuỗi trực tiếp
              hint={question.hint || hint}
            />
          </div>
        );

      case "essay":
        return (
          <div className="mt-6">
            <EssayInput
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={onAnswerChange}
            />
          </div>
        );

      default:
        return (
          <div className="p-4 text-red-500">Unsupported question type</div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      {/* Card Container */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden transition-shadow hover:shadow-lg">
        {/* Header Section */}
        <div className="px-8 py-7 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="flex items-start justify-between gap-5">
            {/* Left: Số câu hỏi & Meta */}
            <div className="flex items-center gap-5 flex-1">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-200/50">
                  <span className="text-2xl font-bold">{questionNumber}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Câu {questionNumber}
                </h3>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={`px-3 py-1 rounded-lg ${sectionBadgeColor} bg-opacity-10 text-gray-700 border border-current border-opacity-20`}
                  >
                    {sectionName}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                    {points} điểm
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Flag Button */}
            <button
              onClick={onToggleFlag}
              className={`p-3 rounded-2xl transition-all duration-200 group ${
                isFlagged
                  ? "bg-yellow-50 text-yellow-500 ring-1 ring-yellow-200 shadow-sm"
                  : "bg-transparent text-gray-300 hover:bg-gray-50 hover:text-gray-500"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isFlagged ? "fill-current" : "fill-none"
                }`}
                stroke="currentColor"
                strokeWidth={isFlagged ? 0 : 2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </button>
          </div>

          {/* Question Text */}
          <div className="mt-6">
            <div className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
              {question.content}
            </div>
            {passage && (
              <div className="mt-5 p-5 bg-[#F8F9FA] rounded-2xl border-l-4 border-gray-300 text-gray-600 italic">
                {passage}
              </div>
            )}
          </div>
        </div>

        {/* Input Body */}
        <div className="px-8 pb-10 pt-2 bg-white min-h-[150px]">
          {renderQuestionInput()}
        </div>

        {/* Footer Hint */}
        {hint && (
          <div className="px-8 py-5 bg-blue-50/50 border-t border-blue-100 flex gap-4">
            <div className="flex-shrink-0 mt-1 text-blue-500">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-blue-900 text-sm mb-1">HƯỚNG DẪN</p>
              <p className="text-blue-800 text-base leading-relaxed opacity-90">
                {hint}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
