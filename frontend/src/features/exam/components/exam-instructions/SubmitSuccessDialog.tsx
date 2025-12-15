// src/features/exam/components/shared/SubmitSuccessDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface SubmitSuccessDialogProps {
  isOpen: boolean;
  examTitle: string;
  examSubject: string;
  submittedAt: string;
  completionStatus: {
    answered: number;
    total: number;
  };
  onGoToDashboard: () => void;
}

const SubmitSuccessDialog: React.FC<SubmitSuccessDialogProps> = ({
  isOpen,
  examTitle,
  examSubject,
  submittedAt,
  completionStatus,
  onGoToDashboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* === HEADER: SUCCESS ICON === */}
        <div className="pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-6 ring-8 ring-emerald-50/50 shadow-sm animate-bounce-slow">
            <svg
              className="w-12 h-12 text-emerald-500"
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Nộp bài thành công!
          </h2>
          <p className="text-slate-500 px-6">
            Hệ thống đã ghi nhận bài làm của bạn cho đề thi <br />
            <span className="font-semibold text-[#00747F]">{examTitle}</span>
          </p>
        </div>

        {/* === CONTENT: STATS GRID === */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Box 1: Môn thi */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm mb-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase">
                Môn thi
              </p>
              <p className="text-sm font-bold text-slate-700 mt-1 truncate w-full">
                {examSubject}
              </p>
            </div>

            {/* Box 2: Thời gian */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm mb-2">
                <svg
                  className="w-4 h-4"
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
              <p className="text-xs text-slate-400 font-bold uppercase">
                Thời gian nộp
              </p>
              <p className="text-sm font-bold text-slate-700 mt-1">
                {submittedAt.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* Completion Bar */}
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
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
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase">
                  Trạng thái
                </p>
                <p className="text-sm font-bold text-emerald-800">
                  Hoàn thành bài thi
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-700">
                {completionStatus.answered}
                <span className="text-sm text-emerald-500 font-medium">
                  /{completionStatus.total}
                </span>
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                Câu đã làm
              </p>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Kết quả chi tiết và đáp án sẽ được công bố sau khi kết thúc đợt
              thi.
            </p>
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <Button
            variant="primary"
            onClick={onGoToDashboard}
            className="w-full py-4 text-base font-bold shadow-lg shadow-teal-200/50"
          >
            Về trang chủ Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccessDialog;
