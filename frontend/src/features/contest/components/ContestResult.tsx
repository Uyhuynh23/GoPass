"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Star, Trophy } from "lucide-react"; // Thay đổi icon cho phù hợp
import { ContestDetail } from "../types";

export default function ContestResult({ data }: { data: ContestDetail }) {
  const router = useRouter();
  const { userResult, name } = data;

  // Guard clause: Nếu chưa có kết quả thì không render
  if (!userResult)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chưa có kết quả thi.
      </div>
    );

  // Logic tính Top % (Ví dụ: Percentile 85 => Top 15%)
  const topPercentage = (100 - userResult.percentile)
    .toFixed(1)
    .replace(/\.0$/, "");

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Chúc mừng */}
        <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-teal-500 p-8 text-center text-white">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-inner border border-white/30">
              🏆
            </div>
            <h1 className="text-2xl font-bold mb-1">Chúc mừng!</h1>
            <p className="text-purple-100 text-sm mb-2">
              Bạn đã hoàn thành cuộc thi
            </p>
            <p className="font-semibold text-white/90 line-clamp-1">{name}</p>
          </div>
        </div>

        {/* Card Xếp hạng nổi bật */}
        <div className="px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
              Thành tích của bạn
            </div>
            <div className="flex items-end justify-center gap-2 mb-3">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                #{userResult.rank}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">
              <Star size={12} fill="currentColor" />
              Top {topPercentage}% thí sinh xuất sắc
            </div>
          </div>
        </div>

        {/* Chi tiết điểm số */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-end p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div className="text-right">
              <p className="text-sm text-teal-800 font-medium">
                Tổng điểm đạt được
              </p>
              <p className="text-3xl font-bold text-teal-700">
                {userResult.totalScore}
                <span className="text-lg text-teal-400/80 font-normal">
                  /{userResult.maxScore}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Chi tiết điểm thành phần
            </p>
            {userResult.breakdown.map((item, idx) => {
              const subjectInfo = data.subjects.find(
                (s) => s.examId === item.examId
              );
              const subjectName = subjectInfo?.subject || "Môn thi";
              const maxScore = 10;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      {subjectName}
                    </span>
                    <span className="font-bold text-gray-800">
                      {item.score}/{maxScore}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? "bg-purple-500"
                          : idx === 1
                          ? "bg-teal-500"
                          : "bg-pink-500"
                      }`}
                      style={{ width: `${(item.score / maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- FOOTER BUTTONS (Đã cập nhật theo yêu cầu) --- */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={() => router.push("/contest")} // Quay về danh sách Contest
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>

          <button
            onClick={() => router.push(`/contest/${data._id}`)} // Quay về HUB để xem chi tiết
            className="flex-[2] py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:opacity-90 flex items-center justify-center gap-2 transition-all"
          >
            Xem chi tiết <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
