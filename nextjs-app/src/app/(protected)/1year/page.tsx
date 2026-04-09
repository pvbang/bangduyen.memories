'use client';

/**
 * 1 Year Anniversary Page
 * Route: /1year
 * Chuyển đổi từ 1year.html + 1year.css + 1year.js
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './oneyear.module.css';

// ==========================================
// DATA
// ==========================================

const STATS = [
  { icon: 'fas fa-heart', target: 365, label: 'Ngày iuuu nhau' },
  { icon: 'fas fa-clock', target: 8760, label: 'Giờ hạnh phúccc' },
  { icon: 'fas fa-star', target: 525600, label: 'Phút nhớ eiuuuu' },
  { icon: 'fas fa-infinity', target: 0, label: 'Tình iuuuuu', isInfinity: true },
];

const JOURNEY_ITEMS = [
  { date: '23/03/2025', title: 'Ngày Bắt Đầuuu 💕', emoji: '🌸', season: 'spring',
    text: 'Ngày định mệnh đóaaa! Khoảnh khắc aiuuuu lấy hết can đảm nói lời tỏ tình, tim đập chân run nhưng ánh mắt eiuuuu cho aiuuuu sự vững tin lạ thường. Rồi eiuuuu đồng ý! Thế giới của aiuuuu chính thức có thêm một mặt trời nhỏ mang tên Emmmmm! heheh' },
  { date: '01/07/2025', title: '100 Ngày Iuuu 👑', emoji: '☀️', season: 'summer',
    text: 'Tròn 100 ngày gòiii! Aiuuuu đã tốt nghiệp xuất sắc khóa "chiều chuộng công chúaaa" chưa nhỉ? Chắc là rồi hee :)) 100 ngày "tập sự" làm người iuuu, đạt loại giỏi luôn đóa!' },
  { date: '08/10/2025', title: 'Sinh Nhật Công Chúaaa 🎀', emoji: '🎂', season: 'summer',
    text: 'Sinh nhật đầu tiên của eiuuuu khi có aiuuuu ở bên cạnhhh! Chúc công chúaaa iuuuu mãi xinh đẹpp, hạnh phúccc và luôn được iuuu thươnnn nhee!' },
  { date: '09/10/2025', title: '200 Ngày Bên Nhau 📸', emoji: '🍂', season: 'autumn',
    text: '200 ngày, album ảnh đã đầy ắp nụ cười gòi đóa! Đi đâu cũm được, ăn chi cũm ngon, miễn là có eiuuuu đi cùng! Hành trình này cứ zậy mà dài vô tận nhié!' },
  { date: '28/10/2025', title: 'Sinh Nhật Aiuuuu 🎉', emoji: '🎃', season: 'autumn',
    text: 'Sinh nhật đầu tiên của aiuuuu khi có eiuuuu ở bênnn. Món quà lớn nhất chính là được ở bên công chúaaa iuuuu của aiuuuu đóaaa! heheh' },
  { date: '17/01/2026', title: '300 Ngày Iuuu Thưnnnn 🥰', emoji: '💎', season: 'winter',
    text: '300 ngày - con số tròn trĩnh, nma tình iuuu aiuuuu dành cho eiuuuu thì khom có điểm dừng, nó cứ lớn lớn lớn mãi thôi! Cùng nắm tay chạy tiếp marathon tình iuuu nhóo công chúaaa!' },
  { date: '14/02/2026', title: 'Valentine Đầu Tiên 🌹', emoji: '💕', season: 'winter',
    text: 'Valentine đầu tiên chính thức bên nhauuu! Ngày lễ tình nhân thêm ý nghĩa biết bao khi có eiuuuu ở bên cạnhh! Iuuu eiuuuu nhiềuuuu lắmmm!' },
  { date: '23/03/2026', title: '1 NĂM IUU NHAUUU! 🎊', emoji: '🏆', season: 'spring', featured: true,
    text: '365 ngàyyyy! Tròn 1 năm iuuu nhau gòiii! Cảm ơn eiuuuu đã luôn ở bênnn, cảm ơn vì tất cả những kỷ niệm tuyệt vờiii. Đây mới chỉ là chương mở đầu thôi nhóo, còn bao nhiêu chương đẹp hơn nữa phía trước! heheh 💕' },
];

const MONTHS = [
  { num: '01', title: 'Tháng 3/2025', desc: 'Khởi đầu - Tỏ tình & thành đôiii', hue: 340 },
  { num: '02', title: 'Tháng 4/2025', desc: 'Tìm hiểu - Học cách iuuu nhau', hue: 330 },
  { num: '03', title: 'Tháng 5/2025', desc: 'Gắn kết - Ngày càng thân thiếttt', hue: 320 },
  { num: '04', title: 'Tháng 6/2025', desc: 'Ấm áp - Mùa hè iuuu thươnnn', hue: 310 },
  { num: '05', title: 'Tháng 7/2025', desc: '100 ngày - Cột mốc đầu tiênn!', hue: 300 },
  { num: '06', title: 'Tháng 8/2025', desc: 'Trưởng thành - Hiểu nhau hơnn', hue: 290 },
  { num: '07', title: 'Tháng 9/2025', desc: 'Thu sang - Lãng mạn mùa thuuu', hue: 280 },
  { num: '08', title: 'Tháng 10/2025', desc: 'Sinh nhật - Tháng sinh nhật cả haii!', hue: 350 },
  { num: '09', title: 'Tháng 11/2025', desc: 'Đông đến - Ôm nhau cho ấmmm', hue: 0 },
  { num: '10', title: 'Tháng 12/2025', desc: 'Giáng sinh - Noel ngọt ngàoo', hue: 10 },
  { num: '11', title: 'Tháng 1/2026', desc: '300 ngày - Năm mới bên nhauuu', hue: 345 },
  { num: '12', title: 'Tháng 2-3/2026', desc: 'Valentine & Kỷ niệm 1 nămmm!', hue: 335 },
];

const GIF_PARTS = [
  { src: '/data/images/gifs/memories_part1.gif', caption: 'Phần 1 — Những ngày đầu tiên', icon: 'fas fa-seedling', label: 'Khởi đầu' },
  { src: '/data/images/gifs/memories_part2.gif', caption: 'Phần 2 — Ngày càng gắn bó', icon: 'fas fa-heart', label: 'Gắn kết' },
  { src: '/data/images/gifs/memories_part3.gif', caption: 'Phần 3 — Những kỷ niệm đẹp', icon: 'fas fa-star', label: 'Rực rỡ' },
  { src: '/data/images/gifs/memories_part4.gif', caption: 'Phần 4 — Và còn tiếp mãiii', icon: 'fas fa-infinity', label: 'Mãi iuuu' },
];

const PROMISES = [
  { icon: '🛡️', title: 'Bảo Vệ Eiuuuu', desc: 'Luôn là bức tường vững chắc che chắn cho công chúaaa iuuuu của aiuuuu đóaaa' },
  { icon: '👂', title: 'Lắng Nghe Eiuuuu', desc: 'Dù bận đến mấy cũm sẽ dành thời gian lắng nghe eiuuuu kể chuyện nhóo' },
  { icon: '🤗', title: 'Ôm Eiuuuu Nhiều Hơn', desc: 'Ôm hunn eiuuu thật nhiềuu khi eiuuuu ở bên heheh :)))' },
  { icon: '🎯', title: 'Cố Gắng Hơnn', desc: 'Trở thành phiên bản xịn xò nhất để xứng đáng với eiuuuu nhóo' },
  { icon: '😊', title: 'Làm Eiuuuu Cười', desc: 'Làm trò con bò cho eiuuuu cười mỗi ngày heheh' },
  { icon: '🏠', title: 'Xây Tổ Ấmmm', desc: 'Từng bước chuẩn bị cho tương lai hạnh phúc của hai đứa mìnhhh nhóo!' },
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
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    }
    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);

  return count;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function FloatingHearts() {
  const hearts = ['💕', '💖', '💗', '💝', '❤️', '🌸', '✨', '🩷'];
  return (
    <div className={styles.floatingHearts}>
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          className={styles.floatHeart}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            fontSize: `${14 + Math.random() * 20}px`,
          }}
        >
          {hearts[i % hearts.length]}
        </div>
      ))}
    </div>
  );
}

function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      alpha: number; decay: number; size: number; color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#FF69B4', '#FFD700', '#FF1493', '#FF91A4', '#FFC0CB', '#FF6B6B', '#FFE66D'];

    function createBurst(x: number, y: number) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x, y, color,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.01 + Math.random() * 0.02,
          size: Math.random() * 3 + 1,
        });
      }
    }

    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Auto fireworks on load
    let count = 0;
    const auto = setInterval(() => {
      createBurst(
        Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
        Math.random() * canvas.height * 0.4 + 50
      );
      count++;
      if (count > 8) clearInterval(auto);
    }, 600);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      clearInterval(auto);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.fireworksCanvas} />;
}

function StatCard({ icon, target, label, isInfinity, delay }: {
  icon: string; target: number; label: string; isInfinity?: boolean; delay: number;
}) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const count = useCounterAnimation(target, isVisible);

  return (
    <div ref={ref} className={`${styles.statCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 100}ms` }}>
      <div className={styles.statIcon}><i className={icon} /></div>
      <div className={styles.statNumber}>{isInfinity ? '∞' : count.toLocaleString()}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function JourneyItem({ item }: { item: typeof JOURNEY_ITEMS[0] }) {
  const { ref, isVisible } = useScrollReveal(0.2);
  return (
    <div ref={ref} className={`${styles.journeyItem} ${isVisible ? styles.visible : ''} ${item.featured ? styles.journeyItemFeatured : ''}`}>
      <div className={styles.journeyMarker}><span>{item.emoji}</span></div>
      <div className={styles.journeyCard}>
        <div className={styles.journeyDate}>{item.date}</div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </div>
  );
}

function GifShowcase() {
  const [activeGif, setActiveGif] = useState(0);

  return (
    <div className={styles.gifShowcase}>
      <div className={styles.gifPlayer}>
        <div className={styles.gifFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GIF_PARTS[activeGif].src}
            alt="Kỷ niệm Bằng & Duyên"
            className={styles.gifImage}
          />
        </div>
        <div className={styles.gifCaption}>{GIF_PARTS[activeGif].caption}</div>
      </div>
      <div className={styles.gifControls}>
        {GIF_PARTS.map((part, i) => (
          <button
            key={i}
            className={`${styles.gifBtn} ${i === activeGif ? styles.gifBtnActive : ''}`}
            onClick={() => setActiveGif(i)}
          >
            <span className={styles.gifBtnIcon}><i className={part.icon} /></span>
            <span className={styles.gifBtnLabel}>{part.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineIndexRef = useRef(0);

  useEffect(() => {
    fetch('/data/365-ngay-viet-cho-em.txt')
      .then(r => r.text())
      .then(text => {
        const rawLines = text.split('\n');
        const filtered: string[] = [];
        const skipPattern = /^[═🎵©]/;

        rawLines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) { filtered.push(''); return; }
          if (skipPattern.test(trimmed)) return;
          if (trimmed.startsWith('Sáng tác:') || trimmed.startsWith('Kỷ niệm') || trimmed.startsWith('Ballad') || trimmed.startsWith('"Anh vô tình')) return;
          filtered.push(trimmed);
        });
        setLyrics(filtered);
      })
      .catch(() => {
        setLyrics(['[Không thể tải lời bài hát]']);
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        lineIndexRef.current = 0;
        timerRef.current = setInterval(() => {
          const singableLines = lyrics.filter(l => l.trim() !== '' && !l.match(/^\[.+\]$/));
          if (lineIndexRef.current >= singableLines.length) {
            lineIndexRef.current = 0;
            setActiveLine(-1);
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
            return;
          }
          // Find actual index in lyrics array
          let count = 0;
          let realIndex = -1;
          for (let i = 0; i < lyrics.length; i++) {
            if (lyrics[i].trim() !== '' && !lyrics[i].match(/^\[.+\]$/)) {
              if (count === lineIndexRef.current) { realIndex = i; break; }
              count++;
            }
          }
          setActiveLine(realIndex);
          lineIndexRef.current++;
        }, 2800);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setActiveLine(-1);
      }
      return next;
    });
  }, [lyrics]);

  return (
    <div className={styles.vinylPlayer}>
      <div className={styles.vinylDiscWrap}>
        <div className={`${styles.vinylDisc} ${isPlaying ? styles.vinylDiscSpinning : ''}`}>
          <div className={styles.vinylGrooves} />
          <div className={styles.vinylLabel}>
            <span className={styles.vinylTitle}>365 Ngày</span>
            <span className={styles.vinylArtist}>Bằng &amp; Duyên</span>
            <span className={styles.vinylHeart}>💕</span>
          </div>
        </div>
        <div className={`${styles.vinylArm} ${isPlaying ? styles.vinylArmActive : ''}`} />
      </div>
      <div className={styles.lyricsPanel}>
        <div className={styles.lyricsHeader}>
          <div className={styles.lyricsInfo}>
            <h3>365 Ngày Viết Cho Em</h3>
            <p>Bằng viết tặng Duyên iuuu</p>
          </div>
          <button className={styles.lyricsPlayBtn} onClick={togglePlay}>
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`} />
          </button>
        </div>
        <div className={styles.lyricsScroll} ref={scrollRef}>
          <div>
            {lyrics.map((line, i) => {
              if (line === '') return <div key={i} className={styles.lyricsLineEmpty} />;
              if (line.match(/^\[.+\]$/)) return <div key={i} className={`${styles.lyricsLine} ${styles.lyricsLineSection}`}>{line}</div>;
              return (
                <div
                  key={i}
                  className={`${styles.lyricsLine} ${i === activeLine ? styles.lyricsLineActive : ''}`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function OneYearPage() {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Reveal sections
  const statsRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const monthsRef = useRef<HTMLElement>(null);
  const gifRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLElement>(null);
  const promisesRef = useRef<HTMLElement>(null);
  const vinylRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = [statsRef, journeyRef, monthsRef, gifRef, letterRef, promisesRef, vinylRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* Fireworks Canvas */}
      <FireworksCanvas />

      {/* Floating Hearts */}
      <FloatingHearts />

      {/* Hero Section */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.anniversaryBadge}>
              <div className={styles.badgeRing} />
              <div className={styles.badgeInner}>
                <span className={styles.badgeNumber}>1</span>
                <span className={styles.badgeText}>NĂM</span>
              </div>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.lineSmall}>Kỷ Niệm</span>
              <span className={styles.lineBig}>1 Năm Yêu Nhau</span>
              <span className={styles.lineNames}>Bằng &amp; Duyên</span>
            </h1>
            <p className={styles.heroSubtitle}>23/03/2025 — 23/03/2026</p>
            <p className={styles.heroDesc}>
              365 ngày, 8760 giờ, 525600 phút iuuu thươnnn<br />
              và hành trình còn dài dài dàiii phía trước nữaa...
            </p>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <span>Cuộn xuống khám phá</span>
          <div className={styles.scrollArrow}><i className="fas fa-chevron-down" /></div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className={`${styles.statsSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-chart-line" /> 365 Ngày Bằng Những Con Số</h2>
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section ref={journeyRef} className={`${styles.journeySection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-route" /> Hành Trình 365 Ngày</h2>
          <p className={styles.sectionSub}>Những cột mốc đáng nhớ trong năm đầu tiên của đôi mìnhh</p>
          <div className={styles.journeyTimeline}>
            <div className={styles.journeyLine} />
            {JOURNEY_ITEMS.map((item, i) => (
              <JourneyItem key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 12 Months */}
      <section ref={monthsRef} className={`${styles.monthsSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-calendar-alt" /> 12 Tháng Iuuu Thươnnn</h2>
          <p className={styles.sectionSub}>Mỗi tháng mang một sắc màu riêng heheh</p>
          <div className={styles.monthsGrid}>
            {MONTHS.map((month, i) => (
              <div key={i} className={styles.monthCard} style={{ '--hue': month.hue } as React.CSSProperties}>
                <div className={styles.monthNum}>{month.num}</div>
                <h4>{month.title}</h4>
                <p>{month.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIF Showcase */}
      <section ref={gifRef} className={`${styles.gifSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-film" /> Khoảnh Khắc Của Đôi Mìnhh</h2>
          <p className={styles.sectionSub}>97 bức ảnh, 365 ngày, 1 tình iuuu mãi mãiii</p>
          <GifShowcase />
        </div>
      </section>

      {/* Love Letter */}
      <section ref={letterRef} className={`${styles.letterSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-envelope-open-text" /> Thư Tình 1 Năm</h2>
          <div className={styles.letterContainer}>
            <div className={`${styles.envelope} ${isEnvelopeOpened ? styles.envelopeOpened : ''}`} onClick={() => setIsEnvelopeOpened(!isEnvelopeOpened)}>
              <div className={styles.envelopeFlap} />
              <div className={styles.heartSeal}><i className="fas fa-heart" /></div>
              <div className={styles.letterPaper}>
                <div className={styles.letterHeader}>
                  <h2>Gửi Công Chúaaa Iuuuu Của Aiuuuu 👑</h2>
                  <p className={styles.letterDate}>Ngày 23 tháng 3 năm 2026</p>
                </div>
                <div className={styles.letterBody}>
                  <p>Eiuuuu của aiuuuu ơiii,</p>
                  <p>Vèo cái mà đã tròn 1 năm rồi đóa, nhanh quó đi thôiii! Nhớ lại ngày 23/03 năm ngoái, aiuuuu lấy hết can đảm để nói lời tỏ tình. Tim đập, chân run, nma ánh mắt eiuuuu cho aiuuuu sự an tâm lạ thường. Rồi eiuuuu đồng ý - khoảnh khắc đóa aiuuuu hạnh phúc nhất đời luôn á!</p>
                  <p>365 ngày qua, mình đã trải qua biết bao điều cùng nhau rồi đóa. Từ những buổi hẹn hò đầu tiên bỡ ngỡ, đến những lần giận nhau rồi lại làm hòa, từ 100 ngày, 200 ngày, 300 ngày... mỗi cột mốc đều là một kỷ niệm đáng trân trọng hếttt.</p>
                  <p>Eiuuuu biết khom, 1 năm trước aiuuuu chỉ là &quot;ông tướng ngáo ngơ&quot; đi tìm mảnh ghép cuộc đời. Giờ thì aiuuuu đã tìm được rồi nhóo - <span className={styles.highlight}>mảnh ghép hoàn hảo mang tên Duyên</span>. Eiuuuu chính là điều tuyệt vời nhất mà cuộc đời mang đến cho aiuuuu đóaaa!</p>
                  <p>Cảm ơn eiuuuu vì đã chịu đựng sự &quot;nhây&quot; của aiuuuu heheh, cảm ơn eiuuuu vì những lúc dỗ dành, cảm ơn eiuuuu vì mỗi nụ cười ngọt ngào. 1 năm qua, aiuuuu đã học được cách iuuu một người bằng cả trái tim!</p>
                  <p>1 năm chỉ là chương mở đầu thôi nhóo heheh! Cuốn sách tình iuuu của mình còn nhiều nhiều chương nữa cơ. Mình cùng viết tiếp nhee, hứa sẽ ngày càng hạnh phúc hơn nhóo!</p>
                  <p><strong>Iuuuuu eiuuuu nhiều hơn cả 365 ngày, thương eiuuuu hơn cả 525600 phút, nhớ eiuuuu hơn cả mọi vì sao trên trời! Mãi bên nhau emmm nhóoo! 💕</strong></p>
                </div>
                <div className={styles.letterSignature}>
                  <p>Người iuuuuu eiuuuu nhất trần đời,</p>
                  <p>❤️ Quàng tử của emmmm ❤️</p>
                </div>
              </div>
            </div>
            {!isEnvelopeOpened && (
              <p className={styles.envelopeHint}>
                <i className="fas fa-hand-pointer" /> Click vào phong bì để mở thư nhóo công chúaaa!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section ref={promisesRef} className={`${styles.promisesSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-hand-holding-heart" /> Lời Hứa Năm Thứ 2</h2>
          <p className={styles.sectionSub}>Những điều aiuuuu hứa sẽ làm cho eiuuuu trong năm tiếp theo nhóo</p>
          <div className={styles.promisesGrid}>
            {PROMISES.map((p, i) => (
              <div key={i} className={styles.promiseCard}>
                <div className={styles.promiseIcon}>{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vinyl Lyrics Player */}
      <section ref={vinylRef} className={`${styles.vinylSection} ${styles.revealSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}><i className="fas fa-compact-disc" /> 365 Ngày Viết Cho Em</h2>
          <p className={styles.sectionSub}>Bài hát aiuuu sáng tác tặng công chúaaa iuuu nhân 1 năm bên nhau 🎵</p>
          <VinylPlayer />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.anniversaryFooter}>
        <div className={styles.container}>
          <div className={styles.footerMessage}>
            <h3>1 năm chỉ là khởi đầu thôi ...</h3>
            <p>Còn cả cuộc đời hạnh phúc đang chờ đợi đôi mình phía trướccc 💕</p>
          </div>
          <div className={styles.footerNav}>
            <Link href="/memories" className={styles.footerBtn}><i className="fas fa-heart" /> Kỷ niệm</Link>
            <Link href="/timeline" className={styles.footerBtn}><i className="fas fa-clock" /> Đếm ngày</Link>
            <Link href="/300days" className={styles.footerBtn}><i className="fas fa-gem" /> 300 ngày</Link>
            <Link href="/gallery" className={styles.footerBtn}><i className="fas fa-images" /> Thư viện ảnh</Link>
          </div>
          <p className={styles.footerCopy}>&copy; 2025-2026 - Tình iuuuu của Bằng &amp; Duyên 💕</p>
        </div>
      </footer>
    </div>
  );
}
