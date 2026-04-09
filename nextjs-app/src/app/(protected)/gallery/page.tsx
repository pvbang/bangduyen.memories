'use client';

/**
 * Gallery Page - Thư viện ảnh kỷ niệm
 * Converted from gallery.html/gallery.js
 * Features: Masonry/grid layout, lightbox, filters, lazy loading, keyboard shortcuts
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';

// ==========================================
// TYPES
// ==========================================

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  path: string;
  title: string;
  date: string;
  description: string;
}

type FilterType = 'all' | 'images' | 'videos';
type ViewMode = 'grid-large' | 'grid-2' | 'grid-3' | 'grid-4' | 'grid-compact' | 'masonry' | 'list';

interface ViewModeConfig {
  name: string;
  icon: string;
}

// ==========================================
// CONSTANTS
// ==========================================

const ITEMS_PER_LOAD = 30;

const VIEW_MODES: Record<ViewMode, ViewModeConfig> = {
  'grid-large': { name: 'Lưới lớn', icon: 'fas fa-th-large' },
  'grid-2': { name: '3 cột', icon: 'fas fa-th' },
  'grid-3': { name: '4 cột', icon: 'fas fa-border-all' },
  'grid-4': { name: '5 cột', icon: 'fas fa-grip-horizontal' },
  'grid-compact': { name: 'Thu gọn', icon: 'fas fa-grip-lines' },
  'masonry': { name: 'Masonry', icon: 'fas fa-grip-vertical' },
  'list': { name: 'Danh sách', icon: 'fas fa-list' },
};

const VIEW_MODE_KEYS: ViewMode[] = [
  'grid-large', 'grid-2', 'grid-3', 'grid-4', 'grid-compact', 'masonry', 'list',
];

/** Map tên file tiếng Việt → title hiển thị */
const VIETNAMESE_NAMES: Record<string, string> = {
  'App quó chòi.jpg': 'App quá chói 📱✨',
  'Chài chài ảnh hạnh phúc.jpg': 'Chài chài ảnh hạnh phúc 😊',
  'Chân dài 2m.jpeg': 'Chân dài 2m 👗',
  'Chân dài 2m1.jpeg': 'Chân dài 2m1 👠',
  'Cái đồ đẹp chai này.jpg': 'Cái đồ đẹp chai này 😍',
  'Công túa rất buồn...ngủ.jpg': 'Công túa rất buồn...ngủ 😴👑',
  'Cổ tích quó.jpg': 'Cổ tích quá 🧚‍♀️',
  'Dịu ka quó chài.jpg': 'Dịu ka quá chài 🥰',
  'E hèm, thấy gòi nha.jpg': 'E hèm, thấy rồi nha 👀',
  'Gian tình gian tình.jpg': 'Gian tình gian tình 💕',
  'Hehehe chít anh với tui .jpg': 'Hehehe chít anh với tui 😄',
  'Làm gì cũng đệp .jpg': 'Làm gì cũng đẹp ✨',
  'Mlem mlem.jpeg': 'Mlem mlem 😋',
  'Mít ướt.jpg': 'Mít ướt 🥭',
  'Mặt tròn mặt chỉnh.jpg': 'Mặt tròn mặt chỉnh 😊',
  'Mở 1 mắt.jpg': 'Mở 1 mắt 😉',
  'Nhai đòu bây giờ.jpg': 'Nhai đậu bây giờ 🥜',
  'Nhắm 1 mắt.jpeg': 'Nhắm 1 mắt 😌',
  'Sao hay liếc quó.jpg': 'Sao hay liếc quá 👁️',
  'Tay ai vị kè.jpg': 'Tay ai vậy kia 🤚',
  'Tuân lệnh công chúa.jpg': 'Tuân lệnh công chúa 👑',
  'Very hờn.jpg': 'Very hờn 😤',
  'Very khó lói.jpg': 'Very khó lòi 😅',
  'Và công túa chỉ có mình a thou.jpg': 'Và công túa chỉ có mình anh thôi 👑💕',
  'Xinh gái 10đ.jpg': 'Xinh gái 10 điểm 💯',
  'Êy nha êy nha.png': 'Êy nha êy nha 😘',
  'Ô ô ô ô.jpg': 'Ô ô ô ô 😮',
  'Ú òa, bác sĩ Bằng đem xoài cho ăn.jpeg': 'Ú òa, bác sĩ Bằng đem xoài cho ăn 🥭👨‍⚕️',
  'Đã quó đã quó.jpg': 'Đã quá đã quá 😍',
  'Đứng im chụp méng coi.jpg': 'Đứng im chụp mình coi 📸',
  'Đứng im đứng im.jpg': 'Đứng im đứng im 🤳',
  'Ối ối ối.jpg': 'Ối ối ối 😲',
  'Ỷ đẹp trai đó.jpg': 'Ỷ đẹp trai đó 😎',
};

