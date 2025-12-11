// src/features/dashboard/components/student/StudentStatsGrid.tsx
import React from "react";
import { StudentStats } from "@/features/dashboard/types/student";

// --- 1. Internal Component: SolidCard (Static Display) ---
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
        cursor-default select-none
      `}
    >
      {/* Note: 
         - 'cursor-default': Đảm bảo con trỏ chuột là hình mũi tên bình thường.
         - 'select-none': Ngăn người dùng bôi đen text (tùy chọn, giúp UI giống app hơn).
         - Đã xóa hoàn toàn hover:scale, active:scale, transition.
      */}

      {/* Faded icon in top-right corner */}
      <div className="absolute top-4 right-4 opacity-20">
        {icon}
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">
          {title}
        </p>
        <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
        {subtitle && (
          <p className="text-sm font-medium mt-1 opacity-80">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// --- 2. Main Component: StudentStatsGrid ---
interface StudentStatsGridProps {
  stats: StudentStats;
}

const StudentStatsGrid: React.FC<StudentStatsGridProps> = ({ stats }) => {
  const iconClasses = "w-12 h-12";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* --- Card 1: JOINED CLASSES (Teal) --- */}
      <SolidCard
        title="Lớp đã tham gia"
        value={stats.joinedClasses || 0}
        bgColorClass="bg-teal-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001 1h6a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.212c-1.206 0-2.333.337-3.278.925a8.927 8.927 0 00-1.255-.574C6.845 16.028 6 16.482 6 17v1z" />
          </svg>
        }
      />

      {/* --- Card 2: EXAMS TAKEN (Emerald) --- */}
      <SolidCard
        title="Bài thi đã làm"
        value={stats.examsTaken || 0}
        bgColorClass="bg-emerald-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* --- Card 3: AVERAGE SCORE (Blue) --- */}
      <SolidCard
        title="Điểm trung bình"
        value={stats.averageScore?.toFixed(1) || "0.0"}
        bgColorClass="bg-blue-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.397 1.398l-.8 1.6 1.582 3.954a1 1 0 01-1.323 1v-1l-3.954-1.582-1.599.8a1 1 0 01-1.397-1.398l.8-1.6-1.582-3.954a1 1 0 011.323-1V3a1 1 0 011-1zm0 3a1 1 0 00-1 1v5.931l-2.432-.973a1 1 0 00-1.25.437l-1.214 2.428a1 1 0 00.97 1.44l2.663.38 1.126 2.486a1 1 0 001.824 0l1.126-2.486 2.663-.38a1 1 0 00.97-1.44l-1.214-2.428a1 1 0 00-1.25-.437L11 11.931V6a1 1 0 00-1-1z" clipRule="evenodd" />
            <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-3 2-3-2H5V5z" />
          </svg>
        }
      />

      {/* --- Card 4: THPT QG 2026 (Rose) --- */}
      <SolidCard
        title="THPT QG 2026"
        value={stats.daysUntilExam || 0}
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