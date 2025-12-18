# Hướng dẫn sử dụng VnSocial API trên Postman

## 📋 Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Cài đặt ban đầu](#cài-đặt-ban-đầu)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Ví dụ Response](#ví-dụ-response)
6. [Error Codes](#error-codes)

---

## 🌟 Giới thiệu

VnSocial API cho phép bạn:
- Lấy danh sách các dự án/chủ đề theo dõi
- Tìm kiếm bài viết theo từ khóa trên các nền tảng mạng xã hội
- Tìm kiếm bài viết theo nguồn cụ thể
- Lấy từ khóa nổi bật (trending keywords)
- Lấy bài viết nổi bật (viral posts)
- Xem thống kê tổng quan

**Các nguồn được hỗ trợ:**
- `facebook` - Facebook
- `youtube` - YouTube
- `tiktok` - TikTok
- `forum` - Diễn đàn
- `baochi` - Báo chí Việt Nam

---

## ⚙️ Cài đặt ban đầu

### 1. Tạo Collection mới trong Postman
- Tên: `GoPass VnSocial API`
- Base URL: `http://localhost:5001/api/vnsocial`

### 2. Thiết lập Environment Variables
Tạo environment mới với các biến:

```
BASE_URL = http://localhost:5001
TOKEN = <your-jwt-token-here>
```

### 3. Cấu hình Headers cho toàn bộ Collection
- Vào Collection Settings → Headers
- Thêm header:
  - Key: `Authorization`
  - Value: `Bearer {{TOKEN}}`
  - Key: `Content-Type`
  - Value: `application/json`

---

## 🔐 Authentication

**Tất cả các endpoint VnSocial đều yêu cầu JWT token.**

### Cách lấy token:

#### 1. Login để lấy token
```
POST {{BASE_URL}}/api/auth/login
```

**Body (raw JSON):**
```json
{
  "email": "teacher1@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {...},
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "..."
    }
  }
}
```

#### 2. Copy accessToken và lưu vào Environment Variable `TOKEN`

---

## 📡 API Endpoints

### 1. Lấy danh sách chủ đề/dự án

**Endpoint:** `GET {{BASE_URL}}/api/vnsocial/topics`

**Query Parameters:**
- `type` (optional): 
  - `keyword` - Lấy dự án theo từ khóa (TOPIC_POLICY)
  - `source` - Lấy dự án theo nguồn (PERSONAL_POST)
  - Không truyền - Lấy tất cả

**Ví dụ request:**
```
GET {{BASE_URL}}/api/vnsocial/topics?type=keyword
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách chủ đề thành công",
  "data": {
    "topics": [
      {
        "id": "project-123",
        "name": "Giáo dục Việt Nam",
        "type": "TOPIC_POLICY",
        "keywords": ["giáo dục", "học sinh", "giáo viên"]
      }
    ],
    "total": 10
  }
}
```

---

### 2. Tìm bài viết theo từ khóa

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/posts/search-by-keyword`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "project_id": "69438bd945065e19984503e7",
  "source": "facebook",
  "start_time": 1733011200000,
  "end_time": 1734480000000,
  "from": 0,
  "size": 10,
  "senti": ["positive", "neutral"],
  "reactionary": false,
  "province": "Hà Nội",
  "time_type": "createDate"
}
```

**Tham số bắt buộc:**
- `project_id` (string): ID của dự án/chủ đề (lấy từ GET /topics)
- `source` (string): Nguồn dữ liệu (`facebook`, `youtube`, `tiktok`, `forum`, `baochi`)
- `start_time` (number): Thời gian bắt đầu (milliseconds timestamp)
- `end_time` (number): Thời gian kết thúc (milliseconds timestamp)

**Tham số tùy chọn:**
- `from` (number, default: 0): Số bản ghi bỏ qua (pagination offset)
- `size` (number, default: 10): Số bài viết trả về
- `senti` (array, default: ['negative','neutral','positive']): Sắc thái [`positive`, `neutral`, `negative`]
- `reactionary` (boolean, default: false): false = tin chính thống, true = tin trái chiều
- `province` (string): Tỉnh/thành phố
- `time_type` (string, default: 'createDate'): Loại thời gian ('createDate' hoặc 'updateDate')

**Response:**
```json
{
  "success": true,
  "message": "Tìm bài viết thành công",
  "data": {
    "posts": [
      {
        "userId": "user123",
        "docId": "post456",
        "userName": "Nguyễn Văn A",
        "sourceName": "Facebook",
        "postLink": "https://facebook.com/...",
        "pictures": ["url1", "url2"],
        "title": "Tiêu đề bài viết",
        "content": "Nội dung bài viết...",
        "senti": "positive",
        "numInteractions": 150,
        "numComments": 30,
        "numShares": 20,
        "province": "Hà Nội"
      }
    ],
    "total": 25
  }
}
```

---

### 3. Tìm bài viết theo nguồn

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/posts/search-by-source`

**⚠️ LƯU Ý QUAN TRỌNG:**
- `source_id` là ID của một **nguồn cụ thể** (fanpage Facebook, kênh YouTube, tài khoản TikTok...) mà bạn đã **theo dõi** trong VnSocial
- Để lấy `source_id`, gọi `GET /api/vnsocial/topics?type=source` hoặc tạo nguồn mới trên https://vnsocial.vnpt.vn tại mục **"Theo dõi nguồn"**

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "source_id": "69438bd945065e19984503e7",
  "start_time": 1733011200000,
  "end_time": 1734480000000,
  "from": 0,
  "size": 20,
  "senti": ["positive"],
  "time_type": "createDate"
}
```

**Tham số bắt buộc:**
- `source_id` (string): ID của nguồn cụ thể (lấy từ GET /topics?type=source)
- `start_time` (number): Thời gian bắt đầu (milliseconds timestamp)
- `end_time` (number): Thời gian kết thúc (milliseconds timestamp)

**Tham số tùy chọn:**
- `from` (number, default: 0): Số bản ghi bỏ qua
- `size` (number, default: 10): Số bài viết trả về
- `senti` (array): [`positive`, `neutral`, `negative`]
- `time_type` (string): 'createDate' hoặc 'updateDate'

**Cách lấy source_id:**
```
GET {{BASE_URL}}/api/vnsocial/topics?type=source
```

Response:
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "source-abc123",  // ← Đây là source_id
        "name": "Fanpage Giáo dục VN",
        "type": "PERSONAL_POST"
      }
    ]
  }
}
```

**Response:** Tương tự endpoint #2

---

### 4. Lấy từ khóa nổi bật

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/keywords/hot`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "project_id": "69438bd945065e19984503e7",
  "sources": ["facebook", "youtube", "baochi"],
  "start_time": 1733011200000,
  "end_time": 1734480000000
}
```

**Tham số bắt buộc:**
- `project_id` (string): ID dự án
- `start_time` (number): Thời gian bắt đầu (milliseconds timestamp)
- `end_time` (number): Thời gian kết thúc (milliseconds timestamp)

**Tham số tùy chọn:**
- `sources` (array): Danh sách nguồn (mặc định: tất cả)

**Response:**
```json
{
  "success": true,
  "message": "Lấy từ khóa nổi bật thành công",
  "data": {
    "keywords": [
      {
        "keyword": "giáo dục",
        "count": 1250,
        "sentiment": {
          "positive": 800,
          "neutral": 300,
          "negative": 150
        }
      },
      {
        "keyword": "học sinh",
        "count": 980,
        "sentiment": {
          "positive": 600,
          "neutral": 280,
          "negative": 100
        }
      }
    ],
    "total": 50
  }
}
```

---

### 5. Lấy bài viết nổi bật

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/posts/hot`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "project_id": "69438bd945065e19984503e7",
  "source": "facebook",
  "start_time": 1733011200000,
  "end_time": 1734480000000
}
```

**Tham số bắt buộc:**
- `project_id` (string): ID dự án
- `source` (string): Nguồn (`facebook`, `youtube`, `tiktok`, `forum`, `baochi`)
- `start_time` (number): Thời gian bắt đầu (milliseconds timestamp)
- `end_time` (number): Thời gian kết thúc (milliseconds timestamp)

**Response:**
```json
{
  "success": true,
  "message": "Lấy bài viết nổi bật thành công",
  "data": {
    "posts": [
      {
        "userId": "user123",
        "docId": "post999",
        "userName": "Page Giáo dục VN",
        "sourceName": "Facebook",
        "postLink": "https://facebook.com/...",
        "pictures": ["url1"],
        "title": "Bài viết viral",
        "content": "Nội dung...",
        "senti": "positive",
        "numInteractions": 5000,
        "numComments": 800,
        "numShares": 1200
      }
    ],
    "total": 10
  }
}
```

---

### 6. Lấy thống kê tổng quan

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/statistics`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json


