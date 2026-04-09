'use client';

/**
 * Login Page - Trang đăng nhập
 * Route: /
 * Chuyển đổi từ index.html
 */

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import styles from './page.module.css';

const HEART_EMOJIS = ['💕', '💖', '💗', '💝', '💕', '💖', '💗', '💝', '💕'];

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Nếu đã auth → redirect sang /memories
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/memories');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Giả lập delay như bản gốc
      setTimeout(() => {
        const success = login(password);

        if (success) {
          router.push('/memories');
        } else {
          setIsSubmitting(false);
          setShowError(true);
          setShaking(true);

          setTimeout(() => {
            setShowError(false);
            setShaking(false);
          }, 3000);
        }
      }, 1000);
    },
    [login, password, router]
  );

  // Hiển thị loading nếu đang check auth
  if (isLoading) {
    return null;
  }

  // Nếu đã auth, không render login
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Background Animation */}
      <div className={styles.backgroundAnimation}>
        {HEART_EMOJIS.map((emoji, i) => (
          <div key={i} className={styles.floatingHeart}>
            {emoji}
          </div>
        ))}
      </div>

      {/* Login Container */}
      <div className={styles.loginContainer}>
        <div
          className={cn(
            styles.loginCard,
            isSubmitting && styles.loading,
            shaking && styles.shake
          )}
        >
          {/* Header */}
          <div className={styles.loginHeader}>
            <h1 className={styles.logo}>
              <i className={cn('fas fa-heart', styles.logoIcon)} />
              Bang &amp; Duyen Memories
              <i className={cn('fas fa-heart', styles.logoIcon)} />
            </h1>
            <p className={styles.subtitle}>
              Nơi lưu giữ những kỷ niệm của chúng mình ✨
            </p>
          </div>

          {/* Form */}
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <i className={cn('fas fa-lock', styles.inputIcon)} />
              <input
                type="password"
                className={styles.passwordInput}
                placeholder="Nhập mật khẩu để khám phá..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className={styles.loginBtn}>
              <span className={styles.btnText}>Khám phá kỷ niệm</span>
              <i className={cn('fas fa-arrow-right', styles.btnArrow)} />
            </button>
          </form>

          {/* Error Message */}
          <div
            className={cn(
              styles.errorMessage,
              showError && styles.errorMessageVisible
            )}
          >
            Mật khẩu không đúng! Hãy thử lại ♥
          </div>
        </div>
      </div>
    </>
  );
}
