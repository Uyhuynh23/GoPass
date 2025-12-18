// src/features/exam/data/exam-constants.ts
import { ExamSubjectConfig, ExamLayoutConfig } from "../types/exam-config";

// --- LAYOUT CONFIGURATIONS ---
export const STANDARD_LAYOUT: ExamLayoutConfig = {
  type: "standard",
  sidebar: { width: "240px", position: "left" },
  content: { columns: 1 },
  navigation: { type: "question", buttonText: "Câu tiếp theo" },
};

export const SPLIT_LAYOUT: ExamLayoutConfig = {
  type: "reading-passage",
  sidebar: { width: "240px", position: "left" },
  content: { columns: 2, split: [45, 55] },
  navigation: { type: "question", buttonText: "Câu tiếp theo" },
};

// --- SUBJECT CONFIGURATIONS ---
export const EXAM_SUBJECT_CONFIGS: Record<string, ExamSubjectConfig> = {
  "Toán Học": {
    subject: "Toán Học",
    examType: "Kỳ thi Tốt nghiệp THPT 2025",
    sections: [
      {
        id: 1,
        title: "Phần I: Trắc nghiệm",
        description: "12 câu hỏi (3 điểm)",
        color: "blue",
      },
      {
        id: 2,
        title: "Phần II: Đúng/Sai",
        description: "4 câu hỏi (4 điểm)",
        color: "purple",
      },
      {
        id: 3,
        title: "Phần III: Trả lời ngắn",
        description: "6 câu hỏi (3 điểm)",
        color: "orange",
      },
    ],
    instructions: [
      { text: "Không được sử dụng tài liệu." },
      { text: "Thời gian vẫn đếm ngược khi rời trang." },
      { text: "Dùng cờ để đánh dấu câu hỏi." },
      { text: "Không thể sửa bài sau khi nộp.", highlight: true },
    ],
    timeWarning: 'Thời gian đếm ngược khi bấm "Bắt đầu"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },
  "Ngữ Văn": {
    subject: "Ngữ Văn",
    examType: "Kỳ thi Tốt nghiệp THPT 2025",
    sections: [
      {
        id: 1,
        title: "Phần I: Đọc hiểu",
        description: "5 câu hỏi (4 điểm)",
        color: "teal",
      },
      {
        id: 2,
        title: "Câu 2: NLXH",
        description: "200 chữ (2 điểm)",
        color: "teal",
      },
      {
        id: 3,
        title: "Câu 3: NLVH",
        description: "600 chữ (4 điểm)",
        color: "teal",
      },
    ],
    instructions: [
      { text: "Không sử dụng tài liệu." },
      { text: "Không thể sửa bài sau khi nộp.", highlight: true },
    ],
    timeWarning: 'Thời gian đếm ngược khi bấm "Bắt đầu"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },
  "Tiếng Anh": {
    subject: "English",
    examType: "THPT National Exam 2025",
    sections: [
      {
        id: 1,
        title: "Part I: Independent",
        description: "10 questions",
        color: "blue",
      },
      {
        id: 2,
        title: "Part II: Reading",
        description: "16 questions",
        color: "teal",
      },
      {
        id: 3,
        title: "Part III: Cloze Test",
        description: "5 questions",
        color: "orange",
      },
    ],
    instructions: [
      { text: "No materials allowed." },
      { text: "Cannot edit answers after submission.", highlight: true },
    ],
    timeWarning: 'Timer starts upon clicking "Start"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },
};
