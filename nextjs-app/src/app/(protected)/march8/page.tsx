'use client';

/**
 * March 8 Page - Ngày 8/3
 * Route: /march8
 * Chuyển đổi từ march8.html + march8.css + march8.js
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './march8.module.css';

// ==========================================
// DATA
// ==========================================

const START_DATE = new Date('2025-03-23T00:00:00');

const WISHES = [
  { emoji: '🌹', title: 'Xinh Mãi Xinh Mãi', text: 'Chúc eiuuu luôn xinh đẹp rạng ngời - mà thật ra em hổng cần chúc vì em xinh sẵn rồi khỏi cần cố gắng! Anh ngắm hoài hổng chán á :>>>' },
  { emoji: '🌷', title: 'Khỏe Re Như Con Dee :))))', text: 'Chúc em khỏe mạnh, ăn ngon ngủ kỹ nha! Đừng có thức khuya rồi mai dậy mặt sưng vù nha công chúaaa. Anh cần em khỏe để còn đi ăn vặt cùng anh chứ!' },
  { emoji: '🌸', title: 'Cười Bể Bụng', text: 'Chúc em mỗi ngày đều có lý do để cười toe toét! Mà nếu hổng có thì cứ nhìn mặt anh là đủ cười rồi đúng hom :)))))' },
  { emoji: '🌺', title: 'Thành Công Vang Dội', text: 'Chúc em đạt được hết mọi thứ em muốn! Eiuuu của a giỏi lắm rồi, cố lên tí nữa là perfect! Anh đây lúc nào cũng là fan cứng số 1 của em nhee' },
  { emoji: '💐', title: 'Được Iuuu Trọn Đời', text: 'Chúc em luôn được iuuu thương. Mà khỏi lo, chừng nào anh còn thở thì em còn được "cưng hết nấc, chiều hết mức" hẹ hẹ :))))))' },
  { emoji: '🌻', title: 'Tỏa Sáng Như Mặt Trời', text: 'Chúc em sáng lấp lánh hơn cả kim cương! Mà nói thiệt, em đi tới đâu thì chỗ đó có ánh sáng, vì em chính là nắng của đời anh đóa nhee' },
];

const COUPONS = [
  { icon: '🍜', title: 'Bữa Ăn Ngon', desc: 'Anh nấu (hoặc order) cho em 1 bữa em muốn!' },
  { icon: '🎬', title: 'Date Xem Phim', desc: 'Em chọn phim, anh mua bắp rang bơ + nước!' },
  { icon: '🤗', title: 'Ôm Miễn Phí', desc: '1 cái ôm siêu chặt, thời gian không giới hạn! (ôm + hun + sờ sờ sờ :))))' },
  { icon: '💆', title: 'Massage VIP', desc: 'Anh bóp vai, bóp chân, đấm lưng cho em thoải mái!' },
  { icon: '📸', title: 'Chụp Ảnh Cùng', desc: '1 buổi đi chụp ảnh photobooth tùy em chọn!' },
  { icon: '👑', title: 'Nghe Lời Em 1 Ngày', desc: 'Em nói gì anh cũng "dạ" - quyền lực tối thượng!' },
];

const FLOWER_RAIN_ITEMS = [
  { emoji: '🌹', x: '5%', d: '0s' }, { emoji: '🌷', x: '12%', d: '.4s' },
  { emoji: '🌸', x: '20%', d: '.8s' }, { emoji: '🌺', x: '28%', d: '1.2s' },
  { emoji: '🌻', x: '35%', d: '.2s' }, { emoji: '🌼', x: '42%', d: '.6s' },
  { emoji: '🌹', x: '50%', d: '1s' }, { emoji: '🌷', x: '58%', d: '.3s' },
  { emoji: '🌸', x: '65%', d: '.7s' }, { emoji: '💐', x: '72%', d: '1.1s' },
  { emoji: '🌺', x: '80%', d: '.5s' }, { emoji: '🌻', x: '88%', d: '.9s' },
  { emoji: '🌹', x: '95%', d: '1.3s' },
];

const BIG_FLOWER_RAIN = [
  { emoji: '🌹', x: '15%', d: '.5s' }, { emoji: '🌸', x: '45%', d: '1s' },
  { emoji: '🌷', x: '75%', d: '.2s' }, { emoji: '🌺', x: '30%', d: '.8s' },
  { emoji: '💐', x: '60%', d: '1.2s' }, { emoji: '🌻', x: '88%', d: '.6s' },
];

const SPARKLE_DATA = [
  { bx: '-60px', by: '-80px', bd: '0s', emoji: '✨' },
  { bx: '70px', by: '-60px', bd: '.4s', emoji: '💫' },
  { bx: '-80px', by: '10px', bd: '.8s', emoji: '✨' },
  { bx: '85px', by: '20px', bd: '1.2s', emoji: '💫' },
  { bx: '-40px', by: '-100px', bd: '.6s', emoji: '⭐' },
  { bx: '50px', by: '-95px', bd: '1s', emoji: '✨' },
];

interface LyricLine {
  text: string;
  em?: boolean;
  cho?: boolean;
}

interface LyricSectionData {
  tag: string;
  lines: LyricLine[];
}

const LYRICS: LyricSectionData[] = [
  { tag: '🎵 Intro', lines: [
    { text: '[Piano nhẹ nhàng, guitar fingerstyle...]', em: true },
    { text: 'Eiuuu ơi... nghe anh kể nha...' },
    { text: 'Câu chuyện bắt đầu... từ chiều tháng Hai...' },
  ]},
  { tag: '🎤 Verse 1 — Chiều Tháng Hai', lines: [
    { text: 'Chiều tháng Hai, Đà Nẵng nắng dịu dàng,' },
    { text: 'Em bước vào phòng, tựa ánh trăng vàng.' },
    { text: 'Chỉ một nụ cười, chào khẽ mọi người,' },
    { text: 'Mà trái tim anh đã rơi... từ giây phút ấy rồi.' },
    { text: '' },
    { text: 'Hôm sau em nhắn: "Anh ơi, hỏi xíu nha"', em: true },
    { text: 'Từ dòng tin ấy, bắt đầu chuyện đôi ta.' },
    { text: 'Từng con chữ nhỏ dệt nên sợi tơ duyên,' },
    { text: 'Messenger đổi màu, và tim anh cũng đổi thành yêu em.' },
  ]},
  { tag: '🌸 Pre-Chorus', lines: [
    { text: 'Bởi vì cuộc gặp mình là ngẫu nhiên,' },
    { text: 'Nhưng anh dừng lại đưa tay... và em nắm chặt.' },
    { text: 'Có những tình cảm không phải tạm thương,' },
    { text: 'Mà là trọn đời, là mãi, là muôn vàn yêu thương.' },
  ]},
  { tag: '💕 Chorus', lines: [
    { text: 'Hai-ba tháng Ba, anh nói "yêu em",', cho: true },
    { text: 'Em gật đầu cười, thế giới dịu êm.', cho: true },
    { text: 'Từ đó có Bằng, từ đó có Duyên,', cho: true },
    { text: 'Mình bên nhau rồi, tình đẹp vô biên.', cho: true },
    { text: '' },
    { text: 'Yêu em cao hơn núi, yêu rộng hơn cả trời,', cho: true },
    { text: 'Bay ra vũ trụ, giãn nở không thôi.', cho: true },
    { text: 'Ai hỏi vũ trụ là gì, anh cười:', cho: true },
    { text: '"Là em đó thôi — là em, là cả cuộc đời."', cho: true },
  ]},
  { tag: '🎤 Verse 3 — Chặng Đường Bên Nhau', lines: [
    { text: 'Trăm ngày bên nhau, tập yêu từng chút,' },
    { text: 'Hơn ba trăm ngày rồi, vẫn ngọt như lúc đầu.' },
    { text: 'Album đầy ắp nụ cười trong veo,' },
    { text: 'Đi đâu cũng vui, miễn có em theo.' },
    { text: '' },
    { text: 'Valentine có hoa, Trung Thu có em,' },
    { text: 'Sinh nhật có bánh, Noel có đèn.' },
    { text: 'Nhưng với anh, ngày nào cũng là lễ,' },
    { text: 'Bởi bên cạnh anh, đã có em kề.' },
  ]},
  { tag: '🌉 Bridge — Lời Hứa', lines: [
    { text: '(Chậm lại, chân thành, chỉ còn piano...)', em: true },
    { text: 'Em nói: "Mình cùng nhau làm nhiều điều cùng nhau,', em: true },
    { text: 'Đi thật nhiều nơi, yêu nhau thật nhiều..."', em: true },
    { text: 'Anh hứa: nghiêm túc từ ngày đầu tiên,' },
    { text: 'Xem em là vợ, là nhà, là bình yên.' },
    { text: '' },
    { text: 'Quá khứ em buồn là chiếc bánh dở,' },
    { text: 'Anh xin ăn hết, rồi đền em bánh mới nhé.' },
    { text: 'Nỗi nhớ anh đâu giống sao trên trời,' },
    { text: 'Vì sao có bữa quên mọc, còn anh nhớ em suốt đời.' },
  ]},
  { tag: '💕 Final Chorus', lines: [
    { text: 'Hai-ba tháng Ba, anh nói "yêuuu em",', cho: true },
    { text: 'Em gật đầu cười, thế giới dịu êm.', cho: true },
    { text: 'Từ đó có Bằng, từ đó có Duyên,', cho: true },
    { text: 'Duyên mình là mãi mãi — không bao giờ thay!', cho: true },
    { text: '' },
    { text: 'Chữ thương chẳng đổi, chẳng dời,', cho: true },
    { text: 'Đôi ta hẹn ước một đời thủy chung.', cho: true },
    { text: 'Gió mây bay ở không trung,', cho: true },
    { text: 'Hai ta hạnh phúc, về chung một nhà.', cho: true },
  ]},
  { tag: '🎵 Outro', lines: [
    { text: '(Nhỏ dần, guitar nhẹ...)', em: true },
    { text: 'Iuuu em... iuuuuu em... mãi luôn đóa...' },
    { text: 'Moa moa... moa... 💕' },
    { text: '(...Yêu em, chúc công chúa yêu của anh ngủ ngoan, mơ anh yêu qua ôm, hun, chụt chụt...)', em: true },
  ]},
];

// ==========================================
// COMPONENT
// ==========================================

export default function March8Page() {
  const [showIntro, setShowIntro] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [couponUsed, setCouponUsed] = useState<boolean[]>(new Array(COUPONS.length).fill(false));
  const [countDays, setCountDays] = useState(0);
  const [countHours, setCountHours] = useState(0);
  const [countMins, setCountMins] = useState(0);
  const [countSecs, setCountSecs] = useState(0);

  // Refs for intersection observer
  const wishCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lyricSectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleWishes, setVisibleWishes] = useState<Set<number>>(new Set());
  const [visibleLyrics, setVisibleLyrics] = useState<Set<number>>(new Set());

  // Petals canvas
  const petalsCanvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // COUNTDOWN
  // ==========================================

  useEffect(() => {
    const tick = () => {
      const d = Date.now() - START_DATE.getTime();
      setCountDays(Math.floor(d / 864e5));
      setCountHours(Math.floor((d % 864e5) / 36e5));
      setCountMins(Math.floor((d % 36e5) / 6e4));
      setCountSecs(Math.floor((d % 6e4) / 1e3));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // PETALS CANVAS
  // ==========================================

  useEffect(() => {
    const c = petalsCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const emojis = ['🌸', '🌹', '🌷', '💐', '🌺', '✿', '🌼'];
    const petals: Array<{
      x: number; y: number; sz: number; sy: number; sx: number;
      r: number; rs: number; o: number; e: string;
    }> = [];

    for (let i = 0; i < 20; i++) {
      petals.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height - c.height,
        sz: Math.random() * 14 + 10,
        sy: Math.random() * 0.8 + 0.3,
        sx: Math.random() * 0.5 - 0.25,
        r: Math.random() * 360,
        rs: Math.random() * 1.5 - 0.75,
        o: Math.random() * 0.4 + 0.3,
        e: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, c.width, c.height);
      petals.forEach((p) => {
        p.y += p.sy;
        p.x += p.sx + Math.sin(p.y * 0.01) * 0.3;
        p.r += p.rs;
        if (p.y > c.height + 20) {
          p.y = -20;
          p.x = Math.random() * c.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.r * Math.PI) / 180);
        ctx.globalAlpha = p.o;
        ctx.font = p.sz + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.e, 0, 0);
        ctx.restore();
      });
    };
    animate();

    const handleResize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==========================================
  // INTERSECTION OBSERVER
  // ==========================================

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-idx') || '0');
            const type = entry.target.getAttribute('data-type');
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            setTimeout(() => {
              if (type === 'wish') {
                setVisibleWishes((prev) => new Set(prev).add(idx));
              } else if (type === 'lyric') {
                setVisibleLyrics((prev) => new Set(prev).add(idx));
              }
            }, delay);
          }
        });
      },
      { threshold: 0.15 }
    );

    wishCardsRef.current.forEach((el) => el && obs.observe(el));
    lyricSectionsRef.current.forEach((el) => el && obs.observe(el));

    return () => obs.disconnect();
  }, [mainVisible]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleStart = useCallback(() => {
    setShowIntro(false);
    setMainVisible(true);
  }, []);

  const handleCouponUse = useCallback((index: number) => {
    setCouponUsed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    // Spawn emoji celebration
    const emojis = ['💖', '✨', '🎉', '💕', '🌸'];
    for (let i = 0; i < 8; i++) {
      spawnEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }, []);

  const spawnEmoji = useCallback((em: string) => {
    const el = document.createElement('div');
    el.textContent = em;
    el.style.cssText = `position:fixed;font-size:${Math.random() * 18 + 14}px;left:${Math.random() * 100}vw;top:100vh;z-index:98;pointer-events:none;`;
    document.body.appendChild(el);
    const dur = Math.random() * 2500 + 2500;
    const st = performance.now();
    const sx = parseFloat(el.style.left);
    const animFn = (now: number) => {
      const p = (now - st) / dur;
      if (p > 1) { el.remove(); return; }
      el.style.top = (100 - p * 115) + 'vh';
      el.style.left = sx + Math.sin(p * 6) * 2.5 + 'vw';
      el.style.opacity = String(p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1);
      el.style.transform = `rotate(${p * 300}deg)`;
      requestAnimationFrame(animFn);
    };
    requestAnimationFrame(animFn);
  }, []);

  const handleFabFlower = useCallback(() => {
    const flowers = ['🌸', '🌹', '🌷', '🌺', '🌻', '💐', '🌼'];
    for (let i = 0; i < 25; i++) spawnEmoji(flowers[Math.floor(Math.random() * flowers.length)]);
  }, [spawnEmoji]);

  const handleFabHeart = useCallback(() => {
    const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝', '💞'];
    for (let i = 0; i < 25; i++) spawnEmoji(hearts[Math.floor(Math.random() * hearts.length)]);
  }, [spawnEmoji]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className={styles.march8Page}>
      {/* Petals Canvas */}
      <canvas className={styles.petalsCanvas} ref={petalsCanvasRef} />

      {/* ===== INTRO ===== */}
      <div className={`${styles.introScreen} ${!showIntro ? styles.introScreenHidden : ''}`}>
        <div className={styles.introRain}>
          {FLOWER_RAIN_ITEMS.map((f, i) => (
            <span key={i} className={styles.flowerRainItem} style={{ left: f.x, animationDelay: f.d }}>{f.emoji}</span>
          ))}
          {BIG_FLOWER_RAIN.map((f, i) => (
            <span key={`big-${i}`} className={`${styles.flowerRainItem} ${styles.flowerRainItemBig}`} style={{ left: f.x, animationDelay: f.d }}>{f.emoji}</span>
          ))}
        </div>

        <div className={styles.introCorners}>
          <div className={styles.cornerTl}>🌹🌸🌷🌺🌼</div>
          <div className={styles.cornerTr}>🌼🌺🌷🌸🌹</div>
          <div className={styles.cornerBl}>🌻💐🌹🌷🌸</div>
          <div className={styles.cornerBr}>🌸🌷🌹💐🌻</div>
        </div>

        <div className={styles.introContent}>
          {/* Big Bouquet */}
          <div className={styles.bigBouquet}>
            <div className={styles.bqGlow} />
            <div className={styles.bqWrap}>
              <div className={styles.bqPaper} />
              <div className={`${styles.bqRow} ${styles.bqTop}`}>
                <span>🌹</span><span>🌸</span><span>🌹</span>
              </div>
              <div className={`${styles.bqRow} ${styles.bqMid}`}>
                <span>🌷</span><span>🌹</span><span>🌺</span><span>🌹</span><span>🌷</span>
              </div>
              <div className={`${styles.bqRow} ${styles.bqBot}`}>
                <span>🌸</span><span>🌻</span><span>🌹</span><span>🌼</span><span>🌹</span><span>🌺</span><span>🌸</span>
              </div>
              <div className={`${styles.bqRow} ${styles.bqExtra}`}>
                <span>💐</span><span>🌷</span><span>🏵️</span><span>🌹</span><span>💮</span><span>🌷</span><span>💐</span>
              </div>
              <div className={styles.bqLeaves}>
                <span className={`${styles.leaf} ${styles.leafLeft}`}>🌿</span>
                <span className={`${styles.leaf} ${styles.leafRight}`}>🌿</span>
                <span className={`${styles.leaf} ${styles.leafLeft2}`}>🍃</span>
                <span className={`${styles.leaf} ${styles.leafRight2}`}>🍃</span>
              </div>
              <div className={styles.bqRibbon}>🎀</div>
              <div className={styles.bqSparkles}>
                {SPARKLE_DATA.map((s, i) => (
                  <span key={i} className={styles.bqSparkle} style={{ '--bx': s.bx, '--by': s.by, animationDelay: s.bd } as React.CSSProperties}>{s.emoji}</span>
                ))}
              </div>
            </div>
          </div>

          <h1>
            <span className={styles.introLine1}>Eiuuuu ơiii!</span>
            <span className={styles.introLine2}>Anh có bó hoa tặng em nè 💐</span>
          </h1>
          <p className={styles.introSub}>Nhận hoa rồi vào xem quà nha công chúaaa!</p>
          <button className={styles.introBtn} onClick={handleStart}>
            <i className="fas fa-gift" />
            <span>Em Nhận Hoa!</span>
          </button>
          <p className={styles.introNote}>* Hoa hổng héo đâu, vì là hoa digital hee :))</p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className={`${styles.mainContent} ${mainVisible ? styles.mainContentVisible : ''}`}>

        {/* HERO */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeNum}>8</span>
              <span className={styles.badgeSlash}>/</span>
              <span className={styles.badgeNum}>3</span>
            </div>
            <h1>
              <span className={styles.htLine1}>Happy Women&apos;s Day</span>
              <span className={styles.htLine2}>Nàng Thơ Của Anh Ơiii!</span>
            </h1>
            <p className={styles.heroDesc}>
              Hôm nay cả thế giới tôn vinh phụ nữ, nhưng với anh thì ngày nào cũng là ngày của em hết trơnnn á!
              Bởi vì em xứng đáng được cưng chiều 365 ngày, 366 ngày nhuận cũng tính luôn hee :)))
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{countDays}</span>
                <span className={styles.statTxt}>ngày iuuu em</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{countHours}</span>
                <span className={styles.statTxt}>giờ nhớ em</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{countMins}</span>
                <span className={styles.statTxt}>phút thưnnn</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{countSecs}</span>
                <span className={styles.statTxt}>giây simp</span>
              </div>
            </div>
            <div className={styles.scrollHint}>
              <span>Cuộn xuống nha eiuuu</span>
              <div className={styles.scrollMouse} />
            </div>
          </div>
        </section>

        {/* WISHES */}
        <section className={styles.wishesSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2><i className="fas fa-gift" /> Lời Chúc Siêu Cấp Dành Em</h2>
              <p>Mỗi bông hoa mang theo một lời chúc từ đáy tim chàng simp lày nhee</p>
            </div>
            <div className={styles.wishesGrid}>
              {WISHES.map((wish, i) => (
                <div
                  key={i}
                  ref={(el) => { wishCardsRef.current[i] = el; }}
                  data-idx={i}
                  data-type="wish"
                  data-delay={i * 100}
                  className={`${styles.wishCard} ${visibleWishes.has(i) ? styles.wishCardVisible : ''}`}
                >
                  <div className={styles.wishEmoji}>{wish.emoji}</div>
                  <h3>{wish.title}</h3>
                  <p>{wish.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SONG */}
        <section className={styles.songSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2><i className="fas fa-music" /> Bài Hát Của Đôi Mình</h2>
              <p>Anh viết riêng cho eiuuu - kể lại chặng đường từ ngày gặp nhau đến bây giờ nè!</p>
            </div>
            <div className={styles.songCard}>
              <div className={styles.songTitleBox}>
                <div className={styles.vinylDisc}>
                  <div className={styles.vinylLabel}>B&D</div>
                </div>
                <div>
                  <h3 className={styles.songName}>Duyên Mình Là Mãi Mãi</h3>
                  <p className={styles.songArtist}>Sáng tác: Bằng Yêu Của Em • Viết tặng Công Chúa Yêu Của Anh</p>
                  <p className={styles.songKey}>Thể loại: Ballad Acoustic, Yêu Thương, Ấm áp</p>
                </div>
              </div>

              <div className={styles.lyricsBox}>
                {LYRICS.map((section, i) => (
                  <div
                    key={i}
                    ref={(el) => { lyricSectionsRef.current[i] = el; }}
                    data-idx={i}
                    data-type="lyric"
                    data-delay={i * 120}
                    className={`${styles.lyricSection} ${visibleLyrics.has(i) ? styles.lyricSectionVisible : ''}`}
                  >
                    <span className={styles.lyricTag}>{section.tag}</span>
                    {section.lines.map((line, j) => {
                      if (line.text === '') return <br key={j} />;
                      const lineClass = line.cho
                        ? `${styles.lyricLine} ${styles.lyricLineCho}`
                        : styles.lyricLine;
                      return (
                        <p key={j} className={lineClass}>
                          {line.cho ? <strong>{line.text}</strong> : line.em ? <em>{line.text}</em> : line.text}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className={styles.songFooter}>
                <p>© 2026 - Bằng viết tặng Duyên iuuu - All rights reserved bởi trái tim anh 💕</p>
              </div>
            </div>
          </div>
        </section>

        {/* COUPONS */}
        <section className={styles.couponSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2><i className="fas fa-ticket-alt" /> Phiếu Quà Tặng Iuuu Thương</h2>
              <p>Mỗi phiếu dùng được 1 lần, nhưng mà em dùng bao nhiêu lần cũng được hết á! Vì anh chiều em mà :&gt;&gt;&gt;&gt;</p>
            </div>
            <div className={styles.couponGrid}>
              {COUPONS.map((cp, i) => (
                <div key={i} className={`${styles.coupon} ${couponUsed[i] ? styles.couponUsed : ''}`}>
                  <div className={styles.couponIcon}>{cp.icon}</div>
                  <div className={styles.couponTxt}>
                    <h4>{cp.title}</h4>
                    <p>{cp.desc}</p>
                  </div>
                  <button className={styles.couponUse} onClick={() => handleCouponUse(i)}>
                    Dùng ngay!
                  </button>
                  <div className={styles.couponStamp}>ĐÃ DÙNG ✓</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LETTER */}
        <section className={styles.letterSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2><i className="fas fa-envelope-open-text" /> Thư Tình Ngày 8/3</h2>
              <p>Thư viết bằng tay... à nhầm, bằng code, nhưng tình cảm thì 100% real nha!</p>
            </div>
            <div className={styles.letterWrap}>
              <div
                className={`${styles.envelopeBox} ${envelopeOpen ? styles.envelopeBoxOpen : ''}`}
                onClick={() => setEnvelopeOpen(!envelopeOpen)}
              >
                <div className={styles.envFlap} />
                <div className={styles.envSeal}><i className="fas fa-heart" /></div>
                <div className={styles.envPaper}>
                  <div className={styles.ltrHead}>
                    <h3>Gửi &quot;Cục Nợ&quot; Iuuu Nhất Vũ Trụ 👑</h3>
                    <p>Ngày 8 tháng 3 năm 2026</p>
                  </div>
                  <div className={styles.ltrBody}>
                    <p>Eiuuuuuu của anh ơiiiiii,</p>
                    <p>
                      Hôm nay là 8/3 nè, ngày mà &quot;cả thế giới&quot; dành tình yêu cho phụ nữ. Nma anh thấy hơi bất công,
                      vì em xứng đáng được yêu thương 365 ngày chứ đâu phải chỉ có 1 ngày đúng hom? Thôi kệ, ngày nào
                      anh cũng cưng em mà, nhân ngày 8/3 thì anh cưng THÊM tí nữa thôi hee :)))
                    </p>
                    <p>
                      Em có biết khom, trước khi gặp em, anh cứ tưởng mấy ông viết thơ tình là &quot;sến&quot;. Chừ thì...
                      anh thành &quot;sến king&quot; luôn :v
                    </p>
                    <p>
                      Cảm ơn em vì đã đến bên anh, biến cuộc sống nhạt nhẽo thành bản nhạc du dương.
                      Cảm ơn em vì mỗi lần anh dở hơi thì em vẫn chịu đựng (dù hay muốn đúm anh :)))).
                      Cảm ơn em vì đã là em - một cô gái mạnh mẽ, xinh đẹp, và đáng iuuuu hơn tất thảy
                      mọi thứ trên đời này!
                    </p>
                    <p>
                      Ngày 8/3, anh hông có quà gì xịn đâu (chờ anh kiếm tiền đã nha kkk), nhưng anh có thứ
                      quý giá nhất tặng em: <strong>cả trái tim chân thành.</strong> Dù mưa bão gió rét,
                      dù em có giận anh mấy đi nữa, anh vẫn cứ &quot;dính&quot; em như keo 502 á! Hổng gỡ ra
                      được đâuuu!
                    </p>
                    <p>
                      <strong>
                        Iuuuu em nhiều hơn cả vũ trụ, thương em sâu hơn cả đại dương, nhớ em dài hơn cả
                        sông Mekong! Happy Women&apos;s Day, nàng thơ iuuu của đời anhhh! 💐💕
                      </strong>
                    </p>
                  </div>
                  <div className={styles.ltrSign}>
                    <p>Anh chai may mắn nhất thế gian vì có em</p>
                    <p>❤️ Bằng iuuu của em ❤️</p>
                  </div>
                </div>
              </div>
              <p className={`${styles.envHint} ${envelopeOpen ? styles.envHintHidden : ''}`}>
                <i className="fas fa-hand-pointer" /> Click phong bì để mở thư nha eiuuu!
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.m8Footer}>
          <div className={styles.container}>
            <h3>Happy Women&apos;s Day Nàng Thơ! 💐</h3>
            <p className={styles.footerDesc}>
              Em là phụ nữ tuyệt vời nhất mà anh từng gặp. Iuuuu em nhiiiiều lắm luôn á! 💕
            </p>
            <div className={styles.fLinks}>
              <Link href="/memories"><i className="fas fa-heart" /> Kỷ niệm</Link>
              <Link href="/gallery"><i className="fas fa-images" /> Thư viện</Link>
              <Link href="/timeline"><i className="fas fa-clock" /> Timeline</Link>
            </div>
            <p className={styles.fCopy}>© 2025-2026 Bằng &amp; Duyên - Mãi mãi bên nhau nha eiuuu 💕</p>
          </div>
        </footer>
      </div>

      {/* FABs */}
      {mainVisible && (
        <div className={styles.fabGroup}>
          <button className={`${styles.fab} ${styles.fabFlower}`} onClick={handleFabFlower} title="Mưa hoa">
            <i className="fas fa-seedling" />
          </button>
          <button className={`${styles.fab} ${styles.fabHeart}`} onClick={handleFabHeart} title="Mưa tim">
            <i className="fas fa-heart" />
          </button>
        </div>
      )}
    </div>
  );
}
