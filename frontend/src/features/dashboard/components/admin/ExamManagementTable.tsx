"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Exam, ExamType, ExamStatus } from "@/features/dashboard/types";

interface ExamManagementTableProps {
  exams: Exam[];
  onView: (examId: string) => void;
  onEdit: (examId: string) => void;
  onDelete: (examId: string) => void;
}

const ExamManagementTable: React.FC<ExamManagementTableProps> = ({
  exams,
  onView,
  onEdit,
  onDelete,
}) => {
  const getExamTypeVariant = (type: ExamType) => {
    const variants: Record<ExamType, "contest" | "public" | "default"> = {
      contest: "contest",
      public: "public",
      class: "default",
    };
    return variants[type];
  };

  const getExamTypeLabel = (type: ExamType) => {
    const labels: Record<ExamType, string> = {
      contest: "Contest",
      public: "Public",
      class: "Lớp học",
    };
    return labels[type];
  };

  const getStatusVariant = (status: ExamStatus) => {
    const variants: Record<ExamStatus, "upcoming" | "active" | "completed"> = {
      upcoming: "upcoming",
      active: "active",
      completed: "completed",
    };
    return variants[status];
  };

  const getStatusLabel = (status: ExamStatus) => {
    const labels: Record<ExamStatus, string> = {
      upcoming: "Sắp diễn ra",
      active: "Đang hoạt động",
      completed: "Đã hoàn thành",
    };
    return labels[status];
  };

  const getExamIcon = (type: ExamType) => {
    if (type === "contest") {
      return (
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-6 h-6 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">{getExamIcon(exam.type)}</div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Title and Badges */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getExamTypeVariant(exam.type)}>
                      {getExamTypeLabel(exam.type)}
                    </Badge>
                    <Badge variant={getStatusVariant(exam.status)}>
                      {getStatusLabel(exam.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
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
                  <span>{exam.subject}</span>
                </div>

                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{exam.duration} phút</span>
                </div>

                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{exam.questionCount} câu</span>
                </div>

                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{exam.participantCount} người tham gia</span>
                </div>
              </div>

              {/* Dates */}
              {exam.startDate && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Tạo: {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  {exam.endDate && (
                    <>
                      <span className="mx-2">•</span>
                      <span>
                        Thi:{" "}
                        {new Date(exam.startDate).toLocaleDateString("vi-VN")}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(exam.id)}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
              >
                Xem
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(exam.id)}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
              >
                Sửa
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(exam.id)}
                className="text-red-600 hover:bg-red-50"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                }
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamManagementTable;
