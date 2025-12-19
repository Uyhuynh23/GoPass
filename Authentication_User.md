
## 1. Authentication & User Management

### 1.1 User Registration
**Purpose**: Register a new user account

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student | teacher | admin",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "student | teacher | admin",
      "status": "active | pending | locked",
      "avatar": "string",
      "phone": "string",
      "createdAt": "ISO8601 date"
    }
  },
  "message": "Registration successful"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 1.2 User Login
**Purpose**: Authenticate user and receive access tokens

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "student | teacher | admin",
      "status": "active",
      "avatar": "string",
      "phone": "string"
    }
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 1.3 Refresh Access Token
**Purpose**: Get new access token using refresh token

**Endpoint**: `POST /api/auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "string"
  }
}
```

---

### 1.4 User Logout
**Purpose**: Invalidate user session

**Endpoint**: `POST /api/auth/logout`

**Auth**: Required (Bearer Token)

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.5 Get Current User Profile
**Purpose**: Get authenticated user information

**Endpoint**: `GET /api/auth/me`

**Auth**: Required

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "student | teacher | admin",
    "status": "active",
    "avatar": "string",
    "phone": "string",
    "createdAt": "ISO8601 date",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 1.6 Update User Profile
**Purpose**: Update current user's profile

**Endpoint**: `PUT /api/auth/profile`

**Auth**: Required

**Request Body**:
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "string",
    "phone": "string",
    "updatedAt": "ISO8601 date"
  }
}
```

---

### 1.7 Change Password
**Purpose**: Change user password

**Endpoint**: `PUT /api/auth/change-password`

**Auth**: Required

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---
