// src/features/exam/components/exam-instructions/StartExamPanel.tsx
"use client";

import React, { useMemo } from "react";
import Button from "@/components/ui/Button";
import { ExamSectionConfig, ExamSubjectConfig } from "../../types";
import { getExamConfigBySubject, formatExamDuration } from "@/utils/exam";

interface StartExamPanelProps {
  examTitle: string;
  examSubject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  onStartExam: () => void;
  onContinueExam?: () => void;
  hasProgress?: boolean;
  onCancel: () => void;
  isLoading?: boolean;
}

// Helper: Map màu sắc cho Section (Logic UI thuần túy)
const getSectionStyles = (color: string) => {
  const map: Record<string, { badge: string; card: string }> = {
    teal: { badge: "bg-teal-500", card: "border-teal-100 bg-teal-50" },
    blue: { badge: "bg-blue-500", card: "border-blue-100 bg-blue-50" },
    purple: { badge: "bg-purple-500", card: "border-purple-100 bg-purple-50" },
    orange: { badge: "bg-orange-500", card: "border-orange-100 bg-orange-50" },
  };
  return map[color] || map.teal;
};

const StartExamPanel: React.FC<StartExamPanelProps> = ({
  examTitle,
  examSubject,
  durationMinutes,
  totalQuestions,
  totalPoints,
  onStartExam,
  onContinueExam,
  hasProgress,
  onCancel,
  isLoading = false,
}) => {
  // 1. Lấy cấu hình tĩnh dựa trên môn học
  const config = useMemo(() => {
    const foundConfig = getExamConfigBySubject(examSubject);

    // Default fallback nếu không tìm thấy config cho môn học
    if (!foundConfig) {
      const defaultConfig: ExamSubjectConfig = {
        subject: examSubject,
        examType: "Kỳ thi Tốt nghiệp THPT",
        sections: [],
        instructions: [
          { text: "Không được sử dụng tài liệu." },
          { text: "Không thể sửa bài sau khi nộp.", highlight: true },
        ],
        timeWarning: 'Thời gian bắt đầu tính khi nhấn "Bắt đầu làm bài"',
        headerGradient: "bg-gradient-to-r from-gray-500 to-gray-600",
      };
      return defaultConfig;
    }
    return foundConfig;
  }, [examSubject]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <div className="max-w-xl w-full px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className={`${config.headerGradient} text-white py-8 px-5`}
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-center md:text-left">
              <div className="flex-1">
                <h1 className="text-xl font-bold mb-2">{examTitle}</h1>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  {config.examType}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Cấu trúc đề thi */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <h2 className="text-base font-bold text-gray-800">
                  Cấu trúc đề thi
                </h2>
              </div>

              <div className="space-y-3">
                {config.sections.length > 0 ? (
                  config.sections.map((section: ExamSectionConfig) => {
                    const styles = getSectionStyles(section.color);
                    return (
                      <div
                        key={section.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${styles.card}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${styles.badge} text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm`}
                        >
                          {section.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-800">
                            {section.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback View
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Tổng quan
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalQuestions} câu hỏi • {totalPoints} điểm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thời gian làm bài */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    Thời gian làm bài:{" "}
                    <span className="text-amber-700">
                      {formatExamDuration(durationMinutes)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {config.timeWarning}
                  </p>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-base font-bold text-gray-800">
                  Lưu ý quan trọng
                </h2>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <ul className="space-y-2">
                  {config.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          instruction.highlight ? "bg-red-500" : "bg-blue-400"
                        }`}
                      />
                      <span
                        className={`text-sm leading-snug ${
                          instruction.highlight
                            ? "text-red-600 font-medium"
                            : "text-slate-600"
                        }`}
                      >
                        {instruction.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Nút Tiếp tục (Chỉ hiện nếu có progress) */}
              {hasProgress && onContinueExam && (
                <Button
                  variant="primary"
                  onClick={onContinueExam}
                  className="w-full py-3 text-sm font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-700/20"
                >
                  Tiếp tục làm bài cũ
                </Button>
              )}

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  className="flex-1 py-3 text-sm font-medium"
                  disabled={isLoading}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant={hasProgress ? "secondary" : "primary"}
                  onClick={onStartExam}
                  disabled={isLoading}
                  className={`flex-1 py-3 text-sm font-bold ${
                    !hasProgress
                      ? "bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-700/20"
                      : "border-teal-600 text-teal-700 hover:bg-teal-50"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang tạo bài thi...
                    </span>
                  ) : hasProgress ? (
                    "Làm lại từ đầu"
                  ) : (
                    "Bắt đầu làm bài"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExamPanel;
