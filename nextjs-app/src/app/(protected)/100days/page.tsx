'use client';

/**
 * 100 Days Celebration Page
 * Route: /100days
 * Chuyển đổi từ 100days.html + 100days.css + 100days.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './100days.module.css';

// ==========================================
// DATA
// ==========================================

const HEARTS_EMOJI = ['💖', '💕', '💗', '💘', '💝', '💖', '💕', '💗', '💘', '💝',
  '💖', '💕', '💗', '💘', '💝', '💖', '💕', '💗', '💘', '💝'];

const SPARKLES_EMOJI = ['✨', '💫', '⭐', '🌟', '💫', '⭐', '✨', '🌟', '💫', '⭐'];

const STATS = [
  { icon: 'fas fa-heart', number: '100', label: 'Ngày yêu nhau', isNumeric: true },
  { icon: 'fas fa-calendar-check', number: '∞', label: 'Kỷ niệm đẹp', isNumeric: false },
  { icon: 'fas fa-smile', number: '2400', label: 'Giờ hạnh phúc', isNumeric: true },
  { icon: 'fas fa-infinity', number: '∞', label: 'Tình iuuuu', isNumeric: false },
];

const TIMELINE_ITEMS = [
  {
    date: 'Ngày 1 - 23/03/2025',
    title: 'Ngày Tỏ Tình - Khởi Đầu Tình Yêu',
    icon: 'fas fa-heart',
    text: [
      '"Anh cảm thấy tình cảm của anh dành cho em đủ để anh nói ra lời tỏ tình, anh rất là thích em..."',
      'Ngày đẹp nhất đời anh, khi anh dũng cảm nói ra những gì đã ấp ủ trong lòng. Từ đó, cuộc đời anh có thêm một ý nghĩa tuyệt vời: được iuuuu và được yêu lại bởi công chúa của anh.',
    ],
    image: '/data/images/01.jpg',
    imageAlt: 'Kỷ niệm tỏ tình',
    featured: false,
  },
  {
    date: 'Ngày 30 - Tháng 4/2025',
    title: 'Một Tháng Hạnh Phúc',
    icon: 'fas fa-star',
    text: [
      '"Anh biết là dù không có anh thì em vẫn làm được mọi thứ... nhưng có một điều anh khẳng định được, anh thích cuộc đời anh có em"',
      'Một tháng đầu tiên bên em, anh nhận ra rằng tình iuuuu không phải là sự phụ thuộc, mà là sự lựa chọn hạnh phúc. Anh chọn em, không phải vì cần em, mà vì muốn cuộc đời mình có em.',
    ],
    image: '/data/images/02.jpg',
    imageAlt: 'Một tháng yêu nhau',
    featured: false,
  },
  {
    date: 'Ngày 60 - Tháng 5/2025',
    title: 'Lời Hứa Về Tương Lai',
    icon: 'fas fa-ring',
    text: [
      '"Anh đã xác định nghiêm túc với em ngay từ đầu, thì đã tính tới luôn chuyện cưới em... anh muốn đi cùng em tới cuối đời"',
      'Hai tháng bên em, anh càng chắc chắn rằng em chính là người anh muốn đồng hành cả đời. Anh không chỉ yêu em ở hiện tại, mà còn muốn yêu em đến tận cuối đời.',
    ],
    image: '/data/images/03.jpg',
    imageAlt: 'Lời hứa tương lai',
    featured: false,
  },
  {
    date: 'Ngày 100 - Hôm nay',
    title: '100 Ngày Kỷ Niệm',
    icon: 'fas fa-crown',
    text: [
      '"100 ngày qua như một giấc mơ đẹp, nhưng em biết đây không phải giấc mơ, mà là hiện thực tuyệt vời nhất"',
      '100 ngày iuuuu nhau, 100 ngày hạnh phúc, 100 ngày khám phá những điều tuyệt vời ở nhau. Và đây chỉ là khởi đầu cho hành trình dài hơn, đẹp hơn phía trước.',
    ],
    image: '/data/images/04.jpg',
    imageAlt: '100 ngày kỷ niệm',
    featured: true,
  },
];

const QUOTES = [
  {
    icon: 'fas fa-heart',
    text: '"Em là nắng mai soi qua song cửa, em là gió chiều thổi khẽ bên tai, em là mưa xuân rơi nhẹ trên tóc, em là cả tứ mùa trong đời anh mãi chóc chóc he hee :))"',
    author: '- Tứ mùa bên em',
  },
  {
    icon: 'fas fa-infinity',
    text: '"Yêu em nhiều như sao đếm không hết, yêu em lâu như nước biển không cạn, iuuu em sâu như vực thẳm không đáy, iuuuu em mãi như lời thề không phai"',
    author: '- Lời thề tình iuuu vĩnh cửu',
  },
  {
    icon: 'fas fa-star',
    text: '"Nếu anh là mặt trời thì em là mặt trăng, nếu anh là đại dương thì em là ánh sáng, nếu anh là cánh chim thì em là bầu trời, cùng nhau bay xa về phía chân trời ước mơ"',
    author: '- Đôi ta hoàn hảo',
  },
  {
    icon: 'fas fa-crown',
    text: '"Công chúa nhỏ của anh ơi, mỗi buổi sáng thức dậy anh đều cảm ơn ông trời vì đã cho anh gặp em. Em là món quà đẹp nhất mà cuộc đời tặng anh"',
    author: '- Lời cảm ơn từ trái tim',
  },
  {
    icon: 'fas fa-ring',
    text: '"Tình yêu không chỉ là nói \'anh yêu em\', mà là việc anh luôn ở đây khi em cần, luôn lắng nghe khi em buồn, luôn ôm em khi em mệt, có gì cứ nói với a nha công chúa iuuu của anhh ❤️"',
    author: '- Định nghĩa tình iuuu',
  },
];

const GALLERY = [
  { image: '/data/images/ptb01.jpg', alt: 'Photobooth lần 1', text: 'Lần đầu chụp photobooth' },
  { image: '/data/images/ptb02.jpg', alt: 'Photobooth lần 2', text: 'Photobooth lần 2' },
  { image: '/data/images/pvb03.jpg', alt: 'Photobooth lần 3', text: 'Photobooth lần 3' },
  { image: '/data/images/pvb04.jpg', alt: 'Photobooth lần 4', text: 'Photobooth mới nhất' },
];

const DREAMS = [
  { icon: 'fas fa-ring', title: 'Lễ Cưới Trong Mơ', desc: '"Anh luôn xem em như là vợ iuu của anh luôn" - Lâu nay vẫn dị, nma anh vẫn mong ngày em trở thành cô dâu xinh bên anhh' },
  { icon: 'fas fa-heart', title: 'Yêu Thương Trọn Đời', desc: '"Đôi ta ước hẹn một đời thủy chung" - Cam kết yêu thương không thay đổi' },
  { icon: 'fas fa-home', title: 'Tổ Ấm Nhỏ', desc: '"Hai ta hạnh phúc ở chung một nhà" - Xây dựng tổ ấm hạnh phúc của riêng mình' },
  { icon: 'fas fa-baby', title: 'Gia Đình Nhỏ', desc: 'Những thiên thần nhỏ sẽ làm tổ ấm của chúng mình thêm trọn vẹn' },
];

// ==========================================
// HOOKS
// ==========================================

/** Hook for IntersectionObserver to trigger animations */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/** Hook for animating a counter */
function useCounterAnimation(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || animatedRef.current) return;
    animatedRef.current = true;

    const startTime = performance.now();
    const increment = target / (duration / 16);

    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(update);
      else setCount(target);
    }

    requestAnimationFrame(update);
  }, [isVisible, target, duration]);

  return count;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function StatCard({ icon, number, label, isNumeric, delay }: {
  icon: string; number: string; label: string; isNumeric: boolean; delay: number;
}) {
  const { ref, isVisible } = useScrollReveal(0.5);
  const numericTarget = isNumeric ? parseInt(number.replace(/,/g, '')) : 0;
  const animatedCount = useCounterAnimation(numericTarget, isVisible);

  return (
    <div
      ref={ref}
      className={`${styles.statCard} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      <div className={styles.statIcon}>
        <i className={icon} />
      </div>
      <div className={`${styles.statNumber} ${!isNumeric ? styles.infinityPulse : ''}`}>
        {isNumeric ? animatedCount.toLocaleString() : number}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function TimelineItem({ item, index }: { item: typeof TIMELINE_ITEMS[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${styles.timelineItem} ${isVisible ? styles.visible : ''} ${item.featured ? styles.timelineItemFeatured : ''}`}
    >
      <div className={styles.timelineMarker}>
        <i className={item.icon} />
      </div>
      <div className={styles.timelineContent}>
        <div className={styles.timelineDate}>{item.date}</div>
        <h3 className={styles.timelineTitle}>{item.title}</h3>
        <div className={styles.timelineText}>
          <p><em>{item.text[0]}</em></p>
          <p>{item.text[1]}</p>
        </div>
        <div className={styles.timelineImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.imageAlt} loading="lazy" />
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ quote, delay }: { quote: typeof QUOTES[0]; delay: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${styles.quoteCard} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      <div className={styles.quoteIcon}>
        <i className={quote.icon} />
      </div>
      <div className={styles.quoteText}>{quote.text}</div>
      <div className={styles.quoteAuthor}>{quote.author}</div>
    </div>
  );
}

