'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './giang-sinh.module.css';

/* ==========================================
   MESSAGES DATA
   ========================================== */
const christmasMessages = [
  {
    text: 'Eiuuu biết khong, có em là điều tuyệt vời nhất xảy ra với anh năm nay đóa ^^. Giáng Sinh này có em, mọi thứ đều đã trở nên đặc biệt hơn mọi năm ❤️',
    emoji: '🥰',
  },
  {
    text: 'Aiuuu không giỏi nói lời hoa mỹ đou, nma anh chắc chắn một điều rằng Anh muốn bên em, Giáng Sinh này và những Giáng Sinh sau nữaa🎄',
    emoji: '💝',
  },
  {
    text: 'Cảm ơn em đã xuất hiện, đã ở lại, và đã làm cuộc sống của anh tràn ngập những khoảnh khắc đáng nhớ. Anh yêuu em nhiều nhắmmm! 💕',
    emoji: '✨',
  },
  {
    text: 'Chúc công chúaaa iuuuu của a Giáng Sinh vui vẻ, hạnh phúc, đầy niềm vui bên a và gia đình nheee🎄',
    emoji: '✨',
  },
  {
    text: 'Dù chuyện gì xảy ra, anh luôn ở bên em, Giáng Sinh này và những Giáng Sinh sau nữa nhié🎄',
    emoji: '🥰',
  },
  {
    text: 'Hứa với aiuuu, chúng mình cùng nhường nhịn nhau một chút nè, iuuuu nhau hơn một chút nè, tha thứ những lỗi lầm của nhau nè, chấp nhận những điểm khác biệt của cả hai, cùng hạ cái tôi xuống để cùng lắng nghe và thấu hiểu nhau hơn, khi gặp chuyện thì bình tĩnh chứ đừng để chỉ vì một vài lỗi sai nhất thời mà vội bỏ qua hết những điều tốt đẹp từ trước đến nay của chúng mình nhé. Thời gian phía trước còn rất dài, việc sai có thể sửa, điều không biết có thể học, mình cùng giúp nhau không ngừng tiến bộ, không ngừng học hỏi, không ngừng thấu hiểu, không ngừng yêu thương nhiều hơn nheee~ Iuuuuuu emmmmmmmm 🥰',
    emoji: '🥰',
  },
];

const christmasImages = Array.from({ length: 11 }, (_, i) => `/christmas/image${i + 1}.jpg`);

const snowflakeChars = ['❄', '❅', '❆', '✧', '✦'];

interface SnowflakeData {
  id: number;
  char: string;
  left: string;
  duration: string;
  delay: string;
  opacity: number;
  fontSize: string;
}

interface ConfettiData {
  id: number;
  left: string;
  color: string;
  borderRadius: string;
  width: string;
  delay: string;
}

/* ==========================================
   GIANG SINH PAGE COMPONENT
   ========================================== */
