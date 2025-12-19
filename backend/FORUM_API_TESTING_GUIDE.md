# Forum API Testing Guide

## Overview

Hướng dẫn test các API endpoints của Forum System tích hợp với VnSocial và VnSmartBot.

## Prerequisites

1. Backend server đang chạy trên port 5001
2. Đã có account admin (admin@gopass.com / 123456)
3. Đã cấu hình VNSOCIAL_TOKEN và VNSMARTBOT_TOKEN trong .env

## Flow Test Tổng Thể

### STEP 1: Login để lấy Access Token

```bash
# Login với admin account
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gopass.com",
    "password": "123456"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "user": {
      "_id": "...",
      "name": "Admin",
      "email": "admin@gopass.com",
      "role": "admin"
    }
  }
}
```

**🔑 Lưu lại `accessToken` để sử dụng cho các requests tiếp theo**

---

### STEP 2: Sync Topics từ VnSocial vào Database

```bash
# Sync topics (keyword/project topics)
curl -X POST http://localhost:5001/api/vnsocial/topics/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "type": "keyword"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Synced 5 topics to database",
  "data": {
    "synced": 5,
    "upserted": 3,
    "modified": 2,
    "message": "Successfully synced 5 topics"
  }
}
```

---

### STEP 3: Lấy danh sách Topics (để chọn topic ID)

```bash
# Get topics
curl -X GET http://localhost:5001/api/vnsocial/topics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Lấy danh sách chủ đề thành công",
  "data": {
    "topics": [
      {
        "id": "topic_id_1",
        "name": "AI",
        "description": "..."
      },
      {
        "id": "topic_id_2",
        "name": "Giáo dục",
        "description": "..."
      }
    ],
    "total": 2
  }
}
```

**📝 Lưu lại một `topic_id` để dùng cho STEP 4**

---

### STEP 4: Generate Forum Topics từ Hot Articles

```bash
# Calculate time range (last 7 days in milliseconds)
# PowerShell:
$endTime = [int64](([DateTime]::Now - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)
$startTime = [int64](([DateTime]::Now.AddDays(-7) - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)

# Generate forum topics
curl -X POST http://localhost:5001/api/forum/topics/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{
    \"topicId\": \"YOUR_TOPIC_ID\",
    \"count\": 3,
    \"source\": \"baochi\",
    \"startTime\": $startTime,
    \"endTime\": $endTime
  }"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Generated 3 forum topics",
  "data": {
    "topics": [
      {
        "_id": "forum_topic_id_1",
        "title": "AI có thể thay thế giáo viên trong tương lai?",
        "summary": "Với sự phát triển của trí tuệ nhân tạo...",
        "debateQuestion": "Liệu AI có thể hoàn toàn thay thế vai trò của giáo viên?",
        "seedComment": "Theo quan điểm của tôi, AI chỉ nên là công cụ hỗ trợ...",
        "sourceArticle": {
          "title": "AI trong giáo dục",
          "url": "https://..."
        },
        "stats": {
          "totalComments": 1,
          "totalLikes": 0,
          "totalViews": 0
        },
        "createdAt": "2025-12-19T..."
      }
    ],
    "total": 3
  }
}
```

**⚠️ Chú ý:**

- API này có thể mất 20-30 giây vì phải gọi VnSocial + SmartBot AI
- Nếu bài báo đã được sử dụng trong 24h gần đây, API sẽ tự động chọn bài khác
- Nếu không còn bài nào, sẽ trả về error: "All recent articles have been used"

---

### STEP 5: Lấy danh sách Forum Topics

```bash
# Get all forum topics
curl -X GET "http://localhost:5001/api/forum/topics?status=published&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "topics": [...],
    "total": 3,
    "page": 1,
    "totalPages": 1
  }
}
```

---

### STEP 6: Lấy chi tiết Forum Topic với Comments

