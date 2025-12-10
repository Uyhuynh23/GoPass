# Dashboard Feature - API Endpoints Documentation

## Tổng quan

Tài liệu này mô tả các API endpoints cần thiết để phục vụ chức năng Dashboard cho 3 loại người dùng: Admin, Teacher, và Student.

---

## 1. Admin Dashboard APIs

### 1.1 Lấy dữ liệu tổng quan Admin Dashboard

**Endpoint:** `GET /api/admin/dashboard`

**Description:** Lấy dữ liệu tổng hợp cho Admin dashboard, bao gồm thống kê và danh sách đề thi.

**Authentication:** Required (Admin role)

**Response:**

```json
{
  "stats": {
    "totalExams": 4,
    "contestExams": 2,
    "publicExams": 2,
    "totalParticipants": 4970
  },
  "exams": [
    {
      "id": "1",
      "title": "Olympic Toán Toàn Quốc 2025",
      "type": "contest",
      "status": "upcoming",
      "subject": "Toán",
      "duration": 90,
      "questionCount": 50,
      "participantCount": 1250,
      "createdAt": "2025-11-20T00:00:00Z",
      "startDate": "2025-12-15T09:00:00Z",
      "endDate": "2025-12-15T10:30:00Z"
    }
  ]
}
```

### 1.2 Lấy danh sách đề thi với filter và search

**Endpoint:** `GET /api/admin/exams`

**Description:** Lấy danh sách đề thi với khả năng lọc và tìm kiếm.

**Authentication:** Required (Admin role)

**Query Parameters:**

- `search` (string, optional): Từ khóa tìm kiếm theo tên đề thi hoặc môn học
- `type` (string, optional): Lọc theo loại đề thi (`contest`, `public`, `class`, `all`)
- `status` (string, optional): Lọc theo trạng thái (`upcoming`, `active`, `completed`)
- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items mỗi trang (default: 10)

**Example Request:**

```
GET /api/admin/exams?search=toán&type=contest&status=active&page=1&limit=10
```

**Response:**

