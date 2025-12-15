// src/components/ui/Timer.tsx
"use client";

import React from "react";

interface TimerProps {
  timeRemaining: number; // seconds
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, className = "" }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 1800) return "text-teal-600 bg-teal-50 border-teal-200"; // > 30 min
    if (timeRemaining > 600)
      return "text-orange-600 bg-orange-50 border-orange-200"; // 10-30 min
    return "text-red-600 bg-red-50 border-red-200"; // < 10 min
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getTimerColor()} ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-semibold text-lg">{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default Timer;
