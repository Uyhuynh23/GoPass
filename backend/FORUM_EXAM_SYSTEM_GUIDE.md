# HỆ THỐNG TẠO NỘI DUNG FORUM VÀ ĐỀ THI TỰ ĐỘNG

## Tổng Quan

Hệ thống này tích hợp VnSmartBot AI để tự động tạo nội dung forum học tập và đề thi nghị luận từ các bài viết VnSocial. Hệ thống tuân thủ đầy đủ các yêu cầu trong file `api_vnpt.md`.

## Luồng Hoạt Động

```
VnSocial Article
    ↓
VnSmartBot AI (với prompt chuyên nghiệp)
    ↓
Forum Topics (nhiều topics/article) + Essay Prompts
    ↓
Exam Generation (đề thi từ essay prompts)
```

## 1. Tạo Forum Topics từ Bài Viết

### API Endpoint

```
POST /api/forum/generate-topics
```

### Request Body

```json
{
  "topicId": "string", // VnSocial topic ID
  "count": 3, // Số lượng forum topics cần tạo
  "source": "baochi", // Nguồn: baochi, facebook, youtube
  "startTime": "2025-01-01", // (optional)
  "endTime": "2025-01-31" // (optional)
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "forum_topic_id",
      "title": "Tiêu đề forum topic ngắn gọn (max 20 từ)",
      "summary": "Tóm tắt nội dung 150-300 từ, chia 2-3 đoạn",
      "debateQuestion": "Nhận định hoặc vấn đề để thảo luận",
      "essayPrompt": "[Nhận định]. Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên.",
      "seedComment": "Comment mồi để khởi động thảo luận (max 80 từ)",
      "sourceArticle": {
        "articleId": "article_id",
        "title": "Tiêu đề bài viết gốc",
        "url": "https://..."
      },
      "tags": ["tag1", "tag2"],
      "stats": {
        "totalComments": 0,
        "totalLikes": 0,
        "totalViews": 0
      },
      "createdAt": "2025-12-19T..."
    }
  ]
}
```

### Đặc Điểm Quan Trọng

1. **Mỗi bài viết tạo 3 forum topics** (configurable)
2. **Mỗi topic có đầy đủ**:
   - Tiêu đề ngắn gọn (max 20 từ)
   - Tóm tắt (150-300 từ, 2-3 đoạn)
   - Đề bài nghị luận (format chuẩn THPT)
   - AI seed comment (comment mồi)
3. **Format đề bài nghị luận chuẩn**:
   ```
   [Nhận định/vấn đề]. Từ góc nhìn của người trẻ, anh/chị hãy viết
   bài văn nghị luận (khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên.
   ```

## 2. System Prompt cho VnSmartBot

File: `backend/src/config/prompts.js`

### FORUM_CONTENT_GENERATION_PROMPT

Prompt được thiết kế chi tiết theo yêu cầu trong `api_vnpt.md`:

- **Tiêu đề mới**: Thu hút, gợi mở, 10-20 từ
- **Tóm tắt**: 150-300 từ, chia 2-3 đoạn, văn phong trung lập
- **Forum Topics**: Mỗi topic max 20 từ, là nhận định/vấn đề
- **Seed Comment**: Max 80 từ, gợi hướng suy nghĩ
- **Essay Prompt**: Format chuẩn THPT, dùng "anh/chị", 600 chữ

### Output Format (JSON)

```json
{
  "newTitle": "Tiêu đề thu hút (10-20 từ)",
  "summary": "Tóm tắt 2-3 đoạn\\n\\nNgăn cách bởi newline",
  "topics": [
    {
      "topicTitle": "Nhận định ngắn gọn (max 20 từ)",
      "seedComment": "Comment mồi (max 80 từ)",
      "essayPrompt": "[Nhận định]. Từ góc nhìn của người trẻ..."
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}
```

## 3. Tạo Đề Thi từ Forum Topics

### 3.1. Tạo Đề Thi từ 1 Forum Topic

```
POST /api/exams/generate-from-topic/:topicId
```

**Request Body:**

