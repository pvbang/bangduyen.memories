'use client';

/**
 * Starmap Page - Bản đồ sao
 * Hiển thị chòm sao, thông tin cung hoàng đạo, phân tích tương thích
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './starmap.module.css';

// ==========================================
// TYPES
// ==========================================

interface QuoteData {
  text: string;
  author: string;
}

interface CompatibilityAspect {
  icon: string;
  title: string;
  score: string;
  description: string;
  details?: { icon: string; text: string }[];
}

// ==========================================
// CONSTANTS
// ==========================================

const QUOTES: QuoteData[] = [
  {
    text: '"iuuu em cao hơn cả núi dài hơn cả sông, rộng hơn cả đất xanh hơn cả trời, bay ra vũ trụ giãn nở cùng vũ trụ vô hạnnnnn"',
    author: '- Bằng',
  },
  {
    text: '"Nếu anh có thể cho em một khả năng đặc biệt trong cuộc đời này, anh sẽ cho em khả năng nhìn thấy chính mình qua đôi mắt của anh. Sau đó em sẽ nhận ra, em thật đặc biệt thế nào đối với anh."',
    author: '- Bằng',
  },
  {
    text: '"a vô tình bước vô cuộc đời e nma a cố tình ở lại đó chớ :)))"',
    author: '- Bằng',
  },
];

const COMPATIBILITY_ASPECTS: CompatibilityAspect[] = [
  {
    icon: 'fas fa-heart',
    title: 'Tình yêu & Lãng mạn',
    score: '95%',
    description:
      'Bọ Cạp (Bằng) và Thiên Bình (Duyên) tạo thành một cặp đôi cực kỳ hấp dẫn và bổ sung cho nhau. Bọ Cạp mang đến sự sâu sắc, đam mê và tình yêu mãnh liệt, trong khi Thiên Bình đem lại sự cân bằng, thanh lịch và hài hòa.',
    details: [
      { icon: 'fas fa-fire', text: 'Đam mê: Bọ Cạp sẽ khơi dậy ngọn lửa tình yêu trong Thiên Bình' },
      { icon: 'fas fa-balance-scale', text: 'Cân bằng: Thiên Bình giúp Bọ Cạp kiểm soát cảm xúc mạnh mẽ' },
    ],
  },
  {
    icon: 'fas fa-comments',
    title: 'Giao tiếp & Hiểu biết',
    score: '88%',
    description:
      'Thiên Bình có khả năng giao tiếp tuyệt vời và kỹ năng ngoại giao bẩm sinh, giúp Bọ Cạp bộc lộ những cảm xúc sâu kín mà họ thường giấu kín.',
    details: [
      { icon: 'fas fa-ear-listen', text: 'Lắng nghe: Thiên Bình biết cách lắng nghe và thấu hiểu' },
      { icon: 'fas fa-lock-open', text: 'Mở lòng: Bọ Cạp sẽ từ từ mở lòng với Thiên Bình' },
    ],
  },
  {
    icon: 'fas fa-handshake',
    title: 'Tin tưởng & Trung thành',
    score: '92%',
    description:
      'Cả hai cung đều coi trọng sự trung thành và cam kết trong tình yêu. Bọ Cạp có bản năng bảo vệ mạnh mẽ và sẽ che chở cho Thiên Bình một cách tuyệt đối.',
    details: [
      { icon: 'fas fa-shield-alt', text: 'Bảo vệ: Bọ Cạp sẽ là lá chắn vững chắc cho Thiên Bình' },
      { icon: 'fas fa-heart-circle-check', text: 'Trung thành: Thiên Bình sẽ chung thủy và tận tụy' },
    ],
  },
  {
    icon: 'fas fa-home',
    title: 'Gia đình & Tương lai',
    score: '94%',
    description:
      'Thiên Bình có khả năng tạo nên một tổ ấm hài hòa, ấm cúng với gu thẩm mỹ tuyệt vời, trong khi Bọ Cạp đảm bảo sự ổn định tài chính và bảo vệ gia đình.',
    details: [
      { icon: 'fas fa-palette', text: 'Thẩm mỹ: Thiên Bình tạo không gian sống đẹp đẽ' },
      { icon: 'fas fa-piggy-bank', text: 'Ổn định: Bọ Cạp đảm bảo an ninh tài chính' },
    ],
  },
  {
    icon: 'fas fa-brain',
    title: 'Trí tuệ & Sáng tạo',
    score: '87%',
    description:
      'Bọ Cạp có trí tuệ sâu sắc và khả năng phân tích tuyệt vời, trong khi Thiên Bình có tư duy cân bằng và óc thẩm mỹ cao.',
  },
  {
    icon: 'fas fa-seedling',
    title: 'Phát triển cá nhân',
    score: '90%',
    description:
      'Mối quan hệ này giúp cả hai phát triển: Bọ Cạp học cách kiềm chế và thanh lịch hơn, Thiên Bình trở nên quyết đoán và mạnh mẽ hơn.',
  },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

/** Background stars & hearts */
function StarmapBackground() {
  const bgStars = [
    { top: '10%', left: '15%', className: '' },
    { top: '20%', left: '80%', className: styles.bgStarBright },
    { top: '30%', left: '25%', className: styles.bgStarDim },
    { top: '40%', left: '70%', className: '' },
    { top: '50%', left: '10%', className: styles.bgStarBright },
    { top: '60%', left: '85%', className: '' },
    { top: '70%', left: '30%', className: styles.bgStarDim },
    { top: '80%', left: '65%', className: '' },
    { top: '90%', left: '20%', className: styles.bgStarBright },
    { top: '15%', left: '50%', className: '' },
  ];

  return (
    <div className={styles.backgroundAnimation}>
      <div className={styles.floatingHearts}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={`heart-${i}`} className={styles.floatingHeart}>💕</div>
        ))}
      </div>
      <div className={styles.starsBackground}>
        {bgStars.map((star, i) => (
          <div
            key={`bgstar-${i}`}
            className={`${styles.bgStar} ${star.className}`}
            style={{ top: star.top, left: star.left }}
          />
        ))}
      </div>
    </div>
  );
}

