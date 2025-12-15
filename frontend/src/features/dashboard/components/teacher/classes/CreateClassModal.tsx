"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useTeacherData } from "@/features/dashboard/context/TeacherDataContext";

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: any) => void;
}

interface ClassFormData {
    name: string;
    subject: string;
    grade: string;
    description: string;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const { addClass } = useTeacherData();
    const [formData, setFormData] = useState<ClassFormData>({
        name: "",
        subject: "",
        grade: "",
        description: "",
    });

    const handleInputChange = (field: keyof ClassFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Add to context
        addClass(formData);

        // Call parent onSubmit
        onSubmit(formData);

        // Reset form
        setFormData({
            name: "",
            subject: "",
            grade: "",
            description: "",
        });
    };

    const handleClose = () => {
        setFormData({
            name: "",
            subject: "",
            grade: "",
            description: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Tạo lớp học mới
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Điền thông tin để tạo lớp học của bạn
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
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên lớp học
                        </label>
                        <Input
                            placeholder="Ví dụ: Lớp 12A1 - Toán"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                Khối lớp
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => handleInputChange("grade", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                            >
                                <option value="">Chọn khối</option>
                                <option value="Lớp 10">Lớp 10</option>
                                <option value="Lớp 11">Lớp 11</option>
                                <option value="Lớp 12">Lớp 12</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            placeholder="Mô tả ngắn về lớp học..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            className="flex-1"
                            disabled={!formData.name || !formData.subject || !formData.grade}
                        >
                            Tạo lớp học
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateClassModal;