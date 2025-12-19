
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
