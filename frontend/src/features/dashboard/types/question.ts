export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AnswerType = 'numeric' | 'text' | 'regex';
export type GradingType = 'manual' | 'ai_assisted';

export interface Passage {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
}

export interface QuestionBase {
  id?: string;
  type: QuestionType;
  title?: string;
  tags: string[];
  difficulty: DifficultyLevel;
  points: number;
  timeLimit?: number;
  language: 'vi' | 'en';
  passageId?: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple_choice';
  stem: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  allowMultipleCorrect: boolean;
  explanation?: string;
  attachments?: string[];
}

export interface TrueFalseStatement {
  id: string;
  text: string;
  isTrue: boolean;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true_false';
  statements: TrueFalseStatement[];
}

export interface ShortAnswerQuestion extends QuestionBase {
  type: 'short_answer';
  stem: string;
  answerType: AnswerType;
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
  numericConfig?: {
    min: number;
    max: number;
    tolerance: number;
  };
  regexPattern?: string;
  autoGrading: boolean;
}

export interface GradingCriterion {
  id: string;
  criterion: string;
  description: string;
  points: number;
}

export interface LongAnswerQuestion extends QuestionBase {
  type: 'long_answer';
  prompt: string;
  wordLimit?: number;
  rubric?: GradingCriterion[];
  gradingType: GradingType;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion | LongAnswerQuestion;

export interface QuestionDraft {
  step: number;
  type?: QuestionType;
  passage?: 'none' | 'existing' | 'new';
  passageId?: string;
  newPassage?: Partial<Passage>;
  formData?: Partial<Question>;
  timestamp: number;
}
