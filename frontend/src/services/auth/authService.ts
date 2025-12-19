import { API_BASE_URL, AUTH_ENDPOINTS, STORAGE_KEYS } from './constants';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';
import { httpClient } from '@/lib/http';

class AuthService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Token management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  removeTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // User data management
  getUserData(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  setUserData(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  // API calls
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await httpClient.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials,
        { requiresAuth: false }
      );

      // Store tokens and user data
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      this.setUserData(data.data.user);

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const result = await httpClient.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        data,
        { requiresAuth: false }
      );

      // Store tokens and user data
      this.setTokens(result.data.accessToken, result.data.refreshToken);
      this.setUserData(result.data.user);

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.removeTokens();
        return null;
      }

      this.setTokens(data.data.accessToken, refreshToken);
      return data.data.accessToken;
    } catch (error) {
      this.removeTokens();
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (refreshToken) {
        await httpClient.post(
          AUTH_ENDPOINTS.LOGOUT,
          { refreshToken },
          { requiresAuth: false }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeTokens();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await httpClient.get<{ success: boolean; data: User }>(
        AUTH_ENDPOINTS.ME,
        { requiresAuth: true }
      );

      this.setUserData(data.data);
      return data.data;
    } catch (error) {
      console.error('Get current user error:', error);
      this.removeTokens();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
