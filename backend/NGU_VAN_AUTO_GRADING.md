# Ngữ Văn Auto-Grading Pipeline (ExamAnswers-based)

## 1. Mục tiêu

Xây dựng pipeline chấm tự động **môn Ngữ Văn** dựa trên dữ liệu thực tế trong `examanswers`, với các yêu cầu bắt buộc:

- Lấy **`questions.explanation`** làm đáp án / định hướng chấm
- Lấy **`examanswers.answerText`** làm bài làm của học sinh
- Lấy **`examanswers.maxScore`** làm điểm tối đa cho từng câu
- Chatbot chấm điểm theo thang rời rạc và **không vượt `maxScore`**
- Trả kết quả dưới dạng **JSON hợp lệ** để lưu ngược lại DB

---

## 2. Dữ liệu đầu vào

### 2.1 Collection `examanswers`

```json
{
  "_id": "ObjectId",
  "submissionId": "ObjectId",
  "questionId": "ObjectId",
  "answerText": "",
  "maxScore": 0.5,
  "score": 0,
  "isAutoGraded": false,
  "isManuallyGraded": false,
  "feedback": "Pending manual grading"
}
```

### 2.2 Collection `questions`

```json
{
  "_id": "ObjectId",
  "subject": "Ngữ Văn",
  "explanation": "Giải thích / đáp án tham khảo ..."
}
```

---

## 3. Điều kiện lọc dữ liệu

- `questions.subject === "Ngữ Văn"`
- Join: `examanswers.questionId = questions._id`

---

## 4. Payload gửi lên Chatbot

```json
{
  "metadata": {
    "submissionId": "submission-xxx",
    "subject": "Ngữ Văn"
  },
  "items": [
    {
      "examAnswerId": "ea-001",
      "questionId": "q-001",
      "maxScore": 0.5,
      "explanation": "...",
      "answerText": "..."
    }
  ]
}
```

---

## 5. Quy tắc chấm điểm

### Thang điểm hợp lệ

0, 0.25, 0.5, 0.75, 1

### Công thức

finalScore = min(roundedScore, maxScore)

---

## 6. Output JSON từ Chatbot

```json
{
  "results": [
    {
      "examAnswerId": "ea-001",
      "questionId": "q-001",
      "roundedFrom": 0.75,
      "score": 0.5,
      "maxScore": 0.5,
      "comment": "...",
      "warnings": []
    }
  ]
}
```

---

## 7. Prompt dùng cho Chatbot

Bạn là giám khảo chấm bài **Ngữ Văn THPT Việt Nam**.  
Đọc explanation (giải thích / đáp án tham khảo) và answerText (bài làm của học sinh) dưới đây, sau đó chấm điểm theo các quy tắc sau:

- Nhận xét chi tiết về ưu điểm và nhược điểm của bài làm.
- Đưa ra ý nào thiếu sót so với explanation.
- Với những ý diễn đạt chưa trọn vẹn, thì bổ sung, làm rõ, và diễn đạt lại sao cho hay hơn.
- Đưa ra các lỗi về ngữ pháp, chính tả (nếu có).
- Đưa ra lời khuyên để cải thiện bài làm.
- Chỉ chấm theo explanation + answerText.
- Chỉ dùng thang điểm: 0, 0.25, 0.5, 0.75, 1.
- Điểm cuối = min(điểm_sơ_bộ, maxScore).
- Trả về JSON hợp lệ, không kèm văn bản khác.

---

## 8. Hậu xử lý

- `examanswers.score = score`
- `examanswers.isAutoGraded = true`
- `examanswers.feedback = comment`
