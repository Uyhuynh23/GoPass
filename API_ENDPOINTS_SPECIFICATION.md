# GoPass API Endpoints Specification

> **Comprehensive API Documentation**  
> This document lists all endpoints required for the GoPass Learning Management System.  
> Designed to align with the backend MongoDB models and frontend service requirements.

---

## Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Class Management](#2-class-management)
3. [Exam Management](#3-exam-management)
4. [Question Bank Management](#4-question-bank-management)
5. [Submission & Grading](#5-submission--grading)
6. [Contest Management](#6-contest-management)
7. [Student Dashboard & Statistics](#7-student-dashboard--statistics)
8. [Admin Management](#8-admin-management)

---

## 1. Authentication & User Management

### 1.1 User Registration
**Purpose**: Register a new user account

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student | teacher | admin",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "student | teacher | admin",
      "status": "active | pending | locked",
      "avatar": "string",
      "phone": "string",
      "createdAt": "ISO8601 date"
    }
  },
  "message": "Registration successful"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 1.2 User Login
**Purpose**: Authenticate user and receive access tokens

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "student | teacher | admin",
      "status": "active",
      "avatar": "string",
      "phone": "string"
    }
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 1.3 Refresh Access Token
**Purpose**: Get new access token using refresh token

**Endpoint**: `POST /api/auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "string"
  }
}
```

---

### 1.4 User Logout
**Purpose**: Invalidate user session

**Endpoint**: `POST /api/auth/logout`

**Auth**: Required (Bearer Token)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.5 Get Current User Profile
**Purpose**: Get authenticated user information

**Endpoint**: `GET /api/auth/me`

**Auth**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "student | teacher | admin",
    "status": "active",
    "avatar": "string",
    "phone": "string",
    "createdAt": "ISO8601 date",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 1.6 Update User Profile
**Purpose**: Update current user's profile

**Endpoint**: `PUT /api/auth/profile`

**Auth**: Required

**Request Body**:
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "string",
    "phone": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 1.7 Change Password
**Purpose**: Change user password

**Endpoint**: `PUT /api/auth/change-password`

**Auth**: Required

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. Class Management

### 2.1 Create Class
**Purpose**: Teacher creates a new class

**Endpoint**: `POST /api/classes`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "className": "string",
  "description": "string (optional)",
  "requireApproval": "boolean (default: false)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "className": "string",
    "classCode": "string (auto-generated)",
    "teacherUserId": "string",
    "description": "string",
    "requireApproval": "boolean",
    "isActive": "boolean",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 2.2 Get All Classes (for Teacher)
**Purpose**: Get all classes created by the authenticated teacher

**Endpoint**: `GET /api/classes/my-classes`

**Auth**: Required (Teacher role)

**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `isActive` (optional, boolean)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "_id": "string",
        "className": "string",
        "classCode": "string",
        "description": "string",
        "requireApproval": "boolean",
        "isActive": "boolean",
        "studentCount": "number",
        "createdAt": "ISO8601 date"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number"
    }
  }
}
```

---

### 2.3 Get Class Detail
**Purpose**: Get detailed information about a specific class

**Endpoint**: `GET /api/classes/:classId`

**Auth**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "className": "string",
    "classCode": "string",
    "teacherUserId": "string",
    "teacher": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string"
    },
    "description": "string",
    "requireApproval": "boolean",
    "isActive": "boolean",
    "studentCount": "number",
    "createdAt": "ISO8601 date",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 2.4 Update Class
**Purpose**: Update class information

**Endpoint**: `PUT /api/classes/:classId`

**Auth**: Required (Teacher, must be class owner)

**Request Body**:
```json
{
  "className": "string (optional)",
  "description": "string (optional)",
  "requireApproval": "boolean (optional)",
  "isActive": "boolean (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "className": "string",
    "classCode": "string",
    "description": "string",
    "requireApproval": "boolean",
    "isActive": "boolean",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 2.5 Delete Class
**Purpose**: Delete a class (soft delete - set isActive to false)

**Endpoint**: `DELETE /api/classes/:classId`

**Auth**: Required (Teacher, must be class owner)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Class deleted successfully"
}
```

---

### 2.6 Get Class Members
**Purpose**: Get all students in a class

**Endpoint**: `GET /api/classes/:classId/members`

**Auth**: Required

**Query Parameters**:
- `status` (optional: "active" | "removed")

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "_id": "string",
        "studentUserId": "string",
        "student": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "status": "active | removed",
        "joinedDate": "ISO8601 date"
      }
    ]
  }
}
```

