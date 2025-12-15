# 🎓 Hệ Thống Thi GoPass - Hướng Dẫn Sử Dụng

## ✅ Đã Hoàn Thành

Hệ thống thi đã được xây dựng hoàn chỉnh với **TOÀN BỘ TIẾNG VIỆT**:

### Phase 1: Chức Năng Làm Bài Thi ✓

- ✅ TypeScript types đầy đủ (exam, question, submission, answer)
- ✅ Mock data với 10 câu hỏi Toán Học bằng tiếng Việt
- ✅ ExamContext với timer, tự động lưu, điều hướng
- ✅ UI Components: Timer, ProgressBar, ConfirmDialog
- ✅ Answer Inputs: Multiple Choice, Essay, Short Answer, True/False
- ✅ ExamHeader với countdown timer
- ✅ QuestionCard component tái sử dụng
- ✅ QuestionNavigation grid với màu sắc trạng thái
- ✅ Trang chi tiết bài thi với hướng dẫn
- ✅ Trang làm bài thi hoàn chỉnh
- ✅ Tự động lưu mỗi 30 giây
- ✅ Nộp bài với hộp thoại xác nhận
- ✅ Đánh dấu câu hỏi
- ✅ Điều hướng giữa các câu hỏi

---

## 🚀 Hướng Dẫn Chạy

### 1. Khởi Động Development Server

```bash
cd frontend
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 2. Truy Cập Hệ Thống Thi

#### URL để test:

```
http://localhost:3000/exam/exam-001
```

Đây là trang hiển thị thông tin đề thi và hướng dẫn.

#### Bắt đầu làm bài:

Click nút **"Bắt đầu làm bài"** để chuyển đến trang làm bài:

```
http://localhost:3000/exam/exam-001/take
```

---

## 📋 Nội Dung Mock Data (Tiếng Việt)

### Thông tin bài thi:

- **Tên**: Kiểm Tra Giữa Kỳ - Toán Cao Cấp
- **Mô tả**: Bao gồm chương 1-5: Giải tích, Đại số tuyến tính và Xác suất thống kê
- **Môn học**: Toán Học
- **Thời gian**: 90 phút
- **Số câu hỏi**: 10 câu
- **Tổng điểm**: 50 điểm

### 10 Câu hỏi mẫu:

1. **Câu 1** (Multiple Choice, 5 điểm, Dễ): Đạo hàm của hàm số f(x) = x² là gì?
2. **Câu 2** (Multiple Choice, 5 điểm, Dễ): Tích phân của 2x là gì?
3. **Câu 3** (True/False, 5 điểm, Trung bình): Giới hạn của (sin x)/x khi x tiến đến 0 bằng 1.
4. **Câu 4** (Short Answer, 3 điểm, Dễ): Giá trị của số π (pi) làm tròn đến 2 chữ số thập phân là bao nhiêu?
5. **Câu 5** (Essay, 10 điểm, Khó): Giải thích Định lý Cơ bản của Giải tích...
6. **Câu 6** (Multiple Choice, 5 điểm, Trung bình): Nghiệm của phương trình x² - 4 = 0?
7. **Câu 7** (True/False, 5 điểm, Trung bình): Ma trận và ma trận chuyển vị...
8. **Câu 8** (Short Answer, 4 điểm, Dễ): Xác suất toss đồng xu...
9. **Câu 9** (Multiple Choice, 5 điểm, Dễ): Hệ số góc của đường thẳng y = 3x + 5?
10. **Câu 10** (True/False, 3 điểm, Dễ): Tổng các góc trong một tam giác luôn bằng 180 độ.

---

## 🎯 Tính Năng Chính (Tiếng Việt)

### 1. Trang Chi Tiết Bài Thi (`/exam/[examId]`)

**Hiển thị:**

- Tên bài thi bằng tiếng Việt
- Mô tả chi tiết
- 4 thẻ thông tin:
  - Thời gian: 90 phút
  - Số câu hỏi: 10
  - Tổng điểm: 50
  - Môn học: Toán Học
- Hộp hướng dẫn màu xanh:
  - Bạn có 90 phút để hoàn thành bài thi này
  - Bài thi gồm 10 câu hỏi tổng 50 điểm
  - Bạn có thể di chuyển giữa các câu hỏi...
  - Câu trả lời của bạn sẽ được tự động lưu mỗi 30 giây
  - Bạn có thể đánh dấu các câu hỏi để xem lại sau
  - Nhấn "Nộp bài" khi bạn hoàn tất
  - Sau khi nộp, bạn không thể thay đổi câu trả lời
- Nút "Bắt đầu làm bài" (màu teal)

### 2. Trang Làm Bài Thi (`/exam/[examId]/take`)

**Header:**

- Tên bài thi
- "Câu X/Y" (thay vì "Question X of Y")
- Timer đếm ngược với màu sắc cảnh báo:
  - Xanh lá (teal): > 30 phút
  - Cam: 10-30 phút
  - Đỏ: < 10 phút
- Nút "Nộp bài" (thay vì "Submit Exam")
  - Khi đang nộp: "Đang nộp bài..."

**Phần Hiển Thị Câu Hỏi (2/3 width):**

- "Câu X" (thay vì "Question X")
- Badge độ khó: "Dễ", "Trung bình", "Khó"
- "X điểm" (thay vì "X points")
- Nội dung câu hỏi bằng tiếng Việt
- Nút cờ 🚩 để đánh dấu
- 4 loại input:
  - **Multiple Choice**: Radio buttons với đáp án tiếng Việt
  - **Essay**: Textarea với:
    - Placeholder: "Nhập câu trả lời của bạn tại đây..."
    - Đếm: "X từ (tối thiểu: 50)"
    - "X ký tự"
    - Cảnh báo: "⚠️ Bạn đã vượt quá giới hạn X từ"
  - **Short Answer**: Input với placeholder "Nhập câu trả lời..."
  - **True/False**: "Đúng" / "Sai"
- Navigation buttons:
  - "← Câu trước"
  - "Câu tiếp →"

**Phần Danh Sách Câu Hỏi (1/3 width):**

- Tiêu đề: "Danh sách câu hỏi"
- Grid 5 cột với số câu
- Màu sắc trạng thái:
  - **Xanh lam** (blue-500): Câu hiện tại
  - **Xanh lá** (teal-500): Đã trả lời
  - **Xám** (gray-200): Chưa trả lời
  - **Vàng** (yellow-400): Đánh dấu
- Legend:
  - "Đã trả lời"
  - "Chưa trả lời"
  - "Câu hiện tại"
  - "Đánh dấu"

**Auto-save Indicator:**

- "💾 Đang lưu..." (saving)
- "✓ Đã lưu" (saved)

### 3. Hộp Thoại Xác Nhận Nộp Bài

**Title**: "Nộp bài thi?"

**Message**: "Bạn có chắc chắn muốn nộp bài? Bạn đã trả lời X/Y câu hỏi. Sau khi nộp, bạn không thể thay đổi câu trả lời."

**Buttons**:

- "Xem lại" (Cancel)
- "Nộp bài" (Confirm)

---

## 🧪 Test Scenarios

### Scenario 1: Xem Thông Tin Bài Thi

1. Truy cập: `http://localhost:3000/exam/exam-001`
2. **Kiểm tra**:
   - ✓ Tên bài thi: "Kiểm Tra Giữa Kỳ - Toán Cao Cấp"
   - ✓ Mô tả tiếng Việt
   - ✓ Thẻ "Thời gian": 90 phút
   - ✓ Thẻ "Số câu hỏi": 10
   - ✓ Thẻ "Tổng điểm": 50
   - ✓ Thẻ "Môn học": Toán Học
   - ✓ Hướng dẫn bằng tiếng Việt
   - ✓ Nút "Bắt đầu làm bài"

