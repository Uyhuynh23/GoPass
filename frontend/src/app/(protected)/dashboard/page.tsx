"use client";

import React from "react";
import AdminDashboardView from "@/features/dashboard/components/admin/AdminDashboardView";
import StudentDashboardView from "@/features/dashboard/components/student/overview/StudentDashboardView";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const DashboardPage: React.FC = () => {
  const { userRole } = useDashboard();

  const renderTeacherContent = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-16 w-16 text-teal-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Teacher Dashboard
        </h2>
        <p className="text-gray-600 mb-4">
          TODO: Implement Teacher Dashboard View
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Coming Soon
        </div>
      </div>
    );
  };

  const renderDashboardByRole = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboardView />;

      case "teacher":
        return renderTeacherContent();

      case "student":
        return <StudentDashboardView />;

      default:
        return null;
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;
