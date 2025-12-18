# GoPass Backend

Backend API cho hệ thống học tập GoPass, được xây dựng với Node.js, Express và MongoDB.

## Cấu trúc dự án

```
backend/
├── src/
│   ├── config/         # Cấu hình database, server
│   ├── models/         # Mongoose models
│   ├── repositories/   # Data access layer
│   ├── services/       # Business logic
│   ├── controllers/    # API controllers
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication, validation, error handling
│   ├── providers/      # External services (JWT, Mail, AI)
│   ├── utils/          # Utility functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env.example        # Environment variables template
├── .gitignore
└── package.json
```

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```bash
cd backend
npm install
```

3. Tạo file `.env` từ `.env.example` và cấu hình:

```bash
cp .env.example .env
```

4. Chỉnh sửa file `.env` với thông tin của bạn:
   - MongoDB URI
   - JWT secrets
   - Email configuration
   - AI scoring API (nếu có)

## Chạy ứng dụng

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới access token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users/me` - Lấy thông tin profile
- `PUT /api/users/me` - Cập nhật profile
- `PUT /api/users/me/change-password` - Đổi mật khẩu

### Classes
- `POST /api/classes` - Tạo lớp học (teacher)
- `GET /api/classes/my-teaching` - Lấy danh sách lớp đang dạy
- `GET /api/classes/my-learning` - Lấy danh sách lớp đang học
- `GET /api/classes/:classId` - Chi tiết lớp học
- `POST /api/classes/join-by-code` - Tham gia lớp bằng code
- `GET /api/classes/:classId/join-requests` - Danh sách yêu cầu tham gia

### Exams
- `POST /api/exams` - Tạo đề thi (teacher)
- `GET /api/exams/:examId` - Chi tiết đề thi
- `POST /api/exams/:examId/assign-to-class` - Gán đề thi cho lớp
- `POST /api/exams/generate-from-bank` - Tạo đề từ ngân hàng câu hỏi

### Submissions
- `POST /api/submissions/assignments/:assignmentId/start` - Bắt đầu làm bài
- `POST /api/submissions/:submissionId/answers` - Lưu câu trả lời
- `POST /api/submissions/:submissionId/submit` - Nộp bài

### Grading
- `POST /api/grading/submissions/:submissionId/grade-auto` - Chấm tự động
- `POST /api/grading/answers/:answerId/grade-manual` - Chấm thủ công
- `POST /api/grading/answers/:answerId/ai-suggest` - Gợi ý điểm AI

### Questions
- `POST /api/questions` - Tạo câu hỏi
- `GET /api/questions` - Tìm kiếm câu hỏi
- `GET /api/questions/:questionId` - Chi tiết câu hỏi

### Contests
- `POST /api/contests` - Tạo contest
- `GET /api/contests/:contestId` - Chi tiết contest
- `GET /api/contests/:contestId/leaderboard` - Bảng xếp hạng

### Admin
- `GET /api/admin/users` - Danh sách người dùng
- `PUT /api/admin/users/:userId/status` - Cập nhật trạng thái user
- `POST /api/admin/users/:userId/reset-password` - Reset mật khẩu
- `GET /api/admin/metrics` - Thống kê hệ thống

## Kiến trúc

### Phân lớp
- **Models**: Định nghĩa schema MongoDB
- **Repositories**: Xử lý truy vấn database
- **Services**: Business logic
- **Controllers**: Xử lý HTTP requests
- **Routes**: Định nghĩa API endpoints
- **Middleware**: Authentication, authorization, validation

### Providers
- **JwtProvider**: Quản lý JWT tokens
- **PasswordHasher**: Hash và verify passwords
- **MailProvider**: Gửi email
- **AiScoringProvider**: Tích hợp AI chấm điểm

## Database Models

- User
- Class, ClassMember, ClassJoinRequest
- Exam, ExamQuestion, ExamAssignment
- ExamSubmission, ExamAnswer
- Question
- ManualGrading
- Contest, ContestExam

## Technologies

- **Node.js & Express**: Backend framework
- **MongoDB & Mongoose**: Database
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Nodemailer**: Email service
- **Axios**: HTTP client

## License

MIT


