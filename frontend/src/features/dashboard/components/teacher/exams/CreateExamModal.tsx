"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (examData: any) => void;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    totalQuestions: "",
    duration: "",
    difficulty: "medium",
    showAnswers: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        subject: "",
        totalQuestions: "",
        duration: "",
        difficulty: "medium",
        showAnswers: false,
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tạo đề thi mới</h2>
                <p className="text-sm text-gray-500 mt-1">Bước {currentStep} / 3</p>
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

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      step <= currentStep
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 mx-2 rounded transition-colors ${
                        step < currentStep ? "bg-teal-600" : "bg-gray-200"
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Thông tin cơ bản</span>
                <span>Cấu hình đề thi</span>
                <span>Xác nhận</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đề thi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Đề thi thử THPT QG lần 1 - Toán"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    />
                  </div>

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
                      Mô tả đề thi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả về đề thi, yêu cầu, mục tiêu..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số câu hỏi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.totalQuestions}
                        onChange={(e) => setFormData({ ...formData, totalQuestions: e.target.value })}
                        placeholder="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian (phút) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="90"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ khó
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "easy", label: "Dễ", color: "green" },
                        { value: "medium", label: "Trung bình", color: "orange" },
                        { value: "hard", label: "Khó", color: "red" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, difficulty: option.value })}
                          className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                            formData.difficulty === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showAnswers}
                        onChange={(e) => setFormData({ ...formData, showAnswers: e.target.checked })}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Hiển thị đáp án sau khi hoàn thành
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Xác nhận thông tin đề thi</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên đề thi:</span>
                        <span className="font-medium text-gray-900">{formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Môn học:</span>
                        <span className="font-medium text-gray-900">{formData.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số câu hỏi:</span>
                        <span className="font-medium text-gray-900">{formData.totalQuestions} câu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="font-medium text-gray-900">{formData.duration} phút</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Độ khó:</span>
                        <span className="font-medium text-gray-900 capitalize">{formData.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h5 className="font-medium text-blue-900">Lưu ý</h5>
                        <p className="text-sm text-blue-800 mt-1">
                          Sau khi tạo đề thi, bạn có thể thêm câu hỏi và gán đề thi cho các lớp học.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    ← Quay lại
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={
                      (currentStep === 1 && (!formData.title || !formData.subject)) ||
                      (currentStep === 2 && (!formData.totalQuestions || !formData.duration))
                    }
                  >
                    Tiếp tục →
                  </Button>
                ) : (
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
                      "Tạo đề thi"
                    )}
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateExamModal;