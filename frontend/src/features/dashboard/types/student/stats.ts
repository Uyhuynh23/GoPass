//src/features/dashboard/types/student/stats.ts

import { StudentExam } from "./exam"; // Import type nếu cần sử dụng chéo

// Type cho 4 thẻ Cards thống kê trên cùng
export interface StudentStats {
  joinedClasses: number;    // Teal Card
  examsTaken: number;       // Green Card
  averageScore: number;     // Blue Card
  daysUntilExam: number;    // Pink Card (THPT QG)
}

// Type cho biểu đồ hoạt động
export interface PerformanceDataPoint {
  date: string;   // e.g., "24/11"
  hours: number;  
  exams: number;  
  score: number;  
}

// Type cho hiệu suất theo môn học
export interface SubjectPerformance {
  name: string;    // Tên môn học (e.g., "Toán", "Ngữ Văn")
  score: number;   // Điểm trung bình (normalized to 10-point scale)
  total: number;   // Tổng số bài thi đã làm cho môn này
}

// Type tổng hợp cho Dashboard (nếu cần)
export interface StudentDashboardData {
  stats: StudentStats;
  exams: StudentExam[];
  performanceData: PerformanceDataPoint[];
}