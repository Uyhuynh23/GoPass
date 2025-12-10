import { QuestionBankData, QuestionTopic } from '../types/questionbank';

export const mockQuestionTopics: QuestionTopic[] = [
  {
    id: '1',
    name: 'Hàm số',
    questionCount: 450,
    difficulty: {
      easy: 180,
      medium: 200,
      hard: 70,
    },
  },
  {
    id: '2',
    name: 'Đạo hàm',
    questionCount: 380,
    difficulty: {
      easy: 150,
      medium: 170,
      hard: 60,
    },
  },
  {
    id: '3',
    name: 'Tích phân',
    questionCount: 320,
    difficulty: {
      easy: 120,
      medium: 140,
      hard: 60,
    },
  },
  {
    id: '4',
    name: 'Phương trình',
    questionCount: 290,
    difficulty: {
      easy: 110,
      medium: 130,
      hard: 50,
    },
  },
  {
    id: '5',
    name: 'Bất phương trình',
    questionCount: 270,
    difficulty: {
      easy: 100,
      medium: 120,
      hard: 50,
    },
  },
  {
    id: '6',
    name: 'Hình học không gian',
    questionCount: 350,
    difficulty: {
      easy: 140,
      medium: 150,
      hard: 60,
    },
  },
  {
    id: '7',
    name: 'Lượng giác',
    questionCount: 240,
    difficulty: {
      easy: 95,
      medium: 100,
      hard: 45,
    },
  },
  {
    id: '8',
    name: 'Xác suất',
    questionCount: 190,
    difficulty: {
      easy: 85,
      medium: 10,
      hard: 55,
    },
  },
];

export const mockQuestionBankData: QuestionBankData = {
  topics: mockQuestionTopics,
};