const RANDOM_TITLES = [
  'Khoảnh khắc ngọt ngào 💕',
  'Nụ cười rạng rỡ 😊',
  'Hạnh phúc bên nhau 👫',
  'Yêu thương 💖',
  'Kỷ niệm đẹp ✨',
  'Tình iuuu 💝',
  'Iuuuu emmmmm 🥰',
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/** Hash chuỗi để tạo index nhất quán */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

/** Tạo title từ filename */
function generateImageTitle(filename: string): string {
  if (VIETNAMESE_NAMES[filename]) {
    return VIETNAMESE_NAMES[filename];
  }

  if (filename.startsWith('IMG_') || filename.startsWith('MEITU_')) {
    const dateMatch = filename.match(/(\d{8})/);
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `Kỷ niệm ngày ${day}/${month}/${year} 📸`;
    }
    return filename.startsWith('MEITU_') ? 'Ảnh đã chỉnh sửa ✨' : 'Khoảnh khắc đẹp 📷';
  }

  if (filename.startsWith('Messenger_creation_')) {
    return 'Kỷ niệm trên Messenger 💬';
  }

  return RANDOM_TITLES[hashString(filename) % RANDOM_TITLES.length];
}

/** Tạo ngày giả dựa trên filename */
function generateDateFromFilename(filename: string): string {
  // Cố gắng extract ngày từ filename
  const dateMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (dateMatch) {
    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]);
    const day = parseInt(dateMatch[3]);
    if (year >= 2025 && year <= 2030 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Cố extract từ timestamp filenames (unix-like)
  const tsMatch = filename.match(/^(\d{13})\./);
  if (tsMatch) {
    const ts = parseInt(tsMatch[1]);
    const date = new Date(ts);
    if (date.getFullYear() >= 2025) {
      return date.toISOString().split('T')[0];
    }
  }

  // Fallback: tạo random date từ hash
  const hash = hashString(filename);
  const start = new Date(2025, 1, 8).getTime();
  const end = new Date(2026, 3, 9).getTime();
  const date = new Date(start + (hash % (end - start)));
  return date.toISOString().split('T')[0];
}