```

**Tham số bắt buộc:**
- `project_id` (string): ID dự án
- `start_time` (number): Thời gian bắt đầu (milliseconds timestamp)
- `end_time` (number): Thời gian kết thúc (milliseconds timestamp)

**Tham số tùy chọn:**
- `sources` (array): Danh sách nguồn (mặc định: [`facebook`, `baochi`, `youtube`])

**Response:**
```json
{
  "success": true,
  "message": "Lấy thống kê thành công",
  "data": {
    "keywords": [
      {
        "keyword": "giáo dục",
        "count": 1250
      },
      {
        "keyword": "học sinh",
        "count": 980
      }
    ],
    "hotPosts": [
      {
        "userId": "user123",
        "userName": "Page Giáo dục VN",
        "content": "Bài viết viral...",
        "numInteractions": 5000
      }
    ],
    "period": {
      "start_time": 1733011200000,
      "end_time": 1734480000000
    }
  }
}
```

---

## 📊 Ví dụ Response

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Thiếu thông tin: projectId, source, startDate, endDate là bắt buộc"
}
```

```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

## ⚠️ Error Codes

| Status Code | Mô tả |
|------------|-------|
| 200 | Thành công |
| 400 | Request không hợp lệ (thiếu tham số bắt buộc) |
| 401 | Chưa xác thực hoặc token không hợp lệ |
| 403 | Không có quyền truy cập |
| 500 | Lỗi server nội bộ |

### Các lỗi thường gặp:

#### 1. Token không hợp lệ
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```
**Giải pháp:** Login lại để lấy token mới

