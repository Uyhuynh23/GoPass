# TypeScript Types Documentation

## Overview

This document describes all TypeScript types, interfaces, and enums defined in the GoPass frontend application. These types provide type safety and structure for the application's data models.

---

## Table of Contents

### Exam Feature Types

1. [Exam Types](#exam-types)
2. [Question Types](#question-types)
3. [Answer Types](#answer-types)
4. [Submission Types](#submission-types)
5. [Exam Configuration Types](#exam-configuration-types)

### Dashboard Feature Types

6. [Class Types](#class-types)
7. [Student Types](#student-types)
8. [Teacher Types](#teacher-types)
9. [Contest Types](#contest-types)
10. [Question Bank Types](#question-bank-types)

---

## Exam Feature Types

### Exam Types

**File:** `src/features/exam/types/exam.ts`

#### Type Aliases

##### `ExamMode`

```typescript
type ExamMode = "practice" | "test" | "contest";
```

Defines the mode of the exam.

| Value        | Description                   |
| ------------ | ----------------------------- |
| `"practice"` | Practice mode for self-study  |
| `"test"`     | Test mode with grading        |
| `"contest"`  | Contest mode for competitions |

##### `ExamStatus`

```typescript
type ExamStatus = "not_started" | "in_progress" | "completed" | "expired";
```

Represents the current status of an exam.

| Value           | Description                   |
| --------------- | ----------------------------- |
| `"not_started"` | Exam has not been started yet |
| `"in_progress"` | Exam is currently in progress |
| `"completed"`   | Exam has been completed       |
| `"expired"`     | Exam time has expired         |

#### Interfaces

##### `Exam`

Base exam information.

| Field                    | Type       | Optional | Description                    |
| ------------------------ | ---------- | -------- | ------------------------------ |
| `_id`                    | `string`   | No       | Unique identifier              |
| `title`                  | `string`   | No       | Exam title                     |
| `description`            | `string`   | No       | Exam description               |
| `subject`                | `string`   | No       | Subject name                   |
| `durationMinutes`        | `number`   | No       | Duration in minutes            |
| `mode`                   | `ExamMode` | No       | Exam mode                      |
| `shuffleQuestions`       | `boolean`  | No       | Whether questions are shuffled |
| `showResultsImmediately` | `boolean`  | No       | Show results after submission  |
| `createdBy`              | `string`   | No       | User ID of creator             |
| `isPublished`            | `boolean`  | No       | Publication status             |
| `totalQuestions`         | `number`   | Yes      | Total number of questions      |
| `totalPoints`            | `number`   | Yes      | Total points available         |
| `createdAt`              | `string`   | No       | Creation timestamp             |
| `updatedAt`              | `string`   | No       | Last update timestamp          |

##### `ExamAssignment`

Represents an exam assigned to a class.

| Field                 | Type      | Optional | Description                           |
| --------------------- | --------- | -------- | ------------------------------------- |
| `_id`                 | `string`  | No       | Unique identifier                     |
| `examId`              | `string`  | No       | Reference to Exam                     |
| `classId`             | `string`  | No       | Reference to Class                    |
| `startTime`           | `string`  | No       | When exam becomes available           |
| `endTime`             | `string`  | No       | When exam closes                      |
| `shuffleQuestions`    | `boolean` | No       | Shuffle questions for this assignment |
| `allowLateSubmission` | `boolean` | No       | Allow submissions after deadline      |
| `maxAttempts`         | `number`  | No       | Maximum attempts allowed              |
| `exam`                | `Exam`    | Yes      | Populated exam data                   |
| `createdAt`           | `string`  | No       | Creation timestamp                    |

##### `ReadingPassage`

Reading passage for language exams.

| Field      | Type     | Optional | Description                       |
| ---------- | -------- | -------- | --------------------------------- |
| `id`       | `string` | No       | Unique identifier                 |
| `title`    | `string` | No       | Passage title                     |
| `content`  | `string` | No       | Passage content/text              |
| `audioUrl` | `string` | Yes      | URL to audio file (for listening) |

##### `ExamWithDetails`

Extended exam interface with full details.

| Field             | Type               | Optional | Description                    |
| ----------------- | ------------------ | -------- | ------------------------------ |
| _(extends Exam)_  | -                  | -        | All fields from `Exam`         |
| `questions`       | `ExamQuestion[]`   | No       | Array of exam questions        |
| `assignment`      | `ExamAssignment`   | Yes      | Assignment details if assigned |
| `userSubmission`  | `ExamSubmission`   | Yes      | User's submission if exists    |
| `readingPassages` | `ReadingPassage[]` | Yes      | Reading passages for the exam  |

---

### Question Types

**File:** `src/features/exam/types/question.ts`

#### Type Aliases

##### `QuestionType`

```typescript
type QuestionType = "multiple_choice" | "essay" | "short_answer" | "true_false";
```

| Value               | Description                               |
| ------------------- | ----------------------------------------- |
| `"multiple_choice"` | Multiple choice question                  |
| `"essay"`           | Essay question requiring paragraph answer |
| `"short_answer"`    | Short answer question                     |
| `"true_false"`      | True/False question                       |

##### `DifficultyLevel`

```typescript
type DifficultyLevel = "easy" | "medium" | "hard";
```

| Value      | Description       |
| ---------- | ----------------- |
| `"easy"`   | Easy difficulty   |
| `"medium"` | Medium difficulty |
| `"hard"`   | Hard difficulty   |

#### Interfaces

##### `QuestionOption`

Option for multiple choice questions.

| Field       | Type      | Optional | Description                        |
| ----------- | --------- | -------- | ---------------------------------- |
| `id`        | `string`  | No       | Option identifier                  |
| `content`   | `string`  | No       | Option text/content                |
| `isCorrect` | `boolean` | Yes      | Whether this is the correct option |

##### `Question`

Complete question definition.

| Field               | Type                            | Optional | Description                       |
| ------------------- | ------------------------------- | -------- | --------------------------------- |
| `_id`               | `string`                        | No       | Unique identifier                 |
| `type`              | `QuestionType`                  | No       | Type of question                  |
| `content`           | `string`                        | No       | Question content/text             |
| `options`           | `QuestionOption[]`              | Yes      | Options for multiple choice       |
| `correctAnswer`     | `string \| Record<string, any>` | Yes      | Correct answer (flexible type)    |
| `difficulty`        | `DifficultyLevel`               | No       | Difficulty level                  |
| `subject`           | `string`                        | No       | Subject name                      |
| `tags`              | `string[]`                      | No       | Tags for categorization/layout    |
| `points`            | `number`                        | No       | Points awarded for correct answer |
| `createdBy`         | `string`                        | No       | User ID of creator                |
| `isPublic`          | `boolean`                       | No       | Public availability               |
| `createdAt`         | `string`                        | No       | Creation timestamp                |
| `updatedAt`         | `string`                        | No       | Last update timestamp             |
| `linkedPassageId`   | `string`                        | Yes      | ID of related reading passage     |
| `image`             | `object`                        | Yes      | Image attachment                  |
| `image.url`         | `string`                        | No       | Image URL                         |
| `image.caption`     | `string`                        | Yes      | Image caption                     |
| `image.position`    | `"top" \| "bottom"`             | Yes      | Image position                    |
| `tableData`         | `object`                        | Yes      | Table data for statistics         |
| `tableData.headers` | `string[]`                      | No       | Table headers                     |
| `tableData.rows`    | `string[][]`                    | No       | Table rows                        |

##### `ExamQuestion`

Question as it appears in an exam.

| Field        | Type       | Optional | Description                      |
| ------------ | ---------- | -------- | -------------------------------- |
| `_id`        | `string`   | No       | Unique identifier                |
| `examId`     | `string`   | No       | Reference to Exam                |
| `questionId` | `string`   | No       | Reference to Question            |
| `order`      | `number`   | No       | Order in the exam                |
| `maxScore`   | `number`   | No       | Maximum score for this question  |
| `section`    | `string`   | Yes      | Section name/identifier          |
| `points`     | `number`   | Yes      | Points (alternative to maxScore) |
| `question`   | `Question` | Yes      | Populated question data          |
| `createdAt`  | `string`   | No       | Creation timestamp               |

---

### Answer Types

**File:** `src/features/exam/types/answer.ts`

#### Interfaces

##### `AnswerData`

Student's answer data for a question.

| Field             | Type                 | Optional | Description                                     |
| ----------------- | -------------------- | -------- | ----------------------------------------------- |
| `questionId`      | `string`             | No       | Reference to Question                           |
| `answer`          | `string \| string[]` | Yes      | Unified answer field (text or selected options) |
| `answerText`      | `string`             | Yes      | Legacy: text answer                             |
| `selectedOptions` | `string[]`           | Yes      | Legacy: selected option IDs                     |
| `isAnswered`      | `boolean`            | No       | Whether question has been answered              |
| `lastModified`    | `Date`               | No       | Last modification time                          |

##### `QuestionNavigationItem`

Navigation item for question palette.

| Field               | Type      | Optional | Description                 |
| ------------------- | --------- | -------- | --------------------------- |
| `questionId`        | `string`  | No       | Reference to Question       |
| `order`             | `number`  | No       | Question order number       |
| `isAnswered`        | `boolean` | No       | Whether answered            |
| `isFlagged`         | `boolean` | No       | Whether flagged for review  |
| `isCurrentQuestion` | `boolean` | No       | Whether currently displayed |

---

### Submission Types

**File:** `src/features/exam/types/submission.ts`

#### Type Aliases

##### `SubmissionStatus`

```typescript
type SubmissionStatus = "in_progress" | "submitted" | "graded" | "late";
```

| Value           | Description              |
| --------------- | ------------------------ |
| `"in_progress"` | Submission in progress   |
| `"submitted"`   | Submitted but not graded |
| `"graded"`      | Graded and scored        |
| `"late"`        | Late submission          |

#### Interfaces

##### `ExamSubmission`

Complete exam submission record.

| Field           | Type               | Optional | Description                 |
| --------------- | ------------------ | -------- | --------------------------- |
| `_id`           | `string`           | No       | Unique identifier           |
| `assignmentId`  | `string`           | No       | Reference to ExamAssignment |
| `examId`        | `string`           | No       | Reference to Exam           |
| `studentId`     | `string`           | No       | Reference to User (student) |
| `status`        | `SubmissionStatus` | No       | Submission status           |
| `startedAt`     | `string`           | No       | When exam was started       |
| `submittedAt`   | `string`           | Yes      | When exam was submitted     |
| `totalScore`    | `number`           | No       | Total score achieved        |
| `maxScore`      | `number`           | No       | Maximum possible score      |
| `attemptNumber` | `number`           | No       | Attempt number              |
| `answers`       | `ExamAnswer[]`     | No       | Array of answers            |
| `exam`          | `Exam`             | Yes      | Populated exam data         |
| `createdAt`     | `string`           | No       | Creation timestamp          |
| `updatedAt`     | `string`           | No       | Last update timestamp       |

##### `ExamAnswer`

Individual answer within a submission.

| Field              | Type       | Optional | Description                 |
| ------------------ | ---------- | -------- | --------------------------- |
| `_id`              | `string`   | No       | Unique identifier           |
| `submissionId`     | `string`   | No       | Reference to ExamSubmission |
| `questionId`       | `string`   | No       | Reference to Question       |
| `answerText`       | `string`   | Yes      | Text answer                 |
| `selectedOptions`  | `string[]` | No       | Selected option IDs         |
| `score`            | `number`   | No       | Score awarded               |
| `maxScore`         | `number`   | No       | Maximum score               |
| `feedback`         | `string`   | Yes      | Grader's feedback           |
| `isAutoGraded`     | `boolean`  | No       | Auto-graded flag            |
| `isManuallyGraded` | `boolean`  | No       | Manually graded flag        |
| `question`         | `Question` | Yes      | Populated question data     |
| `createdAt`        | `string`   | No       | Creation timestamp          |
| `updatedAt`        | `string`   | No       | Last update timestamp       |

---

### Exam Configuration Types

**File:** `src/features/exam/types/exam-config.ts`

#### Type Aliases

##### `ExamLayoutType`

```typescript
type ExamLayoutType = "standard" | "reading-passage";
```

| Value               | Description                         |
| ------------------- | ----------------------------------- |
| `"standard"`        | Standard exam layout                |
| `"reading-passage"` | Layout with reading passage sidebar |

#### Interfaces

##### `ExamLayoutConfig`

Configuration for exam layout.

| Field                   | Type                      | Optional | Description                |
| ----------------------- | ------------------------- | -------- | -------------------------- |
| `type`                  | `ExamLayoutType`          | No       | Layout type                |
| `sidebar`               | `object`                  | No       | Sidebar configuration      |
| `sidebar.width`         | `string`                  | No       | Sidebar width (CSS value)  |
| `sidebar.position`      | `"left"`                  | No       | Sidebar position           |
| `content`               | `object`                  | No       | Content area configuration |
| `content.columns`       | `1 \| 2`                  | No       | Number of columns          |
| `content.split`         | `[number, number]`        | Yes      | Column split ratio         |
| `navigation`            | `object`                  | No       | Navigation configuration   |
| `navigation.type`       | `"question" \| "section"` | No       | Navigation type            |
| `navigation.buttonText` | `string`                  | No       | Button text                |

##### `ExamSectionConfig`

Configuration for exam section.

| Field         | Type                                       | Optional | Description         |
| ------------- | ------------------------------------------ | -------- | ------------------- |
| `id`          | `number`                                   | No       | Section identifier  |
| `title`       | `string`                                   | No       | Section title       |
| `description` | `string`                                   | No       | Section description |
| `color`       | `"teal" \| "blue" \| "purple" \| "orange"` | No       | Section color theme |

##### `ExamInstruction`

Exam instruction item.

| Field       | Type      | Optional | Description          |
| ----------- | --------- | -------- | -------------------- |
| `text`      | `string`  | No       | Instruction text     |
| `highlight` | `boolean` | Yes      | Whether to highlight |

##### `ExamSubjectConfig`

Complete subject configuration for exams.

| Field            | Type                  | Optional | Description           |
| ---------------- | --------------------- | -------- | --------------------- |
| `subject`        | `string`              | No       | Subject name          |
| `examType`       | `string`              | No       | Exam type identifier  |
| `sections`       | `ExamSectionConfig[]` | No       | Array of sections     |
| `instructions`   | `ExamInstruction[]`   | No       | Array of instructions |
| `timeWarning`    | `string`              | No       | Time warning message  |
| `headerGradient` | `string`              | No       | Header gradient CSS   |

---

## Dashboard Feature Types

### Class Types

**File:** `src/features/dashboard/types/class.ts`

#### Interfaces

##### `ClassAssignment`

Assignment within a class.

| Field      | Type                                               | Optional | Description                          |
| ---------- | -------------------------------------------------- | -------- | ------------------------------------ |
| `id`       | `number`                                           | No       | Assignment identifier                |
| `title`    | `string`                                           | No       | Assignment title                     |
| `deadline` | `string`                                           | No       | Deadline timestamp                   |
| `duration` | `number`                                           | No       | Duration in minutes                  |
| `status`   | `"upcoming" \| "completed" \| "late" \| "ongoing"` | No       | Assignment status                    |
| `score`    | `number \| null`                                   | No       | Student's score (null if not graded) |
| `maxScore` | `number`                                           | No       | Maximum score                        |

##### `ClassStats`

Statistics for a student in a class.

| Field              | Type     | Optional | Description                     |
| ------------------ | -------- | -------- | ------------------------------- |
| `rank`             | `number` | No       | Student's rank in class         |
| `totalStudents`    | `number` | No       | Total students for rank context |
| `assignmentsDone`  | `number` | No       | Completed assignments           |
| `totalAssignments` | `number` | No       | Total assignments               |
| `avgScore`         | `number` | No       | Average score                   |

##### `ClassDetail`

Complete class information.

| Field           | Type                | Optional | Description                    |
| --------------- | ------------------- | -------- | ------------------------------ |
| `id`            | `string`            | No       | Class identifier (e.g., "C01") |
| `code`          | `string`            | No       | Class code (e.g., "CLASS001")  |
| `name`          | `string`            | No       | Class name                     |
| `subject`       | `string`            | No       | Subject name                   |
| `teacher`       | `string`            | No       | Teacher name                   |
| `studentsCount` | `number`            | No       | Number of students             |
| `startDate`     | `string`            | No       | Class start date               |
| `description`   | `string`            | No       | Class description              |
| `stats`         | `ClassStats`        | No       | Student statistics             |
| `assignments`   | `ClassAssignment[]` | No       | Array of assignments           |

---

### Student Types

**File:** `src/features/dashboard/types/student.ts`

#### Type Aliases

##### `ClassStatus`

```typescript
type ClassStatus = "active" | "pending";
```

| Value       | Description                      |
| ----------- | -------------------------------- |
| `"active"`  | Student is actively enrolled     |
| `"pending"` | Join request is pending approval |

##### `HistoryType`

```typescript
type HistoryType = "contest" | "practice_global" | "practice_class";
```

| Value               | Description             |
| ------------------- | ----------------------- |
| `"contest"`         | Contest exam            |
| `"practice_global"` | Global practice exam    |
| `"practice_class"`  | Class-specific practice |

#### Interfaces

##### `StudentExam`

Exam from student's perspective.

| Field           | Type                                         | Optional | Description                |
| --------------- | -------------------------------------------- | -------- | -------------------------- |
| `id`            | `string`                                     | No       | Exam identifier            |
| `title`         | `string`                                     | No       | Exam title                 |
| `class`         | `string`                                     | No       | Class name                 |
| `status`        | `"upcoming" \| "in-progress" \| "completed"` | No       | Exam status                |
| `score`         | `number \| null`                             | No       | Score (null if not graded) |
| `maxScore`      | `number`                                     | No       | Maximum score              |
| `duration`      | `number`                                     | No       | Duration in minutes        |
| `submittedDate` | `string \| null`                             | No       | Submission date            |
| `dueDate`       | `string`                                     | No       | Due date                   |

##### `ClassSummary`

Summary of a class for student dashboard.

| Field         | Type          | Optional | Description                |
| ------------- | ------------- | -------- | -------------------------- |
| `id`          | `string`      | No       | Class identifier           |
| `name`        | `string`      | No       | Class name                 |
| `code`        | `string`      | No       | Class code                 |
| `students`    | `number`      | No       | Number of students         |
| `status`      | `ClassStatus` | No       | Enrollment status          |
| `teacher`     | `string`      | Yes      | Teacher name (for pending) |
| `requestDate` | `string`      | Yes      | Request date (for pending) |

##### `StudentStats`

Student dashboard statistics.

| Field           | Type     | Optional | Description                |
| --------------- | -------- | -------- | -------------------------- |
| `joinedClasses` | `number` | No       | Number of joined classes   |
| `examsTaken`    | `number` | No       | Number of exams taken      |
| `averageScore`  | `number` | No       | Average score across exams |
| `daysUntilExam` | `number` | No       | Days until important exam  |

##### `PerformanceDataPoint`

Data point for performance chart.

| Field   | Type     | Optional | Description          |
| ------- | -------- | -------- | -------------------- |
| `date`  | `string` | No       | Date (e.g., "24/11") |
| `hours` | `number` | No       | Hours studied        |
| `exams` | `number` | No       | Number of exams      |
| `score` | `number` | No       | Score                |

##### `StudentDashboardData`

Complete student dashboard data.

| Field             | Type                     | Optional | Description            |
| ----------------- | ------------------------ | -------- | ---------------------- |
| `stats`           | `StudentStats`           | No       | Student statistics     |
| `exams`           | `StudentExam[]`          | No       | Array of exams         |
| `performanceData` | `PerformanceDataPoint[]` | No       | Performance chart data |

##### `StudentContest`

Contest from student's perspective.

| Field                | Type                                     | Optional | Description                          |
| -------------------- | ---------------------------------------- | -------- | ------------------------------------ |
| `id`                 | `number`                                 | No       | Contest identifier                   |
| `title`              | `string`                                 | No       | Contest title                        |
| `subjects`           | `string[]`                               | No       | Array of subjects                    |
| `startDate`          | `string`                                 | No       | Start date                           |
| `endDate`            | `string`                                 | No       | End date                             |
| `participants`       | `number`                                 | No       | Number of participants               |
| `status`             | `"ongoing" \| "upcoming" \| "completed"` | No       | Contest status                       |
| `progress`           | `object`                                 | Yes      | Progress (for ongoing)               |
| `progress.completed` | `number`                                 | No       | Completed exams                      |
| `progress.total`     | `number`                                 | No       | Total exams                          |
| `rank`               | `string`                                 | Yes      | Rank (for completed, e.g., "45/523") |
| `score`              | `number`                                 | Yes      | Score (for completed)                |

##### `HistoryItem`

History item for exam history.

| Field           | Type          | Optional | Description                     |
| --------------- | ------------- | -------- | ------------------------------- |
| `id`            | `number`      | No       | History item identifier         |
| `title`         | `string`      | No       | Exam title                      |
| `type`          | `HistoryType` | No       | Type of exam                    |
| `subject`       | `string`      | No       | Subject name                    |
| `duration`      | `number`      | No       | Duration in minutes             |
| `score`         | `number`      | No       | Score achieved                  |
| `maxScore`      | `number`      | No       | Maximum score                   |
| `completedDate` | `string`      | No       | Completion date                 |
| `rank`          | `string`      | Yes      | Rank (for contests only)        |
| `className`     | `string`      | Yes      | Class name (for class practice) |

##### `HistoryStats`

Statistics for exam history.

| Field           | Type     | Optional | Description                 |
| --------------- | -------- | -------- | --------------------------- |
| `totalExams`    | `number` | No       | Total exams taken           |
| `avgScore`      | `number` | No       | Average score               |
| `totalContests` | `number` | No       | Total contests participated |
| `totalPractice` | `number` | No       | Total practice exams        |
| `highestScore`  | `number` | No       | Highest score achieved      |
| `bestSubject`   | `string` | No       | Best performing subject     |
| `totalTime`     | `number` | No       | Total time spent (minutes)  |

##### `PracticeExam`

Practice exam information.

| Field           | Type                                    | Optional | Description                    |
| --------------- | --------------------------------------- | -------- | ------------------------------ |
| `id`            | `number`                                | No       | Practice exam identifier       |
| `title`         | `string`                                | No       | Exam title                     |
| `subject`       | `string`                                | No       | Subject name                   |
| `duration`      | `number`                                | No       | Duration in minutes            |
| `questionCount` | `number`                                | No       | Number of questions            |
| `status`        | `"new" \| "completed" \| "in-progress"` | No       | Exam status                    |
| `tags`          | `string[]`                              | No       | Tags for categorization        |
| `score`         | `number`                                | Yes      | Score (if completed)           |
| `maxScore`      | `number`                                | Yes      | Maximum score (if completed)   |
| `completedDate` | `string`                                | Yes      | Completion date (if completed) |

---

### Teacher Types

**File:** `src/features/dashboard/types/teacher.ts`

**Note:** This file is currently empty. Teacher-specific types will be defined here in future development.

---

### Contest Types

**File:** `src/features/dashboard/types/contest.ts`

#### Interfaces

##### `ContestFormData`

Form data for creating/editing a contest.

| Field         | Type       | Optional | Description            |
| ------------- | ---------- | -------- | ---------------------- |
| `title`       | `string`   | No       | Contest title          |
| `description` | `string`   | No       | Contest description    |
| `startDate`   | `string`   | No       | Start date             |
| `endDate`     | `string`   | No       | End date               |
| `subjects`    | `string[]` | No       | Array of subject names |

##### `Subject`

Subject selection item.

| Field        | Type      | Optional | Description                 |
| ------------ | --------- | -------- | --------------------------- |
| `id`         | `string`  | No       | Subject identifier          |
| `name`       | `string`  | No       | Subject name                |
| `isSelected` | `boolean` | No       | Whether subject is selected |

---

### Question Bank Types

**File:** `src/features/dashboard/types/questionbank.ts`

#### Type Aliases

##### `DifficultyLevel`

```typescript
type DifficultyLevel = "easy" | "medium" | "hard";
```

| Value      | Description       |
| ---------- | ----------------- |
| `"easy"`   | Easy difficulty   |
| `"medium"` | Medium difficulty |
| `"hard"`   | Hard difficulty   |

#### Interfaces

##### `QuestionTopic`

Topic in question bank.

| Field               | Type     | Optional | Description                |
| ------------------- | -------- | -------- | -------------------------- |
| `id`                | `string` | No       | Topic identifier           |
| `name`              | `string` | No       | Topic name                 |
| `questionCount`     | `number` | No       | Total questions in topic   |
| `difficulty`        | `object` | No       | Difficulty breakdown       |
| `difficulty.easy`   | `number` | No       | Number of easy questions   |
| `difficulty.medium` | `number` | No       | Number of medium questions |
| `difficulty.hard`   | `number` | No       | Number of hard questions   |

##### `QuestionBankData`

Question bank data structure.

| Field    | Type              | Optional | Description     |
| -------- | ----------------- | -------- | --------------- |
| `topics` | `QuestionTopic[]` | No       | Array of topics |

---

## Type Usage Guidelines

### Naming Conventions

- **Interfaces**: Use PascalCase (e.g., `ExamSubmission`)
- **Type Aliases**: Use PascalCase (e.g., `ExamMode`)
- **Enum Values**: Use snake_case strings (e.g., `"in_progress"`)

### Optional Fields

- Fields marked with `?` in TypeScript or listed as "Yes" in Optional column can be undefined
- Use optional chaining (`?.`) when accessing optional fields

### Date/Time Fields

- All date/time fields are stored as ISO 8601 strings
- Use `new Date(dateString)` for parsing
- Format for display using appropriate libraries (e.g., date-fns, moment.js)

### ID Fields

- All `_id` fields are MongoDB ObjectId strings
- All `id` fields are either numbers or strings depending on context
- Foreign key fields typically end with `Id` (e.g., `examId`, `studentId`)

### Arrays

- Empty arrays are valid values
- Always check array length before accessing elements
- Use array methods (map, filter, etc.) for transformations

### Union Types

- Status and enum fields use union types for type safety
- Always handle all possible cases in switch statements
- Use TypeScript's exhaustiveness checking

---

## Type Dependencies

### Cross-Feature Dependencies

```
exam.ts
├── imports from question.ts (ExamQuestion)
└── imports from submission.ts (ExamSubmission)

submission.ts
├── imports from exam.ts (Exam)
└── imports from question.ts (Question)

student.ts
└── imports from index.ts (Exam, ExamStatus)
```

### Circular Dependencies

Circular dependencies are avoided by:

- Using optional populated fields (e.g., `exam?: Exam`)
- Defining base types separately from extended types
- Using type-only imports when needed

---

## Best Practices

1. **Type Safety**: Always use defined types instead of `any`
2. **Null Checks**: Use optional chaining and nullish coalescing
3. **Type Guards**: Create type guard functions for complex types
4. **Immutability**: Prefer readonly arrays and objects where appropriate
5. **Documentation**: Add JSDoc comments for complex types
6. **Validation**: Use runtime validation (e.g., Zod) for external data
7. **Consistency**: Follow established patterns across the codebase

---

## Future Enhancements

### Planned Additions

- Teacher dashboard types (in `teacher.ts`)
- Admin panel types
- Real-time communication types (WebSocket)
- File upload/media types
- Notification types
- Settings/preferences types

### Type Refinement

- Add runtime validation schemas
- Create utility types for common patterns
- Add branded types for IDs
- Implement discriminated unions for polymorphic data
- Add const assertions for literal types

---

## Appendix

### Common Type Patterns

#### Status Enums

Most entities have a status field with predefined values:

```typescript
type Status = "value1" | "value2" | "value3";
```

#### Timestamp Fields

Standard timestamp fields:

- `createdAt`: Entity creation time
- `updatedAt`: Last modification time
- Custom timestamps: `startedAt`, `submittedAt`, `gradedAt`, etc.

#### Reference Fields

Fields referencing other entities:

- End with `Id` (e.g., `userId`, `examId`)
- Type is `string` (MongoDB ObjectId)
- May have populated version (e.g., `exam?: Exam`)

#### Optional vs Required

Guidelines for optionality:

- Core identifying fields: Required
- Relational IDs: Required
- Computed/populated fields: Optional
- User-provided optional data: Optional
- Fields with defaults: Usually required

---

**Last Updated:** December 14, 2025  
**Document Version:** 1.0  
**Maintained By:** GoPass Development Team
