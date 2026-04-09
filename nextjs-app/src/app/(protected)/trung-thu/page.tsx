'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './trung-thu.module.css';

/* ==========================================
   LOVE MESSAGES DATA
   ========================================== */
const loveMessages = [
  "Em à, anh iuu em cao hơn cả núi, dài hơn cả sông, rộng hơn cả đất, xanh hơn cả trời! 💖",
  "Vũ trụ trong mắt anh là em, công chúa xinh đẹp của anh 🌙✨",
  "Nếu như nỗi nhớ của anh như sao trên trời thì thiệt là vô lý, vì anh lúc nào cũng nghĩ về em 💫",
  "Trăng đêm nay tròn lắm, nhưng không tròn bằng tình yêu anh dành cho em 🌕❤️",
  "Em là ánh trăng chiếu sáng cả trái tim và tâm hồn anh trong đêm Trung Thu ni 🌙💕",
  "Anh muốn cùng em ngắm trăng đến hết đời, kể những câu chuyện tình yêu của chúng mình 🥮💖",
  "Bánh trung thu ngọt, nhưng không ngọt bằng nụ cười của em công chúa à 😊🏮",
  "Chúc em một mùa trung thu thật ấm áp, nhiều niềm vui và hạnh phúc bên anh nhié! 🎋✨",
  "Em là ngôi sao sáng nhất dẫn lối cho anh về phía hạnh phúc ⭐💕",
  "Anh thích cuộc đời anh có em, và muốn đi cùng em tới cuối đời 💖🌙",
  "iuuu em cao hơn cả núi dài hơn cả sông, rộng hơn cả đất xanh hơn cả trời, bay ra vũ trụ giãn nở cùng vũ trụ vô hạnnnnn",
  "nếu như nói nỗi nhớ của a như sao trên trời thì thiệt là vô lý, vì sao trên trời còn có bữa quên mọc, còn a thì lúc lào cũng nghĩ dìa e",
  "vũ trụ trong góc nhìn khoa học là màu đen huyền bí, là vật chất tối, năng lượng tối, còn vũ trụ trong mắt a là e",
  "t2 là monday, t3 là tuesday, coàn ny của e là anhday :)))",
  "đường đời rộng lớn mênh mông, muốn mình hạnh phúc sao k chung đường, nhớ ai thao thức đêm trường, trong đầu bóng dáng vẫn thường quẩn quanh, chữ tình ta đẹp như tranh, bởi vì trong đó có a có nàng... nàng công chúa iuu của a 🥰",
  "giữa cuộc đời hàng hàng cám dỗ, a chỉ cần bến đổ là tim e",
  "ngắm mây ngắm cả bầu trời, iu e, ngắm cả cuộc đời đc khom :))",
  "nếu quá khứ của e là một chiếc bánh dở tệ thì a sẽ ăn hết rồi đền cho e một chiếc bánh ngon hơn",
  "thiệt ra chi a cũng muốn về nhất, nma a lại muốn iuu e mãi mãi về sau",
  "chết gòi hqua đọc truyện cổ tích mà quên gấp lại, để công chúa ra cả đây :))))",
  "đố e iu là động từ hay tính từ, tính từ lúc gặp e :))))",
  "bữa ni đầu tóc a cứ xơ xơ, xơ e là nhá :)))",
  "bắc thang lên hỏi ông trời, sao tôi cứ mãi ko thôi nhớ nàng, ông trời cất tiếng khẽ khàng, vì con đã trót để nàng trong tim",
  "có con ma, ma em quế :)))",
  "Nếu anh có thể cho em một khả năng đặc biệt trong cuộc đời này, anh sẽ cho em khả năng nhìn thấy chính mình qua đôi mắt của anh. Sau đó em sẽ nhận ra, em thật đặc biệt thế nào đối với anh.",
  "a với e vô tình gặp nhau, nma a quyết định dừng lại đưa tay, rồi e cũng đồng ý nắm",
  "Khôm được bỏ công túa đi trước một mình",
];

const memorySymbols = [
  '/data/images/01.jpg', '/data/images/02.jpg', '/data/images/03.jpg', '/data/images/04.jpg',
  '/data/images/05.jpg', '/data/images/06.jpg', '/data/images/07.jpg', '/data/images/1.jpg',
];

/* ==========================================
   INTERFACES
   ========================================== */
interface WishData {
  id: number;
  content: string;
  timestamp: string;
  date: string;
}

interface MemoryCardData {
  symbol: string;
  index: number;
  flipped: boolean;
  matched: boolean;
}

interface FloatingLanternData {
  id: number;
  left: number;
  wish: string;
}

/* ==========================================
   TRUNG THU PAGE COMPONENT
   ========================================== */
export default function TrungThuPage() {
  return (
    <div className={styles.trungThuPage}>
      {/* Background Animation */}
      <BackgroundAnimation />

      {/* Header */}
      <Header />

      {/* Video Section */}
      <VideoSection />

      {/* Wishes Section */}
      <WishesSection />

      {/* Games Section */}
      <GamesSection />

      {/* Love Letters Section */}
      <LoveLettersSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ==========================================
   BACKGROUND ANIMATION
   ========================================== */
function BackgroundAnimation() {
  return (
    <div className={styles.backgroundAnimation}>
      <div className={styles.moonBg}></div>
      <div className={styles.starsContainer}>
        <div className={`${styles.star} ${styles.star1}`}>✨</div>
        <div className={`${styles.star} ${styles.star2}`}>⭐</div>
        <div className={`${styles.star} ${styles.star3}`}>🌟</div>
        <div className={`${styles.star} ${styles.star4}`}>✨</div>
        <div className={`${styles.star} ${styles.star5}`}>⭐</div>
        <div className={`${styles.star} ${styles.star6}`}>🌟</div>
        <div className={`${styles.star} ${styles.star7}`}>✨</div>
        <div className={`${styles.star} ${styles.star8}`}>⭐</div>
      </div>
      <div className={styles.lanternsContainer}>
        <div className={`${styles.lantern} ${styles.lantern1}`}>🏮</div>
        <div className={`${styles.lantern} ${styles.lantern2}`}>🏮</div>
        <div className={`${styles.lantern} ${styles.lantern3}`}>🏮</div>
        <div className={`${styles.lantern} ${styles.lantern4}`}>🏮</div>
      </div>
      <div className={styles.floatingHearts}>
        <div className={`${styles.heart} ${styles.heart1}`}></div>
        <div className={`${styles.heart} ${styles.heart2}`}></div>
        <div className={`${styles.heart} ${styles.heart3}`}></div>
        <div className={`${styles.heart} ${styles.heart4}`}></div>
        <div className={`${styles.heart} ${styles.heart5}`}></div>
      </div>
    </div>
  );
}

/* ==========================================
   HEADER
   ========================================== */
function Header() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={styles.trungThuHeader}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            🌙 Tết Trung Thu 2025 🌙
            <span className={styles.heartIcon}>❤️</span>
            <div className={styles.subtitleHeader}>Tìn iuuu vươn đến vầng trăng hẹ hẹ :))</div>
          </h1>
          <p className={styles.subtitle}>
            Hôm nay em qua nhà làm cơm cuộn ăn, ở với anh cả ngày quó nà zui. Sắp Trung Thu rồi, anh muốn cùng em ngắm trăng và kể những câu chuyện tình iuuu của chúng mình...
          </p>
        </div>

        <nav className={styles.navActions}>
          <button className={styles.navBtn} onClick={() => scrollToSection('video-section')}>
            🎬 <span>Video Trung Thu</span>
          </button>
          <button className={styles.navBtn} onClick={() => scrollToSection('wishes-section')}>
            ❤️ <span>Lời Chúc Tình Yêu</span>
          </button>
          <button className={styles.specialBtn} onClick={() => scrollToSection('games-section')}>
            🎮 <span>Games Trung Thu</span>
          </button>
          <Link href="/memories" className={styles.navBtn}>
            📖 <span>Kỷ Niệm Của Chúng Ta</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ==========================================
   VIDEO SECTION
   ========================================== */
function VideoSection() {
  return (
    <section id="video-section" className={styles.videoSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            🎬 Video Trung Thu Của Chúng Mình
          </h2>
          <p className={styles.sectionSubtitle}>
            Những khoảnh khắc đẹp của chúng mình trong ngày Tết Trung Thu nềy (trung thu xong aiuu bổ sung sau :))))...
          </p>
        </div>

        <div className={styles.videoContainer}>
          <video className={styles.videoElement} controls>
            <source src="/data/videos/trung-thu-01.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video này.
          </video>
          <div className={styles.videoOverlay}>
            <div className={styles.videoMessage}>
              &quot;Em là ánh trăng trong đêm Trung Thu của anh,
              chiếu sáng cả trái tim và tâm hồn anh... :&gt;&quot; 🌙❤️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   WISHES SECTION
   ========================================== */
