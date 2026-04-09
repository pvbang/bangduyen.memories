/**
 * Hằng số dùng chung cho toàn bộ ứng dụng
 */

import type { Track } from '@/types/music';

// ==========================================
// AUTHENTICATION
// ==========================================

/** Mật khẩu hợp lệ để đăng nhập */
export const VALID_PASSWORDS = ['23032025', '2332025'] as const;

/** Thời gian session hết hạn: 24 giờ (milliseconds) */
export const SESSION_DURATION_MS = 86400000;

/** Key lưu trữ auth data trong localStorage */
export const AUTH_STORAGE_KEY = 'authData';

// ==========================================
// MUSIC PLAYLIST
// ==========================================

/** Playlist nhạc nền */
export const PLAYLIST: Track[] = [
  { src: '/data/music/bang-duyen-7.mp3', name: 'Duyên Mình Là Mãi Mãi (v7)' },
  { src: '/data/music/bang-duyen-5.mp3', name: 'Duyên Mình Là Mãi Mãi (v5)' },
  { src: '/data/music/bang-duyen-8.mp3', name: 'Duyên Mình Là Mãi Mãi (v8)' },
  { src: '/data/music/bang-duyen-6.mp3', name: 'Duyên Mình Là Mãi Mãi (v6)' },
  { src: '/data/music/bang-duyen-4.mp3', name: 'Duyên Mình Là Mãi Mãi (v4)' },
  { src: '/data/music/bang-duyen-1.mp3', name: 'Duyên Mình Là Mãi Mãi (v1)' },
  { src: '/data/music/365.mp3', name: '365 Ngày Viết Cho Em' },
];

// ==========================================
// NAVIGATION
// ==========================================

export interface NavItem {
  href: string;
  icon: string;
  label: string;
  emoji?: string;
  isSpecial?: boolean;
  gradient?: string;
}

/** Menu navigation chính */
export const NAV_ITEMS: NavItem[] = [
  {
    href: '/memories',
    icon: 'fas fa-heart',
    label: 'Kỷ Niệm',
  },
  {
    href: '/gallery',
    icon: 'fas fa-images',
    label: 'Thư viện ảnh',
  },
  {
    href: '/timeline',
    icon: 'fas fa-clock',
    label: 'Đếm Ngày',
  },
  {
    href: '/starmap',
    icon: 'fas fa-star',
    label: 'Bản Đồ Sao',
  },
  {
    href: '/100days',
    icon: 'fas fa-crown',
    label: '100 Ngày Yêu',
    isSpecial: true,
  },
  {
    href: '/300days',
    icon: 'fas fa-gem',
    label: '300 Ngày Yêu',
    emoji: '💎',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #B76E79 0%, #E75480 50%, #FF6B6B 100%)',
  },
  {
    href: '/trung-thu',
    icon: 'fas fa-moon',
    label: 'Tết Trung Thu',
    emoji: '🌙',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF6347 50%, #FF69B4 100%)',
  },
  {
    href: '/birthday',
    icon: 'fas fa-birthday-cake',
    label: 'Sinh Nhật',
    emoji: '🎂',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFD700 50%, #FF1493 100%)',
  },
  {
    href: '/sorry',
    icon: 'fas fa-heart-broken',
    label: 'Xin Lỗi Eiuuu',
    emoji: '💙',
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #DDA0DD 50%, #F0E68C 100%)',
  },
  {
    href: '/giang-sinh',
    icon: 'fas fa-tree',
    label: 'Giáng Sinh',
    emoji: '🎄',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #DC143C 0%, #228B22 50%, #FFD700 100%)',
  },
  {
    href: '/march8',
    icon: 'fas fa-seedling',
    label: '8/3 Ngày Của Em',
    emoji: '💐',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #a29bfe 50%, #fd79a8 100%)',
  },
  {
    href: '/1year',
    icon: 'fas fa-trophy',
    label: '1 Năm Iuuu',
    emoji: '🏆',
    isSpecial: true,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF1493 50%, #FF69B4 100%)',
  },
];

// ==========================================
// MEMORIES
// ==========================================

/** Số memories hiển thị mỗi trang */
export const MEMORIES_PER_PAGE = 6;

/** Icon mapping cho category */
export const CATEGORY_ICONS: Record<string, string> = {
  milestone: 'fas fa-star',
  dating: 'fas fa-heart',
  daily: 'fas fa-calendar-day',
  quotes: 'fas fa-quote-left',
};

/** Tên hiển thị cho category */
export const CATEGORY_NAMES: Record<string, string> = {
  milestone: 'Cột mốc quan trọng',
  dating: 'Hẹn hò',
  daily: 'Hàng ngày',
  quotes: 'Lời yêu thương',
};

/** Icon mapping cho mood */
export const MOOD_ICONS: Record<string, string> = {
  romantic: 'fas fa-heart',
  sweet: 'fas fa-candy-cane',
  happy: 'fas fa-smile-beam',
  excited: 'fas fa-star',
  peaceful: 'fas fa-leaf',
  joyful: 'fas fa-laugh',
  content: 'fas fa-smile',
  important: 'fas fa-exclamation-circle',
  poetic: 'fas fa-feather-alt',
  promise: 'fas fa-ring',
  caring: 'fas fa-heart-pulse',
  funny: 'fas fa-laugh-squint',
};

// ==========================================
// DATES
// ==========================================

/** Ngày bắt đầu yêu nhau */
export const LOVE_START_DATE = '2025-03-23';
