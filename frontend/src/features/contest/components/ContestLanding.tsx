"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { contestService } from "@/services/contest/contest.service";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  PlayCircle,
  Trophy,
  Loader2, // Thêm icon loading
} from "lucide-react";
import {
  CONTEST_RULES,
  LANDING_SUBJECTS,
  getSubjectConfig,
} from "../data/contest-constants";

interface LandingProps {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  userProgress?: {
    hasJoined: boolean;
    completed: number;
    total: number;
    isFinished: boolean;
  };
}

export default function ContestLanding({ data }: { data: LandingProps }) {
  const router = useRouter();
  const { userProgress } = data;
  const [isLoading, setIsLoading] = useState(false); // ✅ State xử lý loading khi bấm nút

  // --- HÀM XỬ LÝ JOIN (GỌI API) ---
  const handleJoin = async () => {
    try {
      setIsLoading(true);
      // 1. Gọi API POST để đăng ký
      const res = await contestService.joinContest(data.id, "student-01");

      if (res.success) {
        // 2. Refresh để Server Component tải lại data mới (số thí sinh tăng, nút đổi thành Tiếp tục)
        router.refresh();
      } else {
        alert("Có lỗi xảy ra: " + (res.message || "Không thể tham gia"));
      }
    } catch (error) {
      console.error("Join error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    router.push(`/contest/${data.id}/hub`);
  };

  const handleViewResult = () => {
    router.push(`/contest/${data.id}/result`);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- LOGIC NÚT BẤM (RENDER THEO TRẠNG THÁI) ---
  let MainButton;

  if (userProgress?.isFinished) {
    // 1. TRƯỜNG HỢP: ĐÃ HOÀN THÀNH -> XEM KẾT QUẢ
    MainButton = (
      <button
        onClick={handleViewResult}
        className="flex-[2] py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold shadow-md shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
      >
        <Trophy size={18} /> Xem kết quả
      </button>
    );
  } else if (userProgress?.hasJoined) {
    // 2. TRƯỜNG HỢP: ĐANG LÀM DỞ -> TIẾP TỤC
    MainButton = (
      <button
        onClick={handleStart}
        className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-md shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse-slow"
      >
        <PlayCircle size={18} /> Tiếp tục làm bài ({userProgress.completed}/
        {userProgress.total})
      </button>
    );
  } else {
    // 3. TRƯỜNG HỢP: CHƯA THAM GIA -> NÚT ĐĂNG KÝ (GỌI API)
    MainButton = (
      <button
        onClick={handleJoin}
        disabled={isLoading}
        className={`flex-[2] py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-teal-600 shadow-teal-200 hover:bg-teal-700 active:scale-95"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Đang đăng ký...
          </>
        ) : (
          <>
            Tham gia ngay <ArrowRight size={16} />
          </>
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 shadow-sm border border-white/20">
              <Trophy className="text-amber-300 w-6 h-6" fill="currentColor" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">{data.name}</h1>
            <p className="text-teal-50 text-xs md:text-sm opacity-90 max-w-lg">
              {data.description}
            </p>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50/50">
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              Bắt đầu
            </p>
            <div className="flex items-center justify-center gap-1 text-teal-700 font-bold text-sm">
              <Clock size={14} /> {formatDate(data.startTime)}
            </div>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              Kết thúc
            </p>
            <div className="flex items-center justify-center gap-1 text-teal-700 font-bold text-sm">
              <Calendar size={14} /> {formatDate(data.endTime)}
            </div>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              Thí sinh
            </p>
            <div className="flex items-center justify-center gap-1 text-purple-600 font-bold text-sm">
              <Users size={14} /> {data.participantCount}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* LIST MÔN THI */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-teal-500 rounded-full"></span> Môn thi
              đấu
            </h3>
            <div className="grid gap-2">
              {LANDING_SUBJECTS.map((sub, idx) => {
                const config = getSubjectConfig(sub.name);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${config.bg} ${config.text}`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {sub.duration} phút
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      Bắt buộc
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUY ĐỊNH */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span> Lưu ý
              quan trọng
            </h3>
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <ul className="space-y-2">
                {CONTEST_RULES.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-xs text-slate-600 leading-snug"
                  >
                    <div className="mt-0.5 min-w-[4px] h-[4px] bg-blue-400 rounded-full"></div>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>

          {/* Render nút chính dựa trên trạng thái */}
          {MainButton}
        </div>
      </div>
    </div>
  );
}