function WishesSection() {
  return (
    <section id="wishes-section" className={styles.wishesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            ❤️ Lời Chúc Trung Thu Từ Trái Tim Aiuuu
          </h2>
          <p className={styles.sectionSubtitle}>
            Những điều anh muốn nói với em trong đêm trăng tròn nềy...
          </p>
        </div>

        <div className={styles.wishesGrid}>
          <div className={`${styles.wishCard} ${styles.wish1}`}>
            <div className={styles.wishIcon}>🌙</div>
            <h3>Trăng Tròn Tình Yêu</h3>
            <p>
              &quot;Em oiii, trăng đêm nay tròn lắm, nhưng không tròn bằng tình yêu anh dành cho em.
              Anh iuu em như nèo chắc e cũm biết, cao hơn cả núi, dài hơn cả sông, rộng hơn cả đất, xanh hơn cả trời kkk :)))),
              bay ra vũ trụ giãn nở cùng vũ trụ vô hạnnnnn... :&gt;
              Chúc em một mùa Trung Thu thật ấm áp bên anhh nhié!
              Iuuu eiuuu của a ❤️&quot;
            </p>
          </div>

          <div className={`${styles.wishCard} ${styles.wish2}`}>
            <div className={styles.wishIcon}>🏮</div>
            <h3>Đèn Lồng Kỷ Niệm</h3>
            <p>
              &quot;Mỗi chiếc đèn lồng là một kỷ niệm đẹp của chúng mình.
              Từ lần gặp đầu tiên, tin nhắn đầu tiên, đến lời tỏ tình ngọt ngào...
              Anh muốn cùng em tạo thêm nhiều kỷ niệm mới trong đêm trăng này.
              Cùng nhau thưởng trăng, ăn bánh trung thu và kể những câu chuyện tình yêu của chúng mình.&quot;
            </p>
          </div>

          <div className={`${styles.wishCard} ${styles.wish3}`}>
            <div className={styles.wishIcon}>🥮</div>
            <h3>Bánh Trung Thu Ngọt Ngào</h3>
            <p>
              &quot;Bánh trung thu ngọt, nhưng không ngọt bằng nụ cười của em.
              Vũ trụ trong góc nhìn khoa học là màu đen huyền bí, là vật chất tối, năng lượng tối,
              còn vũ trụ trong mắt anh là em.
              Bản chất vũ trụ thiệt là tối tăm, nma cóa em cái nóa tự nhiên sáng rực như trăng đêm rằm :)))
              Chúc công chúa của anh một mùa trung thu thật nhiều niềm vui và hạnh phúc! Bên aiuuu :&gt; ❤️&quot;
            </p>
          </div>

          <div className={`${styles.wishCard} ${styles.wish4}`}>
            <div className={styles.wishIcon}>⭐</div>
            <h3>Ngôi Sao Duy Nhất</h3>
            <p>
              &quot;Nếu như nói nỗi nhớ của anh như sao trên trời thì thiệt là vô lý,
              vì sao trên trời còn có bữa quên mọc, còn anh thì lúc lào cũng nghĩ dìa em.
              Em là ngôi sao sáng nhất trong trái tim anh, dẫn lối cho anh về phía hạnh phúc.
              Trung thu này, chúng mình sẽ cùng nhau ước nguyện dưới ánh trăng nhié! Iuuu emmmmm ❤️&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   GAMES SECTION
   ========================================== */
function GamesSection() {
  return (
    <section id="games-section" className={styles.gamesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            🎮 Games Trung Thu
          </h2>
          <p className={styles.sectionSubtitle}>
            Cùng nhau chơi những trò chơi trong đêm trăng tròn :)))
          </p>
        </div>

        <div className={styles.gamesGrid}>
          <MemoryGame />
          <LoveMessagesGame />
        </div>

        <div className={styles.gamesGrid}>
          <LanternWishesGame />
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MEMORY GAME COMPONENT
   ========================================== */
