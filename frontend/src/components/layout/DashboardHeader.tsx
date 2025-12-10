import React from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  userRole: "admin" | "student" | "teacher";
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  userName,
}) => {
  const getRoleLabel = () => {
    const labels = {
      admin: "Quản trị viên",
      student: "Học sinh",
      teacher: "Giáo viên",
    };
    return labels[userRole];
  };

  const getRoleBadgeColor = () => {
    const colors = {
      admin: "bg-purple-100 text-purple-700",
      student: "bg-teal-100 text-teal-700",
      teacher: "bg-blue-100 text-blue-700",
    };
    return colors[userRole];
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GoPass</h1>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}
              >
                {getRoleLabel()}
              </span>
            </div>
          </Link>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{userName}</span>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
