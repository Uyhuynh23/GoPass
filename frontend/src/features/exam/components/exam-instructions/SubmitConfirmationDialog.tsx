// src/features/exam/components/shared/SubmitConfirmationDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface SubmitConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  timeRemaining: string;
  answeredCount: number;
  totalQuestions: number;
  unansweredQuestions: Array<{
    number: number;
    section: string;
  }>;
  flaggedQuestions: Array<{
    number: number;
    section: string;
  }>;
}

const SubmitConfirmationDialog: React.FC<SubmitConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  timeRemaining,
  answeredCount,
  totalQuestions,
  unansweredQuestions,
  flaggedQuestions,
}) => {
  if (!isOpen) return null;

  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* === HEADER === */}
        <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00747F] flex items-center justify-center shadow-sm">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Xác nhận nộp bài
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Hãy kiểm tra kỹ các thông tin dưới đây
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* === CONTENT SCROLLABLE === */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          {/* Grid Stats: Thời gian & Tiến độ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thời gian */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100">
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
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Thời gian còn lại
                </p>
                <p className="text-xl font-bold text-slate-700 font-mono">
                  {timeRemaining}
                </p>
              </div>
            </div>

            {/* Tiến độ */}
            <div
              className={`rounded-2xl p-5 border flex items-center gap-4 ${
                isAllAnswered
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${
                  isAllAnswered
                    ? "bg-white text-emerald-600 border-emerald-100"
                    : "bg-white text-amber-600 border-amber-100"
                }`}
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isAllAnswered ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  Tiến độ làm bài
                </p>
                <p
                  className={`text-xl font-bold ${
                    isAllAnswered ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {answeredCount}/{totalQuestions}{" "}
                  <span className="text-sm font-medium opacity-80">
                    câu hỏi
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Warning Section: Chưa làm & Đánh dấu */}
          {(unansweredQuestions.length > 0 || flaggedQuestions.length > 0) && (
            <div className="space-y-4">
              {/* Chưa làm */}
              {unansweredQuestions.length > 0 && (
                <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                  <div className="flex items-start gap-3 mb-3">
                    <svg
                      className="w-5 h-5 text-rose-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-rose-800">
                        Cảnh báo: Còn {unansweredQuestions.length} câu chưa làm
                      </h4>
                      <p className="text-sm text-rose-700 mt-1">
                        Việc nộp bài khi chưa hoàn thành có thể ảnh hưởng đến
                        kết quả.
                      </p>
                    </div>
                  </div>

                  {/* List câu chưa làm */}
                  <div className="flex flex-wrap gap-2 pl-8">
                    {unansweredQuestions.map((q) => (
                      <span
                        key={`unanswered-${q.number}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-rose-200 text-rose-600 text-xs font-bold shadow-sm"
                      >
                        {q.number}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Đánh dấu */}
              {flaggedQuestions.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                    </svg>
                    <h4 className="font-bold text-amber-800">
                      Có {flaggedQuestions.length} câu đang đánh dấu xem lại
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {flaggedQuestions.map((q) => (
                      <span
                        key={`flagged-${q.number}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-amber-200 text-amber-600 text-xs font-bold shadow-sm"
                      >
                        {q.number}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
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
            <p className="text-sm text-blue-700 leading-relaxed">
              Sau khi nhấn <span className="font-bold">"Nộp bài ngay"</span>, hệ
              thống sẽ chốt kết quả và bạn không thể sửa lại đáp án.
            </p>
          </div>
        </div>

        {/* === FOOTER ACTIONS === */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-slate-500 hover:text-slate-800 hover:bg-white"
          >
            Quay lại kiểm tra
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#00747F] hover:bg-[#005f68] text-white shadow-lg shadow-teal-200/50 text-base"
          >
            <div className="flex items-center justify-center gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Nộp bài ngay</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationDialog;
