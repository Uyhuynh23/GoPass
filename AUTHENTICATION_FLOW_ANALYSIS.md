# Authentication Flow Analysis - GoPass Application

## ✅ Executive Summary

**Status: PARTIALLY CORRECT** - The authentication flow works for login, but there are **critical issues** that will affect future API requests.

---

## 🔍 Current Authentication Flow

### Backend (Correct ✅)

1. **JWT Generation** (`backend/src/providers/JwtProvider.js`)
   - ✅ Access Token: Short-lived (configured in config)
   - ✅ Refresh Token: Long-lived (configured in config)
   - ✅ Proper JWT signing and verification

2. **Login Response** (`backend/src/services/AuthService.js`)
   ```json
   {
     "success": true,
     "data": {
       "user": { /* user object */ },
       "accessToken": "jwt...",
       "refreshToken": "jwt..."
     }
   }
   ```

3. **Authentication Middleware** (`backend/src/middleware/authenticate.js`)
   - ✅ Expects: `Authorization: Bearer <token>`
   - ✅ Validates JWT
   - ✅ Attaches user info to `req.user`

---

## ⚠️ Critical Issues Found

### Issue #1: **DUAL HTTP CLIENT SYSTEM** 🔴

You have TWO different HTTP clients:

1. **`authService.ts`** - Uses **native `fetch()`**
   - ✅ Correctly stores tokens
   - ✅ Login works
   - ⚠️ Manual token handling

2. **`httpClient.ts`** - Centralized HTTP client with automatic auth
   - ✅ Automatic token injection
   - ✅ Automatic token refresh on 401
   - ✅ Retry logic
   - ❌ **NOT used by authService**

### Issue #2: **Service Files NOT Using httpClient** 🔴

**Files using direct `fetch()` instead of `httpClient`:**

```typescript
// ❌ These are bypassing the httpClient:
- src/services/auth/authService.ts        // Uses fetch()
- src/services/exam/exam.service.ts       // Uses fetch()
- src/services/student/classApi.ts        // Uses fetch()
- src/services/student/myClassesApi.ts    // Uses fetch()
- src/services/contest/contest.service.ts // Uses fetch()
- src/services/student/studentStatsApi.ts // Uses fetch()
```

**Impact:**
- ❌ No automatic JWT token in headers
- ❌ No automatic token refresh
- ❌ No centralized error handling
- ❌ Manual token management required

### Issue #3: **Inconsistent Base URL** ⚠️

```typescript
// authService uses:
API_BASE_URL = 'http://localhost:5001/api'

// httpClient uses:
BASE_URL = 'http://localhost:5001'  // Missing /api

// Other services use:
API_URL = 'http://localhost:5001/api'
```

---

## 🎯 Recommendations

### **HIGH PRIORITY: Migrate to httpClient**

All API services should use the centralized `httpClient` to get:
- ✅ Automatic JWT token injection
- ✅ Automatic token refresh on expiry
- ✅ Centralized error handling
- ✅ Retry logic

### Example Refactor:

**BEFORE (Current - Manual Token Management):**
```typescript
// exam.service.ts - WRONG ❌
const response = await fetch(`${API_URL}/exams/${id}`, {
  cache: "no-store"
});
```

**AFTER (Should Be - Automatic Auth):**
```typescript
// exam.service.ts - CORRECT ✅
import { httpClient } from '@/lib/http';

const response = await httpClient.get<ExamResponse>(
  `/exams/${id}`, 
  { requiresAuth: true }
);
```

---

## 📋 Step-by-Step Fix Plan

### Step 1: Fix httpClient Base URL
```typescript
// lib/http/apiConfig.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001/api', // Add /api
  // ...
}
```

### Step 2: Refactor authService to Use httpClient

**Current Issue:**
`authService.ts` manually handles tokens, but should leverage `httpClient` for consistency.

**However:** Keep auth endpoints using direct fetch to avoid circular dependencies during token refresh.

### Step 3: Migrate All Service Files

**Priority Order:**
1. **Exam Service** ⭐ (Currently viewing)
2. Class API
3. Contest Service
4. Student Stats API

### Step 4: Update All API Calls

**Pattern to Follow:**
```typescript
// For protected endpoints
httpClient.get('/endpoint', { requiresAuth: true });
httpClient.post('/endpoint', data, { requiresAuth: true });

// For public endpoints
httpClient.get('/endpoint', { requiresAuth: false });
httpClient.post('/endpoint', data, { requiresAuth: false });
```

---

## ✅ What's Working Correctly

1. **Backend JWT Generation** ✅
   - Tokens are properly signed
   - Expiry times are set
   
2. **Backend Middleware** ✅
   - Correctly validates `Authorization: Bearer <token>`
   - Properly extracts user info

3. **Frontend Token Storage** ✅
   - Tokens stored in localStorage
   - User data persisted

