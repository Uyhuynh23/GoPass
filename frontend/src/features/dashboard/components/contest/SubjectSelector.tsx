"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Subject } from "@/features/dashboard/types/contest";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubjects,
  onSubjectsChange,
}) => {
  const allSubjects: Subject[] = [
    { id: "toan", name: "Toán", isSelected: selectedSubjects.includes("toan") },
    {
      id: "ngu-van",
      name: "Ngữ Văn",
      isSelected: selectedSubjects.includes("ngu-van"),
    },
    {
      id: "tieng-anh",
      name: "Tiếng Anh",
      isSelected: selectedSubjects.includes("tieng-anh"),
    },
    {
      id: "vat-ly",
      name: "Vật Lý",
      isSelected: selectedSubjects.includes("vat-ly"),
    },
    {
      id: "hoa-hoc",
      name: "Hóa Học",
      isSelected: selectedSubjects.includes("hoa-hoc"),
    },
    {
      id: "sinh-hoc",
      name: "Sinh Học",
      isSelected: selectedSubjects.includes("sinh-hoc"),
    },
  ];

  const handleAddExam = (subjectId: string) => {
    console.log("Add exam for subject:", subjectId);
    // TODO: Open exam selection modal
    if (!selectedSubjects.includes(subjectId)) {
      onSubjectsChange([...selectedSubjects, subjectId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {allSubjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {subject.name}
            </span>
            <button
              onClick={() => handleAddExam(subject.id)}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm đề
            </button>
          </div>
          {subject.isSelected && (
            <div className="mt-2 text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded">
              ✓ Đã thêm đề thi
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubjectSelector;
