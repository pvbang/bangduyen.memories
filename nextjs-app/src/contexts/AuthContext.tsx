'use client';

/**
 * Authentication Context
 * Quản lý trạng thái đăng nhập với localStorage
 * Session hết hạn sau 24 giờ
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthContextType, AuthData } from '@/types/auth';
import {
  AUTH_STORAGE_KEY,
  SESSION_DURATION_MS,
  VALID_PASSWORDS,
} from '@/lib/constants';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Kiểm tra auth data trong localStorage
   */
  const checkAuth = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return false;

      const data: AuthData = JSON.parse(raw);
      const now = Date.now();

      if (now - data.timestamp < SESSION_DURATION_MS) {
        return true;
      }

      // Hết hạn → xóa
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
  }, []);

  /**
   * Khởi tạo: kiểm tra auth khi mount
   */
  useEffect(() => {
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);

    // Kiểm tra định kỳ mỗi phút
    const interval = setInterval(() => {
      if (!checkAuth()) {
        setIsAuthenticated(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [checkAuth]);

  /**
   * Đăng nhập với password
   * @returns true nếu thành công
   */
  const login = useCallback((password: string): boolean => {
    const isValid = (VALID_PASSWORDS as readonly string[]).includes(password);

    if (isValid) {
      const authData: AuthData = {
        authenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
    }

    return isValid;
  }, []);

  /**
   * Đăng xuất
   */
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  /**
   * Gia hạn session (reset timestamp)
   */
  const refreshSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;

      const data: AuthData = JSON.parse(raw);
      data.timestamp = Date.now();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore errors
    }
  }, []);

  /**
   * Lấy thời gian còn lại (phút)
   */
  const getRemainingTime = useCallback((): number => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return 0;

      const data: AuthData = JSON.parse(raw);
      const remainingMs = SESSION_DURATION_MS - (Date.now() - data.timestamp);
      return Math.max(0, Math.ceil(remainingMs / 60000));
    } catch {
      return 0;
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshSession,
      getRemainingTime,
    }),
    [isAuthenticated, isLoading, login, logout, refreshSession, getRemainingTime]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
