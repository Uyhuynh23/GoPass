
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
