// src/services/studentStatsApi.ts
import { StudentStats, HistoryDataResponse, HistoryItem, HistoryStats, PerformanceDataPoint, HistoryType } from "@/features/dashboard/types/student/";

// Cấu hình URL cơ sở (có thể lấy từ env hoặc hardcode để test)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Hàm lấy thống kê tổng quan cho Student Dashboard
 * Thay vì import db.json, ta sẽ fetch trực tiếp từ JSON Server
 */
export const fetchStudentStats = async (studentId: string): Promise<StudentStats> => {
  try {
    // Gọi song song 2 API cần thiết để tiết kiệm thời gian (Parallel Fetching)
    const [classMemberRes, submissionRes] = await Promise.all([
      // 1. Lấy danh sách lớp đã tham gia (chỉ lấy status=approved)
      fetch(`${BASE_URL}/classmembers?student_user_id=${studentId}&status=approved`, { cache: 'no-store' }),

      
      // 2. Lấy danh sách bài thi đã nộp (của học sinh này)
      fetch(`${BASE_URL}/examsubmissions?student_user_id=${studentId}`, { cache: 'no-store' })
    ]);
    console.log("fetching student stats for:", studentId);
    console.log("ClassMember response:", BASE_URL + `/classmembers?student_user_id=${studentId}&status=approved`);

    // Kiểm tra lỗi mạng
    if (!classMemberRes.ok || !submissionRes.ok) {
      throw new Error("Failed to fetch data from server");
    }

    // Parse JSON
    const joinedClasses = await classMemberRes.json();
    const mySubmissions = await submissionRes.json();

    // --- BẮT ĐẦU TÍNH TOÁN LOGIC (Client-side Calculation) ---

    // 1. Số lớp đã tham gia (Dựa trên mảng joinedClasses đã filter status=approved từ server)
    const joinedClassesCount = joinedClasses.length;

    // 2. Số bài thi đã làm (Dựa trên mảng submissions)
    // Lưu ý: Có thể server trả về cả bài đang làm dở (in_progress), ta chỉ đếm bài đã xong nếu muốn
    const completedSubmissions = mySubmissions.filter((s: any) => s.status === 'completed');
    const examsTakenCount = completedSubmissions.length;

    // 3. Tính điểm trung bình
    let totalScore = 0;
    let scoredExamCount = 0;

    completedSubmissions.forEach((sub: any) => {
      // Đảm bảo final_score là số hợp lệ
      const score = Number(sub.final_score);
      if (!isNaN(score)) {
        totalScore += score;
        scoredExamCount++;
      }
    });

    const averageScore = scoredExamCount > 0 ? totalScore / scoredExamCount : 0;

    // 4. Tính ngày đếm ngược (Logic tĩnh, không phụ thuộc DB)
    const examDate = new Date("2026-06-25T00:00:00");
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const daysUntilExam = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

    // Trả về kết quả đúng chuẩn StudentStats
    return {
      joinedClasses: joinedClassesCount,
      examsTaken: examsTakenCount,
      averageScore: averageScore,
      daysUntilExam: daysUntilExam,
    };

  } catch (error) {
    console.error("API Error fetching student stats:", error);
    // Trả về dữ liệu mặc định để không làm crash UI
    return {
      joinedClasses: 0,
      examsTaken: 0,
      averageScore: 0,
      daysUntilExam: 0,
    };
  }
};

/**
 * Hàm lấy dữ liệu cho trang Lịch sử làm bài
 * Bao gồm: Danh sách chi tiết & Thống kê tổng quan
 */