/** Scorpio Constellation SVG */
function ScorpioConstellation() {
  const stars = [
    { top: '15%', left: '20%', title: 'β Scorpii (Graffias)' },
    { top: '22%', left: '18%', title: 'δ Scorpii (Dschubba)' },
    { top: '28%', left: '16%', title: 'π Scorpii' },
    { top: '35%', left: '14%', title: 'ρ Scorpii' },
    { top: '52%', left: '28%', title: 'τ Scorpii' },
    { top: '58%', left: '32%', title: 'σ Scorpii (Alniyat)' },
    { top: '64%', left: '36%', title: 'ε Scorpii (Wei)' },
    { top: '68%', left: '42%', title: 'μ₁ Scorpii (Xamidimura)' },
    { top: '70%', left: '48%', title: 'ζ₁ Scorpii' },
    { top: '65%', left: '54%', title: 'η Scorpii' },
    { top: '58%', left: '58%', title: 'θ Scorpii (Sargas)' },
    { top: '50%', left: '60%', title: 'ι₁ Scorpii' },
    { top: '42%', left: '62%', title: 'κ Scorpii' },
    { top: '28%', left: '66%', title: 'υ Scorpii (Lesath)' },
  ];

  return (
    <div className={styles.constellation}>
      <div className={`${styles.constellationName} ${styles.scorpioName}`}>
        Bọ Cạp ♏
      </div>
      <div className={styles.starsContainer}>
        {/* Regular stars */}
        {stars.map((star, i) => (
          <span
            key={`scorpio-star-${i}`}
            className={styles.constellationStar}
            style={{ top: star.top, left: star.left }}
            title={star.title}
          >
            ✦
          </span>
        ))}
        {/* Antares - Major star */}
        <span
          className={`${styles.constellationStar} ${styles.majorStar} ${styles.scorpioMajorStar}`}
          style={{ top: '45%', left: '25%' }}
          title="α Scorpii (Antares) - Trái tim Bọ Cạp"
        >
          ★
        </span>
        {/* Shaula - Bright star */}
        <span
          className={`${styles.constellationStar} ${styles.bgStarBright}`}
          style={{ top: '34%', left: '64%' }}
          title="λ Scorpii (Shaula)"
        >
          ✦
        </span>

        {/* Constellation lines SVG */}
        <svg className={styles.constellationLines} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="scorpioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff6b9d', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#c471ed', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M20,15 L18,22 L16,28 L14,35" stroke="url(#scorpioGradient)" strokeWidth="2" fill="none" opacity="0.8" filter="url(#glow)" />
          <path d="M18,22 L12,18" stroke="url(#scorpioGradient)" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#glow)" />
          <path d="M18,22 L12,26" stroke="url(#scorpioGradient)" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#glow)" />
          <path d="M14,35 L25,45" stroke="url(#scorpioGradient)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
          <path d="M25,45 L28,52 L32,58 L36,64 L42,68 L48,70" stroke="url(#scorpioGradient)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
          <path d="M48,70 L54,65 L58,58 L60,50 L62,42 L64,34 L66,28" stroke="url(#scorpioGradient)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
        </svg>
      </div>

      <div className={styles.constellationInfo}>
        <p><strong>Ngôi sao chủ:</strong> Antares (Trái tim Bọ Cạp)</p>
        <p><strong>Đặc điểm:</strong> Đam mê, bí ẩn, trung thành, sâu sắc</p>
        <p><strong>Nguyên tố:</strong> Nước 💧</p>
      </div>
    </div>
  );
}