---

### 2.7 Join Class Request
**Purpose**: Student requests to join a class using class code

**Endpoint**: `POST /api/classes/join`

**Auth**: Required (Student role)

**Request Body**:
```json
{
  "classCode": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "classId": "string",
    "className": "string",
    "status": "pending | approved",
    "message": "Join request sent successfully" // or "Joined class successfully"
  }
}
```

**Response** (Error - 404):
```json
{
  "success": false,
  "error": "Class not found"
}
```

---

### 2.8 Get Join Requests
**Purpose**: Teacher gets pending join requests for their class

**Endpoint**: `GET /api/classes/:classId/join-requests`

**Auth**: Required (Teacher, must be class owner)

**Query Parameters**:
- `status` (optional: "pending" | "approved" | "rejected")

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "string",
        "classId": "string",
        "studentUserId": "string",
        "student": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "status": "pending | approved | rejected",
        "requestedAt": "ISO8601 date",
        "processedAt": "ISO8601 date",
        "processedBy": "string"
      }
    ]
  }
}
```

---

### 2.9 Approve/Reject Join Request
**Purpose**: Teacher approves or rejects a student's join request

**Endpoint**: `PUT /api/classes/:classId/join-requests/:requestId`

**Auth**: Required (Teacher, must be class owner)

**Request Body**:
```json
{
  "action": "approve | reject"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "approved | rejected",
    "processedAt": "ISO8601 date",
    "processedBy": "string"
  },
  "message": "Request processed successfully"
}
```

---

### 2.10 Remove Student from Class
**Purpose**: Teacher removes a student from class

**Endpoint**: `DELETE /api/classes/:classId/members/:studentUserId`

**Auth**: Required (Teacher, must be class owner)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Student removed from class successfully"
}
```

---

### 2.11 Get My Enrolled Classes (Student)
**Purpose**: Student gets all classes they are enrolled in

**Endpoint**: `GET /api/classes/my-enrolled`

**Auth**: Required (Student role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "_id": "string",
        "className": "string",
        "classCode": "string",
        "teacher": {
          "name": "string",
          "avatar": "string"
        },
        "studentCount": "number",
        "status": "active | pending",
        "joinedDate": "ISO8601 date",
        "stats": {
          "totalAssignments": "number",
          "completedAssignments": "number",
          "avgScore": "number"
        }
      }
    ]
  }
}
```

---

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

---

## 4. Question Bank Management

### 4.1 Create Question
**Purpose**: Create a new question in the question bank

**Endpoint**: `POST /api/questions`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "type": "multiple_choice | essay | short_answer | true_false",
  "content": "string",
  "options": [
    {
      "id": "string (A, B, C, D)",
      "content": "string",
      "isCorrect": "boolean"
    }
  ],
  "correctAnswer": "mixed (string for MC, object for true/false, string for essay)",
  "explanation": "string (optional)",
  "linkedPassageId": "string (optional)",
  "image": {
    "url": "string",
    "caption": "string (optional)",
    "position": "top | bottom"
  },
  "tableData": {
    "headers": ["string"],
    "rows": [["string"]]
  },
  "difficulty": "easy | medium | hard",
  "subject": "string",
  "tags": ["string"],
  "points": "number (default: 1)",
  "isPublic": "boolean (default: false)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "type": "string",
    "content": "string",
    "options": "array",
    "difficulty": "string",
    "subject": "string",
    "tags": "array",
    "points": "number",
    "createdBy": "string",
    "isPublic": "boolean",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 4.2 Get Questions
**Purpose**: Get questions from question bank with filters

**Endpoint**: `GET /api/questions`

**Auth**: Required (Teacher role)

**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `subject` (optional)
- `difficulty` (optional: "easy" | "medium" | "hard")
- `type` (optional)
- `tags` (optional, comma-separated)
- `search` (optional, search in content)
- `myQuestions` (optional, boolean) - Filter by created by current user

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "string",
        "type": "string",
        "content": "string",
        "difficulty": "string",
        "subject": "string",
        "tags": "array",
        "points": "number",
        "isPublic": "boolean",
        "createdBy": "string",
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

### 4.3 Get Question by ID
**Purpose**: Get detailed question information

**Endpoint**: `GET /api/questions/:questionId`

**Auth**: Required (Teacher role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "type": "string",
    "content": "string",
    "options": "array",
    "correctAnswer": "mixed",
    "explanation": "string",
    "linkedPassageId": "string",
    "image": "object",
    "tableData": "object",
    "difficulty": "string",
    "subject": "string",
    "tags": "array",
    "points": "number",
    "createdBy": "string",
    "isPublic": "boolean",
    "createdAt": "ISO8601 date"
  }
}
```

