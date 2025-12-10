"use client";

import React from "react";
import AdminDashboardView from "@/features/dashboard/components/admin/AdminDashboardView";
import QuestionBankView from "@/features/dashboard/components/questionbank/QuestionBankView";
import CreateContestView from "@/features/dashboard/components/contest/CreateContestView";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const DashboardPage: React.FC = () => {
  const { activeTab, userRole } = useDashboard();

  const renderAdminContent = () => {
    switch (activeTab) {
      case "exams":
        return <AdminDashboardView />;

      case "question-bank":
        return <QuestionBankView />;

      case "contests":
        return <CreateContestView />;

      default:
        return <AdminDashboardView />;
    }
  };

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

  const renderStudentContent = () => {
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Student Dashboard
        </h2>
        <p className="text-gray-600 mb-4">
          TODO: Implement Student Dashboard View
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg">
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
        return renderAdminContent();

      case "teacher":
        return renderTeacherContent();

      case "student":
        return renderStudentContent();

      default:
        return null;
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;