4. **Login Flow** ✅
   - Credentials validated
   - Tokens returned and stored

5. **httpClient Implementation** ✅
   - Token auto-injection works
   - Token refresh on 401 works
   - Retry logic implemented

---

## ❌ What's NOT Working

1. **Most API Calls Don't Send JWT** ❌
   - Direct `fetch()` calls don't include `Authorization` header
   - Will fail on protected endpoints

2. **No Automatic Token Refresh** ❌
   - When access token expires, services using `fetch()` will get 401
   - User forced to re-login

3. **Inconsistent Error Handling** ❌
   - Each service handles errors differently
   - No centralized error management

---

## 🔧 Testing Authentication

### Test Case 1: Login ✅
```bash
# Should work (currently does)
POST http://localhost:5001/api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Test Case 2: Protected Endpoint (e.g., Get User Profile)
```bash
# Current: Likely FAILS if using fetch() ❌
GET http://localhost:5001/api/users/me
# Missing: Authorization: Bearer <token>

# Should be: WORKS with httpClient ✅
GET http://localhost:5001/api/users/me
Authorization: Bearer eyJhbGci...
```

### Test Case 3: Expired Token
```bash
# Current: User gets 401, forced to re-login ❌
# httpClient: Automatically refreshes token ✅
```

---

## 📊 Current Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           FRONTEND SERVICES                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐        ┌──────────────┐      │
│  │ authService  │        │ httpClient   │      │
│  │ (fetch)      │        │ (w/ auth)    │      │
│  └──────────────┘        └──────────────┘      │
│        │                        │               │
│        │                        │               │
│        ▼                        ▼               │
│  ❌ OTHER SERVICES          ✅ (Not Used)      │
│  (exam, class, contest)                         │
│  All use direct fetch()                         │
│  NO JWT headers sent! ❌                        │
│                                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │   BACKEND API            │
        │   (Expects JWT)          │
        └──────────────────────────┘
```

---

## 🎯 Target Architecture

```
┌─────────────────────────────────────────────────┐
│           FRONTEND SERVICES                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐        ┌──────────────┐      │
│  │ authService  │───────▶│ httpClient   │      │
│  │ (for auth)   │        │ (centralized)│      │
│  └──────────────┘        └──────────────┘      │
│                                │                │
│                                │                │
│                                ▼                │
│  ✅ ALL SERVICES USE httpClient                │
│  • exam.service.ts                              │
│  • class.service.ts                             │
│  • contest.service.ts                           │
│  • All automatically get JWT! ✅                │
│                                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │   BACKEND API            │
        │   (Receives JWT) ✅      │
        └──────────────────────────┘
```

---

## 🚀 Quick Win: Fix Exam Service Example

**File:** `frontend/src/services/exam/exam.service.ts`

**Before:**
```typescript
const [examRes, examQuestionsRes, allQuestionsRes] = await Promise.all([
  fetch(`${API_URL}/exams/${id}`, { cache: "no-store" }),
  fetch(`${API_URL}/examquestions?examId=${id}`, { cache: "no-store" }),
  fetch(`${API_URL}/questions`, { cache: "no-store" }),
]);
```

**After:**
```typescript
import { httpClient } from '@/lib/http';

const [examData, examQuestionsData, allQuestionsData] = await Promise.all([
  httpClient.get(`/exams/${id}`, { requiresAuth: true }),
  httpClient.get(`/examquestions?examId=${id}`, { requiresAuth: true }),
  httpClient.get(`/questions`, { requiresAuth: true }),
]);

// Already parsed, no need for .json()
```

---

## 📝 Action Items

### Immediate (Today)
- [ ] Fix `API_CONFIG.BASE_URL` to include `/api`
- [ ] Refactor `exam.service.ts` to use `httpClient`
- [ ] Test exam retrieval with authentication

### This Week
- [ ] Refactor all service files to use `httpClient`
- [ ] Remove direct `fetch()` calls from services
- [ ] Add proper TypeScript types for all API responses
- [ ] Test token refresh flow end-to-end

### Nice to Have
- [ ] Add request/response interceptors
- [ ] Implement request deduplication
- [ ] Add API response caching strategy
- [ ] Add comprehensive error logging

---

## 🔒 Security Considerations

### ✅ What's Secure
- JWT tokens properly signed
- Tokens stored in localStorage (acceptable for web apps)
- Refresh token rotation available

### ⚠️ Security Improvements Needed
- Consider using httpOnly cookies for refresh tokens
- Implement token blacklisting on logout
- Add CSRF protection for state-changing operations
- Implement rate limiting on auth endpoints

---

## 📚 References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Backend API Documentation](./backend/API_DOCUMENTATION.md)

---

**Last Updated:** December 19, 2025
**Status:** Needs Immediate Attention 🔴
