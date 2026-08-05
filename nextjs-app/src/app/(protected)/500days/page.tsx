'use client';

/**
 * 500 Days Celebration Page
 * Route: /500days
 * Theme: "Không Hứa, Chỉ Tri Ân" - Cảm ơn và trân trọng 500 ngày bên nhau
 * Unique features: Time Capsule, Wishes Tree, Gratitude Counter, Weather of Love
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './500days.module.css';

// ==========================================
// DATA
// ==========================================

const STATS = [
  { icon: 'fas fa-heart', target: 500, label: 'Ngày bên nhau' },
  { icon: 'fas fa-moon', target: 12000, label: 'Giờ ngắm trăng cùng' },
  { icon: 'fas fa-sun', target: 6000, label: 'Lần nhắn tin goodnight' },
  { icon: 'fas fa-infinity', target: 0, label: 'Tri ân vô tận', isInfinity: true },
];

// Memory Capsules - những kỷ niệm được "niêm phong" theo thời gian
const MEMORY_CAPSULES = [
  { 
    id: 1, 
    month: 'Tháng 3', 
    year: '2025',
    title: 'Ngày Định Mệnh', 
    emoji: '💕',
    sealed: true,
    content: 'Khoảnh khắc aiuuuu lấy hết can đảm nói "iuuuu em", và em đã đồng ý. Đó là ngày đẹp nhất của aiuuuu!'
  },
  { 
    id: 2, 
    month: 'Tháng 7', 
    year: '2025',
    title: '100 Ngày Đầu Tiên', 
    emoji: '👑',
    sealed: true,
    content: 'Tròn 100 ngày! Aiuuuu tự hào vì đã tốt nghiệp khóa "yêu em" xuất sắc!'
  },
  { 
    id: 3, 
    month: 'Tháng 10', 
    year: '2025',
    title: 'Sinh Nhật Công Chúa', 
    emoji: '🎂',
    sealed: true,
    content: 'Sinh nhật đầu tiên bên nhau. Chúc em iuuu mãi xinh đẹp và hạnh phúccc!'
  },
  { 
    id: 4, 
    month: 'Tháng 1', 
    year: '2026',
    title: '300 Ngày Kỷ Niệm', 
    emoji: '💎',
    sealed: true,
    content: '300 ngày rồi! Tình iuuu vẫn ngọt ngào như ngày đầu tiên nè!'
  },
  { 
    id: 5, 
    month: 'Tháng 2', 
    year: '2026',
    title: 'Valentine Đầu Tiên', 
    emoji: '🌹',
    sealed: true,
    content: 'Ngày lễ tình nhân đầu tiên chính thức bên nhau. Yêu em nhiều!'
  },
  { 
    id: 6, 
    month: 'Tháng 3', 
    year: '2026',
    title: '500 Ngày - Tri Ân', 
    emoji: '✨',
    sealed: false,
    content: '500 ngày bên nhau! Không hứa hẹn gì lớn lao, chỉ cảm ơn em đã ở đây!'
  },
];

// Wishes Tree - Những điều ước được gieo trồng
const WISHES = [
  { id: 1, text: 'Mong em luôn bình an và vui vẻ', emoji: '🌸', color: '#FF69B4' },
  { id: 2, text: 'Ước mỗi ngày đều được gặp em', emoji: '☀️', color: '#FFD700' },
  { id: 3, text: 'Hy vọng em luôn khỏe mạnh', emoji: '💪', color: '#87CEEB' },
  { id: 4, text: 'Nguyện em được mỉm cười mỗi ngày', emoji: '🌈', color: '#9370DB' },
  { id: 5, text: 'Chúc tình mình bền vững', emoji: '💕', color: '#FF6B6B' },
  { id: 6, text: 'Mong những ngày buồn qua mau', emoji: '🌙', color: '#DDA0DD' },
  { id: 7, text: 'Ước được ôm em thật lâu', emoji: '🤗', color: '#F0E68C' },
  { id: 8, text: 'Chúc gia đình hai bên bình an', emoji: '🏠', color: '#98FB98' },
  { id: 9, text: 'Nguyện những điều tốt đẹp đến với em', emoji: '✨', color: '#FFB6C1' },
  { id: 10, text: 'Mong em luôn được yêu thương', emoji: '❤️', color: '#FF6347' },
  { id: 11, text: 'Ước em luôn thành công', emoji: '🌟', color: '#00CED1' },
  { id: 12, text: 'Chúc mình luôn bên nhau', emoji: '💑', color: '#FF69B4' },
];

// Gratitude moments - Những khoảnh khắc tri ân
const GRATITUDES = [
  { icon: 'fas fa-heart', title: 'Cảm Ơn Em Đã Yêu Aiuuuu', desc: 'Cảm ơn em đã chọn aiuuuu, dù aiuuuu có lúc ngốc nghếch, có lúc không biết nói gì...' },
  { icon: 'fas fa-hand-holding-heart', title: 'Cảm Ơn Vì Những Lần Dỗ Dành', desc: 'Khi aiuuuu buồn, em luôn ở đó. Cảm ơn em vì đã dỗ dành aiuuuu!' },
  { icon: 'fas fa-smile', title: 'Cảm Ơn Nụ Cười Của Em', desc: 'Mỗi nụ cười của em làm aiuuuu thấy thế giới đẹp hơn bao giờ hết!' },
  { icon: 'fas fa-moon', title: 'Cảm Ơn Những Đêm Trò Chuyện', desc: 'Những đêm khuya nói chuyện với em là khoảnh khắc aiuuuu yêu nhất!' },
  { icon: 'fas fa-coffee', title: 'Cảm Ơn Những Bữa Ăn Cùng Nhau', desc: 'Dù ăn ở đâu, với ai, miễn là có em thì đều ngon hết!' },
  { icon: 'fas fa-cloud', title: 'Cảm Ơn Vì Đã Thấu Hiểu', desc: 'Em hiểu aiuuuu hơn chính aiuuuu hiểu mình. Cảm ơn em!' },
];

// Weather of Love - Thời tiết tình yêu theo mùa
const LOVE_WEATHER = [
  { season: 'Mùa Xuân', icon: '🌸', temp: '25°C', desc: 'Tình yêu nở hoa như cánh anh đào', color: '#FFB7C5' },
  { season: 'Mùa Hạ', icon: '☀️', temp: '35°C', desc: 'Nắng vàng rực rỡ như tình mình đam mê', color: '#FFD700' },
  { season: 'Mùa Thu', icon: '🍂', temp: '20°C', desc: 'Gió thu dịu dàng như lời thì thầm yêu', color: '#D2691E' },
  { season: 'Mùa Đông', icon: '❄️', temp: '15°C', desc: 'Tay trong tay ấm áp giữa mùa đông lạnh', color: '#E0FFFF' },
];

// Shared moments countdown
const SHARED_MOMENTS = [
  { icon: 'fas fa-utensils', label: 'Bữa ăn cùng nhau', count: 487 },
  { icon: 'fas fa-video', label: 'Cuộc gọi video', count: 365 },
  { icon: 'fas fa-walking', label: 'Lần đi chơi cùng', count: 156 },
  { icon: 'fas fa-bed', label: 'Lần chúc ngủ ngon', count: 500 },
  { icon: 'fas fa-coffee', label: 'Tách cà phê chung', count: 89 },
  { icon: 'fas fa-heart', label: 'Lần nói "yêu em"', count: 9999 },
];

// ==========================================
// HOOKS
// ==========================================

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function useCounterAnimation(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current || target === 0) return;
    started.current = true;
    const startTime = performance.now();
    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    }
    requestAnimationFrame(update);
  }, [isVisible, target, duration]);

  return count;
}

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

function FloatingElements() {
  return (
    <div className={styles.floatingElements}>
      {['💕', '✨', '🌸', '💖', '🌙', '⭐', '💝', '🌈'].map((emoji, i) => (
        <div
          key={i}
          className={styles.floatingItem}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
            fontSize: `${16 + Math.random() * 16}px`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    interface Star {
      x: number; y: number; length: number; speed: number; opacity: number;
    }
    
    const stars: Star[] = [];
    
    function createStar() {
      if (!canvas) return;
      stars.push({
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 3 + 2,
        opacity: 1,
      });
    }
    
    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.02) createStar();
      
      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.y += star.speed;
        star.opacity -= 0.01;
        
        if (star.opacity <= 0 || star.y > canvas.height) {
          stars.splice(i, 1);
          continue;
        }
        
        const gradient = ctx.createLinearGradient(star.x, star.y, star.x + star.length, star.y - star.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x + star.length, star.y - star.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      animId = requestAnimationFrame(animate);
    }
    
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);
  
  return <canvas ref={canvasRef} className={styles.shootingStarsCanvas} />;
}

function StatCard({ icon, target, label, isInfinity, delay }: {
  icon: string; target: number; label: string; isInfinity?: boolean; delay: number;
}) {
  const { ref, isVisible } = useScrollReveal(0.5);
  const count = useCounterAnimation(target, isVisible);

  return (
    <div ref={ref} className={`${styles.statCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 100}ms` }}>
      <div className={styles.statIcon}><i className={icon} /></div>
      <div className={styles.statNumber}>{isInfinity ? '∞' : count.toLocaleString()}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function TimeCapsule({ capsule, onOpen }: { capsule: typeof MEMORY_CAPSULES[0]; onOpen: (id: number) => void }) {
  const { ref, isVisible } = useScrollReveal(0.2);
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    if (!capsule.sealed || isOpened) return;
    setIsOpened(true);
    onOpen(capsule.id);
  };

  return (
    <div
      ref={ref}
      className={`${styles.capsuleCard} ${isVisible ? styles.visible : ''} ${isOpened ? styles.capsuleOpened : ''} ${capsule.sealed && !isOpened ? styles.capsuleSealed : ''}`}
      onClick={handleOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.capsuleEmoji}>{capsule.emoji}</div>
      <div className={styles.capsuleDate}>{capsule.month} {capsule.year}</div>
      <h3 className={styles.capsuleTitle}>{capsule.title}</h3>
      {capsule.sealed && !isOpened && (
        <div className={styles.capsuleLock}>
          <i className="fas fa-lock" />
          <span>Click để mở</span>
        </div>
      )}
      {(isOpened || !capsule.sealed) && (
        <div className={styles.capsuleContent}>
          <p>{capsule.content}</p>
        </div>
      )}
      {capsule.sealed && !isOpened && isHovered && (
        <div className={styles.capsuleHint}>
          <i className="fas fa-hand-pointer" /> Nhấn để khám phá kỷ niệm!
        </div>
      )}
    </div>
  );
}

function WishLeaf({ wish, index }: { wish: typeof WISHES[0]; index: number }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${styles.wishLeaf} ${isVisible ? styles.visible : ''} ${isRevealed ? styles.wishRevealed : ''}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        '--leaf-color': wish.color,
      } as React.CSSProperties}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <span className={styles.wishEmoji}>{wish.emoji}</span>
      {isRevealed && <p className={styles.wishText}>{wish.text}</p>}
    </div>
  );
}

function GratitudeCard({ item, delay }: { item: typeof GRATITUDES[0]; delay: number }) {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <div ref={ref} className={`${styles.gratitudeCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 100}ms` }}>
      <div className={styles.gratitudeIcon}><i className={item.icon} /></div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  );
}

function WeatherCard({ weather }: { weather: typeof LOVE_WEATHER[0] }) {
  const { ref, isVisible } = useScrollReveal(0.3);

  return (
    <div ref={ref} className={`${styles.weatherCard} ${isVisible ? styles.visible : ''}`} style={{ '--weather-color': weather.color } as React.CSSProperties}>
      <div className={styles.weatherIcon}>{weather.icon}</div>
      <div className={styles.weatherSeason}>{weather.season}</div>
      <div className={styles.weatherTemp}>{weather.temp}</div>
      <p className={styles.weatherDesc}>{weather.desc}</p>
    </div>
  );
}

function SharedMomentCounter({ item, delay }: { item: typeof SHARED_MOMENTS[0]; delay: number }) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const count = useCounterAnimation(item.count, isVisible, 1500);

  return (
    <div ref={ref} className={`${styles.momentCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 80}ms` }}>
      <div className={styles.momentIcon}><i className={item.icon} /></div>
      <div className={styles.momentCount}>{count.toLocaleString()}</div>
      <div className={styles.momentLabel}>{item.label}</div>
    </div>
  );
}

function HeartRain() {
  const createHearts = useCallback(() => {
    const hearts = ['💕', '💖', '💗', '💘', '💝', '❤️', '💓', '💞'];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
          position: fixed;
          top: -50px;
          left: ${Math.random() * 100}%;
          font-size: ${Math.random() * 20 + 15}px;
          pointer-events: none;
          z-index: 9999;
          animation: heartFall500 ${Math.random() * 3 + 3}s linear forwards;
        `;
        document.body.appendChild(heart);
        setTimeout(() => document.body.removeChild(heart), 6000);
      }, i * 80);
    }
    
    if (!document.querySelector('#heartFall500Style')) {
      const style = document.createElement('style');
      style.id = 'heartFall500Style';
      style.textContent = `@keyframes heartFall500 { 0% { transform: translateY(-50px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <button className={styles.heartRainBtn} onClick={createHearts}>
      💖 Tạo mưa tim
    </button>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function FiveHundredDaysPage() {
  const [openedCapsules, setOpenedCapsules] = useState<number[]>([]);
  const timeTogether = useTimeTogether();

  const handleCapsuleOpen = (id: number) => {
    setOpenedCapsules(prev => [...prev, id]);
  };

  return (
    <div className={styles.page}>
      {/* Background Effects */}
      <ShootingStars />
      <FloatingElements />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.celebrationBadge}>
              <div className={styles.badgeOrbit}>
                <div className={styles.orbitDot} />
                <div className={styles.orbitDot} />
                <div className={styles.orbitDot} />
              </div>
              <div className={styles.badgeHeart}>💕</div>
              <div className={styles.badgeNumber}>500</div>
              <div className={styles.badgeText}>NGÀY TRI ÂN</div>
            </div>
            
            <h1 className={styles.heroTitle}>
              <span className={styles.lineBig}>Chỉ Tri Ân</span>
              <span className={styles.lineNames}>500 Ngày Bên Nhau</span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              500 ngày trải qua nhiều chuyện buồn vui<br />
              Mong bình an và vui vẻ...
            </p>
            
            {/* Real-time clock together */}
            <div className={styles.togetherClock}>
              <div className={styles.clockLabel}>Thời gian chúng mình bên nhau</div>
              <div className={styles.clockDisplay}>
                <div className={styles.clockUnit}>
                  <span className={styles.clockValue}>{timeTogether.days}</span>
                  <span className={styles.clockLabel}>Ngày</span>
                </div>
                <span className={styles.clockSeparator}>:</span>
                <div className={styles.clockUnit}>
                  <span className={styles.clockValue}>{String(timeTogether.hours).padStart(2, '0')}</span>
                  <span className={styles.clockLabel}>Giờ</span>
                </div>
                <span className={styles.clockSeparator}>:</span>
                <div className={styles.clockUnit}>
                  <span className={styles.clockValue}>{String(timeTogether.minutes).padStart(2, '0')}</span>
                  <span className={styles.clockLabel}>Phút</span>
                </div>
                <span className={styles.clockSeparator}>:</span>
                <div className={styles.clockUnit}>
                  <span className={styles.clockValue}>{String(timeTogether.seconds).padStart(2, '0')}</span>
                  <span className={styles.clockLabel}>Giây</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <span>Cuộn xuống để khám phá</span>
          <div className={styles.scrollArrow}><i className="fas fa-chevron-down" /></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-chart-simple" /> 500 Ngày Bằng Những Con Số
          </h2>
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Shared Moments Counter */}
      <section className={styles.momentsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-handshake" /> Những Khoảnh Khắc Chung
          </h2>
          <p className={styles.sectionSubtitle}>Đếm ngược những điều đẹp đẽ chúng mình đã cùng nhau</p>
          <div className={styles.momentsGrid}>
            {SHARED_MOMENTS.map((item, i) => (
              <SharedMomentCounter key={i} item={item} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Time Capsule Section */}
      <section className={styles.capsulesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-hourglass-half" /> Khoáy Tím Thời Gian
          </h2>
          <p className={styles.sectionSubtitle}>Những kỷ niệm được niêm phong theo tháng ngày - Click để mở!</p>
          <div className={styles.capsulesGrid}>
            {MEMORY_CAPSULES.map((capsule) => (
              <TimeCapsule key={capsule.id} capsule={capsule} onOpen={handleCapsuleOpen} />
            ))}
          </div>
        </div>
      </section>

      {/* Wishes Tree Section */}
      <section className={styles.wishesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-tree" /> Cây Ước Nguyện
          </h2>
          <p className={styles.sectionSubtitle}>Những điều ước của aiuuuu dành cho em - Click vào lá để xem!</p>
          <div className={styles.wishesTree}>
            <div className={styles.treeTrunk}>
              <i className="fas fa-heart" />
            </div>
            <div className={styles.leavesContainer}>
              {WISHES.map((wish, i) => (
                <WishLeaf key={wish.id} wish={wish} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weather of Love Section */}
      <section className={styles.weatherSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-cloud-sun" /> Thời Tiết Tình Yêu
          </h2>
          <p className={styles.sectionSubtitle}>Bốn mùa yêu thương của đôi mình</p>
          <div className={styles.weatherGrid}>
            {LOVE_WEATHER.map((weather) => (
              <WeatherCard key={weather.season} weather={weather} />
            ))}
          </div>
        </div>
      </section>

      {/* Gratitude Section */}
      <section className={styles.gratitudeSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-hands-praying" /> Lời Tri Ân
          </h2>
          <p className={styles.sectionSubtitle}>Không hứa hẹn gì lớn lao - chỉ cảm ơn em vì đã ở đây</p>
          <div className={styles.gratitudeGrid}>
            {GRATITUDES.map((item, i) => (
              <GratitudeCard key={i} item={item} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Letter */}
      <section className={styles.letterSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-envelope-open-text" /> Thư Cảm Ơn
          </h2>
          <div className={styles.letterContainer}>
            <div className={styles.letterPaper}>
              <div className={styles.letterHeader}>
                <span className={styles.letterEmoji}>💌</span>
                <h3>Gửi Công Chúa Iuuu Của Aiuuuu</h3>
                <p className={styles.letterDate}>Ngày 500 - Tháng 8/2026</p>
              </div>
              <div className={styles.letterBody}>
                <p>Em iuuu của aiuuuu ơiii,</p>
                <p>
                  500 ngày rồi... Nghe có vẻ nhiều, nhưng aiuuuu mong nó còn dài hơn nữa. 
                  Không phải vì aiuuuu sợ mất em, mà vì mỗi ngày có em là một ngày aiuuuu thấy may mắn.
                </p>
                <p>
                  Hôm nay aiuuuu không hứa gì lớn lao đâu. Aiuuuu chỉ muốn nói <strong>CẢM ƠN EM</strong>.
                </p>
                <p>
                  Cảm ơn em đã đến bên aiuuuu. 
                  Cảm ơn em đã dỗ dành aiuuuu. 
                  Cảm ơn em đã cười với aiuuuu khi aiuuuu mệt mỏi. 
                  Cảm ơn em đã ở đây, vẫn ở đây, và sẽ còn ở đây.
                </p>
                <p>
                  500 ngày qua, có những lúc aiuuuu giận em, có những lúc em giận aiuuuu. 
                  Nhưng aiuuuu biết, cuối cùng aiuuuu vẫn muốn nắm tay em. 
                  Vì thế mà <strong>không có gì quan trọng hơn việc chúng mình vẫn còn bên nhau</strong>.
                </p>
                <p>
                  Mong những ngày tiếp theo, em sẽ luôn bình an, vui vẻ. 
                  Nếu có khó khăn, aiuuuu sẽ cố gắng để em đỡ vất vả hơn. 
                  Nếu có buồn, aiuuuu sẽ ở đây để ôm em.
                </p>
                <p>
                  Chỉ tri ân. Tri ân vì em đã yêu aiuuuu. 
                  Tri ân vì mỗi sáng aiuuuu thức dậy còn có em. 
                  Tri ân vì 500 ngày đã qua và aiuuuu vẫn yêu emm.
                </p>
                <p className={styles.letterHighlight}>
                  Cảm ơn em đã đến, đã ở lại, và đã chọn aiuuuu. 💕
                </p>
              </div>
              <div className={styles.letterSignature}>
                <p>Yêu em và tri ân,</p>
                <p className={styles.signatureName}>❤️ Aiuuuu của emmmm ❤️</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.celebrationFooter}>
        <div className={styles.container}>
          <div className={styles.footerMessage}>
            <h3>500 ngày là mãi mãi...</h3>
            <p>
              Chỉ mong bình an và vui vẻ bên nhau 💕
            </p>
          </div>
          <div className={styles.footerNav}>
            <Link href="/memories" className={styles.footerBtn}><i className="fas fa-heart" /> Kỷ niệm</Link>
            <Link href="/timeline" className={styles.footerBtn}><i className="fas fa-clock" /> Đếm ngày</Link>
            <Link href="/300days" className={styles.footerBtn}><i className="fas fa-gem" /> 300 ngày</Link>
            <Link href="/1year" className={styles.footerBtn}><i className="fas fa-trophy" /> 1 Năm</Link>
          </div>
          <p className={styles.footerCopy}>&copy; 2025-2026 - Tri ân 500 ngày của Bằng &amp; Duyên 💕</p>
        </div>
      </footer>

      {/* Heart Rain Button */}
      <HeartRain />
    </div>
  );
}
