# Exam Taking API Specification

**Version:** 1.0  
**Date:** December 19, 2025  
**Purpose:** This document defines all API endpoints required for the exam-taking feature, including exam retrieval, submission management, answer saving, and review functionality.

---

## Table of Contents

1. [Overview](#overview)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
   - [Exam Management](#exam-management)
   - [Submission Management](#submission-management)
   - [Answer Management](#answer-management)
   - [Review & Grading](#review--grading)
4. [Error Handling](#error-handling)
5. [Authentication](#authentication)

---

## Overview

The exam-taking system supports:

- **Standalone exams** (practice mode)
- **Assigned exams** (class assignments with time constraints)
- **Contest exams** (competitive mode)
- **Multiple question types** (multiple choice, true/false, short answer, essay)
- **Reading passages** (for language exams)
- **Auto-save** functionality
- **Real-time submission** tracking
- **Detailed review** with correct answers and explanations

---

## Data Models

### 1. Exam

```typescript
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "subject": "string",
  "durationMinutes": "number",
  "mode": "practice" | "test" | "contest",
  "shuffleQuestions": "boolean",
  "showResultsImmediately": "boolean",
  "createdBy": "string", // User ID
  "isPublished": "boolean",
  "totalQuestions": "number",
  "totalPoints": "number",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### 2. ExamQuestion

```typescript
{
  "_id": "string",
  "examId": "string",
  "questionId": "string",
  "order": "number",
  "section": "string | null", // e.g., "Phần I", "Reading Comprehension"
  "maxScore": "number",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### 3. Question

```typescript
{
  "_id": "string",
  "type": "multiple_choice" | "essay" | "short_answer" | "true_false",
  "content": "string", // HTML content
  "options": [
    {
      "id": "string", // e.g., "A", "B", "C", "D"
      "content": "string"
    }
  ],
  "correctAnswer": "string | Record<string, any>", // String for MC, Record for true/false
  "explanation": "string | null", // HTML content
  "difficulty": "easy" | "medium" | "hard",
  "subject": "string",
  "tags": ["string"],
  "points": "number",
  "linkedPassageId": "string | null",
  "image": {
    "url": "string",
    "caption": "string | null",
    "position": "top" | "bottom"
  } | null,
  "tableData": {
    "headers": ["string"],
    "rows": [["string"]]
  } | null,
  "isPublic": "boolean",
  "createdBy": "string",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### 4. ReadingPassage

```typescript
{
  "id": "string",
  "title": "string",
  "content": "string", // HTML content
  "audioUrl": "string | null"
}
```

### 5. ExamAssignment

```typescript
{
  "_id": "string",
  "examId": "string",
  "classId": "string",
  "startTime": "ISO8601 string",
  "endTime": "ISO8601 string",
  "shuffleQuestions": "boolean",
  "allowLateSubmission": "boolean",
  "maxAttempts": "number",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### 6. ExamSubmission

```typescript
{
  "_id": "string",
  "assignmentId": "string | null",
  "examId": "string",
  "studentId": "string",
  "contestId": "string | null",
  "status": "in_progress" | "submitted" | "graded" | "late",
  "startedAt": "ISO8601 string",
  "submittedAt": "ISO8601 string | null",
  "totalScore": "number",
  "maxScore": "number",
  "attemptNumber": "number",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

### 7. ExamAnswer

```typescript
{
  "_id": "string",
  "submissionId": "string",
  "questionId": "string",
  "answerText": "string | null", // For essay/short answer
  "selectedOptions": ["string"], // For multiple choice/true-false
  "score": "number",
  "maxScore": "number",
  "feedback": "string | null",
  "isAutoGraded": "boolean",
  "isManuallyGraded": "boolean",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

---

## API Endpoints

### Exam Management

#### 1. Get Exam with Full Details

**Purpose:** Retrieve complete exam information including questions, reading passages, and user's submission status.

```
GET /api/exams/:examId
```

**Authentication:** Required

**Path Parameters:**

- `examId` (string, required): The exam ID

**Query Parameters:**

- `includeAnswers` (boolean, optional): Whether to include correct answers (default: false)
- `assignmentId` (string, optional): Assignment ID if taking via class assignment
- `contestId` (string, optional): Contest ID if taking via contest

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "_id": "exam-001",
    "title": "KỲ THI TỐT NGHIỆP THPT NĂM 2025 - Môn TOÁN (Mã đề 0101)",
    "description": "Đề thi chính thức. Thời gian: 90 phút.",
    "subject": "Toán Học",
    "durationMinutes": 90,
    "mode": "test",
    "showResultsImmediately": false,
    "totalQuestions": 22,
    "totalPoints": 10,
    "shuffleQuestions": false,
    "isPublished": true,
    "createdBy": "admin-01",
    "createdAt": "2025-12-16T08:00:00Z",
    "updatedAt": "2025-12-16T08:00:00Z",

    "questions": [
      {
        "_id": "eq-math-01",
        "examId": "exam-001",
        "questionId": "q-math-01",
        "order": 1,
        "section": "Phần I",
        "maxScore": 0.25,
        "question": {
          "_id": "q-math-01",
          "type": "multiple_choice",
          "content": "<p>Câu hỏi...</p>",
          "options": [
            { "id": "A", "content": "Option A" },
            { "id": "B", "content": "Option B" },
            { "id": "C", "content": "Option C" },
            { "id": "D", "content": "Option D" }
          ],
          "correctAnswer": null, // Hidden when includeAnswers=false
          "explanation": null, // Hidden when includeAnswers=false
          "difficulty": "medium",
          "subject": "Toán Học",
          "tags": ["calculus"],
          "points": 0.25,
          "linkedPassageId": null,
          "image": null,
          "tableData": null,
          "isPublic": true,
          "createdBy": "admin-01",
          "createdAt": "2025-12-16T08:00:00Z",
          "updatedAt": "2025-12-16T08:00:00Z"
        }
      }
    ],

    "readingPassages": [
      {
        "id": "passage-eng-01",
        "title": "Technology in Agriculture",
        "content": "<p>Reading passage content...</p>",
        "audioUrl": null
      }
    ],

    "assignment": {
      "_id": "assign-001",
      "examId": "exam-001",
      "classId": "class-001",
      "startTime": "2025-12-20T08:00:00Z",
      "endTime": "2025-12-20T10:00:00Z",
      "shuffleQuestions": true,
      "allowLateSubmission": false,
      "maxAttempts": 1,
      "createdAt": "2025-12-15T08:00:00Z",
      "updatedAt": "2025-12-15T08:00:00Z"
    },

    "userSubmission": {
      "_id": "sub-001",
      "assignmentId": "assign-001",
      "examId": "exam-001",
      "studentId": "student-01",
      "status": "in_progress",
      "startedAt": "2025-12-20T08:30:00Z",
      "submittedAt": null,
      "totalScore": 0,
      "maxScore": 10,
      "attemptNumber": 1,
      "createdAt": "2025-12-20T08:30:00Z",
      "updatedAt": "2025-12-20T08:35:00Z"
    }
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Exam not found"
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "You don't have permission to access this exam"
}
```

**Frontend Usage:**

- Called when loading exam detail page (`/exam/[examId]`)
- Called when starting exam (`/exam/[examId]/take`)
- Frontend transforms response to match `ExamWithDetails` interface

**Backend Implementation Notes:**

1. Check if user has permission to view this exam
2. For assigned exams, verify assignment exists and is within time window
3. Check if user has an existing in-progress submission
4. Never return `correctAnswer` or `explanation` unless `includeAnswers=true` (for review mode)
5. Shuffle questions if `shuffleQuestions` is true (store seed in submission)
6. Join with `exam_questions`, `questions`, `reading_passages` tables
7. Return user's latest submission if exists

---

### Submission Management

#### 2. Start Exam / Create Submission

**Purpose:** Create a new submission when student starts taking an exam.

```
POST /api/exams/:examId/submissions
```

**Authentication:** Required

**Path Parameters:**

- `examId` (string, required): The exam ID

**Request Body:**

```json
{
  "assignmentId": "assign-001", // Optional
  "contestId": "contest-001" // Optional
}
```

**Response Success (201):**

```json
{
  "success": true,
  "data": {
    "_id": "sub-002",
    "assignmentId": "assign-001",
    "examId": "exam-001",
    "studentId": "student-01",
    "contestId": null,
    "status": "in_progress",
    "startedAt": "2025-12-20T09:00:00Z",
    "submittedAt": null,
    "totalScore": 0,
    "maxScore": 10,
    "attemptNumber": 1,
    "createdAt": "2025-12-20T09:00:00Z",
    "updatedAt": "2025-12-20T09:00:00Z"
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "You have already started this exam"
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "Exam assignment has ended"
}
```

**Frontend Usage:**

- Called automatically when user clicks "Start Exam"
- Submission ID is stored in ExamContext
- Frontend uses this ID for auto-save and final submission

**Backend Implementation Notes:**

1. Verify user hasn't exceeded max attempts (from assignment)
2. Check assignment time constraints (start/end time)
3. Set `startedAt` to current timestamp
4. Set `attemptNumber` based on user's previous attempts
5. Set `status` to "in_progress"
6. Return the created submission object

---

#### 3. Auto-Save Answers (Draft)

**Purpose:** Periodically save student's answers without finalizing submission.

```
PATCH /api/submissions/:submissionId/answers
```

**Authentication:** Required

**Path Parameters:**

- `submissionId` (string, required): The submission ID

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "q-math-01",
      "answerText": null,
      "selectedOptions": ["A"]
    },
    {
      "questionId": "q-math-13",
      "answerText": null,
      "selectedOptions": {
        "a": "true",
        "b": "false",
        "c": "false",
        "d": "false"
      }
    },
    {
      "questionId": "q-math-17",
      "answerText": "1260",
      "selectedOptions": []
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Answers saved successfully",
  "data": {
    "submissionId": "sub-002",
    "savedCount": 3,
    "lastSavedAt": "2025-12-20T09:15:00Z"
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Submission not found"
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "Submission has already been finalized"
}
```

**Frontend Usage:**

- Called every 30-60 seconds automatically by ExamContext
- Called when user navigates between questions
- Displays "Saving..." / "Saved" status indicator

**Backend Implementation Notes:**

1. Verify submission belongs to current user
2. Check submission status is "in_progress"
3. Upsert answers (insert if new, update if exists)
4. Do NOT calculate scores yet
5. Do NOT change submission status
6. Update `submission.updatedAt` timestamp
7. Use transaction to ensure atomicity

---

#### 4. Submit Exam (Finalize)

**Purpose:** Finalize submission, trigger auto-grading for objective questions.

```
POST /api/submissions/:submissionId/submit
```

**Authentication:** Required

**Path Parameters:**

- `submissionId` (string, required): The submission ID

**Request Body:**

```json
{
  "answers": [
    {
      "questionId": "q-math-01",
      "answerText": null,
      "selectedOptions": ["A"]
    },
    {
      "questionId": "q-math-13",
      "answerText": null,
      "selectedOptions": {
        "a": "true",
        "b": "false",
        "c": "false",
        "d": "false"
      }
    },
    {
      "questionId": "q-math-17",
      "answerText": "1260",
      "selectedOptions": []
    }
  ],
  "timeSpentSeconds": 5400
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "submissionId": "sub-002",
    "status": "graded",
    "totalScore": 8.5,
    "maxScore": 10,
    "submittedAt": "2025-12-20T10:30:00Z",
    "gradedAnswers": 20,
    "pendingManualGrading": 2
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Submission has already been finalized"
}
```

**Frontend Usage:**

- Called when user clicks "Submit Exam"
- Called automatically when time runs out
- Redirects to review page after success

**Backend Implementation Notes:**

1. Verify submission belongs to current user
2. Check submission status is "in_progress"
3. Save all final answers (upsert)
4. Set `submittedAt` to current timestamp
5. **Auto-grade objective questions:**
   - Multiple choice: Compare `selectedOptions` with `question.correctAnswer`
   - True/False: Compare object values
   - Short answer: Can use strict string comparison or AI scoring
   - Essay: Mark for manual grading
6. Calculate `totalScore` from graded answers
7. Update submission status:
   - "graded" if all questions auto-graded
   - "submitted" if some need manual grading
8. If late submission and not allowed, mark as "late"
9. If part of contest, update `contest_participation` scores
10. Return grading summary

**Auto-Grading Logic Example:**

```typescript
// Multiple Choice & True/False
function autoGradeObjective(userAnswer, correctAnswer, maxScore) {
  if (userAnswer === correctAnswer) {
    return maxScore;
  }

  // For true/false with partial credit
  if (typeof correctAnswer === "object") {
    let correct = 0;
    let total = 0;
    for (let key in correctAnswer) {
      total++;
      if (userAnswer[key] === correctAnswer[key]) {
        correct++;
      }
    }
    return (correct / total) * maxScore;
  }

  return 0;
}

// Short Answer
function autoGradeShortAnswer(userAnswer, correctAnswer, maxScore) {
  const normalized1 = String(userAnswer).trim().toLowerCase();
  const normalized2 = String(correctAnswer).trim().toLowerCase();

  if (normalized1 === normalized2) {
    return maxScore;
  }

  // Can integrate AI scoring here
  return 0;
}
```

---

### Answer Management

#### 5. Get Submission Answers

**Purpose:** Retrieve saved answers for a submission (for resume functionality).

```
GET /api/submissions/:submissionId/answers
```

**Authentication:** Required

**Path Parameters:**

- `submissionId` (string, required): The submission ID

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "submissionId": "sub-002",
    "status": "in_progress",
    "answers": [
      {
        "_id": "ans-001",
        "submissionId": "sub-002",
        "questionId": "q-math-01",
        "answerText": null,
        "selectedOptions": ["A"],
        "score": 0,
        "maxScore": 0.25,
        "isAutoGraded": false,
        "isManuallyGraded": false,
        "createdAt": "2025-12-20T09:05:00Z",
        "updatedAt": "2025-12-20T09:15:00Z"
      }
    ]
  }
}
```

**Frontend Usage:**

- Not currently used (frontend uses localStorage for draft state)
- Can be used for multi-device sync in future

**Backend Implementation Notes:**

1. Verify submission belongs to current user
2. Return all saved answers for the submission
3. Do not include scores if submission is still in progress

---

### Review & Grading

#### 6. Get Submission Details (For Review)

**Purpose:** Retrieve complete submission with exam structure, user answers, scores, and explanations.

```
GET /api/submissions/:submissionId
```

**Authentication:** Required

**Path Parameters:**

- `submissionId` (string, required): The submission ID

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "submission": {
      "_id": "sub-002",
      "assignmentId": "assign-001",
      "examId": "exam-001",
      "studentId": "student-01",
      "contestId": null,
      "status": "graded",
      "startedAt": "2025-12-20T09:00:00Z",
      "submittedAt": "2025-12-20T10:30:00Z",
      "totalScore": 8.5,
      "maxScore": 10,
      "attemptNumber": 1,
      "createdAt": "2025-12-20T09:00:00Z",
      "updatedAt": "2025-12-20T10:30:00Z",
      "answers": [
        {
          "_id": "ans-001",
          "submissionId": "sub-002",
          "questionId": "q-math-01",
          "answerText": null,
          "selectedOptions": ["B"],
          "score": 0,
          "maxScore": 0.25,
          "feedback": "Incorrect. Correct answer is D.",
          "isAutoGraded": true,
          "isManuallyGraded": false,
          "createdAt": "2025-12-20T10:30:00Z",
          "updatedAt": "2025-12-20T10:30:00Z"
        },
        {
          "_id": "ans-002",
          "submissionId": "sub-002",
          "questionId": "q-math-13",
          "answerText": null,
          "selectedOptions": {
            "a": "true",
            "b": "false",
            "c": "false",
            "d": "false"
          },
          "score": 0.25,
          "maxScore": 1,
          "feedback": "Partially correct. Option a is correct.",
          "isAutoGraded": true,
          "isManuallyGraded": false,
          "createdAt": "2025-12-20T10:30:00Z",
          "updatedAt": "2025-12-20T10:30:00Z"
        }
      ]
    },
    "exam": {
      "_id": "exam-001",
      "title": "KỲ THI TỐT NGHIỆP THPT NĂM 2025 - Môn TOÁN (Mã đề 0101)",
      "description": "Đề thi chính thức. Thời gian: 90 phút.",
      "subject": "Toán Học",
      "durationMinutes": 90,
      "mode": "test",
      "showResultsImmediately": false,
      "totalQuestions": 22,
      "totalPoints": 10,
      "shuffleQuestions": false,
      "isPublished": true,
      "createdBy": "admin-01",
      "createdAt": "2025-12-16T08:00:00Z",
      "updatedAt": "2025-12-16T08:00:00Z",
      "questions": [
        {
          "_id": "eq-math-01",
          "examId": "exam-001",
          "questionId": "q-math-01",
          "order": 1,
          "section": "Phần I",
          "maxScore": 0.25,
          "question": {
            "_id": "q-math-01",
            "type": "multiple_choice",
            "content": "<p>Câu hỏi...</p>",
            "options": [
              { "id": "A", "content": "Option A" },
              { "id": "B", "content": "Option B" },
              { "id": "C", "content": "Option C" },
              { "id": "D", "content": "Option D" }
            ],
            "correctAnswer": "D", // NOW INCLUDED FOR REVIEW
            "explanation": "<p>Detailed explanation...</p>", // NOW INCLUDED
            "difficulty": "medium",
            "subject": "Toán Học",
            "tags": ["calculus"],
            "points": 0.25,
            "linkedPassageId": null,
            "image": {
              "url": "https://example.com/image.png",
              "caption": "Graph illustration",
              "position": "bottom"
            },
            "tableData": null,
            "isPublic": true,
            "createdBy": "admin-01",
            "createdAt": "2025-12-16T08:00:00Z",
            "updatedAt": "2025-12-16T08:00:00Z"
          }
        }
      ],
      "readingPassages": [
        {
          "id": "passage-eng-01",
          "title": "Technology in Agriculture",
          "content": "<p>Reading passage content...</p>",
          "audioUrl": null
        }
      ]
    }
  }
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Submission not found"
}
```

**Response Error (403):**

```json
{
  "success": false,
  "message": "You don't have permission to view this submission"
}
```

**Frontend Usage:**

- Called when loading review page (`/exam/submission/[submissionId]`)
- Displays user's answers alongside correct answers
- Shows score breakdown and explanations

**Backend Implementation Notes:**

1. Verify submission belongs to current user OR user is teacher of the class
2. Return complete exam structure with correct answers and explanations
3. Include all user's answers with scores and feedback
4. Calculate statistics (total correct, accuracy by section, etc.)
5. Join with:
   - `exams` table
   - `exam_questions` table
   - `questions` table (with full data including answers)
   - `exam_answers` table
   - `reading_passages` table

---

#### 7. Get User's Submissions for Exam

**Purpose:** Get list of all attempts for a specific exam (for viewing submission history).

```
GET /api/exams/:examId/my-submissions
```

**Authentication:** Required

**Path Parameters:**

- `examId` (string, required): The exam ID

**Query Parameters:**

- `assignmentId` (string, optional): Filter by specific assignment

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "sub-001",
      "assignmentId": "assign-001",
      "examId": "exam-001",
      "studentId": "student-01",
      "status": "graded",
      "startedAt": "2025-12-20T08:00:00Z",
      "submittedAt": "2025-12-20T09:30:00Z",
      "totalScore": 7.5,
      "maxScore": 10,
      "attemptNumber": 1,
      "createdAt": "2025-12-20T08:00:00Z",
      "updatedAt": "2025-12-20T09:30:00Z"
    },
    {
      "_id": "sub-002",
      "assignmentId": "assign-001",
      "examId": "exam-001",
      "studentId": "student-01",
      "status": "graded",
      "startedAt": "2025-12-20T10:00:00Z",
      "submittedAt": "2025-12-20T11:30:00Z",
      "totalScore": 8.5,
      "maxScore": 10,
      "attemptNumber": 2,
      "createdAt": "2025-12-20T10:00:00Z",
      "updatedAt": "2025-12-20T11:30:00Z"
    }
  ]
}
```

**Frontend Usage:**

- Called on exam detail page to show previous attempts
- Allows user to review past submissions

**Backend Implementation Notes:**

1. Filter by current user's `studentId` and given `examId`
2. Order by `attemptNumber` DESC (latest first)
3. Return summary without answer details

---

#### 8. Manual Grading (Teacher)

**Purpose:** Allow teachers to manually grade essay/short answer questions.

```
PATCH /api/submissions/:submissionId/grade
```

**Authentication:** Required (Teacher role)

**Path Parameters:**

- `submissionId` (string, required): The submission ID

**Request Body:**

```json
{
  "grades": [
    {
      "answerId": "ans-003",
      "score": 2.5,
      "feedback": "Good analysis but missing key points about X and Y."
    },
    {
      "answerId": "ans-004",
      "score": 1.5,
      "feedback": "Needs more detailed explanation."
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Manual grading completed",
  "data": {
    "submissionId": "sub-002",
    "gradedCount": 2,
    "newTotalScore": 9.0,
    "maxScore": 10,
    "status": "graded"
  }
}
```

**Frontend Usage:**

- Teacher grading interface
- Not used in student exam-taking flow

**Backend Implementation Notes:**

1. Verify user is teacher and has access to this class/exam
2. Update individual answer scores and feedback
3. Mark answers as `isManuallyGraded: true`
4. Recalculate submission's `totalScore`
5. Update submission status to "graded" if all questions graded
6. Use transaction to ensure atomicity

---

### Additional Endpoints

#### 9. Get Student's Active Submissions

**Purpose:** Get all in-progress submissions for current user (for resume detection).

```
GET /api/submissions/my-active
```

**Authentication:** Required

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "sub-003",
      "examId": "exam-002",
      "examTitle": "Math Midterm",
      "startedAt": "2025-12-19T14:00:00Z",
      "timeRemaining": 1800,
      "assignmentId": "assign-002",
      "contestId": null
    }
  ]
}
```

**Frontend Usage:**

- Dashboard to show ongoing exams
- Auto-resume functionality

---

## Error Handling

All API endpoints should return consistent error responses:

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "ERROR_CODE", // Optional
  "details": {} // Optional, for validation errors
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Scenarios

1. **Exam not found** (404)
2. **Submission already finalized** (400)
3. **Assignment time window violation** (403)
4. **Max attempts exceeded** (403)
5. **User not enrolled in class** (403)
6. **Invalid answer format** (400)

---

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

The JWT should contain:

- `userId`: Current user's ID
- `role`: User role (student, teacher, admin)
- `exp`: Token expiration

Backend should:

1. Verify token signature
2. Check token expiration
3. Extract user information
4. Verify user permissions for the requested resource

---

## Implementation Checklist

### Backend Tasks

- [ ] Create database schema for submissions and answers
- [ ] Implement exam retrieval with permission checking
- [ ] Implement submission creation endpoint
- [ ] Implement auto-save endpoint with upsert logic
- [ ] Implement submit endpoint with auto-grading
- [ ] Implement review endpoint with answer disclosure
- [ ] Implement manual grading endpoint
- [ ] Add auto-grading for multiple choice questions
- [ ] Add auto-grading for true/false questions
- [ ] Add auto-grading for short answer (basic)
- [ ] Implement contest score updates on submission
- [ ] Add late submission handling
- [ ] Add max attempts validation
- [ ] Add time window validation for assignments
- [ ] Create indexes for performance (studentId, examId, status)

### Frontend Tasks

- [ ] Create `submissionService.ts` with all API calls
- [ ] Update `examService.ts` to use real backend
- [ ] Remove mock data logic from `ExamContext`
- [ ] Update auto-save to use backend API
- [ ] Update submit logic to use backend API
- [ ] Update review page to use submission details endpoint
- [ ] Add error handling for all API calls
- [ ] Add loading states
- [ ] Add retry logic for failed auto-saves
- [ ] Test multi-device sync (if implementing answer retrieval)
- [ ] Update TypeScript types to match backend response

---

## Notes

1. **Answer Format Consistency:** The frontend uses a unified `answer` field that can be string or array. Backend should accept both `answerText` and `selectedOptions` for backward compatibility.

2. **Question Shuffling:** If `shuffleQuestions` is true, the backend should generate a shuffled order and store it with the submission so the same order is maintained on resume.

3. **Reading Passages:** These should be eagerly loaded with the exam to avoid additional API calls during the exam.

4. **Security:** Never expose correct answers in the "take exam" endpoint. Only include them in the "review" endpoint after submission.

5. **Performance:** Consider caching exam data (questions, passages) since they rarely change. Use ETags or cache headers.

6. **Partial Credit:** The true/false grading logic shows an example of partial credit. This can be extended to other question types.

7. **AI Grading:** For short answer and essay questions, integrate with an AI scoring provider (see `AiScoringProvider.js`) for automated feedback.

8. **Real-time Updates:** Future enhancement could add WebSocket support for real-time score updates during manual grading.

---

**End of Specification**
