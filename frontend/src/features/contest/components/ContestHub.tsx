"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Trophy,
  Play,
  ArrowLeft,
  Timer,
} from "lucide-react";
// ✅ UPDATE: Import ContestDetail thay vì Contest
import { ContestDetail } from "../types";
import {
  getContestProgress,
  ContestProgressMap,
} from "@/utils/contest-storage";
import { examStorage } from "@/utils/exam-storage";

// Helper chọn màu sắc (Giữ nguyên)
const getSubjectTheme = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  if (name.includes("toán")) return { icon: "📐", bg: "bg-blue-500" };
  if (name.includes("anh") || name.includes("english"))
    return { icon: "🌏", bg: "bg-indigo-500" };
  if (name.includes("văn") || name.includes("literature"))
    return { icon: "📖", bg: "bg-pink-500" };
  return { icon: "📝", bg: "bg-teal-500" };
};

// ✅ UPDATE: Props nhận vào là ContestDetail
export default function ContestHub({ data }: { data: ContestDetail }) {
  const router = useRouter();

  // State lưu trạng thái từ localStorage (Client Cache)
  const [localStatus, setLocalStatus] = useState<ContestProgressMap>({});

  // 1. Load dữ liệu từ LocalStorage khi vào trang
  useEffect(() => {
    const progress = getContestProgress(data._id);
    setLocalStatus(progress);
  }, [data._id]);

  // 2. Xử lý logic Mở khoá tuần tự (Domino Logic)
  // Sắp xếp môn thi theo thứ tự order
  const sortedSubjects = [...data.subjects].sort((a, b) => a.order - b.order);

  const subjectsWithStatus = sortedSubjects.map((subject, index) => {
    // a. Lấy status hiện tại (Ưu tiên LocalStorage -> rồi mới đến API Data)
    let currentStatus = localStatus[subject.examId] || subject.userStatus;

    // b. LOGIC MỞ KHÓA: Nếu môn trước đó đã xong -> Mở môn này
    if (index > 0) {
      const prevSubject = sortedSubjects[index - 1];
      // Check status môn trước (có thể nó vừa được hoàn thành ở Client)
      const prevStatus =
        localStatus[prevSubject.examId] || prevSubject.userStatus;

      // Nếu môn trước 'completed' VÀ môn này đang 'locked' -> Đổi thành 'ready'
      if (prevStatus === "completed" && currentStatus === "locked") {
        currentStatus = "ready";
      }
    }

    return {
      ...subject,
      displayStatus: currentStatus,
    };
  });

  // Tính toán lại tiến độ dựa trên status mới (đã merge Client state)
  const completedCount = subjectsWithStatus.filter(
    (s) => s.displayStatus === "completed"
  ).length;
  const totalCount = data.subjects.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Xử lý chuyển trang
  const handleAction = (examId: string, status: string) => {
    const returnUrl = encodeURIComponent(`/contest/${data._id}/hub`);

    // Case 1: Tiếp tục làm bài (Resume)
    if (status === "ongoing") {
      router.push(
        `/exam/${examId}/take?contestId=${data._id}&returnUrl=${returnUrl}`
      );
    }
    // Case 2: Bắt đầu làm bài mới (Start Fresh)
    else if (status === "ready") {
      // Xóa dữ liệu cũ trong localStorage (nếu có) để reset timer
      examStorage.clear(examId);
      router.push(
        `/exam/${examId}/take?contestId=${data._id}&returnUrl=${returnUrl}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-6 px-4 flex justify-center">
      <div className="w-full max-w-2xl space-y-5">
        {/* Nút Back */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push(`/contest/${data._id}`)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Quay lại danh sách
          </span>
        </div>

        {/* Header Contest */}
        <div className="bg-teal-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden text-center">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/20 shadow-inner">
              <Trophy className="text-amber-300 w-6 h-6" fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold mb-1">{data.name}</h1>
            <p className="text-teal-100 text-xs font-medium mb-4">
              Tiến độ: {completedCount}/{totalCount} môn
            </p>
            <div className="w-full max-w-xs h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Danh sách môn thi */}
        <div className="space-y-3">
          {subjectsWithStatus.map((item) => {
            const theme = getSubjectTheme(item.subject);
            // Sử dụng displayStatus đã được tính toán logic mở khoá
            const status = item.displayStatus;

            let cardClasses = "bg-white border border-gray-100";
            let statusBadge = null;
            let actionButton = null;

            if (status === "completed") {
              cardClasses = "bg-green-50/50 border border-green-200 opacity-90";
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200 ml-2">
                  <CheckCircle2 size={10} /> Đã nộp bài
                </span>
              );
              actionButton = (
                <div className="px-4 py-2 text-green-700 text-xs font-bold italic">
                  Đã hoàn thành
                </div>
              );
            } else if (status === "ongoing") {
              cardClasses =
                "bg-white border border-orange-200 shadow-md ring-1 ring-orange-100";
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-700 border border-orange-200 ml-2 animate-pulse">
                  <Timer size={10} /> Đang làm
                </span>
              );
              actionButton = (
                <button
                  onClick={() => handleAction(item.examId, status)}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-200 hover:scale-105 transition-all flex items-center gap-1"
                >
                  Tiếp tục <Play size={14} fill="currentColor" />
                </button>
              );
            } else if (status === "ready") {
              cardClasses =
                "bg-white border border-teal-100 shadow-sm ring-1 ring-teal-50";
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-700 border border-blue-200 ml-2">
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
              // LOCKED
              cardClasses = "bg-gray-50 border border-gray-200 opacity-60";
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
                <div className="flex items-center gap-4">
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
                <div>{actionButton}</div>
              </div>
            );
          })}
        </div>

        {/* Footer Action (Chỉ hiện khi hoàn thành hết) */}
        {progressPercent === 100 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => router.push(`/contest/${data._id}/result`)}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-purple-200 hover:scale-105 transition-all"
            >
              <Trophy size={16} /> Xem Kết quả Chung cuộc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
