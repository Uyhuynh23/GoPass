// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  LOCKED: 'locked',
} as const;

// Auth Token Keys
export const AUTH_STORAGE_KEY = 'gopass_auth';

// API Endpoints Base
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001';

// Redirect Paths
export const REDIRECT_PATHS = {
  AFTER_LOGIN: '/dashboard',
  AFTER_LOGOUT: '/login',
  STUDENT_DASHBOARD: '/student/dashboard',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const;