---

### 4.4 Update Question
**Purpose**: Update question information

**Endpoint**: `PUT /api/questions/:questionId`

**Auth**: Required (Teacher, must be question creator or admin)

**Request Body**: Same as Create Question (all fields optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "type": "string",
    "content": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 4.5 Delete Question
**Purpose**: Delete a question from question bank

**Endpoint**: `DELETE /api/questions/:questionId`

**Auth**: Required (Teacher, must be question creator or admin)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

---

### 4.6 Bulk Import Questions
**Purpose**: Import multiple questions at once (from file or JSON)

**Endpoint**: `POST /api/questions/bulk-import`

**Auth**: Required (Teacher role)

**Request Body**:
```json
{
  "questions": [
    {
      "type": "string",
      "content": "string",
      "options": "array",
      "correctAnswer": "mixed",
      "difficulty": "string",
      "subject": "string",
      "tags": "array",
      "points": "number"
    }
  ]
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "imported": "number",
    "failed": "number",
    "errors": [
      {
        "index": "number",
        "error": "string"
      }
    ]
  }
}
```

---

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

## 6. Contest Management

### 6.1 Create Contest
**Purpose**: Create a new contest/competition

**Endpoint**: `POST /api/contests`

**Auth**: Required (Teacher/Admin role)

**Request Body**:
```json
{
  "name": "string",
  "description": "string (optional)",
  "startTime": "ISO8601 date",
  "endTime": "ISO8601 date",
  "isPublic": "boolean (default: true)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "startTime": "ISO8601 date",
    "endTime": "ISO8601 date",
    "ownerId": "string",
    "isPublic": "boolean",
    "status": "upcoming",
    "participantsCount": 0,
    "createdAt": "ISO8601 date"
  }
}
```

---

### 6.2 Get All Contests
**Purpose**: Get list of all contests with filters

**Endpoint**: `GET /api/contests`

**Auth**: Optional (public contests visible to all)

**Query Parameters**:
- `status` (optional: "upcoming" | "ongoing" | "ended")
- `isPublic` (optional, boolean)
- `page` (optional)
- `limit` (optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "contests": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "startTime": "ISO8601 date",
        "endTime": "ISO8601 date",
        "status": "upcoming | ongoing | ended",
        "isPublic": "boolean",
        "participantsCount": "number",
        "ownerId": "string"
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

### 6.3 Get Contest Details
**Purpose**: Get detailed contest information including exams

**Endpoint**: `GET /api/contests/:contestId`

**Auth**: Optional (for public contests)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "startTime": "ISO8601 date",
    "endTime": "ISO8601 date",
    "ownerId": "string",
    "isPublic": "boolean",
    "status": "upcoming | ongoing | ended",
    "participantsCount": "number",
    "exams": [
      {
        "contestExamId": "string",
        "examId": "string",
        "order": "number",
        "weight": "number",
        "exam": {
          "title": "string",
          "subject": "string",
          "durationMinutes": "number",
          "totalQuestions": "number",
          "totalPoints": "number"
        }
      }
    ],
    "userParticipation": {
      "isEnrolled": "boolean",
      "enrolledAt": "ISO8601 date",
      "completedExams": ["string"],
      "totalScore": "number",
      "rank": "number"
    }
  }
}
```

---

### 6.4 Add Exam to Contest
**Purpose**: Add an exam to contest with specific order and weight

**Endpoint**: `POST /api/contests/:contestId/exams`

**Auth**: Required (Teacher/Admin, must be contest owner)

**Request Body**:
```json
{
  "examId": "string",
  "order": "number",
  "weight": "number (default: 1)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "contestExamId": "string",
    "contestId": "string",
    "examId": "string",
    "order": "number",
    "weight": "number"
  }
}
```

---

### 6.5 Remove Exam from Contest
**Purpose**: Remove an exam from contest

**Endpoint**: `DELETE /api/contests/:contestId/exams/:contestExamId`

**Auth**: Required (Teacher/Admin, must be contest owner)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Exam removed from contest successfully"
}
```