#### 2. Thiếu tham số bắt buộc
```json
{
  "success": false,
  "message": "Thiếu thông tin: project_id, source, start_time, end_time là bắt buộc"
}
```
**Giải pháp:** Kiểm tra lại body request

#### 3. VnSocial API error
```json
{
  "success": false,
  "message": "Lỗi khi gọi VnSocial API: Token VnSocial đã hết hạn"
}
```
**Giải pháp:** Kiểm tra VNSOCIAL_USERNAME và VNSOCIAL_PASSWORD trong file .env

---

## 🔧 Tips & Best Practices

### 1. Sử dụng Environment Variables
Tạo các environment khác nhau:
- **Development**: `http://localhost:5001`
- **Production**: `https://api.gopass.com`

### 2. Lưu token vào Variables
Sau khi login, sử dụng Tests tab để tự động lưu token:
```javascript
var jsonData = pm.response.json();
pm.environment.set("TOKEN", jsonData.data.tokens.accessToken);
```

### 3. Date Format
Sử dụng **milliseconds timestamp** cho start_time và end_time:
- ✅ Đúng: `"start_time": 1734220800000`
- ❌ Sai: `"start_time": "2024-12-15"` hoặc `"start_time": "15/12/2024"`

**Công cụ chuyển đổi:**
```javascript
// JavaScript
const start_time = new Date('2024-12-15').getTime(); // 1734220800000
const end_time = new Date('2024-12-18').getTime();   // 1734480000000
```

