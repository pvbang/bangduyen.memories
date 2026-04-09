'use client';

/**
 * Sorry Page - Xin lỗi
 * Route: /sorry
 * Chuyển đổi từ sorry.html + sorry.css + sorry.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './sorry.module.css';

// ==========================================
// DATA
// ==========================================

const MEDIA_FILES = ['/data/gif/gif01-v2.gif', '/data/gif/gif02.gif'];

const QUESTIONS = [
  {
    id: 'question1',
    title: 'Công chúa còn iuuu anh không? 🥺',
    yesText: 'Còn iuuu ❤️',
    noText: 'Hết iuuu 💔',
    message: 'Anh biết anh sai rồi, anh làm công chúa của anh buồn rồi... 😭',
  },
  {
    id: 'question2',
    title: 'Eiuu còn giận anh nữa hong? 😔',
    yesText: 'Hết giận gòii 😊',
    noText: 'Còn giận 😤',
    message:
      '"Trời làm cơn mưa lách tách,\nLòng anh cũng có chút gì rách theo.\nLà anh sai, chẳng dám trèo,\nChỉ mong em hết giận, hết eo sèo lòng anh." 💕',
  },
  {
    id: 'question3',
    title: 'Tha lỗi cho anh nha công chúa? 🙏',
    yesText: 'Tha lỗi cho aiuu ❤️',
    noText: 'Chưa đâu 😤',
    message:
      'Anh biết lỗi của anh rồi mà... Anh sẽ không bao giờ làm eiuu buồn như vậy nữa đâu. 🥺\nMất em chắc anh không sống nổi, thiệt đó... 💔',
  },
  {
    id: 'question4',
    title: 'Em có tin là anh iuuu em nhất trên đời không? 💕',
    yesText: 'Em tin ❤️',
    noText: 'Hông tin 💔',
    message:
      'Anh iuuu em nhiều hơn cả vũ trụ này nữa!\nVũ trụ trong mắt anh chính là em đó, công chúa à! ✨❤️',
  },
];

const MINI_GAMES = [
  { id: 'love-chat', icon: '💬', title: 'Chat Tình Yêu', desc: 'Trò chuyện với anh để hiểu anh hơn!' },
  { id: 'love-letter', icon: '✍️', title: 'Viết Thư Tình', desc: 'Hoàn thành bức thư tình của anh!' },
  { id: 'heart-collector', icon: '🎯', title: 'Hái Trái Tim', desc: 'Giúp anh hái trái tim để tặng em!' },
  { id: 'memory-match', icon: '💞', title: 'Ghép Đôi Kỷ Niệm', desc: 'Tìm những cặp kỷ niệm của chúng ta!' },
  { id: 'hidden-hearts', icon: '🔍', title: 'Tìm Trái Tim Ẩn', desc: 'Em có thể tìm được những trái tim anh giấu không?' },
  { id: 'emotion-guess', icon: '😊', title: 'Đoán Cảm Xúc', desc: 'Anh cảm thấy thế nào khi nhìn em?' },
  { id: 'heart-puzzle', icon: '🧩', title: 'Ghép Hình Trái Tim', desc: 'Ghép lại trái tim đã vỡ của anh!' },
  { id: 'love-garden', icon: '🌸', title: 'Vườn Hoa Tình Yêu', desc: 'Trồng hoa để tạo khu vườn cho riêng em!' },
];

const HEART_POSITIONS = [
  { left: '5%', top: '20%', delay: '0s', bg: '#FFB6C1' },
  { left: '15%', top: '60%', delay: '0.8s', bg: '#FFC0CB' },
  { left: '25%', top: '80%', delay: '1.6s', bg: '#FF91A4' },
  { left: '35%', top: '10%', delay: '2.4s', bg: '#FF69B4' },
  { left: '55%', top: '70%', delay: '3.2s', bg: '#FFB6C1' },
  { left: '65%', top: '30%', delay: '4s', bg: '#FFC0CB' },
  { left: '75%', top: '90%', delay: '4.8s', bg: '#FF91A4' },
  { left: '85%', top: '50%', delay: '5.6s', bg: '#FF69B4' },
  { left: '45%', top: '15%', delay: '6.4s', bg: '#FFB6C1' },
  { left: '95%', top: '75%', delay: '7.2s', bg: '#FFC0CB' },
];

const TEAR_POSITIONS = [
  { left: '10%', delay: '0s' },
  { left: '30%', delay: '1.6s' },
  { left: '50%', delay: '3.2s' },
  { left: '70%', delay: '4.8s' },
  { left: '90%', delay: '6.4s' },
];

const PARTICLE_POSITIONS = [
  { left: '8%', delay: '0s' },
  { left: '24%', delay: '1.5s' },
  { left: '40%', delay: '3s' },
  { left: '56%', delay: '4.5s' },
  { left: '72%', delay: '6s' },
  { left: '88%', delay: '7.5s' },
  { left: '16%', delay: '9s' },
  { left: '32%', delay: '10.5s' },
  { left: '48%', delay: '12s' },
  { left: '64%', delay: '13.5s' },
];

// ==========================================
// COMPONENT
// ==========================================

export default function SorryPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [mediaSrc, setMediaSrc] = useState('');
  const [loveFillWidth, setLoveFillWidth] = useState(0);
  const [noBtnScale, setNoBtnScale] = useState(1);
  const [yesBtnScale, setYesBtnScale] = useState(1);
  const mediaIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load random media
  useEffect(() => {
    const loadMedia = () => {
      const src = MEDIA_FILES[Math.floor(Math.random() * MEDIA_FILES.length)];
      setMediaSrc(src);
    };
    loadMedia();
    mediaIntervalRef.current = setInterval(loadMedia, 10000);
    return () => {
      if (mediaIntervalRef.current) clearInterval(mediaIntervalRef.current);
    };
  }, []);

  // Click heart on click anywhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const heart = document.createElement('div');
      heart.textContent = '💕';
      heart.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(heart);
      heart.animate(
        [
          { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: '0', transform: 'translate(-50%, -100px) scale(0.5)' },
        ],
        { duration: 1000, easing: 'ease-out' }
      ).onfinish = () => heart.remove();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleYesClick = useCallback(() => {
    setYesBtnScale((prev) => prev + 0.2);
    setNoBtnScale((prev) => Math.max(0.1, prev - 0.15));

    // Celebration hearts
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.textContent = '💖';
      heart.style.cssText = `
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 1000;
        left: ${50 + (Math.random() - 0.5) * 30}%;
        top: 50%;
      `;
      document.body.appendChild(heart);
      heart.animate(
        [
          { opacity: '1', transform: 'translateY(0) scale(1) rotate(0deg)' },
          { opacity: '0', transform: 'translateY(-100px) scale(0.5) rotate(360deg)' },
        ],
        { duration: 2000, easing: 'ease-out' }
      ).onfinish = () => heart.remove();
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setNoBtnScale(1);
        setYesBtnScale(1);
      } else {
        setShowFinal(true);
        // Start love meter animation
        setTimeout(() => setLoveFillWidth(100), 1000);
        // Confetti
        createConfetti();
      }
    }, 1500);
  }, [currentQuestion]);

  const handleNoClick = useCallback(() => {
    setNoBtnScale((prev) => Math.max(0, prev - 0.2));
    setYesBtnScale((prev) => prev + 0.3);

    // Show floating sad message
    const messages = [
      'Anh biết em đang giận... 😢',
      'Đừng giận anh nữa mà em... 🥺',
      'Anh sẽ cố gắng hơn nữa! 😭',
      'Em là tất cả của anh mà... 💔',
    ];
    const msg = document.createElement('div');
    msg.textContent = messages[currentQuestion];
    msg.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #FFB6C1, #FF69B4);
      color: white;
      padding: 16px 24px;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: 600;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
    `;
    document.body.appendChild(msg);
    msg.animate(
      [
        { opacity: '0', transform: 'translateX(-50%) translateY(50px) scale(0.8)' },
        { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
        { opacity: '1', transform: 'translateX(-50%) translateY(-20px) scale(1)' },
        { opacity: '0', transform: 'translateX(-50%) translateY(-50px) scale(0.8)' },
      ],
      { duration: 3000, easing: 'ease-out' }
    ).onfinish = () => msg.remove();
  }, [currentQuestion]);

  const createConfetti = useCallback(() => {
    const colors = ['#FFB6C1', '#FFC0CB', '#FF91A4', '#FF69B4', '#FFE4E1'];
    const emojis = ['💖', '💕', '❤️', '💝', '🌹', '✨', '🎉'];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        const isEmoji = Math.random() > 0.5;

        if (isEmoji) {
          confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          confetti.style.fontSize = '20px';
        } else {
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        confetti.style.cssText += `
          position: fixed;
          top: -20px;
          left: ${Math.random() * window.innerWidth}px;
          pointer-events: none;
          z-index: 1000;
          transform: rotate(${Math.random() * 360}deg);
        `;

        document.body.appendChild(confetti);
        confetti.animate(
          [
            { transform: `translateY(-20px) rotate(0deg)`, opacity: '1' },
            { transform: `translateY(100vh) rotate(360deg)`, opacity: '0' },
          ],
          { duration: 3000 + Math.random() * 2000, easing: 'linear' }
        ).onfinish = () => confetti.remove();
      }, i * 100);
    }
  }, []);

  const goHome = useCallback(() => {
    router.push('/memories');
  }, [router]);

  // ==========================================
  // RENDER
  // ==========================================

  const currentQ = QUESTIONS[currentQuestion];

  return (
    <div className={styles.sorryPage}>
      {/* Background Animation */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientBg} />

        {/* Floating Hearts */}
        <div className={styles.floatingHearts}>
          {HEART_POSITIONS.map((h, i) => (
            <div
              key={i}
              className={styles.heart}
              style={{
                left: h.left,
                top: h.top,
                animationDelay: h.delay,
                background: h.bg,
              }}
            />
          ))}
        </div>

        {/* Falling Tears */}
        <div className={styles.fallingTears}>
          {TEAR_POSITIONS.map((t, i) => (
            <div
              key={i}
              className={styles.tear}
              style={{ left: t.left, animationDelay: t.delay }}
            >
              💧
            </div>
          ))}
        </div>

        {/* Floating Particles */}
        <div className={styles.floatingParticles}>
          {PARTICLE_POSITIONS.map((p, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{ left: p.left, animationDelay: p.delay }}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className={styles.container}>
        {/* Random Image */}
        <div className={styles.mediaContainer}>
          {mediaSrc && (
            <img
              src={mediaSrc}
              alt="Random memory"
              className={styles.randomMedia}
            />
          )}
        </div>

        {/* Question Cards */}
        {!showFinal && !showGames && (
          <div className={styles.gameContainer}>
            <div className={styles.questionCard} key={currentQuestion}>
              <h2 className={styles.questionTitle}>{currentQ.title}</h2>
              <div className={styles.answerButtons}>
                <button
                  className={styles.yesBtn}
                  style={{ transform: `scale(${yesBtnScale})` }}
                  onClick={handleYesClick}
                >
                  {currentQ.yesText}
                </button>
                <button
                  className={styles.noBtn}
                  style={{
                    transform: `scale(${noBtnScale})`,
                    opacity: noBtnScale,
                    display: noBtnScale <= 0 ? 'none' : 'block',
                  }}
                  onClick={handleNoClick}
                >
                  {currentQ.noText}
                </button>
              </div>
              <div className={styles.poemText}>
                <p style={{ whiteSpace: 'pre-line' }}>{currentQ.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Final Message */}
        {showFinal && !showGames && (
          <div className={styles.gameContainer}>
            <div className={styles.questionCard}>
              <h2 className={styles.finalTitle}>
                Cảm ơn công chúa đã tha lỗi cho anh! 😭❤️
              </h2>
              <div className={styles.finalContent}>
                {/* Love Poem */}
                <div className={styles.lovePoem}>
                  <h3>Thơ chuộc lỗi tặng eiuu:</h3>
                  <p className={styles.poemTextStyled}>
                    &quot;Vài lời vụng dại anh trao,<br />
                    Mong em tha thứ, ngọt ngào như xưa.<br />
                    Tình anh như những cơn mưa,<br />
                    Tưới cho tình cảm, sớm trưa mặn nồng.<br /><br />
                    Em đây có biết hay chăng,<br />
                    Em iuuu mà khóc, là aiuu lòng đau như cắt nước mắt đầm đìa.<br />
                    Từ nay anh hứa ngọt ngào,<br />
                    Yêu em, thương mãi, dạt dào tìn yêu!&quot; 💕
                  </p>
                </div>

                {/* Love Stats */}
                <div className={styles.loveStats}>
                  <h3>Mức độ iuuu em của anh:</h3>
                  <div className={styles.loveMeter}>
                    <div className={styles.loveBar}>
                      <div
                        className={styles.loveFill}
                        style={{ width: `${loveFillWidth}%` }}
                      >
                        <span className={styles.lovePercentage}>∞%</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.loveDescription}>Iuuu em vô hạnnnnn! ❤️</p>
                </div>

                {/* Promises */}
                <div className={styles.promiseSection}>
                  <h3>Lời hứa từ trái tim của aiuu:</h3>
                  <ul className={styles.promiseList}>
                    <li className={styles.promiseItem}>✅ Luôn luôn lắng nghe và dỗ dành eiuu</li>
                    <li className={styles.promiseItem}>✅ Tự giác iuuuu em mỗi ngày nhiều hơn</li>
                    <li className={styles.promiseItem}>✅ Bảo vệ em khỏi mọi thứ trên đời</li>
                    <li className={styles.promiseItem}>✅ Yêu em đến hết đời, tới 1000+ tủi luôn!</li>
                  </ul>
                </div>
              </div>

              <div className={styles.finalButtons}>
                <button className={styles.loveBtn} onClick={() => setShowGames(true)}>
                  <i className="fas fa-gamepad" /> Chơi mini games tình yêu
                </button>
                <button className={styles.homeBtn} onClick={goHome}>
                  <i className="fas fa-home" /> Về trang chủ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mini Games Section */}
        {showGames && (
          <div className={styles.loveGamesSection}>
            <h2 className={styles.gamesTitle}>💕 Mini Games Tình Yêu 💕</h2>
            <div className={styles.gamesGrid}>
              {MINI_GAMES.map((game) => (
                <div key={game.id} className={styles.gameCard}>
                  <h3>{game.icon} {game.title}</h3>
                  <p>{game.desc}</p>
                  <button
                    className={styles.playBtn}
                    onClick={() => alert(`Game "${game.title}" sẽ được mở trong phiên bản tiếp theo! 💕`)}
                  >
                    Chơi ngay
                  </button>
                </div>
              ))}
            </div>
            <button className={styles.backBtn} onClick={() => setShowGames(false)}>
              <i className="fas fa-arrow-left" /> Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