function GalleryItem({ item, delay, onClick }: {
  item: typeof GALLERY[0]; delay: number; onClick: () => void;
}) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${styles.galleryItem} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${delay * 150}ms` }}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.alt} loading="lazy" />
      <div className={styles.galleryOverlay}>
        <div className={styles.galleryText}>{item.text}</div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HundredDaysPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Heart rain effect
  const createHeartRain = useCallback(() => {
    const hearts = ['💖', '💕', '💗', '💘', '💝', '❤️', '💓', '💞'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
          position: fixed;
          top: -50px;
          left: ${Math.random() * 100}%;
          font-size: ${Math.random() * 20 + 20}px;
          pointer-events: none;
          z-index: 9999;
          animation: heartFallAnim ${Math.random() * 3 + 3}s linear forwards;
        `;
        document.body.appendChild(heart);
        setTimeout(() => {
          if (document.body.contains(heart)) {
            document.body.removeChild(heart);
          }
        }, 6000);
      }, i * 100);
    }

    // Add keyframes if not exists
    if (!document.querySelector('#heartFallAnimStyle')) {
      const style = document.createElement('style');
      style.id = 'heartFallAnimStyle';
      style.textContent = `
        @keyframes heartFallAnim {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className={styles.page}>
      {/* Scroll Progress */}
      <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }} />

      {/* Background Animation */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientBg} />
        <div className={styles.floatingHearts}>
          {HEARTS_EMOJI.map((emoji, i) => (
            <div key={`heart-${i}`} className={`${styles.heart} ${styles[`heart${i + 1}` as keyof typeof styles] || ''}`}>
              {emoji}
            </div>
          ))}
        </div>
        <div className={styles.loveSparkles}>
          {SPARKLES_EMOJI.map((emoji, i) => (
            <div key={`sparkle-${i}`} className={`${styles.sparkle} ${styles[`sparkle${i + 1}` as keyof typeof styles] || ''}`}>
              {emoji}
            </div>
          ))}
        </div>
        <div className={styles.floatingParticles}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={`particle-${i}`} className={styles.particle} />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroGif}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/data/gif/gif02.gif" alt="100 ngày yêu nhau" className={styles.celebrationGif} />
            </div>
            <div className={styles.milestoneBadge}>
              <div className={styles.badgeInner}>
                <span className={styles.badgeNumber}>100</span>
                <span className={styles.badgeText}>NGÀY</span>
              </div>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>100 Ngày Yêu Nhau</span>
              <span className={styles.titleLine2}>Bằng &amp; Duyên</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Từ ngày 23/03/2025 đến nay - Hành trình tình yêu tuyệt vời của chúng mình
            </p>
            <div className={styles.heroDate}>
              <i className="fas fa-calendar-heart" />
              <span>Kỷ niệm 100 ngày - Tháng 7, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hành Trình 100 Ngày Tình Yêu</h2>
            <p className={styles.sectionSubtitle}>Những khoảnh khắc đáng nhớ nhất trong 100 ngày qua</p>
          </div>
          <div className={styles.timeline}>
            {TIMELINE_ITEMS.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className={styles.quotesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Những Lời Yêu Thương Dành Cho Công Chúa Iuuuuu Của Anhhh</h2>
            <p className={styles.sectionSubtitle}>Những câu nói từ trái tim</p>
          </div>
          <div className={styles.quotesGrid}>
            {QUOTES.map((quote, i) => (
              <QuoteCard key={i} quote={quote} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Số Lần Đi Photobooth</h2>
            <p className={styles.sectionSubtitle}>4 lần chụp ảnh cùng nhau tại photobooth - kỷ niệm đáng nhớ nìeee</p>
          </div>
          <div className={styles.memoriesGallery}>
            {GALLERY.map((item, i) => (
              <GalleryItem
                key={i}
                item={item}
                delay={i}
                onClick={() => setLightboxImage(item.image)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Future Section */}
      <section className={styles.futureSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hành Trình Phía Trước</h2>
            <p className={styles.sectionSubtitle}>100 ngày chỉ là khởi đầu, còn nhiều điều tuyệt vời đang chờ đợi</p>
          </div>
          <div className={styles.futureContent}>
            <div className={styles.futureText}>
              <h3>Những Ước Mơ Chung</h3>
              <div className={styles.dreamList}>
                {DREAMS.map((dream, i) => (
                  <div key={i} className={styles.dreamItem}>
                    <i className={dream.icon} />
                    <div className={styles.dreamContent}>
                      <h4>{dream.title}</h4>
                      <p>{dream.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.futureImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/data/images/Cổ tích quó.jpg" alt="Tương lai bên nhau" />
              <div className={styles.futureQuote}>
                <p>&ldquo;Tương lai nào cũng đẹp, miễn là có em bên cạnh anh&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className={styles.messageSection}>
        <div className={styles.container}>
          <div className={styles.messageCard}>
            <div className={styles.messageHeader}>
              <h2>Thư Tình 100 Ngày</h2>
              <div className={styles.messageDate}>Từ trái tim Bằng gửi đến công chúa Duyên yêu của anh</div>
              <br /><br />
              <div className={styles.messageGif}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/data/gif/gif01-v2.gif" alt="Love GIF" className={styles.loveGif} />
              </div>
            </div>
            <div className={styles.messageBody}>
              <p>Em yêuu ơiiii,</p>
              <p>100 ngày... Nghe có vẻ ít hè? Nhưng mà với anh, 100 ngày này dài hơn cả 100 năm trước khi gặp em. Tại vì trước giờ anh chỉ sống, chứ chưa thật sự &quot;SỐNG&quot; :))) Mãi đến khi có em, anh mới biết thế nào là thức dậy mỗi sáng với nụ cười, là đi ngủ mỗi đêm với trái tim ấm áp.</p>
              <p>100 ngày qua, anh học được nhiều thứ. Học được rằng yêu e đơn giản đến lạ thường, mọi thứ e làm điều có thể khiến a iuuu e. Học được rằng tình yêu không chỉ là những lời ngọt ngào, mà còn là việc nhớ em cần nghỉ ngơi đúng giờ, nhắc em ăn uống đầy đủ, và sẵn sàng nghe em kể về con tóa lần thứ 101 :)))</p>
              <p>Anh không phải là Xuân Diệu hay Huy Cận rì đâu, nma khi yêu em, anh cảm thấy mình có thể viết ra cả thiên tình sử.</p>
              <p>Em biết không, trước khi gặp em, anh toàn nghe nhạc thiền, rap, rock chi đó. Chừ thì... playlist của anh toàn ballad ngọt ngào, nhạc lãng mạn, nhạc tìn iuuuu. Bạn anh còn hỏi &quot;găng thằng ni đổi gu âm nhạc hè?&quot; Anh chỉ cười thôi, vì biết nói sao cho ngừi khác hiểu được rằng em đã làm thay đổi cả thế giới quan của anh :))</p>
              <p>100 ngày, anh đã chụp được 1247+++ tấm ảnh em, viết được 73+ bài thơ tình, và nói &quot;iuuu em&quot; 2.303 lần (con số này anh tự ước lượng thôi he). Nhưng quan trọng nhất là anh đã yêu em bằng cả trái tim chân thành nhất. Hằng ngày!</p>
              <p><em>&quot;Em là nắng mai soi qua song cửa&quot;</em> - Đúng vậy đó em. Mỗi sáng thức dậy nhìn thấy tin nhắn của em, anh cảm giác như cả thế giới đang tươi sáng. Đôi khi anh tự hỏi không biết em có phải là thiên thần không, vì sao em lại tốt với anh thế?</p>
              <p>Anh hứa với em, 100 ngày tới, và tới tới, anh sẽ yêu em nhiều hơn nữa. Sẽ chăm sóc em tốt hơn, hiểu em nhiều hơn, và có liẽ sẽ viết thơ hay hơn một chút :))) Anh muốn được nắm tay em đi qua tất cả những mùa xuân hạ thu đông, muốn được già đi bên em, muốn được thấy em mặc áo cưới và nói &quot;yes&quot; với anh.</p>
              <p><em>&quot;Yêu em nhiều như sao đếm không hết&quot;</em> - Em oiii, anh có thử đếm sao một đêm đó, đếm được có tí rồi ngủ gật :))) nhiều quó chài. Nhưng mà anh nghĩ tình yêu anh dành cho em còn nhiều hơn cả số sao trên trời.</p>
              <p>Công chúa nhỏ của anh ơi, cảm ơn em vì đã đến với cuộc đời anh. Cảm ơn em vì đã biến anh từ một thằng trai bình thường thành một người đàn ông biết yêu thương. Cảm ơn em vì đã cho anh biết thế nào là hạnh phúc thật sự.</p>
              <p>100 ngày đã qua, nhưng đây chỉ là 0.354% trong cuộc hành trình dài của đôi ta thôi. Còn 99.646% kia đang chờ chúng mình khám phá (heheheh a tính tới 100 tủi cho tròn, tức là 100/28225 ngày). Anh hứa sẽ làm cho 99.646% đó đẹp hơn, ngọt ngào hơn, và chắc chắn sẽ có nhiều khoảnh khắc đẹp hơn nữa :)))</p>
              <p>Yêu em vô điều kiện, vô lý do, và vô hạnnnnn :)))</p>
              <div className={styles.messageSignature}>
                <p>Người yêu em nhất trên đời<br />❤️ Bằng yêu của em ❤️</p>
                <div className={styles.signatureImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/data/images/hehe.jpg" alt="Chữ ký tình yêu" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.celebrationFooter}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerMessage}>
              <h3>100 ngày chỉ là khởi đầu...</h3>
              <p>Hành trình tình yêu của chúng mình vẫn còn dài và đẹp phía trước</p>
            </div>
            <div className={styles.footerNav}>
              <Link href="/memories" className={styles.footerBtn}>
                <i className="fas fa-heart" />
                <span>Xem thêm kỷ niệm</span>
              </Link>
              <Link href="/gallery" className={styles.footerBtn}>
                <i className="fas fa-images" />
                <span>Thư viện ảnh</span>
              </Link>
              <Link href="/timeline" className={styles.footerBtn}>
                <i className="fas fa-clock" />
                <span>Đếm ngày yêu</span>
              </Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 - Tình yêu vĩnh cửu của Bằng &amp; Duyên</p>
          </div>
        </div>
      </footer>

      {/* Heart Rain Button */}
      <button className={styles.heartRainBtn} onClick={createHeartRain}>
        💖 Mưa chái tym
      </button>

      {/* Lightbox */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={() => setLightboxImage(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxImage} alt="Full size" />
        </div>
      )}
    </div>
  );
}
