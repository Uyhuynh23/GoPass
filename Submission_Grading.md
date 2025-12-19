## 5. Submission & Grading

### 5.1 Start Exam Attempt
**Purpose**: Student starts an exam attempt

**Endpoint**: `POST /api/exams/:examId/start`

**Auth**: Required (Student role)

**Request Body**:
```json
{
  "contestId": "string (optional, if part of contest)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "submissionId": "string",
    "examId": "string",
    "studentUserId": "string",
    "startedAt": "ISO8601 date",
    "status": "in_progress",
    "allowedEndTime": "ISO8601 date"
  }
}
```

---

### 5.2 Save Answers (Auto-save)
**Purpose**: Save student's answers during exam (auto-save feature)

**Endpoint**: `PUT /api/submissions/:submissionId/answers`

**Auth**: Required (Student, must be submission owner)

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "string",
      "selectedOptions": ["string"],
      "answerText": "string (for essay/short answer)"
    }
  ]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Answers saved successfully",
  "savedAt": "ISO8601 date"
}
```

---

### 5.3 Submit Exam
**Purpose**: Student submits completed exam for grading

**Endpoint**: `POST /api/submissions/:submissionId/submit`

**Auth**: Required (Student, must be submission owner)

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "string",
      "selectedOptions": ["string"],
      "answerText": "string"
    }
  ]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "submissionId": "string",
    "examId": "string",
    "studentUserId": "string",
    "submittedAt": "ISO8601 date",
    "durationSeconds": "number",
    "status": "submitted | graded",
    "totalScore": "number",
    "maxScore": "number",
    "autoGradedQuestions": "number",
    "manualGradingRequired": "number",
    "answers": [
      {
        "questionId": "string",
        "selectedOptions": ["string"],
        "answerText": "string",
        "isCorrect": "boolean",
        "score": "number",
        "feedback": "string"
      }
    ]
  }
}
```

---

### 5.4 Get Submission Details
**Purpose**: Get detailed submission information for review

**Endpoint**: `GET /api/submissions/:submissionId`

**Auth**: Required

**Query Parameters**:
- `includeCorrectAnswers` (optional, boolean) - For review mode

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "submission": {
      "_id": "string",
      "examId": "string",
      "contestId": "string",
      "studentUserId": "string",
      "startedAt": "ISO8601 date",
      "submittedAt": "ISO8601 date",
      "durationSeconds": "number",
      "totalScore": "number",
      "maxScore": "number",
      "status": "string"
    },
    "exam": {
      "_id": "string",
      "title": "string",
      "subject": "string",
      "durationMinutes": "number"
    },
    "answers": [
      {
        "questionId": "string",
        "question": {
          "content": "string",
          "type": "string",
          "options": "array",
          "correctAnswer": "mixed (if includeCorrectAnswers=true)",
          "explanation": "string (if includeCorrectAnswers=true)"
        },
        "selectedOptions": ["string"],
        "answerText": "string",
        "isCorrect": "boolean",
        "score": "number",
        "maxScore": "number",
        "feedback": "string"
      }
    ]
  }
}
```

---

### 5.5 Get My Submissions
**Purpose**: Student gets all their submissions

**Endpoint**: `GET /api/submissions/my-submissions`

**Auth**: Required (Student role)

**Query Parameters**:
- `examId` (optional)
- `contestId` (optional)
- `status` (optional)
- `page` (optional)
- `limit` (optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "_id": "string",
        "examId": "string",
        "exam": {
          "title": "string",
          "subject": "string"
        },
        "contestId": "string",
        "submittedAt": "ISO8601 date",
        "totalScore": "number",
        "maxScore": "number",
        "status": "string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number"
    }
  }
}
```

---

### 5.6 Get Exam Submissions (Teacher)
**Purpose**: Teacher gets all submissions for a specific exam

**Endpoint**: `GET /api/exams/:examId/submissions`

**Auth**: Required (Teacher, must be exam creator)

**Query Parameters**:
- `classId` (optional)
- `status` (optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "_id": "string",
        "studentUserId": "string",
        "student": {
          "name": "string",
          "email": "string"
        },
        "submittedAt": "ISO8601 date",
        "totalScore": "number",
        "maxScore": "number",
        "status": "string",
        "requiresManualGrading": "boolean"
      }
    ],
    "stats": {
      "totalSubmissions": "number",
      "averageScore": "number",
      "highestScore": "number",
      "lowestScore": "number"
    }
  }
}
```

---

### 5.7 Manual Grade Essay Question
**Purpose**: Teacher manually grades an essay/short answer question

**Endpoint**: `POST /api/submissions/:submissionId/manual-grade`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "questionId": "string",
  "score": "number",
  "feedback": "string (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "answerId": "string",
    "questionId": "string",
    "score": "number",
    "feedback": "string",
    "gradedBy": "string",
    "gradedAt": "ISO8601 date",
    "submissionTotalScore": "number (updated total)"
  }
}
```

---

### 5.8 Get Questions Requiring Manual Grading
**Purpose**: Get all essay/short answer questions that need manual grading

**Endpoint**: `GET /api/grading/pending`

**Auth**: Required (Teacher role)

**Query Parameters**:
- `examId` (optional)
- `classId` (optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "pendingGrading": [
      {
        "submissionId": "string",
        "studentUserId": "string",
        "student": {
          "name": "string",
          "email": "string"
        },
        "examId": "string",
        "exam": {
          "title": "string"
        },
        "questionId": "string",
        "question": {
          "content": "string",
          "type": "string"
        },
        "answerText": "string",
        "submittedAt": "ISO8601 date"
      }
    ]
  }
}
```

---
