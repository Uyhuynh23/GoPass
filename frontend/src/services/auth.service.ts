// src/services/auth.service.ts
import apiClient from './apiClient';
import { UserRole } from '@/utils/constants';

export interface LoginReq { 
  email: string; 
  password: string; 
}

export interface RegisterReq { 
  name: string; 
  email: string; 
  password: string;
  role?: UserRole;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  studentId?: string;
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  login: async (payload: LoginReq): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },
  
  register: async (payload: RegisterReq): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },
  
  logout: async (refreshToken?: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
  
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await apiClient.post('/auth/refresh-token', { refreshToken });
    return data;
  },
  
  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
};

export default authService;
