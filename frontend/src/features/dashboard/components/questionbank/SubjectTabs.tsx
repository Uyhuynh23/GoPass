"use client";

import React from "react";

interface SubjectTabsProps {
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({
  activeSubject,
  onSubjectChange,
}) => {
  const subjects = ["Toán", "Ngữ Văn", "Tiếng Anh"];

  return (
    <div className="flex gap-3">
      {subjects.map((subject) => {
        const isActive = activeSubject === subject;
        return (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`
              px-6 py-2.5 rounded-lg font-medium text-sm transition-all
              ${
                isActive
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            {subject}
          </button>
        );
      })}
    </div>
  );
};

export default SubjectTabs;
