'use client';

/**
 * 500 Days Celebration Page
 * Route: /500days
 * Theme: Tri Ân - Chân thành, không sến súa
 * Features: Particle System, Interactive Cards, Data Visualization, Modern UI
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './500days.module.css';

// ==========================================
// DATA
// ==========================================

// Real-time data
const JOURNEY_STATS = {
  totalDays: 500,
  totalHours: 12000,
  totalMinutes: 720000,
  coffeeTogether: 156,
  citiesVisited: 12,
  photosTogether: 892,
  lateNightCalls: 234,
  handHoldings: 1050,
  insideJokes: 47,
  songsShared: 89,
  dreamsTold: 156,
  hugsGiven: 2340,
};

// Milestones
const MILESTONES = [
  { day: 1, label: 'Bắt đầu', icon: 'fa-seedling' },
  { day: 100, label: '100 ngày', icon: 'fa-star' },
  { day: 200, label: '200 ngày', icon: 'fa-heart' },
  { day: 300, label: '300 ngày', icon: 'fa-gem' },
  { day: 365, label: '1 năm', icon: 'fa-trophy' },
  { day: 500, label: '500 ngày', icon: 'fa-infinity' },
];

// Monthly highlights
const MONTHLY_HIGHLIGHTS = [
  { month: 'Tháng 3', year: '2025', highlight: 'Ngày đầu tiên', mood: 'excited' },
  { month: 'Tháng 7', year: '2025', highlight: '100 ngày', mood: 'happy' },
  { month: 'Tháng 10', year: '2025', highlight: 'Sinh nhật em', mood: 'celebrating' },
  { month: 'Tháng 1', year: '2026', highlight: '300 ngày', mood: 'grateful' },
  { month: 'Tháng 2', year: '2026', highlight: 'Valentine', mood: 'loving' },
  { month: 'Tháng 3', year: '2026', highlight: '500 ngày', mood: 'peaceful' },
];

// Gratitude items - ngắn gọn, chân thành
const GRATITUDES = [
  { icon: 'fa-heart', text: 'Cảm ơn em đã ở đây', sub: 'Dù ngày tốt hay ngày khó' },
  { icon: 'fa-hand-holding-heart', text: 'Cảm ơn những lần em dỗ dành', sub: 'Khi anh không biết nói gì' },
  { icon: 'fa-moon', text: 'Cảm ơn những đêm trò chuyện', sub: 'Từ khuya đến hôm sau' },
  { icon: 'fa-smile', text: 'Cảm ơn nụ cười của em', sub: 'Làm mọi thứ tươi sáng hơn' },
  { icon: 'fa-utensils', text: 'Cảm ơn những bữa ăn', sub: 'Dù ở đâu, với ai, miễn có em' },
  { icon: 'fa-cloud', text: 'Cảm ơn em đã thấu hiểu', sub: 'Hơn cả những gì anh nói ra' },
];

// Simple wishes - không hứa hẹn, chỉ mong
const WISHES = [
  'Mong em bình an',
  'Mong em vui vẻ',
  'Mong những ngày khó qua mau',
  'Mong mình luôn khỏe',
  'Mong gia đình hai bên bình an',
  'Mong mọi điều tốt đẹp đến với em',
];

// ==========================================
// HOOKS
// ==========================================

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min((scrollTop / docHeight) * 100, 100));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return progress;
}

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);
  
  return position;
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);
  
  useEffect(() => {
    if (!started) return;
    
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    
    requestAnimationFrame(tick);
  }, [started, end, duration]);
  
  return { ref, count };
}

// ==========================================
// COMPONENTS
// ==========================================

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }
    
    const particles: Particle[] = [];
    const colors = ['#FF6B6B', '#FF69B4', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouse);
    
    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Connect nearby particles
        particles.forEach(p2 => {
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (100 - dist2) / 500;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
      
      animId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

function GradientOrbs() {
  const mouse = useMousePosition();
  
  return (
    <div className={styles.gradientOrbs}>
      <div 
        className={styles.orb1}
        style={{ 
          transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)` 
        }}
      />
      <div 
        className={styles.orb2}
        style={{ 
          transform: `translate(${-mouse.x * 0.03}px, ${-mouse.y * 0.03}px)` 
        }}
      />
      <div 
        className={styles.orb3}
        style={{ 
          transform: `translate(${mouse.x * 0.01}px, ${mouse.y * 0.01}px)` 
        }}
      />
    </div>
  );
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className={`${styles.heroSection} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.heroContent}>
        <div className={styles.badgeContainer}>
          <div className={styles.badgeRing1} />
          <div className={styles.badgeRing2} />
          <div className={styles.badgeRing3} />
          <div className={styles.badgeCenter}>
            <span className={styles.badgeNumber}>500</span>
            <span className={styles.badgeLabel}>NGÀY</span>
          </div>
        </div>
        
        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine1}>Tri Ân</span>
          <span className={styles.titleLine2}>Bên Nhau</span>
        </h1>
        
        <p className={styles.heroDate}>23/03/2025 — 05/08/2026</p>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: JOURNEY_STATS.totalDays, label: 'Ngày', suffix: '' },
    { value: JOURNEY_STATS.photosTogether, label: 'Bức ảnh', suffix: '+' },
    { value: JOURNEY_STATS.hugsGiven, label: 'Cái ôm', suffix: '' },
    { value: JOURNEY_STATS.lateNightCalls, label: 'Đêm muộn', suffix: '' },
  ];
  
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>500 Ngày</h2>
        
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, suffix, delay }: { value: number; label: string; suffix: string; delay: number }) {
  const { ref, count } = useCountUp(value);
  
  return (
    <div 
      ref={ref} 
      className={styles.statCard}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className={styles.statValue}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function JourneyTimeline() {
  const progress = useScrollProgress();
  
  return (
    <section className={styles.timelineSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Hành Trình</h2>
        
        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine}>
            <div 
              className={styles.timelineProgress}
              style={{ height: `${progress}%` }}
            />
          </div>
          
          <div className={styles.milestones}>
            {MILESTONES.map((milestone, i) => (
              <div 
                key={i} 
                className={styles.milestone}
                style={{ top: `${(milestone.day / 500) * 100}%` }}
              >
                <div className={styles.milestoneDot}>
                  <i className={`fas ${milestone.icon}`} />
                </div>
                <div className={styles.milestoneContent}>
                  <span className={styles.milestoneDay}>Ngày {milestone.day}</span>
                  <span className={styles.milestoneLabel}>{milestone.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MonthlyHighlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <section className={styles.highlightsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Những Tháng</h2>
        
        <div className={styles.highlightsCarousel}>
          <div 
            className={styles.highlightsTrack}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {MONTHLY_HIGHLIGHTS.map((item, i) => (
              <div key={i} className={styles.highlightSlide}>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightPeriod}>
                    {item.month} {item.year}
                  </div>
                  <div className={styles.highlightText}>{item.highlight}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.highlightsNav}>
            <button 
              className={styles.navBtn}
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <div className={styles.dots}>
              {MONTHLY_HIGHLIGHTS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
            <button 
              className={styles.navBtn}
              onClick={() => setActiveIndex(prev => Math.min(MONTHLY_HIGHLIGHTS.length - 1, prev + 1))}
              disabled={activeIndex === MONTHLY_HIGHLIGHTS.length - 1}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function GratitudeSection() {
  return (
    <section className={styles.gratitudeSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Cảm Ơn</h2>
        
        <div className={styles.gratitudeGrid}>
          {GRATITUDES.map((item, i) => (
            <div 
              key={i} 
              className={styles.gratitudeCard}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.gratitudeIcon}>
                <i className={`fas ${item.icon}`} />
              </div>
              <h3 className={styles.gratitudeText}>{item.text}</h3>
              <p className={styles.gratitudeSub}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WishesSection() {
  return (
    <section className={styles.wishesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Mong Ước</h2>
        
        <div className={styles.wishesContainer}>
          {WISHES.map((wish, i) => (
            <div 
              key={i} 
              className={styles.wishItem}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className={styles.wishDot} />
              <span className={styles.wishText}>{wish}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LetterSection() {
  const [isOpened, setIsOpened] = useState(false);
  
  return (
    <section className={styles.letterSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Thư</h2>
        
        <div className={`${styles.letterContainer} ${isOpened ? styles.opened : ''}`}>
          <div className={styles.letterEnvelope} onClick={() => setIsOpened(!isOpened)}>
            <div className={styles.envelopeBack}>
              <div className={styles.envelopeFront}>
                <div className={styles.heartSeal}>
                  <i className="fas fa-heart" />
                </div>
              </div>
            </div>
          </div>
          
          {isOpened && (
            <div className={styles.letterContent}>
              <div className={styles.letterPaper}>
                <p className={styles.letterGreeting}>Em ơi,</p>
                <p className={styles.letterText}>
                  500 ngày rồi. Ngắn mà dài.
                </p>
                <p className={styles.letterText}>
                  Không cần hứa gì lớn lao. Chỉ cần em biết, mỗi ngày có em, anh thấy mình may mắn.
                </p>
                <p className={styles.letterText}>
                  Cảm ơn em đã đến. Cảm ơn em đã ở lại.
                </p>
                <p className={styles.letterText}>
                  Mong mọi điều tốt đẹp sẽ đến với em.
                </p>
                <div className={styles.letterSignature}>
                  <span>Yêu em,</span>
                  <span className={styles.signatureName}>Anh</span>
                </div>
              </div>
            </div>
          )}
          
          {!isOpened && (
            <p className={styles.letterHint}>
              <i className="fas fa-hand-pointer" />
              Nhấn để mở thư
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function HeartRainEffect() {
  const triggerRain = useCallback(() => {
    const hearts = ['💕', '💖', '💗', '💘', '💝', '❤️'];
    
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
          position: fixed;
          top: -30px;
          left: ${Math.random() * 100}%;
          font-size: ${Math.random() * 15 + 15}px;
          pointer-events: none;
          z-index: 9999;
          animation: heartFall500 ${Math.random() * 2 + 2}s linear forwards;
        `;
        document.body.appendChild(heart);
        setTimeout(() => document.body.removeChild(heart), 4000);
      }, i * 60);
    }
  }, []);
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes heartFall500 {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  return (
    <button className={styles.rainButton} onClick={triggerRain}>
      <i className="fas fa-heart" />
      <span>Tạo mưa tim</span>
    </button>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.footerText}>500 ngày. Không hứa. Chỉ trân trọng.</p>
        
        <div className={styles.footerLinks}>
          <Link href="/memories" className={styles.footerLink}>
            <i className="fas fa-heart" />
            <span>Kỷ niệm</span>
          </Link>
          <Link href="/timeline" className={styles.footerLink}>
            <i className="fas fa-clock" />
            <span>Đếm ngày</span>
          </Link>
          <Link href="/300days" className={styles.footerLink}>
            <i className="fas fa-gem" />
            <span>300 ngày</span>
          </Link>
          <Link href="/1year" className={styles.footerLink}>
            <i className="fas fa-trophy" />
            <span>1 năm</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function FiveHundredDaysPage() {
  const scrollProgress = useScrollProgress();
  
  return (
    <div className={styles.page}>
      {/* Progress Bar */}
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />
      
      {/* Background Effects */}
      <ParticleCanvas />
      <GradientOrbs />
      
      {/* Content */}
      <HeroSection />
      <StatsSection />
      <JourneyTimeline />
      <MonthlyHighlights />
      <GratitudeSection />
      <WishesSection />
      <LetterSection />
      <Footer />
      
      {/* Floating Button */}
      <HeartRainEffect />
    </div>
  );
}
