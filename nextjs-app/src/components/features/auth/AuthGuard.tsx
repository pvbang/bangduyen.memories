'use client';

/**
 * AuthGuard - Bảo vệ trang cần authentication
 * Hiển thị loading screen trong khi kiểm tra auth
 * Redirect về / nếu chưa đăng nhập
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './AuthGuard.module.css';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Đang kiểm tra auth → loading screen
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Chưa auth → không render (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Đã auth → render children
  return <>{children}</>;
}
