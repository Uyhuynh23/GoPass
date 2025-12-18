// src/features/contest/data/contest-constants.ts

import { BookOpen, Calculator, Globe } from "lucide-react";

// 1. QUY CHẾ THI (Fix cứng)
export const CONTEST_RULES = [
  "Thí sinh phải hoàn thành tất cả các môn thi theo thứ tự để được tính điểm xếp hạng.",
  "Mỗi môn thi có thời gian làm bài riêng biệt. Đồng hồ sẽ đếm ngược ngay khi bạn bấm 'Bắt đầu'.",
  "Tuyệt đối không sử dụng tài liệu, tra cứu internet hoặc nhờ người khác hỗ trợ.",
  "Hệ thống có cơ chế phát hiện gian lận. Nếu vi phạm, kết quả sẽ bị hủy bỏ ngay lập tức.",
  "Kết quả xếp hạng (Leaderboard) sẽ được cập nhật sau khi bạn hoàn thành tất cả các môn.",
];

// 2. CẤU HÌNH MÔN HỌC (Icon, Màu sắc - Dùng chung cho Landing & Hub)
export const SUBJECT_METADATA: Record<string, any> = {
  math: {
    label: "Toán Học",
    icon: "📐", // Hoặc dùng Component Icon: <Calculator />
    color: "blue",
    bg: "bg-blue-500",
    lightBg: "bg-blue-50",
    text: "text-blue-600",
  },
  english: {
    label: "Tiếng Anh",
    icon: "🌏",
    color: "indigo",
    bg: "bg-indigo-500",
    lightBg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  literature: {
    label: "Ngữ Văn",
    icon: "📖",
    color: "pink",
    bg: "bg-pink-500",
    lightBg: "bg-pink-50",
    text: "text-pink-600",
  },
  default: {
    label: "Môn khác",
    icon: "📝",
    color: "teal",
    bg: "bg-teal-500",
    lightBg: "bg-teal-50",
    text: "text-teal-600",
  },
};

// Helper để lấy config theo tên môn (xử lý case insensitive)
export const getSubjectConfig = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes("toán")) return SUBJECT_METADATA.math;
  if (key.includes("anh") || key.includes("english"))
    return SUBJECT_METADATA.english;
  if (key.includes("văn") || key.includes("literature"))
    return SUBJECT_METADATA.literature;
  return SUBJECT_METADATA.default;
};

// Danh sách môn thi cố định cho Landing (Load siêu nhanh)
export const LANDING_SUBJECTS = [
  { name: "Toán Học", duration: 90 },
  { name: "Tiếng Anh", duration: 60 },
  { name: "Ngữ Văn", duration: 120 },
];
