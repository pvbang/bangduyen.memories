'use client';

/**
 * Protected Layout
 * Route group (protected) - tất cả trang cần authentication
 * Bao gồm: AuthGuard, Navigation, MusicPlayer
 */

import { AuthGuard } from '@/components/features/auth/AuthGuard';
import { Navigation } from '@/components/layout/Navigation';
import { MusicPlayer } from '@/components/layout/MusicPlayer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navigation />
      <main>{children}</main>
      <MusicPlayer />
    </AuthGuard>
  );
}
