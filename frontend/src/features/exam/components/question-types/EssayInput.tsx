// src/features/exam/components/question-types/EssayInput.tsx
"use client";

import React from "react";

interface EssayInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EssayInput: React.FC<EssayInputProps> = ({
  value,
  onChange,
  placeholder = "Bắt đầu nhập bài viết của bạn tại đây...",
}) => {
  // Logic đếm từ đơn giản (tách theo khoảng trắng)
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;

  return (
    <div className="w-full">
      {/* Khung soạn thảo mô phỏng tờ giấy */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        {/* Toolbar / Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-700">
            Bài làm của bạn
          </span>

          {/* Bộ đếm từ: Chỉ hiện số từ đã viết */}
          <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
            Số từ:{" "}
            <span className="text-[#00747F] font-bold ml-1">{wordCount}</span>
          </div>
        </div>

        {/* Khu vực nhập liệu */}
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-6 text-base text-slate-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00747F]/10 font-sans-serif"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EssayInput;
