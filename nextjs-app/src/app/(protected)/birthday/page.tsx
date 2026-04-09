'use client';

/**
 * Birthday Page - Sinh nhật
 * Route: /birthday
 * Chuyển đổi từ birthday.html + birthday.css + birthday.js
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './birthday.module.css';

// ==========================================
// DATA
// ==========================================

const WISHES_RAIN = [
  'Sinh nhật vui vẻ công chúa của anh!',
  'Chúc eiuuu của anh luôn xinh đẹp rạng ngời!',
  'Chúc em đạt được mọi ước mơ!',
  'Aiuuu em nhiều lắm lắm!',
  'Chúc em có một ngày tuyệt vời!',
  'Em là điều tuyệt vời nhất!',
  'Cảm ơn em đã đến bên anh!',
  'Tuổi mới an khang, hạnh phúc nhé eiuuu!',
  'Em là ánh sáng của đời anh!',
  'Luôn yêu thương và che chở em!',
  'Món quà lớn nhất là có em!',
  'Em mãi là nàng công chúa của anh!',
  'Hạnh phúc là được ở bên em!',
  'Chúc em ngày càng xinh đẹp!',
  'Anh sẽ luôn bên em mãi mãi!',
  'Em là vũ trụ của anh!',
  'Chúc em luôn khỏe mạnh!',
  'Em là ngôi sao sáng nhất!',
  'Yêu em hết cả trái tim!',
  'Sinh nhật em là ngày hạnh phúc!',
  'Em làm anh tin vào tình yêu!',
  'Mỗi ngày với em đều tuyệt vời!',
  'Chúc em luôn mỉm cười!',
  'Em là cầu vồng sau mưa!',
  'Anh muốn ở bên em mãi mãi!',
  'Iuuuuu emmm nhìuuu lắmmm!',
  'Chúc mừng sinh nhật eiuuu!',
  'Thương em nhất trên đời!',
  'Chúc bé iu của anh sinh nhật vui vẻ!',
  'Tuổi mới bớt lo nghĩ, có anh ở đây rồi!',
  'Chỉ cần em vui là được!',
  'Yêu công chúa của anh rất nhiều!',
  'Chúc em một đời an yên!',
  'Mãi là cô bé đáng yêu của anh nhé!',
  'Chúc em mọi điều tốt đẹp nhất!',
  'Emmm luôn là cô gái xinh đẹp nhất trong mắt anh!',
];

const GALLERY_IMAGES = [
  { src: '/data/images/01.jpg', caption: 'Khoảnh khắc đẹp nhất' },
  { src: '/data/images/02.jpg', caption: 'Nụ cười tỏa nắng' },
  { src: '/data/images/03.jpg', caption: 'Bên nhau hạnh phúc' },
  { src: '/data/images/04.jpg', caption: 'Yêu em nhiều lắm' },
  { src: '/data/images/05.jpg', caption: 'Kỷ niệm đáng nhớ' },
  { src: '/data/images/06.jpg', caption: 'Tình yêu của chúng mình' },
  { src: '/data/images/07.jpg', caption: 'Mãi mãi bên nhau' },
  { src: '/data/images/1.jpg', caption: 'Em là cả thế giới của anh' },
];

// ==========================================
// COMPONENT
// ==========================================

export default function BirthdayPage() {
  // State
  const [showIntro, setShowIntro] = useState(true);
  const [mainActive, setMainActive] = useState(false);
  const [giftOpening, setGiftOpening] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rainCounter, setRainCounter] = useState(0);
  const [rainSpeed, setRainSpeed] = useState(1);
  const [rainDensity, setRainDensity] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalCaption, setModalCaption] = useState('');
  const [modalIsWish, setModalIsWish] = useState(false);

  // Refs
  const starsFieldRef = useRef<HTMLDivElement>(null);
  const floatingHeartsRef = useRef<HTMLDivElement>(null);
  const wishesContainerRef = useRef<HTMLDivElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const rainActiveRef = useRef(false);
  const rainIntervalsRef = useRef<NodeJS.Timeout[]>([]);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================
  // BACKGROUND EFFECTS
  // ==========================================

  useEffect(() => {
    // Create stars
    if (starsFieldRef.current) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = styles.star;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        frag.appendChild(star);
      }
      starsFieldRef.current.appendChild(frag);
    }

    // Create sparkles around gift
    if (sparklesRef.current) {
      for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = styles.sparkle;
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparklesRef.current.appendChild(sparkle);
      }
    }

    return () => {
      // Cleanup
      if (starsFieldRef.current) starsFieldRef.current.innerHTML = '';
    };
  }, []);

  // Floating hearts
  useEffect(() => {
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    const interval = setInterval(() => {
      if (!floatingHeartsRef.current) return;
      const heart = document.createElement('div');
      heart.className = styles.floatingHeart;
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (8 + Math.random() * 4) + 's';
      heart.style.fontSize = (15 + Math.random() * 15) + 'px';
      floatingHeartsRef.current.appendChild(heart);
      setTimeout(() => heart.remove(), 12000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // FIREWORKS
  // ==========================================

  const startFireworks = useCallback(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; life: number; size: number;
    }> = [];
    let active = true;

    const colors = ['#FF69B4', '#FFD700', '#FF1493', '#FFA500', '#FF6347', '#9370DB'];

    function createFirework() {
      const x = Math.random() * canvas!.width;
      const y = Math.random() * canvas!.height * 0.5;
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 2 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 100,
          size: 2 + Math.random() * 3,
        });
      }
    }

    function animate() {
      if (!active && particles.length === 0) return;
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 1;
        if (p.life > 0) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = p.life / 100;
          ctx!.fill();
          ctx!.globalAlpha = 1;
          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    }

    const interval = setInterval(() => {
      if (!active) { clearInterval(interval); return; }
      createFirework();
    }, 800);

    animate();

    setTimeout(() => {
      active = false;
      clearInterval(interval);
    }, 10000);
  }, []);

  // ==========================================
  // GIFT BOX CLICK
  // ==========================================

  const handleGiftClick = useCallback(() => {
    setGiftOpening(true);

    // Confetti explosion
    const confettiColors = ['#FF69B4', '#FFD700', '#FF1493', '#FFA500'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 10000;
        border-radius: 50%;
      `;
      document.body.appendChild(confetti);

      const angle = (Math.PI * 2 * i) / 50;
      const velocity = 200 + Math.random() * 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      confetti.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: '1' },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: '0' },
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0, .9, .57, 1)',
      }).onfinish = () => confetti.remove();
    }

    setTimeout(() => {
      setShowIntro(false);
      setMainActive(true);
      startFireworks();
    }, 1500);
  }, [startFireworks]);

  // ==========================================
  // WISHES RAIN
  // ==========================================

  const createWish = useCallback(() => {
    if (!wishesContainerRef.current) return;
    const container = wishesContainerRef.current;

    const wishEl = document.createElement('div');
    wishEl.className = styles.wishRainItem;
    wishEl.textContent = WISHES_RAIN[Math.floor(Math.random() * WISHES_RAIN.length)];
    wishEl.style.left = Math.random() * 100 + '%';
    wishEl.style.setProperty('--drift', (Math.random() - 0.5) * 150 + 'px');

    const baseDuration = 15 - rainSpeed * 1.2;
    wishEl.style.animationDuration = (baseDuration + Math.random() * 2) + 's';

    container.appendChild(wishEl);
    setRainCounter(prev => prev + 1);

    wishEl.addEventListener('click', () => {
      wishEl.remove();
    });

    setTimeout(() => {
      if (wishEl.parentElement) wishEl.remove();
    }, (baseDuration + 2) * 1000);
  }, [rainSpeed]);

  const updateRainDensity = useCallback(() => {
    // Clear existing
    rainIntervalsRef.current.forEach(clearInterval);
    rainIntervalsRef.current = [];

    const streams = rainDensity;
    for (let i = 0; i < streams; i++) {
      const timeout = setTimeout(() => {
        const interval = setInterval(createWish, 2000);
        rainIntervalsRef.current.push(interval);
      }, i * (2000 / streams));
      rainIntervalsRef.current.push(timeout as unknown as NodeJS.Timeout);
    }
  }, [rainDensity, createWish]);

  // Start rain when main content visible
  useEffect(() => {
    if (mainActive && !rainActiveRef.current) {
      rainActiveRef.current = true;
      const timer = setTimeout(() => {
        updateRainDensity();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mainActive, updateRainDensity]);

  // Update rain when density changes
  useEffect(() => {
    if (rainActiveRef.current) {
      updateRainDensity();
    }
    return () => {
      rainIntervalsRef.current.forEach(clearInterval);
      rainIntervalsRef.current = [];
    };
  }, [rainDensity, updateRainDensity]);

  // ==========================================
  // GALLERY CAROUSEL
  // ==========================================

  const navigateGallery = useCallback((direction: number) => {
    setCurrentSlide(prev => {
      let next = prev + direction;
      if (next < 0) next = GALLERY_IMAGES.length - 1;
      if (next >= GALLERY_IMAGES.length) next = 0;
      return next;
    });
  }, []);

  // Auto play carousel
  useEffect(() => {
    if (mainActive) {
      autoPlayRef.current = setInterval(() => navigateGallery(1), 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [mainActive, navigateGallery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateGallery(-1);
      if (e.key === 'ArrowRight') navigateGallery(1);
      if (e.key === 'Escape' && modalOpen) setModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [navigateGallery, modalOpen]);

  // ==========================================
  // MODAL
  // ==========================================

  const openImageModal = useCallback((src: string, caption: string) => {
    setModalImage(src);
    setModalCaption(caption);
    setModalIsWish(false);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className={styles.birthdayPage}>
      {/* Background Magic */}
      <div className={styles.magicBackground}>
        <div className={styles.universeParticles} />
        <div className={styles.floatingHeartsContainer} ref={floatingHeartsRef} />
        <div className={styles.starsField} ref={starsFieldRef} />
        <canvas className={styles.fireworksCanvas} ref={fireworksCanvasRef} />
      </div>

      {/* Intro Screen */}
      <div className={`${styles.introScreen} ${!showIntro ? styles.introScreenHidden : ''}`}>
        <div className={styles.introContent}>
          <h1 className={styles.introTitle}>
            <span className={styles.gradientText}>Một Món Quà Đặc Biệt</span>
            <div className={styles.subtitle}>Dành Cho Công Chúa Của Anh 👑</div>
          </h1>

          {/* Gift Box */}
          <div
            className={`${styles.giftBoxContainer} ${giftOpening ? styles.giftBoxOpening : ''}`}
            onClick={handleGiftClick}
          >
            <div className={styles.giftBox}>
              <div className={styles.giftLid}>
                <div className={styles.bow}>
                  <div className={styles.bowLeft} />
                  <div className={styles.bowRight} />
                  <div className={styles.bowCenter} />
                </div>
              </div>
              <div className={styles.giftBody}>
                <div className={`${styles.giftRibbon} ${styles.giftRibbonVertical}`} />
                <div className={`${styles.giftRibbon} ${styles.giftRibbonHorizontal}`} />
              </div>
              <div className={styles.giftGlow} />
            </div>
            <div className={styles.sparkles} ref={sparklesRef} />
          </div>

          <p className={styles.hintText}>
            <i className="fas fa-hand-pointer" /> Nhấp vào hộp quà để mở nhé! 🎁
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${mainActive ? styles.mainContentActive : ''}`}>

        {/* Wishes Rain Section */}
        <section className={`${styles.section} ${styles.wishesSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <i className="fas fa-cloud" />
              Cơn Mưa Lời Chúc
              <i className="fas fa-birthday-cake" />
            </h2>
            <p className={styles.sectionSubtitle}>
              Những lời yêu thương anh muốn gửi đến em - Rơi không ngừng như tình yêu của anh dành cho em 💕
            </p>
          </div>

          <div className={styles.wishesRainContainer} ref={wishesContainerRef} />

          <div className={styles.rainControls}>
            <div className={styles.rainStats}>
              <i className="fas fa-heart" />
              <span>Lời chúc đã rơi: <strong>{rainCounter}</strong></span>
              <i className="fas fa-infinity" />
            </div>

            <div className={styles.rainSettings}>
              <label>
                <i className="fas fa-tachometer-alt" />
                Tốc độ: <span className={styles.rainSettingsValue}>{rainSpeed}</span>
                <input
                  type="range"
                  className={styles.rainSettingsRange}
                  min="1"
                  max="10"
                  value={rainSpeed}
                  onChange={(e) => setRainSpeed(parseInt(e.target.value))}
                />
              </label>
              <label>
                <i className="fas fa-cloud-rain" />
                Mật độ: <span className={styles.rainSettingsValue}>{rainDensity}</span>
                <input
                  type="range"
                  className={styles.rainSettingsRange}
                  min="2"
                  max="20"
                  value={rainDensity}
                  onChange={(e) => setRainDensity(parseInt(e.target.value))}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div style={{ height: '100px' }} />

        {/* Memories Gallery */}
        <section className={`${styles.section} ${styles.memoriesSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <i className="fas fa-heart" />
              Những Khoảnh Khắc Đáng Nhớ
              <i className="fas fa-camera" />
            </h2>
            <p className={styles.sectionSubtitle}>
              Những kỷ niệm tuyệt vời mà chúng ta đã cùng trải qua
            </p>
          </div>

          <div className={styles.galleryCarousel}>
            <button
              className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
              onClick={() => navigateGallery(-1)}
            >
              <i className="fas fa-chevron-left" />
            </button>

            <div className={styles.carouselTrackContainer}>
              <div
                className={styles.carouselTrack}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {GALLERY_IMAGES.map((img, idx) => (
                  <div key={idx} className={styles.carouselSlide}>
                    <img
                      src={img.src}
                      alt={img.caption}
                      onClick={() => openImageModal(img.src, img.caption)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
              onClick={() => navigateGallery(1)}
            >
              <i className="fas fa-chevron-right" />
            </button>

            <div className={styles.carouselIndicators}>
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.indicator} ${idx === currentSlide ? styles.indicatorActive : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final Message */}
        <section className={styles.finalMessage}>
          <div className={styles.messageCard}>
            <div className={styles.messageIcon}>
              <i className="fas fa-heart" />
            </div>
            <h2 className={styles.messageTitle}>Gửi Công Chúa Của Anh 👑</h2>
            <div className={styles.messageContent}>
              <p>Công chúa iuu của anh ơi,</p>
              <p>
                Vậy là lại một năm nữa trôi qua, và ngày đặc biệt nhất của anh cũng đã tới - ngày
                mà một thiên thần xinh đẹp tuyệt vời giáng trần, và may mắn thay, thiên thần đó
                giờ đây là của anh. Mỗi ngày trôi qua, anh đều thầm cảm ơn ông trời đã mang em
                đến bên anh, để cuộc sống của anh trở nên có ý nghĩa và rực rỡ hơn bao giờ hết.
              </p>
              <p className={styles.highlight}>
                Chúc công chúa của anh sinh nhật zui zẻ, tuổi mới sẽ luôn xinh đẹp, rạng ngời và
                cười thật nhiều như bây giờ em nhié. Nụ cười của em là món quà quý giá nhất đối với
                anh đóa heheh.<br />
                Chúc em lúc nào cũng mạnh khỏe, tràn đầy năng lượng để cùng anh đi hết các cung
                đường Đà Nẵng, thử thật nhiều món ngon, và trải qua thêm nhiều &apos;lần đầu tiên&apos; nữa.
                Hẹ hẹ :))))<br />
                Mọi ước mơ của em, dù là nhỏ bé hay lớn lao, anh đều mong nó sẽ thành hiện thực.
                Anh sẽ luôn ở đây, bên cạnh và ủng hộ em trên mọi chặng đường.<br />
                Và điều quan trọng nhất, anh mong em sẽ mãi mãi hạnh phúc, không chỉ trong ngày
                hôm nay, mà là 365 ngày trong năm, và nhiều nhiều năm sau nữa... tất nhiên là phải
                hạnh phúc bên anh roài :&gt;!
              </p>
              <p>
                Em có biết khom, từ khi em bước vào cuộc đời anh, thế giới của anh như được vẽ lại
                bằng những gam màu rực rỡ :))). Mỗi khoảnh khắc bên em, mỗi tin nhắn em gửi, đều
                là một liều thuốc hạnh phúc khiến anh nhận ra rằng, &apos;nhà&apos; không phải là một nơi
                chốn, mà là ở bên cạnh em :&gt;. Em là cô gái mạnh mẽ zà độc lập, anh biết điều đó.
                Nma choa phép anh được ích kỷ một chút, để được che chở, được đồng hành và được nói
                rằng:{' '}
                <strong className={styles.gradientText}>
                  Thế giới của anh sẽ chẳng còn trọn vẹn nếu thiếu đi mảnh ghép là em iuuu của a.
                </strong>
              </p>
              <p className={styles.poem}>
                &quot;Trời cho anh một vần thơ,<br />
                Để anh viết tặng nàng thơ của mình.<br />
                Tình mình như nắng lung linh,<br />
                Có mây, có gió, có tình chúng ta.<br />
                Duyên mình đâu phải thoảng qua,<br />
                Mà là định mệnh, là nhà, là thươngg ❤️&quot;
                <span className={styles.signature}>
                  - Chàng trai may mắn nhất thế gian vì có em 💘
                </span>
              </p>
            </div>
            <div className={styles.messageFooter}>
              <p>Iuuu em cao hơn cả núi, dài hơn cả sông, rộng hơn cả đất... bay ra vũ trụ! ❤️ hít hà hít hà :))))</p>
              <p>IUUUUU EMMMMMM 🥰</p>
              <p className={styles.date}>08/10/2025</p>
            </div>
          </div>
        </section>
      </div>

      {/* Image Modal */}
      <div className={`${styles.modal} ${modalOpen ? styles.modalActive : ''}`}>
        <div className={styles.modalOverlay} onClick={closeModal} />
        <button className={styles.modalClose} onClick={closeModal}>
          <i className="fas fa-times" />
        </button>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {!modalIsWish && (
            <img
              className={styles.modalImage}
              src={modalImage}
              alt="Memory"
            />
          )}
          <div
            className={styles.modalCaption}
            style={modalIsWish ? { fontSize: '1.8rem', padding: '3rem', lineHeight: 1.8 } : {}}
          >
            {modalCaption}
          </div>
        </div>
      </div>
    </div>
  );
}
