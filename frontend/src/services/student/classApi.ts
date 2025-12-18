// src/services/student/classApi.ts
import { ClassDetail, ClassAssignment, AssignmentStatus } from "@/features/dashboard/types/student/";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getClassDetailById = async (
  classId: string, 
  currentUserId: string = "u_student_01"
): Promise<ClassDetail | null> => {
  try {
    // 1. Fetch dữ liệu song song
    // [THAY ĐỔI]: Fetch thêm bảng "exams" (lấy toàn bộ) để làm từ điển tra cứu
    const [classRes, membersRes, assignmentsRes, submissionsRes, allExamsRes] = await Promise.all([
      fetch(`${BASE_URL}/classes/${classId}`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/classmembers?class_id=${classId}`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/examassignments?class_id=${classId}`, { cache: 'no-store' }), // Bỏ _expand vì ta sẽ tự map
      fetch(`${BASE_URL}/examsubmissions?class_id=${classId}`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/exams`, { cache: 'no-store' }) // Lấy tất cả đề thi
    ]);

    if (!classRes.ok) return null;

    const classData = await classRes.json();
    const membersData = await membersRes.json();
    const assignmentsData = await assignmentsRes.json();
    const submissionsData = await submissionsRes.json();
    const allExamsData = await allExamsRes.json(); // Array tất cả đề thi

    // 2. Tạo Exam Map (Từ điển) để tra cứu nhanh
    // Biến đổi array [ {exam_id: "A", ...}, {exam_id: "B", ...} ] 
    // Thành object: { "A": {...}, "B": {...} }
    const examMap: Record<string, any> = {};
    if (Array.isArray(allExamsData)) {
      allExamsData.forEach((exam: any) => {
        // Lưu ý: Dùng đúng key 'exam_id' trong db.json của bạn làm key cho Map
        if (exam.exam_id) {
          examMap[exam.exam_id] = exam;
        }
      });
    }

    // 3. Lấy tên giáo viên
    let teacherName = "Giáo viên";
    if (classData.teacher_user_id) {
      try {
        const teacherRes = await fetch(`${BASE_URL}/users/${classData.teacher_user_id}`);
        if (teacherRes.ok) {
          const tData = await teacherRes.json();
          teacherName = tData.full_name;
        }
      } catch (e) {}
    }

    // 4. Mapping Data
    const now = new Date();
    const myAllSubmissions = submissionsData.filter((s: any) => s.student_user_id === currentUserId);
    const subjectsFound: Record<string, number> = {};

    // Map bình thường (không cần async nữa vì dữ liệu đã có sẵn trong examMap)
    const mappedAssignments: ClassAssignment[] = assignmentsData.map((assign: any) => {
      
      // --- A. TRA CỨU TỪ DIỂN ---
      // Lấy thông tin đề thi từ examMap dựa vào exam_id
      const examDetail = examMap[assign.exam_id];

      // Debug nếu vẫn lỗi: Kiểm tra xem log này in ra gì
      if (!examDetail) console.warn(`Không tìm thấy exam_id: ${assign.exam_id} trong danh sách Exam`);

      const examTitle = examDetail?.title || `Bài tập ${assign.exam_id} (Thiếu dữ liệu)`;
      const examDuration = examDetail?.duration_min || 0;
      const examTotalScore = examDetail?.total_score || 10;
      const examSubject = examDetail?.subject || "Tổng hợp";
      const questionCount = examDetail?.question_count || 40;

      // Cộng dồn môn học
      subjectsFound[examSubject] = (subjectsFound[examSubject] || 0) + 1;

      // --- B. LOGIC SUBMISSION ---
      const mySubmissionsForThisExam = myAllSubmissions.filter((s: any) => s.exam_id === assign.exam_id);
      const latestSubmission = mySubmissionsForThisExam.length > 0 
        ? mySubmissionsForThisExam[mySubmissionsForThisExam.length - 1] 
        : null;

      const submitters = new Set(
        submissionsData
          .filter((s: any) => s.exam_id === assign.exam_id)
          .map((s: any) => s.student_user_id)
      );

      // --- C. LOGIC STATUS ---
      const startTime = new Date(assign.start_time);
      const endTime = new Date(assign.end_time);
      let status: AssignmentStatus = "upcoming";

      if (latestSubmission) {
        status = "completed";
      } else {
        if (now < startTime) status = "upcoming";
        else if (now >= startTime && now <= endTime) status = "ongoing";
        else if (now > endTime) status = "incomplete";
      }

      return {
        id: assign.assignment_id,
        examId: assign.exam_id,
        title: examTitle, // Chắc chắn có dữ liệu
        
        startTime: assign.start_time,
        endTime: assign.end_time,
        deadlineDisplay: formatDate(assign.end_time),
        
        duration: examDuration, // Chắc chắn có dữ liệu
        questionCount: questionCount,
        status: status,
        
        score: latestSubmission ? latestSubmission.final_score : null,
        maxScore: examTotalScore,
        
        attemptLimit: assign.attempt_limit ?? -1,
        myAttemptCount: mySubmissionsForThisExam.length,
        
        submittedCount: submitters.size,
        totalStudents: membersData.length
      };
    });

    // 5. Tìm môn chính
    let mainSubject = "Tổng hợp";
    let maxCount = 0;
    for (const [subj, count] of Object.entries(subjectsFound)) {
      if (count > maxCount) {
        mainSubject = subj;
        maxCount = count;
      }
    }

    // 6. Stats
    const assignmentsDone = mappedAssignments.filter(a => a.status === 'completed').length;
    let totalMyScore = 0;
    let countGraded = 0;
    mappedAssignments.forEach(a => {
        if (typeof a.score === 'number') {
            totalMyScore += a.score;
            countGraded++;
        }
    });
    const avgScore = countGraded > 0 ? Number((totalMyScore / countGraded).toFixed(1)) : 0;

    return {
      id: classData.id,
      code: classData.class_code,
      name: classData.class_name,
      subject: mainSubject,
      teacher: teacherName,
      studentsCount: membersData.length,
      description: classData.description,
      
      stats: {
        rank: 0,
        totalStudents: membersData.length,
        assignmentsDone: assignmentsDone,
        totalAssignments: mappedAssignments.length,
        avgScore: avgScore
      },
      
      assignments: mappedAssignments
    };

  } catch (error) {
    console.error("Failed to fetch class details:", error);
    return null;
  }
};