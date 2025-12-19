/**
 * HTTP Client
 * Centralized HTTP client with automatic token handling, error handling, and retries
 */

import { API_CONFIG, HttpMethod, HttpStatus, ApiError, RequestConfig } from './apiConfig';
import { STORAGE_KEYS } from '@/services/auth/constants';

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Build headers for request
   */
  private buildHeaders(requiresAuth: boolean = false, customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Parse response body
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const message = data?.message || data || 'An error occurred';
      throw new ApiError(response.status, message, data);
    }

    return data;
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const newAccessToken = data.data.accessToken;

      // Update token in localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Make HTTP request with automatic retry and token refresh
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      body,
      headers: customHeaders,
      timeout = this.defaultTimeout,
      requiresAuth = false,
      retryAttempts = 0,
      ...restConfig
    } = config;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(requiresAuth, customHeaders);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...restConfig,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === HttpStatus.UNAUTHORIZED && requiresAuth) {
        const newToken = await this.refreshAccessToken();
        
        if (newToken) {
          // Retry request with new token
          headers.set('Authorization', `Bearer ${newToken}`);
          const retryResponse = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            ...restConfig,
          });
          return this.handleResponse<T>(retryResponse);
        } else {
          // Token refresh failed - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/login';
          }
          throw new ApiError(401, 'Session expired. Please login again.');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(0, 'Network error. Please check your connection.');
      }

      // Retry logic for specific errors
      if (retryAttempts > 0 && this.shouldRetry(error)) {
        await this.delay(API_CONFIG.RETRY_DELAY);
        return this.request<T>(endpoint, method, {
          ...config,
          retryAttempts: retryAttempts - 1,
        });
      }

      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    if (error instanceof ApiError) {
      // Retry on server errors, not client errors
      return error.statusCode >= 500;
    }
    return false;
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  public get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.GET, config);
  }

  /**
   * POST request
   */
  public post<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.POST, { ...config, body });
  }

  /**
   * PUT request
   */
  public put<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.PUT, { ...config, body });
  }

  /**
   * PATCH request
   */
  public patch<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.PATCH, { ...config, body });
  }

  /**
   * DELETE request
   */
  public delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.DELETE, config);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
