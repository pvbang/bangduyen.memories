// Global variables
let memories = [];
let currentPage = 1;
const memoriesPerPage = 6;
let currentFilter = "all";

// Password for login
const CORRECT_PASSWORD = "23032025";

// Templates for different card layouts
const cardTemplates = [
  "classic",
  "modern",
  "romantic",
  "minimalist",
  "glass",
  "neon",
  "3d",
  "gradient",
];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  switch (currentPage) {
    case "index.html":
    case "":
      initLoginPage();
      break;
    case "memories.html":
      initMemoriesPage();
      break;
    case "admin.html":
      initAdminPage();
      break;
    case "starmap.html":
      initStarmapPage();
      break;
  }
});

// Login Page Functions
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const password = document.getElementById("password").value;
      if (password === CORRECT_PASSWORD) {
        // Set authentication session
        sessionStorage.setItem("authenticated", "true");
        // Show success animation
        showLoginSuccess();
        setTimeout(() => {
          window.location.href = "memories.html";
        }, 1000);
      } else {
        errorMessage.style.display = "block";
        // Hide error after 3 seconds
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 3000);
      }
    });
  }
}

function showLoginSuccess() {
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.innerHTML = '<i class="fas fa-check"></i> Đang chuyển hướng...';
  loginBtn.style.background = "linear-gradient(135deg, #4caf50, #66bb6a)";
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
    showToast("Chào mừng bạn đến với kho kỷ niệm! 💕", "success");
  }, 1000);
}

function checkAuthentication() {
  // Check if user is authenticated
  const isAuthenticated = sessionStorage.getItem("authenticated");
  if (!isAuthenticated || isAuthenticated !== "true") {
    // Redirect to login page
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function loadMemories() {
  // Load memories from JSON file
  fetch("data/memories.json")
    .then((response) => response.json())
    .then((data) => {
      memories = data.memories;
      displayMemories();
    })
    .catch((error) => {
      console.error("Error loading memories:", error);
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
      content:
        "Ngày Valentine năm ngoái, anh và em đã gặp nhau tại quán cà phê nhỏ. Đó là khoảnh khắc định mệnh khi ánh mắt chúng ta chạm nhau. Tim em đập thật nhanh và em biết rằng anh chính là người em đã chờ đợi bấy lâu.",
      mood: "romantic",
      template: "romantic",
      showImages: true,
      images: [
        "https://via.placeholder.com/300x200/ff9a9e/ffffff?text=First+Meet",
      ],
    },
    {
      id: 2,
      title: "Chuyến đi biển đầu tiên",
      date: "2023-05-20",
      category: "trip",
      content:
        "Chúng ta cùng nhau đi biển Nha Trang. Em nhớ mãi cảnh hoàng hôn tuyệt đẹp khi chúng ta nắm tay nhau đi dọc bờ biển. Sóng vỗ về và tiếng cười của chúng ta vang vọng trên bãi cát.",
      mood: "happy",
      template: "modern",
      showImages: true,
      images: [
        "https://via.placeholder.com/300x200/87ceeb/ffffff?text=Beach+Trip",
      ],
    },
    {
      id: 3,
      title: "Bữa cơm đầu tiên em nấu",
      date: "2023-03-15",
      category: "daily",
      content:
        "Em đã nấu bữa cơm đầu tiên cho anh. Tuy hơi mặn một chút nhưng anh vẫn ăn hết và khen ngon. Khoảnh khắc ấy em cảm thấy thật hạnh phúc và ấm áp.",
      mood: "sweet",
      template: "classic",
      showImages: false,
      images: [],
    },
    {
      id: 4,
      title: "Sinh nhật lần thứ nhất bên nhau",
      date: "2023-08-10",
      category: "special",
      content:
        "Sinh nhật em năm ngoái, anh đã chuẩn bị một bữa tiệc nhỏ thật ý nghĩa. Chiếc bánh kem hình trái tim và những cây nến lung linh. Em đã khóc vì xúc động.",
      mood: "excited",
      template: "romantic",
      showImages: true,
      images: [
        "https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Birthday",
      ],
    },
    {
      id: 5,
      title: "Cùng nhau xem phim",
      date: "2023-11-25",
      category: "daily",
      content:
        "Tối thứ 7 chúng ta cùng xem phim tại rạp. Em đã khóc khi xem phim tình cảm và anh đã ôm em thật chặt. Đó là cảm giác an toàn và ấm áp nhất.",
      mood: "nostalgic",
      template: "minimalist",
      showImages: false,
      images: [],
    },
    {
      id: 6,
      title: "Kỷ niệm 6 tháng yêu nhau",
      date: "2023-08-14",
      category: "anniversary",
      content:
        "6 tháng bên nhau, chúng ta đã trải qua nhiều kỷ niệm đẹp. Anh tặng em một chiếc nhẫn nhỏ xinh và hứa sẽ yêu em mãi mãi. Em tin vào lời hứa ấy.",
      mood: "romantic",
      template: "romantic",
      showImages: true,
      images: [
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=6+Months",
      ],
    },
  ];
}

function displayMemories() {
  const memoriesGrid = document.getElementById("memoriesGrid");
  if (!memoriesGrid) return;

  // Filter memories based on current filter
  let filteredMemories = memories;
  if (currentFilter !== "all") {
    filteredMemories = memories.filter(
      (memory) => memory.category === currentFilter
    );
  }

  // Calculate memories to show
  const startIndex = 0;
  const endIndex = currentPage * memoriesPerPage;
  const memoriesToShow = filteredMemories.slice(startIndex, endIndex);
  // Clear grid with fade out animation
  const existingCards = memoriesGrid.querySelectorAll(".memory-card");
  existingCards.forEach((card, index) => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "translateY(-20px)";
    setTimeout(() => {
      if (card.parentNode) {
        card.remove();
      }
    }, 300);
  });

  // Add memories with enhanced staggered animation
  setTimeout(
    () => {
      memoriesToShow.forEach((memory, index) => {
        setTimeout(() => {
          const memoryCard = createMemoryCard(memory);
          memoriesGrid.appendChild(memoryCard);

          // Apply entrance animation
          setTimeout(() => {
            memoryCard.style.opacity = "1";
            memoryCard.style.transform = "translateY(0)";
          }, 50);
        }, index * 150);
      });
    },
    existingCards.length > 0 ? 400 : 0
  );

  // Update load more button
  updateLoadMoreButton(filteredMemories.length, endIndex);
}

function createMemoryCard(memory) {
  const card = document.createElement("div");
  card.className = `memory-card template-${memory.template}`;
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  card.onclick = () => openMemoryModal(memory);
  const imagesHTML =
    memory.showImages && memory.images.length > 0
      ? `<div class="card-images">
             ${memory.images
               .map(
                 (img) =>
                   `<img src="data/images/${img}" alt="Memory" class="card-image" onerror="this.src='https://via.placeholder.com/300x200/ff9a9e/ffffff?text=Memory'">`
               )
               .join("")}
           </div>`
      : "";

  const categoryLabels = {
    special: "Đặc biệt",
    daily: "Hàng ngày",
    anniversary: "Kỷ niệm",
    trip: "Du lịch",
  };

  const moodEmojis = {
    happy: "😊",
    romantic: "💕",
    nostalgic: "🌅",
    sweet: "🍯",
    excited: "🎉",
  };

  card.innerHTML = `
        <div class="card-header">
            <h4 class="card-title">${memory.title}</h4>
            <div class="card-date">
                <i class="fas fa-calendar"></i>
                ${formatDate(memory.date)}
            </div>
            <span class="card-category">${
              categoryLabels[memory.category]
            }</span>
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
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active filter
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Update current filter and reset page
      currentFilter = this.dataset.filter;
      currentPage = 1;

      // Display filtered memories
      displayMemories();
    });
  });
}

function setupLoadMore() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      const hideLoading = showLoadingSpinner(this);

      // Simulate loading delay for better UX
      setTimeout(() => {
        currentPage++;
        displayMemories();
        hideLoading();
        showToast("Đã tải thêm kỷ niệm! 📚");
      }, 800);
    });
  }
}

function updateLoadMoreButton(totalMemories, displayedMemories) {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    if (displayedMemories >= totalMemories) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-flex";
    }
  }
}

function openMemoryModal(memory) {
  const modal = document.getElementById("memoryModal");
  const modalBody = document.getElementById("modalBody");
  const imagesHTML =
    memory.showImages && memory.images.length > 0
      ? `<div class="modal-images">
             ${memory.images
               .map(
                 (img) =>
                   `<img src="data/images/${img}" alt="Memory" style="width: 100%; border-radius: 10px; margin: 10px 0;" onerror="this.src='https://via.placeholder.com/400x300/ff9a9e/ffffff?text=Memory'">`
               )
               .join("")}
           </div>`
      : "";

  const categoryLabels = {
    special: "Đặc biệt",
    daily: "Hàng ngày",
    anniversary: "Kỷ niệm",
    trip: "Du lịch",
  };

  const moodEmojis = {
    happy: "😊",
    romantic: "💕",
    nostalgic: "🌅",
    sweet: "🍯",
    excited: "🎉",
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
        <p style="line-height: 1.8; color: #555; font-size: 1.1rem;">${
          memory.content
        }</p>
    `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("memoryModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Admin Page Functions
function initAdminPage() {
  loadMemoriesForAdmin();
  setupFormInteractions();
  setupImageUpload();
  setupPreview();
  setupSmoothScrolling();
  setupSearch();
  updateStats();
}

function loadMemoriesForAdmin() {
  // Try to load from JSON file first
  fetch('data/memories.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Cannot load memories.json');
      }
      return response.json();
    })
    .then(data => {
      if (data.memories && Array.isArray(data.memories)) {
        memories = data.memories;
        // Also sync with localStorage for offline access
        localStorage.setItem("memoriesData", JSON.stringify(memories));
      } else {
        throw new Error('Invalid data structure in memories.json');
      }
      displayAdminMemories(memories);
      updateStats();
    })
    .catch(error => {
      console.log('Loading from JSON failed, trying localStorage:', error);
      // Fallback to localStorage
      const savedMemories = localStorage.getItem("memoriesData");
      if (savedMemories) {
        try {
          memories = JSON.parse(savedMemories);
          displayAdminMemories(memories);
          updateStats();
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
          memories = [];
          displayAdminMemories(memories);
          updateStats();
        }
      } else {
        memories = [];
        displayAdminMemories(memories);
        updateStats();
      }
    });
}

function displayAdminMemories(memoriesToShow = memories) {
  const container = document.getElementById("adminMemoriesContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  
  if (!container) return;
  
  // Show loading
  if (loadingSpinner) {
    loadingSpinner.style.display = "flex";
  }
  
  setTimeout(() => {
    if (memoriesToShow.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-heart-broken"></i>
          </div>
          <h3>Chưa có kỷ niệm nào</h3>
          <p>Hãy thêm kỷ niệm đầu tiên của chúng ta!</p>
          <a href="#form" class="add-memory-btn">
            <i class="fas fa-plus"></i>
            Thêm kỷ niệm
          </a>
        </div>
      `;
    } else {
      container.innerHTML = memoriesToShow
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(memory => createAdminMemoryCard(memory))
        .join("");
    }
    
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }
  }, 500);
}

function createAdminMemoryCard(memory) {
  const date = new Date(memory.date);
  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
  
  const categoryIcon = getCategoryIcon(memory.category);
  const moodIcon = getMoodIcon(memory.mood);
  
  return `
    <div class="admin-memory-card" data-id="${memory.id}">
      <div class="admin-card-header">
        <div class="admin-card-category ${memory.category}">
          ${categoryIcon} ${getCategoryName(memory.category)}
        </div>
        <div class="admin-card-actions">
          <button class="action-btn edit-btn" onclick="editMemory('${memory.id}')" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" onclick="deleteMemory('${memory.id}')" title="Xóa">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      
      <div class="admin-card-content">
        <h4 class="admin-card-title">${memory.title}</h4>
        <div class="admin-card-date">
          <i class="fas fa-calendar-alt"></i>
          ${formattedDate}
        </div>
        
        <p class="admin-card-text">${memory.content.length > 100 ? 
          memory.content.substring(0, 100) + '...' : 
          memory.content}</p>
        
        ${memory.images && memory.images.length > 0 ? `
          <div class="admin-card-images">
            <div class="image-count">
              <i class="fas fa-images"></i>
              ${memory.images.length} ảnh
            </div>
          </div>
        ` : ''}
        
        <div class="admin-card-footer">
          <div class="admin-card-mood">
            ${moodIcon} ${getMoodName(memory.mood)}
          </div>
          <div class="admin-card-template">
            <i class="fas fa-palette"></i>
            ${memory.template || 'Ngẫu nhiên'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function editMemory(memoryId) {
  const memory = memories.find(m => m.id === memoryId);
  if (!memory) return;
  
  // Fill form with memory data
  document.getElementById('title').value = memory.title;
  document.getElementById('date').value = memory.date;
  document.getElementById('category').value = memory.category;
  document.getElementById('content').value = memory.content;
  document.getElementById('template').value = memory.template || 'random';
  document.getElementById('mood').value = memory.mood || 'happy';
  
  if (memory.images && memory.images.length > 0) {
    document.getElementById('showImages').checked = true;
    document.getElementById('imageUploadSection').style.display = 'block';
    
    // Show existing images in preview
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = memory.images.map((image, index) => `
      <div class="preview-image">
        <img src="${image}" alt="Memory image ${index + 1}">
        <button type="button" class="remove-btn" onclick="removeImage(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
  
  // Store editing memory ID
  document.getElementById('memoryForm').dataset.editingId = memoryId;
  
  // Scroll to form
  document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
  
  // Change submit button text
  const submitBtn = document.querySelector('.submit-btn span');
  if (submitBtn) {
    submitBtn.textContent = 'Cập nhật kỷ niệm';
  }
}

function deleteMemory(memoryId) {
  if (confirm('Bạn có chắc chắn muốn xóa kỷ niệm này không?')) {
    memories = memories.filter(m => m.id !== memoryId);
    localStorage.setItem("memoriesData", JSON.stringify(memories));
    displayAdminMemories(memories);
    updateStats();
    
    // Show success message
    showNotification('Đã xóa kỷ niệm thành công!', 'success');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function setupFormInteractions() {
  const showImagesCheckbox = document.getElementById("showImages");
  const imageUploadSection = document.getElementById("imageUploadSection");
  const form = document.getElementById("memoryForm");

  // Toggle image upload section
  if (showImagesCheckbox && imageUploadSection) {
    showImagesCheckbox.addEventListener("change", function () {
      if (this.checked) {
        imageUploadSection.style.display = "block";
        imageUploadSection.style.animation = "slideDown 0.3s ease-out";
      } else {
        imageUploadSection.style.display = "none";
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      saveMemory(e);
    });
  }

  // Real-time form validation
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("input", validateField);
    input.addEventListener("blur", validateField);
  });
}

function setupImageUpload() {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("images");
  const imagePreview = document.getElementById("imagePreview");

  if (!uploadArea || !fileInput) return;

  // Click to upload
  uploadArea.addEventListener("click", () => fileInput.click());

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("drag-over");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("drag-over");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    imagePreview.innerHTML = "";
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewDiv = document.createElement("div");
          previewDiv.className = "preview-image";
          previewDiv.innerHTML = `
            <img src="${e.target.result}" alt="Preview ${index + 1}">
            <button type="button" class="remove-btn" onclick="removeImage(this)">
              <i class="fas fa-times"></i>
            </button>
          `;
          imagePreview.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function removeImage(button) {
  button.parentElement.remove();
}

function setupPreview() {
  const form = document.getElementById("memoryForm");
  const previewContainer = document.getElementById("previewContainer");

  if (!form || !previewContainer) return;

  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  function updatePreview() {
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;
    const mood = document.getElementById("mood").value;

    if (title || date || content) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString("vi-VN")
        : "";
      const categoryIcon = getCategoryIcon(category);
      const moodIcon = getMoodIcon(mood);

      previewContainer.innerHTML = `
        <div class="memory-card preview-card ${category} ${mood}">
          <div class="card-header">
            <div class="card-category">
              ${categoryIcon} ${category ? getCategoryName(category) : ""}
            </div>
            <div class="card-date">
              <i class="fas fa-calendar-alt"></i>
              ${formattedDate}
            </div>
          </div>
          <div class="card-content">
            <h4 class="card-title">${title || "Tiêu đề kỷ niệm"}</h4>
            <p class="card-text">${
              content || "Nội dung kỷ niệm sẽ hiển thị tại đây..."
            }</p>
            <div class="card-mood">
              ${moodIcon} ${mood ? getMoodName(mood) : ""}
            </div>
          </div>
        </div>
      `;
    }
  }
}

function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById("searchMemories");
  const filterSelect = document.getElementById("filterCategory");

  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterMemories, 300));
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", filterMemories);
  }
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const fieldName = field.name;

  // Remove existing error messages
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  field.classList.remove("error");

  let isValid = true;
  let errorMessage = "";

  // Validation rules
  switch (fieldName) {
    case "title":
      if (!value) {
        isValid = false;
        errorMessage = "Tiêu đề không được để trống";
      } else if (value.length < 5) {
        isValid = false;
        errorMessage = "Tiêu đề phải có ít nhất 5 ký tự";
      }
      break;
    case "date":
      if (!value) {
        isValid = false;
        errorMessage = "Vui lòng chọn ngày";
      }
      break;
    case "content":
      if (!value) {
        isValid = false;
        errorMessage = "Nội dung không được để trống";
      } else if (value.length < 10) {
        isValid = false;
        errorMessage = "Nội dung phải có ít nhất 10 ký tự";
      }
      break;
    case "category":
      if (!value) {
        isValid = false;
        errorMessage = "Vui lòng chọn loại kỷ niệm";
      }
      break;
  }

  if (!isValid) {
    field.classList.add("error");
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = errorMessage;
    field.parentNode.appendChild(errorDiv);
  }

  return isValid;
}

function filterMemories() {
  const searchTerm = document.getElementById("searchMemories").value.toLowerCase();
  const filterCategory = document.getElementById("filterCategory").value;

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchTerm) ||
      memory.content.toLowerCase().includes(searchTerm);
    const matchesCategory = !filterCategory || memory.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  displayAdminMemories(filteredMemories);
  updateStats(filteredMemories);
}

function updateStats(filteredMemories = memories) {
  const totalElement = document.getElementById("totalMemories");
  const specialElement = document.getElementById("specialMemories");
  const thisMonthElement = document.getElementById("thisMonth");

  if (totalElement) {
    totalElement.textContent = filteredMemories.length;
    animateNumber(totalElement, filteredMemories.length);
  }

  if (specialElement) {
    const specialCount = filteredMemories.filter(
      (m) => m.category === "special"
    ).length;
    specialElement.textContent = specialCount;
    animateNumber(specialElement, specialCount);
  }

  if (thisMonthElement) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = filteredMemories.filter((m) => {
      const memoryDate = new Date(m.date);
      return (
        memoryDate.getMonth() === currentMonth &&
        memoryDate.getFullYear() === currentYear
      );
    }).length;
    thisMonthElement.textContent = thisMonthCount;
    animateNumber(thisMonthElement, thisMonthCount);
  }
}

function animateNumber(element, targetNumber) {
  const startNumber = 0;
  const duration = 1000;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentNumber = Math.floor(
      startNumber + (targetNumber - startNumber) * progress
    );
    element.textContent = currentNumber;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

function getCategoryIcon(category) {
  const icons = {
    special: "✨",
    daily: "🌸",
    anniversary: "💕",
    trip: "🎒",
    milestone: "🎯",
  };
  return icons[category] || "💝";
}

function getCategoryName(category) {
  const names = {
    special: "Đặc biệt",
    daily: "Hàng ngày",
    anniversary: "Kỷ niệm",
    trip: "Du lịch",
    milestone: "Cột mốc",
  };
  return names[category] || category;
}

function getMoodIcon(mood) {
  const icons = {
    happy: "😊",
    romantic: "💕",
    nostalgic: "🌅",
    sweet: "🍯",
    excited: "🎉",
    peaceful: "🕊️",
  };
  return icons[mood] || "💝";
}

function getMoodName(mood) {
  const names = {
    happy: "Vui vẻ",
    romantic: "Lãng mạn",
    nostalgic: "Hoài niệm",
    sweet: "Ngọt ngào",
    excited: "Phấn khích",
    peaceful: "Yên bình",
  };
  return names[mood] || mood;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.add("show");

    // Auto close after 3 seconds
    setTimeout(() => {
      closeSuccessModal();
    }, 3000);
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// Add CSS for enhanced form validation
const additionalCSS = `
  .form-input.error {
    border-color: #e53e3e;
    background-color: rgba(229, 62, 62, 0.05);
  }
  
  .field-error {
    color: #e53e3e;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .field-error::before {
    content: "⚠️";
    font-size: 0.7rem;
  }
  
  .upload-area.drag-over {
    border-color: var(--primary-pink);
    background: rgba(255, 107, 157, 0.2);
    transform: scale(1.02);
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .memory-card.preview-card {
    border: 2px dashed var(--primary-pink);
    background: var(--gradient-soft);
  }
  
  .card-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--primary-pink);
    font-weight: 600;
  }
  
  .card-mood {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 107, 157, 0.1);
  }
`;

// Inject additional CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Enhanced UI Functions for better user experience

// Scroll to top button functionality
function initScrollToTop() {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.className = "scroll-to-top";
  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });
}

// Toast notification system
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }" 
               style="color: ${
                 type === "success"
                   ? "#4caf50"
                   : type === "error"
                   ? "#f44336"
                   : "#ff9800"
               }"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// Enhanced memory card animation on scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all memory cards
  document.querySelectorAll(".memory-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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
  document.querySelectorAll(".memory-card").forEach((card) => {
    // Add click animation
    card.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });

    // Add double-click to favorite
    let clickCount = 0;
    card.addEventListener("click", function () {
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
  const heartIcon =
    card.querySelector(".favorite-heart") || createFavoriteHeart();
  if (!card.querySelector(".favorite-heart")) {
    card.querySelector(".card-header").appendChild(heartIcon);
  }

  heartIcon.classList.toggle("active");

  if (heartIcon.classList.contains("active")) {
    showToast("Đã thêm vào yêu thích! 💖");
    heartIcon.style.color = "#ff6b9d";
    heartIcon.innerHTML = '<i class="fas fa-heart"></i>';
  } else {
    showToast("Đã xóa khỏi yêu thích");
    heartIcon.style.color = "#ccc";
    heartIcon.innerHTML = '<i class="far fa-heart"></i>';
  }
}

function createFavoriteHeart() {
  const heart = document.createElement("div");
  heart.className = "favorite-heart";
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
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  searchContainer.style.cssText = `
        position: relative;
        max-width: 300px;
        margin: 0 auto 20px;
    `;

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Tìm kiếm kỷ niệm...";
  searchInput.className = "search-input";
  searchInput.style.cssText = `
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 2px solid #ff6b9d;
        border-radius: 25px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    `;

  const searchIcon = document.createElement("i");
  searchIcon.className = "fas fa-search";
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
  const filtersContainer = document.querySelector(".filters");
  if (filtersContainer) {
    filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer);
  }

  // Add search functionality
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchMemories(e.target.value);
    }, 300);
  });
}

function searchMemories(query) {
  const cards = document.querySelectorAll(".memory-card");
  const searchTerm = query.toLowerCase();

  cards.forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const text = card.querySelector(".card-text").textContent.toLowerCase();
    const isVisible = title.includes(searchTerm) || text.includes(searchTerm);

    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    if (isVisible) {
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
      card.style.display = "block";
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";
      setTimeout(() => {
        if (card.style.opacity === "0") {
          card.style.display = "none";
        }
      }, 300);
    }
  });

  // Show/hide no results message
  const visibleCards = Array.from(cards).filter(
    (card) => card.style.display !== "none"
  );
  let noResultsMsg = document.querySelector(".no-results");

  if (visibleCards.length === 0 && query.trim() !== "") {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results";
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
      document.querySelector(".memories-grid").appendChild(noResultsMsg);
    } else {
      noResultsMsg.querySelector("strong").textContent = query;
      noResultsMsg.style.display = "block";
    }
  } else if (noResultsMsg) {
    noResultsMsg.style.display = "none";
  }
}

// Utility Functions
function addHeartAnimation() {
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((heart, index) => {
    setTimeout(() => {
      heart.style.animationDelay = Math.random() * 6 + "s";
    }, index * 100);
  });
}

// Initialize heart animation when page loads
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(addHeartAnimation, 1000);
});

// Close modal when clicking outside
document.addEventListener("click", function (e) {
  const modal = document.getElementById("memoryModal");
  if (modal && e.target === modal.querySelector(".modal-overlay")) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
    closeSuccessModal();
  }
});

// Smooth scroll for better UX
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
        html {
            scroll-behavior: smooth;
        }
    `;
  document.head.appendChild(style);
});

// Session management (simplified)
if (
  window.location.pathname.includes("memories.html") ||
  window.location.pathname.includes("admin.html")
) {
  sessionStorage.setItem("authenticated", "true");
}

// Logout function
function logout() {
  // Clear authentication session
  sessionStorage.removeItem("authenticated");
  // Redirect to login page
  window.location.href = "index.html";
}

function saveMemory(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  // Validate form
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    showNotification('Vui lòng kiểm tra lại thông tin!', 'error');
    return;
  }
  
  const title = formData.get('title');
  const date = formData.get('date');
  const category = formData.get('category');
  const content = formData.get('content');
  const template = formData.get('template') || 'random';
  const mood = formData.get('mood') || 'happy';
  const showImages = formData.get('showImages') === 'on';
  
  // Handle images
  let images = [];
  if (showImages) {
    const imagePreview = document.getElementById('imagePreview');
    const imageElements = imagePreview.querySelectorAll('img');
    images = Array.from(imageElements).map(img => img.src);
  }
  
  // Check if editing existing memory
  const editingId = form.dataset.editingId;
  
  const memoryData = {
    id: editingId || Date.now().toString(),
    title,
    date,
    category,
    content,
    template,
    mood,
    images: showImages ? images : [],
    createdAt: editingId ? memories.find(m => m.id === editingId)?.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (editingId) {
    // Update existing memory
    const index = memories.findIndex(m => m.id === editingId);
    if (index !== -1) {
      memories[index] = memoryData;
    }
    showNotification('Cập nhật kỷ niệm thành công!', 'success');
  } else {
    // Add new memory
    memories.push(memoryData);
    showNotification('Thêm kỷ niệm thành công!', 'success');
  }
    // Save to localStorage
  localStorage.setItem("memoriesData", JSON.stringify(memories));
  
  // For development: also provide download link for updated JSON
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    downloadUpdatedJSON();
  }
  
  // Reset form and UI
  form.reset();
  form.removeAttribute('data-editing-id');
  document.getElementById('imageUploadSection').style.display = 'none';
  document.getElementById('imagePreview').innerHTML = '';
  
  // Reset submit button text
  const submitBtn = document.querySelector('.submit-btn span');
  if (submitBtn) {
    submitBtn.textContent = 'Lưu kỷ niệm';
  }
  
  // Refresh admin display
  displayAdminMemories(memories);
  updateStats();
  
  // Reset preview
  const previewContainer = document.getElementById('previewContainer');
  if (previewContainer) {
    previewContainer.innerHTML = `
      <div class="memory-card preview-card">
        <div class="preview-placeholder">
          <i class="fas fa-magic"></i>
          <h4>Xem trước tại đây</h4>
          <p>Nhập thông tin bên trái để xem trước kỷ niệm</p>
        </div>
      </div>
    `;
  }
  
  // Show success modal
  showSuccessModal();
}
