// ==========================================
// MEMORIES PAGE - OPTIMIZED JAVASCRIPT
// Modern, Clean & Efficient Code
// ==========================================

// Global State
let memories = [];
let categories = {};
let currentPage = 1;
const memoriesPerPage = 6;
let currentFilter = "all";

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
    initializeMemoriesPage();
});

// Main Initialization Function
function initializeMemoriesPage() {
    loadMemories();
    setupEventListeners();
    initializeScrollToTop();
}

// Load memories from JSON
async function loadMemories() {
    try {
        showLoading();
        const response = await fetch('data/memories.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        memories = data.memories || [];
        categories = data.categories || {};
        
        renderMemories();
        updateFilterButtons();
        hideLoading();
    } catch (error) {
        console.error('Error loading memories:', error);
        showError('Không thể tải kỷ niệm. Vui lòng kiểm tra kết nối mạng.');
        hideLoading();
    }
}

// Update filter buttons with category data
function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]:not([data-filter="all"])');
    filterButtons.forEach(button => {
        const category = button.dataset.filter;
        if (categories[category]) {
            const icon = button.querySelector('i');
            const text = button.querySelector('.filter-text') || button;
            
            if (icon) {
                icon.className = categories[category].icon;
            }
            if (text) {
                text.textContent = categories[category].name;
            }
            
            // Add tooltip
            button.title = categories[category].description;
        }
    });
}

// Render memories to grid
function renderMemories() {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (!memoriesGrid) return;

    // Filter memories
    const filteredMemories = currentFilter === 'all' 
        ? memories 
        : memories.filter(memory => memory.category === currentFilter);

    // Paginate memories
    const startIndex = (currentPage - 1) * memoriesPerPage;
    const endIndex = startIndex + memoriesPerPage;
    const paginatedMemories = filteredMemories.slice(0, endIndex);

    // Clear grid if first page or filter changed
    if (currentPage === 1) {
        memoriesGrid.innerHTML = '';
    }

    // Show no memories message
    if (paginatedMemories.length === 0) {
        memoriesGrid.innerHTML = `
            <div class="no-memories">
                <i class="fas fa-heart"></i>
                <p>Chưa có kỷ niệm nào trong danh mục này</p>
            </div>
        `;
        return;
    }

    // Create and append memory cards
    paginatedMemories.slice(memoriesGrid.children.length).forEach((memory, index) => {
        const card = createMemoryCard(memory);
        card.style.animationDelay = `${index * 0.1}s`;
        memoriesGrid.appendChild(card);
    });

    // Update load more button
    updateLoadMoreButton(filteredMemories.length, paginatedMemories.length);
}

// Create memory card element
function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = `memory-card ${memory.mood || 'default'}`;
    card.addEventListener('click', () => openModal(memory));

    const formattedDate = formatDate(memory.date);
    const categoryIcon = getCategoryIcon(memory.category);
    const moodIcon = getMoodIcon(memory.mood);

    card.innerHTML = `
        <div class="card-header">
            <div class="card-date">${formattedDate}</div>
            <h3 class="card-title">${escapeHtml(memory.title)}</h3>
        </div>
        <div class="card-body">
            <p class="card-content">${escapeHtml(memory.content)}</p>
        </div>
        <div class="card-footer">
            <span class="card-category">
                <i class="${categoryIcon}"></i>
                ${getCategoryName(memory.category)}
            </span>
            <span class="card-mood">
                <i class="${moodIcon}"></i>
                ${memory.mood || 'Đặc biệt'}
            </span>
        </div>
    `;

    return card;
}

// Setup all event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }

    // Modal events
    setupModalEvents();
}

// Handle filter button clicks
function handleFilterClick(event) {
    const button = event.currentTarget;
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update filter and reset pagination
    currentFilter = button.dataset.filter;
    currentPage = 1;
    
    // Re-render memories
    renderMemories();
}

// Handle load more button click
function handleLoadMore() {
    currentPage++;
    renderMemories();
}

// Setup modal event listeners
function setupModalEvents() {
    const modal = document.getElementById('memoryModal');
    if (!modal) return;

    // Close modal events
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
}

// Open modal with memory details
function openModal(memory) {
    const modal = document.getElementById('memoryModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;

    const formattedDate = formatDate(memory.date);
    const categoryIcon = getCategoryIcon(memory.category);
    const moodIcon = getMoodIcon(memory.mood);

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${escapeHtml(memory.title)}</h2>
            <div class="modal-date">${formattedDate}</div>
        </div>
        <div class="modal-content-text">${escapeHtml(memory.content)}</div>
        <div class="modal-meta">
            <span class="card-category">
                <i class="${categoryIcon}"></i>
                ${getCategoryName(memory.category)}
            </span>
            <span class="card-mood">
                <i class="${moodIcon}"></i>
                ${memory.mood || 'Đặc biệt'}
            </span>
        </div>
    `;

    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('memoryModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Update load more button state
function updateLoadMoreButton(totalMemories, currentCount) {
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    if (loadMoreContainer) {
        loadMoreContainer.style.display = currentCount >= totalMemories ? 'none' : 'block';
    }
}

// Initialize scroll to top functionality
function initializeScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollBtn);

    // Throttled scroll handler for better performance
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const shouldShow = window.pageYOffset > 300;
                scrollBtn.classList.toggle('visible', shouldShow);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Show loading state
function showLoading() {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (memoriesGrid) {
        memoriesGrid.innerHTML = '<div class="loading"></div>';
    }
}

// Hide loading state
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Show error message
function showError(message) {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (memoriesGrid) {
        memoriesGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Format date to Vietnamese locale
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'milestone': 'fas fa-star',
        'dating': 'fas fa-heart',
        'daily': 'fas fa-calendar-day',
        'quotes': 'fas fa-quote-left',
        'funny': 'fas fa-laugh'
    };
    return icons[category] || 'fas fa-heart';
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'milestone': 'Cột mốc quan trọng',
        'dating': 'Hẹn hò',
        'daily': 'Hàng ngày',
        'quotes': 'Lời yêu thương',
        'funny': 'Hài hước'
    };
    return names[category] || 'Khác';
}

// Get mood icon
function getMoodIcon(mood) {
    const icons = {
        'romantic': 'fas fa-heart',
        'sweet': 'fas fa-candy-cane',
        'happy': 'fas fa-smile-beam',
        'excited': 'fas fa-star',
        'peaceful': 'fas fa-leaf',
        'joyful': 'fas fa-laugh',
        'content': 'fas fa-smile',
        'important': 'fas fa-exclamation-circle',
        'poetic': 'fas fa-feather-alt',
        'promise': 'fas fa-ring',
        'caring': 'fas fa-heart-pulse',
        'funny': 'fas fa-laugh-squint'
    };
    return icons[mood] || 'fas fa-heart';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
