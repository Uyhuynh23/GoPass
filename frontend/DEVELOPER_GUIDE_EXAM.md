# GoPass Exam System - Developer Guide

## 📋 Tổng quan

Hệ thống thi (Exam System) của GoPass bao gồm nhiều màn hình và chức năng phức tạp:

- **Exam Taking Interface**: Giao diện làm bài thi với timer, navigation câu hỏi
- **Question Types**: Hỗ trợ nhiều loại câu hỏi (Multiple Choice, Essay, Short Answer, True/False)
- **Review & Results**: Xem lại kết quả và đáp án chi tiết
- **Exam Management**: Quản lý đề thi cho giáo viên/admin

### 🎯 Các màn hình chính cần phát triển:

1. **Exam List/Selection** - Danh sách đề thi có sẵn
2. **Exam Instructions** - Màn hình hướng dẫn trước khi bắt đầu
3. **Exam Taking Interface** - Màn hình làm bài thi chính
4. **Exam Review** - Xem lại bài làm và đáp án
5. **Exam Results** - Kết quả chi tiết sau khi nộp bài
6. **Exam Creation** - Tạo/chỉnh sửa đề thi (Teacher/Admin)

---

## 🏗️ Kiến trúc File Structure

### Recommended Structure:

```
src/
├── app/(protected)/
│   └── exam/
│       ├── layout.tsx                    # Layout cho exam pages
│       ├── [examId]/
│       │   ├── page.tsx                  # Exam detail/instructions
│       │   ├── take/
│       │   │   └── page.tsx              # Taking exam interface
│       │   ├── review/
│       │   │   └── page.tsx              # Review exam after submission
│       │   └── results/
│       │       └── page.tsx              # Results page
│       └── create/
│           └── page.tsx                  # Create new exam
│
├── features/
│   └── exam/
│       ├── context/
│       │   ├── ExamContext.tsx           # ⭐ Context quản lý exam state
│       │   └── ExamTimerContext.tsx      # Context cho timer
│       │
│       ├── types/
│       │   ├── index.ts                  # Export all types
│       │   ├── exam.ts                   # Exam types
│       │   ├── question.ts               # Question types
│       │   ├── submission.ts             # Submission types
│       │   └── answer.ts                 # Answer types
│       │
│       ├── data/
│       │   ├── mock-exam.ts              # Mock exam data
│       │   ├── mock-questions.ts         # Mock questions
│       │   └── mock-submissions.ts       # Mock submissions
│       │
│       ├── components/
│       │   ├── exam-header/
│       │   │   ├── ExamHeader.tsx        # Header với timer
│       │   │   ├── ExamTimer.tsx         # Timer component
│       │   │   └── ExamProgress.tsx      # Progress indicator
│       │   │
│       │   ├── question-display/
│       │   │   ├── QuestionCard.tsx      # Card hiển thị câu hỏi
│       │   │   ├── MultipleChoiceQuestion.tsx
│       │   │   ├── EssayQuestion.tsx
│       │   │   ├── ShortAnswerQuestion.tsx
│       │   │   ├── TrueFalseQuestion.tsx
│       │   │   └── QuestionNavigation.tsx # Navigation grid
│       │   │
│       │   ├── answer-input/
│       │   │   ├── MultipleChoiceInput.tsx
│       │   │   ├── EssayInput.tsx
│       │   │   ├── ShortAnswerInput.tsx
│       │   │   └── TrueFalseInput.tsx
│       │   │
│       │   ├── exam-review/
│       │   │   ├── ReviewSummary.tsx     # Tổng quan kết quả
│       │   │   ├── ReviewQuestionCard.tsx # Câu hỏi + đáp án đúng
│       │   │   ├── AnswerComparison.tsx  # So sánh đáp án
│       │   │   └── ScoreBreakdown.tsx    # Phân tích điểm
│       │   │
│       │   ├── exam-instructions/
│       │   │   ├── InstructionsCard.tsx
│       │   │   ├── ExamInfoCard.tsx
│       │   │   └── StartExamButton.tsx
│       │   │
│       │   └── exam-creation/
│       │       ├── ExamForm.tsx
│       │       ├── QuestionBuilder.tsx
│       │       ├── QuestionList.tsx
│       │       └── ExamPreview.tsx
│       │
│       ├── hooks/
│       │   ├── useExamTimer.ts           # Hook quản lý timer
│       │   ├── useExamSubmission.ts      # Hook submit bài
│       │   ├── useAutoSave.ts            # Auto-save answers
│       │   └── useExamNavigation.ts      # Navigate giữa câu hỏi
│       │
│       └── services/
│           ├── exam.service.ts           # API calls cho exam
│           ├── submission.service.ts     # API calls cho submission
│           └── grading.service.ts        # API calls cho grading
│
└── components/
    └── ui/
        ├── Timer.tsx                     # Timer UI component
        ├── ProgressBar.tsx               # Progress bar
        ├── ConfirmDialog.tsx             # Confirm submission dialog
        └── QuestionNumberBadge.tsx       # Badge cho số câu hỏi
```

