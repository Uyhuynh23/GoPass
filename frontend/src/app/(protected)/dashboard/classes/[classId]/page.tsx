import React from "react";
import StudentClassDetailView from "@/features/dashboard/components/student/class/StudentClassDetailView";

// [UPDATE 1] Import từ API mới thay vì mock data cũ
import { getClassDetailById } from "@/services/student/classApi";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  // Trong Next.js 15+, params là một Promise nên cần await
  const { classId } = await params;

  // [UPDATE 2] Thêm 'await' vì hàm bây giờ là bất đồng bộ (Async)
  const classData = await getClassDetailById(classId);

  // 3. Handle Case: Class Not Found
  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy lớp học</h2>
        <p className="text-gray-500">Mã lớp: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{classId}</span> không tồn tại.</p>
        <a href="/dashboard" className="mt-4 text-teal-600 hover:underline">Quay về trang chủ</a>
      </div>
    );
  }

  // 4. Render View with Data
  return <StudentClassDetailView classData={classData} />;
}