// src/services/apiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/constants';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Helpers to set/remove token (AuthContext sẽ gọi)
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// Response interceptor to unwrap data & handle errors
apiClient.interceptors.response.use(
  (res) => {
    // Backend returns { success: true, data: {...} }
    // Unwrap the data for easier consumption
    if (res.data && res.data.success) {
      return { ...res, data: res.data.data };
    }
    return res;
  },
  (err: AxiosError<{ success: boolean; message: string }>) => {
    // Normalize error message from backend
    const message = err.response?.data?.message || err.message || 'An error occurred';
    return Promise.reject({
      message,
      status: err.response?.status,
      data: err.response?.data,
    });
  }
);

export default apiClient;