function MemoryGame() {
  const [cards, setCards] = useState<MemoryCardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCheckingRef = useRef(false);

  const initGame = useCallback(() => {
    const cardSymbols = [...memorySymbols, ...memorySymbols];
    cardSymbols.sort(() => Math.random() - 0.5);

    setCards(cardSymbols.map((symbol, index) => ({
      symbol,
      index,
      flipped: false,
      matched: false,
    })));
    setFlippedIndices([]);
    setScore(0);
    setTimer(0);
    setMatchedPairs(0);
    isCheckingRef.current = false;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initGame]);

  const flipCard = (index: number) => {
    if (isCheckingRef.current) return;
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      isCheckingRef.current = true;
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (newCards[i1].symbol === newCards[i2].symbol) {
          // Match!
          setCards(prev => {
            const updated = [...prev];
            updated[i1] = { ...updated[i1], matched: true };
            updated[i2] = { ...updated[i2], matched: true };
            return updated;
          });
          setScore(prev => prev + 10);
          setMatchedPairs(prev => {
            const newPairs = prev + 1;
            if (newPairs === memorySymbols.length) {
              if (timerRef.current) clearInterval(timerRef.current);
            }
            return newPairs;
          });
        } else {
          // No match
          setCards(prev => {
            const updated = [...prev];
            updated[i1] = { ...updated[i1], flipped: false };
            updated[i2] = { ...updated[i2], flipped: false };
            return updated;
          });
          setScore(prev => Math.max(0, prev - 2));
        }
        setFlippedIndices([]);
        isCheckingRef.current = false;
      }, 800);
    }
  };

  return (
    <div className={styles.gameCard}>
      <div className={styles.gameHeader}>
        <span className={styles.gameHeaderIcon}>🧠</span>
        <h3>Trí Nhớ Kỷ Niệm</h3>
        <p>Tìm các cặp ảnh giống nhau về kỷ niệm của chúng mình!</p>
      </div>
      <div>
        <div className={styles.memoryBoard}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${styles.memoryCard} ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => flipCard(i)}
              style={card.flipped || card.matched ? {} : {}}
            >
              <div className={styles.memoryCardInner} style={{
                transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'none',
                ...(card.matched ? { boxShadow: '0 0 25px 8px #FFD700', opacity: 0.85 } : {}),
              }}>
                <div className={styles.memoryCardFront}></div>
                <div className={styles.memoryCardBack} style={{
                  backgroundImage: `url('${card.symbol}')`,
                }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.gameStats}>
          <div><span>Điểm: </span><span>{score}</span></div>
          <div><span>Thời gian: </span><span>{timer}</span>s</div>
        </div>
        {matchedPairs === memorySymbols.length && (
          <div style={{ textAlign: 'center', color: '#FFD700', marginBottom: 10 }}>
            🎉 Chúc mừng! Điểm: {score} | Thời gian: {timer}s 💖
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <button className={styles.gameBtn} onClick={initGame}>Chơi Lại</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   LOVE MESSAGES GAME COMPONENT
   ========================================== */
function LoveMessagesGame() {
  const [currentMessage, setCurrentMessage] = useState('Nhấn vào trăng để nhận lời yêu thương từ anh nhé! ❤️');
  const [messagesCount, setMessagesCount] = useState(0);

  const showMessage = () => {
    const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    setCurrentMessage(randomMessage);
    setMessagesCount(prev => prev + 1);
  };

  return (
    <div className={styles.gameCard}>
      <div className={styles.gameHeader}>
        <span className={styles.gameHeaderIcon}>💌</span>
        <h3>Thông Điệp Tình Yêu</h3>
        <p>Nhấn vào trăng để nhận những lời ngọt ngào từ anh nhié!</p>
      </div>
      <div>
        <div className={styles.moonClick} onClick={showMessage}>
          <div className={styles.moon}>🌙</div>
          <div className={styles.clickHint}>Nhấn vào trăng!</div>
        </div>
        <div className={styles.messageDisplay}>
          <p>{currentMessage}</p>
        </div>
        <div className={styles.messageStats}>
          Tin nhắn đã nhận: <span>{messagesCount}</span>/2332025
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   LANTERN WISHES GAME COMPONENT
   ========================================== */
function LanternWishesGame() {
  const [wishInput, setWishInput] = useState('');
  const [wishesCount, setWishesCount] = useState(0);
  const [wishesData, setWishesData] = useState<WishData[]>([]);
  const [floatingLanterns, setFloatingLanterns] = useState<FloatingLanternData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('trungThuWishes');
      if (saved) {
        const parsed: WishData[] = JSON.parse(saved);
        setWishesData(parsed);
        setWishesCount(parsed.length);
      }
    } catch { /* empty */ }
  }, []);

  const saveToStorage = (data: WishData[]) => {
    try {
      localStorage.setItem('trungThuWishes', JSON.stringify(data));
    } catch { /* empty */ }
  };

  const releaseLantern = () => {
    const wish = wishInput.trim();
    if (!wish) {
      alert('Công chúa hãy viết điều ước của mình trước khi thả đèn nhié! 🏮');
      return;
    }

    const newWish: WishData = {
      id: Date.now(),
      content: wish,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const newData = [...wishesData, newWish];
    setWishesData(newData);
    saveToStorage(newData);
    setWishesCount(newData.length);

    // Add floating lantern
    const lantern: FloatingLanternData = {
      id: Date.now(),
      left: Math.random() * 80 + 5,
      wish,
    };
    setFloatingLanterns(prev => [...prev, lantern]);
    setTimeout(() => {
      setFloatingLanterns(prev => prev.filter(l => l.id !== lantern.id));
    }, 8000);

    setWishInput('');
  };

  const deleteWish = (wishId: number) => {
    if (confirm('Bạn có chắc muốn xóa điều ước này không?')) {
      const newData = wishesData.filter(w => w.id !== wishId);
      setWishesData(newData);
      setWishesCount(newData.length);
      saveToStorage(newData);
    }
  };

  const exportWishes = () => {
    if (wishesData.length === 0) {
      alert('Chưa có điều ước nào để xuất! 🌙');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalWishes: wishesData.length,
      wishes: wishesData,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `trung-thu-wishes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importWishes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (!importData.wishes || !Array.isArray(importData.wishes)) {
          throw new Error('Invalid file format');
        }

        if (confirm(`Bạn có muốn thêm ${importData.wishes.length} điều ước từ file không?`)) {
          const newWishes = importData.wishes
            .filter((w: WishData) => w.content)
            .map((w: WishData) => ({
              id: w.id || Date.now() + Math.random(),
              content: w.content,
              timestamp: w.timestamp || new Date().toISOString(),
              date: w.date || new Date().toLocaleDateString('vi-VN'),
            }));

          const newData = [...wishesData, ...newWishes];
          setWishesData(newData);
          setWishesCount(newData.length);
          saveToStorage(newData);
          alert(`Đã thêm thành công ${newWishes.length} điều ước! 🌙💖`);
        }
      } catch {
        alert('Lỗi khi đọc file! Vui lòng kiểm tra định dạng file.');
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const clearAllWishes = () => {
    if (wishesData.length === 0) {
      alert('Không có điều ước nào để xóa! 🌙');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa tất cả ${wishesData.length} điều ước không?`)) {
      setWishesData([]);
      setWishesCount(0);
      localStorage.removeItem('trungThuWishes');
      setShowModal(false);
      alert('Đã xóa tất cả điều ước! 🌙');
    }
  };

  return (
    <div className={styles.gameCard}>
      <div className={styles.gameHeader}>
        <span className={styles.gameHeaderIcon}>✨</span>
        <h3>Thả Đèn Ước Nguyện</h3>
        <p>Viết điều ước và thả đèn lên trời cùng anh nhié!</p>
      </div>
      <div>
        <div className={styles.wishInputContainer}>
          <input
            type="text"
            className={styles.wishInput}
            placeholder="Viết điều ước của em..."
            value={wishInput}
            onChange={(e) => setWishInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') releaseLantern();
            }}
          />
          <button className={styles.releaseLanternBtn} onClick={releaseLantern}>
            Thả Đèn 🏮
          </button>
        </div>
        <div className={styles.lanternsSky}>
          {floatingLanterns.map((l) => (
            <div
              key={l.id}
              className={styles.floatingWishLantern}
              title={l.wish}
              style={{ left: `${l.left}%` }}
            >
              🏮
            </div>
          ))}
        </div>
        <div className={styles.wishesCount}>
          Điều ước đã thả: <span>{wishesCount}</span>
        </div>

        {/* Data Management Controls */}
        <div className={styles.wishesDataControls}>
          <button className={styles.gameBtnSecondary} onClick={() => setShowModal(true)}>📋 Xem Điều Ước</button>
          <button className={styles.gameBtnSecondary} onClick={exportWishes}>💾 Tải Xuống</button>
          <button className={styles.gameBtnSecondary} onClick={() => fileInputRef.current?.click()}>📁 Tải Lên</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={importWishes}
          />
          <button className={styles.gameBtnDanger} onClick={clearAllWishes}>🗑️ Xóa Tất Cả</button>
        </div>

        {/* Wishes Modal */}
        {showModal && (
          <div className={styles.wishesModal} onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>💖 Tất Cả Điều Ước Của Em</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className={styles.wishesList}>
                {wishesData.length === 0 ? (
                  <div className={styles.noWishes}>
                    <p>🌙 Chưa có điều ước nào được thả...</p>
                    <p>Hãy viết điều ước đầu tiên của em nhé! 💖</p>
                  </div>
                ) : (
                  [...wishesData]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((wish, index) => (
                      <div key={wish.id} className={styles.wishItem}>
                        <div className={styles.wishItemHeader}>
                          <span className={styles.wishNumber}>#{wishesData.length - index}</span>
                          <span className={styles.wishDate}>{wish.date}</span>
                          <button className={styles.deleteWishBtn} onClick={() => deleteWish(wish.id)}>🗑️</button>
                        </div>
                        <div className={styles.wishItemContent}>&quot;{wish.content}&quot;</div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   LOVE LETTERS SECTION
   ========================================== */
function LoveLettersSection() {
  return (
    <section className={styles.loveLettersSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            ❤️ IUUUU EMMMM
          </h2>
        </div>

        <div className={styles.loveLetters}>
          <div className={styles.letterCard}>
            <div className={styles.letterHeader}>
              <span className={styles.letterHeaderIcon}>❤️</span>
              <h3>Lời Cam Kết Trung Thu</h3>
            </div>
            <div className={styles.letterContent}>
              <p className={styles.commitment}>
                &quot;Em à, trong đêm trăng tròn này, anh muốn nhắc lại lời hứa của anh:
                Anh đã xác định nghiêm túc với em ngay từ đầu, đã tính tới luôn chuyện cưới em...
                Anh muốn đi cùng em tới cuối đời, đó là mong muốn của anh ngay từ khi bắt đầu.
                Anh luôn xem em như là vợ iuuu của anh luôn.
                Trung thu này, hãy cùng anh ước nguyện cho tương lai tươi sáng của chúng mình nhié! iuuuu e ❤️🥰&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   FOOTER
   ========================================== */
function Footer() {
  return (
    <footer className={styles.trungThuFooter}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerMessage}>
            <h3>🌙 Tết Trung Thu 2025 🌙</h3>
            <p>
              &quot;Anh biết là dù không có anh thì em vẫn tự làm được mọi thứ...
              nhưng mà cóa anh để sai vặt thì tuỵt zời hơn chớ hè :))))
              Còn bonus thêm là cóa anh để iu em nữa chớ :)))
              Bonus thêm combo tốt choa tim, tốt choa tinh thần, tốt choa sức khỏe, tăng tuần hoàn máu, tăng size nữa chớ :)))
              Gòi còn cùng a ngắm trăng nè, cùng a ăn vặt nè, cùng a chơi game nè, cùng a đi chơi nè, cùng a nhong nhong ngoài đường nè,... Cùng a làm nhiều thứ nữa kkk :&gt;
              Aiuu muốn cuộc đời em có anh ❤️&quot;
            </p>
            <p className={styles.signature}>- Yêuu em mãi mãi ❤️ -</p>
          </div>

          <div className={styles.footerNav}>
            <Link href="/" className={styles.footerLink}>
              🏠 Trang Chủ
            </Link>
            <Link href="/memories" className={styles.footerLink}>
              📖 Kỷ Niệm
            </Link>
            <Link href="/100days" className={styles.footerLink}>
              📅 100 Ngày
            </Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 - Được tạo với tình iuuu vô tận của aiuuu💖</p>
        </div>
      </div>
    </footer>
  );
}