---

### 6.6 Join Contest
**Purpose**: Student enrolls in a contest

**Endpoint**: `POST /api/contests/:contestId/join`

**Auth**: Required (Student role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "contestId": "string",
    "userId": "string",
    "enrolledAt": "ISO8601 date",
    "completedExams": [],
    "totalScore": 0
  },
  "message": "Successfully joined the contest"
}
```

---

### 6.7 Get Contest Leaderboard
**Purpose**: Get contest rankings/leaderboard

**Endpoint**: `GET /api/contests/:contestId/leaderboard`

**Auth**: Optional

**Query Parameters**:
- `page` (optional)
- `limit` (optional, default: 100)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "userId": "string",
        "user": {
          "name": "string",
          "avatar": "string"
        },
        "totalScore": "number",
        "rank": "number",
        "percentile": "number",
        "completedExams": "number"
      }
    ],
    "myRank": {
      "userId": "string",
      "rank": "number",
      "totalScore": "number",
      "percentile": "number"
    }
  }
}
```

---

### 6.8 Get My Contest Participation
**Purpose**: Get current user's participation details in a contest

**Endpoint**: `GET /api/contests/:contestId/my-participation`

**Auth**: Required (Student role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "contestId": "string",
    "userId": "string",
    "enrolledAt": "ISO8601 date",
    "completedExams": ["string"],
    "totalScore": "number",
    "rank": "number",
    "percentile": "number",
    "examStatuses": [
      {
        "examId": "string",
        "status": "locked | ready | completed",
        "score": "number",
        "completedAt": "ISO8601 date"
      }
    ]
  }
}
```

---

### 6.9 Update Contest
**Purpose**: Update contest information

**Endpoint**: `PUT /api/contests/:contestId`

**Auth**: Required (Teacher/Admin, must be contest owner)

**Request Body**:
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "startTime": "ISO8601 date (optional)",
  "endTime": "ISO8601 date (optional)",
  "isPublic": "boolean (optional)",
  "status": "upcoming | ongoing | ended (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "startTime": "ISO8601 date",
    "endTime": "ISO8601 date",
    "status": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 6.10 Delete Contest
**Purpose**: Delete a contest

**Endpoint**: `DELETE /api/contests/:contestId`

**Auth**: Required (Teacher/Admin, must be contest owner)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Contest deleted successfully"
}
```

---

## 7. Student Dashboard & Statistics

### 7.1 Get Student Statistics
**Purpose**: Get comprehensive statistics for student dashboard

**Endpoint**: `GET /api/students/stats`

**Auth**: Required (Student role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalClasses": "number",
      "totalExamsTaken": "number",
      "averageScore": "number",
      "totalStudyHours": "number"
    },
    "recentScores": [
      {
        "examId": "string",
        "examTitle": "string",
        "subject": "string",
        "score": "number",
        "maxScore": "number",
        "submittedAt": "ISO8601 date"
      }
    ],
    "subjectPerformance": [
      {
        "subject": "string",
        "averageScore": "number",
        "examsTaken": "number",
        "trend": "improving | stable | declining"
      }
    ],
    "upcomingExams": [
      {
        "assignmentId": "string",
        "examId": "string",
        "examTitle": "string",
        "subject": "string",
        "startTime": "ISO8601 date",
        "endTime": "ISO8601 date",
        "className": "string"
      }
    ]
  }
}
```

---

### 7.2 Get Class Assignments (Student View)
**Purpose**: Get all assignments for classes student is enrolled in

**Endpoint**: `GET /api/students/assignments`

**Auth**: Required (Student role)

**Query Parameters**:
- `classId` (optional)
- `status` (optional: "upcoming" | "ongoing" | "incomplete" | "completed")

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "assignmentId": "string",
        "examId": "string",
        "classId": "string",
        "className": "string",
        "examTitle": "string",
        "subject": "string",
        "startTime": "ISO8601 date",
        "endTime": "ISO8601 date",
        "duration": "number",
        "questionCount": "number",
        "maxScore": "number",
        "status": "upcoming | ongoing | incomplete | completed",
        "myAttempts": "number",
        "attemptLimit": "number",
        "bestScore": "number",
        "submittedCount": "number",
        "totalStudents": "number"
      }
    ]
  }
}
```

---

### 7.3 Get Student Performance in Class
**Purpose**: Get student's performance metrics within a specific class

