// src/features/exam/types/question.ts

export type QuestionType =
  | "multiple_choice"
  | "essay"
  | "short_answer"
  | "true_false";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  content: string;
  isCorrect?: boolean;
}

export interface Question {
  _id: string;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];

  // Flexible field: String cho trắc nghiệm, Record cho True/False
  correctAnswer?: string | Record<string, any>;
  explanation?: string; // Lời giải chi tiết

  difficulty: DifficultyLevel;
  subject: string;
  tags: string[]; // Từ khóa giúp cofig layout
  points: number;
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  // ID của bài đọc mà câu hỏi này thuộc về (Dùng cho môn Anh/Văn)
  linkedPassageId?: string;

  // Hình ảnh minh họa (Đồ thị, Hình học...)
  image?: {
    url: string;
    caption?: string;
    position?: "top" | "bottom";
  };

  // Bảng dữ liệu (Thống kê, Địa lý...)
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ExamQuestion {
  _id: string;
  examId: string;
  questionId: string;
  order: number;
  maxScore: number;
  section?: string;
  points?: number;
  question?: Question;
  createdAt: string;
}