export default function GiangSinhPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [introHidden, setIntroHidden] = useState(false);
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create snowflakes on mount
  useEffect(() => {
    const flakes: SnowflakeData[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
        left: `${Math.random() * 100}vw`,
        duration: `${Math.random() * 3 + 5}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.7 + 0.3,
        fontSize: `${Math.random() * 10 + 8}px`,
      });
    }
    setSnowflakes(flakes);
  }, []);

  const enterMainContent = () => {
    setIntroHidden(true);
    // Play music
    if (audioRef.current) {
      audioRef.current.play().catch(() => { /* autoplay blocked */ });
    }
    setTimeout(() => setShowIntro(false), 1000);
  };

  return (
    <div className={styles.giangSinhPage}>
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/christmas/audio.mp3" type="audio/mpeg" />
      </audio>

      {/* Snowflakes */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={styles.snowflake}
          style={{
            left: flake.left,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity,
            fontSize: flake.fontSize,
          }}
        >
          {flake.char}
        </div>
      ))}

      {/* Intro Screen */}
      {showIntro && (
        <div className={`${styles.introScreen} ${introHidden ? styles.introScreenHidden : ''}`}>
          <h1 className={styles.introTitle}>Merry Christmas! 🎄</h1>
          <p className={styles.introSubtitle}>Gửi Công Chúa Iuuu Của Anh 💕</p>
          <p className={styles.introMessage}>
            Giáng Sinh đầu tiên của chúng mình... Anh muốn dành tặng eiuuu một món quà nho nhỏ,
            không phải vật chất gì to tát, chỉ là những gì anh cảm nhận khi có em bên cạnh.
          </p>
          <button className={styles.introBtn} onClick={enterMainContent}>
            ✨ Nhận Quà Từ Anh ✨
          </button>
        </div>
      )}

      {/* Main Content */}
      {!showIntro && (
        <div className={styles.mainContent}>
          {/* Inner Navigation */}
          <InnerNav />

          {/* Messages Section */}
          <MessagesSection />

          {/* Gift Section */}
          <GiftSection />

          {/* Footer */}
          <footer className={styles.footer}>
            <p>Made with <span className={styles.footerHeart}>❤️</span> for my princess</p>
            <p>Giáng Sinh 2025 - Giáng Sinh Đầu Tiên Của Chúng Mình 🎄</p>
          </footer>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   INNER NAV
   ========================================== */
function InnerNav() {
  const [activeSection, setActiveSection] = useState('messages');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={styles.navBar}>
      <button
        className={`${styles.innerNavBtn} ${activeSection === 'messages' ? styles.innerNavBtnActive : ''}`}
        onClick={() => scrollToSection('messages')}
        title="Lời Yêu"
      >
        💌
      </button>
      <button
        className={`${styles.innerNavBtn} ${activeSection === 'gift' ? styles.innerNavBtnActive : ''}`}
        onClick={() => scrollToSection('gift')}
        title="Quà Tặng"
      >
        🎁
      </button>
    </nav>
  );
}

/* ==========================================
   MESSAGES SECTION
   ========================================== */
function MessagesSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.messageCardVisible);
          }
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="messages" className={`${styles.section} ${styles.messagesSection}`}>
      <h2 className={styles.sectionTitle}>Những Lời Anh Muốn Nói 💕</h2>

      {christmasMessages.map((msg, i) => (
        <div
          key={i}
          ref={(el) => { cardRefs.current[i] = el; }}
          className={styles.messageCard}
        >
          <p className={styles.messageText}>{msg.text}</p>
          <div className={styles.messageEmoji}>{msg.emoji}</div>
        </div>
      ))}
    </section>
  );
}

/* ==========================================
   GIFT SECTION
   ========================================== */
function GiftSection() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiData[]>([]);

  const createConfetti = useCallback(() => {
    const colors = ['#DC143C', '#FFD700', '#228B22', '#FF69B4', '#FFFFFF'];
    const newConfetti: ConfettiData[] = [];

    for (let i = 0; i < 60; i++) {
      newConfetti.push({
        id: Date.now() + i,
        left: `${Math.random() * 100}vw`,
        color: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        width: `${Math.random() * 10 + 5}px`,
        delay: `${i * 0.02}s`,
      });
    }

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3500);
  }, []);

  const openGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    createConfetti();
  };

  return (
    <section id="gift" className={`${styles.section} ${styles.giftSection}`}>
      <h2 className={styles.sectionTitle}>Mở Quà Nèoo! 🎁</h2>

      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className={styles.confetti}
          style={{
            left: c.left,
            backgroundColor: c.color,
            borderRadius: c.borderRadius,
            width: c.width,
            height: c.width,
            animationDelay: c.delay,
          }}
        />
      ))}

      <div
        className={`${styles.giftContainer} ${giftOpened ? styles.giftOpened : ''}`}
        onClick={openGift}
      >
        <div className={styles.giftBox}>
          <div className={styles.giftBow}>🎀</div>
          <div className={styles.giftBody}>
            <div className={styles.giftRibbonV}></div>
            <div className={styles.giftRibbonH}></div>
          </div>
        </div>

        {!giftOpened && (
          <p className={styles.giftInstruction}>👆 Click để mở quà eiuuu oii!</p>
        )}

        {giftOpened && (
          <div className={styles.giftSurprise}>
            <p className={styles.surpriseText}>
              Món quà của anh là... Trái tim anh đã luôn thuộc zìaa em rồi đó :)))))
            </p>
            {christmasImages.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Ảnh kỷ niệm ${i + 1}`}
                className={styles.surpriseImage}
                width={300}
                height={300}
                style={{ objectFit: 'cover' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