```bash
# Get forum topic detail
curl -X GET http://localhost:5001/api/forum/topics/FORUM_TOPIC_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "topic": {
      "_id": "...",
      "title": "...",
      "summary": "...",
      "debateQuestion": "...",
      "seedComment": "...",
      "stats": {
        "totalComments": 1,
        "totalLikes": 0,
        "totalViews": 1
      }
    },
    "comments": [
      {
        "_id": "...",
        "content": "Comment mồi từ AI...",
        "isAiGenerated": true,
        "userId": {...},
        "createdAt": "..."
      }
    ],
    "commentsTotal": 1
  }
}
```

---

### STEP 7: Tạo Comment cho Forum Topic

```bash
# Create comment
curl -X POST http://localhost:5001/api/forum/topics/FORUM_TOPIC_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content": "Tôi đồng ý với quan điểm này. AI chỉ nên là công cụ hỗ trợ, không thể thay thế hoàn toàn giáo viên."
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "_id": "...",
    "topicId": "...",
    "userId": "...",
    "content": "Tôi đồng ý với quan điểm này...",
    "isAiGenerated": false,
    "status": "active",
    "createdAt": "..."
  }
}
```

---

### STEP 8: Tạo Reply cho Comment

```bash
# Create reply
curl -X POST http://localhost:5001/api/forum/comments/COMMENT_ID/replies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content": "Tôi cũng có suy nghĩ tương tự. Nhưng trong một số trường hợp..."
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Reply created successfully",
  "data": {
    "_id": "...",
    "topicId": "...",
    "userId": "...",
    "content": "...",
    "parentCommentId": "COMMENT_ID",
    "createdAt": "..."
  }
}
```

---

### STEP 9: Like Forum Topic

```bash
# Like topic
curl -X POST http://localhost:5001/api/forum/topics/FORUM_TOPIC_ID/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Topic liked successfully",
  "data": {
    "success": true
  }
}
```

---

### STEP 10: Unlike Forum Topic

```bash
# Unlike topic
curl -X DELETE http://localhost:5001/api/forum/topics/FORUM_TOPIC_ID/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Topic unliked successfully",
  "data": {
    "success": true
  }
}
```

---

## Test Scenarios

### Scenario 1: Happy Path - Admin tạo Forum Topics thành công

1. Login admin → lấy token
2. Sync topics từ VnSocial
3. Lấy danh sách topics → chọn 1 topic_id
4. Generate 3 forum topics với topic_id đó
5. Kiểm tra: 3 forum topics được tạo thành công
6. Mỗi forum topic có 1 AI seed comment

**Expected:** Tất cả API trả về success = true

---

### Scenario 2: Article Reuse Prevention

1. Generate forum topics với topic_id = "AI"
2. Ngay lập tức generate lại với cùng topic_id = "AI"

**Expected:**

- Lần 1: Success, tạo 3 forum topics từ 3 articles khác nhau
- Lần 2: Success, tạo 3 forum topics từ 3 articles MỚI (không trùng lần 1)

---

### Scenario 3: No More Articles

1. Generate forum topics nhiều lần với cùng 1 topic_id
2. Đến lần thứ N, tất cả articles trong 24h gần đây đã được sử dụng

**Expected:**

```json
{
  "success": false,
  "message": "All recent articles have been used. Please try again later or use a different topic."
}
```

---

### Scenario 4: Non-Admin User không thể Generate

1. Login với student account (không phải admin)
2. Gọi POST /api/forum/topics/generate

**Expected:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

---

### Scenario 5: User tạo Comment và Reply

1. Login với student account
2. Lấy danh sách forum topics
3. Tạo comment cho 1 topic
4. Tạo reply cho comment vừa tạo

**Expected:** Tất cả thành công, user có thể tạo comment/reply

---

## Error Cases

### 1. Topic không tồn tại

```bash
curl -X POST http://localhost:5001/api/forum/topics/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "topicId": "invalid_topic_id",
    "count": 3
  }'
```

**Expected Error:**

```json
{
  "success": false,
  "message": "Topic invalid_topic_id not found"
}
```

---

### 2. VnSocial không có hot posts

