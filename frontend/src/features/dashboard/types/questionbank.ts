export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionTopic {
  id: string;
  name: string;
  questionCount: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface QuestionBankData {
  topics: QuestionTopic[];
}
