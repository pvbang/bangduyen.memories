'use client';

/**
 * 300 Days Celebration Page
 * Route: /300days
 * Chuyển đổi từ 300days.html + 300days.css + 300days.js
 * Note: Three.js galaxy gallery được simplified thành grid gallery
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './300days.module.css';

// ==========================================
// DATA
// ==========================================

const STATS = [
  { icon: 'fas fa-heart', target: 300, label: 'Ngày bên nhau' },
  { icon: 'fas fa-clock', target: 7200, label: 'Giờ hạnh phúc' },
  { icon: 'fas fa-star', target: 432000, label: 'Phút nhớ em' },
  { icon: 'fas fa-infinity', target: 0, label: 'Tình iuuuu', isInfinity: true },
];

const TIMELINE_ITEMS = [
  {
    date: 'Ngày 1 - 23/03/2025', title: 'Ngày Tỏ Tình 💕', icon: 'fas fa-heart',
    texts: [
      '"Khoảnh khắc anh lấy hết can đảm để nói \'iuuuu em\', cũng là lúc anh biết mình đã tìm thấy kho báu của cuộc đời!"',
      'Ngày định mệnh đóaaa! Tim đập, chân run, nhưng ánh mắt em làm anh vững tin lạ thường. Từ nay, thế giới của anh chính thức có thêm một mặt trời nhỏ mang tên Emmmmm!',
    ],
  },
  {
    date: 'Ngày 100 - Tháng 7/2025', title: '100 Ngày Hạnh Phúc 👑', icon: 'fas fa-crown',
    texts: [
      '"100 ngày trôi qua nhanh như một cái chớp mắt, vì ở bên em, thời gian dường như cũng muốn chạy đua để được hạnh phúccc."',
      'Tròn trăm ngày mình chung lối! 100 ngày "tập sự" làm người yêu, anh đã tốt nghiệp xuất sắc khóa "chiều chuộng công chúaa" chưa nhỉ? Chắc là rồi hee :))',
    ],
  },
  {
    date: 'Ngày 200 - Tháng 10/2025', title: 'Những Kỷ Niệm Đẹp 📸', icon: 'fas fa-camera',
    texts: [
      '"Mỗi kỷ niệm bên em đều là những thước phim đẹp nhất mà anh muốn tua đi tua lại mỗi ngày."',
      '200 ngày, album ảnh của mình đã đầy ắp nụ cười. Đi đâu cũng được, ăn gì cũng ngon, miễn là có em đi cùng. Hành trình này cứ thế mà dài vô tận nhié!',
    ],
  },
  {
    date: 'Ngày 300 - 17/01/2026', title: '300 Ngày Yêu Thưnnnn 🥰🥰', icon: 'fas fa-gem',
    texts: [
      '"300 ngày - con số tròn trĩnh, nhưng tình yêu anh dành cho em thì không có điểm dừng, nó cứ lớn lớn lớn mãi thôi!"',
      'Chào mốc 300! Cảm ơn em đã chịu đựng sự "nhây" của anh, cảm ơn em đã luôn ngọt ngào. 300 ngày chỉ là khởi động, mình cùng nắm tay nhau chạy tiếp marathon tình yêu nhé công chúaa! 💕',
    ],
    featured: true,
  },
];

const QUOTES = [
  { icon: 'fas fa-heart', text: '"Em là nắng, anh là mây, \nBên nhau quấn quýt, đắm say cả đời. \nEm cười tan hết mây trời, \nAnh cười vì thấy nụ cười của iem! :)))"', author: '- Chàng Mây của em' },
  { icon: 'fas fa-infinity', text: '"Sao trời có vạn ngàn ngôi,\nCũng không sánh được đôi môi em cười.\nBiển xanh sóng vỗ dạt dào,\nKhông bằng tình cảm tuôn tràooo choa emm :))))))"', author: '- Nhà thơ bất đắc dĩ :>' },
  { icon: 'fas fa-crown', text: '"Cảm ơn trời đất bao la,\nCho anh gặp được món quà là em.\nMỗi ngày mở mắt ra xem,\nThấy hình em đó, êm đềm cả tim!"', author: '- Fan cứng của em' },
  { icon: 'fas fa-star', text: '"Nếu anh là biển mang tình yêu dào dạt,\nEm là bờ cát đón sóng vỗ bình yên.\nNguyện một đời xóa hết mọi ưu phiền,\nĐể em mãi hồn nhiên như anh thấy!"', author: '- Đại dương tình iuuuu' },
  { icon: 'fas fa-home', text: '"Yêu không chỉ nói đầu môi,\nMà là bên cạnh đứng ngồi có nhau.\nDù cho vật đổi sao dời,\nAnh đây vẫn nguyện trọn đời iuuu emm! ❤️"', author: '- Chân lý cuộc đời' },
  { icon: 'fas fa-gem', text: '"Ba trăm ngày mộng chung đôi,\nYêu em thêm nữa, trọn đời chẳng vơi.\nHứa rằng mai mốt em ơi,\nTình ta vẫn đẹp rạng ngời như nay!"', author: '- Lời hứa 300' },
];

const POEMS = [
  { icon: 'fas fa-heart', title: 'Khúc Ca 300 Ngày', date: '17/01/2026', lines: ['Ba trăm ngày mộng giấc mơ,', 'Gặp em anh hóa kẻ khờ làm thơ.', 'Nắng vàng rực rỡ đợi chờ,', 'Tình ta đẹp tựa bài thơ trữ tìnhh.', '', 'Cảm ơn duyên phận chúng mình,', 'Cho anh tìm thấy bóng hình người thương.', 'Dù cho vạn nẻo dặm trường,', 'Vẫn xin nguyện mãi vấn vương bên nàng!'] },
  { icon: 'fas fa-crown', title: 'Công Chúa Của Riêng Anh', date: 'Dành tặng Duyên iuuuu của anh', lines: ['Em là công chúa kiêu sa,', 'Anh là kỵ sĩ canh nhà choa em.', 'Mặc cho thế giới đi kềm,', 'Anh đây chỉ muốn êm đềm bên nương.', '', 'Tóc mây vương vấn mùi hương,', 'Mắt nai ngơ ngác làm anh lạc đường.', 'Đời này chỉ có một phương,', 'Là phương em đó, người thương anh à!'] },
  { icon: 'fas fa-star', title: 'Cùng Nhau Đi Tới', date: 'Lời hứa', lines: ['Mai này dù nắng hay mưa,', 'Thì anh vẫn đón vẫn đưa em về.', 'Trọn đời giữ vẹn câu thề,', 'Yêu em chẳng ngại, chẳng nề gian lao.', '', 'Dù cho sóng gió ba đào,', 'Nắm tay anh nhé, bước vào tương lai.', 'Đường đời còn rộng còn dài,', 'Có em bên cạnh, chông gai hóa hồng!'] },
  { icon: 'fas fa-moon', title: 'Đêm Tương Tư', date: 'Những đêm nhớ iem', lines: ['Đêm nằm ngắm ánh sao trời,', 'Nhâm nhi nỗi nhớ đầy vơi trong lòng.', 'Hỏi trăng có thấu hay không?', 'Rằng anh nhớ bé càng trông càng sầu.', '', 'Ước gì có phép nhiệm màu,', 'Biến ngay trước mặt để âu yếm nàng.', 'Gửi vào gió, gửi mơ màng,', 'Ngủ ngoan em nhé, thiên đàng của anh!'] },
];

const PROSE_STORIES = [
  { icon: 'fas fa-sparkles', title: 'Định Mệnh Của Chàng Ngố', paragraphs: [
    'Ngày xửa ngày xưa, có ông tướng "ngáo ngơ" cứ đi lang thang tìm kiếm mảnh ghép của đời mình. Đùng một cái, sét đánh ngang tai (bùm!!!), ông gặp trúng cô nàng công chúa siêu cấp đáng yêu. Thế là xong, dính thính ngay lập tức không lối thoát!',
    'Cô ấy cười một cái là mùa đông cũng hóa mùa hè, nhăn mặt một cái là ông tướng kia sợ "xanh mặt". Nhưng mà... nghiện rồi, không cai được đâu! Éc ô éc :> Với ổng, cổ là duy nhất, là "nóc nhà" vĩ đại.',
    'Câu chuyện tình này hổng có drama, chỉ có hài kịch lãng mạn thôi. Cùng nhau ăn, cùng nhau chơi, cùng nhau béo lên. 300 ngày rồi mà nhìn nhau mắt vẫn sáng như đèn pha ô tô zị đóa!',
  ], ending: 'Diễn viên chính: Bằng & Duyên (Oscar cho cặp đôi vàng trong làng phát cẩu lương)! 💕' },
  { icon: 'fas fa-sun', title: 'Sáng Thức Dậy Thấy Nhớ', paragraphs: [
    'Hé mắt ra là cái tên em hiện lên trong đầu như popup quảng cáo (nhưng mà anh không muốn tắt!). Anh tự hỏi: "Giờ này công chúa của tui đã bình minh chưa hay còn trùm chăn làm sâu ngủ?".',
    'Anh cứ mơ mãi về cái ngày "về chung một nhà". Sáng sớm anh sẽ lôi em dậy bằng nụ hôn (hoặc mùi đồ ăn thơm phức, cái nào hiệu quả hơn nhỉ?). Em dụi mắt, anh pha cafe, khung cảnh nó cứ gọi là "chill" phết!',
    'Mà thôi, giờ chưa về chung thì anh gửi "tín hiệu vũ trụ" này đến em: Dậy đi bé ơi, mặt trời chiếu đến mông rồi! Nhớ em quaaaa điii!',
  ], ending: 'Chào buổi sáng, "cục nợ" đáng yêu của tuii! ☀️' },
  { icon: 'fas fa-house-heart', title: 'Ngôi Nhà Hạnh Phúc', paragraphs: [
    'Anh đã lên bản thiết kế cho tương lai hai đứa mình: Một căn nhà "full option" tình thương mến thương. Có vườn rau em trồng (hoặc anh trồng nếu em lười), có căn bếp anh nấu.',
    'Cuối tuần mình xách xe đi lượn, tối về cùng xem phim, ăn bắp rang bơ. Lâu lâu cãi nhau chí chóe tí choa zui nhà vui cửa rồi lại ôm nhau làm hòa. Cuộc sống đơn giản mà chất lượng cao!',
    'Sau này già thành hai cụ già lụ khụ, anh vẫn sẽ vừa đấm lưng cho em vừa thủ thỉ: "Bà ơi, tui thương bà nhất trần đời!". Nghe sến không? Nhưng mà thật đó!',
  ], ending: 'Chốt kèo tương lai này nha em iuu! 🏠💕' },
];

const SECRETS = [
  { num: '01', title: 'Anh Thích Nhất...', text: '... là điệu cười "trừ lương" của em. Nói chứ cười lên xinh xỉu, anh nguyện làm khán giả trung thành ngắm em cười 24/7 luôn!', icon: 'fas fa-smile' },
  { num: '02', title: 'Anh Nhớ Em Khi...', text: '... trời mưa, anh lại hóa "chàng thơ" nhớ em. Tiếng mưa rơi lộp độp y như tiếng lòng anh gào thét: "Nhớ Duyên quá trời ơi!".', icon: 'fas fa-cloud-rain' },
  { num: '03', title: 'Điều Anh Sợ Nhất...', text: '... là em giận anh rồi bơ anh luôn. Cảm giác như thế giới sụp đổ, wifi mất kết nối vậy đóa. Nên là có giận thì giận xíu thôi nha!', icon: 'fas fa-hand-holding-heart' },
  { num: '04', title: 'Anh Tự Hào Vì...', text: '... "flex" em với cả thế giới! Ai hỏi anh cũng vỗ ngực: "Người yêu tui đó, vợ tương lai tui đó, xịn chưa!". Tự hào level max!', icon: 'fas fa-crown' },
  { num: '05', title: 'Điều Anh Mong Muốn...', text: '... là được dính lấy em như keo 502! Xuân Hạ Thu Đông, mùa nào cũng được, miễn là có cái "gối ôm 37 độ" là em bên cạnh.', icon: 'fas fa-infinity' },
  { num: '06', title: 'Anh Chờ Đợi...', text: '... ngày được "rước nàng về dinh". Mỗi ngày tích cóp một chút nhớ thương, để dành đến ngày đó bùng nổ. Em là động lực để anh cày cuốc mỗi ngày!', icon: 'fas fa-hourglass-half' },
];

const PROMISES_DATA = [
  "Yêu em mỗi sáng, trưa, chiều, tối (và cả trong mơ)",
  "Là 'thùng rác' cảm xúc để em trút giận (free 100%)",
  "Nghe lời em răm rắp như lệnh vua ban",
  "Chăm sóc em kỹ hơn cả chăm... cây cảnh",
  "Làm bác sĩ riêng khi em hắt hơi sổ mũi",
  "Nắm tay em đi khắp thế gian (hoặc đi siêu thị cũng được)",
  "Làm cái gối ôm 37 độ C xịn xò nhất",
  "Hôn trán em mỗi sáng để đánh thức (thay đồng hồ báo thức)",
  "Nói 'yêu em' nhiều hơn số hạt cơm em ăn",
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

// ==========================================
// SUB-COMPONENTS
// ==========================================

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

function TimelineItem({ item }: { item: typeof TIMELINE_ITEMS[0] }) {
  const { ref, isVisible } = useScrollReveal(0.2);
  return (
    <div ref={ref} className={`${styles.timelineItem} ${isVisible ? styles.visible : ''} ${item.featured ? styles.timelineItemFeatured : ''}`}>
      <div className={styles.timelineMarker}><i className={item.icon} /></div>
      <div className={styles.timelineContent}>
        <div className={styles.timelineDate}>{item.date}</div>
        <h3 className={styles.timelineTitle}>{item.title}</h3>
        <div className={styles.timelineText}>
          <p><em>{item.texts[0]}</em></p>
          <p>{item.texts[1]}</p>
        </div>
      </div>
    </div>
  );
}

function PoemCard({ poem, delay }: { poem: typeof POEMS[0]; delay: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`${styles.poemCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 100}ms` }}>
      <div className={styles.poemHeader}>
        <i className={poem.icon} />
        <h3>{poem.title}</h3>
      </div>
      <div className={styles.poemContent}>
        {poem.lines.map((line, i) => line === '' ? <br key={i} /> : <p key={i} className={styles.poemLine}>{line}</p>)}
      </div>
      <div className={styles.poemFooter}>
        <span className={styles.poemDate}>{poem.date}</span>
        <i className="fas fa-pen-nib" />
      </div>
    </div>
  );
}

function ProseCard({ story }: { story: typeof PROSE_STORIES[0] }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`${styles.proseCard} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.proseIcon}><i className={story.icon} /></div>
      <h3 className={styles.proseTitle}>{story.title}</h3>
      <div className={styles.proseText}>
        {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <p className={styles.proseEnding}>{story.ending}</p>
      </div>
    </div>
  );
}

function SecretCard({ secret, delay }: { secret: typeof SECRETS[0]; delay: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`${styles.secretCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: `${delay * 100}ms` }}>
      <div className={styles.secretNumber}>{secret.num}</div>
      <div className={styles.secretContent}>
        <h4>{secret.title}</h4>
        <p>{secret.text}</p>
      </div>
      <div className={styles.secretIcon}><i className={secret.icon} /></div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ThreeHundredDaysPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [visiblePromises, setVisiblePromises] = useState(9);

  // Auto-advance quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const prevQuote = () => setCurrentQuote(prev => (prev - 1 + QUOTES.length) % QUOTES.length);
  const nextQuote = () => setCurrentQuote(prev => (prev + 1) % QUOTES.length);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.milestoneBadge}>
              <div className={styles.badgeInner}>
                <span className={styles.badgeNumber}>300</span>
                <span className={styles.badgeText}>NGÀY</span>
              </div>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>300 Ngày Yêu Nhau</span>
              <span className={styles.titleLine2}>Bằng &amp; Duyên</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Từ ngày 23/03/2025 - 300 ngày hành trình yêu thương,
              300 ngày hạnh phúc bên công chúa iuuu của anh 💕
            </p>
            <div className={styles.heroDate}>
              <i className="fas fa-calendar-heart" />
              <span>Kỷ niệm 300 ngày - 17/01/2026</span>
            </div>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <span>Cuộn xuống</span>
          <div className={styles.mouse} />
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
            <h2 className={styles.sectionTitle}><i className="fas fa-route" /> Hành Trình 300 Ngày</h2>
            <p className={styles.sectionSubtitle}>Những cột mốc đáng nhớ trong chuyện tình của đôi mình</p>
          </div>
          <div className={styles.timeline}>
            {TIMELINE_ITEMS.map((item, i) => (
              <TimelineItem key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className={styles.quotesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-feather-alt" /> Lời Yêu Thương Công Túaaa</h2>
            <p className={styles.sectionSubtitle}>Những lời tâm tình anh dành cho công chúa iuuu của anh</p>
          </div>
          <div className={styles.quotesCarousel}>
            <div className={styles.quotesTrack} style={{ transform: `translateX(-${currentQuote * 100}%)` }}>
              {QUOTES.map((quote, i) => (
                <div key={i} className={styles.quoteSlide}>
                  <div className={styles.quoteCard}>
                    <div className={styles.quoteIcon}><i className={quote.icon} /></div>
                    <p className={styles.quoteText} style={{ whiteSpace: 'pre-line' }}>{quote.text}</p>
                    <p className={styles.quoteAuthor}>{quote.author}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.quotesNav}>
              <button className={styles.quoteNavBtn} onClick={prevQuote}><i className="fas fa-chevron-left" /></button>
              <button className={styles.quoteNavBtn} onClick={nextQuote}><i className="fas fa-chevron-right" /></button>
            </div>
            <div className={styles.quotesDots}>
              {QUOTES.map((_, i) => (
                <button key={i} className={`${styles.quoteDot} ${i === currentQuote ? styles.quoteDotActive : ''}`} onClick={() => setCurrentQuote(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Poetry Section */}
      <section className={styles.poetrySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-feather" /> Thơ Tình Dành Em</h2>
            <p className={styles.sectionSubtitle}>Những vần thơ anh viết riêng cho công chúa của anh</p>
          </div>
          <div className={styles.poetryGrid}>
            {POEMS.map((poem, i) => (
              <PoemCard key={i} poem={poem} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Prose Section */}
      <section className={styles.proseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-book-open" /> Văn Xuôi Tình Yêu</h2>
            <p className={styles.sectionSubtitle}>Những câu chuyện ngọt ngào anh muốn kể cho em nghe</p>
          </div>
          <div className={styles.proseContainer}>
            {PROSE_STORIES.map((story, i) => (
              <ProseCard key={i} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* Secrets Section */}
      <section className={styles.secretsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-heart-pulse" /> Tâm Sự Riêng Cho Em</h2>
            <p className={styles.sectionSubtitle}>Những điều anh muốn nói riêng với công chúa nhỏ của anh</p>
          </div>
          <div className={styles.secretsGrid}>
            {SECRETS.map((secret, i) => (
              <SecretCard key={i} secret={secret} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Love Letter Section */}
      <section className={styles.letterSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-envelope-open-text" /> Thư Tình 300 Ngày</h2>
            <p className={styles.sectionSubtitle}>Một bức thư đặc biệt dành riêng cho em</p>
          </div>
          <div className={styles.letterContainer}>
            <div className={`${styles.envelope} ${isEnvelopeOpened ? styles.envelopeOpened : ''}`} onClick={() => setIsEnvelopeOpened(!isEnvelopeOpened)}>
              <div className={styles.envelopeFlap} />
              <div className={styles.heartSeal}><i className="fas fa-heart" /></div>
              <div className={styles.letterPaper}>
                <div className={styles.letterHeader}>
                  <h2>Gửi Công Chúa Iuu Của Anh 👑</h2>
                  <p className={styles.letterDate}>Ngày 17 tháng 1 năm 2026</p>
                </div>
                <div className={styles.letterBody}>
                  <p>Bé Duyên xinh đẹp của anh ơiii,</p>
                  <p>Vèo cái đã 300 ngày, nhanh thật đấyy! Cảm giác như mới hôm qua anh còn rén rén nhắn tin làm quen, mà giờ đã thành &quot;người nhà&quot; của nhau gòi kkk. 300 ngày gọi em là &quot;eiuuuu&quot;, được em quan tâm... đúng là sướng như tiên hẹ hẹ :))</p>
                  <p>300 ngày qua, anh đã tốt nghiệp khóa học: <span className={styles.highlight}>&quot;Cách chiều chuộng công chúa khó tính&quot;</span> (đùa tí thôi chứ eiuuuu của a dễ thưnnn nhất quả đất). Anh học được cách lắng nghe, cách nhường nhịn, và quan trọng nhất là cách yêu một người bằng cả trái tim chân thành này.</p>
                  <p>Anh hông phải văn hay chữ tốt đâu, nhưng tình cảm dành cho em thì bao la bát ngát như biển Đông luôn. Mỗi lúc ở bên em, anh thấy mình như trẻ ra, yêu đời hơn.</p>
                  <p>Cảm ơn bé vì đã đến và làm cuộc đời tẻ nhạt của anh trở nên rực rỡ sắc màu. Anh biết mình chưa hoàn hảo, nhưng anh hứa sẽ cố gắng mỗi ngày để trở thành phiên bản xịn xò nhất cho em dựa vào!</p>
                  <p>300 ngày mới chỉ là màn dạo đầu thôi nha hẹ hẹ. Cuốn phim tình yêu của tụi mình còn dài lắm, còn hàng ngàn tập phía trước!</p>
                  <p><strong>Iuuu em nhiều hơn cả chữ &quot;Nhiều&quot;, thương em hơn cả chữ &quot;Thương&quot;! Mãi bên nhau emmm nhié! 💕</strong></p>
                </div>
                <div className={styles.letterSignature}>
                  <p>Người iuu em nhất trên đời</p>
                  <p>❤️ Quàng tử của em ❤️</p>
                </div>
              </div>
            </div>
            {!isEnvelopeOpened && (
              <p className={styles.envelopeHint}>
                <i className="fas fa-hand-pointer" /> Click vào phong bì để mở thư nhé công chúa!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section className={styles.promisesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><i className="fas fa-hand-holding-heart" /> 300 Lời Hứa</h2>
            <p className={styles.sectionSubtitle}>300 điều anh hứa sẽ làm cho công chúa iuu của anh</p>
          </div>
          <div className={styles.promisesGrid}>
            {PROMISES_DATA.slice(0, visiblePromises).map((promise, i) => (
              <div key={i} className={styles.promiseCard}>
                <div className={styles.promiseNumber}>{i + 1}</div>
                <p className={styles.promiseText}>{promise}</p>
              </div>
            ))}
          </div>
          {visiblePromises < PROMISES_DATA.length && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button className={styles.loadMoreBtn} onClick={() => setVisiblePromises(prev => Math.min(prev + 9, PROMISES_DATA.length))}>
                <i className="fas fa-plus" />
                <span>Xem thêm lời hứa</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.celebrationFooter}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerMessage}>
              <h3>300 ngày chỉ là khởi đầu...</h3>
              <p>Còn vô vàn ngày hạnh phúc đang chờ đợi chúng mình phía trước 💕</p>
            </div>
            <div className={styles.footerNav}>
              <Link href="/memories" className={styles.footerBtn}><i className="fas fa-heart" /> Tất cả kỷ niệm</Link>
              <Link href="/gallery" className={styles.footerBtn}><i className="fas fa-images" /> Thư viện ảnh</Link>
              <Link href="/timeline" className={styles.footerBtn}><i className="fas fa-clock" /> Đếm ngày yêu</Link>
              <Link href="/100days" className={styles.footerBtn}><i className="fas fa-star" /> 100 ngày</Link>
              <Link href="/1year" className={styles.footerBtn}><i className="fas fa-trophy" /> 1 Năm Yêu Nhau</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025-2026 - Tình yêu vĩnh cửu của Bằng &amp; Duyên 💕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
