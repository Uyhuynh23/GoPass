// src/features/exam/components/question-types/MultipleChoiceInput.tsx
"use client";

import React from "react";

interface Option {
  text: string;
  isCorrect?: boolean;
}

interface MultipleChoiceInputProps {
  options: Option[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

/**
 * Multiple choice radio button input
 * Matches UI design from images (blue selected state)
 */
const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const handleSelect = (optionText: string) => {
    onChange([optionText]);
  };

  const isSelected = (optionText: string) =>
    selectedOptions.includes(optionText);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const selected = isSelected(option.text);
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={index}
              onClick={() => handleSelect(option.text)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left text-base
                transition-all duration-200
                ${
                  selected
                    ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-200"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm"
                }
              `}
            >
              {/* Option Label Badge */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 shadow-sm
                  ${
                    selected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 group-hover:bg-white"
                  }
                `}
              >
                {optionLabel}
              </div>

              {/* Option Text */}
              <span
                className={`flex-1 ${
                  selected ? "text-blue-900 font-medium" : "text-gray-700"
                }`}
              >
                {option.text}
              </span>

              {/* Radio Indicator */}
              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${
                    selected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                {selected && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <p className="text-sm text-blue-600 mt-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Chọn một đáp án đúng nhất
      </p>
    </div>
  );
};

export default MultipleChoiceInput;
