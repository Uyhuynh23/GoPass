"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import { Trophy, ArrowRight, CheckCircle2 } from "lucide-react";

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
  actionLabel?: string;
  isContestMode?: boolean; // ✅ Prop mới nhận biết mode Contest
}

const SubmitSuccessDialog: React.FC<SubmitSuccessDialogProps> = ({
  isOpen,
  examTitle,
  examSubject,
  submittedAt,
  completionStatus,
  onGoToDashboard,
  actionLabel = "Về trang chủ Dashboard",
  isContestMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* === HEADER === */}
        <div
          className={`pt-8 pb-4 text-center ${
            isContestMode ? "bg-gradient-to-b from-teal-50 to-white" : ""
          }`}
        >
          {isContestMode ? (
            // Icon Cúp Vàng cho Contest
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-4 ring-8 ring-yellow-50 shadow-sm animate-bounce-slow">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
          ) : (
            // Icon Check Xanh cho bài thường
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-6 ring-8 ring-emerald-50/50 shadow-sm animate-bounce-slow">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isContestMode
              ? "Tuyệt vời! Đã hoàn thành."
              : "Nộp bài thành công!"}
          </h2>

          <p className="text-slate-500 px-6 text-sm leading-relaxed">
            {isContestMode ? (
              <>
                Bạn đã hoàn thành bài thi môn{" "}
                <span className="font-bold text-teal-700">{examSubject}</span>.
                <br />
                Hãy quay lại trang chính để theo dõi kết quả và Bảng xếp hạng
                nhé!
              </>
            ) : (
              <>
                Hệ thống đã ghi nhận bài làm.
                <br />
                <span className="font-semibold text-[#00747F]">
                  {examTitle}
                </span>
              </>
            )}
          </p>
        </div>

        {/* === STATS GRID (Chỉ hiện chi tiết nếu không phải mode Contest quá đơn giản) === */}
        {!isContestMode && (
          <div className="px-8 py-4">
            {/* ... (Giữ nguyên code hiển thị thống kê câu đúng/sai cũ) ... */}
            <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  {Math.round(
                    (completionStatus.answered / completionStatus.total) * 100
                  )}
                  %
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase">
                    Tiến độ
                  </p>
                  <p className="text-sm font-bold text-emerald-800">Đã làm</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-700">
                  {completionStatus.answered}/{completionStatus.total}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  Câu hỏi
                </p>
              </div>
            </div>
          </div>
        )}

        {/* === FOOTER === */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <Button
            variant="primary"
            onClick={onGoToDashboard}
            className={`w-full py-3.5 text-base font-bold shadow-lg flex items-center justify-center gap-2
              ${
                isContestMode
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-teal-200 hover:scale-[1.02] transition-transform"
                  : "bg-[#00747F] shadow-teal-200/50"
              }`}
          >
            {actionLabel} {isContestMode && <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccessDialog;
