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
