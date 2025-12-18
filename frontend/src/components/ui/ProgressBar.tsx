// src/components/ui/ProgressBar.tsx
"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  className = "",
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Progress: {current} of {total} questions ({Math.round(percentage)}%)
      </p>
    </div>
  );
};

export default ProgressBar;