```json
{
  "data": [
    {
      "id": "1",
      "title": "Olympic Toán Toàn Quốc 2025",
      "type": "contest",
      "status": "upcoming",
      "subject": "Toán",
      "duration": 90,
      "questionCount": 50,
      "participantCount": 1250,
      "createdAt": "2025-11-20T00:00:00Z",
      "startDate": "2025-12-15T09:00:00Z",
      "endDate": "2025-12-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 1.3 Tạo đề thi mới

**Endpoint:** `POST /api/admin/exams`

**Description:** Tạo đề thi mới.

**Authentication:** Required (Admin role)

**Request Body:**

```json
{
  "title": "Đề thi thử THPT QG 2025 - Toán",
  "type": "public",
  "subject": "Toán",
  "duration": 90,
  "startDate": "2025-12-20T09:00:00Z",
  "endDate": "2025-12-20T10:30:00Z",
  "questionIds": ["q1", "q2", "q3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đề thi đã được tạo thành công",
  "data": {
    "id": "exam-123",
    "title": "Đề thi thử THPT QG 2025 - Toán",
    "type": "public",
    "status": "upcoming",
    "subject": "Toán",
    "duration": 90,
    "questionCount": 3,
    "participantCount": 0,
    "createdAt": "2025-12-11T10:00:00Z",
    "startDate": "2025-12-20T09:00:00Z",
    "endDate": "2025-12-20T10:30:00Z"
  }
}
```

### 1.4 Xem chi tiết đề thi

**Endpoint:** `GET /api/admin/exams/:examId`

**Description:** Xem thông tin chi tiết của một đề thi.

**Authentication:** Required (Admin role)

**Response:**

```json
{
  "id": "1",
  "title": "Olympic Toán Toàn Quốc 2025",
  "type": "contest",
  "status": "upcoming",
  "subject": "Toán",
  "duration": 90,
  "questionCount": 50,
  "participantCount": 1250,
  "createdAt": "2025-11-20T00:00:00Z",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T10:30:00Z",
  "questions": [
    {
      "id": "q1",
      "content": "Nội dung câu hỏi...",
      "type": "multiple_choice",
      "points": 2
    }
  ]
}
```

### 1.5 Cập nhật đề thi

**Endpoint:** `PUT /api/admin/exams/:examId`

**Description:** Cập nhật thông tin đề thi.

**Authentication:** Required (Admin role)

**Request Body:**

```json
{
  "title": "Đề thi Olympic Toán Quốc Gia 2025 (Updated)",
  "duration": 120,
  "startDate": "2025-12-16T09:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đề thi đã được cập nhật thành công",
  "data": {
    "id": "1",
    "title": "Đề thi Olympic Toán Quốc Gia 2025 (Updated)",
    "duration": 120
  }
}
```

### 1.6 Xóa đề thi

**Endpoint:** `DELETE /api/admin/exams/:examId`

**Description:** Xóa đề thi (soft delete hoặc hard delete).

**Authentication:** Required (Admin role)

**Response:**

```json
{
  "success": true,
  "message": "Đề thi đã được xóa thành công"
}
```

---

## 2. Teacher Dashboard APIs

### 2.1 Lấy dữ liệu tổng quan Teacher Dashboard

**Endpoint:** `GET /api/teacher/dashboard`

**Description:** Lấy dữ liệu tổng hợp cho Teacher dashboard.

**Authentication:** Required (Teacher role)

**Response:**

```json
{
  "stats": {
    "totalClasses": 2,
    "totalStudents": 5,
    "totalExams": 8,
    "totalContests": 45
  },
  "recentActivity": [
    {
      "id": "1",
      "type": "submission",
      "message": "Nguyễn Văn A đã hoàn thành Đề thi thử THPT QG - Toán",
      "timestamp": "2025-12-11T08:30:00Z"
    }
  ],
  "recentExams": [
    {
      "id": "1",
      "title": "Đề thi thử THPT QG lần 1 - Toán",
      "classId": "class-1",
      "className": "Lớp 12A1",
      "totalSubmissions": 38,
      "totalStudents": 45,
      "completionRate": 84.4
    }
  ],
  "topStudents": [
    {
      "id": "student-1",
      "name": "Nguyễn Văn A",
      "className": "Lớp 12A1",
      "averageScore": 8.5,
      "totalExams": 12
    }
  ]
}
```

### 2.2 Lấy danh sách lớp học của giáo viên

**Endpoint:** `GET /api/teacher/classes`

**Authentication:** Required (Teacher role)

**Response:**

```json
{
  "data": [
    {
      "id": "class-1",
      "name": "Lớp 12A1",
      "subject": "Toán",
      "studentCount": 45,
      "examCount": 5,
      "createdAt": "2025-09-01T00:00:00Z"
    }
  ]
}
```

---

## 3. Student Dashboard APIs

### 3.1 Lấy dữ liệu tổng quan Student Dashboard

**Endpoint:** `GET /api/student/dashboard`

**Description:** Lấy dữ liệu tổng hợp cho Student dashboard.

**Authentication:** Required (Student role)

**Response:**

```json
{
  "stats": {
    "totalClasses": 3,
    "totalExamsTaken": 195,
    "averageScore": 8.0,
    "totalStudyTime": "45h"
  },
  "myClasses": [
    {
      "id": "class-1",
      "name": "Lớp 12A1",
      "subject": "Toán",
      "teacherName": "Thầy Nguyễn Hoà",
      "studentCount": 40
    }
  ],
  "recentActivity": [
    {
      "id": "1",
      "type": "exam_completed",
      "examTitle": "Nguyễn Văn A đã hoàn thành Đề thi thử THPT QG - Toán",
      "status": "Đã chấm",
      "timestamp": "2025-12-11T08:30:00Z"
    }
  ],
  "weeklyActivity": [
    {
      "date": "2025-12-05",
      "score": 75,
      "examCount": 3
    }
  ],
  "subjectPerformance": [
    {
      "subject": "Toán",
      "averageScore": 8.5,
      "examCount": 78,
      "rank": 5
    }
  ]
}
```

### 3.2 Lấy danh sách bài thi đã làm

**Endpoint:** `GET /api/student/submissions`

**Authentication:** Required (Student role)

**Query Parameters:**

- `page` (number, optional): Số trang
- `limit` (number, optional): Số items mỗi trang
- `status` (string, optional): Lọc theo trạng thái (`graded`, `pending`)

**Response:**

```json
{
  "data": [
    {
      "id": "sub-1",
      "examId": "exam-1",
      "examTitle": "Đề thi thử THPT QG - Toán",
      "score": 8.5,
      "maxScore": 10,
      "status": "graded",
      "submittedAt": "2025-12-10T14:30:00Z",
      "gradedAt": "2025-12-10T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 195,
    "totalPages": 20
  }
}
```

---

## 4. Common APIs (Dùng chung)

### 4.1 Lấy thông tin user hiện tại

**Endpoint:** `GET /api/auth/me`

**Description:** Lấy thông tin người dùng đang đăng nhập.

**Authentication:** Required

**Response:**

```json
{
  "id": "user-1",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "role": "admin",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## Error Responses

Tất cả các API khi có lỗi sẽ trả về format:

```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "errors": [
    {
      "field": "title",
      "message": "Tiêu đề không được để trống"
    }
  ]
}
```

**HTTP Status Codes:**

- `200 OK`: Thành công
- `201 Created`: Tạo mới thành công
- `400 Bad Request`: Request không hợp lệ
- `401 Unauthorized`: Chưa đăng nhập
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy resource
- `500 Internal Server Error`: Lỗi server

---

## Authentication

Tất cả các protected endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <jwt_token>
```

Token được lấy từ API đăng nhập: `POST /api/auth/login`
