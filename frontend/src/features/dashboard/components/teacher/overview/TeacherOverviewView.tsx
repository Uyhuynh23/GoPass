"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, Button } from "@/components/ui";
import { useTeacherData } from "@/features/dashboard/context/TeacherDataContext";
import TeacherStatsGrid from "./TeacherStatsGrid";
import TeacherClassList from "./TeacherClassList";
import RecentActivityFeed from "./RecentActivityFeed";
import CreateClassModal from "../classes/CreateClassModal";
import CreateExamModal from "../exams/CreateExamModal";

const TeacherOverviewView: React.FC = () => {
    const router = useRouter();
    const { teacherData } = useTeacherData();
    const [showCreateClassModal, setShowCreateClassModal] = useState(false);
    const [showCreateExamModal, setShowCreateExamModal] = useState(false);

    const handleCreateClassClick = () => {
        setShowCreateClassModal(true);
    };

    const handleCreateExamClick = () => {
        setShowCreateExamModal(true);
    };

    const handleCreateClassSubmit = (classData: any) => {
        console.log("Creating class from overview:", classData);
        setShowCreateClassModal(false);
        // TODO: Implement actual API call and refresh data
    };

    const handleCreateExamSubmit = (examData: any) => {
        console.log("Creating exam from overview:", examData);
        setShowCreateExamModal(false);
        // TODO: Implement actual API call and refresh data
    };

    const handleViewAllClasses = () => {
        router.push('/dashboard/teacher/classes');
    };

    const handleViewAllExams = () => {
        router.push('/dashboard/teacher/exams');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title="Tổng quan"
                subtitle="Dashboard giáo viên - Quản lý lớp học và theo dõi tiến độ"
            />

            {/* Stats Grid */}
            <TeacherStatsGrid stats={teacherData.stats} />

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        variant="primary"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={handleCreateClassClick}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Tạo lớp học mới</span>
                    </Button>

                    <Button
                        variant="secondary"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={handleCreateExamClick}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Tạo đề thi mới</span>
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Score Distribution Chart */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Phân bố điểm số học sinh</h3>
                            <p className="text-sm text-gray-600">Thống kê điểm thi trung bình toàn bộ hệ thống</p>
                        </div>
                        <div className="p-6">
                            <div className="h-64 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p>Biểu đồ phân bố điểm</p>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                                    91 học sinh đạt điểm 8-10 (46.7%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Exams */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Đề thi gần đây</h3>
                                <button
                                    onClick={handleViewAllExams}
                                    className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors"
                                >
                                    Xem tất cả →
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {teacherData.recentExams.slice(0, 3).map((exam) => (
                                <div key={exam.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{exam.title}</h4>
                                            <p className="text-sm text-gray-600">{exam.className}</p>
                                        </div>
                                        <span className="text-teal-600 font-medium text-sm">
                                            {exam.duration} phút
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${exam.completionRate}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-500">{exam.completionRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <RecentActivityFeed activities={teacherData.recentActivity.slice(0, 5)} />

                    {/* Top Students */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Học sinh nổi bật</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {teacherData.topStudents.map((student) => (
                                <div key={student.id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{student.name}</h4>
                                            <p className="text-sm text-gray-600">{student.className}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-teal-600">{student.averageScore}</span>
                                                {student.trend === 'up' && (
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{student.totalExams} bài thi</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Classes Section */}
            <TeacherClassList classes={teacherData.classes} />

            {/* Modals */}
            {showCreateClassModal && (
                <CreateClassModal
                    isOpen={showCreateClassModal}
                    onClose={() => setShowCreateClassModal(false)}
                    onSubmit={handleCreateClassSubmit}
                />
            )}

            {showCreateExamModal && (
                <CreateExamModal
                    isOpen={showCreateExamModal}
                    onClose={() => setShowCreateExamModal(false)}
                    onSubmit={handleCreateExamSubmit}
                />
            )}
        </div>
    );
};

export default TeacherOverviewView;