// GitHub Pages Compatible Gallery JavaScript
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

    // GitHub repository configuration
    this.config = {
      owner: 'pvbang', // Thay đổi thành username GitHub của bạn
      repo: 'bangduyen.memories', // Thay đổi thành tên repo của bạn
      branch: 'main', // Hoặc 'master' tùy theo repo
      imagesPath: 'data/images',
      videosPath: 'data/videos'
    };

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
      console.log('🔄 Đang tải media từ GitHub API...');
      
      // Load images and videos in parallel
      const [imageItems, videoItems] = await Promise.all([
        this.loadImagesFromGitHub(),
        this.loadVideosFromGitHub()
      ]);

      this.mediaItems = [...imageItems, ...videoItems];
      this.filteredItems = [...this.mediaItems];

      // Sort by name (GitHub API doesn't provide file modification time easily)
      this.mediaItems.sort((a, b) => b.filename.localeCompare(a.filename));
      this.filteredItems.sort((a, b) => b.filename.localeCompare(a.filename));
      
      console.log(`✅ Đã tải ${imageItems.length} ảnh và ${videoItems.length} video`);
    } catch (error) {
      console.error("❌ Lỗi khi tải media items:", error);
      console.log("🔄 Sử dụng phương pháp fallback...");
      await this.loadMediaItemsFallback();
    }
  }

  async loadImagesFromGitHub() {
    const imageItems = [];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

    try {
      // GitHub API URL to list contents of images folder
      const apiUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.imagesPath}`;
      
      console.log(`📡 Gọi GitHub API: ${apiUrl}`);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const files = await response.json();
      
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          if (file.type === 'file') {
            const extension = file.name.split('.').pop().toLowerCase();
            if (imageExtensions.includes(extension)) {
              const item = {
                id: `img_${index}`,
                type: "image",
                filename: file.name,
                path: `${this.config.imagesPath}/${file.name}`,
                title: this.generateImageTitle(file.name),
                date: new Date(), // GitHub API basic tier doesn't provide file dates easily
                description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
                size: file.size,
                githubUrl: file.download_url
              };
              imageItems.push(item);
            }
          }
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải ảnh từ GitHub API:", error);
      throw error;
    }

    return imageItems;
  }

  async loadVideosFromGitHub() {
    const videoItems = [];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    try {
      const apiUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.videosPath}`;
      
      console.log(`📡 Gọi GitHub API: ${apiUrl}`);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        // Videos folder might not exist, that's okay
        console.log('📁 Folder videos không tồn tại hoặc trống');
        return videoItems;
      }

      const files = await response.json();
      
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          if (file.type === 'file') {
            const extension = file.name.split('.').pop().toLowerCase();
            if (videoExtensions.includes(extension)) {
              const item = {
                id: `vid_${index}`,
                type: "video",
                filename: file.name,
                path: `${this.config.videosPath}/${file.name}`,
                title: this.generateVideoTitle(file.name),
                date: new Date(),
                description: "Một khoảnh khắc động trong kỷ niệm của chúng ta",
                size: file.size,
                githubUrl: file.download_url
              };
              videoItems.push(item);
            }
          }
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải video từ GitHub API:", error);
      // Don't throw for videos, just return empty array
    }

    return videoItems;
  }

  async loadMediaItemsFallback() {
    console.log("🔄 Sử dụng phương pháp fallback - danh sách tĩnh");
    
    // Fallback to a curated list of known files
    // Bạn có thể cập nhật danh sách này bằng tay hoặc sử dụng GitHub Actions
    const knownImages = [
      // Thêm danh sách ảnh chính ở đây
      "a.jpg",
      "01.jpg", 
      "02.jpg",
      "03.jpg",
      "04.jpg",
      "05.jpg",
      "06.jpg",
      "07.jpg",
      // ... thêm các ảnh khác
    ];

    const imageItems = knownImages.map((filename, index) => ({
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
  }

  // Include all other methods from the original gallery.js
  // (generateImageTitle, generateVideoTitle, etc. - copy from original file)

  generateImageTitle(filename) {
    // Vietnamese names mapping (copy from original file)
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
      // ... add more mappings
    };

    if (vietnameseNames[filename]) {
      return vietnameseNames[filename];
    }

    // Auto-generate title from filename
    return filename
      .replace(/\.(jpg|jpeg|png|gif|webp|bmp)$/i, '')
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

  // Copy all other methods from the original gallery.js file
  // (updateStats, filterItems, loadMoreItems, etc.)
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.gallery = new GitHubPagesGallery();
});
