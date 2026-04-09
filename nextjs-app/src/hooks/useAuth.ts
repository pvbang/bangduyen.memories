'use client';

/**
 * Hook truy cập Authentication Context
 * @throws Error nếu dùng ngoài AuthProvider
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/types/auth';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }

  return context;
}