```json
{
  "title": "Đề thi thử - Tên đề thi",
  "durationMinutes": 45
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "exam": {
      "_id": "exam_id",
      "title": "Đề thi thử - ...",
      "subject": "Ngữ Văn",
      "durationMinutes": 45,
      "totalQuestions": 1,
      "totalPoints": 5
    },
    "questions": [
      {
        "questionId": {
          "type": "essay",
          "content": "[Essay prompt từ forum topic]",
          "explanation": "<p>HTML hướng dẫn giải chi tiết</p>"
        },
        "order": 1,
        "maxScore": 5,
        "section": "Viết"
      }
    ],
    "relatedTopic": {
      "topicId": "forum_topic_id",
      "topicTitle": "Tiêu đề forum topic"
    }
  }
}
```

### 3.2. Tạo Đề Thi từ Essay Prompt Trực Tiếp

```
POST /api/exams/generate-from-prompt
```

**Request Body:**

```json
{
  "essayPrompt": "Câu hỏi nghị luận...",
  "title": "Đề thi thử",
  "durationMinutes": 45,
  "generateExplanation": true
}
```

### 3.3. Tạo Đề Thi từ Nhiều Forum Topics

```
POST /api/exams/generate-from-multiple-topics
```

**Request Body:**

```json
{
  "topicIds": ["topic_id_1", "topic_id_2", "topic_id_3"],
  "title": "Đề thi thử tổng hợp",
  "durationMinutes": 120,
  "generateExplanations": true
}
```

**Response:** Đề thi với nhiều câu hỏi essay, mỗi câu từ 1 topic

## 4. AI-Generated Explanation

Khi tạo đề thi, hệ thống tự động gọi VnSmartBot để tạo **hướng dẫn giải** chi tiết cho câu hỏi essay.

### Prompt: ESSAY_EXPLANATION_GENERATION_PROMPT

**Output Format (HTML):**

```html
<p><b>Phương pháp:</b></p>
<p>Vận dụng kiến thức đã học về viết bài văn nghị luận.</p>
<p>Lựa chọn được các thao tác lập luận phù hợp...</p>
<p><b>Cách giải:</b> Có thể triển khai theo hướng:</p>
<ol>
  <li><b>Mở bài:</b> Xác định đúng vấn đề nghị luận...</li>
  <li>
    <b>Thân bài:</b>
    <ul>
      <li><b>Giải thích:</b> Các khái niệm...</li>
      <li><b>Khía cạnh 1:</b> Phân tích...</li>
      <li><b>Mở rộng</b> vấn đề...</li>
    </ul>
  </li>
  <li><b>Kết bài:</b> Khái quát vấn đề nghị luận.</li>
</ol>
```

## 5. Database Schema Changes

### ForumTopic Model

**Thêm field:**

```javascript
essayPrompt: {
  type: String,
  required: true,
}
```

**Full Schema:**

- `title`: Tiêu đề forum topic
- `summary`: Tóm tắt nội dung
- `debateQuestion`: Câu hỏi tranh luận
- `essayPrompt`: Đề bài nghị luận ⭐ NEW
- `seedComment`: AI seed comment
- `sourceArticle`: Bài viết gốc từ VnSocial
- `tags`: Tags phân loại
- `stats`: Thống kê (comments, likes, views)

## 6. Services Architecture

### ForumService

**Methods:**

- `generateForumTopics(params, adminUserId)`: Tạo forum topics từ VnSocial articles
- `_generateForumContentWithAI(article, numberOfTopics)`: Gọi VnSmartBot để sinh nội dung

**Key Features:**

- Hỗ trợ cả format mới (JSON) và format cũ (text) để backward compatible
- Tự động parse và clean response từ AI
- Tạo nhiều forum topics từ 1 article
- Tự động tạo AI seed comment cho mỗi topic

### ExamService

**Methods:**

- `generateExamFromForumTopic(topicId, userId, options)`: Tạo đề từ 1 topic
- `generateExamFromEssayPrompt(prompt, userId, options)`: Tạo đề từ essay prompt
- `generateExamFromMultipleTopics(topicIds, userId, options)`: Tạo đề từ nhiều topics
- `_generateEssayExplanation(essayPrompt)`: Tạo hướng dẫn giải bằng AI

