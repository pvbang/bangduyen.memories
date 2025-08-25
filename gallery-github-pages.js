// GitHub Pages Gallery - sử dụng JSON được tạo bởi GitHub Actions
class GitHubPagesGallery {
  constructor() {
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
  }

  async init() {
    this.showLoading();
    await this.loadMediaItems();
    this.bindEvents();
    this.initViewMode();
    this.loadMoreItems();
    this.updateStats();
    this.hideLoading();
  }

  initViewMode() {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    
    const activeViewBtn = document.querySelector(`[data-view="${this.currentView}"]`);
    if (activeViewBtn) {
      activeViewBtn.classList.add("active");
    }
    
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
      
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
      
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
      console.log('🔄 Đang tải media từ GitHub Pages...');
      
      // Thử tải từ file JSON được tạo bởi GitHub Actions
      const response = await fetch('api/media-files.json?' + Date.now()); // Cache busting
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          console.log(`✅ Tải thành công từ GitHub Actions JSON`);
          console.log(`📅 Được tạo lúc: ${result.generated_at}`);
          
          await this.processMediaFromJSON(result.data);
          
          console.log(`📸 Đã tải ${result.total_images} ảnh`);
          console.log(`🎬 Đã tải ${result.total_videos} video`);
          return;
        }
      }
      
      throw new Error('JSON file not found or invalid');
      
    } catch (error) {
      console.error("❌ Không thể tải từ GitHub Actions JSON:", error);
      console.log("🔄 Sử dụng phương pháp fallback...");
      await this.loadMediaItemsFallback();
    }
  }

  async processMediaFromJSON(data) {
    const imageItems = [];
    const videoItems = [];

    // Process images
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((imageData, index) => {
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
    }

    // Process videos
    if (data.videos && Array.isArray(data.videos)) {
      data.videos.forEach((videoData, index) => {
        const item = {
          id: `vid_${index}`,
          type: "video",
          filename: videoData.filename,
          path: videoData.path,
          title: this.generateVideoTitle(videoData.filename),
          date: new Date(videoData.modified * 1000),
          description: "Một khoảnh khắc động trong kỷ niệm của chúng ta",
          size: videoData.size,
          extension: videoData.extension
        };
        videoItems.push(item);
      });
    }

    this.mediaItems = [...imageItems, ...videoItems];
    this.filteredItems = [...this.mediaItems];

    // Sort by date (newest first)
    this.mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async loadMediaItemsFallback() {
    console.log("🔄 Sử dụng phương pháp fallback");
    
    // Danh sách tĩnh làm backup khi GitHub Actions chưa chạy
    const fallbackImages = [
      "a.jpg", "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg",
      "App quó chòi.jpg", "Chài chài ảnh hạnh phúc.jpg", "Chân dài 2m.jpeg",
      "Cái đồ đẹp chai này.jpg", "Công túa rất buồn...ngủ.jpg", "Cổ tích quó.jpg",
      // Thêm các ảnh chính khác...
    ];

    const imageItems = fallbackImages.map((filename, index) => ({
      id: `img_${index}`,
      type: "image",
      filename: filename,
      path: `data/images/${filename}`,
      title: this.generateImageTitle(filename),
      date: this.generateRandomDate(),
      description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta"
    }));

    this.mediaItems = imageItems;
    this.filteredItems = [...this.mediaItems];
    
    console.log(`📸 Fallback: Đã tải ${imageItems.length} ảnh`);
  }

  generateImageTitle(filename) {
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
      "Êy nha êy nha.png": "Êy nha êy nha 😏",
      "Gian tình gian tình.jpg": "Gian tình gian tình 😤",
      "Hehehe chít anh với tui .jpg": "Hehehe chít anh với tui 😄",
      "Làm gì cũng đệp .jpg": "Làm gì cũng đẹp 💫",
      "Mặt tròn mặt chỉnh.jpg": "Mặt tròn mặt chỉnh 😊",
      "Mít ướt.jpg": "Mít ướt 🥭",
      "Mlem mlem.jpeg": "Mlem mlem 😋",
      "Mở 1 mắt.jpg": "Mở 1 mắt 😉",
      "Nhai đòu bây giờ.jpg": "Nhai đậu bây giờ 🫘",
      "Nhắm 1 mắt.jpeg": "Nhắm 1 mắt 😌",
      "Ô ô ô ô.jpg": "Ô ô ô ô 😲",
      "Ối ối ối.jpg": "Ối ối ối 😅",
      "Sao hay liếc quó.jpg": "Sao hay liếc quá 👀",
      "Tay ai vị kè.jpg": "Tay ai vậy kìa 🤔",
      "Tuân lệnh công chúa.jpg": "Tuân lệnh công chúa 👑",
      "Ú òa, bác sĩ Bằng đem xoài cho ăn.jpeg": "Ú òa, bác sĩ Bằng đem xoài cho ăn 🥭👨‍⚕️",
      "Và công túa chỉ có mình a thou.jpg": "Và công túa chỉ có mình anh thôi 👸💕",
      "Very hờn.jpg": "Very hờn 😤",
      "Very khó lói.jpg": "Very khó lòng 😔",
      "Xinh gái 10đ.jpg": "Xinh gái 10 điểm 💯✨",
      "Ỷ đẹp trai đó.jpg": "Ỷ đẹp trai đó 😎"
    };

    if (vietnameseNames[filename]) {
      return vietnameseNames[filename];
    }

    // Auto-generate from filename
    return filename
      .replace(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  generateVideoTitle(filename) {
    return filename
      .replace(/\.(mp4|webm|ogg|mov|avi|mkv)$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()) + ' 🎬';
  }

  generateRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Copy the rest of the methods from the original gallery.js
  // These include: updateStats, filterItems, loadMoreItems, bindEvents, etc.
  // [The rest would be copied from the original file]
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.gallery = new GitHubPagesGallery();
});
