// src/features/exam/types/exam-config.ts

export type ExamLayoutType = "standard" | "reading-passage";

export interface ExamLayoutConfig {
  type: ExamLayoutType;
  sidebar: {
    width: string;
    position: "left";
  };
  content: {
    columns: 1 | 2;
    split?: [number, number];
  };
  navigation: {
    type: "question" | "section";
    buttonText: string;
  };
}

export interface ExamSectionConfig {
  id: number;
  title: string;
  description: string;
  color: "teal" | "blue" | "purple" | "orange";
}

export interface ExamInstruction {
  text: string;
  highlight?: boolean;
}

export interface ExamSubjectConfig {
  subject: string;
  examType: string;
  sections: ExamSectionConfig[];
  instructions: ExamInstruction[];
  timeWarning: string;
  headerGradient: string;
}
