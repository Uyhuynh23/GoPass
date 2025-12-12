"use client";

import React from "react";
import { QuestionType } from "@/features/dashboard/types/question";

interface QuestionTypeSelectorProps {
  selectedType: QuestionType | null;
  onSelectType: (type: QuestionType) => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const questionTypes = [
    {
      type: "multiple_choice" as QuestionType,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: "Multiple Choice",
      description: "Chọn 1 đáp án trong 4 đáp án",
      color: "blue",
    },
    {
      type: "true_false" as QuestionType,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "True / False",
      description: "Nhiều phát biểu, đánh dấu True/False",
      color: "green",
    },
    {
      type: "short_answer" as QuestionType,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      title: "Short Answer",
      description: "Trả lời ngắn (số / chữ / regex)",
      color: "yellow",
    },
    {
      type: "long_answer" as QuestionType,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Long Answer",
      description: "Tự luận / bài văn",
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600",
    green: "border-green-200 bg-green-50 hover:bg-green-100 text-green-600",
    yellow:
      "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-600",
    purple:
      "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600",
  };

  const selectedColorClasses = {
    blue: "border-blue-500 bg-blue-100 ring-2 ring-blue-500",
    green: "border-green-500 bg-green-100 ring-2 ring-green-500",
    yellow: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-500",
    purple: "border-purple-500 bg-purple-100 ring-2 ring-purple-500",
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chọn loại câu hỏi
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionTypes.map((item) => {
          const isSelected = selectedType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => onSelectType(item.type)}
              className={`
                p-6 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? selectedColorClasses[
                        item.color as keyof typeof selectedColorClasses
                      ]
                    : `${
                        colorClasses[item.color as keyof typeof colorClasses]
                      } border-gray-200`
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 ${
                    isSelected ? "scale-110" : ""
                  } transition-transform`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {isSelected && (
                  <svg
                    className="w-6 h-6 text-current flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
