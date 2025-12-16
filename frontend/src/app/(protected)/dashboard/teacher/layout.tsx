"use client";

import { TeacherDataProvider } from "@/features/dashboard/context/TeacherDataContext";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TeacherDataProvider>
            {children}
        </TeacherDataProvider>
    );
}