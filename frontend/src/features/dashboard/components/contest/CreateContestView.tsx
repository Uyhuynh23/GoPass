"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ContestFormData } from "@/features/dashboard/types/contest";
import SubjectSelector from "./SubjectSelector";
import ContestPreview from "./ContestPreview";

const CreateContestView: React.FC = () => {
  const [formData, setFormData] = useState<ContestFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    subjects: [],
  });

  const handleInputChange = (field: keyof ContestFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubjectsChange = (subjects: string[]) => {
    setFormData((prev) => ({
      ...prev,
      subjects,
    }));
  };

  const handleCreateContest = () => {
    console.log("Create contest:", formData);
    // TODO: Validate and submit
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      subjects: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Tạo cuộc thi mới"
        subtitle="Tổ chức cuộc thi cho toàn hệ thống"
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Thông tin cuộc thi
          </h2>
        </div>

        <div className="space-y-5">
          {/* Contest Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên cuộc thi <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Ví dụ: Olympic Toán Toàn Quốc 2025"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả cuộc thi
            </label>
            <textarea
              placeholder="Mô tả chi tiết về cuộc thi, quy định, giải thưởng..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn thi <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Thêm đề thi cho từng môn
            </p>
            <SubjectSelector
              selectedSubjects={formData.subjects}
              onSubjectsChange={handleSubjectsChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateContest}
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            }
          >
            Tạo cuộc thi
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-purple-800 mb-1">Xem trước</h3>
        <p className="text-sm text-purple-700 mb-3">
          Cuộc thi sẽ hiển thị như thế này với người dùng
        </p>
      </div>

      {formData.title && <ContestPreview formData={formData} />}
    </div>
  );
};

export default CreateContestView;