---

## 📊 Data Models & Types

### 1. Exam Types

```typescript
// src/features/exam/types/exam.ts
export type ExamMode = "practice" | "test" | "contest";
export type ExamStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

export interface Exam {
  _id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  mode: ExamMode;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdBy: string;
  isPublished: boolean;
  totalQuestions?: number;
  totalPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAssignment {
  _id: string;
  examId: string;
  classId: string;
  startTime: string;
  endTime: string;
  shuffleQuestions: boolean;
  allowLateSubmission: boolean;
  maxAttempts: number;
  exam?: Exam;
  createdAt: string;
}

export interface ExamWithDetails extends Exam {
  questions: ExamQuestion[];
  assignment?: ExamAssignment;
  userSubmission?: ExamSubmission;
}
```

### 2. Question Types

```typescript
// src/features/exam/types/question.ts
export type QuestionType =
  | "multiple_choice"
  | "essay"
  | "short_answer"
  | "true_false";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  text: string;
  isCorrect?: boolean; // Only visible to teachers/admin
}

export interface Question {
  _id: string;
  type: QuestionType;
  content: string;
  options: QuestionOption[];
  correctAnswer?: string;
  difficulty: DifficultyLevel;
  subject: string;
  tags: string[];
  points: number;
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  _id: string;
  examId: string;
  questionId: string;
  order: number;
  maxScore: number;
  question?: Question;
  createdAt: string;
}
```

### 3. Submission Types

```typescript
// src/features/exam/types/submission.ts
export type SubmissionStatus = "in_progress" | "submitted" | "graded" | "late";

export interface ExamSubmission {
  _id: string;
  assignmentId: string;
  examId: string;
  studentId: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore: number;
  maxScore: number;
  attemptNumber: number;
  answers: ExamAnswer[];
  exam?: Exam;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAnswer {
  _id: string;
  submissionId: string;
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  score: number;
  maxScore: number;
  feedback?: string;
  isAutoGraded: boolean;
  isManuallyGraded: boolean;
  question?: Question;
  createdAt: string;
  updatedAt: string;
}
```

### 4. UI State Types

```typescript
// src/features/exam/types/index.ts
export interface ExamState {
  currentQuestionIndex: number;
  answers: Map<string, AnswerData>; // questionId -> answer
  flaggedQuestions: Set<string>;
  timeRemaining: number; // seconds
  isSubmitting: boolean;
  autoSaveStatus: "idle" | "saving" | "saved" | "error";
}

export interface AnswerData {
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  isAnswered: boolean;
  lastModified: Date;
}

export interface QuestionNavigationItem {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isCurrentQuestion: boolean;
}
```

---

## 🎨 UI Components Design

### 1. Exam Taking Interface Layout

```
┌────────────────────────────────────────────────────────────────┐
│ EXAM HEADER                                                    │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ [Exam Title]                        ⏱️ 45:32  [Submit]  │  │
│ │ Question 5/20                                             │  │
│ └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ MAIN CONTENT AREA                                              │
│ ┌──────────────────────────┐  ┌────────────────────────────┐ │
│ │ QUESTION DISPLAY         │  │ QUESTION NAVIGATION        │ │
│ │                          │  │ ┌──┬──┬──┬──┬──┐          │ │
│ │ [Question Content]       │  │ │ 1│ 2│ 3│ 4│ 5│          │ │
│ │                          │  │ └──┴──┴──┴──┴──┘          │ │
│ │ [Answer Options]         │  │ ┌──┬──┬──┬──┬──┐          │ │
│ │ ○ Option A               │  │ │ 6│ 7│ 8│ 9│10│          │ │
│ │ ○ Option B               │  │ └──┴──┴──┴──┴──┘          │ │
│ │ ○ Option C               │  │ ...                        │ │
│ │ ○ Option D               │  │                            │ │
│ │                          │  │ Legend:                    │ │
│ │ [Flag Question]          │  │ ✅ Answered                │ │
│ │                          │  │ ⬜ Not Answered            │ │
│ │ [< Previous] [Next >]    │  │ 🚩 Flagged                │ │
│ └──────────────────────────┘  └────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2. Color Scheme & Design Tokens

```typescript
// Exam-specific colors
export const examColors = {
  // Timer colors
  timerNormal: "text-teal-600 bg-teal-50", // > 30 minutes
  timerWarning: "text-orange-600 bg-orange-50", // 10-30 minutes
  timerDanger: "text-red-600 bg-red-50", // < 10 minutes

  // Question status
  answered: "bg-teal-500 text-white", // Đã trả lời
  notAnswered: "bg-gray-200 text-gray-700", // Chưa trả lời
  current: "bg-blue-500 text-white", // Câu hiện tại
  flagged: "bg-yellow-400 text-gray-900", // Đánh dấu

  // Answer status (in review)
  correct: "bg-green-100 border-green-500", // Đúng
  incorrect: "bg-red-100 border-red-500", // Sai
  partial: "bg-yellow-100 border-yellow-500", // Một phần
  notGraded: "bg-gray-100 border-gray-300", // Chưa chấm

  // Score ranges
  excellent: "text-green-600 bg-green-50", // >= 90%
  good: "text-blue-600 bg-blue-50", // 70-89%
  average: "text-yellow-600 bg-yellow-50", // 50-69%
  poor: "text-red-600 bg-red-50", // < 50%
};
```

### 3. Exam Header Component

```typescript
// src/features/exam/components/exam-header/ExamHeader.tsx
interface ExamHeaderProps {
  examTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number; // seconds
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onSubmit,
  isSubmitting,
}) => {
  // Calculate timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 1800) return "text-teal-600 bg-teal-50";
    if (timeRemaining > 600) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{examTitle}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <ExamTimer timeRemaining={timeRemaining} />

          {/* Submit Button */}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        current={currentQuestion}
        total={totalQuestions}
        className="mt-3"
      />
    </div>
  );
};
```

### 4. Question Navigation Grid

```typescript
// src/features/exam/components/question-display/QuestionNavigation.tsx
interface QuestionNavigationProps {
  questions: QuestionNavigationItem[];
  onQuestionSelect: (questionId: string) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  onQuestionSelect,
}) => {
  const getQuestionStyle = (item: QuestionNavigationItem) => {
    if (item.isCurrentQuestion) {
      return "bg-blue-500 text-white border-blue-600";
    }
    if (item.isFlagged) {
      return "bg-yellow-400 text-gray-900 border-yellow-500";
    }
    if (item.isAnswered) {
      return "bg-teal-500 text-white border-teal-600";
    }
    return "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-28">
      <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((item) => (
          <button
            key={item.questionId}
            onClick={() => onQuestionSelect(item.questionId)}
            className={`
              w-12 h-12 rounded-lg border-2 font-semibold
              transition-all duration-200
              ${getQuestionStyle(item)}
            `}
          >
            {item.order}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded border-2 border-teal-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded border-2 border-gray-300" />
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded border-2 border-blue-600" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded border-2 border-yellow-500" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
};
```

### 5. Question Card Component (Reusable)

```typescript
// src/features/exam/components/question-display/QuestionCard.tsx
interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer?: AnswerData;
  onAnswerChange: (answer: AnswerData) => void;
  onFlagToggle?: () => void;
  isFlagged: boolean;
  isReviewMode?: boolean;
  showCorrectAnswer?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onFlagToggle,
  isFlagged,
  isReviewMode = false,
  showCorrectAnswer = false,
}) => {
  // Render different question types
  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceInput
            question={question}
            selectedOptions={answer?.selectedOptions || []}
            onChange={(selected) =>
              onAnswerChange({
                ...answer!,
                selectedOptions: selected,
                isAnswered: selected.length > 0,
              })
            }
            isReviewMode={isReviewMode}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "essay":
        return (
          <EssayInput
            value={answer?.answerText || ""}
            onChange={(text) =>
              onAnswerChange({
                ...answer!,
                answerText: text,
                isAnswered: text.trim().length > 0,
              })
            }
            disabled={isReviewMode}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerInput
            value={answer?.answerText || ""}
            onChange={(text) =>
              onAnswerChange({
                ...answer!,
                answerText: text,
                isAnswered: text.trim().length > 0,
              })
            }
            disabled={isReviewMode}
            correctAnswer={
              showCorrectAnswer ? question.correctAnswer : undefined
            }
          />
        );

      case "true_false":
        return (
          <TrueFalseInput
            selectedOption={answer?.selectedOptions[0]}
            onChange={(option) =>
              onAnswerChange({
                ...answer!,
                selectedOptions: [option],
                isAnswered: true,
              })
            }
            disabled={isReviewMode}
            correctAnswer={
              showCorrectAnswer
                ? question.options.find((o) => o.isCorrect)?.text
                : undefined
            }
          />
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-gray-500">
              Question {questionNumber}
            </span>
            <Badge variant={question.difficulty}>{question.difficulty}</Badge>
            <span className="text-sm text-gray-500">
              {question.points} {question.points === 1 ? "point" : "points"}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {question.content}
          </h3>
        </div>

        {/* Flag Button */}
        {onFlagToggle && !isReviewMode && (
          <button
            onClick={onFlagToggle}
            className={`p-2 rounded-lg transition-colors ${
              isFlagged
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            🚩
          </button>
        )}
      </div>

      {/* Question Input */}
      <div className="mt-6">{renderQuestionInput()}</div>
    </div>
  );
};
```

### 6. Multiple Choice Input

```typescript
// src/features/exam/components/answer-input/MultipleChoiceInput.tsx
interface MultipleChoiceInputProps {
  question: Question;
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  isReviewMode?: boolean;
  showCorrectAnswer?: boolean;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  selectedOptions,
  onChange,
  isReviewMode = false,
  showCorrectAnswer = false,
}) => {
  const handleOptionClick = (optionText: string) => {
    if (isReviewMode) return;

    // Single select for now (can be multi-select if needed)
    onChange([optionText]);
  };

  const getOptionStyle = (option: QuestionOption) => {
    if (!showCorrectAnswer) {
      const isSelected = selectedOptions.includes(option.text);
      return isSelected
        ? "border-teal-500 bg-teal-50"
        : "border-gray-300 bg-white hover:border-gray-400";
    }

    // Review mode with correct answer
    const isSelected = selectedOptions.includes(option.text);
    const isCorrect = option.isCorrect;

    if (isCorrect && isSelected) {
      return "border-green-500 bg-green-50"; // Correct and selected
    }
    if (isCorrect && !isSelected) {
      return "border-green-500 bg-green-50 opacity-75"; // Correct but not selected
    }
    if (!isCorrect && isSelected) {
      return "border-red-500 bg-red-50"; // Wrong and selected
    }
    return "border-gray-300 bg-white";
  };

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option.text)}
          disabled={isReviewMode}
          className={`
            w-full p-4 text-left rounded-lg border-2 transition-all
            ${getOptionStyle(option)}
            ${isReviewMode ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <div className="flex items-start gap-3">
            <div
              className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
              ${
                selectedOptions.includes(option.text)
                  ? "bg-teal-500 border-teal-500"
                  : "border-gray-400"
              }
            `}
            >
              {selectedOptions.includes(option.text) && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="flex-1 text-gray-900">{option.text}</span>
            {showCorrectAnswer && option.isCorrect && (
              <span className="text-green-600 font-semibold">✓ Correct</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
```

### 7. Essay Input

```typescript
// src/features/exam/components/answer-input/EssayInput.tsx
interface EssayInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minWords?: number;
  maxWords?: number;
}

const EssayInput: React.FC<EssayInputProps> = ({
  value,
  onChange,
  disabled = false,
  minWords = 50,
  maxWords = 500,
}) => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = value.length;

  const getWordCountColor = () => {
    if (wordCount < minWords) return "text-orange-600";
    if (wordCount > maxWords) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here..."
        className={`
          w-full min-h-[300px] p-4 border-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
        `}
      />

      {/* Word/Character Count */}
      <div className="flex justify-between text-sm">
        <span className={`font-medium ${getWordCountColor()}`}>
          {wordCount} words {minWords && `(min: ${minWords})`}
        </span>
        <span className="text-gray-500">{characterCount} characters</span>
      </div>

      {wordCount > maxWords && (
        <p className="text-red-600 text-sm">
          ⚠️ You have exceeded the maximum word limit of {maxWords} words
        </p>
      )}
    </div>
  );
};
```

---

## 🔧 Context & State Management

### Exam Context

```typescript
// src/features/exam/context/ExamContext.tsx
interface ExamContextType {
  // Exam data
  exam: ExamWithDetails | null;
  submission: ExamSubmission | null;

  // UI state
  examState: ExamState;
  setExamState: (state: Partial<ExamState>) => void;

  // Navigation
  currentQuestion: ExamQuestion | null;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;

  // Answers
  updateAnswer: (questionId: string, answer: AnswerData) => void;
  getAnswer: (questionId: string) => AnswerData | undefined;
  toggleFlag: (questionId: string) => void;

  // Submission
  submitExam: () => Promise<void>;
  autoSave: () => Promise<void>;

  // Timer
  timeRemaining: number;
  isTimeUp: boolean;
}

export const ExamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [exam, setExam] = useState<ExamWithDetails | null>(null);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: 0,
    isSubmitting: false,
    autoSaveStatus: "idle",
  });

  // Initialize exam
  useEffect(() => {
    // TODO: Load exam data from API
    // TODO: Check for existing submission
    // TODO: Initialize timer
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      autoSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [examState.answers]);

  const updateAnswer = (questionId: string, answer: AnswerData) => {
    setExamState((prev) => ({
      ...prev,
      answers: new Map(prev.answers).set(questionId, {
        ...answer,
        lastModified: new Date(),
      }),
    }));
  };

  const submitExam = async () => {
    setExamState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // TODO: Call API to submit exam
      // Convert Map to array of answers
      const answersArray = Array.from(examState.answers.values());

      // await submissionService.submitExam(submission!._id, answersArray);

      // Navigate to results page
      // router.push(`/exam/${exam!._id}/results`);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setExamState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const autoSave = async () => {
    if (examState.answers.size === 0) return;

    setExamState((prev) => ({ ...prev, autoSaveStatus: "saving" }));

    try {
      // TODO: Call API to save answers
      // await submissionService.saveAnswers(submission!._id, Array.from(examState.answers.values()));

      setExamState((prev) => ({ ...prev, autoSaveStatus: "saved" }));

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setExamState((prev) => ({ ...prev, autoSaveStatus: "idle" }));
      }, 2000);
    } catch (error) {
      setExamState((prev) => ({ ...prev, autoSaveStatus: "error" }));
    }
  };

  // ... other methods

  return (
    <ExamContext.Provider
      value={
        {
          /* ... */
        }
      }
    >
      {children}
    </ExamContext.Provider>
  );
};
```

---

## 📱 Page Implementations

### 1. Exam Taking Page

```typescript
// src/app/(protected)/exam/[examId]/take/page.tsx
"use client";

import { useExam } from "@/features/exam/context/ExamContext";
import ExamHeader from "@/features/exam/components/exam-header/ExamHeader";
import QuestionCard from "@/features/exam/components/question-display/QuestionCard";
import QuestionNavigation from "@/features/exam/components/question-display/QuestionNavigation";

export default function TakeExamPage() {
  const {
    exam,
    currentQuestion,
    examState,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    updateAnswer,
    toggleFlag,
    submitExam,
    timeRemaining,
  } = useExam();

  if (!exam || !currentQuestion) {
    return <LoadingScreen />;
  }

  const navigationItems: QuestionNavigationItem[] = exam.questions.map(
    (q, idx) => ({
      questionId: q.questionId,
      order: idx + 1,
      isAnswered:
        examState.answers.has(q.questionId) &&
        examState.answers.get(q.questionId)!.isAnswered,
      isFlagged: examState.flaggedQuestions.has(q.questionId),
      isCurrentQuestion: idx === examState.currentQuestionIndex,
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ExamHeader
        examTitle={exam.title}
        currentQuestion={examState.currentQuestionIndex + 1}
        totalQuestions={exam.questions.length}
        timeRemaining={timeRemaining}
        onSubmit={submitExam}
        isSubmitting={examState.isSubmitting}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Display - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <QuestionCard
              question={currentQuestion.question!}
              questionNumber={examState.currentQuestionIndex + 1}
              answer={examState.answers.get(currentQuestion.questionId)}
              onAnswerChange={(answer) =>
                updateAnswer(currentQuestion.questionId, answer)
              }
              onFlagToggle={() => toggleFlag(currentQuestion.questionId)}
              isFlagged={examState.flaggedQuestions.has(
                currentQuestion.questionId
              )}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={goToPreviousQuestion}
                disabled={examState.currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              <Button
                variant="secondary"
                onClick={goToNextQuestion}
                disabled={
                  examState.currentQuestionIndex === exam.questions.length - 1
                }
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Question Navigation - 1/3 width */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={navigationItems}
              onQuestionSelect={(qId) => {
                const index = exam.questions.findIndex(
                  (q) => q.questionId === qId
                );
                goToQuestion(index);
              }}
            />
          </div>
        </div>
      </div>

      {/* Auto-save Indicator */}
      {examState.autoSaveStatus === "saving" && (
        <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm text-gray-600">💾 Saving...</span>
        </div>
      )}
      {examState.autoSaveStatus === "saved" && (
        <div className="fixed bottom-4 right-4 bg-green-50 px-4 py-2 rounded-lg shadow-lg border border-green-200">
          <span className="text-sm text-green-600">✓ Saved</span>
        </div>
      )}
    </div>
  );
}
```

### 2. Exam Review Page

```typescript
// src/app/(protected)/exam/[examId]/review/page.tsx
"use client";

import { useEffect, useState } from "react";
import ReviewSummary from "@/features/exam/components/exam-review/ReviewSummary";
import ReviewQuestionCard from "@/features/exam/components/exam-review/ReviewQuestionCard";

export default function ReviewExamPage({
  params,
}: {
  params: { examId: string };
}) {
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);

  useEffect(() => {
    // TODO: Load submission with answers
    // const data = await submissionService.getSubmission(submissionId);
    // setSubmission(data);
  }, []);

  if (!submission) {
    return <LoadingScreen />;
  }

  const correctAnswers = submission.answers.filter(
    (a) => a.score === a.maxScore
  ).length;
  const totalQuestions = submission.answers.length;
  const percentage = (submission.totalScore / submission.maxScore) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Summary */}
        <ReviewSummary
          score={submission.totalScore}
          maxScore={submission.maxScore}
          percentage={percentage}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          timeSpent={/* calculate from startedAt and submittedAt */}
        />

        {/* Questions Review */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Answer Review</h2>

          {submission.answers.map((answer, index) => (
            <ReviewQuestionCard
              key={answer._id}
              answer={answer}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Mock Data Examples

### Mock Exam Data

```typescript
// src/features/exam/data/mock-exam.ts
export const mockExam: ExamWithDetails = {
  _id: "exam-001",
  title: "Midterm Exam - Advanced Mathematics",
  description:
    "Covering chapters 1-5: Calculus, Linear Algebra, and Probability",
  subject: "Mathematics",
  durationMinutes: 90,
  mode: "test",
  shuffleQuestions: true,
  showResultsImmediately: false,
  createdBy: "teacher-001",
  isPublished: true,
  totalQuestions: 20,
  totalPoints: 100,
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2025-12-01T00:00:00Z",
  questions: [
    {
      _id: "eq-001",
      examId: "exam-001",
      questionId: "q-001",
      order: 1,
      maxScore: 5,
      question: {
        _id: "q-001",
        type: "multiple_choice",
        content: "What is the derivative of f(x) = x²?",
        options: [
          { text: "2x", isCorrect: true },
          { text: "x²", isCorrect: false },
          { text: "2x²", isCorrect: false },
          { text: "x", isCorrect: false },
        ],
        difficulty: "easy",
        subject: "Mathematics",
        tags: ["calculus", "derivatives"],
        points: 5,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-002",
      examId: "exam-001",
      questionId: "q-002",
      order: 2,
      maxScore: 10,
      question: {
        _id: "q-002",
        type: "essay",
        content:
          "Explain the Fundamental Theorem of Calculus and provide an example.",
        options: [],
        difficulty: "hard",
        subject: "Mathematics",
        tags: ["calculus", "theory"],
        points: 10,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    // ... more questions
  ],
};
```

---

## ✅ Implementation Checklist

### Phase 1: Basic Exam Taking (Priority 1)

- [ ] Create exam context and state management
- [ ] Implement timer with countdown and warnings
- [ ] Build question navigation grid
- [ ] Create QuestionCard component
- [ ] Implement MultipleChoiceInput
- [ ] Implement EssayInput
- [ ] Implement ShortAnswerInput
- [ ] Implement TrueFalseInput
- [ ] Add exam header with progress
- [ ] Implement answer storage (local state)
- [ ] Add navigation between questions
- [ ] Add flag question functionality
- [ ] Implement submit exam with confirmation

### Phase 2: Review & Results (Priority 2)

- [ ] Create review summary component
- [ ] Build answer comparison UI
- [ ] Show correct answers with explanations
- [ ] Display score breakdown by question
- [ ] Add percentage and grade display
- [ ] Implement results statistics

### Phase 3: Advanced Features (Priority 3)

- [ ] Auto-save functionality
- [ ] Resume incomplete exam
- [ ] Keyboard shortcuts (arrow keys, etc.)
- [ ] Prevent tab switching/cheating detection
- [ ] Full-screen mode option
- [ ] Question bookmarking
- [ ] Time extension handling
- [ ] Multiple attempts tracking

### Phase 4: Teacher/Admin Features (Priority 4)

- [ ] Exam creation interface
- [ ] Question builder with preview
- [ ] Exam assignment to classes
- [ ] Manual grading for essays
- [ ] Bulk grading interface
- [ ] Analytics dashboard
- [ ] Export results to CSV

---

## 🚨 Important Implementation Notes

### 1. Timer Management

- Use `useEffect` with interval for countdown
- Store remaining time in context
- Save time to localStorage for page refresh recovery
- Auto-submit when time runs out
- Show warnings at 10min, 5min, 1min marks

### 2. Data Persistence

- Auto-save answers every 30 seconds
- Save to localStorage as backup
- Implement optimistic UI updates
- Handle network failures gracefully

### 3. Security Considerations

- Validate submissions server-side
- Don't send correct answers to client during exam
- Implement rate limiting for API calls
- Log suspicious activities (tab switching, etc.)

### 4. Performance

- Lazy load questions (don't load all at once)
- Virtualize question navigation for large exams
- Debounce essay input auto-save
- Optimize re-renders with React.memo

### 5. Accessibility

- Full keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management for navigation

---

## 📞 API Integration Points

### Required API Endpoints

```typescript
// Exam endpoints
GET    /api/exams/:examId                    // Get exam details
POST   /api/exams/:examId/start              // Start exam (create submission)
GET    /api/exams/:examId/resume             // Resume incomplete submission

// Submission endpoints
POST   /api/submissions/:submissionId/save   // Auto-save answers
POST   /api/submissions/:submissionId/submit // Submit exam
GET    /api/submissions/:submissionId        // Get submission with answers
GET    /api/submissions/:submissionId/review // Get submission with correct answers

// TODO: Define request/response types for each endpoint
```

---

## 🎨 Additional UI Components Needed

### Confirmation Dialog

```typescript
<ConfirmDialog
  title="Submit Exam?"
  message="Are you sure you want to submit? You have answered 18/20 questions."
  confirmText="Submit"
  cancelText="Review"
  onConfirm={handleSubmit}
  onCancel={closeDialog}
  variant="warning"
/>
```

### Loading Skeleton

```typescript
<ExamLoadingSkeleton />
// Shows placeholders for header, question, and navigation
```

### Time's Up Modal

```typescript
<TimesUpModal
  onClose={handleAutoSubmit}
  message="Time's up! Your exam will be submitted automatically."
/>
```

---

**Happy Coding! 🚀**

_Last updated: December 11, 2025_