```bash
# Dùng time range quá xa trong quá khứ
curl -X POST http://localhost:5001/api/forum/topics/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "topicId": "valid_topic_id",
    "startTime": 1000000000000,
    "endTime": 1000086400000
  }'
```

**Expected Error:**

```json
{
  "success": false,
  "message": "No hot posts found for this topic"
}
```

---

### 3. SmartBot API lỗi

**Expected Error:**

```json
{
  "success": false,
  "message": "Failed to generate any forum topics"
}
```

---

## Environment Variables Required

```env
# VnSocial API
VNSOCIAL_TOKEN=your_vnsocial_token
VNSOCIAL_BASE_URL=https://api-vnsocialplus.vnpt.vn

# VnSmartBot API
VNSMARTBOT_TOKEN=your_smartbot_token
VNSMARTBOT_BASE_URL=https://assistant-stream.vnpt.vn

# JWT Secret
JWT_SECRET=your_jwt_secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gopass
```

---

## Troubleshooting

### 1. "Authentication failed"

- Kiểm tra access token có hợp lệ không
- Token có bị expire không (thường expire sau 24h)

### 2. "No topics found"

- Chạy POST /api/vnsocial/topics/sync trước
- Kiểm tra VNSOCIAL_TOKEN có đúng không

### 3. "SmartBot response missing required sections"

- SmartBot AI có thể trả về format không đúng
- Kiểm tra VNSMARTBOT_TOKEN có đúng không
- Thử lại với bài báo khác

### 4. "All recent articles have been used"

- Đợi 24h hoặc dùng topic khác
- Hoặc xóa collection UsedArticle trong MongoDB để reset

---

## Notes

- **TTL Index:** Collection `UsedArticle` có TTL index 24h, MongoDB tự động xóa sau 24h
- **Cache:** Collection `VnsocialTopic` và `VnsocialArticle` cache data từ API, giảm số lượng API calls
- **AI Generation:** Mỗi forum topic tốn ~5-10 giây để AI generate content
- **Concurrent Requests:** Không nên gọi generate đồng thời nhiều lần, dễ bị duplicate articles

---

## PowerShell Helper Script

```powershell
# Set base URL
$baseUrl = "http://localhost:5001/api"

# 1. Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
  email = "admin@gopass.com"
  password = "123456"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.accessToken
$headers = @{ Authorization = "Bearer $token" }

# 2. Sync topics
Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics/sync" -Method Post -Headers $headers -Body (@{ type = "keyword" } | ConvertTo-Json) -ContentType "application/json"

# 3. Get topics
$topics = Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics" -Method Get -Headers $headers
$topicId = $topics.data.topics[0].id

# 4. Calculate time range
$endTime = [int64](([DateTime]::Now - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)
$startTime = [int64](([DateTime]::Now.AddDays(-7) - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)

# 5. Generate forum topics
$result = Invoke-RestMethod -Uri "$baseUrl/forum/topics/generate" -Method Post -Headers $headers -Body (@{
  topicId = $topicId
  count = 3
  source = "baochi"
  startTime = $startTime
  endTime = $endTime
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Generated $($result.data.total) forum topics!"
$result.data.topics | ForEach-Object {
  Write-Host "  - $($_.title)"
}
```

---

## Summary

✅ **Đã implement:**

- 5 Models (ForumTopic, ForumComment, VnsocialTopic, VnsocialArticle, UsedArticle)
- 5 Repositories
- ForumService (orchestrate VnSocial → SmartBot → Forum)
- ForumController + Routes (7 endpoints)
- VnSocialService.syncTopicsToDatabase()
- TTL index cho UsedArticle (24h)

✅ **Flow hoàn chỉnh:**

1. Admin sync topics từ VnSocial → DB
2. Admin chọn topic → generate forum topics
3. Backend gọi VnSocial → lấy hot articles
4. Backend filter articles đã dùng gần đây
5. Backend gọi SmartBot → AI generate nội dung forum
6. Backend tạo forum topic + AI seed comment
7. Backend đánh dấu article đã sử dụng (TTL 24h)
8. Users có thể xem, comment, reply, like forum topics
