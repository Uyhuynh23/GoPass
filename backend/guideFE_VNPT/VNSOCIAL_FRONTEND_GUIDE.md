# Hướng dẫn Frontend sử dụng VnSocial API

## 📋 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Base URL & Authentication](#base-url--authentication)
3. [Các Endpoints](#các-endpoints)
4. [TypeScript Types](#typescript-types)
5. [React Hooks Examples](#react-hooks-examples)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## 🌟 Tổng quan

VnSocial API cho phép frontend:
- ✅ Lấy danh sách dự án/chủ đề đang theo dõi
- ✅ Tìm kiếm bài viết theo từ khóa
- ✅ Tìm kiếm bài viết theo nguồn cụ thể
- ✅ Lấy từ khóa nổi bật (trending)
- ✅ Lấy bài viết viral
- ✅ Xem thống kê tổng quan

**Nguồn dữ liệu hỗ trợ:**
- `facebook` - Facebook
- `youtube` - YouTube  
- `tiktok` - TikTok
- `forum` - Diễn đàn
- `baochi` - Báo chí Việt Nam

---

## 🔗 Base URL & Authentication

### Base URL
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const VNSOCIAL_BASE = `${BASE_URL}/vnsocial`;
```

### Authentication
**Tất cả requests đều cần JWT token trong header:**

```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

---

## 📡 Các Endpoints

### 1. GET /api/vnsocial/topics - Lấy danh sách dự án

**URL:** `GET /api/vnsocial/topics`

**Query Parameters:**
- `type` (optional): `'keyword'` | `'source'` | không truyền (lấy tất cả)

**Example:**
```typescript
// Lấy tất cả dự án
const response = await fetch(`${VNSOCIAL_BASE}/topics`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Lấy chỉ dự án theo từ khóa
const response = await fetch(`${VNSOCIAL_BASE}/topics?type=keyword`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Response:**
```typescript
{
  success: true,
  message: "Lấy danh sách chủ đề thành công",
  data: {
    topics: [
      {
        id: "69438bd945065e19984503e7",
        name: "Giáo dục AI",
        type: "TOPIC_POLICY",
        created_date: "2025-12-18T05:06:33.917Z",
        status: true
      }
    ],
    total: 4
  }
}
```

---

### 2. POST /api/vnsocial/posts/search-by-keyword - Tìm bài viết theo từ khóa

**URL:** `POST /api/vnsocial/posts/search-by-keyword`

**Body Parameters:**
```typescript
{
  project_id: string;          // Bắt buộc - ID từ GET /topics
  source: 'facebook' | 'youtube' | 'tiktok' | 'forum' | 'baochi'; // Bắt buộc
  start_time: number;          // Bắt buộc - milliseconds timestamp
  end_time: number;            // Bắt buộc - milliseconds timestamp
  from?: number;               // Optional - default: 0
  size?: number;               // Optional - default: 10
  senti?: ('positive' | 'neutral' | 'negative')[]; // Optional
  reactionary?: boolean;       // Optional - default: false
  province?: string;           // Optional - tên tỉnh thành
  time_type?: 'createDate' | 'updateDate'; // Optional - default: 'createDate'
}
```

**Example:**
```typescript
const searchPosts = async (projectId: string, page: number = 1, limit: number = 10) => {
  const from = (page - 1) * limit;
  
  // Lấy khoảng thời gian 7 ngày gần nhất
  const end_time = Date.now();
  const start_time = end_time - (7 * 24 * 60 * 60 * 1000);

  const response = await fetch(`${VNSOCIAL_BASE}/posts/search-by-keyword`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project_id: projectId,
      source: 'facebook',
      start_time,
      end_time,
      from,
      size: limit,
      senti: ['positive', 'neutral', 'negative']
    })
  });

  return await response.json();
};
```

**Response:**
```typescript
{
  success: true,
  message: "Tìm bài viết thành công",
  data: {
    posts: [
      {
        userId: "user123",
        docId: "post456",
        userName: "Nguyễn Văn A",
        sourceName: "Facebook",
        postLink: "https://facebook.com/...",
        pictures: ["url1.jpg", "url2.jpg"],
        title: "Tiêu đề",
        content: "Nội dung bài viết...",
        senti: "positive",
        numInteractions: 150,
        numComments: 30,
        numShares: 20,
        createDate: "2024-12-15T10:30:00Z",
        province: "Hà Nội"
      }
    ],
    total: 125
  }
}
```

---

### 3. POST /api/vnsocial/posts/search-by-source - Tìm bài viết theo nguồn

**URL:** `POST /api/vnsocial/posts/search-by-source`

**Body Parameters:**
```typescript
{
  source_id: string;           // Bắt buộc - ID nguồn từ GET /topics?type=source
  start_time: number;          // Bắt buộc
  end_time: number;            // Bắt buộc
  from?: number;               // Optional
  size?: number;               // Optional
  senti?: string[];            // Optional
  time_type?: string;          // Optional
}
```

**Example:**
```typescript
const searchBySource = async (sourceId: string) => {
  const response = await fetch(`${VNSOCIAL_BASE}/posts/search-by-source`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source_id: sourceId,
      start_time: Date.now() - (7 * 24 * 60 * 60 * 1000),
      end_time: Date.now(),
      from: 0,
      size: 20
    })
  });

  return await response.json();
};
```

---

### 4. POST /api/vnsocial/keywords/hot - Lấy từ khóa nổi bật

**URL:** `POST /api/vnsocial/keywords/hot`

**Body Parameters:**
```typescript
{
  project_id: string;          // Bắt buộc
  start_time: number;          // Bắt buộc
  end_time: number;            // Bắt buộc
  sources?: string[];          // Optional - default: all sources
}
```

**Example:**
```typescript
const getHotKeywords = async (projectId: string) => {
  const response = await fetch(`${VNSOCIAL_BASE}/keywords/hot`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project_id: projectId,
      start_time: Date.now() - (7 * 24 * 60 * 60 * 1000),
      end_time: Date.now(),
      sources: ['facebook', 'youtube', 'baochi']
    })
  });

  return await response.json();
};
```

**Response:**
```typescript
{
  success: true,
  message: "Lấy từ khóa nổi bật thành công",
  data: {
    keywords: [
      {
        key: "giáo dục",
        doc_count: 1250
      },
      {
        key: "học sinh",
        doc_count: 980
      }
    ],
    total: 50
  }
}
```

---

### 5. POST /api/vnsocial/posts/hot - Lấy bài viết nổi bật

**URL:** `POST /api/vnsocial/posts/hot`

**Body Parameters:**
```typescript
{
  project_id: string;          // Bắt buộc
  source: string;              // Bắt buộc
  start_time: number;          // Bắt buộc
  end_time: number;            // Bắt buộc
}
```

**Example:**
```typescript
const getHotPosts = async (projectId: string, source: string) => {
  const response = await fetch(`${VNSOCIAL_BASE}/posts/hot`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project_id: projectId,
      source,
      start_time: Date.now() - (7 * 24 * 60 * 60 * 1000),
      end_time: Date.now()
    })
  });

  return await response.json();
};
```

---

### 6. POST /api/vnsocial/statistics - Thống kê tổng quan

**URL:** `POST /api/vnsocial/statistics`

**Body Parameters:**
```typescript
{
  project_id: string;          // Bắt buộc
  start_time: number;          // Bắt buộc
  end_time: number;            // Bắt buộc
  sources?: string[];          // Optional
}
```

**Example:**
```typescript
const getStatistics = async (projectId: string) => {
  const response = await fetch(`${VNSOCIAL_BASE}/statistics`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project_id: projectId,
      start_time: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 ngày
      end_time: Date.now(),
      sources: ['facebook', 'youtube', 'baochi']
    })
  });

  return await response.json();
};
```

---

## 📝 TypeScript Types

```typescript
// types/vnsocial.ts

export type VnSocialSource = 'facebook' | 'youtube' | 'tiktok' | 'forum' | 'baochi';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type ProjectType = 'TOPIC_POLICY' | 'PERSONAL_POST';
export type TimeType = 'createDate' | 'updateDate';

export interface VnSocialTopic {
  id: string;
  name: string;
  type: ProjectType;
  created_date: string;
  created_by?: string;
  updated_date?: string;
  status: boolean;
}

export interface VnSocialPost {
  userId: string;
  docId: string;
  userName: string;
  sourceId?: string;
  sourceName: string;
  postLink: string;
  domain?: string;
  pictures: string[];
  title: string;
  description?: string;
  tags?: string;
  content: string;
  logoLink?: string;
  senti: Sentiment;
  type?: string;
  isSpam?: boolean;
  createDate: string;
  numInteractions: number;
  numComments: number;
  numShares: number;
  updateDate?: string;
  province?: string;
}

export interface VnSocialKeyword {
  key: string;
  doc_count: number;
}

export interface SearchPostsRequest {
  project_id: string;
  source: VnSocialSource;
  start_time: number;
  end_time: number;
  from?: number;
  size?: number;
  senti?: Sentiment[];
  reactionary?: boolean;
  province?: string;
  time_type?: TimeType;
}

export interface SearchPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: VnSocialPost[];
    total: number;
  };
}

