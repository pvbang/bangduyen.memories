'use client';

/**
 * BackgroundAnimation Component
 * Hiệu ứng nền với floating hearts, particles, sparkles, tech elements
 * Reusable - có thể dùng cho nhiều trang
 */

import React from 'react';
import styles from '@/app/(protected)/memories/memories.module.css';

/** Cấu hình tech icons với vị trí và delay */
const TECH_ICONS = [
  { icon: 'fas fa-heart', delay: '0s', x: '10%', y: '20%' },
  { icon: 'fas fa-code', delay: '1s', x: '80%', y: '15%' },
  { icon: 'fas fa-laptop-code', delay: '2s', x: '15%', y: '70%' },
  { icon: 'fas fa-wifi', delay: '3s', x: '85%', y: '60%' },
  { icon: 'fas fa-rocket', delay: '4s', x: '45%', y: '80%' },
  { icon: 'fas fa-star', delay: '5s', x: '75%', y: '85%' },
  { icon: 'fas fa-infinity', delay: '6s', x: '25%', y: '40%' },
  { icon: 'fas fa-moon', delay: '7s', x: '90%', y: '30%' },
] as const;

/** Cấu hình sparkles với emoji và vị trí */
const SPARKLES = [
  { emoji: '✨', className: 'sparkle1' },
  { emoji: '💫', className: 'sparkle2' },
  { emoji: '⭐', className: 'sparkle3' },
  { emoji: '✨', className: 'sparkle4' },
  { emoji: '💫', className: 'sparkle5' },
  { emoji: '⭐', className: 'sparkle6' },
  { emoji: '✨', className: 'sparkle7' },
  { emoji: '💫', className: 'sparkle8' },
] as const;

/** Số lượng hearts (1-20) */
const HEART_COUNT = 20;

/** Số lượng particles */
const PARTICLE_COUNT = 15;

/** Số lượng circuit lines (1-5) */
const LINE_COUNT = 5;

export function BackgroundAnimation() {
  return (
    <div className={styles.backgroundAnimation}>
      {/* Animated Gradient Background */}
      <div className={styles.gradientBg} />

      {/* Floating Hearts Animation */}
      <div className={styles.floatingHearts}>
        {Array.from({ length: HEART_COUNT }, (_, i) => (
          <div
            key={`heart-${i}`}
            className={`${styles.heart} ${styles[`heart${i + 1}` as keyof typeof styles] || ''}`}
          />
        ))}
      </div>

      {/* Tech Elements */}
      <div className={styles.techElements}>
        {/* Circuit Lines */}
        <div className={styles.circuitLines}>
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={`line-${i}`}
              className={`${styles.circuitLine} ${styles[`line${i + 1}` as keyof typeof styles] || ''}`}
            />
          ))}
        </div>

        {/* Floating Tech Icons */}
        <div className={styles.floatingIcons}>
          {TECH_ICONS.map((item, i) => (
            <i
              key={`tech-${i}`}
              className={`${styles.techIcon} ${item.icon}`}
              style={{
                '--delay': item.delay,
                '--x': item.x,
                '--y': item.y,
                left: item.x,
                top: item.y,
                animationDelay: item.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className={styles.floatingParticles}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <div key={`particle-${i}`} className={styles.particle} />
        ))}
      </div>

      {/* Love Sparkles */}
      <div className={styles.loveSparkles}>
        {SPARKLES.map((item, i) => (
          <div
            key={`sparkle-${i}`}
            className={`${styles.sparkle} ${styles[item.className as keyof typeof styles] || ''}`}
          >
            {item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
