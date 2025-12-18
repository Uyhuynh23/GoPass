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
  "projectId": "project-123",
  "source": "facebook",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18",
  "page": 1,
  "limit": 10,
  "sentiment": ["positive", "neutral"],
  "reactionary": false,
  "province": "Hà Nội"
}
```

**Tham số bắt buộc:**
- `projectId` (string): ID của dự án/chủ đề
- `source` (string): Nguồn dữ liệu (`facebook`, `youtube`, `tiktok`, `forum`, `baochi`)
- `startDate` (string): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (string): Ngày kết thúc (YYYY-MM-DD)

**Tham số tùy chọn:**
- `page` (number, default: 1): Trang hiện tại
- `limit` (number, default: 10): Số bài viết mỗi trang
- `sentiment` (array): Cảm xúc [`positive`, `neutral`, `negative`]
- `reactionary` (boolean): Lọc bài viết phản động
- `province` (string): Tỉnh/thành phố

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
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

### 3. Tìm bài viết theo nguồn

**Endpoint:** `POST {{BASE_URL}}/api/vnsocial/posts/search-by-source`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "sourceId": "source-789",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18",
  "page": 1,
  "limit": 20,
  "sentiment": ["positive"]
}
```

**Tham số bắt buộc:**
- `sourceId` (string): ID của nguồn cụ thể (fanpage, kênh, tài khoản)
- `startDate` (string): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (string): Ngày kết thúc (YYYY-MM-DD)

**Tham số tùy chọn:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sentiment` (array): [`positive`, `neutral`, `negative`]

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
  "projectId": "project-123",
  "sources": ["facebook", "youtube", "baochi"],
  "startDate": "2024-12-01",
  "endDate": "2024-12-18"
}
```

**Tham số bắt buộc:**
- `projectId` (string): ID dự án
- `startDate` (string): Ngày bắt đầu
- `endDate` (string): Ngày kết thúc

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
  "projectId": "project-123",
  "source": "facebook",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18"
}
```

**Tham số bắt buộc:**
- `projectId` (string): ID dự án
- `source` (string): Nguồn (`facebook`, `youtube`, `tiktok`, `forum`, `baochi`)
- `startDate` (string): Ngày bắt đầu
- `endDate` (string): Ngày kết thúc

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
{
  "projectId": "project-123",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18",
  "sources": ["facebook", "youtube", "baochi"]
}
```

**Tham số bắt buộc:**
- `projectId` (string): ID dự án
- `startDate` (string): Ngày bắt đầu
- `endDate` (string): Ngày kết thúc

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
      "start": "2024-12-01",
      "end": "2024-12-18"
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
  "message": "Thiếu thông tin: projectId, source, startDate, endDate là bắt buộc"
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
Luôn sử dụng format `YYYY-MM-DD` cho startDate và endDate:
- ✅ Đúng: `"2024-12-18"`
- ❌ Sai: `"18/12/2024"` hoặc `"12-18-2024"`

### 4. Pagination
Để lấy nhiều dữ liệu, tăng `limit` hoặc loop qua các `page`:
```json
{
  "page": 1,
  "limit": 50
}
```

### 5. Filter Sentiment
Có thể filter nhiều sentiment cùng lúc:
```json
{
  "sentiment": ["positive", "neutral"]
}
```
Hoặc chỉ 1 sentiment:
```json
{
  "sentiment": ["negative"]
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
   → Copy `projectId` từ response

3. **Tìm bài viết theo từ khóa**
   ```
   POST /api/vnsocial/posts/search-by-keyword
   ```
   → Sử dụng `projectId` vừa lấy

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
  "projectId": "giao-duc-vn",
  "source": "facebook",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18",
  "sentiment": ["negative"],
  "limit": 50
}
```

### Use Case 2: Tìm bài viết viral về kỳ thi
```json
{
  "projectId": "ky-thi-2024",
  "source": "baochi",
  "startDate": "2024-12-01",
  "endDate": "2024-12-18"
}
```

### Use Case 3: Phân tích xu hướng từ khóa
```json
{
  "projectId": "giao-duc-vn",
  "sources": ["facebook", "youtube", "baochi"],
  "startDate": "2024-12-01",
  "endDate": "2024-12-18"
}
```

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. ✅ Token còn hạn chưa? (15 phút)
2. ✅ VNSOCIAL_USERNAME và VNSOCIAL_PASSWORD đã đúng chưa?
3. ✅ Server backend đang chạy chưa?
4. ✅ Format date có đúng `YYYY-MM-DD` không?
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
     "code": 200,
     "object": {
       "token": "eyJhbGc..."
     }
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

### Lỗi 401: "Token không hợp lệ"

**Giải pháp:** GoPass token (JWT) đã hết hạn sau 15 phút
```
POST /api/auth/login
```
Lấy accessToken mới và cập nhật vào Postman Environment

### Lỗi 400: "Thiếu thông tin"

**Giải pháp:** Kiểm tra body request có đủ các trường bắt buộc:
- `projectId` (string)
- `source` (string) 
- `startDate` (string YYYY-MM-DD)
- `endDate` (string YYYY-MM-DD)

---

**Chúc bạn test thành công! 🚀**
