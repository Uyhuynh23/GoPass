
## 3. Exam Management

### 3.1 Create Exam
**Purpose**: Teacher creates a new exam

**Endpoint**: `POST /api/exams`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "title": "string",
  "description": "string (optional)",
  "subject": "string",
  "durationMinutes": "number",
  "mode": "practice_test | practice_global | contest",
  "shuffleQuestions": "boolean (default: false)",
  "showResultsImmediately": "boolean (default: false)",
  "readingPassages": [
    {
      "id": "string",
      "title": "string",
      "content": "string (HTML)"
    }
  ],
  "totalPoints": "number (default: 10)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "subject": "string",
    "durationMinutes": "number",
    "mode": "string",
    "shuffleQuestions": "boolean",
    "showResultsImmediately": "boolean",
    "createdBy": "string",
    "isPublished": "boolean",
    "totalQuestions": "number",
    "totalPoints": "number",
    "readingPassages": "array",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 3.2 Get Exam by ID
**Purpose**: Get detailed exam information including questions

**Endpoint**: `GET /api/exams/:examId`

**Auth**: Required

**Query Parameters**:
- `includeAnswers` (optional, boolean, default: false) - Only for teachers/after submission

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "subject": "string",
    "durationMinutes": "number",
    "mode": "string",
    "shuffleQuestions": "boolean",
    "showResultsImmediately": "boolean",
    "totalQuestions": "number",
    "totalPoints": "number",
    "readingPassages": [
      {
        "id": "string",
        "title": "string",
        "content": "string"
      }
    ],
    "questions": [
      {
        "_id": "string (ExamQuestion ID)",
        "examId": "string",
        "questionId": "string",
        "order": "number",
        "maxScore": "number",
        "section": "string",
        "question": {
          "_id": "string",
          "type": "multiple_choice | essay | short_answer | true_false",
          "content": "string",
          "options": [
            {
              "id": "string (A, B, C, D)",
              "content": "string",
              "isCorrect": "boolean (hidden unless includeAnswers=true)"
            }
          ],
          "correctAnswer": "mixed (hidden unless includeAnswers=true)",
          "explanation": "string (hidden unless includeAnswers=true)",
          "linkedPassageId": "string",
          "image": {
            "url": "string",
            "caption": "string",
            "position": "top | bottom"
          },
          "tableData": {
            "headers": ["string"],
            "rows": [["string"]]
          },
          "difficulty": "easy | medium | hard",
          "subject": "string",
          "tags": ["string"],
          "points": "number"
        }
      }
    ],
    "createdBy": "string",
    "isPublished": "boolean",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 3.3 Get My Exams (Teacher)
**Purpose**: Get all exams created by authenticated teacher

**Endpoint**: `GET /api/exams/my-exams`

**Auth**: Required (Teacher role)

**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `subject` (optional)
- `isPublished` (optional, boolean)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "exams": [
      {
        "_id": "string",
        "title": "string",
        "subject": "string",
        "durationMinutes": "number",
        "totalQuestions": "number",
        "totalPoints": "number",
        "isPublished": "boolean",
        "createdAt": "ISO8601 date"
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

### 3.4 Update Exam
**Purpose**: Update exam information

**Endpoint**: `PUT /api/exams/:examId`

**Auth**: Required (Teacher, must be exam creator)

**Request Body**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "durationMinutes": "number (optional)",
  "shuffleQuestions": "boolean (optional)",
  "showResultsImmediately": "boolean (optional)",
  "isPublished": "boolean (optional)",
  "readingPassages": "array (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "durationMinutes": "number",
    "isPublished": "boolean",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 3.5 Delete Exam
**Purpose**: Delete an exam

**Endpoint**: `DELETE /api/exams/:examId`

**Auth**: Required (Teacher, must be exam creator)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Exam deleted successfully"
}
```

---

### 3.6 Add Questions to Exam
**Purpose**: Add questions to an exam

**Endpoint**: `POST /api/exams/:examId/questions`

**Auth**: Required (Teacher, must be exam creator)

**Request Body**:
```json
{
  "questions": [
    {
      "questionId": "string",
      "order": "number",
      "maxScore": "number",
      "section": "string (optional)"
    }
  ]
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "examId": "string",
    "addedQuestions": "number",
    "totalQuestions": "number"
  }
}
```

---

### 3.7 Remove Question from Exam
**Purpose**: Remove a question from exam

**Endpoint**: `DELETE /api/exams/:examId/questions/:examQuestionId`

**Auth**: Required (Teacher, must be exam creator)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Question removed from exam successfully"
}
```

---

### 3.8 Reorder Exam Questions
**Purpose**: Change order of questions in exam

**Endpoint**: `PUT /api/exams/:examId/questions/reorder`

**Auth**: Required (Teacher, must be exam creator)

**Request Body**:
```json
{
  "questionOrders": [
    {
      "examQuestionId": "string",
      "newOrder": "number"
    }
  ]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Questions reordered successfully"
}
```

---

### 3.9 Assign Exam to Class
**Purpose**: Assign an exam to a class with specific time window

**Endpoint**: `POST /api/exams/:examId/assign`

**Auth**: Required (Teacher, must be exam creator)

**Request Body**:
```json
{
  "classId": "string",
  "startTime": "ISO8601 date",
  "endTime": "ISO8601 date",
  "shuffleQuestions": "boolean (optional)",
  "allowLateSubmission": "boolean (optional, default: false)",
  "attemptLimit": "number (optional, default: 1)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string (ExamAssignment ID)",
    "examId": "string",
    "classId": "string",
    "startTime": "ISO8601 date",
    "endTime": "ISO8601 date",
    "shuffleQuestions": "boolean",
    "allowLateSubmission": "boolean",
    "attemptLimit": "number",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 3.10 Get Class Assignments
**Purpose**: Get all exam assignments for a specific class

**Endpoint**: `GET /api/classes/:classId/assignments`

**Auth**: Required

**Query Parameters**:
- `status` (optional: "upcoming" | "ongoing" | "ended")

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "_id": "string",
        "examId": "string",
        "exam": {
          "title": "string",
          "subject": "string",
          "durationMinutes": "number",
          "totalQuestions": "number",
          "totalPoints": "number"
        },
        "startTime": "ISO8601 date",
        "endTime": "ISO8601 date",
        "status": "upcoming | ongoing | ended",
        "attemptLimit": "number",
        "submittedCount": "number",
        "totalStudents": "number"
      }
    ]
  }
}
```

---

### 3.11 Generate Exam from Question Bank
**Purpose**: Auto-generate exam by selecting questions from question bank based on criteria

**Endpoint**: `POST /api/exams/generate`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "title": "string",
  "description": "string (optional)",
  "subject": "string",
  "durationMinutes": "number",
  "criteria": {
    "totalQuestions": "number",
    "difficulty": {
      "easy": "number",
      "medium": "number",
      "hard": "number"
    },
    "questionTypes": {
      "multiple_choice": "number",
      "essay": "number",
      "short_answer": "number",
      "true_false": "number"
    },
    "tags": ["string (optional)"]
  }
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "title": "string",
    "totalQuestions": "number",
    "generatedQuestions": [
      {
        "questionId": "string",
        "order": "number",
        "maxScore": "number"
      }
    ]
  }
}
```