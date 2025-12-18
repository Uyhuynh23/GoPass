import { StudentStats, ClassSummary } from "@/features/dashboard/types/student/";

// URL của JSON Server (hoặc Backend thật sau này)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ID của học sinh đang đăng nhập (Hardcode để test, sau này lấy từ Auth Context)
const CURRENT_STUDENT_ID = "u_student_01";

/**
 * --- HELPER ---
 * Lấy thông tin chi tiết của một Lớp:
 * 1. Thông tin cơ bản (Tên, Mã...)
 * 2. Tên giáo viên (Join bảng User)
 * 3. Sĩ số lớp (Count bảng ClassMember)
 */
const fetchClassDetails = async (classId: string) => {
  try {
    // 1. Lấy thông tin lớp từ bảng classes
    const classRes = await fetch(`${BASE_URL}/classes/${classId}`, { cache: 'no-store' });
    if (!classRes.ok) return null;
    const classData = await classRes.json();

    // 2. Lấy tên giáo viên từ bảng users
    let teacherName = "Unknown Teacher";
    if (classData.teacher_user_id) {
      try {
        const teacherRes = await fetch(`${BASE_URL}/users/${classData.teacher_user_id}`, { cache: 'no-store' });
        if (teacherRes.ok) {
          const teacherData = await teacherRes.json();
          teacherName = teacherData.full_name;
        }
      } catch (e) {
        console.warn("Cannot fetch teacher info", e);
      }
    }

    // 3. [UPDATE] Đếm số học sinh thực tế
    // Logic: Gọi bảng classmembers, lọc theo class_id và status=approved
    let studentCount = 0;
    try {
      const countRes = await fetch(`${BASE_URL}/classmembers?class_id=${classId}&status=approved`, { cache: 'no-store' });
      if (countRes.ok) {
        const members = await countRes.json();
        studentCount = members.length; // Đếm số phần tử mảng trả về
      }
    } catch (e) {
      console.warn("Cannot count students", e);
    }

    // Trả về object đã gộp đủ thông tin
    return { 
      ...classData, 
      teacherName, 
      realStudentCount: studentCount 
    };
  } catch (error) {
    console.error(`Error fetching details for class ${classId}`, error);
    return null;
  }
};

/**
 * 1. GET: Lấy TẤT CẢ lớp học (Cả đang học lẫn đang chờ duyệt)
 * Logic: Gọi song song 2 bảng ClassMember (Active) và ClassJoinRequest (Pending)
 * Sau đó gộp lại thành 1 danh sách duy nhất.
 */
export const getMyClasses = async (): Promise<ClassSummary[]> => {
  try {
    // BƯỚC 1: Gọi song song 2 API để tiết kiệm thời gian
    const [activeRes, pendingRes] = await Promise.all([
      // Lấy danh sách lớp ĐÃ VÀO (Active)
      fetch(`${BASE_URL}/classmembers?student_user_id=${CURRENT_STUDENT_ID}&status=approved`, { cache: 'no-store' }),
      
      // Lấy danh sách lớp CHỜ DUYỆT (Pending)
      fetch(`${BASE_URL}/classjoinrequests?student_user_id=${CURRENT_STUDENT_ID}&status=pending`, { cache: 'no-store' })
    ]);

    // Parse JSON (nếu lỗi thì trả về mảng rỗng để không chết app)
    const activeRelations = activeRes.ok ? await activeRes.json() : [];
    const pendingRelations = pendingRes.ok ? await pendingRes.json() : [];

    // BƯỚC 2: Xử lý chi tiết từng danh sách (Map data)
    
    // 2a. Xử lý Active Classes
    const activePromises = activeRelations.map(async (item: any) => {
      const classDetail = await fetchClassDetails(item.class_id);
      if (!classDetail) return null;
      
      return {
        id: classDetail.id,
        name: classDetail.class_name,
        code: classDetail.class_code,
        students: classDetail.realStudentCount,
        teacher: classDetail.teacherName,
        status: 'active',           // Hardcode status
        requestDate: item.joined_date, // Active dùng joined_date
        requestId: item.id
      } as ClassSummary;
    });

    // 2b. Xử lý Pending Classes
    const pendingPromises = pendingRelations.map(async (item: any) => {
      const classDetail = await fetchClassDetails(item.class_id);
      if (!classDetail) return null;

      return {
        id: classDetail.id,
        name: classDetail.class_name,
        code: classDetail.class_code,
        students: classDetail.realStudentCount,
        teacher: classDetail.teacherName,
        status: 'pending',            // Hardcode status
        requestDate: item.requested_at, // Pending dùng requested_at
        requestId: item.id
      } as ClassSummary;
    });

    // BƯỚC 3: Chờ tất cả các hàm con chạy xong và GỘP lại
    // [...activePromises, ...pendingPromises] : Gộp 2 mảng promise lại làm 1
    const allResults = await Promise.all([...activePromises, ...pendingPromises]);

    // Lọc bỏ null và trả về danh sách tổng hợp
    return allResults.filter((c): c is ClassSummary => c !== null);

  } catch (error) {
    console.error("Failed to fetch my classes:", error);
    return [];
  }
};