### 4. Pagination
Sử dụng `from` và `size` để phân trang:
```json
{
  "from": 0,    // Bỏ qua 0 bản ghi (trang 1)
  "size": 50    // Lấy 50 bản ghi
}
```

```json
{
  "from": 50,   // Bỏ qua 50 bản ghi (trang 2)
  "size": 50    // Lấy 50 bản ghi tiếp theo
}
```

### 5. Filter Sentiment
Có thể filter nhiều sentiment cùng lúc:
```json
{
  "senti": ["positive", "neutral"]
}
```
Hoặc chỉ 1 sentiment:
```json
{
  "senti": ["negative"]
}
```

### 6. Time Range
Nên giới hạn khoảng thời gian để tránh timeout:
- ✅ Tốt: 1-7 ngày
- ⚠️ Cẩn thận: 1-30 ngày
- ❌ Tránh: > 30 ngày

---

## 📝 Testing Flow

### Flow test hoàn chỉnh:

1. **Login và lấy token**
   ```
   POST /api/auth/login
   ```

2. **Lấy danh sách dự án**
   ```
   GET /api/vnsocial/topics?type=keyword
   ```
   → Copy `project_id` (trường `id`) từ response

3. **Tìm bài viết theo từ khóa**
   ```
   POST /api/vnsocial/posts/search-by-keyword
   ```
   → Sử dụng `project_id` vừa lấy

4. **Lấy từ khóa nổi bật**
   ```
   POST /api/vnsocial/keywords/hot
   ```

5. **Lấy bài viết nổi bật**
   ```
   POST /api/vnsocial/posts/hot
   ```

6. **Xem thống kê tổng quan**
   ```
   POST /api/vnsocial/statistics
   ```

---

## 🎯 Use Cases

### Use Case 1: Theo dõi dư luận về giáo dục
```json
{
  "project_id": "69438bd945065e19984503e7",
  "source": "facebook",
  "start_time": 1733011200000,
  "end_time": 1734480000000,
  "senti": ["negative"],
  "size": 50
}
```

### Use Case 2: Tìm bài viết viral về kỳ thi
```json
{
  "project_id": "ky-thi-2024",
  "source": "baochi",
  "start_time": 1733011200000,
  "end_time": 1734480000000
}
```

### Use Case 3: Phân tích xu hướng từ khóa
```json
{
  "project_id": "69438bd945065e19984503e7",
  "sources": ["facebook", "youtube", "baochi"],
  "start_time": 1733011200000,
  "end_time": 1734480000000
}
```

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. ✅ Token còn hạn chưa? (15 phút)
2. ✅ VNSOCIAL_USERNAME và VNSOCIAL_PASSWORD đã đúng chưa?
3. ✅ Server backend đang chạy chưa?
4. ✅ start_time và end_time có đúng milliseconds timestamp không?
5. ✅ Body request có đầy đủ tham số bắt buộc không?

---

## 🐛 Troubleshooting

### Lỗi 500: "Failed to get projects from VnSocial"

**Nguyên nhân có thể:**
1. VnSocial credentials không đúng
2. VnSocial API không kết nối được
3. Token VnSocial đã hết hạn

**Cách debug:**

1. **Kiểm tra server logs** trong terminal:
   - Tìm dòng `🔐 VnSocial: Attempting login...`
   - Nếu thấy `❌ VnSocial login error`, copy toàn bộ error message

2. **Kiểm tra credentials trong .env:**
   ```bash
   cd backend
   cat .env | grep VNSOCIAL
   ```
   
   Phải có:
   ```
   VNSOCIAL_USERNAME=your-email@example.com
   VNSOCIAL_PASSWORD=your-password
   ```

3. **Test login trực tiếp:**
   ```bash
   curl -X POST https://vnsocial.vnpt.vn/oauth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"your-email@example.com","password":"your-password"}'
   ```
   
   Response thành công:
   ```json
   {
     "success": true,
     "token": "eyJhbGc...",
     "account": {...}
   }
   ```

