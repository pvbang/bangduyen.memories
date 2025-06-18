// Global variables
let memories = [];
let currentPage = 1;
const memoriesPerPage = 6;
let currentFilter = "all";

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    initMemoriesPage();
});

// Memories Page Functions
function initMemoriesPage() {
    loadMemories();
    setupFilters();
    setupLoadMore();
    setupHeaderToggle();
    initScrollToTop();
}

// Load memories from JSON file
async function loadMemories() {
    try {
        const response = await fetch('data/memories.json');
        const data = await response.json();
        memories = data.memories || [];
        renderMemories();
    } catch (error) {
        console.error('Error loading memories:', error);
        showError('Không thể tải kỷ niệm. Vui lòng thử lại sau.');
    }
}

// Render memories to the grid
function renderMemories() {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (!memoriesGrid) return;

    memoriesGrid.innerHTML = '';
    
    // Filter memories based on current filter
    const filteredMemories = currentFilter === 'all' 
        ? memories 
        : memories.filter(memory => memory.category === currentFilter);

    // Paginate memories
    const startIndex = (currentPage - 1) * memoriesPerPage;
    const endIndex = startIndex + memoriesPerPage;
    const paginatedMemories = filteredMemories.slice(0, endIndex);

    if (paginatedMemories.length === 0) {
        memoriesGrid.innerHTML = '<div class="no-memories">Chưa có kỷ niệm nào trong danh mục này</div>';
        return;
    }

    paginatedMemories.forEach((memory, index) => {
        const card = createMemoryCard(memory);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        memoriesGrid.appendChild(card);
    });

    // Update load more button
    updateLoadMoreButton(filteredMemories.length, endIndex);
}

// Create memory card element
function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = `memory-card ${memory.mood || ''}`;
    card.onclick = () => openModal(memory);

    const formattedDate = formatDate(memory.date);
    const categoryIcon = getCategoryIcon(memory.category);
    const moodIcon = getMoodIcon(memory.mood);

    card.innerHTML = `
        <div class="card-header">
            <div class="card-date">${formattedDate}</div>
            <h3 class="card-title">${memory.title}</h3>
        </div>
        <div class="card-body">
            <p class="card-content">${memory.content}</p>
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
            <h2 class="modal-title">${memory.title}</h2>
            <div class="modal-date">${formattedDate}</div>
        </div>
        <div class="modal-content-text">${memory.content}</div>
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

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('memoryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current filter
            currentFilter = button.dataset.filter;
            currentPage = 1; // Reset to first page
            
            // Re-render memories
            renderMemories();
        });
    });
}

// Setup load more button
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderMemories();
        });
    }
}

// Update load more button visibility
function updateLoadMoreButton(totalMemories, currentCount) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    if (loadMoreBtn && loadMoreContainer) {
        if (currentCount >= totalMemories) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }
}

// Setup header toggle for mobile
function setupHeaderToggle() {
    const headerToggle = document.getElementById('headerToggle');
    const header = document.getElementById('memoriesHeader');
    
    if (headerToggle && header) {
        headerToggle.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            const icon = headerToggle.querySelector('i');
            if (header.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
            } else {
                icon.className = 'fas fa-chevron-up';
            }
        });
    }
}

// Initialize scroll to top button
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(scrollBtn);

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('vi-VN', options);
}

function getCategoryIcon(category) {
    const icons = {
        'special': 'fas fa-star',
        'daily': 'fas fa-calendar-day',
        'travel': 'fas fa-plane',
        'celebration': 'fas fa-birthday-cake'
    };
    return icons[category] || 'fas fa-heart';
}

function getCategoryName(category) {
    const names = {
        'special': 'Đặc biệt',
        'daily': 'Hàng ngày',
        'travel': 'Du lịch',
        'celebration': 'Kỷ niệm'
    };
    return names[category] || 'Khác';
}

function getMoodIcon(mood) {
    const icons = {
        'romantic': 'fas fa-heart',
        'sweet': 'fas fa-candy-cane',
        'happy': 'fas fa-smile',
        'excited': 'fas fa-star',
        'peaceful': 'fas fa-leaf'
    };
    return icons[mood] || 'fas fa-heart';
}

function showError(message) {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (memoriesGrid) {
        memoriesGrid.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('memoryModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
