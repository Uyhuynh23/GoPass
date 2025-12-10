"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { mockQuestionBankData } from "@/features/dashboard/data/mock-questionbank";
import QuestionTopicList from "./QuestionTopicList";
import SubjectTabs from "./SubjectTabs";

const QuestionBankView: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState("Toán");

  const handleImportFile = () => {
    console.log("Import file");
    // TODO: Implement file import
  };

  const handleAddQuestion = () => {
    console.log("Add question");
    // TODO: Navigate to add question page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Ngân hàng câu hỏi"
        subtitle="Quản lý câu hỏi theo môn học và độ khó"
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleImportFile}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              }
            >
              Nhập từ file
            </Button>
            <Button
              variant="primary"
              onClick={handleAddQuestion}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Thêm câu hỏi
            </Button>
          </div>
        }
      />

      {/* Subject Tabs */}
      <SubjectTabs
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
      />

      {/* Instructions */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-teal-800 mb-1">
          Chú đề và câu hỏi
        </h3>
        <p className="text-sm text-teal-700">
          Click vào chủ đề để xem chi tiết phân bố độ khó
        </p>
      </div>

      {/* Topic List */}
      <QuestionTopicList topics={mockQuestionBankData.topics} />
    </div>
  );
};

export default QuestionBankView;