/**
 * 2. POST: Gửi yêu cầu tham gia lớp học
 * Logic: Tìm Class theo Code -> Tạo dòng mới trong ClassJoinRequest
 */
// src/features/dashboard/data/student/myClassesApi.ts

// Định nghĩa kiểu kết quả trả về
type JoinClassResult = 
  | { success: true; data: ClassSummary }
  | { success: false; error: 'NOT_FOUND' | 'SERVER_ERROR' | 'EXISTED' };

/**
 * 2. POST: Gửi yêu cầu tham gia lớp học
 */
export const joinClass = async (code: string): Promise<JoinClassResult> => {
  try {
    // 1. Tìm lớp
    const searchUrl = `${BASE_URL}/classes?class_code=${code}`;
    const classSearchRes = await fetch(searchUrl, { cache: 'no-store' });
    
    if (!classSearchRes.ok) return { success: false, error: 'SERVER_ERROR' };
    
    const foundClasses = await classSearchRes.json();

    // 👉 TRƯỜNG HỢP 1: Không tìm thấy mã lớp
    if (foundClasses.length === 0) {
      return { success: false, error: 'NOT_FOUND' };
    }

    const targetClass = foundClasses[0];

    // (Optional) Kiểm tra xem đã tham gia chưa (Nếu cần logic này thì thêm query check ClassMember)
    // Tạm thời bỏ qua để tập trung vào yêu cầu của bạn

    // 2. Tạo request
    const payload = {
      class_id: targetClass.id,
      student_user_id: CURRENT_STUDENT_ID,
      status: "pending",
      requested_at: new Date().toISOString(),
      processed_at: null
    };

    const createRes = await fetch(`${BASE_URL}/classjoinrequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // 👉 TRƯỜNG HỢP 2: Lỗi Server (DB lỗi, Mạng lỗi...)
    if (!createRes.ok) {
      return { success: false, error: 'SERVER_ERROR' };
    }
    
    const createdRequest = await createRes.json();

    // 3. Lấy chi tiết để trả về UI
    const classDetail = await fetchClassDetails(targetClass.id);
    
    if (!classDetail) return { success: false, error: 'SERVER_ERROR' };

    return {
      success: true,
      data: {
        id: classDetail.id,
        name: classDetail.class_name,
        code: classDetail.class_code,
        students: classDetail.realStudentCount,
        status: 'pending',
        teacher: classDetail.teacherName,
        requestDate: createdRequest.requested_at,
        requestId: createdRequest.id
      }
    };

  } catch (error) {
    console.error("Join Class Error:", error);
    // 👉 TRƯỜNG HỢP 2: Lỗi Exception (Mất mạng, code lỗi...)
    return { success: false, error: 'SERVER_ERROR' };
  }
};

/**
 * 3. DELETE: Hủy yêu cầu tham gia lớp
 * Logic: Xóa dòng trong bảng ClassJoinRequest dựa vào requestId
 */
export const cancelClassRequest = async (requestId: string): Promise<boolean> => {
  try {
    // Lưu ý: Endpoint là classjoinrequests, và dùng requestId (ví dụ: req_01)
    const response = await fetch(`${BASE_URL}/classjoinrequests/${requestId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to cancel class request:", error);
    return false;
  }
};