import React from "react";
import StudentClassDetailView from "@/features/dashboard/components/student/class/StudentClassDetailView";
// Import the Mock Data Helper
import { getClassDetailById } from "@/features/dashboard/data/mock-class-details";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  // 1. Fetch data based on the ID from URL
  const classData = getClassDetailById(classId);

  // 2. Handle Case: Class Not Found
  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy lớp học</h2>
        <p className="text-gray-500">Mã lớp: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{classId}</span> không tồn tại.</p>
        <a href="/dashboard" className="mt-4 text-teal-600 hover:underline">Quay về trang chủ</a>
      </div>
    );
  }

  // 3. Render View with Data
  return <StudentClassDetailView classData={classData} />;
}