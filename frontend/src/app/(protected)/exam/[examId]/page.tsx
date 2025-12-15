import React from "react";
import { notFound } from "next/navigation";
// Import Service đã tạo ở Bước 1
import { examService } from "@/services/exam/exam.service";
import ExamDetailClient from "./ExamDetailClient";

// Đây là Server Component, nên có thể dùng async/await thoải mái
export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  // 1. Resolve params (Yêu cầu bắt buộc của Next.js 15)
  const { examId } = await params;

  // 2. Gọi Service để lấy dữ liệu (Async call)
  const exam = await examService.getExamById(examId);

  // 3. Xử lý trường hợp không tìm thấy
  if (!exam) {
    notFound();
  }

  // 4. Truyền dữ liệu xuống Client Component để hiển thị
  return <ExamDetailClient exam={exam} />;
}