### Scenario 2: Làm Bài Thi

1. Click "Bắt đầu làm bài"
2. **Kiểm tra**:
   - ✓ Header hiển thị "Câu 1/10"
   - ✓ Timer đếm ngược từ 90:00
   - ✓ Câu hỏi đầu tiên hiển thị bằng tiếng Việt
   - ✓ Badge độ khó: "Dễ"
   - ✓ "5 điểm"

### Scenario 3: Trả Lời Câu Hỏi Trắc Nghiệm

1. Chọn đáp án "2x"
2. **Kiểm tra**:
   - ✓ Radio button được chọn
   - ✓ Ô số 1 trong grid chuyển sang màu xanh lá (đã trả lời)
   - ✓ Thông báo "Đang lưu..." xuất hiện
   - ✓ Sau vài giây: "Đã lưu"

### Scenario 4: Điều Hướng Giữa Các Câu

1. Click "Câu tiếp →"
2. **Kiểm tra**:
   - ✓ Header cập nhật: "Câu 2/10"
   - ✓ Câu hỏi mới hiển thị
   - ✓ Ô số 2 trong grid màu xanh lam (hiện tại)
   - ✓ Ô số 1 vẫn màu xanh lá (đã trả lời)
3. Click trực tiếp vào ô số 5 trong grid
4. **Kiểm tra**:
   - ✓ Chuyển đến câu 5
   - ✓ Hiển thị câu Essay với placeholder tiếng Việt

### Scenario 5: Trả Lời Câu Tự Luận

1. Ở câu 5 (Essay), nhập văn bản
2. **Kiểm tra**:
   - ✓ Textarea placeholder: "Nhập câu trả lời của bạn tại đây..."
   - ✓ Đếm từ: "X từ (tối thiểu: 50)"
   - ✓ Đếm ký tự: "X ký tự"
   - ✓ Màu chữ thay đổi khi đạt/vượt minimum
   - ✓ Cảnh báo nếu vượt maximum

### Scenario 6: Đánh Dấu Câu Hỏi

1. Click vào nút cờ 🚩
2. **Kiểm tra**:
   - ✓ Nút chuyển sang màu vàng
   - ✓ Ô câu hỏi trong grid chuyển sang màu vàng
   - ✓ Tooltip hiển thị "Đã đánh dấu"

