'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

/* ==========================================
   INTERFACES
   ========================================== */
interface Memory {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  template: string;
  mood: string;
  showImages: boolean;
  images: string[];
}

/* ==========================================
   HELPERS
   ========================================== */
const categoryLabels: Record<string, string> = {
  special: 'Đặc biệt',
  daily: 'Hàng ngày',
  anniversary: 'Kỷ niệm',
  trip: 'Du lịch',
  milestone: 'Cột mốc',
};

const categoryIcons: Record<string, string> = {
  special: '✨',
  daily: '🌸',
  anniversary: '💕',
  trip: '🎒',
  milestone: '🎯',
};

const moodLabels: Record<string, string> = {
  happy: 'Vui vẻ',
  romantic: 'Lãng mạn',
  nostalgic: 'Hoài niệm',
  sweet: 'Ngọt ngào',
  excited: 'Phấn khích',
  peaceful: 'Yên bình',
};

const moodIcons: Record<string, string> = {
  happy: '😊',
  romantic: '💕',
  nostalgic: '🌅',
  sweet: '🍯',
  excited: '🎉',
  peaceful: '🕊️',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/* ==========================================
   ADMIN PAGE COMPONENT
   ========================================== */
export default function AdminPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMemories = useCallback(() => {
    setLoading(true);
    try {
      const localData = localStorage.getItem('memoriesData');
      if (localData) {
        setMemories(JSON.parse(localData));
      }
    } catch {
      /* empty */
    }

    fetch('/data/memories.json')
      .then((res) => {
        if (!res.ok) throw new Error('Cannot load');
        return res.json();
      })
      .then((data) => {
        if (data.memories && Array.isArray(data.memories)) {
          setMemories(data.memories);
          localStorage.setItem('memoriesData', JSON.stringify(data.memories));
        }
      })
      .catch(() => {
        /* already loaded from localStorage */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const saveMemories = useCallback((newMemories: Memory[]) => {
    setMemories(newMemories);
    localStorage.setItem('memoriesData', JSON.stringify(newMemories));
  }, []);

  return (
    <div className={styles.adminPage}>
      {/* Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingHearts}>
          <div className={styles.heart}></div>
          <div className={styles.heart}></div>
          <div className={styles.heart}></div>
          <div className={styles.heart}></div>
          <div className={styles.heart}></div>
        </div>
      </div>

      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className={styles.adminContainer}>
        <div className={styles.adminLayout}>
          <FormSection memories={memories} saveMemories={saveMemories} />
          <PreviewSection />
        </div>
      </main>

      {/* Memories Management */}
      <MemoriesManagement memories={memories} saveMemories={saveMemories} loading={loading} />

      {/* Love Rules */}
      <LoveRulesSection />
    </div>
  );
}

/* ==========================================
   HEADER
   ========================================== */
function AdminHeader() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.adminContainer}>
        <div className={styles.headerContent}>
          <div className={styles.headerBrand}>
            <div className={styles.brandIcon}>❤️</div>
            <div>
              <h1 className={styles.pageTitle}>
                <span className={styles.gradientText}>Bằng &amp; Duyên</span>
                <span className={styles.subtitleText}>Quản trị kỷ niệm</span>
              </h1>
            </div>
          </div>
          <div className={styles.headerActions}>
            <nav className={styles.quickNav}>
              <button className={styles.navLink} onClick={() => scrollTo('form')}>
                ➕ <span>Thêm mới</span>
              </button>
              <button className={styles.navLink} onClick={() => scrollTo('manage')}>
                📋 <span>Quản lý</span>
              </button>
              <button className={styles.navLink} onClick={() => scrollTo('rules')}>
                💗 <span>Quy tắc</span>
              </button>
            </nav>
            <Link href="/memories" className={styles.backBtn}>
              ← <span>Về trang chính</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ==========================================
   FORM SECTION
   ========================================== */
function FormSection({ memories, saveMemories }: {
  memories: Memory[];
  saveMemories: (m: Memory[]) => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [template, setTemplate] = useState('random');
  const [mood, setMood] = useState('happy');
  const [showImages, setShowImages] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setCategory('');
    setContent('');
    setTemplate('random');
    setMood('happy');
    setShowImages(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !category || !content) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const memoryData: Memory = {
      id: editingId || (memories.length > 0 ? Math.max(...memories.map((m) => m.id || 0)) + 1 : 1),
      title,
      date,
      category,
      content,
      template,
      mood,
      showImages,
      images: [],
    };

    let newMemories: Memory[];
    if (editingId) {
      newMemories = memories.map((m) => (m.id === editingId ? memoryData : m));
    } else {
      newMemories = [...memories, memoryData];
    }

    saveMemories(newMemories);
    resetForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Expose editMemory for child use via window event
  useEffect(() => {
    const handler = (e: CustomEvent<number>) => {
      const memory = memories.find((m) => m.id === e.detail);
      if (!memory) return;
      setTitle(memory.title || '');
      setDate(memory.date || '');
      setCategory(memory.category || '');
      setContent(memory.content || '');
      setTemplate(memory.template || 'random');
      setMood(memory.mood || 'happy');
      setShowImages(memory.showImages || false);
      setEditingId(memory.id);
      document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('editMemory', handler as EventListener);
    return () => window.removeEventListener('editMemory', handler as EventListener);
  }, [memories]);

  return (
    <section className={styles.adminFormSection} id="form">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>➕</div>
        <div className={styles.sectionTitleWrapper}>
          <h2 className={styles.sectionTitle}>Tạo kỷ niệm mới</h2>
          <p className={styles.sectionSubtitle}>Lưu lại những khoảnh khắc đáng nhớ của chúng ta</p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formSections}>
            {/* Memory Info */}
            <div>
              <div className={styles.sectionHeaderSmall}>
                <span>❤️</span>
                <h3>Thông tin kỷ niệm</h3>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>✍️ Tiêu đề kỷ niệm</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Ví dụ: Ngày đầu tiên gặp nhau..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>📅 Ngày tháng</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>🏷️ Loại kỷ niệm</label>
                  <select
                    className={styles.formSelect}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Chọn loại kỷ niệm</option>
                    <option value="special">✨ Đặc biệt</option>
                    <option value="daily">🌸 Hàng ngày</option>
                    <option value="anniversary">💕 Kỷ niệm</option>
                    <option value="trip">🎒 Du lịch</option>
                    <option value="milestone">🎯 Cột mốc</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>✒️ Nội dung kỷ niệm</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Kể về kỷ niệm này..."
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Images Section */}
            <div>
              <div className={styles.sectionHeaderSmall}>
                <span>🖼️</span>
                <h3>Hình ảnh</h3>
              </div>

              <div className={styles.toggleGroup}>
                <label className={styles.toggleSwitch} onClick={() => setShowImages(!showImages)}>
                  <div className={`${styles.toggleSlider} ${showImages ? styles.toggleSliderActive : ''}`}></div>
                  <span className={styles.toggleLabel}>Có hình ảnh đi kèm</span>
                </label>
              </div>
            </div>

            {/* Customize Section */}
            <div>
              <div className={styles.sectionHeaderSmall}>
                <span>🎨</span>
                <h3>Tùy chỉnh hiển thị</h3>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>📐 Template hiển thị</label>
                  <select
                    className={styles.formSelect}
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    <option value="random">🎲 Ngẫu nhiên</option>
                    <option value="classic">📜 Cổ điển</option>
                    <option value="modern">🌟 Hiện đại</option>
                    <option value="romantic">💖 Lãng mạn</option>
                    <option value="minimalist">⚪ Tối giản</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>😊 Tâm trạng</label>
                  <select
                    className={styles.formSelect}
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="happy">😊 Vui vẻ</option>
                    <option value="romantic">💕 Lãng mạn</option>
                    <option value="nostalgic">🌅 Hoài niệm</option>
                    <option value="sweet">🍯 Ngọt ngào</option>
                    <option value="excited">🎉 Phấn khích</option>
                    <option value="peaceful">🕊️ Yên bình</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              ❤️ <span>{editingId ? 'Cập nhật kỷ niệm' : 'Lưu kỷ niệm'}</span> ✨
            </button>
            <button type="button" className={styles.resetBtn} onClick={resetForm}>
              🔄 <span>Làm mới</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className={styles.successModal}>
          <div className={styles.modalOverlay} onClick={() => setShowSuccess(false)}></div>
          <div className={styles.successModalContent}>
            <div className={styles.successIcon}>❤️</div>
            <h3>Thành công!</h3>
            <p>Kỷ niệm đã được lưu thành công</p>
            <button onClick={() => setShowSuccess(false)} className={styles.okBtn}>
              ✓ Tuyệt vời!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================
   PREVIEW SECTION
   ========================================== */
function PreviewSection() {
  return (
    <section className={styles.adminPreviewSection}>
      <div className={styles.previewHeader}>
        <div className={styles.previewIcon}>👁️</div>
        <h3>Xem trước</h3>
      </div>
      <div className={styles.previewContainer}>
        <div className={styles.previewPlaceholder}>
          <span>✨</span>
          <h4>Xem trước tại đây</h4>
          <p>Nhập thông tin bên trái để xem trước kỷ niệm</p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   MEMORIES MANAGEMENT
   ========================================== */
function MemoriesManagement({ memories, saveMemories, loading }: {
  memories: Memory[];
  saveMemories: (m: Memory[]) => void;
  loading: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMemories = memories.filter((m) => {
    const matchesSearch = !searchTerm ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalMemories = filteredMemories.length;
  const specialCount = filteredMemories.filter((m) => m.category === 'special').length;
  const thisMonthCount = filteredMemories.filter((m) => {
    const d = new Date(m.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const deleteMemory = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa kỷ niệm này không?')) {
      saveMemories(memories.filter((m) => m.id !== id));
    }
  };

  const editMemory = (id: number) => {
    window.dispatchEvent(new CustomEvent('editMemory', { detail: id }));
  };

  const exportBackup = () => {
    const jsonData = { memories };
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'memories.json';
    link.click();
  };

  const importMemories = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jsonData = JSON.parse(ev.target?.result as string);
        if (jsonData.memories && Array.isArray(jsonData.memories)) {
          saveMemories(jsonData.memories);
          alert('Import dữ liệu thành công!');
        } else {
          throw new Error('Invalid');
        }
      } catch {
        alert('Lỗi: File JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <section className={styles.adminMemoriesSection} id="manage">
      <div className={styles.adminContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>📋</div>
          <div className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>Quản lý kỷ niệm</h2>
            <p className={styles.sectionSubtitle}>Xem, chỉnh sửa và xóa các kỷ niệm đã lưu</p>
          </div>
          <div className={styles.sectionActions}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm kỷ niệm..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className={styles.filterSelect}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Tất cả loại</option>
              <option value="special">Đặc biệt</option>
              <option value="daily">Hàng ngày</option>
              <option value="anniversary">Kỷ niệm</option>
              <option value="trip">Du lịch</option>
            </select>
            <div className={styles.dataActions}>
              <button className={styles.actionBtnSecondary} onClick={exportBackup}>
                📥 Export
              </button>
              <button className={styles.actionBtnSecondary} onClick={() => fileInputRef.current?.click()}>
                📤 Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={importMemories}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.memoriesStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div>
              <div className={styles.statNumber}>{totalMemories}</div>
              <div className={styles.statLabel}>Tổng kỷ niệm</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div>
              <div className={styles.statNumber}>{specialCount}</div>
              <div className={styles.statLabel}>Đặc biệt</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <div className={styles.statNumber}>{thisMonthCount}</div>
              <div className={styles.statLabel}>Tháng này</div>
            </div>
          </div>
        </div>

        {/* Memory Cards Grid */}
        <div className={styles.adminMemoriesGrid}>
          {loading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <p>Đang tải kỷ niệm...</p>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💔</div>
              <h3>Chưa có kỷ niệm nào</h3>
              <p>Hãy thêm kỷ niệm đầu tiên của chúng ta!</p>
              <button
                className={styles.addMemoryBtn}
                onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ➕ Thêm kỷ niệm
              </button>
            </div>
          ) : (
            [...filteredMemories]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((memory) => (
                <div key={memory.id} className={styles.adminMemoryCard}>
                  <div className={styles.adminCardHeader}>
                    <div className={styles.adminCardCategory}>
                      {categoryIcons[memory.category] || '💝'} {categoryLabels[memory.category] || memory.category}
                    </div>
                    <div className={styles.adminCardActions}>
                      <button className={styles.editBtn} onClick={() => editMemory(memory.id)} title="Chỉnh sửa">
                        ✏️
                      </button>
                      <button className={styles.deleteBtn} onClick={() => deleteMemory(memory.id)} title="Xóa">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <h4 className={styles.adminCardTitle}>{memory.title}</h4>
                  <div className={styles.adminCardDate}>
                    📅 {formatDate(memory.date)}
                  </div>
                  <p className={styles.adminCardText}>{truncateText(memory.content, 150)}</p>
                  <div className={styles.adminCardFooter}>
                    <span>{moodIcons[memory.mood] || '💝'} {moodLabels[memory.mood] || memory.mood}</span>
                    <span>🎨 {categoryLabels[memory.template] || memory.template || 'Ngẫu nhiên'}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   LOVE RULES SECTION
   ========================================== */
function LoveRulesSection() {
  return (
    <section className={styles.loveRulesSection} id="rules">
      <div className={styles.adminContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>💗</div>
          <div className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>Quy tắc tình yêu của chúng ta</h2>
            <p className={styles.sectionSubtitle}>Những điều quan trọng cần nhớ trong hành trình yêu đương</p>
          </div>
        </div>

        <div className={styles.rulesGrid}>
          <div className={styles.ruleCard}>
            <div className={styles.ruleNumber}>1</div>
            <div className={styles.ruleContent}>
              <h3>Chia sẻ mọi thứ quan trọng</h3>
              <p>Có chuyện gì quan trọng cũng phải kể nhau nghe nhá, nếu có riêng tư quá thì có thể nói hoặc không, nhưng em mong là nói ra hết nhá</p>
            </div>
          </div>
          <div className={styles.ruleCard}>
            <div className={styles.ruleNumber}>2</div>
            <div className={styles.ruleContent}>
              <h3>Cùng nhau giải quyết xích mích</h3>
              <p>Nếu mình có xích mích gì với nhau thì cả 2 cùng ngồi lại nói chuyện nhá, nếu như mất bình tĩnh quá thì em mong là anh sẽ dỗ dành em</p>
            </div>
          </div>
          <div className={styles.ruleCard}>
            <div className={styles.ruleNumber}>3</div>
            <div className={styles.ruleContent}>
              <h3>Nhẹ nhàng với nhau</h3>
              <p>Em rất là nhạy cảm nên là không được lớn tiếng với em đâu đó</p>
            </div>
          </div>
          <div className={styles.ruleCard}>
            <div className={styles.ruleNumber}>4</div>
            <div className={styles.ruleContent}>
              <h3>Tin tưởng giác quan thứ 6</h3>
              <p>Giác quan thứ 6 của con gái rất nhạy đúng không, nên là nếu em cảm nhận được một điều gì đó không hay thì em mong rằng em và anh sẽ có một cách xử lý nào đó đúng đắn</p>
            </div>
          </div>
          <div className={`${styles.ruleCard} ${styles.ruleCardSpecial}`}>
            <div className={styles.ruleNumber}>💝</div>
            <div className={styles.ruleContent}>
              <h3>Lưu ý đặc biệt</h3>
              <p><strong>Không được bỏ công túa đi trước một mình!</strong></p>
              <p>Ai rời đi trước sẽ bị púng 3 cái nơi trán 🤭</p>
            </div>
          </div>
          <div className={`${styles.ruleCard} ${styles.ruleCardImportant}`}>
            <div className={styles.ruleNumber}>📅</div>
            <div className={styles.ruleContent}>
              <h3>Ngày quan trọng</h3>
              <p><strong>Ngày bà dì đến:</strong> Khoảng 14 hàng tháng</p>
              <p>Anh nhớ chăm sóc em đặc biệt những ngày này nhé!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
