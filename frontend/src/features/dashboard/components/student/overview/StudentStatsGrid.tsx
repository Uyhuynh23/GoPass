"use client";

import React, { useEffect, useState } from "react";
import { StudentStats } from "@/features/dashboard/types/student";
// Import hàm API vừa tạo thay vì import db trực tiếp
import { fetchStudentStats } from "@/services/student/studentStatsApi";

// --- Internal Component: SolidCard (Giữ nguyên không đổi) ---
interface SolidCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  bgColorClass: string; 
}

const SolidCard: React.FC<SolidCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColorClass,
}) => {
  return (
    <div
      className={`
        ${bgColorClass} 
        rounded-lg p-6 relative overflow-hidden text-white shadow-sm
        cursor-default select-none transition-transform hover:-translate-y-1
      `}
    >
      <div className="absolute top-4 right-4 opacity-20">{icon}</div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">{title}</p>
        <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
        {subtitle && <p className="text-sm font-medium mt-1 opacity-80">{subtitle}</p>}
      </div>
    </div>
  );
};

// --- Main Component: StudentStatsGrid ---
const StudentStatsGrid: React.FC = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Hardcode ID (Sau này lấy từ Context/Auth)
  const currentStudentId = "u_student_01"; 
  const iconClasses = "w-12 h-12";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // GỌI API TỪ SERVICE
        const data = await fetchStudentStats(currentStudentId);
        setStats(data);
      } catch (error) {
        // Xử lý lỗi (ví dụ: hiện thông báo)
        console.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- Render Loading State (Skeleton) ---
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Format điểm số
  const displayScore = Number.isInteger(stats.averageScore) 
    ? stats.averageScore 
    : stats.averageScore.toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* --- Card 1: LỚP HỌC --- */}
      <SolidCard
        title="Lớp đã tham gia"
        value={stats.joinedClasses}
        bgColorClass="bg-teal-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001 1h6a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.212c-1.206 0-2.333.337-3.278.925a8.927 8.927 0 00-1.255-.574C6.845 16.028 6 16.482 6 17v1z" />
          </svg>
        }
      />

      {/* --- Card 2: BÀI THI --- */}
      <SolidCard
        title="Bài thi đã làm"
        value={stats.examsTaken}
        bgColorClass="bg-emerald-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* --- Card 3: ĐIỂM TRUNG BÌNH --- */}
      <SolidCard
        title="Điểm trung bình"
        value={displayScore}
        bgColorClass="bg-blue-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.397 1.398l-.8 1.6 1.582 3.954a1 1 0 01-1.323 1v-1l-3.954-1.582-1.599.8a1 1 0 01-1.397-1.398l.8-1.6-1.582-3.954a1 1 0 011.323-1V3a1 1 0 011-1zm0 3a1 1 0 00-1 1v5.931l-2.432-.973a1 1 0 00-1.25.437l-1.214 2.428a1 1 0 00.97 1.44l2.663.38 1.126 2.486a1 1 0 001.824 0l1.126-2.486 2.663-.38a1 1 0 00.97-1.44l-1.214-2.428a1 1 0 00-1.25-.437L11 11.931V6a1 1 0 00-1-1z" clipRule="evenodd" />
            <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-3 2-3-2H5V5z" />
          </svg>
        }
      />

      {/* --- Card 4: ĐẾM NGƯỢC --- */}
      <SolidCard
        title="THPT QG 2026"
        value={stats.daysUntilExam}
        subtitle="ngày nữa"
        bgColorClass="bg-rose-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        }
      />
    </div>
  );
};

export default StudentStatsGrid;