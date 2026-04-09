'use client';

/**
 * Navigation Component
 * Thanh navigation chung cho tất cả trang protected
 * Chuyển đổi từ nav-actions trong memories.html
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Kỷ niệm của chúng mình</h1>
          <p className={styles.subtitle}>Những khoảnh khắc đẹp bên nhau</p>
        </div>

        <nav className={styles.navActions}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const displayLabel = item.emoji
              ? `${item.emoji} ${item.label} ${item.emoji}`
              : item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  styles.navBtn,
                  isActive && styles.active,
                  item.isSpecial && styles.specialBtn
                )}
                style={item.gradient ? { background: item.gradient } : undefined}
              >
                <i className={item.icon} />
                <span>{displayLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
