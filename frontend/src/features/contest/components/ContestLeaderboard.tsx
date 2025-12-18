"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Medal, User } from "lucide-react";

// --- COMPONENT CHÍNH ---
export default function ContestLeaderboard({ data }: { data?: any }) {
  const router = useRouter();

  // Tách Top 3
  const top1 = data.leaderboard.find((u: any) => u.rank === 1);
  const top2 = data.leaderboard.find((u: any) => u.rank === 2);
  const top3 = data.leaderboard.find((u: any) => u.rank === 3);

  // Danh sách còn lại (Từ hạng 4 trở đi)
  const rest = data.leaderboard.filter((u: any) => u.rank > 3);

  // Tìm hạng của chính mình
  const myResult = data.leaderboard.find((u: any) => u.isMe);

  // --- SUB-COMPONENT: BỤC VINH QUANG ---
  const PodiumItem = ({ user, rank }: { user: any; rank: number }) => {
    if (!user) return <div className="w-1/3"></div>; // Placeholder nếu không có người ở hạng đó

    const borderColor =
      rank === 1
        ? "border-amber-400"
        : rank === 2
        ? "border-slate-300"
        : "border-orange-300";

    const badgeColor =
      rank === 1
        ? "bg-amber-400"
        : rank === 2
        ? "bg-slate-300"
        : "bg-orange-300";

    const isFirst = rank === 1;

    return (
      <div
        className={`flex flex-col items-center w-1/3 transition-transform duration-300 ${
          isFirst ? "-translate-y-6" : "translate-y-0"
        }`}
      >
        <div className="relative mb-2">
          {isFirst && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
              👑
            </div>
          )}
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderColor} bg-white flex items-center justify-center shadow-lg overflow-hidden`}
          >
            <span className="text-xl md:text-2xl font-bold text-gray-600">
              {user.avatar}
            </span>
          </div>
          <div
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${badgeColor} flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white`}
          >
            {rank}
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-bold text-gray-800 line-clamp-1 w-full px-1">
            {user.name}
          </p>
          <div className="inline-block mt-1 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-600 shadow-sm border border-white/50">
            {user.totalScore} điểm
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* 1. HEADER & PODIUM SECTION */}
        <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 relative -mx-4 sm:mx-0 sm:rounded-b-2xl overflow-hidden pb-8">
          {/* LỚP NỀN (BACKGROUND) */}
          <div className="absolute top-0 left-0 right-0 h-[85%] bg-gradient-to-br from-teal-500 to-emerald-600 rounded-b-[50%] -z-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mt-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
          </div>

          {/* LỚP NỘI DUNG (ĐÃ SỬA PADDING) */}
          <div className="relative z-20 text-center text-white pt-8">
            {/* 
              - Xóa class 'max-w-md mx-auto'
              - Thêm class 'px-4 sm:px-8' để áp dụng padding trực tiếp vào đây
            */}
            <div className="flex items-center justify-between px-4 sm:px-8">
              <button
                onClick={() => router.back()}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="font-bold text-xs uppercase tracking-widest opacity-90">
                Bảng Xếp Hạng
              </h1>
              <div className="w-9 h-9"></div>{" "}
              {/* Placeholder vẫn giữ nguyên để căn giữa title */}
            </div>

            {/* Phần tiêu đề chính và podium không cần thay đổi */}
            <h2 className="text-2xl md:text-3xl font-bold mt-6 drop-shadow-md max-w-md mx-auto px-4">
              {data.name}
            </h2>

            <div className="mt-12 flex justify-center items-end gap-1 md:gap-4 text-black">
              <PodiumItem user={top2} rank={2} />
              <PodiumItem user={top1} rank={1} />
              <PodiumItem user={top3} rank={3} />
            </div>
          </div>
        </div>

        {/* CÁC PHẦN BÊN DƯỚI */}
        <div className="px-4 sm:px-0 space-y-6">
          {/* 2. RANK CỦA BẠN */}
          {myResult && myResult.rank > 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Medal size={16} className="text-teal-600" />
                <span className="text-sm font-bold text-gray-700">
                  Thứ hạng của bạn
                </span>
              </div>
              <div className="bg-white border border-gray-200/80 rounded-xl p-4 flex items-center shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>
                <div className="w-10 font-bold text-xl text-teal-700 text-center mr-4">
                  #{myResult.rank}
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-800 font-bold text-sm mr-3 border-2 border-white shadow-inner">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-teal-900">{myResult.name}</p>
                    <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Bạn
                    </span>
                  </div>
                  <p className="text-xs text-teal-600/80">ID: {myResult.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-teal-700">
                    {myResult.totalScore}
                  </p>
                  <p className="text-[10px] text-teal-500 font-bold uppercase">
                    Tổng điểm
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. DANH SÁCH ĐẦY ĐỦ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700 text-sm">
                Bảng xếp hạng đầy đủ
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {data.leaderboard?.length} thí sinh
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center px-6 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="w-10 text-center">Hạng</div>
                <div className="flex-1 ml-4">Thí sinh</div>
                <div className="w-20 text-right">Tổng điểm</div>
              </div>
              {rest.map((user: any) => (
                <div
                  key={user.id}
                  className={`flex items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                    user.isMe ? "bg-teal-50/50" : ""
                  }`}
                >
                  <div className="w-10 text-center font-bold text-gray-500 text-sm">
                    {user.rank}
                  </div>
                  <div className="flex-1 flex items-center gap-3 ml-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                        user.isMe
                          ? "bg-teal-100 text-teal-700 border-teal-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            user.isMe ? "text-teal-900" : "text-gray-700"
                          }`}
                        >
                          {user.name}
                        </p>
                        {user.isMe && (
                          <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-bold">
                            Bạn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-right font-bold text-gray-800">
                    {user.totalScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
