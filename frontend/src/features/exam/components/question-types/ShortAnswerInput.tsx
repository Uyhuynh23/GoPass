"use client";

import React, { useRef, useEffect } from "react";

interface ShortAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  // hint?: string; // Đã bỏ theo yêu cầu, UI hint đã hardcode bên dưới
}

const ShortAnswerInput: React.FC<ShortAnswerInputProps> = ({
  value = "",
  onChange,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Đảm bảo luôn hiển thị 4 ô, nếu value ngắn hơn thì điền rỗng
  const chars = value.split("").concat(Array(4).fill("")).slice(0, 4);

  // Auto-focus ô trống đầu tiên khi mount (Optional)
  useEffect(() => {
    const firstEmptyIndex = chars.findIndex((c) => c === "");
    if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
      // inputRefs.current[firstEmptyIndex]?.focus();
    }
  }, []);

  const handleCharChange = (index: number, val: string) => {
    const char = val.slice(-1); // Chỉ lấy ký tự cuối cùng nhập vào

    // Regex: Cho phép số, dấu chấm, dấu trừ, chữ cái
    if (char && !/^[0-9.\-a-zA-Z]$/.test(char)) return;

    const newChars = [...chars];
    newChars[index] = char;

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
        // Nếu ô hiện tại rỗng, quay lại xóa ô trước đó
        const newChars = [...chars];
        newChars[index - 1] = "";
        onChange(newChars.join(""));
        inputRefs.current[index - 1]?.focus();
      }
      // Nếu ô có giá trị, input mặc định sẽ xóa, onChange sẽ cập nhật lại
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Container: Bo góc lớn, shadow nhẹ, border xám nhạt */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-shadow hover:shadow-md">
        {/* Header Label */}
        <div className="text-center mb-5">
          <h3 className="text-base text-slate-700 font-bold mb-1 flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 text-[#00747F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Nhập đáp án</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">Tối đa 4 ký tự</p>
        </div>

        {/* 4 Input Boxes - Kích thước nhỏ gọn (w-12 / w-14) */}
        <div className="flex justify-center gap-3 mb-6">
          {chars.map((char, index) => (
            <div key={index} className="relative group">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="text" // Hiện bàn phím số/kí tự trên mobile
                maxLength={1}
                value={char}
                onChange={(e) => handleCharChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-12 md:w-14 md:h-14 text-center text-xl font-mono font-bold
                  border-2 rounded-xl transition-all duration-200 outline-none
                  ${
                    char
                      ? "border-[#00747F] text-[#00747F] bg-white shadow-sm" // Active state
                      : "border-slate-200 text-slate-500 bg-slate-50 hover:border-slate-300 focus:border-[#00747F]/60 focus:ring-4 focus:ring-[#00747F]/10" // Inactive state
                  }
                `}
              />

              {/* Checkmark Icon - Chỉ hiện khi có giá trị */}
              {char && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm animate-[zoomIn_0.2s_ease-out] z-10">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
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

        {/* Progress Dots Indicator */}
        <div className="flex justify-center gap-2 mb-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                chars[i] ? "bg-[#00747F]" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Example Hint Box (Hardcoded) */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-medium border border-slate-100">
            <svg
              className="w-3.5 h-3.5 opacity-60"
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
            <span>Ví dụ: 12.3 → [1][2][.][3]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerInput;
