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

// Type tổng hợp cho Dashboard (nếu cần)
export interface StudentDashboardData {
  stats: StudentStats;
  exams: StudentExam[];
  performanceData: PerformanceDataPoint[];
}