### Scenario 7: Nộp Bài

1. Click nút "Nộp bài"
2. **Kiểm tra**:
   - ✓ Dialog hiển thị: "Nộp bài thi?"
   - ✓ Message: "Bạn có chắc chắn muốn nộp bài? Bạn đã trả lời X/10 câu hỏi..."
   - ✓ Nút "Xem lại"
   - ✓ Nút "Nộp bài"
3. Click "Nộp bài"
4. **Kiểm tra**:
   - ✓ Nút thay đổi: "Đang nộp bài..."
   - ✓ Console log hiển thị dữ liệu nộp bài

### Scenario 8: Timer Warnings

1. Trong ExamContext, tạm thời set `timeRemaining` xuống 500 giây (< 10 phút)
2. **Kiểm tra**:
   - ✓ Timer chuyển sang màu đỏ
   - ✓ Background màu đỏ nhạt
3. Set lên 1000 giây (10-30 phút)
4. **Kiểm tra**:
   - ✓ Timer chuyển sang màu cam

---

## 🎨 Màu Sắc & UI Design

### Color Palette:

- **Primary (Teal)**: `teal-500`, `teal-600` - Nút chính, đã trả lời
- **Blue**: `blue-500`, `blue-600` - Câu hiện tại, thông tin
- **Yellow**: `yellow-400`, `yellow-500` - Đánh dấu, cảnh báo
- **Green**: `green-500`, `green-600` - Đáp án đúng, thành công
- **Red**: `red-500`, `red-600` - Đáp án sai, nguy hiểm
- **Orange**: `orange-600` - Cảnh báo thời gian
- **Gray**: `gray-200`, `gray-600` - Chưa trả lời, text phụ

### Typography:

- **Tiêu đề bài thi**: `text-3xl font-bold`
- **Tiêu đề câu hỏi**: `text-lg font-medium`
- **Label**: `text-sm font-semibold`
- **Body text**: `text-base`

### Spacing:

- **Container padding**: `p-6`, `p-8`
- **Gap giữa elements**: `gap-4`, `gap-6`
- **Margin bottom**: `mb-4`, `mb-6`

---

## 🐛 Troubleshooting

### Vấn đề 1: Không thấy bài thi

**Lỗi**: Trang hiển thị trống

**Giải pháp**:

- Kiểm tra console có lỗi không
- Verify mock data đang được import đúng
- Check route `/exam/[examId]` có tồn tại

### Vấn đề 2: Timer không đếm ngược

**Lỗi**: Thời gian không thay đổi

**Giải pháp**:

- Check ExamContext đã được wrap đúng chưa
- Verify `useEffect` với interval đang chạy
- Console.log `timeRemaining` để debug

### Vấn đề 3: Auto-save không hoạt động

**Lỗi**: Không thấy "Đang lưu..." / "Đã lưu"

**Giải pháp**:

- Check interval 30 giây trong ExamContext
- Verify `autoSave()` function đang được gọi
- Kiểm tra `autoSaveStatus` state

### Vấn đề 4: Tiếng Việt không hiển thị

**Lỗi**: Font bị lỗi hoặc hiển thị ???

**Giải pháp**:

- Đảm bảo file UTF-8 encoding
- Check font-family có support tiếng Việt
- Verify không có character encoding issues

---

## 📝 Next Steps

### Phase 2: Review & Results Pages (Chưa thực hiện)

- [ ] Trang xem lại bài làm
- [ ] Hiển thị đáp án đúng
- [ ] So sánh với câu trả lời của học sinh
- [ ] Tính điểm và hiển thị kết quả
- [ ] Phân tích điểm theo từng câu

### Phase 3: Advanced Features (Chưa thực hiện)

- [ ] Resume exam nếu chưa hoàn thành
- [ ] Keyboard shortcuts (mũi tên, phím tắt)
- [ ] Anti-cheating: phát hiện chuyển tab
- [ ] Full-screen mode
- [ ] Multiple attempts tracking

### Phase 4: API Integration (Chưa thực hiện)

- [ ] Thay mock data bằng API calls thật
- [ ] Implement exam.service.ts
- [ ] Implement submission.service.ts
- [ ] Error handling và loading states
- [ ] Kết nối backend MongoDB

---

## 🎉 Tóm Tắt

**Đã hoàn thành 100% Phase 1** với:

✅ **Tiếng Việt hoàn toàn** - Tất cả text, labels, messages, placeholders
✅ **UI đầy đủ** - Header, Timer, Navigation, Question Display
✅ **4 loại câu hỏi** - Multiple Choice, Essay, Short Answer, True/False
✅ **Tính năng đầy đủ** - Auto-save, Flag, Submit, Timer warnings
✅ **Mock data** - 10 câu Toán Học chất lượng cao

**Hãy thử ngay**: `npm run dev` → `http://localhost:3000/exam/exam-001`

---

**Chúc bạn test thành công! 🚀**

_Last updated: December 11, 2025_