**Endpoint**: `GET /api/classes/:classId/my-performance`

**Auth**: Required (Student role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "classId": "string",
    "className": "string",
    "studentId": "string",
    "rank": "number",
    "totalStudents": "number",
    "percentile": "number",
    "stats": {
      "totalAssignments": "number",
      "completedAssignments": "number",
      "averageScore": "number",
      "highestScore": "number",
      "lowestScore": "number"
    },
    "recentSubmissions": [
      {
        "examTitle": "string",
        "subject": "string",
        "score": "number",
        "maxScore": "number",
        "submittedAt": "ISO8601 date"
      }
    ],
    "subjectBreakdown": [
      {
        "subject": "string",
        "averageScore": "number",
        "assignmentsCompleted": "number"
      }
    ]
  }
}
```

---

## 8. Admin Management

### 8.1 Get All Users
**Purpose**: Admin gets list of all users with filters

**Endpoint**: `GET /api/admin/users`

**Auth**: Required (Admin role)

**Query Parameters**:
- `role` (optional: "student" | "teacher" | "admin")
- `status` (optional: "active" | "pending" | "locked")
- `search` (optional, search by name/email)
- `page` (optional)
- `limit` (optional)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "status": "string",
        "phone": "string",
        "createdAt": "ISO8601 date",
        "stats": {
          "classesCount": "number",
          "examsCount": "number"
        }
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

### 8.2 Update User Status
**Purpose**: Admin updates user status (activate/lock account)

**Endpoint**: `PUT /api/admin/users/:userId/status`

**Auth**: Required (Admin role)

**Request Body**:
```json
{
  "status": "active | locked | pending"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "status": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 8.3 Update User Role
**Purpose**: Admin changes user role

**Endpoint**: `PUT /api/admin/users/:userId/role`

**Auth**: Required (Admin role)

**Request Body**:
```json
{
  "role": "student | teacher | admin"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "role": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 8.4 Get System Statistics
**Purpose**: Get overall system statistics for admin dashboard

**Endpoint**: `GET /api/admin/stats`

**Auth**: Required (Admin role)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "users": {
      "total": "number",
      "students": "number",
      "teachers": "number",
      "admins": "number",
      "active": "number",
      "locked": "number"
    },
    "classes": {
      "total": "number",
      "active": "number"
    },
    "exams": {
      "total": "number",
      "published": "number"
    },
    "submissions": {
      "total": "number",
      "today": "number",
      "thisWeek": "number"
    },
    "contests": {
      "total": "number",
      "ongoing": "number",
      "upcoming": "number"
    },
    "recentActivity": [
      {
        "type": "user_registered | exam_submitted | class_created",
        "userId": "string",
        "userName": "string",
        "details": "string",
        "timestamp": "ISO8601 date"
      }
    ]
  }
}
```

---

### 8.5 Delete User
**Purpose**: Admin deletes a user account

**Endpoint**: `DELETE /api/admin/users/:userId`

**Auth**: Required (Admin role)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Common Response Formats

### Success Response Structure
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": { ... } // Optional additional error details
}
```

### Common HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource already exists)
- `422` - Unprocessable Entity (Validation error)
- `500` - Internal Server Error (Server error)

---

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens should be included in the request headers for all authenticated endpoints.

---

## Notes for Implementation

1. **Model Compatibility**: All endpoints are designed to work seamlessly with the existing MongoDB models in the backend.

2. **Data Consistency**: Response structures match the data structures expected by frontend services.

3. **Scalability**: Pagination is implemented on list endpoints to handle large datasets.

4. **Security**: Sensitive fields (passwords, correct answers) are excluded from responses unless explicitly required and authorized.

5. **Validation**: All endpoints should implement proper input validation using middleware.

6. **Error Handling**: Consistent error response format across all endpoints.

7. **Relationships**: Proper population of referenced documents (User, Exam, Class, etc.) where needed.

8. **Caching**: Consider implementing caching strategies for frequently accessed data (e.g., contest leaderboards).

9. **Real-time Updates**: Consider WebSocket implementation for real-time features like:
   - Exam timer synchronization
   - Leaderboard updates
   - New assignment notifications

10. **File Upload**: Some endpoints may need multipart/form-data support for:
    - Avatar uploads
    - Question images
    - Bulk import files

---

**Document Version**: 1.0  
**Last Updated**: December 19, 2025  
**Status**: Ready for Backend Implementation
