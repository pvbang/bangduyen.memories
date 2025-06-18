// Global variables
let memories = [];
let currentPage = 1;
const memoriesPerPage = 6;
let currentFilter = 'all';

// Password for login
const CORRECT_PASSWORD = '23032025';

// Templates for different card layouts
const cardTemplates = ['classic', 'modern', 'romantic', 'minimalist', 'glass', 'neon', '3d', 'gradient'];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      switch(currentPage) {
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'memories.html':
            initMemoriesPage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
        case 'starmap.html':
            initStarmapPage();
            break;
    }
});

// Login Page Functions
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
              if (password === CORRECT_PASSWORD) {
                // Set authentication session
                sessionStorage.setItem('authenticated', 'true');
                // Show success animation
                showLoginSuccess();
                setTimeout(() => {
                    window.location.href = 'memories.html';
                }, 1000);
            } else {
                errorMessage.style.display = 'block';
                // Hide error after 3 seconds
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
}

function showLoginSuccess() {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.innerHTML = '<i class="fas fa-check"></i> Đang chuyển hướng...';
    loginBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
}

// Memories Page Functions
function initMemoriesPage() {
    loadMemories();
    setupFilters();
    setupLoadMore();
    setupHeaderToggle();
    initScrollToTop();
    initSearchBox();
    
    // Check authentication
    if (!checkAuthentication()) return;
    
    // Initialize enhanced features after a short delay
    setTimeout(() => {
        enhanceMemoryCards();
        initScrollAnimations();
    }, 500);
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Chào mừng bạn đến với kho kỷ niệm! 💕', 'success');
    }, 1000);
}

function checkAuthentication() {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
        // Redirect to login page
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function loadMemories() {
    // Load memories from JSON file
    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            memories = data.memories;
            displayMemories();
        })
        .catch(error => {
            console.error('Error loading memories:', error);
            // Fallback to sample data
            memories = getSampleMemories();
            displayMemories();
        });
}

function getSampleMemories() {
    return [
        {
            id: 1,
            title: "Ngày đầu tiên gặp nhau",
            date: "2023-02-14",
            category: "special",
            content: "Ngày Valentine năm ngoái, anh và em đã gặp nhau tại quán cà phê nhỏ. Đó là khoảnh khắc định mệnh khi ánh mắt chúng ta chạm nhau. Tim em đập thật nhanh và em biết rằng anh chính là người em đã chờ đợi bấy lâu.",
            mood: "romantic",
            template: "romantic",
            showImages: true,
            images: ['https://via.placeholder.com/300x200/ff9a9e/ffffff?text=First+Meet']
        },
        {
            id: 2,
            title: "Chuyến đi biển đầu tiên",
            date: "2023-05-20",
            category: "trip",
            content: "Chúng ta cùng nhau đi biển Nha Trang. Em nhớ mãi cảnh hoàng hôn tuyệt đẹp khi chúng ta nắm tay nhau đi dọc bờ biển. Sóng vỗ về và tiếng cười của chúng ta vang vọng trên bãi cát.",
            mood: "happy",
            template: "modern",
            showImages: true,
            images: ['https://via.placeholder.com/300x200/87ceeb/ffffff?text=Beach+Trip']
        },
        {
            id: 3,
            title: "Bữa cơm đầu tiên em nấu",
            date: "2023-03-15",
            category: "daily",
            content: "Em đã nấu bữa cơm đầu tiên cho anh. Tuy hơi mặn một chút nhưng anh vẫn ăn hết và khen ngon. Khoảnh khắc ấy em cảm thấy thật hạnh phúc và ấm áp.",
            mood: "sweet",
            template: "classic",
            showImages: false,
            images: []
        },
        {
            id: 4,
            title: "Sinh nhật lần thứ nhất bên nhau",
            date: "2023-08-10",
            category: "special",
            content: "Sinh nhật em năm ngoái, anh đã chuẩn bị một bữa tiệc nhỏ thật ý nghĩa. Chiếc bánh kem hình trái tim và những cây nến lung linh. Em đã khóc vì xúc động.",
            mood: "excited",
            template: "romantic",
            showImages: true,
            images: ['https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Birthday']
        },
        {
            id: 5,
            title: "Cùng nhau xem phim",
            date: "2023-11-25",
            category: "daily",
            content: "Tối thứ 7 chúng ta cùng xem phim tại rạp. Em đã khóc khi xem phim tình cảm và anh đã ôm em thật chặt. Đó là cảm giác an toàn và ấm áp nhất.",
            mood: "nostalgic",
            template: "minimalist",
            showImages: false,
            images: []
        },
        {
            id: 6,
            title: "Kỷ niệm 6 tháng yêu nhau",
            date: "2023-08-14",
            category: "anniversary",
            content: "6 tháng bên nhau, chúng ta đã trải qua nhiều kỷ niệm đẹp. Anh tặng em một chiếc nhẫn nhỏ xinh và hứa sẽ yêu em mãi mãi. Em tin vào lời hứa ấy.",
            mood: "romantic",
            template: "romantic",
            showImages: true,
            images: ['https://via.placeholder.com/300x200/ff69b4/ffffff?text=6+Months']
        }
    ];
}

function displayMemories() {
    const memoriesGrid = document.getElementById('memoriesGrid');
    if (!memoriesGrid) return;
    
    // Filter memories based on current filter
    let filteredMemories = memories;
    if (currentFilter !== 'all') {
        filteredMemories = memories.filter(memory => memory.category === currentFilter);
    }
    
    // Calculate memories to show
    const startIndex = 0;
    const endIndex = currentPage * memoriesPerPage;
    const memoriesToShow = filteredMemories.slice(startIndex, endIndex);
      // Clear grid with fade out animation
    const existingCards = memoriesGrid.querySelectorAll('.memory-card');
    existingCards.forEach((card, index) => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (card.parentNode) {
                card.remove();
            }
        }, 300);
    });
    
    // Add memories with enhanced staggered animation
    setTimeout(() => {
        memoriesToShow.forEach((memory, index) => {
            setTimeout(() => {
                const memoryCard = createMemoryCard(memory);
                memoriesGrid.appendChild(memoryCard);
                
                // Apply entrance animation
                setTimeout(() => {
                    memoryCard.style.opacity = '1';
                    memoryCard.style.transform = 'translateY(0)';
                }, 50);
            }, index * 150);
        });
    }, existingCards.length > 0 ? 400 : 0);
    
    // Update load more button
    updateLoadMoreButton(filteredMemories.length, endIndex);
}

function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = `memory-card template-${memory.template}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    card.onclick = () => openMemoryModal(memory);
      const imagesHTML = memory.showImages && memory.images.length > 0 
        ? `<div class="card-images">
             ${memory.images.map(img => `<img src="data/images/${img}" alt="Memory" class="card-image" onerror="this.src='https://via.placeholder.com/300x200/ff9a9e/ffffff?text=Memory'">`).join('')}
           </div>`
        : '';
    
    const categoryLabels = {
        'special': 'Đặc biệt',
        'daily': 'Hàng ngày',
        'anniversary': 'Kỷ niệm',
        'trip': 'Du lịch'
    };
    
    const moodEmojis = {
        'happy': '😊',
        'romantic': '💕',
        'nostalgic': '🌅',
        'sweet': '🍯',
        'excited': '🎉'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <h4 class="card-title">${memory.title}</h4>
            <div class="card-date">
                <i class="fas fa-calendar"></i>
                ${formatDate(memory.date)}
            </div>
            <span class="card-category">${categoryLabels[memory.category]}</span>
        </div>
        <div class="card-content">
            <p class="card-text">${truncateText(memory.content, 150)}</p>
            ${imagesHTML}
            <div class="card-mood">
                <span>${moodEmojis[memory.mood]} ${memory.mood}</span>
            </div>
        </div>
    `;
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filter and reset page
            currentFilter = this.dataset.filter;
            currentPage = 1;
            
            // Display filtered memories
            displayMemories();
        });
    });
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hideLoading = showLoadingSpinner(this);
            
            // Simulate loading delay for better UX
            setTimeout(() => {
                currentPage++;
                displayMemories();
                hideLoading();
                showToast('Đã tải thêm kỷ niệm! 📚');
            }, 800);
        });
    }
}

function updateLoadMoreButton(totalMemories, displayedMemories) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (displayedMemories >= totalMemories) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

function openMemoryModal(memory) {
    const modal = document.getElementById('memoryModal');
    const modalBody = document.getElementById('modalBody');
      const imagesHTML = memory.showImages && memory.images.length > 0 
        ? `<div class="modal-images">
             ${memory.images.map(img => `<img src="data/images/${img}" alt="Memory" style="width: 100%; border-radius: 10px; margin: 10px 0;" onerror="this.src='https://via.placeholder.com/400x300/ff9a9e/ffffff?text=Memory'">`).join('')}
           </div>`
        : '';
    
    const categoryLabels = {
        'special': 'Đặc biệt',
        'daily': 'Hàng ngày',
        'anniversary': 'Kỷ niệm',
        'trip': 'Du lịch'
    };
    
    const moodEmojis = {
        'happy': '😊',
        'romantic': '💕',
        'nostalgic': '🌅',
        'sweet': '🍯',
        'excited': '🎉'
    };
    
    modalBody.innerHTML = `
        <h2 style="color: #ff6b9d; margin-bottom: 15px;">${memory.title}</h2>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <span style="background: #ff6b9d; color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                <i class="fas fa-calendar"></i> ${formatDate(memory.date)}
            </span>
            <span style="background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                ${categoryLabels[memory.category]}
            </span>
            <span style="background: rgba(255, 107, 157, 0.1); color: #ff6b9d; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem;">
                ${moodEmojis[memory.mood]} ${memory.mood}
            </span>
        </div>
        ${imagesHTML}
        <p style="line-height: 1.8; color: #555; font-size: 1.1rem;">${memory.content}</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('memoryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Admin Page Functions
function initAdminPage() {
    // Check authentication first
    if (!checkAuthentication()) return;
    
    setupAdminForm();
    setupImageUpload();
    setupPreview();
    loadExistingMemories();
}

function setupAdminForm() {
    const form = document.getElementById('memoryForm');
    const showImagesCheckbox = document.getElementById('showImages');
    const imageUploadSection = document.getElementById('imageUploadSection');
    
    // Toggle image upload section
    if (showImagesCheckbox && imageUploadSection) {
        showImagesCheckbox.addEventListener('change', function() {
            imageUploadSection.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveMemory();
        });
    }
}

function setupImageUpload() {
    const imageInput = document.getElementById('images');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            const files = e.target.files;
            imagePreview.innerHTML = '';
            
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-image';
                        imagePreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }
}

function setupPreview() {
    const form = document.getElementById('memoryForm');
    const previewContainer = document.getElementById('previewContainer');
    
    if (form && previewContainer) {
        // Update preview when form changes
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', updatePreview);
        });
    }
}

function updatePreview() {
    const title = document.getElementById('title').value || 'Tiêu đề kỷ niệm';
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const category = document.getElementById('category').value || 'special';
    const content = document.getElementById('content').value || 'Nội dung kỷ niệm sẽ hiển thị tại đây...';
    const mood = document.getElementById('mood').value || 'happy';
    const template = document.getElementById('template').value || 'classic';
    const showImages = document.getElementById('showImages').checked;
    
    const previewContainer = document.getElementById('previewContainer');
    
    const categoryLabels = {
        'special': 'Đặc biệt',
        'daily': 'Hàng ngày',
        'anniversary': 'Kỷ niệm',
        'trip': 'Du lịch'
    };
    
    const moodEmojis = {
        'happy': '😊',
        'romantic': '💕',
        'nostalgic': '🌅',
        'sweet': '🍯',
        'excited': '🎉'
    };
    
    const imagesHTML = showImages 
        ? `<div class="card-images">
             <div style="background: #f0f0f0; height: 100px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #999;">
                 <i class="fas fa-image"></i> Hình ảnh sẽ hiển thị ở đây
             </div>
           </div>`
        : '';
    
    previewContainer.innerHTML = `
        <div class="memory-card template-${template} preview-card">
            <div class="card-header">
                <h4 class="card-title">${title}</h4>
                <div class="card-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(date)}
                </div>
                <span class="card-category">${categoryLabels[category]}</span>
            </div>
            <div class="card-content">
                <p class="card-text">${content}</p>
                ${imagesHTML}
                <div class="card-mood">
                    <span>${moodEmojis[mood]} ${mood}</span>
                </div>
            </div>
        </div>
    `;
}

function saveMemory() {
    // Get form data
    const formData = new FormData(document.getElementById('memoryForm'));
    const editingId = document.getElementById('memoryForm').dataset.editingId;
    
    // Handle image upload
    const imageFiles = document.getElementById('images').files;
    const imageNames = [];
    
    // In a real application, you would upload images to server
    // For now, we'll simulate with placeholder names
    for (let i = 0; i < imageFiles.length; i++) {
        const fileName = `memory_${Date.now()}_${i}.jpg`;
        imageNames.push(fileName);
        // Here you would typically upload the file to data/images/
    }
    
    // Create memory object
    const memory = {
        id: editingId ? parseInt(editingId) : Date.now(),
        title: formData.get('title'),
        date: formData.get('date'),
        category: formData.get('category'),
        content: formData.get('content'),
        mood: formData.get('mood'),
        template: formData.get('template') === 'random' ? getRandomTemplate() : formData.get('template'),
        showImages: formData.get('showImages') === 'on',
        images: formData.get('showImages') === 'on' ? imageNames : []
    };
    
    // Simulate saving to JSON file (in real app, send to server)
    console.log(editingId ? 'Updating memory:' : 'Saving new memory:', memory);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    document.getElementById('memoryForm').reset();
    document.getElementById('memoryForm').removeAttribute('data-editing-id');
    document.querySelector('.submit-btn').innerHTML = '<i class="fas fa-heart"></i> Lưu kỷ niệm <i class="fas fa-heart"></i>';
    document.getElementById('imageUploadSection').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
    updatePreview();
    
    // Reload admin memories list if it exists
    if (document.getElementById('adminMemoriesContainer')) {
        loadExistingMemories();
    }
}

function getRandomTemplate() {
    return cardTemplates[Math.floor(Math.random() * cardTemplates.length)];
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Admin CRUD Functions
function loadExistingMemories() {
    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            displayAdminMemories(data.memories);
        })
        .catch(error => {
            console.error('Error loading memories for admin:', error);
        });
}

function displayAdminMemories(memoriesList) {
    const adminMemoriesContainer = document.getElementById('adminMemoriesContainer');
    if (!adminMemoriesContainer) return;
    
    adminMemoriesContainer.innerHTML = memoriesList.map(memory => `
        <div class="admin-memory-card" data-id="${memory.id}">
            <div class="admin-card-header">
                <h4>${memory.title}</h4>
                <div class="admin-card-actions">
                    <button onclick="editMemory(${memory.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteMemory(${memory.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="admin-card-content">
                <p><strong>Ngày:</strong> ${formatDate(memory.date)}</p>
                <p><strong>Danh mục:</strong> ${memory.category}</p>
                <p><strong>Nội dung:</strong> ${truncateText(memory.content, 100)}</p>
            </div>
        </div>
    `).join('');
}

function editMemory(id) {
    fetch('data/memories.json')
        .then(response => response.json())
        .then(data => {
            const memory = data.memories.find(m => m.id === id);
            if (memory) {
                // Fill form with memory data
                document.getElementById('title').value = memory.title;
                document.getElementById('date').value = memory.date;
                document.getElementById('category').value = memory.category;
                document.getElementById('content').value = memory.content;
                document.getElementById('mood').value = memory.mood;
                document.getElementById('template').value = memory.template;
                document.getElementById('showImages').checked = memory.showImages;
                
                // Set editing mode
                document.getElementById('memoryForm').dataset.editingId = id;
                document.querySelector('.submit-btn').innerHTML = '<i class="fas fa-save"></i> Cập nhật kỷ niệm <i class="fas fa-save"></i>';
                
                // Show image upload section if needed
                if (memory.showImages) {
                    document.getElementById('imageUploadSection').style.display = 'block';
                }
                
                updatePreview();
            }
        });
}

function deleteMemory(id) {
    if (confirm('Bạn có chắc chắn muốn xóa kỷ niệm này không?')) {
        // In a real application, you would send a DELETE request to server
        // For now, we'll simulate the deletion
        fetch('data/memories.json')
            .then(response => response.json())
            .then(data => {
                data.memories = data.memories.filter(m => m.id !== id);
                // Simulate saving (in real app, send to server)
                console.log('Memory deleted:', id);
                showSuccessMessage('Đã xóa kỷ niệm thành công!');
                loadExistingMemories();
            })
            .catch(error => {
                console.error('Error deleting memory:', error);
                alert('Có lỗi xảy ra khi xóa kỷ niệm!');
            });
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #66bb6a);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Starmap Page Functions
function initStarmapPage() {
    // Check authentication first
    if (!checkAuthentication()) return;
    
    setupQuotesCarousel();
    animateCompatibilityScores();
}

let currentQuoteIndex = 0;
const quotes = [
    {
        text: "iuuu em cao hơn cả núi dài hơn cả sông, rộng hơn cả đất xanh hơn cả trời, bay ra vũ trụ giãn nở cùng vũ trụ vô hạnnnnn",
        author: "Bằng"
    },
    {
        text: "Nếu anh có thể cho em một khả năng đặc biệt trong cuộc đời này, anh sẽ cho em khả năng nhìn thấy chính mình qua đôi mắt của anh. Sau đó em sẽ nhận ra, em thật đặc biệt thế nào đối với anh.",
        author: "Bằng"
    },
    {
        text: "a vô tình bước vô cuộc đời e nma a cố tình ở lại đó chớ :)))",
        author: "Bằng"
    },
    {
        text: "nếu quá khứ của e là một chiếc bánh dở tệ thì a sẽ ăn hết rồi đền cho e một chiếc bánh ngon hơn",
        author: "Bằng"
    },
    {
        text: "Khôm được bỏ công túa đi trước một mình",
        author: "Lưu ý từ công túa"
    }
];

function setupQuotesCarousel() {
    const quotesCarousel = document.getElementById('quotesCarousel');
    if (!quotesCarousel) return;
    
    // Clear existing quotes and add from array
    quotesCarousel.innerHTML = quotes.map((quote, index) => `
        <div class="quote-card ${index === 0 ? 'active' : ''}">
            <p>"${quote.text}"</p>
            <span class="quote-author">- ${quote.author}</span>
        </div>
    `).join('');
    
    // Auto-rotate quotes every 5 seconds
    setInterval(() => {
        changeQuote(1);
    }, 5000);
}

function changeQuote(direction) {
    const quoteCards = document.querySelectorAll('.quote-card');
    if (quoteCards.length === 0) return;
    
    // Remove active class from current quote
    quoteCards[currentQuoteIndex].classList.remove('active');
    
    // Calculate new index
    currentQuoteIndex += direction;
    if (currentQuoteIndex >= quotes.length) {
        currentQuoteIndex = 0;
    } else if (currentQuoteIndex < 0) {
        currentQuoteIndex = quotes.length - 1;
    }
    
    // Add active class to new quote
    quoteCards[currentQuoteIndex].classList.add('active');
}

function animateCompatibilityScores() {
    const scoreElements = document.querySelectorAll('.aspect-score');
    scoreElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'pulse 1s ease-in-out';
        }, index * 200);
    });
}

// Header toggle functionality
function setupHeaderToggle() {
    const headerToggle = document.getElementById('headerToggle');
    const memoriesHeader = document.getElementById('memoriesHeader');
    
    if (headerToggle && memoriesHeader) {
        headerToggle.addEventListener('click', function() {
            memoriesHeader.classList.toggle('collapsed');
            const icon = headerToggle.querySelector('i');
            
            if (memoriesHeader.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
                headerToggle.style.transform = 'rotate(180deg)';
            } else {
                icon.className = 'fas fa-chevron-up';
                headerToggle.style.transform = 'rotate(0deg)';
            }
        });
        
        // Auto-collapse on scroll down, expand on scroll up
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                memoriesHeader.classList.add('collapsed');
                headerToggle.querySelector('i').className = 'fas fa-chevron-down';
                headerToggle.style.transform = 'rotate(180deg)';
            } else if (scrollTop < lastScrollTop) {
                // Scrolling up
                memoriesHeader.classList.remove('collapsed');
                headerToggle.querySelector('i').className = 'fas fa-chevron-up';
                headerToggle.style.transform = 'rotate(0deg)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Enhanced UI Functions for better user experience

// Scroll to top button functionality
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" 
               style="color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#ff9800'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Enhanced memory card animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all memory cards
    document.querySelectorAll('.memory-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Enhanced loading states
function showLoadingSpinner(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading-spinner"></span> Đang tải...';
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Enhanced memory card interactions
function enhanceMemoryCards() {
    document.querySelectorAll('.memory-card').forEach(card => {
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add double-click to favorite
        let clickCount = 0;
        card.addEventListener('click', function() {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 2) {
                    toggleFavorite(this);
                }
                clickCount = 0;
            }, 300);
        });
    });
}

// Favorite functionality
function toggleFavorite(card) {
    const heartIcon = card.querySelector('.favorite-heart') || createFavoriteHeart();
    if (!card.querySelector('.favorite-heart')) {
        card.querySelector('.card-header').appendChild(heartIcon);
    }
    
    heartIcon.classList.toggle('active');
    
    if (heartIcon.classList.contains('active')) {
        showToast('Đã thêm vào yêu thích! 💖');
        heartIcon.style.color = '#ff6b9d';
        heartIcon.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        showToast('Đã xóa khỏi yêu thích');
        heartIcon.style.color = '#ccc';
        heartIcon.innerHTML = '<i class="far fa-heart"></i>';
    }
}

function createFavoriteHeart() {
    const heart = document.createElement('div');
    heart.className = 'favorite-heart';
    heart.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        font-size: 1.2rem;
        color: #ccc;
        transition: all 0.3s ease;
        z-index: 10;
    `;
    heart.innerHTML = '<i class="far fa-heart"></i>';
    return heart;
}

