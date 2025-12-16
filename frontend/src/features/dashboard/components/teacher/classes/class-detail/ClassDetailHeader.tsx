"use client";

import React from "react";
import { Button } from "@/components/ui";

interface ClassDetailHeaderProps {
  classDetail: {
    id: string;
    class_name: string;
    description: string;
    class_code: string;
    teacher: {
      id: string;
      full_name: string;
      email: string;
    };
    stats: {
      totalMembers: number;
      pendingRequests: number;
      activeAssignments: number;
      averageScore: number;
    };
  };
  onGoBack: () => void;
}

const ClassDetailHeader: React.FC<ClassDetailHeaderProps> = ({ 
  classDetail, 
  onGoBack 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{classDetail.class_name}</h1>
            <p className="text-teal-100 mt-1">{classDetail.description}</p>
          </div>
        </div>

        {/* Class Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.totalMembers}</p>
                <p className="text-sm text-teal-100">Học sinh</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.activeAssignments}</p>
                <p className="text-sm text-teal-100">Đề thi</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.averageScore}</p>
                <p className="text-sm text-teal-100">Điểm TB</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-teal-100">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with class code */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã lớp học</p>
              <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800">
                {classDetail.class_code}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giáo viên</p>
              <p className="font-medium text-gray-900">{classDetail.teacher.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" className="text-sm">
              Chia sẻ mã lớp
            </Button>
            <Button variant="primary" className="text-sm bg-teal-600 hover:bg-teal-700">
              Giao bài tập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailHeader;