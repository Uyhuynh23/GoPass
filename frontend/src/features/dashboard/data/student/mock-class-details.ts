// src/features/dashboard/data/mock-class-details.ts
import { ClassDetail } from "../../types/class";

const MOCK_CLASSES_DB: ClassDetail[] = [
  {
    id: "C01",
    code: "CLASS001",
    name: "Lớp 12A1 - Trường THPT Nguyễn Huệ",
    subject: "Toán học",
    teacher: "Thầy Nguyễn Văn B",
    studentsCount: 45,
    startDate: "01/09/2025",
    description: "Lớp chuyên Toán - Ôn thi THPT Quốc gia 2026. Mục tiêu 9+.",
    stats: {
      rank: 5,
      totalStudents: 45,
      assignmentsDone: 3,
      totalAssignments: 10,
      avgScore: 8.2,
    },
    assignments: [
      {
        id: 101,
        title: "Kiểm tra khảo sát chất lượng đầu năm",
        deadline: "2025-09-15",
        duration: 90,
        status: "completed",
        score: 8.5,
        maxScore: 10,
      },
      {
        id: 102,
        title: "Chuyên đề: Hàm số và Đồ thị",
        deadline: "2025-10-01",
        duration: 45,
        status: "completed",
        score: 7.8,
        maxScore: 10,
      },
      {
        id: 103,
        title: "Kiểm tra 15 phút - Logarit",
        deadline: "2025-12-20",
        duration: 15,
        status: "upcoming",
        score: null,
        maxScore: 10,
      },
    ],
  },
  {
    id: "C02",
    code: "CLASS002",
    name: "Khóa Luyện Thi Đại Học 2025",
    subject: "Vật Lý",
    teacher: "Cô Phạm Thị Hằng",
    studentsCount: 120,
    startDate: "15/08/2025",
    description: "Lớp đại trà, tập trung giải đề và mẹo làm bài trắc nghiệm.",
    stats: {
      rank: 22,
      totalStudents: 120,
      assignmentsDone: 5,
      totalAssignments: 8,
      avgScore: 7.5,
    },
    assignments: [
      {
        id: 201,
        title: "Dao động cơ - Cơ bản",
        deadline: "2025-09-01",
        duration: 45,
        status: "completed",
        score: 9.0,
        maxScore: 10,
      },
      {
        id: 202,
        title: "Sóng cơ học - Nâng cao",
        deadline: "2025-12-15",
        duration: 60,
        status: "ongoing",
        score: null,
        maxScore: 10,
      },
    ],
  },
];

// Helper function to simulate API fetch
export const getClassDetailById = (id: string): ClassDetail | undefined => {
  return MOCK_CLASSES_DB.find((c) => c.id === id);
};