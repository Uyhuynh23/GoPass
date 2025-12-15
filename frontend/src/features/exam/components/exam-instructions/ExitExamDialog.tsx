// src/features/exam/components/shared/ExitExamDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface ExitExamDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onStay?: () => void;
  onConfirm?: () => void;
  onExit?: () => void;
}

/**
 * Dialog hiển thị khi người dùng cố gắng thoát khỏi bài thi
 */
const ExitExamDialog: React.FC<ExitExamDialogProps> = ({
  isOpen,
  onClose,
  onStay,
  onConfirm,
  onExit,
}) => {
  const handleStay = onClose || onStay || (() => {});
  const handleExit = onConfirm || onExit || (() => {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleStay}
      ></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Warning Icon - Dùng màu Amber nhẹ nhàng hơn Orange */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center ring-8 ring-amber-50/50">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 text-center mb-3">
          Xác nhận thoát?
        </h3>

        {/* Message */}
        <p className="text-center text-slate-600 mb-8 leading-relaxed">
          Bạn có chắc chắn muốn rời khỏi bài thi lúc này không?
        </p>

        {/* Warning Box - Thiết kế lại cho hiện đại */}
        <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100 flex gap-4 items-start">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800 mb-1">
              Lưu ý quan trọng
            </p>
            <p className="text-sm text-amber-700/90 leading-relaxed">
              Thời gian làm bài{" "}
              <span className="font-bold">vẫn tiếp tục đếm ngược</span> ngay cả
              khi bạn rời đi. Hãy quay lại sớm nhé!
            </p>
          </div>
        </div>

        {/* Actions - Đảo ngược thứ tự ưu tiên */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            variant="ghost" // Nút thoát ít nổi bật hơn (Ghost/Secondary)
            onClick={handleExit}
            className="flex-1 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          >
            Thoát tạm thời
          </Button>
          <Button
            variant="primary" // Nút ở lại nổi bật nhất (Teal)
            onClick={handleStay}
            className="flex-1 shadow-lg shadow-teal-200/50"
          >
            Ở lại làm bài
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExitExamDialog;
