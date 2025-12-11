// src/features/exam/components/question-types/ShortAnswerInput.tsx
"use client";

import React, { useRef, useEffect } from "react";

interface ShortAnswerInputProps {
  value: string; // Giá trị chuỗi (ví dụ: "12.3")
  onChange: (value: string) => void;
  hint?: string;
}

const ShortAnswerInput: React.FC<ShortAnswerInputProps> = ({
  value = "",
  onChange,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tách chuỗi value thành mảng 4 ký tự để hiển thị
  const chars = value.split("").concat(Array(4).fill("")).slice(0, 4);

  // Auto-focus vào ô trống đầu tiên khi mount (UX tốt cho thi cử)
  useEffect(() => {
    const firstEmptyIndex = chars.findIndex((c) => c === "");
    if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
      // inputRefs.current[firstEmptyIndex]?.focus(); // Bỏ comment nếu muốn auto-focus
    }
  }, []);

  const handleCharChange = (index: number, val: string) => {
    const char = val.slice(-1); // Chỉ lấy ký tự cuối

    // Regex: Chỉ cho phép số, dấu chấm, dấu trừ, chữ cái
    if (char && !/^[0-9.\-a-zA-Z]$/.test(char)) return;

    const newChars = [...chars];
    newChars[index] = char;

    // Cập nhật giá trị chuỗi lên cha
    onChange(newChars.join(""));

    // Tự động nhảy sang ô tiếp theo
    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!chars[index] && index > 0) {
        // Nếu ô hiện tại rỗng, quay lại xóa ô trước
        const newChars = [...chars];
        newChars[index - 1] = "";
        onChange(newChars.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Container chính input */}
      <div className="bg-white rounded-[2rem] border border-orange-200 p-8 md:p-10 shadow-[0_8px_30px_rgb(255,237,213,0.4)]">
        {/* Header Label */}
        <div className="text-center mb-8">
          <h3 className="text-lg md:text-xl text-gray-900 font-bold mb-2 flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Nhập đáp án của bạn</span>
          </h3>
          <p className="text-sm text-gray-500">Tối đa 4 ký tự</p>
        </div>

        {/* 4 Input Boxes */}
        <div className="flex justify-center gap-3 md:gap-5 mb-8">
          {chars.map((char, index) => (
            <div key={index} className="relative group">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleCharChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-16 h-16 md:w-20 md:h-20 text-center text-3xl font-mono
                  border-[3px] rounded-2xl transition-all shadow-sm outline-none
                  ${
                    char
                      ? "border-orange-500 text-orange-700 bg-white"
                      : "border-orange-200 text-gray-700 bg-orange-50/20 hover:border-orange-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }
                `}
              />
              {/* Checkmark Icon - Hiện khi có giá trị */}
              {char && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#00C985] text-white rounded-full flex items-center justify-center shadow-md animate-[zoomIn_0.2s_ease-out]">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                chars[i] ? "bg-orange-500" : "bg-orange-200"
              }`}
            />
          ))}
        </div>

        {/* Example Footer */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFF5E6] text-[#9A5B13] rounded-xl text-sm font-medium border border-orange-100">
            <span>Ví dụ: 12.3 → [1][2][.][3]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerInput;
