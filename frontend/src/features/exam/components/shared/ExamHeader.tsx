// src/features/exam/components/shared/ExamHeader.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button"; // Giả định bạn có component này

interface ExamHeaderProps {
  examTitle: string;
  examSubject: string;
  timeRemaining: number;
  onSubmit: () => void;
  onExit: () => void;
  isSubmitting?: boolean;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  examSubject,
  timeRemaining,
  onSubmit,
  onExit,
  isSubmitting = false,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining > 1800) return "text-gray-700 bg-gray-50 border-gray-200";
    if (timeRemaining > 600)
      return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200 animate-pulse";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="h-full px-4 md:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Left: Branding & Info */}
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <div className="w-10 h-10 bg-[#00747F] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-white">
            {/* Logo Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-sm md:text-base font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
              {examTitle}
            </h1>
            <p className="text-xs text-gray-500 font-medium truncate">
              Môn thi: {examSubject}
            </p>
          </div>
        </div>

        {/* Right: Timer & Actions */}
        <div className="flex items-center gap-3">
          {/* Timer Badge */}
          <div
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border ${getTimerColor()} transition-colors`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-mono text-lg font-bold tracking-wider">
              {formatTime(timeRemaining)}
            </span>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onExit}
              className="px-4 py-2 h-10 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              Thoát
            </Button>

            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 h-10 text-sm font-bold bg-[#00747F] hover:bg-[#005f68] text-white rounded-xl shadow-md shadow-teal-200"
            >
              {isSubmitting ? "Đang nộp..." : "Nộp bài"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
