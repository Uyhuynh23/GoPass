"use client";

import React from "react";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { DifficultyLevel } from "@/features/dashboard/types/question";

interface CommonFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (value: DifficultyLevel) => void;
  points: number;
  onPointsChange: (value: number) => void;
  timeLimit?: number;
  onTimeLimitChange: (value: number | undefined) => void;
  language: "vi" | "en";
  onLanguageChange: (value: "vi" | "en") => void;
}

const CommonFields: React.FC<CommonFieldsProps> = ({
  title,
  onTitleChange,
  tags,
  onTagsChange,
  difficulty,
  onDifficultyChange,
  points,
  onPointsChange,
  timeLimit,
  onTimeLimitChange,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 uppercase">
        Thông tin chung
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tiêu đề (tùy chọn)"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="VD: Câu hỏi về hàm số bậc 2"
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Độ khó
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as DifficultyLevel)
            }
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điểm
          </label>
          <input
            type="number"
            min="1"
            value={points}
            onChange={(e) => onPointsChange(Number(e.target.value))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian (giây) - tùy chọn
          </label>
          <input
            type="number"
            min="0"
            value={timeLimit || ""}
            onChange={(e) =>
              onTimeLimitChange(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="VD: 120"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngôn ngữ
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as "vi" | "en")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (nhấn Enter để thêm)
          </label>
          <input
            type="text"
            placeholder="VD: toán, hàm số..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                e.preventDefault();
                const newTag = e.currentTarget.value.trim();
                if (newTag && !tags.includes(newTag)) {
                  onTagsChange([...tags, newTag]);
                  e.currentTarget.value = "";
                }
              }
            }}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded text-sm"
                >
                  {tag}
                  <button
                    onClick={() =>
                      onTagsChange(tags.filter((_, i) => i !== idx))
                    }
                    className="hover:text-teal-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonFields;
