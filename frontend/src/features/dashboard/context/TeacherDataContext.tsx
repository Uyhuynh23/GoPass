"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { TeacherDashboardData, TeacherExam, TeacherClass } from "../types/teacher";
import { mockTeacherData } from "../data/mock-teacher";

interface TeacherDataContextType {
    teacherData: TeacherDashboardData;
    addExam: (examData: any) => void;
    addClass: (classData: any) => void;
    deleteExam: (examId: string) => void;
    deleteClass: (classId: string) => void;
}

const TeacherDataContext = createContext<TeacherDataContextType | undefined>(undefined);

export const TeacherDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teacherData, setTeacherData] = useState<TeacherDashboardData>(mockTeacherData);

    const addExam = (examData: any) => {
        const newExam: TeacherExam = {
            id: Date.now().toString(),
            title: examData.title,
            subject: examData.subject,
            classId: examData.classIds[0] || "", // First class selected
            className: examData.classIds.length > 1
                ? `${examData.classIds.length} lớp học`
                : teacherData.classes.find(c => c.id === examData.classIds[0])?.name || "",
            totalQuestions: parseInt(examData.totalQuestions) || 50,
            duration: parseInt(examData.duration) || 90,
            status: "upcoming",
            totalStudents: examData.classIds.reduce((acc: number, classId: string) => {
                const cls = teacherData.classes.find(c => c.id === classId);
                return acc + (cls ? cls.studentCount : 0);
            }, 0),
            totalSubmissions: 0,
            averageScore: 0,
            createdAt: new Date().toISOString(),
            startTime: examData.startDate && examData.startTime
                ? `${examData.startDate}T${examData.startTime}:00Z`
                : new Date().toISOString(),
            endTime: examData.endDate && examData.endTime
                ? `${examData.endDate}T${examData.endTime}:00Z`
                : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            description: examData.description || "",
        };

        setTeacherData(prev => ({
            ...prev,
            exams: [newExam, ...prev.exams],
            stats: {
                ...prev.stats,
                totalExams: prev.stats.totalExams + 1,
            },
            recentActivity: [
                {
                    id: Date.now().toString(),
                    type: "exam_created",
                    message: `Bạn đã tạo đề thi "${newExam.title}"`,
                    timestamp: new Date().toISOString(),
                    examTitle: newExam.title,
                },
                ...prev.recentActivity,
            ],
        }));
    };

    const addClass = (classData: any) => {
        const newClass: TeacherClass = {
            id: Date.now().toString(),
            name: classData.name,
            subject: classData.subject,
            grade: classData.grade,
            studentCount: 0,
            examCount: 0,
            description: classData.description || "",
            createdAt: new Date().toISOString(),
        };

        setTeacherData(prev => ({
            ...prev,
            classes: [newClass, ...prev.classes],
            stats: {
                ...prev.stats,
                totalClasses: prev.stats.totalClasses + 1,
            },
            recentActivity: [
                {
                    id: Date.now().toString(),
                    type: "student_joined",
                    message: `Bạn đã tạo lớp học "${newClass.name}"`,
                    timestamp: new Date().toISOString(),
                },
                ...prev.recentActivity,
            ],
        }));
    };

    const deleteExam = (examId: string) => {
        setTeacherData(prev => {
            const examToDelete = prev.exams.find(e => e.id === examId);
            return {
                ...prev,
                exams: prev.exams.filter(e => e.id !== examId),
                stats: {
                    ...prev.stats,
                    totalExams: Math.max(0, prev.stats.totalExams - 1),
                },
                recentActivity: examToDelete ? [
                    {
                        id: Date.now().toString(),
                        type: "reminder",
                        message: `Đã xóa đề thi "${examToDelete.title}"`,
                        timestamp: new Date().toISOString(),
                    },
                    ...prev.recentActivity,
                ] : prev.recentActivity,
            };
        });
    };

    const deleteClass = (classId: string) => {
        setTeacherData(prev => {
            const classToDelete = prev.classes.find(c => c.id === classId);
            return {
                ...prev,
                classes: prev.classes.filter(c => c.id !== classId),
                stats: {
                    ...prev.stats,
                    totalClasses: Math.max(0, prev.stats.totalClasses - 1),
                },
                recentActivity: classToDelete ? [
                    {
                        id: Date.now().toString(),
                        type: "reminder",
                        message: `Đã xóa lớp học "${classToDelete.name}"`,
                        timestamp: new Date().toISOString(),
                    },
                    ...prev.recentActivity,
                ] : prev.recentActivity,
            };
        });
    };

    return (
        <TeacherDataContext.Provider
            value={{
                teacherData,
                addExam,
                addClass,
                deleteExam,
                deleteClass,
            }}
        >
            {children}
        </TeacherDataContext.Provider>
    );
};

export const useTeacherData = (): TeacherDataContextType => {
    const context = useContext(TeacherDataContext);
    if (context === undefined) {
        throw new Error("useTeacherData must be used within a TeacherDataProvider");
    }
    return context;
};