export interface GetTopicsResponse {
  success: boolean;
  message: string;
  data: {
    topics: VnSocialTopic[];
    total: number;
  };
}

export interface HotKeywordsResponse {
  success: boolean;
  message: string;
  data: {
    keywords: VnSocialKeyword[];
    total: number;
  };
}

export interface StatisticsResponse {
  success: boolean;
  message: string;
  data: {
    keywords: VnSocialKeyword[];
    hotPosts: VnSocialPost[];
    period: {
      start_time: number;
      end_time: number;
    };
  };
}
```

---

## ⚛️ React Hooks Examples

### Hook: useVnSocialTopics

```typescript
// hooks/useVnSocialTopics.ts
import { useState, useEffect } from 'react';
import { GetTopicsResponse, VnSocialTopic } from '@/types/vnsocial';

export const useVnSocialTopics = (type?: 'keyword' | 'source') => {
  const [topics, setTopics] = useState<VnSocialTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        const url = type 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/vnsocial/topics?type=${type}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/vnsocial/topics`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch topics');

        const data: GetTopicsResponse = await response.json();
        setTopics(data.data.topics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [type]);

  return { topics, loading, error };
};
```

### Hook: useVnSocialPosts

```typescript
// hooks/useVnSocialPosts.ts
import { useState } from 'react';
import { SearchPostsRequest, SearchPostsResponse, VnSocialPost } from '@/types/vnsocial';

export const useVnSocialPosts = () => {
  const [posts, setPosts] = useState<VnSocialPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPosts = async (params: SearchPostsRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vnsocial/posts/search-by-keyword`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }
      );

      if (!response.ok) throw new Error('Failed to search posts');

      const data: SearchPostsResponse = await response.json();
      setPosts(data.data.posts);
      setTotal(data.data.total);
      
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { posts, total, loading, error, searchPosts };
};
```

### Component Example: PostsTable

```typescript
// components/VnSocial/PostsTable.tsx
'use client';

import { useState } from 'react';
import { useVnSocialTopics } from '@/hooks/useVnSocialTopics';
import { useVnSocialPosts } from '@/hooks/useVnSocialPosts';

