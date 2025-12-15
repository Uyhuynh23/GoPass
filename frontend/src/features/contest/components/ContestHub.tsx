"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Trophy,
  Eye,
  Play,
} from "lucide-react";
import { ContestDetail } from "../types";

// Helper chọn màu sắc
const getSubjectTheme = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  if (name.includes("toán"))
    return {
      icon: "📐",
      color: "blue",
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
    };
  if (name.includes("anh") || name.includes("english"))
    return {
      icon: "🌏",
      color: "indigo",
      bg: "bg-indigo-500",
      light: "bg-indigo-50",
      text: "text-indigo-600",
    };
  if (name.includes("văn") || name.includes("literature"))
    return {
      icon: "📖",
      color: "pink",
      bg: "bg-pink-500",
      light: "bg-pink-50",
      text: "text-pink-600",
    };
  return {
    icon: "📝",
    color: "teal",
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-600",
  };
};

export default function ContestHub({ data }: { data: ContestDetail }) {
  const router = useRouter();

  const completedCount = data.subjects.filter(
    (s) => s.userStatus === "completed"
  ).length;
  const totalCount = data.subjects.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleAction = (examId: string, status: string) => {
    if (status === "completed") {
      router.push(`/exam/submission/mock-submission-${examId}`);
    } else if (status === "ready") {
      router.push(`/exam/${examId}/take`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-6 px-4 flex justify-center">
      {/* Giảm độ rộng tối đa xuống max-w-2xl cho gọn */}
      <div className="w-full max-w-2xl space-y-5">
        {/* 1. HEADER COMPACT */}
        <div className="bg-teal-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden text-center">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
              <Trophy className="text-amber-300 w-6 h-6" fill="currentColor" />
            </div>

            <h1 className="text-xl font-bold mb-1">{data.name}</h1>
            <p className="text-teal-100 text-xs font-medium mb-4">
              Tiến độ: {completedCount}/{totalCount} môn
            </p>

            {/* Progress Bar Compact */}
            <div className="w-full max-w-xs h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. DANH SÁCH MÔN THI (COMPACT LIST) */}
        <div className="space-y-3">
          {data.subjects.map((item) => {
            const theme = getSubjectTheme(item.subject);
            const status = item.userStatus;

            let cardClasses = "bg-white border border-gray-100";
            let statusBadge = null;
            let actionButton = null;

            if (status === "completed") {
              // --- ĐÃ NỘP BÀI ---
              cardClasses = "bg-green-50/50 border border-green-200";
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200 ml-2">
                  <CheckCircle2 size={10} /> Đã nộp
                </span>
              );
              actionButton = (
                <button
                  onClick={() => handleAction(item.examId, status)}
                  className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors shadow-sm flex items-center gap-1"
                >
                  <Eye size={12} /> Xem lại
                </button>
              );
            } else if (status === "ready") {
              // --- SẴN SÀNG ---
              cardClasses =
                "bg-white border border-teal-100 shadow-sm ring-1 ring-teal-50";
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200 ml-2">
                  ● Sẵn sàng
                </span>
              );
              actionButton = (
                <button
                  onClick={() => handleAction(item.examId, status)}
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-md shadow-teal-200 hover:bg-teal-700 active:scale-95 transition-all flex items-center gap-1"
                >
                  Bắt đầu <ChevronRight size={14} />
                </button>
              );
            } else {
              // --- KHÓA ---
              cardClasses = "bg-gray-50 border border-gray-200 opacity-70";
              actionButton = (
                <div className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed">
                  Chưa mở
                </div>
              );
            }

            return (
              <div
                key={item.examId}
                className={`rounded-xl p-4 transition-all duration-200 flex items-center justify-between ${cardClasses}`}
              >
                {/* Nội dung bên trái */}
                <div className="flex items-center gap-4">
                  {/* Icon Box Compact (w-12 -> w-10) */}
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shadow-sm text-white ${
                      status === "locked" ? "bg-gray-300" : theme.bg
                    }`}
                  >
                    {theme.icon}
                  </div>

                  <div>
                    <div className="flex items-center">
                      <h3
                        className={`text-sm font-bold ${
                          status === "locked"
                            ? "text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {item.subject}
                      </h3>
                      {statusBadge}
                    </div>

                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Clock size={12} className="text-gray-400" />{" "}
                        {item.durationMinutes} phút
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div>{actionButton}</div>
              </div>
            );
          })}
        </div>

        {/* 3. Footer Action */}
        {progressPercent === 100 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => router.push(`/contest/${data._id}/result`)}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-purple-200 hover:scale-105 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-shine"></div>
              <Trophy size={16} /> Xem Kết quả Chung cuộc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
