// src/features/dashboard/data/mock-my-classes.ts
import { ClassSummary } from "../../types/student";

export const MOCK_MY_CLASSES: ClassSummary[] = [
  // --- ACTIVE CLASSES (15 Classes) ---
  { 
    id: "C01", 
    name: "Lớp 12A1 - Trường THPT Nguyễn Huệ", 
    code: "CLASS001", 
    students: 45,
    status: 'active'
  },
  { 
    id: "C02", 
    name: "Khóa Luyện Thi Đại Học 2025 - Toán", 
    code: "MATH_PRO_25", 
    students: 120,
    status: 'active'
  },
  { 
    id: "C03", 
    name: "Lớp Chuyên Anh - Cô Lan (Tối T3-T5)", 
    code: "ENG_ADV_03", 
    students: 35,
    status: 'active'
  },
  { 
    id: "C04", 
    name: "Hóa Học 12 - Ôn Thi Tốt Nghiệp", 
    code: "CHEM_TN_12", 
    students: 80,
    status: 'active'
  },
  { 
    id: "C05", 
    name: "Vật Lý Hạt Nhân - Cơ Bản", 
    code: "PHY_101", 
    students: 50,
    status: 'active'
  },
  { 
    id: "C06", 
    name: "Sinh Học - Luyện Đề Chuyên Sâu", 
    code: "BIO_MASTER", 
    students: 65,
    status: 'active'
  },
  { 
    id: "C07", 
    name: "Lịch Sử Việt Nam - Giai đoạn 1945-1975", 
    code: "HIS_VN_WAR", 
    students: 40,
    status: 'active'
  },
  { 
    id: "C08", 
    name: "Địa Lý Tự Nhiên - Thầy Hùng", 
    code: "GEO_NAT_12", 
    students: 55,
    status: 'active'
  },
  { 
    id: "C09", 
    name: "GDCD - Kiến thức Pháp luật & Đời sống", 
    code: "CIVICS_12", 
    students: 90,
    status: 'active'
  },
  { 
    id: "C10", 
    name: "Tin Học 11 - Lập trình C++ Cơ bản", 
    code: "CS_CPP_11", 
    students: 30,
    status: 'active'
  },
  { 
    id: "C11", 
    name: "Toán Hình Học Không Gian - Thầy Ba", 
    code: "GEO_SPACE_MA", 
    students: 150,
    status: 'active'
  },
  { 
    id: "C12", 
    name: "Ngữ Văn - Phân tích tác phẩm thơ", 
    code: "LIT_POEM_AN", 
    students: 70,
    status: 'active'
  },
  { 
    id: "C13", 
    name: "IELTS Speaking & Writing - Band 7.0+", 
    code: "IELTS_SW_7", 
    students: 20,
    status: 'active'
  },
  { 
    id: "C14", 
    name: "Vật Lý - Điện Xoay Chiều", 
    code: "PHY_AC_CIRC", 
    students: 45,
    status: 'active'
  },
  { 
    id: "C15", 
    name: "Hóa Hữu Cơ Nâng Cao - Dành cho HSG", 
    code: "CHEM_ORG_ADV", 
    students: 15,
    status: 'active'
  },

  // --- PENDING CLASSES (5 Classes) ---
  {
    id: "P01",
    name: "Lớp Vật Lý Nâng Cao - Thầy Dũng",
    code: "PHY_ADV_09",
    students: 0,
    status: 'pending',
    teacher: "Thầy Lê Văn Dũng",
    requestDate: "2025-12-11"
  },
  {
    id: "P02",
    name: "Nhóm Học Ngữ Văn - Cô Hạnh",
    code: "LIT_GROUP_2",
    students: 0,
    status: 'pending',
    teacher: "Cô Nguyễn Thị Hạnh",
    requestDate: "2025-12-10"
  },
  {
    id: "P03",
    name: "Lớp Giải Tích 12 - Chiều T7",
    code: "CALCULUS_12",
    students: 0,
    status: 'pending',
    teacher: "Thầy Trần Minh",
    requestDate: "2025-12-09"
  },
  {
    id: "P04",
    name: "CLB Robotics & IoT",
    code: "ROBOTICS_CLUB",
    students: 0,
    status: 'pending',
    teacher: "Thầy Hoàng Công Nghệ",
    requestDate: "2025-12-08"
  },
  {
    id: "P05",
    name: "Lớp Bồi dưỡng HSG Quốc Gia - Toán",
    code: "MATH_OLYMPIAD",
    students: 0,
    status: 'pending',
    teacher: "GS. Ngô Bảo Châu (Guest)",
    requestDate: "2025-12-05"
  }
];