export default function PostsTable() {
  const { topics, loading: topicsLoading } = useVnSocialTopics('keyword');
  const { posts, total, loading, searchPosts } = useVnSocialPosts();
  
  const [selectedProject, setSelectedProject] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleSearch = async () => {
    if (!selectedProject) return;

    const from = (page - 1) * limit;
    const end_time = Date.now();
    const start_time = end_time - (7 * 24 * 60 * 60 * 1000); // 7 ngày

    await searchPosts({
      project_id: selectedProject,
      source: 'facebook',
      start_time,
      end_time,
      from,
      size: limit,
      senti: ['positive', 'neutral', 'negative']
    });
  };

  if (topicsLoading) return <div>Loading topics...</div>;

  return (
    <div className="space-y-4">
      {/* Project selector */}
      <select 
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="border rounded px-4 py-2"
      >
        <option value="">Chọn dự án</option>
        {topics.map(topic => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      <button 
        onClick={handleSearch}
        disabled={!selectedProject || loading}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
      </button>

      {/* Results */}
      {posts.length > 0 && (
        <div>
          <p className="text-gray-600 mb-2">Tìm thấy {total} bài viết</p>
          
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.docId} className="border rounded p-4">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.userName}</p>
                <p className="mt-2">{post.content.substring(0, 200)}...</p>
                
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>❤️ {post.numInteractions}</span>
                  <span>💬 {post.numComments}</span>
                  <span>🔄 {post.numShares}</span>
                </div>

                <a 
                  href={post.postLink} 
                  target="_blank"
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  Xem bài viết →
                </a>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border px-4 py-2 rounded"
            >
              Trước
            </button>
            <span className="px-4 py-2">Trang {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={posts.length < limit}
              className="border px-4 py-2 rounded"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## ❌ Error Handling

### Error Response Format

```typescript
{
  success: false,
  message: "Error message here"
}
```

### Common Errors

| Status | Error | Giải pháp |
|--------|-------|-----------|
| 401 | Token không hợp lệ | Refresh token hoặc login lại |
| 400 | Thiếu tham số | Kiểm tra body request |
| 500 | Lỗi VnSocial API | Kiểm tra project_id có tồn tại không |

### Error Handler Utility

```typescript
// utils/errorHandler.ts
export const handleVnSocialError = (error: any) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;

    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        return 'Phiên đăng nhập đã hết hạn';
      
      case 400:
        return message || 'Yêu cầu không hợp lệ';
      
      case 500:
        return 'Lỗi server. Vui lòng thử lại sau';
      
      default:
        return message || 'Có lỗi xảy ra';
    }
  }

  return 'Không thể kết nối đến server';
};
```

---

## 💡 Best Practices

### 1. Caching với React Query

```typescript
// hooks/useVnSocialQuery.ts
import { useQuery } from '@tanstack/react-query';

export const useTopics = () => {
  return useQuery({
    queryKey: ['vnsocial', 'topics'],
    queryFn: async () => {
      const response = await fetch(`${VNSOCIAL_BASE}/topics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
```

### 2. Date Helper Functions

```typescript
// utils/dateHelpers.ts

export const getDateRange = (days: number) => {
  const end_time = Date.now();
  const start_time = end_time - (days * 24 * 60 * 60 * 1000);
  return { start_time, end_time };
};

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('vi-VN');
};

// Usage
const { start_time, end_time } = getDateRange(7); // 7 ngày gần nhất
```

### 3. Pagination Helper

```typescript
// utils/pagination.ts

export const calculatePagination = (page: number, limit: number) => {
  return {
    from: (page - 1) * limit,
    size: limit
  };
};

// Usage
const { from, size } = calculatePagination(2, 10); // page 2, 10 items
```

### 4. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

```typescript
// config/api.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  vnsocial: {
    topics: '/api/vnsocial/topics',
    searchByKeyword: '/api/vnsocial/posts/search-by-keyword',
    searchBySource: '/api/vnsocial/posts/search-by-source',
    hotKeywords: '/api/vnsocial/keywords/hot',
    hotPosts: '/api/vnsocial/posts/hot',
    statistics: '/api/vnsocial/statistics'
  }
};
```

### 5. Request Interceptor với Axios

```typescript
// lib/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🎯 Quick Start Checklist

- [ ] Thêm `NEXT_PUBLIC_API_URL` vào `.env.local`
- [ ] Copy TypeScript types vào `types/vnsocial.ts`
- [ ] Tạo hooks `useVnSocialTopics` và `useVnSocialPosts`
- [ ] Setup error handler
- [ ] Test GET `/topics` endpoint
- [ ] Test POST `/posts/search-by-keyword` endpoint
- [ ] Implement pagination
- [ ] Add loading states
- [ ] Handle errors gracefully

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra token còn hạn không (15 phút)
2. Kiểm tra `project_id` có tồn tại trong danh sách topics
3. Kiểm tra `start_time` và `end_time` là milliseconds timestamp
4. Xem console logs để debug
5. Kiểm tra Network tab trong DevTools

**Happy coding! 🚀**