## 7. Example Usage Flow

### Bước 1: Admin tạo forum topics từ hot articles

```javascript
POST /api/forum/generate-topics
{
  "topicId": "vnpt_education_policy",
  "count": 3,
  "source": "baochi"
}
```

→ Tạo ra 3 forum topics, mỗi topic có essay prompt

### Bước 2: Học sinh thảo luận trong forum

- Đọc tóm tắt nội dung
- Đọc nhận định/vấn đề
- Đọc AI seed comment
- Tham gia thảo luận

### Bước 3: Giáo viên tạo đề thi từ topics

```javascript
POST /api/exams/generate-from-topic/[topic_id]
{
  "title": "Đề thi thử tuần 1",
  "durationMinutes": 45
}
```

→ Tạo đề thi với:

- 1 câu hỏi essay (từ essayPrompt của topic)
- Hướng dẫn giải chi tiết (AI-generated)
- Thời gian: 45 phút
- Người tạo: currentUser

### Bước 4: Học sinh làm bài thi

- Đọc đề bài nghị luận
- Viết bài văn 600 chữ
- Nộp bài
- Xem hướng dẫn giải sau khi nộp

## 8. Key Points

✅ **Tuân thủ 100% yêu cầu từ api_vnpt.md**

- Tiêu đề: 10-20 từ
- Tóm tắt: 150-300 từ, 2-3 đoạn
- Topic: Max 20 từ
- Seed comment: Max 80 từ
- Essay prompt: Format chuẩn THPT với "anh/chị"

✅ **Mỗi bài viết → 3 forum topics**

- Mỗi topic có đầy đủ thông tin
- Mỗi topic có essay prompt riêng
- Có thể tạo đề thi từ mỗi topic

✅ **AI-Powered**

- VnSmartBot tạo nội dung forum
- VnSmartBot tạo hướng dẫn giải
- Format output chính xác (JSON/HTML)

✅ **Flexible Exam Generation**

- 1 topic → 1 đề thi
- N topics → 1 đề thi nhiều câu
- Direct essay prompt → đề thi

## 9. Configuration

### Environment Variables

```env
VNSMARTBOT_API_URL=https://assistant-stream.vnpt.vn/v1/conversation
VNSMARTBOT_AUTHORIZATION=Bearer xxx
VNSMARTBOT_TOKEN_ID=xxx
VNSMARTBOT_TOKEN_KEY=xxx
VNSMARTBOT_BOT_ID=xxx
```

### Default Settings

```javascript
// ForumService
const topicsPerArticle = 3; // Mỗi article tạo 3 topics

// ExamService
const defaultDuration = 45; // 45 phút cho đề 1 câu
const defaultDurationMultiple = 120; // 120 phút cho đề nhiều câu
const pointsPerEssay = 5; // 5 điểm/câu essay
```

## 10. Error Handling

Hệ thống xử lý các lỗi sau:

1. **VnSmartBot API Error**: Retry với exponential backoff
2. **JSON Parse Error**: Fallback to old format parsing
3. **Invalid Topic**: Báo lỗi rõ ràng
4. **Missing Essay Prompt**: Không thể tạo đề thi

## 11. Testing

### Test Forum Generation

```bash
curl -X POST http://localhost:5000/api/forum/generate-topics \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "test_topic",
    "count": 3
  }'
```

### Test Exam Generation

```bash
curl -X POST http://localhost:5000/api/exams/generate-from-topic/[topic_id] \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Đề thi thử",
    "durationMinutes": 45
  }'
```

## 12. Future Enhancements

1. **Batch Processing**: Tạo nhiều forum topics trong 1 batch
2. **Scheduling**: Tự động tạo forum topics định kỳ
3. **Quality Control**: Đánh giá chất lượng nội dung AI tạo ra
4. **Analytics**: Thống kê hiệu quả sử dụng forum và đề thi
5. **Customization**: Cho phép teacher chỉnh sửa essay prompt trước khi tạo đề

## 13. Support

Để được hỗ trợ hoặc báo lỗi, vui lòng tạo issue trên GitHub repository.
