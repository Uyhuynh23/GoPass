// src/features/dashboard/data/mock-student.ts
import { StudentDashboardData } from "../../types/student";

export const mockStudentData: StudentDashboardData = {
  stats: {
    joinedClasses: 2,       // Thẻ xanh Teal
    examsTaken: 5,          // Thẻ xanh lá
    averageScore: 8.0,      // Thẻ xanh dương
    daysUntilExam: 208,     // Thẻ hồng
  },

  // --- Danh sách đề thi (Đã Việt hóa) ---
  exams: [
    {
      id: "exam-1",
      title: "Đề thi thử Toán - Lần 1",
      class: "Lớp 12A1 - Toán Thầy Ba",
      status: "completed",
      score: 8.5, // Thang điểm 10
      maxScore: 10,
      duration: 90,
      submittedDate: "2025-12-05",
      dueDate: "2025-12-05",
    },
    {
      id: "exam-2",
      title: "Kiểm tra 1 tiết Vật Lý",
      class: "Lý 12 - Cô Hằng",
      status: "completed",
      score: 9.2,
      maxScore: 10,
      duration: 45,
      submittedDate: "2025-12-03",
      dueDate: "2025-12-03",
    },
    {
      id: "exam-3",
      title: "Thi thử Tiếng Anh - Tháng 12",
      class: "Anh Văn Chuyên Sâu",
      status: "in-progress",
      score: null,
      maxScore: 10,
      duration: 60,
      submittedDate: null,
      dueDate: "2025-12-15",
    },
    {
      id: "exam-4",
      title: "Hóa học hữu cơ - Chương 3",
      class: "Lớp 12A1 - Hóa Cô Lan",
      status: "upcoming",
      score: null,
      maxScore: 10,
      duration: 50,
      submittedDate: null,
      dueDate: "2025-12-20",
    },
    {
      id: "exam-5",
      title: "Sinh học đại cương",
      class: "Sinh học 12",
      status: "upcoming",
      score: null,
      maxScore: 10,
      duration: 45,
      submittedDate: null,
      dueDate: "2025-12-25",
    },
  ],

  // --- Biểu đồ điểm (Quy đổi về thang 10) ---
  performanceData: [
    { date: "23/11", score: 8.0, hours: 2, exams: 1 },
    { date: "24/11", score: 8.5, hours: 4, exams: 2 },
    { date: "25/11", score: 7.8, hours: 5, exams: 1 },
    { date: "26/11", score: 9.0, hours: 3, exams: 0 }, 
    { date: "27/11", score: 8.2, hours: 6, exams: 2 },
    { date: "28/11", score: 8.8, hours: 4, exams: 1 },
    { date: "29/11", score: 9.2, hours: 5, exams: 2 },
  ],
};