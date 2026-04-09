'use client';

/**
 * Memories Page - Trang kỷ niệm chính
 * Route: /memories
 *
 * Chuyển đổi từ memories.html + memories.js sang Next.js
 * - Load data từ /data/memories.json
 * - Filter theo category
 * - Pagination (load more)
 * - Modal chi tiết
 * - Background animations
 * - Scroll to top
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Memory, MemoriesData, MemoryCategory } from '@/types/memory';
import { formatDate } from '@/lib/utils';
import {
  MEMORIES_PER_PAGE,
  CATEGORY_ICONS,
  CATEGORY_NAMES,
  MOOD_ICONS,
} from '@/lib/constants';
import { BackgroundAnimation } from '@/components/shared/BackgroundAnimation';
import styles from './memories.module.css';

/** Filter options hiển thị trên UI */
interface FilterOption {
  value: MemoryCategory | 'all';
  label: string;
  icon: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tất cả', icon: 'fas fa-heart' },
  { value: 'milestone', label: 'Cột mốc quan trọng', icon: 'fas fa-star' },
  { value: 'dating', label: 'Hẹn hò', icon: 'fas fa-heart' },
  { value: 'daily', label: 'Hàng ngày', icon: 'fas fa-calendar-day' },
  { value: 'quotes', label: 'Lời yêu thương', icon: 'fas fa-quote-left' },
];

/**
 * Format date an toàn - xử lý cả "Ký ức" và date string
 */
function safeFormatDate(dateString: string): string {
  if (!dateString || dateString === 'Ký ức') {
    return 'Ký ức';
  }
  const formatted = formatDate(dateString);
  return formatted === 'Invalid Date' ? 'Ký ức' : formatted;
}

/**
 * Lấy icon cho category, fallback về heart
 */
function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || 'fas fa-heart';
}

/**
 * Lấy tên hiển thị cho category
 */
function getCategoryName(category: string): string {
  return CATEGORY_NAMES[category] || 'Khác';
}

/**
 * Lấy icon cho mood, fallback về heart
 */
function getMoodIcon(mood: string): string {
  // Normalize mood string to lowercase for matching
  const normalizedMood = mood?.toLowerCase() || '';
  return MOOD_ICONS[normalizedMood] || 'fas fa-heart';
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

/** Props cho MemoryCard */
interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

/** Memory Card Component */
function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const formattedDate = safeFormatDate(memory.date);
  const categoryIcon = getCategoryIcon(memory.category);
  const moodIcon = getMoodIcon(memory.mood);

  return (
    <div
      className={styles.memoryCard}
      onClick={() => onClick(memory)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(memory);
        }
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardDate}>{formattedDate}</div>
        <h3 className={styles.cardTitle}>{memory.title}</h3>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardContent}>{memory.content}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.cardCategory}>
          <i className={categoryIcon} />
          {getCategoryName(memory.category)}
        </span>
        <span className={styles.cardMood}>
          <i className={moodIcon} />
          {memory.mood || 'Đặc biệt'}
        </span>
      </div>
    </div>
  );
}

/** Props cho MemoryModal */
interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

/** Memory Modal Component */
function MemoryModal({ memory, isOpen, onClose }: MemoryModalProps) {
  // Đóng modal khi nhấn Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!memory) return null;

  const formattedDate = safeFormatDate(memory.date);
  const categoryIcon = getCategoryIcon(memory.category);
  const moodIcon = getMoodIcon(memory.mood);

  return (
    <div
      className={`${styles.memoryModal} ${isOpen ? styles.memoryModalShow : ''}`}
    >
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContent}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Đóng"
        >
          <i className="fas fa-times" />
        </button>
        <div className={styles.modalBody}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{memory.title}</h2>
            <div className={styles.modalDate}>{formattedDate}</div>
          </div>
          <div className={styles.modalContentText}>{memory.content}</div>
          <div className={styles.modalMeta}>
            <span className={styles.cardCategory}>
              <i className={categoryIcon} />
              {getCategoryName(memory.category)}
            </span>
            <span className={styles.cardMood}>
              <i className={moodIcon} />
              {memory.mood || 'Đặc biệt'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Scroll to Top Button */
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.pageYOffset > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      className={`${styles.scrollToTop} ${isVisible ? styles.scrollToTopVisible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function MemoriesPage() {
  // State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<MemoryCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load memories data
  useEffect(() => {
    async function loadMemories() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/data/memories.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MemoriesData = await response.json();
        setMemories(data.memories || []);
      } catch (err) {
        console.error('Error loading memories:', err);
        setError('Không thể tải kỷ niệm. Vui lòng kiểm tra kết nối mạng.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMemories();
  }, []);

  // Filtered memories (memoized)
  const filteredMemories = useMemo(() => {
    if (currentFilter === 'all') return memories;
    return memories.filter((m) => m.category === currentFilter);
  }, [memories, currentFilter]);

  // Paginated memories (memoized)
  const paginatedMemories = useMemo(() => {
    const endIndex = currentPage * MEMORIES_PER_PAGE;
    return filteredMemories.slice(0, endIndex);
  }, [filteredMemories, currentPage]);

  // Check if there are more memories to load
  const hasMore = paginatedMemories.length < filteredMemories.length;

  // Handlers
  const handleFilterClick = useCallback((filter: MemoryCategory | 'all') => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handleOpenModal = useCallback((memory: Memory) => {
    setSelectedMemory(memory);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMemory(null);
  }, []);

  return (
    <div className={styles.memoriesPage}>
      {/* Background Animations */}
      <BackgroundAnimation />

      {/* Header */}
      <header className={styles.memoriesHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              Kỷ niệm của chúng mình
            </h1>
            <p className={styles.subtitle}>
              Những khoảnh khắc đẹp bên nhau
            </p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`${styles.filterBtn} ${
                  currentFilter === option.value ? styles.filterBtnActive : ''
                }`}
                onClick={() => handleFilterClick(option.value)}
              >
                <i className={option.icon} /> {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Memories Grid */}
      <main className={styles.memoriesContainer}>
        <div className={styles.container}>
          <div className={styles.memoriesGrid}>
            {/* Loading State */}
            {isLoading && <div className={styles.loading} />}

            {/* Error State */}
            {error && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-triangle" />
                <p>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && paginatedMemories.length === 0 && (
              <div className={styles.noMemories}>
                <i className="fas fa-heart" />
                <p>Chưa có kỷ niệm nào trong danh mục này</p>
              </div>
            )}

            {/* Memory Cards */}
            {!isLoading &&
              !error &&
              paginatedMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={handleOpenModal}
                />
              ))}
          </div>

          {/* Load More Button */}
          {hasMore && !isLoading && !error && (
            <div className={styles.loadMoreContainer}>
              <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                <i className="fas fa-heart" />
                Xem thêm kỷ niệm
                <i className="fas fa-heart" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Memory Detail Modal */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  );
}