/** Libra Constellation SVG */
function LibraConstellation() {
  const stars = [
    { top: '30%', right: '50%', title: 'σ Librae (Brachium)' },
    { top: '25%', right: '60%', title: 'τ Librae' },
    { top: '55%', right: '45%', title: 'γ Librae (Zubenelakrab)' },
    { top: '50%', right: '20%', title: 'δ Librae' },
    { top: '28%', right: '30%', title: 'ι Librae' },
  ];

  return (
    <div className={styles.constellation}>
      <div className={`${styles.constellationName} ${styles.libraName}`}>
        Thiên Bình ♎
      </div>
      <div className={styles.starsContainer}>
        {/* Regular stars */}
        {stars.map((star, i) => (
          <span
            key={`libra-star-${i}`}
            className={styles.constellationStar}
            style={{ top: star.top, right: star.right }}
            title={star.title}
          >
            ✦
          </span>
        ))}
        {/* Zubenelgenubi - Major star */}
        <span
          className={`${styles.constellationStar} ${styles.majorStar} ${styles.libraMajorStar}`}
          style={{ top: '45%', right: '55%' }}
          title="α² Librae (Zubenelgenubi)"
        >
          ★
        </span>
        {/* Zubeneschamali - Major star */}
        <span
          className={`${styles.constellationStar} ${styles.majorStar} ${styles.libraMajorStar}`}
          style={{ top: '35%', right: '25%' }}
          title="β Librae (Zubeneschamali)"
        >
          ★
        </span>

        {/* Constellation lines SVG */}
        <svg className={styles.constellationLines} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="libraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M50,30 L45,45 L40,25" stroke="url(#libraGradient)" strokeWidth="2" fill="none" opacity="0.8" filter="url(#glow)" />
          <path d="M45,45 L55,55" stroke="url(#libraGradient)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
          <path d="M75,35 L80,50 L70,28" stroke="url(#libraGradient)" strokeWidth="2" fill="none" opacity="0.8" filter="url(#glow)" />
          <path d="M45,45 L75,35" stroke="url(#libraGradient)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
        </svg>
      </div>

      <div className={styles.constellationInfo}>
        <p><strong>Ngôi sao chủ:</strong> Zubeneschamali &amp; Zubenelgenubi</p>
        <p><strong>Đặc điểm:</strong> Cân bằng, hài hòa, công bằng, thanh lịch</p>
        <p><strong>Nguyên tố:</strong> Khí 💨</p>
      </div>
    </div>
  );
}

/** Constellation Map Section */
function ConstellationMap() {
  return (
    <div className={styles.constellationMapSection}>
      <h2 className={styles.sectionTitle}>
        ⭐ Bản đồ chòm sao của cả hai
      </h2>
      <div className={styles.constellationContainer}>
        <div className={styles.constellationCanvas}>
          <ScorpioConstellation />

          {/* Cosmic Connection */}
          <div className={styles.cosmicConnection}>
            <div className={styles.connectionHeart}>
              <span className={styles.pulsingHeart}>💕</span>
            </div>
            <div className={styles.connectionText}>iuuu emmm</div>
            <div className={styles.cosmicLine} />
            <div className={styles.connectionText}>Tình yêu vượt thời gian</div>
          </div>

          <LibraConstellation />
        </div>
      </div>
    </div>
  );
}

