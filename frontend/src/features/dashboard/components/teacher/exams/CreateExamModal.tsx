"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useTeacherData } from "@/features/dashboard/context/TeacherDataContext";

interface CreateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (examData: any) => void;
}

interface ExamFormData {
    title: string;
    subject: string;
    description: string;
    createMethod: "upload" | "auto" | "";
    classIds: string[];
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    totalQuestions: string;
    duration: string;
    showAnswers: boolean;
    showLeaderboard: boolean;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const { teacherData, addExam } = useTeacherData();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ExamFormData>({
        title: "",
        subject: "",
        description: "",
        createMethod: "",
        classIds: [],
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        totalQuestions: "50",
        duration: "90",
        showAnswers: false,
        showLeaderboard: false,
    });

    const classes = teacherData.classes;

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (field: keyof ExamFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClassToggle = (classId: string) => {
        setFormData(prev => ({
            ...prev,
            classIds: prev.classIds.includes(classId)
                ? prev.classIds.filter(id => id !== classId)
                : [...prev.classIds, classId]
        }));
    };

    const handleSubmit = () => {
        // Add to context
        addExam(formData);

        // Call parent onSubmit
        onSubmit(formData);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            subject: "",
            description: "",
            createMethod: "",
            classIds: [],
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            totalQuestions: "50",
            duration: "90",
            showAnswers: false,
            showLeaderboard: false,
        });
        setCurrentStep(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-600"
                            }`}
                    >
                        {step}
                    </div>
                    {step < 3 && (
                        <div
                            className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-teal-500" : "bg-gray-200"
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Thông tin cơ bản
                </h3>
                <p className="text-sm text-gray-600">
                    Tạo đề thi theo dùng quy chế thi THPT Quốc Gia 2025
                </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên đề thi
                    </label>
                    <Input
                        placeholder="Ví dụ: Đề thi thử THPT QG 2025 - Toán"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Môn học
                    </label>
                    <select
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    >
                        <option value="">Chọn môn học</option>
                        <option value="Toán">Toán</option>
                        <option value="Lý">Lý</option>
                        <option value="Hóa">Hóa</option>
                        <option value="Sinh">Sinh</option>
                        <option value="Anh">Tiếng Anh</option>
                        <option value="Văn">Văn</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        placeholder="Mô tả ngắn về đề thi..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                        rows={3}
                    />
                </div>

                {/* Total Questions & Duration */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số câu hỏi
                        </label>
                        <Input
                            type="number"
                            placeholder="50"
                            value={formData.totalQuestions}
                            onChange={(e) => handleInputChange("totalQuestions", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời gian (phút)
                        </label>
                        <Input
                            type="number"
                            placeholder="90"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Create Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn cách tạo đề
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleInputChange("createMethod", "upload")}
                        className={`p-4 border rounded-lg text-center transition-colors ${formData.createMethod === "upload"
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl mb-2">📤</div>
                        <div className="font-medium text-gray-900">Tải lên file</div>
                        <div className="text-sm text-gray-600">
                            Tải lên đề thi theo template chuẩn
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleInputChange("createMethod", "auto")}
                        className={`p-4 border rounded-lg text-center transition-colors ${formData.createMethod === "auto"
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl mb-2">⚙️</div>
                        <div className="font-medium text-gray-900">Tạo tự động</div>
                        <div className="text-sm text-gray-600">
                            Tạo tự ngẫu nhiên câu hỏi theo ma trận
                        </div>
                    </button>
                </div>
            </div>

            {/* File Upload Section */}
            {formData.createMethod === "upload" && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <div className="text-sm text-gray-600 mb-2">
                        Kéo thả file hoặc click để chọn
                    </div>
                    <div className="text-xs text-gray-500">
                        Định dạng: .doc, .docx (Tối đa 15MB)
                    </div>
                    <input type="file" className="hidden" accept=".doc,.docx" />
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Gán cho lớp học
                </h3>
            </div>

            <div>
                <div className="text-sm text-gray-600 mb-4">
                    Đã chọn: {formData.classIds.length} lớp
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {classes.map((classItem) => (
                        <label
                            key={classItem.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.classIds.includes(classItem.id)
                                ? "border-teal-500 bg-teal-50"
                                : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.classIds.includes(classItem.id)}
                                onChange={() => handleClassToggle(classItem.id)}
                                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-3"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {classItem.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {classItem.studentCount} học sinh
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày bắt đầu
                    </label>
                    <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ bắt đầu
                    </label>
                    <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày kết thúc
                    </label>
                    <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ kết thúc
                    </label>
                    <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Cài đặt đề thi
                </h3>
            </div>

            {/* Settings */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hiển thị đáp án sau khi thi
                    </label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.showAnswers}
                                onChange={(e) => handleInputChange("showAnswers", e.target.checked)}
                                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">Học sinh có thể xem đáp án đề thi sau khi hoàn thành bài thi</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Tóm tắt đề thi</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tên đề thi:</span>
                        <span className="text-gray-900">{formData.title || "Chưa nhập"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Môn học:</span>
                        <span className="text-gray-900">{formData.subject || "Chưa chọn"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số lớp:</span>
                        <span className="text-gray-900">{formData.classIds.length} lớp</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số câu hỏi:</span>
                        <span className="text-gray-900">{formData.totalQuestions} câu</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="text-gray-900">
                            {formData.startDate && formData.endDate
                                ? `${formData.startDate} - ${formData.endDate}`
                                : "Chưa cài đặt"
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian làm bài:</span>
                        <span className="text-gray-900">{formData.duration} phút</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] mx-4 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Tạo đề thi mới
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Tạo đề thi theo dùng quy chế thi THPT Quốc Gia 2025
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderStepIndicator()}

                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handlePrev}
                                className="flex-1"
                            >
                                Quay lại
                            </Button>
                        )}

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNext}
                                className="flex-1"
                                disabled={
                                    (currentStep === 1 && (!formData.title || !formData.subject || !formData.createMethod)) ||
                                    (currentStep === 2 && formData.classIds.length === 0)
                                }
                            >
                                Tiếp theo
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleSubmit}
                                className="flex-1"
                            >
                                Tạo đề thi
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExamModal;