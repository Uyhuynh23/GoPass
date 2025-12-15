// src/utils/studentStatsHelper.ts
import { ClassMember, ExamSubmission, StudentStats } from "@/features/dashboard/types/student";

export const calculateStudentStats = (
  studentId: string,
  classMembers: ClassMember[],
  submissions: ExamSubmission[]
): StudentStats => {
  // 1. Tính số lớp đã tham gia
  // Chỉ đếm những lớp có status là 'approved'
  const joinedClassesCount = classMembers.filter(
    (m) => m.student_user_id === studentId && m.status === 'approved'
  ).length;

  // 2. Lọc danh sách bài thi của học sinh này
  // Chỉ tính những bài đã hoàn thành (completed) để tính điểm trung bình chính xác
  const myCompletedSubmissions = submissions.filter(
    (s) => s.student_user_id === studentId && s.status === 'completed'
  );

  const examsTakenCount = myCompletedSubmissions.length;

  // 3. Tính điểm trung bình
  let totalScore = 0;
  let validScoreCount = 0;

  myCompletedSubmissions.forEach((sub) => {
    // Kiểm tra xem có điểm final_score không (tránh null/undefined)
    if (typeof sub.final_score === 'number') {
      totalScore += sub.final_score;
      validScoreCount++;
    }
  });

  // Nếu chưa làm bài nào thì điểm TB là 0, tránh chia cho 0
  const averageScore = validScoreCount > 0 ? totalScore / validScoreCount : 0;

  // 4. Tính ngày đếm ngược thi THPT QG (Ví dụ: 25/06/2026)
  const examDate = new Date("2026-06-25T00:00:00");
  const today = new Date();
  
  // Tính khoảng cách thời gian (milliseconds)
  const diffTime = examDate.getTime() - today.getTime();
  
  // Chuyển đổi sang ngày (chia cho mili-giây trong 1 ngày)
  // Math.ceil để làm tròn lên (ví dụ còn 1.5 ngày thì tính là 2 ngày)
  const daysUntilExam = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

  return {
    joinedClasses: joinedClassesCount,
    examsTaken: examsTakenCount,
    averageScore: averageScore,
    daysUntilExam: daysUntilExam,
  };
};