/** Couple Info Section */
function CoupleInfo() {
  return (
    <div className={styles.coupleInfoSection}>
      {/* Boy Card */}
      <div className={`${styles.personCard} ${styles.boyCard}`}>
        <div className={styles.personAvatar}>
          <i className="fas fa-mars" />
        </div>
        <div>
          <h3 className={styles.personName}>Phan Văn Bằng</h3>
          <div className={styles.birthdayInfo}>
            <p><i className="fas fa-calendar-alt" /> 28/10/2002 (Dương lịch)</p>
            <p><i className="fas fa-moon" /> 23/09/2002 (Âm lịch)</p>
          </div>
          <div className={styles.zodiacInfo}>
            <div className={`${styles.zodiacSign} ${styles.zodiacScorpio}`}>
              <i className="fas fa-spider" />
              <span>Bọ Cạp</span>
            </div>
            <div className={styles.zodiacElement}>Nguyên tố: Nước</div>
          </div>
        </div>
      </div>

      {/* Love Connection */}
      <div className={styles.loveConnection}>
        <div className={styles.connectionLine} />
        <div className={styles.loveHeart}>
          <i className="fas fa-heart" />
        </div>
        <div className={styles.compatibilityScore}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNumber}>89%</span>
            <span className={styles.scoreLabel}>Hợp cung</span>
          </div>
        </div>
      </div>

      {/* Girl Card */}
      <div className={`${styles.personCard} ${styles.girlCard}`}>
        <div className={styles.personAvatar}>
          <i className="fas fa-venus" />
        </div>
        <div>
          <h3 className={styles.personName}>Nguyễn Thị Mỹ Duyên</h3>
          <div className={styles.birthdayInfo}>
            <p><i className="fas fa-calendar-alt" /> 08/10/2003</p>
          </div>
          <div className={styles.zodiacInfo}>
            <div className={`${styles.zodiacSign} ${styles.zodiacLibra}`}>
              <i className="fas fa-balance-scale" />
              <span>Thiên Bình</span>
            </div>
            <div className={styles.zodiacElement}>Nguyên tố: Khí</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compatibility Analysis Section */
function CompatibilityAnalysis() {
  return (
    <div className={styles.compatibilityAnalysis}>
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>
          <i className="fas fa-heart" /> Phân tích tương thích chi tiết
        </h3>
        <div className={styles.compatibilityDetails}>
          {COMPATIBILITY_ASPECTS.map((aspect, index) => (
            <div key={`aspect-${index}`} className={styles.compatibilityAspect}>
              <div className={styles.aspectHeader}>
                <i className={`${aspect.icon} ${styles.aspectIcon}`} />
                <h4 className={styles.aspectTitle}>{aspect.title}</h4>
                <span className={styles.aspectScore}>{aspect.score}</span>
              </div>
              <p className={styles.aspectDescription}>{aspect.description}</p>
              {aspect.details && (
                <div className={styles.aspectDetails}>
                  {aspect.details.map((detail, dIndex) => (
                    <div key={`detail-${dIndex}`} className={styles.detailItem}>
                      <i className={`${detail.icon} ${styles.detailIcon}`} />
                      <span className={styles.detailText}>{detail.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Planetary Analysis */}
      <div className={styles.planetaryAnalysis}>
        <h3 className={styles.planetaryTitle}>
          <i className="fas fa-globe" /> Ảnh hưởng của các hành tinh
        </h3>
        <div className={styles.planetsGrid}>
          <div className={styles.planetCard}>
            <span className={styles.planetIcon}>♂</span>
            <h4>Sao Hỏa (Bọ Cạp)</h4>
            <p>
              Mang đến năng lượng, đam mê và sự quyết đoán. Ảnh hưởng tích cực
              đến khả năng bảo vệ và yêu thương của Bằng.
            </p>
          </div>
          <div className={styles.planetCard}>
            <span className={styles.planetIcon}>♀</span>
            <h4>Sao Kim (Thiên Bình)</h4>
            <p>
              Tượng trưng cho tình yêu, vẻ đẹp và hài hòa. Giúp Duyên có khả năng
              tạo ra sự cân bằng và lãng mạn trong mối quan hệ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Relationship Timeline Section */
function RelationshipTimeline() {
  const timelineItems = [
    { date: '08/02/2025', title: 'Lần gặp đầu tiên', desc: 'Ngày định mệnh khi hai trái tim tìm thấy nhau' },
    { date: '09/02/2025', title: 'Tin nhắn đầu tiên', desc: 'Bước đầu tiên của cuộc trò chuyện không bao giờ kết thúc' },
    { date: '23/03/2025', title: 'Chính thức thành người yêu', desc: 'Ngày mà hai trái tim quyết định đồng hành cùng nhau' },
  ];

  return (
    <div className={styles.relationshipTimeline}>
      <h3 className={styles.timelineTitle}>
        <i className="fas fa-timeline" /> Dòng thời gian tình yêu
      </h3>
      <div className={styles.timeline}>
        {timelineItems.map((item, index) => (
          <div key={`tl-${index}`} className={styles.timelineItem}>
            <div className={styles.timelineDate}>{item.date}</div>
            <div className={styles.timelineContent}>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
        {/* Future item */}
        <div className={`${styles.timelineItem} ${styles.timelineItemFuture}`}>
          <div className={styles.timelineDate}>∞</div>
          <div className={styles.timelineContent}>
            <h4>Mãi mãi bên nhau</h4>
            <p>Tình yêu vô hạn như vũ trụ giãn nở</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Location Section */
function LocationSection() {
  const locations = [
    {
      icon: '🌾',
      title: 'Quê hương - Bằng',
      address: 'Xóm 7, Định Cư, Phú An, Phú Vang, Thừa Thiên Huế',
      desc: 'Vùng đất gắn liền với tuổi thơ và gia đình',
    },
    {
      icon: '🏡',
      title: 'Quê hương - Duyên',
      address: 'Khối phố Thanh Quýt 1, phường Điện Thắng Trung, thị xã Điện Bàn, Quảng Nam',
      desc: '',
    },
    {
      icon: '🏠',
      title: 'Nơi ở hiện tại - Bằng',
      address: '33 Nguyễn Tạo, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng',
      desc: 'Nơi anh đang sống',
    },
  ];

  return (
    <div className={styles.locationSection}>
      <h3 className={styles.locationTitle}>
        <i className="fas fa-map-marker-alt" /> Nơi tình yêu bắt đầu
      </h3>
      <div className={styles.locationInfo}>
        {locations.map((loc, index) => (
          <div key={`loc-${index}`} className={styles.locationCard}>
            <span className={styles.locationIcon}>{loc.icon}</span>
            <h4>{loc.title}</h4>
            <p><i className="fas fa-map-marker-alt" /> {loc.address}</p>
            {loc.desc && <p>{loc.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Love Quotes Carousel */
function LoveQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const changeQuote = useCallback((direction: number) => {
    setCurrentQuote((prev) => {
      let next = prev + direction;
      if (next >= QUOTES.length) next = 0;
      if (next < 0) next = QUOTES.length - 1;
      return next;
    });
  }, []);

  // Auto-rotate
  useEffect(() => {
    intervalRef.current = setInterval(() => changeQuote(1), 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [changeQuote]);

  return (
    <div className={styles.loveQuotesSection}>
      <h3 className={styles.quotesTitle}>
        <i className="fas fa-quote-left" /> Những lời yêu thương
      </h3>
      <div className={styles.quotesCarousel}>
        {QUOTES.map((quote, index) => (
          <div
            key={`quote-${index}`}
            className={`${styles.quoteCard} ${
              index === currentQuote ? styles.quoteCardActive : ''
            }`}
          >
            <p className={styles.quoteText}>{quote.text}</p>
            <span className={styles.quoteAuthor}>{quote.author}</span>
          </div>
        ))}
      </div>
      <div className={styles.carouselControls}>
        <button
          className={styles.carouselBtn}
          onClick={() => changeQuote(-1)}
          aria-label="Previous quote"
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button
          className={styles.carouselBtn}
          onClick={() => changeQuote(1)}
          aria-label="Next quote"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function StarmapPage() {
  return (
    <div className={styles.starmapPage}>
      <StarmapBackground />

      {/* Header */}
      <header className={styles.starmapHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <span className={`${styles.pageTitleIcon} ${styles.pageTitleStar}`}>
              <i className="fas fa-star" />
            </span>
            Bản đồ sao của chúng mình
            <span className={`${styles.pageTitleIcon} ${styles.pageTitleHeart}`}>
              <i className="fas fa-heart" />
            </span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.starmapContainer}>
        <ConstellationMap />
        <CoupleInfo />
        <CompatibilityAnalysis />
        <RelationshipTimeline />
        <LocationSection />
        <LoveQuotes />
      </div>
    </div>
  );
}
