'use client';

/**
 * 500 Days Celebration Page
 * Route: /500days
 * Theme: "Cảm Ơn & Trân Trọng" - Minimal, heartfelt, modern
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './500days.module.css';

// ==========================================
// DATA - Short, heartfelt messages
// ==========================================

const STATS = [
  { value: '500', label: 'Ngày' },
  { value: '∞', label: 'Trân trọng' },
];

const MEMORIES = [
  { date: '23/03/2025', text: 'Ngày đầu tiên.' },
  { date: '01/07/2025', text: '100 ngày.' },
  { date: '08/10/2025', text: 'Sinh nhật em.' },
  { date: '17/01/2026', text: '300 ngày.' },
  { date: '14/02/2026', text: 'Valentine.' },
  { date: '05/08/2026', text: '500 ngày.' },
];

const WISHES = [
  'Em bình an',
  'Em vui vẻ',
  'Em khỏe mạnh',
  'Mình còn nhau',
  'Ngày mai tốt hơn',
];

const GRATEFUL_FOR = [
  { emoji: '🌅', text: 'Những buổi sáng có tin nhắn em' },
  { emoji: '🌙', text: 'Những đêm trò chuyện cùng em' },
  { emoji: '☕', text: 'Những lần ngồi uống cà phê' },
  { emoji: '🚶', text: 'Những bước đi bên em' },
  { emoji: '😊', text: 'Nụ cười của em' },
  { emoji: '💭', text: 'Tất cả những điều nhỏ bé' },
];

// ==========================================
// HOOKS
// ==========================================

function useTimeTogether() {
  const [time, setTime] = useState({ days: 500, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const startDate = new Date('2025-03-23T00:00:00');
    
    function update() {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTime({ days, hours, minutes, seconds });
    }
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return time;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function Tree() {
  const [leafPositions] = useState(() => {
    return WISHES.map((_, i) => ({
      left: 15 + (i % 3) * 35 + Math.random() * 10,
      top: 10 + Math.floor(i / 3) * 25 + Math.random() * 10,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    }));
  });

  return (
    <div className={styles.treeContainer}>
      <svg viewBox="0 0 300 350" className={styles.treeSvg}>
        {/* Tree trunk */}
        <path 
          d="M140 350 L140 200 Q145 180 150 200 Q155 180 160 200 L160 350 Z" 
          fill="#8B5A2B"
          className={styles.treeTrunk}
        />
        
        {/* Tree canopy layers */}
        <ellipse cx="150" cy="140" rx="120" ry="100" fill="#2D5A27" className={styles.treeCanopy1} />
        <ellipse cx="150" cy="120" rx="100" ry="80" fill="#3D7A37" className={styles.treeCanopy2} />
        <ellipse cx="150" cy="100" rx="75" ry="60" fill="#4D9A47" className={styles.treeCanopy3} />
        
        {/* Tree highlights */}
        <ellipse cx="120" cy="90" rx="30" ry="25" fill="#5DAA57" opacity="0.6" />
        <ellipse cx="180" cy="110" rx="25" ry="20" fill="#5DAA57" opacity="0.5" />
      </svg>
      
      <div className={styles.leavesOverlay}>
        {WISHES.map((wish, i) => (
          <div 
            key={i}
            className={styles.leafNode}
            style={{
              left: `${leafPositions[i].left}%`,
              top: `${leafPositions[i].top}%`,
              transform: `rotate(${leafPositions[i].rotation}deg) scale(${leafPositions[i].scale})`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <span className={styles.leafEmoji}>🍃</span>
            <div className={styles.leafTooltip}>{wish}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className={styles.orbsContainer}>
      {['💕', '✨', '🌸', '💫', '🌙'].map((emoji, i) => (
        <div 
          key={i}
          className={styles.orb}
          style={{
            '--delay': `${i * 2}s`,
            '--x': `${10 + i * 20}%`,
            '--duration': `${8 + i * 3}s`,
          } as React.CSSProperties}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

function HeartRain() {
  const createHearts = useCallback(() => {
    const hearts = ['💕', '💖', '💗', '💘', '💝', '❤️'];
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
          position: fixed;
          top: -50px;
          left: ${Math.random() * 100}%;
          font-size: ${15 + Math.random() * 15}px;
          pointer-events: none;
          z-index: 9999;
          animation: heartFallNew ${3 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(heart);
        setTimeout(() => document.body.removeChild(heart), 5000);
      }, i * 60);
    }
    
    if (!document.querySelector('#heartFallNewStyle')) {
      const style = document.createElement('style');
      style.id = 'heartFallNewStyle';
      style.textContent = `@keyframes heartFallNew { 0% { transform: translateY(-50px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <button className={styles.rainBtn} onClick={createHearts}>
      <span>💖</span> Mưa tim
    </button>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function FiveHundredDaysPage() {
  const timeTogether = useTimeTogether();
  const [activeMemory, setActiveMemory] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <FloatingOrbs />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>500</span>
            <span className={styles.badgeLabel}>Ngày</span>
          </div>
          
          <h1 className={styles.title}>
            <span className={styles.titleSmall}>Cảm ơn & Trân trọng</span>
            <span className={styles.titleBig}>500 Ngày Bên Nhau</span>
          </h1>
          
          <p className={styles.subtitle}>
            500 ngày trải qua nhiều chuyện buồn vui.<br />
            Mong bình an và vui vẻ.
          </p>
          
          {/* Live counter */}
          <div className={styles.liveCounter}>
            <div className={styles.counterItem}>
              <span className={styles.counterValue}>{timeTogether.days}</span>
              <span className={styles.counterLabel}>Ngày</span>
            </div>
            <span className={styles.counterDot}>:</span>
            <div className={styles.counterItem}>
              <span className={styles.counterValue}>{String(timeTogether.hours).padStart(2, '0')}</span>
              <span className={styles.counterLabel}>Giờ</span>
            </div>
            <span className={styles.counterDot}>:</span>
            <div className={styles.counterItem}>
              <span className={styles.counterValue}>{String(timeTogether.minutes).padStart(2, '0')}</span>
              <span className={styles.counterLabel}>Phút</span>
            </div>
            <span className={styles.counterDot}>:</span>
            <div className={styles.counterItem}>
              <span className={styles.counterValue}>{String(timeTogether.seconds).padStart(2, '0')}</span>
              <span className={styles.counterLabel}>Giây</span>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <span>Cuộn xuống</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Journey */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Hành trình</h2>
          <div className={styles.journeyGrid}>
            {MEMORIES.map((m, i) => (
              <div 
                key={i}
                className={`${styles.journeyItem} ${activeMemory === i ? styles.journeyItemActive : ''}`}
                onClick={() => setActiveMemory(activeMemory === i ? null : i)}
              >
                <span className={styles.journeyDate}>{m.date}</span>
                <span className={styles.journeyText}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tree of Wishes */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Cây ước nguyện</h2>
          <p className={styles.sectionDesc}>Click vào lá để xem điều ước</p>
          <div className={styles.treeWrapper}>
            <Tree />
          </div>
        </div>
      </section>

      {/* Grateful For */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Những điều trân trọng</h2>
          <div className={styles.gratefulGrid}>
            {GRATEFUL_FOR.map((item, i) => (
              <div key={i} className={styles.gratefulItem} style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}>
                <span className={styles.gratefulEmoji}>{item.emoji}</span>
                <span className={styles.gratefulText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Letter */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Gửi em</h2>
          <div className={styles.letter}>
            <p className={styles.letterPara}>
              500 ngày rồi.
            </p>
            <p className={styles.letterPara}>
              Không có gì lớn lao để nói. Chỉ là cảm ơn em đã ở đây, vẫn ở đây.
            </p>
            <p className={styles.letterPara}>
              Cảm ơn em đã cười cùng anh, đã khóc cùng anh, đã lắng nghe anh.
            </p>
            <p className={styles.letterPara}>
              Mong em bình an. Mong em vui vẻ.
            </p>
            <p className={styles.letterPara}>
              Điều duy nhất anh mong là còn được đi cùng em.
            </p>
            <div className={styles.letterSignature}>
              <span>Yêu em,</span>
              <span className={styles.signatureName}>Bằng 💕</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/memories">Kỷ niệm</Link>
          <Link href="/timeline">Đếm ngày</Link>
          <Link href="/1year">1 Năm</Link>
        </div>
        <p className={styles.footerCopy}>Bằng & Duyên 💕</p>
      </footer>

      <HeartRain />
    </div>
  );
}
