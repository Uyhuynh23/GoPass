"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: any) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    class_name: "",
    description: "",
    subject: "",
    grade: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({ class_name: "", description: "", subject: "", grade: "" });
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tạo lớp học mới</h2>
                <p className="text-sm text-gray-500 mt-1">Tạo và quản lý lớp học của bạn</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lớp học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.class_name}
                onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                placeholder="VD: Lớp 12A1 - THPT Nguyễn Huệ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Subject and Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="" className="text-gray-500">Chọn môn học</option>
                  <option value="Toán" className="text-gray-900">Toán</option>
                  <option value="Ngữ Văn" className="text-gray-900">Ngữ Văn</option>
                  <option value="Tiếng Anh" className="text-gray-900">Tiếng Anh</option>
                  <option value="Vật Lý" className="text-gray-900">Vật Lý</option>
                  <option value="Hóa Học" className="text-gray-900">Hóa Học</option>
                  <option value="Sinh Học" className="text-gray-900">Sinh Học</option>
                  <option value="Lịch Sử" className="text-gray-900">Lịch Sử</option>
                  <option value="Địa Lý" className="text-gray-900">Địa Lý</option>
                  <option value="GDCD" className="text-gray-900">GDCD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khối lớp <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="" className="text-gray-500">Chọn khối</option>
                  <option value="Lớp 10" className="text-gray-900">Lớp 10</option>
                  <option value="Lớp 11" className="text-gray-900">Lớp 11</option>
                  <option value="Lớp 12" className="text-gray-900">Lớp 12</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả lớp học
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về lớp học, mục tiêu, yêu cầu..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </div>
                ) : (
                  "Tạo lớp học"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateClassModal;