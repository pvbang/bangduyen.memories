// Modern Gallery JavaScript
class ModernGallery {  constructor() {
    this.mediaItems = [];
    this.filteredItems = [];
    this.displayedItems = [];
    this.currentFilter = "all";
    this.currentView = this.getSavedViewMode() || "grid-2";
    this.currentLightboxIndex = 0;
    this.isSlideshow = false;
    this.slideshowInterval = null;
    this.itemsPerLoad = 30;
    this.currentPage = 0;
    this.isLoading = false;

    this.init();
    this.initNavigation();
  }

  getSavedViewMode() {
    try {
      return localStorage.getItem('galleryViewMode');
    } catch (error) {
      console.log('LocalStorage not available');
      return null;
    }
  }

  saveViewMode(viewMode) {
    try {
      localStorage.setItem('galleryViewMode', viewMode);
    } catch (error) {
      console.log('Unable to save view mode to localStorage');
    }
  }  async init() {
    this.showLoading();
    await this.loadMediaItems();
    this.bindEvents();
    this.initViewMode(); // Initialize saved view mode
    this.loadMoreItems(); // Load first batch
    this.updateStats();
    this.hideLoading();
  }

  initViewMode() {
    // Set the active button for the current view mode
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    
    const activeViewBtn = document.querySelector(`[data-view="${this.currentView}"]`);
    if (activeViewBtn) {
      activeViewBtn.classList.add("active");
    }
    
    // Set the gallery grid class
    const galleryGrid = document.getElementById("galleryGrid");
    if (galleryGrid) {
      galleryGrid.className = `gallery-grid ${this.currentView}`;
    }
  }
  initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
      
