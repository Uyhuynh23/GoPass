# 🎓 GoPass Exam System - Usage Guide

## ✅ Đã hoàn thành

Hệ thống thi đã được build với các tính năng chính:

### Phase 1: Basic Exam Taking ✓

- ✅ TypeScript types đầy đủ (exam, question, submission, answer)
- ✅ Mock data với 10 câu hỏi đa dạng
- ✅ ExamContext với timer, auto-save, navigation
- ✅ UI Components: Timer, ProgressBar, ConfirmDialog
- ✅ Answer Inputs: Multiple Choice, Essay, Short Answer, True/False
- ✅ ExamHeader với countdown timer
- ✅ QuestionCard component tái sử dụng
- ✅ QuestionNavigation grid với màu sắc status
- ✅ Exam detail page với instructions
- ✅ Exam taking page hoàn chỉnh
- ✅ Auto-save mỗi 30 giây
- ✅ Submit exam với confirmation dialog
- ✅ Flag questions functionality
- ✅ Navigation giữa các câu hỏi

---

## 🚀 Hướng dẫn chạy

### 1. Khởi động Development Server

```bash
cd frontend
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 2. Truy cập Exam System

#### URL để test:

```
http://localhost:3000/exam/exam-001
```

Đây là trang hiển thị thông tin đề thi và instructions.

#### Bắt đầu làm bài:

Click nút **"Start Exam"** để chuyển đến trang làm bài:

```
http://localhost:3000/exam/exam-001/take
```

---

## 🎯 Tính năng chính

### 1. **Exam Information Page** (`/exam/[examId]`)

- Hiển thị tiêu đề, mô tả đề thi
- Thông tin: Duration, Questions, Total Points, Subject
- Instructions chi tiết
- Nút Start Exam

### 2. **Exam Taking Interface** (`/exam/[examId]/take`)

#### Header Section:

- **Exam Title** - Tên đề thi
- **Current Progress** - Question X of Y
- **Timer** - Countdown với màu sắc:
  - 🟢 Xanh (> 30 phút)
  - 🟠 Cam (10-30 phút)
  - 🔴 Đỏ (< 10 phút)
- **Submit Button** - Nộp bài
- **Progress Bar** - Thanh tiến độ

#### Main Content:

- **Question Display** (Bên trái - 2/3 màn hình):

  - Question number, difficulty badge, points
  - Question content
  - Answer input (tùy loại câu hỏi)
  - Flag button (đánh dấu câu hỏi)
  - Previous/Next navigation buttons

- **Question Navigator** (Bên phải - 1/3 màn hình):
  - Grid hiển thị tất cả câu hỏi
  - Màu sắc status:
    - 🟦 **Blue** - Câu hiện tại
    - 🟩 **Teal** - Đã trả lời
    - ⬜ **Gray** - Chưa trả lời
    - 🟨 **Yellow** - Đã đánh dấu (flagged)
  - Click vào số để jump tới câu đó

### 3. **Question Types**

#### Multiple Choice:

- Radio buttons với options
- Chọn 1 đáp án
- Màu xanh khi được chọn

#### Essay:

- Textarea lớn
- Word counter (min/max words)
- Character counter

#### Short Answer:

- Input text box
- Cho câu trả lời ngắn

#### True/False:

- 2 options: True hoặc False
- Radio button selection

### 4. **Auto-save**

- Tự động lưu mỗi 30 giây
- Hiển thị indicator góc dưới phải:
  - "💾 Saving..." - Đang lưu
  - "✓ Saved" - Đã lưu thành công

### 5. **Submit Exam**

- Click nút "Submit Exam"
- Hiện dialog xác nhận:
  - Số câu đã trả lời
  - Cảnh báo không thể sửa sau khi submit
- Confirm để nộp bài

---

## 🎨 Mock Data có sẵn

### Exam: "Midterm Exam - Advanced Mathematics"

- **Duration**: 90 minutes
- **Total Questions**: 10
- **Total Points**: 50
- **Subject**: Mathematics

### Questions bao gồm:

1. **Multiple Choice** - Derivative of x² (5 points, easy)
2. **Multiple Choice** - Integral of 2x (5 points, easy)
3. **True/False** - Limit theorem (5 points, medium)
4. **Short Answer** - Value of π (3 points, easy)
5. **Essay** - Fundamental Theorem of Calculus (10 points, hard)
6. **Multiple Choice** - Solving equations (5 points, medium)
7. **True/False** - Matrix determinant (5 points, medium)
8. **Short Answer** - Probability (4 points, easy)
9. **Multiple Choice** - Slope of line (5 points, easy)
10. **True/False** - Triangle angles (3 points, easy)

---

## 🧪 Test Scenarios

### Scenario 1: Làm bài đầy đủ

1. Truy cập `/exam/exam-001`
2. Đọc instructions
3. Click "Start Exam"
4. Trả lời các câu hỏi (có thể test từng loại)
5. Dùng Previous/Next hoặc click vào grid để navigate
6. Flag một số câu hỏi
7. Xem auto-save hoạt động (sau 30s)
8. Click "Submit Exam"
9. Xác nhận submit

### Scenario 2: Test Timer

1. Start exam
2. Quan sát timer đếm ngược
3. Màu sẽ đổi từ xanh → cam → đỏ khi gần hết giờ
4. (Optional: Có thể giảm durationMinutes trong mock-exam.ts để test nhanh)

### Scenario 3: Test Navigation

1. Start exam
2. Trả lời câu 1
3. Click Next để đến câu 2
4. Click vào số 5 trong grid
5. Verify jump tới câu 5
6. Click Previous
7. Verify quay lại câu 4

### Scenario 4: Test Question Types

- **Câu 1, 2, 6, 9**: Multiple Choice
- **Câu 3, 7, 10**: True/False
- **Câu 4, 8**: Short Answer
- **Câu 5**: Essay (test word counter)

---

## 📝 Notes cho Developer

### Customize Mock Data:

File: `frontend/src/features/exam/data/mock-exam.ts`

- Thay đổi `durationMinutes` để test timer
- Thêm/bớt questions
- Sửa content của questions

### Adjust Timer Colors:

File: `frontend/src/components/ui/Timer.tsx`

- Line 15-17: Thay đổi thresholds (1800s = 30min, 600s = 10min)

### Customize Auto-save Interval:

File: `frontend/src/features/exam/context/ExamContext.tsx`

- Line 55: `30000` = 30 seconds (có thể đổi thành `10000` = 10s để test)

---

## 🔜 TODO - Tính năng chưa implement

### Phase 2: Review & Results

- [ ] Review page (`/exam/[examId]/review`)
- [ ] Results page với điểm số
- [ ] Show correct answers
- [ ] Score breakdown

### Phase 3: Advanced Features

- [ ] Resume incomplete exam
- [ ] Keyboard shortcuts (← → arrow keys)
- [ ] Prevent tab switching
- [ ] Full-screen mode
- [ ] Export results PDF

### Phase 4: API Integration

- [ ] Connect to backend APIs
- [ ] Real submission storage
- [ ] Load exam from database
- [ ] User authentication check

---

## 🐛 Troubleshooting

### Lỗi "Module not found"

```bash
npm install
```

### Timer không countdown

- Check console log
- Verify ExamContext được wrap đúng

### Auto-save không hoạt động

- Mở Console
- Xem log "Auto-saving answers"
- Verify answers có trong state

### Submit không làm gì

- Check console log "Submitting exam"
- Hiện tại chỉ show alert (chưa có API)

---

## 📞 Contact & Support

Nếu cần hỗ trợ thêm:

1. Check `DEVELOPER_GUIDE_EXAM.md` cho chi tiết implementation
2. Xem code comments trong các components
3. Test với mock data trước khi integrate API

---

**🎉 Enjoy testing the Exam System! 🚀**

_Build completed: December 11, 2025_