export const fetchStudentHistory = async (studentId: string): Promise<HistoryDataResponse> => {
  try {
    // 1. Gọi song song các API (Thêm fetch Contest)
    const [submissionsRes, examsRes, classesRes, contestExamsRes, contestsRes] = await Promise.all([
      fetch(`${BASE_URL}/examsubmissions?student_user_id=${studentId}&status=completed`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/exams`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/classes`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/contestexams`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/contests`, { cache: 'no-store' }) // <--- FETCH THÊM BẢNG CONTEST
    ]);

    // Safety Check
    if (!submissionsRes.ok || !examsRes.ok) throw new Error("Failed to fetch history data");

    const submissions = await submissionsRes.json();
    const exams = await examsRes.json();
    
    // Fallback mảng rỗng nếu lỗi
    const classes = classesRes.ok ? await classesRes.json() : [];
    const contestExams = contestExamsRes.ok ? await contestExamsRes.json() : [];
    const contests = contestsRes.ok ? await contestsRes.json() : [];

    // 2. Map dữ liệu
    const historyList: HistoryItem[] = submissions.map((sub: any) => {
      // a. Tìm Exam gốc (Dữ liệu mặc định)
      const exam = exams.find((e: any) => e.exam_id === sub.exam_id) || {}; // Lưu ý: check lại db.json xem key là id hay exam_id
      
      // b. Tìm Class (nếu có)
      const classInfo = sub.class_id ? classes.find((c: any) => c.id === sub.class_id) : null;
      
      // c. Check Contest (Tìm trong bảng trung gian ContestExam)
      const contestLink = contestExams.find((ce: any) => ce.exam_id === sub.exam_id);
      
      // --- LOGIC QUYẾT ĐỊNH TYPE VÀ DATA HIỂN THỊ ---
      let type: HistoryType = 'practice_global';
      
      // Các biến hiển thị mặc định lấy từ Exam
      let displayTitle = exam.title || "Bài thi không xác định";
      let displaySubject = exam.subject || "Tổng hợp";
      let displayDuration = exam.duration_min || exam.duration || 0;

      if (sub.class_id) {
        // Ưu tiên 1: Bài tập lớp
        type = 'practice_class';
        // Nếu muốn hiển thị tên lớp kèm theo tiêu đề:
        // displayTitle = `${exam.title} (${classInfo?.class_name})`;
      } 
      else if (contestLink) {
        // Ưu tiên 2: Contest
        type = 'contest';
        
        // Tìm thông tin cuộc thi từ bảng Contest
        const contestInfo = contests.find((ct: any) => ct.contest_id === contestLink.contest_id);
        
        if (contestInfo) {
          // [QUAN TRỌNG] Ghi đè thông tin hiển thị bằng thông tin Contest
          displayTitle = contestInfo.title; // Lấy tên cuộc thi (VD: Olympic Toán...)
          
          // Contest thường không có field 'subject' hay 'duration' cụ thể trong JSON bạn đưa,
          // nhưng nếu có thì lấy ở đây. Nếu không, giữ nguyên của Exam hoặc hardcode.
          // Ví dụ: displaySubject = "Cuộc thi"; 
        }
      }

      const dateObj = new Date(sub.submitted_at || sub.started_at);

      return {
        id: sub.submission_id || sub.id,
        title: displayTitle,       // Đã xử lý logic ở trên
        subject: displaySubject,   // Đã xử lý logic ở trên
        duration: displayDuration, // Đã xử lý logic ở trên
        score: sub.final_score || 0,
        maxScore: exam.total_score || 10,
        completedDate: dateObj.toLocaleDateString('vi-VN'),
        type: type,
        className: classInfo ? classInfo.class_name : undefined,
        rank: undefined 
      };
    });

    // 3. Tính toán Stats (Logic giữ nguyên)
    const totalExams = historyList.length;
    let sumScore = 0;
    let highestScore = 0;
    let totalTime = 0;
    let contestCount = 0;
    let practiceCount = 0;
    const subjectMap: Record<string, { total: number, count: number }> = {};

    historyList.forEach(item => {
      sumScore += item.score;
      totalTime += item.duration;
      if (item.score > highestScore) highestScore = item.score;

      if (item.type === 'contest') contestCount++;
      else practiceCount++;

      const subj = item.subject || "Khác";
      if (!subjectMap[subj]) subjectMap[subj] = { total: 0, count: 0 };
      subjectMap[subj].total += item.score;
      subjectMap[subj].count += 1;
    });

    const avgScore = totalExams > 0 ? Number((sumScore / totalExams).toFixed(1)) : 0;
    
    let bestSubject = "Chưa có";
    let maxAvgSubjectScore = -1;
    Object.entries(subjectMap).forEach(([subj, data]) => {
      const avg = data.total / data.count;
      if (avg > maxAvgSubjectScore) {
        maxAvgSubjectScore = avg;
        bestSubject = subj;
      }
    });

    return {
      list: historyList.reverse(),
      stats: {
        totalExams,
        avgScore,
        totalContests: contestCount,
        totalPractice: practiceCount,
        highestScore,
        bestSubject: totalExams > 0 ? bestSubject : "---",
        totalTime
      }
    };

  } catch (error) {
    console.error("Error fetching history:", error);
    return {
      list: [],
      stats: {
        totalExams: 0, avgScore: 0, totalContests: 0, totalPractice: 0,
        highestScore: 0, bestSubject: "---", totalTime: 0
      }
    };
  }
};
/**
 * Hàm lấy dữ liệu hoạt động 7 ngày gần nhất
 * Trả về mảng 7 phần tử: { date: "15/12", hours: 1.5, exams: 2, score: 8 }
 */
export const fetchStudentActivity = async (studentId: string): Promise<PerformanceDataPoint[]> => {
  try {
    // 1. Lấy danh sách bài đã nộp
    const submissionRes = await fetch(`${BASE_URL}/examsubmissions?student_user_id=${studentId}`, { cache: 'no-store' });
    const submissions = await submissionRes.json();
    
    // 2. Lấy thêm thông tin đề thi để biết thời gian làm bài (duration)
    // (Thực tế nên lấy duration từ submission nếu có lưu, ở đây giả sử lấy từ bảng exams)
    const examRes = await fetch(`${BASE_URL}/exams`, { cache: 'no-store' });
    const exams = await examRes.json();

    // 3. Chuẩn bị khung dữ liệu cho 7 ngày qua
    const last7Days: PerformanceDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // VD: 15/12
      
      // Tạo khung dữ liệu rỗng
      last7Days.push({
        date: dateStr,
        hours: 0,
        exams: 0,
        score: 0,
        // Lưu timestamp để so sánh ngày cho dễ
        _compareDate: d.toDateString() 
      } as any);
    }

    // 4. Duyệt qua các bài nộp để cộng dồn số liệu
    submissions.forEach((sub: any) => {
      if (!sub.submitted_at && !sub.started_at) return;
      
      const subDate = new Date(sub.submitted_at || sub.started_at).toDateString();
      
      // Tìm ngày tương ứng trong mảng last7Days
      const dayStat = last7Days.find((d: any) => d._compareDate === subDate);
      
      if (dayStat) {
        dayStat.exams += 1;
        
        // Cộng thời gian (giả sử duration của Exam là phút -> đổi ra giờ)
        const examInfo = exams.find((e: any) => e.id === sub.exam_id);
        if (examInfo) {
          dayStat.hours += (examInfo.duration || 0) / 60;
        }
        
        // Cộng điểm (nếu muốn tính trung bình)
        if (sub.final_score) {
          dayStat.score = sub.final_score; // Tạm lấy điểm bài cuối, hoặc tính TB tùy logic
        }
      }
    });

    // Làm tròn số giờ
    return last7Days.map(d => ({
      ...d,
      hours: Number(d.hours.toFixed(1))
    }));

  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
};