      // Close menu when clicking nav items
      navMenu.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  }

  async loadMediaItems() {
    try {
      // Load images from data/images/
      const imageItems = await this.loadImages();
      // Load videos from data/videos/
      const videoItems = await this.loadVideos();

      this.mediaItems = [...imageItems, ...videoItems];
      this.filteredItems = [...this.mediaItems];

      // Sort by date (newest first)
      this.mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error loading media items:", error);
    }
  }
  async loadImages() {
    const imageItems = [];

    try {
      // Gọi API để lấy danh sách file từ server
      console.log('Đang tải danh sách ảnh từ API...');
      const response = await fetch("api/get-media-files.php");

      if (response && response.ok) {
        const result = await response.json();
        
        if (result.success && result.data && result.data.images) {
          console.log(`Tìm thấy ${result.data.images.length} ảnh từ API`);
          
          result.data.images.forEach((imageData, index) => {
            const item = {
              id: `img_${index}`,
              type: "image",
              filename: imageData.filename,
              path: imageData.path,
              title: this.generateImageTitle(imageData.filename),
              date: new Date(imageData.modified * 1000), // Convert timestamp to Date
              description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
              size: imageData.size,
              extension: imageData.extension
            };
            imageItems.push(item);
          });
        } else {
          console.error("API không trả về dữ liệu hợp lệ:", result);
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh từ API:", error);
      console.log("Đang sử dụng phương pháp fallback...");
      
      // Fallback: Thử truy cập trực tiếp folder (có thể hoạt động với một số server)
      try {
        const response = await fetch("data/images/");
        if (response && response.ok) {
          const text = await response.text();
          const fileMatches = text.match(
            /<a[^>]*href="([^"]*\.(jpe?g|png|gif|webp))"[^>]*>/gi
          );

          if (fileMatches) {
            fileMatches.forEach((match, index) => {
              const filename = match.match(/href="([^"]*)"/i)[1];
              if (
                filename &&
                !filename.includes("..") &&
                !filename.startsWith("/")
              ) {
                const item = {
                  id: `img_${index}`,
                  type: "image",
                  filename: filename,
                  path: `data/images/${filename}`,
                  title: this.generateImageTitle(filename),
                  date: this.generateRandomDate(),
                  description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
                };
                imageItems.push(item);
              }
            });
          }
        }
      } catch (fallbackError) {
        console.error("Fallback cũng thất bại:", fallbackError);
        console.log("Vui lòng kiểm tra cấu hình server hoặc tạo API endpoint.");
      }
    }

    console.log(`Đã tải ${imageItems.length} ảnh`);
    return imageItems;
  }

  async loadVideos() {
    const videoItems = [];

    try {
      // Gọi API để lấy danh sách video từ server
      console.log('Đang tải danh sách video từ API...');
      const response = await fetch("api/get-media-files.php");

      if (response && response.ok) {
        const result = await response.json();
        
        if (result.success && result.data && result.data.videos) {
          console.log(`Tìm thấy ${result.data.videos.length} video từ API`);
          
          result.data.videos.forEach((videoData, index) => {
            const item = {
              id: `vid_${index}`,
              type: "video",
              filename: videoData.filename,
              path: videoData.path,
              title: this.generateVideoTitle(videoData.filename),
              date: new Date(videoData.modified * 1000), // Convert timestamp to Date
              description: "Một khoảnh khắc động trong kỷ niệm của chúng ta",
              size: videoData.size,
              extension: videoData.extension
            };
            videoItems.push(item);
          });
        } else {
          console.log("Không tìm thấy video nào từ API");
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Lỗi khi tải video từ API:", error);
      console.log("Video sẽ được hiển thị khi có file trong folder data/videos/");
    }

    console.log(`Đã tải ${videoItems.length} video`);
    return videoItems;
  }
  generateImageTitle(filename) {
    // Nếu filename có tiếng Việt có ý nghĩa, sử dụng nó
    const vietnameseNames = {
      "App quó chòi.jpg": "App quá chói 📱✨",
      "Chài chài ảnh hạnh phúc.jpg": "Chài chài ảnh hạnh phúc 😊",
      "Chân dài 2m.jpeg": "Chân dài 2m 👗",
      "Chân dài 2m1.jpeg": "Chân dài 2m1 👠",
      "Cái đồ đẹp chai này.jpg": "Cái đồ đẹp chai này 😍",
      "Công túa rất buồn...ngủ.jpg": "Công túa rất buồn...ngủ 😴👑",
      "Cổ tích quó.jpg": "Cổ tích quá 🧚‍♀️",
      "Dịu ka quó chài.jpg": "Dịu ka quá chài 🥰",
      "E hèm, thấy gòi nha.jpg": "E hèm, thấy rồi nha 👀",
      "Gian tình gian tình.jpg": "Gian tình gian tình 💕",
      "Hehehe chít anh với tui .jpg": "Hehehe chít anh với tui 😄",
      "Làm gì cũng đệp .jpg": "Làm gì cũng đẹp ✨",
      "Mlem mlem.jpeg": "Mlem mlem 😋",
      "Mít ướt.jpg": "Mít ướt 🥭",
      "Mặt tròn mặt chỉnh.jpg": "Mặt tròn mặt chỉnh 😊",
      "Mở 1 mắt.jpg": "Mở 1 mắt 😉",
      "Nhai đòu bây giờ.jpg": "Nhai đậu bây giờ 🥜",
      "Nhắm 1 mắt.jpeg": "Nhắm 1 mắt 😌",
      "Sao hay liếc quó.jpg": "Sao hay liếc quá 👁️",
      "Tay ai vị kè.jpg": "Tay ai vậy kia 🤚",
      "Tuân lệnh công chúa.jpg": "Tuân lệnh công chúa 👑",
      "Very hờn.jpg": "Very hờn 😤",
      "Very khó lói.jpg": "Very khó lòi 😅",
      "Và công túa chỉ có mình a thou.jpg":
        "Và công túa chỉ có mình anh thôi 👑💕",
      "Xinh gái 10đ.jpg": "Xinh gái 10 điểm 💯",
      "Êy nha êy nha.png": "Êy nha êy nha 😘",
      "Ô ô ô ô.jpg": "Ô ô ô ô 😮",
      "Ú òa, bác sĩ Bằng đem xoài cho ăn.jpeg":
      "Ú òa, bác sĩ Bằng đem xoài cho ăn 🥭👨‍⚕️",
      "Đã quó đã quó.jpg": "Đã quá đã quá 😍",
      "Đứng im chụp méng coi.jpg": "Đứng im chụp mình coi 📸",
      "Đứng im đứng im.jpg": "Đứng im đứng im 🤳",
      "Ối ối ối.jpg": "Ối ối ối 😲",
      "Ỷ đẹp trai đó.jpg": "Ỷ đẹp trai đó 😎",
    };

    if (vietnameseNames[filename]) {
      return vietnameseNames[filename];
    }

    // Nếu là ảnh IMG hoặc MEITU, tạo title dựa trên ngày
    if (filename.startsWith("IMG_") || filename.startsWith("MEITU_")) {
      const dateMatch = filename.match(/(\d{8})/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `Kỷ niệm ngày ${day}/${month}/${year} 📸`;
      }
      return filename.startsWith("MEITU_")
        ? "Ảnh đã chỉnh sửa ✨"
        : "Khoảnh khắc đẹp 📷";
    }

    // Nếu là ảnh Messenger
    if (filename.startsWith("Messenger_creation_")) {
      return "Kỷ niệm trên Messenger 💬";
    }

    // Các trường hợp khác
    const titles = [
      "Khoảnh khắc ngọt ngào 💕",
      "Nụ cười rạng rỡ 😊",
      "Hạnh phúc bên nhau 👫",
      "Yêu thương 💖",
      "Kỷ niệm đẹp ✨",
      "Tình iuuu 💝",
      "Iuuuu emmmmm 🥰",
    ];

    // Sử dụng hash của filename để chọn title nhất quán
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash + filename.charCodeAt(i)) & 0xffffffff;
    }
    return titles[Math.abs(hash) % titles.length];
  }

  generateVideoTitle(filename) {
    const baseName = filename.split(".")[0];
    const titles = [
      "Video kỷ niệm",
      "Khoảnh khắc động",
      "Hạnh phúc cùng nhau",
      "Tình yêu của chúng ta",
      "Kỷ niệm đẹp",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  generateRandomDate() {
    const start = new Date(2025, 1, 8); // Feb 8, 2025
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().split("T")[0];
  }
  bindEvents() {
    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.closest('.filter-btn').dataset.filter);
      });
    });

    // View buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setView(e.target.closest('.view-btn').dataset.view);
      });
    });    // Keyboard navigation for lightbox and view modes
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("lightboxModal").classList.contains("active")) {
        if (e.key === "Escape") {
          this.closeLightbox();
        } else if (e.key === "ArrowLeft") {
          this.prevMedia();
        } else if (e.key === "ArrowRight") {
          this.nextMedia();
        }
      } else {
        // View mode shortcuts (when not in lightbox)
        if (e.key >= '1' && e.key <= '7') {
          e.preventDefault();
          const viewModes = ['grid-large', 'grid-2', 'grid-3', 'grid-4', 'grid-compact', 'masonry', 'list'];
          const index = parseInt(e.key) - 1;
          if (index < viewModes.length) {
            this.setView(viewModes[index]);
          }
        }
        // Toggle between grid and list with spacebar
        else if (e.key === ' ' && !e.target.matches('input, textarea, button')) {
          e.preventDefault();
          const isListView = this.currentView === 'list';
          this.setView(isListView ? 'grid-2' : 'list');
        }
      }
    });
  }
  setFilter(filter) {
    this.currentFilter = filter;

    // Update button states
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

    // Filter items
    if (filter === "all") {
      this.filteredItems = [...this.mediaItems];
    } else {
      this.filteredItems = this.mediaItems.filter((item) => {
        if (filter === "images") return item.type === "image";
        if (filter === "videos") return item.type === "video";
        return true;
      });
    }

    // Reset pagination
    this.currentPage = 0;
    this.displayedItems = [];
    this.loadMoreItems();
  }setView(view) {
    this.currentView = view;
    this.saveViewMode(view); // Save user preference

    // Update button states  
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-view="${view}"]`).classList.add("active");

    // Show view mode indicator
    this.showViewModeIndicator(view);

    // Add loading state for smooth transition
    const galleryGrid = document.getElementById("galleryGrid");
    galleryGrid.classList.add('transitioning');

    // Update gallery grid class with delay for smooth transition
    setTimeout(() => {
      galleryGrid.className = `gallery-grid ${view}`;
      this.renderGallery();
      
      // Remove transitioning state
      setTimeout(() => {
        galleryGrid.classList.remove('transitioning');
      }, 100);
    }, 200);
  }

  showViewModeIndicator(view) {
    // Create indicator if it doesn't exist
    let indicator = document.getElementById('viewModeIndicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'viewModeIndicator';
      indicator.className = 'view-mode-indicator';
      document.body.appendChild(indicator);
    }

    // View mode names and icons
    const viewModes = {
      'grid-large': { name: 'Lưới lớn', icon: 'fas fa-th-large' },
      'grid-2': { name: '3 cột', icon: 'fas fa-th' },
      'grid-3': { name: '4 cột', icon: 'fas fa-border-all' },
      'grid-4': { name: '5 cột', icon: 'fas fa-grip-horizontal' },
      'grid-compact': { name: 'Thu gọn', icon: 'fas fa-grip-lines' },
      'masonry': { name: 'Masonry', icon: 'fas fa-grip-vertical' },
      'list': { name: 'Danh sách', icon: 'fas fa-list' }
    };

    const viewMode = viewModes[view] || { name: 'Không xác định', icon: 'fas fa-th' };
    
    indicator.innerHTML = `
      <i class="${viewMode.icon}"></i>
      <span>${viewMode.name}</span>
    `;

    // Show indicator
    indicator.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 2000);
  }

  startSlideshow() {
    if (this.filteredItems.length === 0) return;
    
    this.isSlideshow = true;
    this.currentLightboxIndex = 0;
    this.openLightbox(this.filteredItems[0]);
    
    // Auto-advance slideshow
    this.slideshowInterval = setInterval(() => {
      this.nextMedia();
    }, 4000);
    
    // Add slideshow indicator
    const lightbox = document.getElementById("lightbox");
    if (lightbox && !lightbox.querySelector('.slideshow-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'slideshow-indicator';
      indicator.innerHTML = `
        <div class="slideshow-controls">
          <button onclick="gallery.toggleSlideshow()" class="slideshow-toggle">
            <i class="fas fa-pause"></i>
          </button>
          <span class="slideshow-counter">1 / ${this.filteredItems.length}</span>
        </div>
      `;
      lightbox.querySelector('.lightbox-content').appendChild(indicator);
    }
  }

  stopSlideshow() {
    this.isSlideshow = false;
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    }
    
    // Remove slideshow indicator
    const indicator = document.querySelector('.slideshow-indicator');
    if (indicator) {
      indicator.remove();
    }
    
    this.closeLightbox();
  }

  toggleSlideshow() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
      document.querySelector('.slideshow-toggle i').className = 'fas fa-play';
    } else {
      this.slideshowInterval = setInterval(() => {
        this.nextMedia();
      }, 4000);
      document.querySelector('.slideshow-toggle i').className = 'fas fa-pause';
    }
  }
  // Enhanced render gallery with better animations
  renderGallery() {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;

    // Clear existing content
    galleryGrid.innerHTML = "";

    // Apply view class
    galleryGrid.className = `gallery-grid ${this.currentView}`;

    // Create gallery items with staggered animation
    this.displayedItems.forEach((item, index) => {
      const galleryItem = this.createGalleryItem(item);
      galleryItem.style.animationDelay = `${index * 0.1}s`;
      galleryItem.classList.add('gallery-item-entrance');
      galleryGrid.appendChild(galleryItem);
    });

    // Add load more button if there are more items
    this.addLoadMoreButton();

    // Update stats after rendering
    this.updateStats();

    // Add entrance animation styles if not exists
    if (!document.getElementById('gallery-entrance-style')) {
      const style = document.createElement('style');
      style.id = 'gallery-entrance-style';
      style.textContent = `
        .gallery-item-entrance {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          animation: galleryItemEntrance 0.6s ease-out forwards;
        }
        
        @keyframes galleryItemEntrance {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  loadMoreItems() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoading();

    const startIndex = this.currentPage * this.itemsPerLoad;
    const endIndex = startIndex + this.itemsPerLoad;
    const newItems = this.filteredItems.slice(startIndex, endIndex);

    // Add new items to displayed items
    this.displayedItems = [...this.displayedItems, ...newItems];
    this.currentPage++;

    // Simulate loading delay for better UX
    setTimeout(() => {
      this.renderGallery();
      this.hideLoading();
      this.isLoading = false;
    }, 500);
  }

  addLoadMoreButton() {
    const hasMoreItems = this.displayedItems.length < this.filteredItems.length;
    const existingButton = document.getElementById('loadMoreButton');
    
    if (existingButton) {
      existingButton.remove();
    }

    if (hasMoreItems) {
      const galleryGrid = document.getElementById("galleryGrid");
      const loadMoreButton = document.createElement('div');
      loadMoreButton.id = 'loadMoreButton';
      loadMoreButton.className = 'load-more-container';
      loadMoreButton.innerHTML = `
        <button class="load-more-btn" onclick="gallery.loadMoreItems()">
          <i class="fas fa-images"></i>
          <span>Xem thêm ảnh</span>
          <small>(${this.filteredItems.length - this.displayedItems.length} ảnh còn lại)</small>
        </button>
      `;
      galleryGrid.parentNode.insertBefore(loadMoreButton, galleryGrid.nextSibling);
    }
  }

  updateStats() {
    const totalImages = this.mediaItems.filter(item => item.type === 'image').length;
    const totalVideos = this.mediaItems.filter(item => item.type === 'video').length;
    const totalMemories = this.mediaItems.length;

    this.animateNumber('totalImages', totalImages);
    this.animateNumber('totalVideos', totalVideos);  
    this.animateNumber('totalMemories', totalMemories);
  }

  animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = Math.ceil(targetNumber / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(timer);
      }
      element.textContent = current;
    }, 50);
  }

  // Initialize dynamic background animations
  initDynamicBackground() {
    this.createFloatingHearts();
    this.createTechParticles();
    this.createGradientOrbs();
  }

  createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if (!heartsContainer) return;

    const heartSymbols = ['💖', '💕', '💗', '💝', '💓', '💘'];
    
    setInterval(() => {
      if(Math.random() < 0.7) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-element';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: 100%;
          font-size: ${20 + Math.random() * 15}px;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: floatUp ${8 + Math.random() * 7}s linear forwards;
        `;
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 15000);
      }
    }, 3000);

    // Add CSS for floating hearts animation
    if (!document.getElementById('floating-hearts-style')) {
      const style = document.createElement('style');
      style.id = 'floating-hearts-style';
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createTechParticles() {
    const particlesContainer = document.querySelector('.tech-particles');
    if (!particlesContainer) return;

    setInterval(() => {
      if(Math.random() < 0.4) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle-element';
        particle.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: 100%;
          width: ${2 + Math.random() * 3}px;
          height: ${2 + Math.random() * 3}px;
          background: #4a90e2;
          border-radius: 50%;
          box-shadow: 0 0 6px #4a90e2;
          opacity: 0;
          pointer-events: none;
          animation: techFloatUp ${15 + Math.random() * 10}s linear forwards;
        `;
        particlesContainer.appendChild(particle);

        setTimeout(() => particle.remove(), 25000);
      }
    }, 2000);

    // Add CSS for tech particles animation
    if (!document.getElementById('tech-particles-style')) {
      const style = document.createElement('style');
      style.id = 'tech-particles-style';
      style.textContent = `
        @keyframes techFloatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createGradientOrbs() {
    const orbsContainer = document.querySelector('.gradient-orbs');
    if (!orbsContainer) return;

    // Create additional floating orbs periodically
    setInterval(() => {
      if(Math.random() < 0.1) {
        const orb = document.createElement('div');
        orb.className = 'gradient-orb-element';
        orb.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${100 + Math.random() * 100}px;
          height: ${100 + Math.random() * 100}px;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: orbFloatAround ${20 + Math.random() * 15}s ease-in-out forwards;
        `;
        orbsContainer.appendChild(orb);

        setTimeout(() => orb.remove(), 35000);
      }
    }, 8000);

    // Add CSS for gradient orbs animation
    if (!document.getElementById('gradient-orbs-style')) {
      const style = document.createElement('style');
      style.id = 'gradient-orbs-style';
      style.textContent = `
        @keyframes orbFloatAround {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
            transform: translate(0, 0) scale(1);
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }  }  

  createGalleryItem(item, index) {
    const div = document.createElement("div");
    div.className = "gallery-item fade-in";
    div.dataset.type = item.type;
    
    // Check if current view is list mode
    const isListView = this.currentView === 'list';
    
    // Create media container
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "gallery-item-media";
    
    // Create content container for list view
    let contentContainer = null;
    if (isListView) {
      contentContainer = document.createElement("div");
      contentContainer.className = "gallery-item-content";
    }
    
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "gallery-item-overlay";
    
    // Create info section
    const infoSection = document.createElement("div");
    infoSection.className = "gallery-item-info";
    
    const title = document.createElement("div");
    title.className = "gallery-item-title";
    title.textContent = item.title;
    
    const date = document.createElement("div");
    date.className = "gallery-item-date";
    date.textContent = new Date(item.date).toLocaleDateString('vi-VN');
    
    infoSection.appendChild(title);
    infoSection.appendChild(date);
    
    // Add description for list view
    if (isListView && item.description) {
      const description = document.createElement("div");
      description.className = "gallery-item-description";
      description.textContent = item.description;
      infoSection.appendChild(description);
    }
    
    overlay.appendChild(infoSection);
    
    // Create type indicator
    const typeIndicator = document.createElement("div");
    typeIndicator.className = "gallery-item-type";
    
    // Create action buttons
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "gallery-item-actions";
    
    const favoriteBtn = document.createElement("button");
    favoriteBtn.className = "action-icon";
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    favoriteBtn.onclick = (e) => {
      e.stopPropagation();
      this.toggleFavorite(item.id);
    };
    
    const shareBtn = document.createElement("button");
    shareBtn.className = "action-icon";
    shareBtn.innerHTML = '<i class="fas fa-share"></i>';
    shareBtn.onclick = (e) => {
      e.stopPropagation();
      this.shareItem(item);
    };
    
    actionsContainer.appendChild(favoriteBtn);
    actionsContainer.appendChild(shareBtn);
    
    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.path;
      img.alt = item.title;
      img.loading = "lazy";
      
      img.onerror = () => {
        img.src = "data:image/svg+xml;base64,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9gHCP/fN89z2mT+e+CkABAAgAAABkOq1/0f7AO037QNsn/dvIBYAAgAQAIAAyMz0/88+QDx81VQX/uJWt2/tXwAIAEAAAALg1Sd/0jBGf98H6A1euA/w3g8qRQAIABAAgADIYQCkYe3/0T5Ap3/y7Gz3fe0/TT82AkAAgAAABIC7ft++D9B68h1h25M/hmABIAAAAQAIgFf4mLd9vXkf4HfvCHPuHwEACABAAORk7f/RPkDzp32A8GM3Oj3jLwIAEACAAHiddhYO0IcG6A5GfzfA9ty/d/0iAAABAAiAV6/9Z2XO+74PEMWhAcKPXW93Db4IAEAAAAIgJ+f+n7onuDdodvvW/hEAgAAABEBu1/5BAAACABAAxVr7BwEACABAALx97d8RGgSAAAAEAJD/AEjbu35BAAACABAA7zb9W/tHAAgAQAAABQmA7fRv7R8BIAAAAQDkPwCc/EEACABAAABFCYCltX8EgAAABABQkADwxE8EgAAABABQlADwxE8EgAAABABQlACw9o8AEACAAACKEgDW/hEAAgAQAECBAsDaPwJAAAACAChEAGzX/g2FCAABAAgAIP8B4Nw/AkAAAAIAKEoAOPePABAAgAAAihIA3vWLABAAgAAAihIA1v4RAAIAEABAUQLA2j8CQAAAAgAoSgCY/kEAAAIAKEoAbE/+mP4RAAIAEABA/gPA2j8IAEAAAEUJAHf9ggAABABQlADwti8QAIAAAIoSANb+QQAAAgAoUABY+wcBAAgAoBABsF37N+2BAAAEAFCIALD2DwIAEABAIQLA2j8IAEAAAEUJAM/8AQEACACgQAEwOD33zB8QAIAAAIoSANFgZMIDAQAIAEAAAAIAEACAAAABIAAAAQAIABAAAgAQAIAAAAEgAAABAAJAAIAAEACAAAABIABAAAgAEACAABAAIAAEAAgAQAAIABAAgAAABIAAAAEACABAAAgAEACAAAAEgAAAAQAIAEAAAAIAEACAAAABIAAAAQAIABAAAgAQAIAAAAEgAAABAAJAAIAAEACAAAABIABAAAgAEACAABAAIAAEAAgAQAAIABAAvlFBAAACQACAAAAEACAABAAIAEAAAAJAAIAAAAQAIAAAAQAIAEAAgAAQAIAAAAQACAABAAgAQACAABAAgAAABAAIAAEACAAQAAIABIAAAAEACAABAAJAAIAAAASAAAABIABAAAACQACAAAAEACAABAAIAEAAAAJAAIAAAAQAIAAAAQAIACDvAdAdnn7bKwG/U2t3BQAgAID8BADwYQQAIABAAAgAEAACAASATwEEgAAAASAAQAAAAkAAgAAQACAAAAEACABAAAACABAAgAAABAAgAAABAAgAQAAAAgAQAIAAAAQAIAAAAQAIAEAAAAIAEACAAAAEACAAQAAIABAAAgAQACAABAAIAAEAAgAQAAIABIAAAAEACABAAAACABAAgAAABAAgAAABAAgA4COdTxdJBUBoCZ8nZMj69kEAAAIACmcyWybyn/8vO/vD8YXPEzJktt6EdE/kGyAanPg8QQAAGQmA+err7kEiE0Ajite3Dz5SyIrh2SSp3/7xyZnPEwQAkA2Xy6ukzgCESeJisfaRQlaW/49qzUR+7wcnNgBBAAAZGgIOysdJDQHlWnO6uvapQsqtbu4bUfxlZz+p3/vns6VPFQQAkA2L69tyvZXUEBDmiVKlNr6ch7+t40CQNuF35XJzN5mvaq0owek/CL/lfbwgAIDMDASNTi/BOWB7Fuio1mz1BlH/JBqMgJRox8PjVpTUjb9/2zk48l0KAgDIkng0TnYtECiU42bHFykIACBLJvNV4iuCQHHEo7EvUhAAQMZuB9xP7j5goFB2Do7cAQwCAMieqH9ijgHeoFJvLTd3vkVBAADZOwX0da9klAFe++CvnleAgQAAsmi5uau1ItMM8NrzPx4ACgIAyKrh+OKbTQDgNZrdvi9PEABAhm8FriT3RjAg9/YOK5fLK1+eIACADDu7nH/dPTDWAC85/d/pn3jhNwgAIPObAM0o9lIw4FkHlZrT/yAAgDy4XF7tH1UNN8ATvu2VRueXvjBBAAA5cXox80hQ4KnDP/FwdXPv2xIEAJAT69uHTv/EzQDAL1Ub7aXDPyAAgJxZbu4aUWzQAR45rNannvwDAgDIawNUG203BAN/K1VqF4u1r0cQAEBuzdebWivSAMD3x/6UjyfzlS9GEABAzq1u7hudnvsBoOAq9ZZ3foEAAAp0Fqh3cvbNc4GgkEL/11rRbL3xZQgCACiW8XRxVGs6DgSFsndYGZ5N1ree+AkCACik2XrT7g1sBUBB1FrRZLb01QcCACi66eq60entlsrGI8jrW36rzc7Z5dzXHQgAgH/uDD6fLdu9wc7BkWkJcnbcfzSZLjd3vuhAAPgUgMfWtw9hSji9mIWJoVSp/XVw5A4ByJy/9g/3j6rVRrt/ej6/ugm/r325AQIAeM7tQ5gbzi7ng7NJuzcIPXBUax5UantHFSBt9svHh8eNMPG3uv345Cw0/HR1be4HBADw9m2B1c19sNzcAakVfpMa+gEBAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAA8CkAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACwKcAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAPgIAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAA+BQAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAOnzf8szhyZBAaNaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE0LTAxLTIyVDEyOjQyOjM4KzA0OjAw2dvQYgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNC0wMS0yMlQxMjo0MjozOCswNDowMKiGaN4AAAAASUVORK5CYII=";
      };
      
      mediaContainer.appendChild(img);
      typeIndicator.innerHTML = '<i class="fas fa-image"></i> Ảnh';
      
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.path;
      video.preload = "metadata";
      video.muted = true;
      
      const playIcon = document.createElement("div");
      playIcon.className = "play-overlay";
      playIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
      
      mediaContainer.appendChild(video);
      mediaContainer.appendChild(playIcon);
      typeIndicator.innerHTML = '<i class="fas fa-video"></i> Video';
    }
    
    // Assemble the item based on view mode
    if (isListView) {
      // List view structure
      mediaContainer.appendChild(actionsContainer);
      contentContainer.appendChild(overlay);
      contentContainer.appendChild(typeIndicator);
      
      div.appendChild(mediaContainer);
      div.appendChild(contentContainer);
    } else {
      // Grid view structure
      mediaContainer.appendChild(overlay);
      mediaContainer.appendChild(actionsContainer);
      div.appendChild(mediaContainer);
      div.appendChild(typeIndicator);
    }    // Add click handler for lightbox
    div.addEventListener("click", () => {
      const itemIndex = this.filteredItems.findIndex(filteredItem => filteredItem.id === item.id);
      this.openLightbox(itemIndex >= 0 ? itemIndex : 0);
    });
    
    return div;
  }
  // Helper methods
  toggleFavorite(itemId) {
    // Implementation for toggling favorite
    console.log('Toggle favorite for item:', itemId);
  }

  shareItem(item) {
    // Implementation for sharing item
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được sao chép vào clipboard!');
    }
  }  openLightbox(index) {
    this.currentLightboxIndex = index;
    const item = this.filteredItems[index];

    if (!item) return; // Safety check

    const lightboxModal = document.getElementById("lightboxModal");
    const mediaContainer = document.getElementById("lightboxMedia");
    const titleElement = document.querySelector("#lightboxTitle h3");
    const dateElement = document.querySelector("#lightboxTitle .lightbox-date");
    const descriptionElement = document.querySelector("#lightboxInfo .lightbox-description p");

    // Clear previous content
    mediaContainer.innerHTML = "";

    // Update title and info
    if (titleElement) titleElement.textContent = item.title;
    if (dateElement) dateElement.textContent = new Date(item.date).toLocaleDateString('vi-VN');
    if (descriptionElement) descriptionElement.textContent = item.description;

    // Create media element with zoom functionality
    if (item.type === "image") {
      const imgContainer = document.createElement("div");
      imgContainer.className = "lightbox-image-container";
      imgContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: zoom-in;
      `;

      const img = document.createElement("img");
      img.src = item.path;
      img.alt = item.title;
      img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
        transform-origin: center;
      `;

      let isZoomed = false;
      let scale = 1;
      let startX = 0, startY = 0;
      let translateX = 0, translateY = 0;
      let isDragging = false;

      // Click to zoom
      imgContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isZoomed) {
          scale = 2;
          isZoomed = true;
          imgContainer.style.cursor = 'zoom-out';
        } else {
          scale = 1;
          translateX = 0;
          translateY = 0;
          isZoomed = false;
          imgContainer.style.cursor = 'zoom-in';
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      });

      // Mouse drag for zoomed image
      imgContainer.addEventListener('mousedown', (e) => {
        if (isZoomed) {
          isDragging = true;
          startX = e.clientX - translateX;
          startY = e.clientY - translateY;
          imgContainer.style.cursor = 'grabbing';
          e.preventDefault();
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging && isZoomed) {
          translateX = e.clientX - startX;
          translateY = e.clientY - startY;
          img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          imgContainer.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
        }
      });

      // Wheel zoom
      imgContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = imgContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(0.5, scale * delta), 4);
        
        if (newScale !== scale) {
          const scaleChange = newScale / scale;
          translateX = mouseX - scaleChange * (mouseX - translateX);
          translateY = mouseY - scaleChange * (mouseY - translateY);
          scale = newScale;
          
          isZoomed = scale > 1;
          imgContainer.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
          img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
      });

      imgContainer.appendChild(img);
      mediaContainer.appendChild(imgContainer);
      
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.path;
      video.controls = true;
      video.style.maxWidth = "100%";
      video.style.maxHeight = "100%";
      mediaContainer.appendChild(video);
    }

    // Update navigation button states
    this.updateNavigationButtons();

    // Show lightbox
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  generateThumbnails() {
    const thumbnailsContainer = document.getElementById("lightboxThumbnails");
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = "";
    
    this.filteredItems.forEach((item, index) => {
      const thumb = document.createElement("div");
      thumb.className = `lightbox-thumbnail ${index === this.currentLightboxIndex ? 'active' : ''}`;
      
      if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.path;
        img.alt = item.title;
        thumb.appendChild(img);
      } else {
        const video = document.createElement("video");
        video.src = item.path;
        video.muted = true;
        thumb.appendChild(video);
      }
      
      thumb.addEventListener("click", () => this.openLightbox(index));
      thumbnailsContainer.appendChild(thumb);
    });
  }

  closeLightbox() {
    const lightboxModal = document.getElementById("lightboxModal");
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";

    // Remove keyboard event listener
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }

    // Stop slideshow if active
    if (this.isSlideshow) {
      this.stopSlideshow();
    }

    // Stop any playing videos
    const video = lightboxModal.querySelector("video");
    if (video) {
      video.pause();
    }
  }
  prevMedia() {
    if (this.currentLightboxIndex > 0) {
      this.openLightbox(this.currentLightboxIndex - 1);
    } else if (this.isSlideshow) {
      // Loop to last image in slideshow
      this.openLightbox(this.filteredItems.length - 1);
    }
    this.updateSlideshowCounter();
  }

  nextMedia() {
    if (this.currentLightboxIndex < this.filteredItems.length - 1) {
      this.openLightbox(this.currentLightboxIndex + 1);
    } else if (this.isSlideshow) {
      // Loop back to first image in slideshow
      this.openLightbox(0);
    }
    this.updateSlideshowCounter();
  }

  updateSlideshowCounter() {
    const counter = document.querySelector('.slideshow-counter');
    if (counter) {
      counter.textContent = `${this.currentLightboxIndex + 1} / ${this.filteredItems.length}`;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  showLoading() {
    document.getElementById("loading").classList.add("show");
  }

  hideLoading() {
    document.getElementById("loading").classList.remove("show");
  }

  // Initialize masonry layout after images load
  initMasonryLayout() {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;
    
    // Wait for images to load before applying masonry
    const images = galleryGrid.querySelectorAll('img');
    let loadedImages = 0;
    
    const checkAllImagesLoaded = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        this.applyMasonryLayout();
      }
    };
    
    images.forEach(img => {
      if (img.complete) {
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', checkAllImagesLoaded);
        img.addEventListener('error', checkAllImagesLoaded);
      }
    });
    
    // Apply layout immediately if no images
    if (images.length === 0) {
      this.applyMasonryLayout();
    }
  }
  
  applyMasonryLayout() {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid || !galleryGrid.classList.contains('masonry')) return;
    
    // Reset any existing masonry styles
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.style.position = '';
      item.style.top = '';
      item.style.left = '';
    });
  }
  
  // Add keyboard navigation for lightbox
  addKeyboardNavigation() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.prevMedia();
          break;
        case 'ArrowRight':
          this.nextMedia();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Store reference to remove later
    this.keyboardHandler = handleKeyDown;
  }
  
  // Enhanced animated background
  initAnimatedBackground() {
    this.createFloatingHearts();
    this.createTechParticles();
    this.createGradientOrbs();
    this.createCircuitLines();
  }
  
  createCircuitLines() {
    const background = document.querySelector('.animated-background');
    if (!background) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0'; 
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    canvas.style.zIndex = '-1';
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const drawCircuits = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FF91A4';
      ctx.lineWidth = 1;
      
      // Draw some animated circuit lines
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + (Math.random() - 0.5) * 200;
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add small circles at connection points
        ctx.beginPath();
        ctx.arc(startX, startY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFB6C1';
        ctx.fill();
      }
    };
    
    resizeCanvas();    drawCircuits();
    
    window.addEventListener('resize', resizeCanvas);
    setInterval(drawCircuits, 3000);
    
    background.appendChild(canvas);
  }
}

// Initialize gallery when DOM is loaded
let gallery;
document.addEventListener("DOMContentLoaded", () => {
  gallery = new ModernGallery();
});

// Global functions for lightbox navigation
function closeLightbox() {
  if (gallery) {
    gallery.closeLightbox();
  }
}

function prevMedia() {
  if (gallery) {
    gallery.prevMedia();
  }
}

function nextMedia() {
  if (gallery) {
    gallery.nextMedia();
  }
}

function downloadImage() {
  if (gallery && gallery.filteredItems[gallery.currentLightboxIndex]) {
    const item = gallery.filteredItems[gallery.currentLightboxIndex];
    const link = document.createElement('a');
    link.href = item.path;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function shareImage() {
  if (gallery && gallery.filteredItems[gallery.currentLightboxIndex]) {
    const item = gallery.filteredItems[gallery.currentLightboxIndex];
    gallery.shareItem(item);
  }
}

function toggleFavorite() {
  if (gallery && gallery.filteredItems[gallery.currentLightboxIndex]) {
    const item = gallery.filteredItems[gallery.currentLightboxIndex];
    gallery.toggleFavorite(item.id);
  }
}