4. **Restart server sau khi đổi .env:**
   ```bash
   # Kill old process
   lsof -ti:5001 | xargs kill -9
   
   # Start server
   cd backend && npm start
   ```

5. **Kiểm tra network/firewall:**
   - VnSocial API cần kết nối internet
   - URL: `https://api-vnsocialplus.vnpt.vn`
   - OAuth URL: `https://vnsocial.vnpt.vn`

---

### Lỗi 500: "Yêu cầu xử lý không thành công. Vui lòng thử lại sau."

**Đây là lỗi từ VnSocial API khi request không hợp lệ.**

**Nguyên nhân thường gặp:**
1. ❌ **project_id không tồn tại** - Dùng ID của project không thuộc tài khoản
2. ❌ **source không hợp lệ** - Phải là: `facebook`, `youtube`, `tiktok`, `forum`, `baochi`
3. ❌ **Project chưa được tạo** - Cần tạo project trên web VnSocial trước

**Cách khắc phục:**

#### Bước 1: Lấy danh sách projects có sẵn
```
GET http://localhost:5001/api/vnsocial/topics
```

Response:
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "abc123",
        "name": "Dự án test",
        "type": "TOPIC_POLICY"
      }
    ],
    "total": 1
  }
}
```

**Nếu topics = []** (rỗng), bạn cần:
1. Truy cập: https://vnsocial.vnpt.vn
2. Login với tài khoản VNSOCIAL_USERNAME/PASSWORD
3. Tạo project mới:
   - Click "Tạo dự án mới"
   - Chọn loại: "Chủ đề theo từ khóa" hoặc "Nguồn theo dõi"
   - Nhập tên và từ khóa
   - Lưu lại
4. Copy `projectId` từ URL hoặc API

#### Bước 2: Sử dụng project_id đúng
```json
{
  "project_id": "abc123",  // ← ID thật từ topics
  "source": "facebook",
  "start_time": 1733011200000,
  "end_time": 1734480000000
}
```

#### Bước 3: Kiểm tra logs
Xem terminal logs:
```
📰 VnSocial: Fetching posts by keyword with params: {
  "project_id": "abc123",
  "source": "facebook",
  ...
}
📤 VnSocial: Request body: {
  "project_id": "abc123",
  "source": "facebook",
  "start_time": 1733011200000,
  "end_time": 1734480000000,
  ...
}
```

Nếu thấy `❌ VnSocial getPostsByKeyword error`, check:
- `status`: 400 = Bad Request (sai tham số)
- `data.message`: Chi tiết lỗi từ VnSocial

---

### Lỗi 401: "Token không hợp lệ"

**Giải pháp:** GoPass token (JWT) đã hết hạn sau 15 phút
```
POST /api/auth/login
```
Lấy accessToken mới và cập nhật vào Postman Environment

---

### Lỗi 400: "Thiếu thông tin"

**Giải pháp:** Kiểm tra body request có đủ các trường bắt buộc:
- `project_id` (string) - **Phải lấy từ GET /topics**
- `source` (string) - Một trong: `facebook`, `youtube`, `tiktok`, `forum`, `baochi`
- `start_time` (number) - milliseconds timestamp
- `end_time` (number) - milliseconds timestamp

---

### Debug Checklist

Trước khi search posts, luôn làm theo thứ tự:

✅ **Step 1:** Login GoPass
```
POST /api/auth/login
→ Copy accessToken
```

✅ **Step 2:** List VnSocial projects
```
GET /api/vnsocial/topics
→ Copy project_id (trường "id") từ response
```

✅ **Step 3:** Search posts với project_id thật
```
POST /api/vnsocial/posts/search-by-keyword
Body: {
  "project_id": "<id-từ-step-2>",
  "source": "facebook",
  "start_time": 1734220800000,
  "end_time": 1734480000000
}
```

✅ **Step 4:** Check terminal logs nếu lỗi
- Tìm `🔍 DEBUG` để xem request/response
- Tìm `❌` để xem error details

---

**Chúc bạn test thành công! 🚀**
