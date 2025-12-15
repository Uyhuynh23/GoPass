"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useTeacherData } from "@/features/dashboard/context/TeacherDataContext";

interface AssignExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (assignmentData: any) => void;
    exam: any;
}

const AssignExamModal: React.FC<AssignExamModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    exam,
}) => {
    const { teacherData } = useTeacherData();
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const classes = teacherData.classes;

    const handleClassToggle = (classId: string) => {
        setSelectedClasses(prev =>
            prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const handleSubmit = () => {
        const assignmentData = {
            examId: exam.id,
            classIds: selectedClasses,
            startDate,
            startTime,
            endDate,
            endTime,
        };
        onSubmit(assignmentData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Gán đề thi cho lớp
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {exam.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Class Selection */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Chọn lớp học</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {classes.map((classItem) => (
                                <label
                                    key={classItem.id}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedClasses.includes(classItem.id)
                                            ? "border-teal-500 bg-teal-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedClasses.includes(classItem.id)}
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giờ bắt đầu
                            </label>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày kết thúc
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giờ kết thúc
                            </label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            className="flex-1"
                            disabled={selectedClasses.length === 0}
                        >
                            <span className="mr-2">✈️</span>
                            Gán đề thi
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignExamModal;