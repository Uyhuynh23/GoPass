# 📋 Exam Services - TODO List

## ✅ Đã Hoàn Thành

### 1. ExamConfigService ✓

- ✅ Tạo service quản lý config theo môn học
- ✅ Config cho 3 môn: Toán Học, Ngữ Văn, Tiếng Anh
- ✅ Method: `getConfigBySubject()`, `getSectionBadgeColor()`, `formatDuration()`
- ✅ Tách business logic ra khỏi component

### 2. StartExamPanel Component ✓

- ✅ Pure UI component, không chứa business logic
- ✅ Design theo đúng 3 ảnh UI (teal gradient header, sections, instructions)
- ✅ Responsive và accessible

### 3. Refactor ExamDetailPage ✓

- ✅ Chỉ còn routing logic
- ✅ Business logic đã chuyển vào service

---

## 🔨 TODO - Service Layer Implementation

### 1. ExamService (Priority: HIGH)

**File**: `src/features/exam/services/exam.service.ts`

```typescript
export class ExamService {
  /**
   * Fetch exam by ID từ backend API
   * TODO: Replace mock data
   */
  static async getExamById(examId: string): Promise<ExamWithDetails> {
    // TODO: Call API GET /api/exams/:examId
    throw new Error("Not implemented");
  }

  /**
   * Fetch danh sách exams
   * TODO: Implement pagination, filters
   */
  static async getExamList(filters?: ExamFilters): Promise<Exam[]> {
    // TODO: Call API GET /api/exams
    throw new Error("Not implemented");
  }

  /**
   * Start exam - tạo submission record
   * TODO: Implement exam start logic
   */
  static async startExam(examId: string): Promise<ExamSubmission> {
    // TODO: Call API POST /api/exams/:examId/start
    throw new Error("Not implemented");
  }

  /**
   * Check if student can resume incomplete exam
   * TODO: Implement resume logic
   */
  static async canResumeExam(examId: string): Promise<boolean> {
    // TODO: Call API GET /api/exams/:examId/can-resume
    throw new Error("Not implemented");
  }
}
```

**API Endpoints Required**:

- `GET /api/exams/:examId` - Get exam details
- `GET /api/exams` - List exams with filters
- `POST /api/exams/:examId/start` - Start exam (create submission)
- `GET /api/exams/:examId/can-resume` - Check resume status

---

### 2. SubmissionService (Priority: HIGH)

**File**: `src/features/exam/services/submission.service.ts`

```typescript
export class SubmissionService {
  /**
   * Auto-save answers (called every 30s)
   * TODO: Implement debounced auto-save
   */
  static async saveAnswers(
    submissionId: string,
    answers: AnswerData[]
  ): Promise<void> {
    // TODO: Call API PUT /api/submissions/:id/answers
    throw new Error("Not implemented");
  }

  /**
   * Submit exam (final submission)
   * TODO: Implement validation và submission logic
   */
  static async submitExam(submissionId: string): Promise<void> {
    // TODO: Call API POST /api/submissions/:id/submit
    throw new Error("Not implemented");
  }

  /**
   * Get current submission
   * TODO: Fetch current submission với answers
   */
  static async getSubmission(submissionId: string): Promise<ExamSubmission> {
    // TODO: Call API GET /api/submissions/:id
    throw new Error("Not implemented");
  }

  /**
   * Resume incomplete submission
   * TODO: Load saved answers và timer state
   */
  static async resumeSubmission(
    examId: string
  ): Promise<ExamSubmission | null> {
    // TODO: Call API GET /api/exams/:examId/resume
    throw new Error("Not implemented");
  }
}
```

**API Endpoints Required**:

- `PUT /api/submissions/:id/answers` - Auto-save answers
- `POST /api/submissions/:id/submit` - Final submit
- `GET /api/submissions/:id` - Get submission details
- `GET /api/exams/:examId/resume` - Resume incomplete exam

---

### 3. GradingService (Priority: MEDIUM)

**File**: `src/features/exam/services/grading.service.ts`

```typescript
export class GradingService {
  /**
   * Get grading results với correct answers
   * TODO: Implement after exam submission
   */
  static async getGradingResults(submissionId: string): Promise<GradingResult> {
    // TODO: Call API GET /api/submissions/:id/results
    throw new Error("Not implemented");
  }

  /**
   * Manual grading cho essay questions (Teacher only)
   * TODO: Implement teacher grading interface
   */
  static async submitManualGrade(
    submissionId: string,
    questionId: string,
    score: number,
    feedback?: string
  ): Promise<void> {
    // TODO: Call API POST /api/grading/manual
    throw new Error("Not implemented");
  }

  /**
   * Calculate total score
   * TODO: Business logic tính điểm
   */
  static calculateTotalScore(answers: GradedAnswer[]): number {
    // TODO: Implement scoring algorithm
    throw new Error("Not implemented");
  }
}
```

**API Endpoints Required**:

- `GET /api/submissions/:id/results` - Get graded results
- `POST /api/grading/manual` - Submit manual grade
- `GET /api/submissions/:id/review` - Review with correct answers

---

### 4. TimerService (Priority: HIGH)

**File**: `src/features/exam/services/timer.service.ts`

```typescript
export class TimerService {
  /**
   * Save timer state to localStorage (backup)
   * TODO: Persist timer để recover khi refresh
   */
  static saveTimerState(examId: string, timeRemaining: number): void {
    // TODO: localStorage.setItem(`timer-${examId}`, ...)
    throw new Error("Not implemented");
  }

  /**
   * Load timer state from localStorage
   * TODO: Recover timer state after refresh
   */
  static loadTimerState(examId: string): number | null {
    // TODO: localStorage.getItem(`timer-${examId}`)
    throw new Error("Not implemented");
  }

  /**
   * Calculate remaining time based on start time
   * TODO: Server time sync
   */
  static calculateRemainingTime(
    startTime: Date,
    durationMinutes: number
  ): number {
    // TODO: Calculate with server time
    throw new Error("Not implemented");
  }

  /**
   * Handle auto-submit khi hết giờ
   * TODO: Trigger auto-submit
   */
  static onTimeExpired(submissionId: string): void {
    // TODO: Auto-submit exam
    throw new Error("Not implemented");
  }
}
```

---

### 5. ValidationService (Priority: MEDIUM)

**File**: `src/features/exam/services/validation.service.ts`

```typescript
export class ValidationService {
  /**
   * Validate essay word count
   */
  static validateEssayLength(
    text: string,
    minWords: number,
    maxWords: number
  ): ValidationResult {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  /**
   * Validate exam submission trước khi submit
   */
  static validateSubmission(submission: ExamSubmission): ValidationResult {
    // TODO: Check required questions, format, etc.
    throw new Error("Not implemented");
  }

  /**
   * Validate answer format
   */
  static validateAnswerFormat(
    questionType: QuestionType,
    answer: AnswerData
  ): boolean {
    // TODO: Type-specific validation
    throw new Error("Not implemented");
  }
}
```

---

## 📦 Data Flow Architecture

```
┌─────────────────┐
│   Page Layer    │  ← Routing only, no business logic
│  (page.tsx)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Component Layer │  ← Pure UI, props-driven
│ (StartExamPanel)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │  ← Business logic, API calls
│ (ExamService)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│  (Express.js)   │
└─────────────────┘
```

---

## 🎯 Implementation Priority

1. **Phase 1** (Immediate):

   - ExamService.getExamById()
   - SubmissionService.startExam()
   - TimerService basic functionality

2. **Phase 2** (Week 1):

   - SubmissionService.saveAnswers() với debounce
   - SubmissionService.submitExam()
   - TimerService với localStorage backup

3. **Phase 3** (Week 2):

   - GradingService.getGradingResults()
   - Review pages implementation
   - ValidationService

4. **Phase 4** (Week 3):
   - Manual grading (Teacher features)
   - Advanced features (resume, anti-cheating)
   - Analytics và reports

---

## 📝 Notes

- Tất cả services đều là **static methods** (không cần instantiate)
- Error handling: Use try-catch và throw custom errors
- Logging: Console.log trong development, proper logging service trong production
- Testing: Viết unit tests cho từng service method
- Type safety: Đảm bảo TypeScript strict mode

---

**Last Updated**: December 11, 2025
**Status**: ExamConfigService ✅ Complete | Others 🔨 TODO
