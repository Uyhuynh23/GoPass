// src/utils/exam.utils.ts
import {
  EXAM_SUBJECT_CONFIGS,
  STANDARD_LAYOUT,
  SPLIT_LAYOUT,
} from "@/features/exam/data/exam-constants";
import {
  ExamLayoutConfig,
  ExamSubjectConfig,
} from "@/features/exam/types/exam-config";

/**
 * Lấy cấu hình đề thi dựa trên tên môn học
 */
export function getExamConfigBySubject(
  subject: string
): ExamSubjectConfig | null {
  return EXAM_SUBJECT_CONFIGS[subject] || null;
}

/**
 * Xác định Layout (1 cột hay 2 cột) dựa trên môn học và section hiện tại
 */
export function getLayoutForQuestion(
  subject: string,
  section?: string
): ExamLayoutConfig {
  const subj = subject?.toLowerCase() || "";
  const sec = section?.toLowerCase() || "";

  // Logic nhận diện môn Ngữ Văn hoặc Tiếng Anh để dùng Split Layout
  if (
    subj.includes("ngữ văn") ||
    subj.includes("tiếng anh") ||
    subj.includes("english")
  ) {
    const splitKeywords = [
      "đọc hiểu",
      "reading",
      "read",
      "cloze",
      "fill",
      "điền từ",
    ];

    if (splitKeywords.some((keyword) => sec.includes(keyword))) {
      return SPLIT_LAYOUT;
    }
  }

  return STANDARD_LAYOUT;
}

/**
 * Format thời gian làm bài (Phút -> Chuỗi hiển thị)
 * VD: 90 -> "1 giờ 30 phút"
 */
export function formatExamDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) return `${hours} giờ ${mins} phút`;
  if (hours > 0) return `${hours} giờ`;
  return `${minutes} phút`;
}

/**
 * Lấy style hiển thị (màu sắc) cho Badge của Section
 */
export function getSectionBadgeStyle(sectionName: string) {
  // Mapping màu sắc dựa trên tên section (Logic gộp từ config cũ)
  const styles: Record<string, string> = {
    "Phần I": "bg-blue-500 border-blue-600",
    "Phần II": "bg-purple-500 border-purple-600",
    "Phần III": "bg-orange-500 border-orange-600",
    "Part I": "bg-blue-500 border-blue-600",
    "Part II": "bg-teal-500 border-teal-600",
    "Part III": "bg-orange-500 border-orange-600",
  };

  // Tìm style gần đúng hoặc trả về mặc định
  const key = Object.keys(styles).find((k) => sectionName.includes(k));
  const styleClass = key ? styles[key] : "bg-gray-500 border-gray-600";

  return {
    className: `${styleClass} text-white border`,
  };
}
