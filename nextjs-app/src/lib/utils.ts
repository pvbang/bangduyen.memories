/**
 * Utility functions dùng chung
 * Extracted từ memories.js và các file JS gốc
 */

/**
 * Format date string sang Vietnamese locale
 * @param dateString - Date string "YYYY-MM-DD"
 * @returns Chuỗi ngày tháng tiếng Việt
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Escape HTML để ngăn XSS
 * @param text - Raw text string
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Tính số ngày giữa 2 ngày
 * @param startDate - Ngày bắt đầu
 * @param endDate - Ngày kết thúc (mặc định: hôm nay)
 * @returns Số ngày
 */
export function daysBetween(startDate: string, endDate?: string): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Tạo class name string từ object conditions
 * Lightweight alternative cho classnames/clsx
 * @example cn('base', condition && 'active', undefined) => 'base active'
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Wrap index trong phạm vi mảng (circular)
 * @param index - Index cần wrap
 * @param length - Độ dài mảng
 * @returns Index hợp lệ trong [0, length)
 */
export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