// Enhanced search functionality
function initSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        position: relative;
        max-width: 300px;
        margin: 0 auto 20px;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Tìm kiếm kỷ niệm...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 2px solid #ff6b9d;
        border-radius: 25px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    `;
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #ff6b9d;
        pointer-events: none;
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);
    
    // Insert search box before filters
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer);
    }
    
    // Add search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchMemories(e.target.value);
        }, 300);
    });
}

function searchMemories(query) {
    const cards = document.querySelectorAll('.memory-card');
    const searchTerm = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const text = card.querySelector('.card-text').textContent.toLowerCase();
        const isVisible = title.includes(searchTerm) || text.includes(searchTerm);
        
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (isVisible) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.display = 'block';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Show/hide no results message
    const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
    let noResultsMsg = document.querySelector('.no-results');
    
    if (visibleCards.length === 0 && query.trim() !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.cssText = `
                text-align: center;
                padding: 60px 20px;
                color: #666;
                font-size: 1.1rem;
            `;
            noResultsMsg.innerHTML = `
                <i class="fas fa-search" style="font-size: 3rem; color: #ff6b9d; margin-bottom: 20px; display: block;"></i>
                <p>Không tìm thấy kỷ niệm nào với từ khóa "<strong>${query}</strong>"</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #999;">Hãy thử tìm kiếm với từ khóa khác</p>
            `;
            document.querySelector('.memories-grid').appendChild(noResultsMsg);
        } else {
            noResultsMsg.querySelector('strong').textContent = query;
            noResultsMsg.style.display = 'block';
        }
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Utility Functions
function addHeartAnimation() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        setTimeout(() => {
            heart.style.animationDelay = Math.random() * 6 + 's';
        }, index * 100);
    });
}

// Initialize heart animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addHeartAnimation, 1000);
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('memoryModal');
    if (modal && e.target === modal.querySelector('.modal-overlay')) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeSuccessModal();
    }
});

// Smooth scroll for better UX
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
});

// Session management (simplified)
if (window.location.pathname.includes('memories.html') || window.location.pathname.includes('admin.html')) {
    sessionStorage.setItem('authenticated', 'true');
}

// Logout function
function logout() {
    // Clear authentication session
    sessionStorage.removeItem('authenticated');
    // Redirect to login page
    window.location.href = 'index.html';
}
