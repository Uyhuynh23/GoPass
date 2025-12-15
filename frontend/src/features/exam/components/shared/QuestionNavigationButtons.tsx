// src/features/exam/components/shared/QuestionNavigationButtons.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface QuestionNavigationButtonsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isLastInSection: boolean;
  isLastQuestion: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onNextSection?: () => void;
}

/**
 * Navigation buttons below question card
 * Shows Previous, Next, or Next Section
 */
const QuestionNavigationButtons: React.FC<QuestionNavigationButtonsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  isLastInSection,
  isLastQuestion,
  onPrevious,
  onNext,
  onNextSection,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous button */}
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="px-4 py-2 text-sm"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Câu trước
      </Button>

      {/* Progress indicator */}
      <span className="text-xs text-gray-600 font-medium">
        Câu {currentQuestionIndex + 1} / {totalQuestions}
      </span>

      {/* Next or Next Section button */}
      {isLastQuestion ? (
        <Button
          variant="primary"
          disabled
          className="px-4 py-2 text-sm opacity-50 cursor-not-allowed"
        >
          Câu cuối cùng
        </Button>
      ) : isLastInSection && onNextSection ? (
        <Button
          variant="primary"
          onClick={onNextSection}
          className="px-4 py-2 text-sm"
        >
          Phần tiếp theo
          <svg
            className="w-4 h-4 ml-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onNext}
          className="px-4 py-2 text-sm"
        >
          Câu tiếp theo
          <svg
            className="w-4 h-4 ml-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      )}
    </div>
  );
};

export default QuestionNavigationButtons;