/** Format date sang Vietnamese */
function formatDateVN(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

/** Get view mode CSS class */
function getViewModeClass(view: ViewMode): string {
  const classMap: Record<ViewMode, string> = {
    'grid-large': styles.gridLarge,
    'grid-2': styles.grid2,
    'grid-3': styles.grid3,
    'grid-4': styles.grid4,
    'grid-compact': styles.gridCompact,
    'masonry': styles.masonry,
    'list': styles.list,
  };
  return classMap[view] || '';
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

/** Background animation with floating hearts, petals, orbs, sparkles */
function GalleryBackground() {
  return (
    <div className={styles.animatedBackground}>
      <div className={styles.floatingHearts}>
        {['💕', '💖', '💗', '💝', '💘', '💓', '💞', '💟'].map((emoji, i) => (
          <div key={`heart-${i}`} className={cn(styles.heart, styles[`heart${i + 1}` as keyof typeof styles])}>
            {emoji}
          </div>
        ))}
      </div>
      <div className={styles.floatingPetals}>
        {['🌸', '🌺', '🌸', '🌺', '🌸', '🌺'].map((emoji, i) => (
          <div key={`petal-${i}`} className={cn(styles.petal, styles[`petal${i + 1}` as keyof typeof styles])}>
            {emoji}
          </div>
        ))}
      </div>
      <div className={styles.gradientOrbs}>
        {[1, 2, 3, 4].map((i) => (
          <div key={`orb-${i}`} className={cn(styles.orb, styles[`orb${i}` as keyof typeof styles])} />
        ))}
      </div>
      <div className={styles.sparkles}>
        {['✨', '⭐', '✨', '⭐', '✨'].map((emoji, i) => (
          <div key={`sparkle-${i}`} className={cn(styles.sparkle, styles[`sparkle${i + 1}` as keyof typeof styles])}>
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Gallery item card */
function GalleryItemCard({
  item,
  index,
  onClick,
}: {
  item: MediaItem;
  index: number;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(styles.galleryItem, styles.galleryItemEntrance)}
      style={{ animationDelay: `${Math.min(index * 0.05, 1.5)}s` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div className={styles.galleryItemMedia}>
        {item.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgError
              ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFNEUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjRkY2OUI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+WvO+4jzwvdGV4dD48L3N2Zz4='
              : item.path
            }
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <video src={item.path} preload="metadata" muted />
            <div className={styles.playOverlay}>
              <i className="fas fa-play-circle" />
            </div>
          </>
        )}

        {/* Overlay with info */}
        <div className={styles.galleryItemOverlay}>
          <div className={styles.galleryItemInfo}>
            <div className={styles.galleryItemTitle}>{item.title}</div>
            <div className={styles.galleryItemDate}>
              <i className="fas fa-calendar-alt" />
              {formatDateVN(item.date)}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.galleryItemActions}>
          <button
            className={styles.actionIcon}
            onClick={(e) => { e.stopPropagation(); }}
            aria-label="Yêu thích"
          >
            <i className="fas fa-heart" />
          </button>
        </div>
      </div>

      {/* Type indicator */}
      <div className={styles.galleryItemType}>
        <i className={item.type === 'image' ? 'fas fa-image' : 'fas fa-video'} />
        {' '}
        {item.type === 'image' ? 'Ảnh' : 'Video'}
      </div>
    </div>
  );
}

/** Lightbox modal */
function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: {
  items: MediaItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const item = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  // Reset zoom when changing image
  useEffect(() => {
    setIsZoomed(false);
    if (imgRef.current) {
      imgRef.current.style.transform = 'none';
    }
  }, [currentIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        onNext();
      } else if (diff < 0 && hasPrev) {
        onPrev();
      }
    }
  }

  if (!isOpen || !item) return null;

  return (
    <div className={cn(styles.lightbox, styles.lightboxActive)}>
      {/* Backdrop */}
      <div className={styles.lightboxBackdrop} onClick={onClose} />

      {/* Close button */}
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Đóng">
        <i className="fas fa-times" />
      </button>

      {/* Navigation */}
      <div className={styles.lightboxNavigation}>
        <button
          className={styles.lightboxNavBtn}
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Ảnh trước"
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button
          className={styles.lightboxNavBtn}
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Ảnh sau"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      {/* Media content */}
      <div
        className={styles.lightboxContent}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.lightboxMediaContainer}>
          <div className={styles.lightboxMedia}>
            {item.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={item.path}
                alt={item.title}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                  if (imgRef.current) {
                    imgRef.current.style.transform = isZoomed ? 'none' : 'scale(2)';
                    imgRef.current.style.cursor = isZoomed ? 'zoom-in' : 'zoom-out';
                  }
                }}
                style={{ cursor: 'zoom-in', transition: 'transform 0.3s ease' }}
                draggable={false}
              />
            ) : (
              <video src={item.path} controls style={{ maxWidth: '90vw', maxHeight: '85vh' }} />
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className={styles.lightboxTitle}>{item.title}</div>

      {/* Counter */}
      <div className={styles.lightboxCounter}>
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}

/** Animated number counter */
function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (target === 0 || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const totalFrames = 30;
    const increment = Math.ceil(target / totalFrames);

    const timer = setInterval(() => {
      frame++;
      const value = Math.min(increment * frame, target);
      setCurrent(value);
      if (value >= target) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [target]);

  return <span className={styles.statNumber}>{current}</span>;
}

// ==========================================
// MAIN GALLERY PAGE COMPONENT
// ==========================================

export default function GalleryPage() {
  // State
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<MediaItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [currentView, setCurrentView] = useState<ViewMode>('grid-2');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [viewIndicator, setViewIndicator] = useState<string | null>(null);
  const viewIndicatorTimer = useRef<NodeJS.Timeout | null>(null);

  // Load saved view mode from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galleryViewMode');
      if (saved && saved in VIEW_MODES) {
        setCurrentView(saved as ViewMode);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Load media items from image-list.json
  useEffect(() => {
    async function loadMedia() {
      setIsLoading(true);
      try {
        const response = await fetch('/data/image-list.json');
        const data = await response.json();

        const imageItems: MediaItem[] = (data.images as string[])
          .filter((f: string) => {
            const ext = f.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
          })
          .map((filename: string, index: number) => ({
            id: `img_${index}`,
            type: 'image' as const,
            filename,
            path: `/data/images/${encodeURIComponent(filename)}`,
            title: generateImageTitle(filename),
            date: generateDateFromFilename(filename),
            description: 'Một khoảnh khắc đẹp trong kỷ niệm của chúng ta',
          }));

        const videoItems: MediaItem[] = (data.videos as string[] || [])
          .map((filename: string, index: number) => ({
            id: `vid_${index}`,
            type: 'video' as const,
            filename,
            path: `/data/videos/${encodeURIComponent(filename)}`,
            title: 'Video kỷ niệm 🎬',
            date: generateDateFromFilename(filename),
            description: 'Một khoảnh khắc động trong kỷ niệm của chúng ta',
          }));

        const items = [...imageItems, ...videoItems].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAllItems(items);
        setFilteredItems(items);

        // Load first batch
        setDisplayedItems(items.slice(0, ITEMS_PER_LOAD));
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading media items:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMedia();
  }, []);

  // Filter handler
  const handleFilter = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);

    let filtered: MediaItem[];
    if (filter === 'all') {
      filtered = [...allItems];
    } else if (filter === 'images') {
      filtered = allItems.filter((item) => item.type === 'image');
    } else {
      filtered = allItems.filter((item) => item.type === 'video');
    }

    setFilteredItems(filtered);
    setDisplayedItems(filtered.slice(0, ITEMS_PER_LOAD));
    setCurrentPage(1);
  }, [allItems]);

  // View mode handler
  const handleViewChange = useCallback((view: ViewMode) => {
    setCurrentView(view);

    try {
      localStorage.setItem('galleryViewMode', view);
    } catch {
      // localStorage not available
    }

    // Show indicator
    setViewIndicator(view);
    if (viewIndicatorTimer.current) {
      clearTimeout(viewIndicatorTimer.current);
    }
    viewIndicatorTimer.current = setTimeout(() => {
      setViewIndicator(null);
    }, 2000);
  }, []);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    const startIndex = currentPage * ITEMS_PER_LOAD;
    const endIndex = startIndex + ITEMS_PER_LOAD;
    const newItems = filteredItems.slice(0, endIndex);
    setDisplayedItems(newItems);
    setCurrentPage((prev) => prev + 1);
  }, [currentPage, filteredItems]);

  // Lightbox handlers
  const openLightbox = useCallback((index: number) => {
    // Find index in filteredItems based on displayed item
    const item = displayedItems[index];
    const filteredIndex = filteredItems.findIndex((fi) => fi.id === item.id);
    setLightboxIndex(filteredIndex >= 0 ? filteredIndex : index);
  }, [displayedItems, filteredItems]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(-1);
  }, []);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => Math.min(filteredItems.length - 1, prev + 1));
  }, [filteredItems.length]);

  // Keyboard shortcuts for view modes (when not in lightbox)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex >= 0) return; // Lightbox handles its own keys

      // Number keys 1-7 for view modes
      if (e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const modeIndex = parseInt(e.key) - 1;
        if (modeIndex < VIEW_MODE_KEYS.length) {
          handleViewChange(VIEW_MODE_KEYS[modeIndex]);
        }
      }
      // Space to toggle grid/list
      else if (e.key === ' ' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        handleViewChange(currentView === 'list' ? 'grid-2' : 'list');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, currentView, handleViewChange]);

  // Computed values
  const totalImages = allItems.filter((item) => item.type === 'image').length;
  const totalVideos = allItems.filter((item) => item.type === 'video').length;
  const totalMemories = allItems.length;
  const hasMoreItems = displayedItems.length < filteredItems.length;
  const remainingItems = filteredItems.length - displayedItems.length;

  return (
    <div className={styles.galleryPage}>
      {/* Animated Background */}
      <GalleryBackground />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerDecoration}>
            <div className={cn(styles.decoLine, styles.left)} />
            <div className={styles.decoHeart}>💖</div>
            <div className={cn(styles.decoLine, styles.right)} />
          </div>
          <h1 className={styles.pageTitle}>
            <span className={styles.titleMain}>Gallery</span>
            <span className={styles.titleSub}>Bộ sưu tập kỷ niệm ngọt ngào</span>
          </h1>
          <div className={styles.headerQuote}>
            <p>&ldquo;Mỗi bức ảnh là một câu chuyện, mỗi khoảnh khắc là một kỷ niệm&rdquo;</p>
            <div className={styles.quoteHearts}>💕 💗 💕</div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h2 className={styles.heroTitle}>Bộ sưu tập kỷ niệm</h2>
              <p className={styles.heroSubtitle}>
                <i className="fas fa-infinity" />
                Những khoảnh khắc đẹp của chúng mình
                <i className="fas fa-heart" />
              </p>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <AnimatedNumber target={totalImages} />
                  <span className={styles.statLabel}>Hình ảnh</span>
                </div>
                <div className={styles.statItem}>
                  <AnimatedNumber target={totalVideos} />
                  <span className={styles.statLabel}>Video</span>
                </div>
                <div className={styles.statItem}>
                  <AnimatedNumber target={totalMemories} />
                  <span className={styles.statLabel}>Kỷ niệm</span>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Controls */}
          <section className={styles.galleryControls}>
            <div className={styles.controlsContainer}>
              {/* Filter Controls */}
              <div className={styles.filterControls}>
                <h3>Lọc theo loại</h3>
                <div className={styles.filterButtons}>
                  {([
                    { filter: 'all' as FilterType, icon: 'fas fa-th', label: 'Tất cả' },
                    { filter: 'images' as FilterType, icon: 'fas fa-image', label: 'Hình ảnh' },
                    { filter: 'videos' as FilterType, icon: 'fas fa-video', label: 'Video' },
                  ]).map(({ filter, icon, label }) => (
                    <button
                      key={filter}
                      className={cn(
                        styles.filterBtn,
                        currentFilter === filter && styles.filterBtnActive
                      )}
                      onClick={() => handleFilter(filter)}
                    >
                      <i className={icon} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* View Controls */}
              <div className={styles.viewControls}>
                <h3>Chế độ xem</h3>
                <div className={styles.viewButtons}>
                  {VIEW_MODE_KEYS.map((view) => (
                    <button
                      key={view}
                      className={cn(
                        styles.viewBtn,
                        currentView === view && styles.viewBtnActive
                      )}
                      onClick={() => handleViewChange(view)}
                      title={`${VIEW_MODES[view].name} (Phím ${VIEW_MODE_KEYS.indexOf(view) + 1})`}
                    >
                      <i className={VIEW_MODES[view].icon} />
                      <span>{VIEW_MODES[view].name}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.keyboardShortcuts}>
                  <small>
                    <i className="fas fa-keyboard" />
                    Phím tắt: 1-7 cho chế độ xem, Space để chuyển lưới/danh sách
                  </small>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className={styles.gallery}>
            <div
              className={cn(styles.galleryGrid, getViewModeClass(currentView))}
            >
              {displayedItems.map((item, index) => (
                <GalleryItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreItems && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                  <i className="fas fa-images" />
                  <span>Xem thêm ảnh</span>
                  <small>({remainingItems} ảnh còn lại)</small>
                </button>
              </div>
            )}
          </section>

          {/* Loading Indicator */}
          <div className={cn(styles.loading, isLoading && styles.loadingShow)}>
            <div className={styles.spinner} />
            <p>Đang tải những kỷ niệm ...</p>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Made with <i className="fas fa-heart" /> by aiu Bang for eiu Duyen
          </p>
        </footer>
      </div>

      {/* View Mode Indicator */}
      {viewIndicator && (
        <div className={cn(styles.viewModeIndicator, styles.viewModeIndicatorShow)}>
          <i className={VIEW_MODES[viewIndicator as ViewMode]?.icon || 'fas fa-th'} />
          <span>{VIEW_MODES[viewIndicator as ViewMode]?.name || ''}</span>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={closeLightbox}
        onPrev={prevLightbox}
        onNext={nextLightbox}
      />
    </div>
  );
}
