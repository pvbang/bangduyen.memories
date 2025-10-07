// ==========================================
// BIRTHDAY PAGE - INTERACTIVE FEATURES
// Romantic Universe with 3D Interactions
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initIntroAnimation();
    initBackgroundEffects();
    initUniverseScene();
    initWishesRain();
    initGalleryCarousel();
    initTimeline();
    initMusicPlayer();
    initFireworks();
    initModal();
});

// ==========================================
// INTRO ANIMATION - GIFT BOX
// ==========================================

function initIntroAnimation() {
    const giftBox = document.getElementById('giftBox');
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');
    const giftSparkles = document.getElementById('giftSparkles');
    
    // Create sparkles around gift
    createGiftSparkles(giftSparkles);
    
    // Gift box click event
    giftBox.addEventListener('click', function() {
        // Open gift animation
        giftBox.classList.add('opening');
        
        // Create explosion effect
        createExplosionEffect(giftBox);
        
        // Play sound if available
        playSound('gift-open');
        
        // Transition to main content
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainContent.classList.add('active');
            
            // Start background music
            const music = document.getElementById('birthdayMusic');
            if (music) {
                music.play().catch(e => console.log('Music autoplay prevented'));
            }
            
            // Trigger fireworks
            startFireworks();
            
            // Auto start wishes rain
            setTimeout(() => {
                startWishesRain();
            }, 2000);
        }, 1500);
    });
}

function createGiftSparkles(container) {
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position around gift
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(sparkle);
    }
}

function createExplosionEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['#FF69B4', '#FFD700', '#FF1493', '#FFA500'][Math.floor(Math.random() * 4)]};
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 10000;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 200 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        confetti.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => confetti.remove();
    }
}

// ==========================================
// BACKGROUND EFFECTS
// ==========================================

function initBackgroundEffects() {
    createFloatingHearts();
    createStarsField();
    animateParticles();
}

function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (8 + Math.random() * 4) + 's';
        heart.style.fontSize = (15 + Math.random() * 15) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 12000);
    }, 2000);
}

function createStarsField() {
    const container = document.getElementById('starsField');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        container.appendChild(star);
    }
}

function animateParticles() {
    // Additional particle effects can be added here
}

// ==========================================
// UNIVERSE SCENE - 3D ROTATING SPACE WITH CENTRAL PLANET
// ==========================================

let universeState = {
    scene: null,
    items: [],
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 20, y: 0 },
    autoRotate: true,
    rotationSpeed: 0.3,
    scale: 1,
    animationId: null,
    exploded: false,
    photoCount: 0,
    wishCount: 0
};

function initUniverseScene() {
    universeState.scene = document.getElementById('universeScene');
    
    if (!universeState.scene) {
        return;
    }
    
    // Show loading screen
    showLoading();
    
    // Load images and wishes
    loadUniverseContent();
    
    // Setup interactions
    setupUniverseDrag();
    setupUniverseZoom();
    setupUniverseControls();
    
    // Set initial transform
    updateUniverseTransform();
    
    // Start auto rotation
    startAutoRotation();
}

async function loadUniverseContent() {
    // 200+ Birthday wishes - comprehensive collection
    const wishes = [
        // Lời chúc lãng mạn và chân thành
        'Chúc mừng sinh nhật công chúa của anh! Mỗi ngày có em đều là một món quà đối với a, tặng choa thế giới của a món quả nhỏ nhỏ này nhié ^^',
        'Tuổi mới chúc eiuuu của a luôn xinh đẹp, không chỉ ở vẻ ngoài mà còn ở tâm hồn tuyệt vời của em. Yêu em rất nhiều!',
        'Cảm ơn em đã đến và biến cuộc sống của anh từ một bản nhạc đơn điệu thành một bản giao hưởng đầy màu sắc. Sinh nhật vui vẻ nhié, tình yêu của anh.',
        'Chúc em một ngày sinh nhật thật an yên và hạnh phúc. Anh sẽ luôn ở đây, là điểm tựa vững chắc cho em.',
        'Em là ngôi sao sáng nhất trong vũ trụ của anh. Chúc em tuổi mới sẽ càng rực rỡ hơn nữa.',
        'Anh không hứa sẽ cho em mọi thứ trên đời, nhưng anh hứa sẽ cho em cả trái tim này. Sinh nhật vui vẻ, người con gái anh thương.',
        'Mỗi khoảnh khắc bên em đều là kỷ niệm quý giá. Chúc cho chúng ta sẽ có thêm thật nhiều, thật nhiều kỷ niệm đẹp nữa. Happy Birthday, em yêu!',
        'Chúc em tuổi mới luôn mỉm cười, vì nụ cười của em là ánh nắng sưởi ấm trái tim anh.',
        'Thế giới có hơn 8 tỷ người, nhưng đối với anh, em là duy nhất. Chúc mừng sinh nhật, định mệnh của đời anh.',
        'Chúc em một bầu trời sức khỏe, một biển cả tình yêu và một đại dương hạnh phúc. Anh yêu em!',
        'Gửi em, cô gái tuyệt vời nhất mà anh từng gặp. Chúc em một sinh nhật thật ý nghĩa. Anh mong rằng tuổi mới sẽ mang đến cho em thật nhiều cơ hội, thật nhiều niềm vui và cả những thử thách để em trở nên mạnh mẽ hơn. Đừng lo, vì dù có chuyện gì xảy ra, anh vẫn sẽ nắm tay em đi qua tất cả.',
        'Hôm nay là một ngày đặc biệt, ngày mà một thiên thần đã ra đời. Cảm ơn ba mẹ đã sinh ra em và cảm ơn số phận đã mang em đến bên anh. Chúc em tất cả những gì tốt đẹp nhất, không chỉ trong hôm nay mà trong suốt cuộc đời.',
        'Anh từng nghĩ hạnh phúc là điều gì đó xa vời, cho đến khi anh gặp em. Em chính là hạnh phúc, là bình yên, là tất cả những gì anh tìm kiếm. Sinh nhật vui vẻ, người yêu bé nhỏ của anh.',
        'Chúc em tuổi mới trưởng thành hơn, mạnh mẽ hơn, nhưng hãy luôn giữ lại sự ngây thơ và đáng yêu trong tâm hồn nhé. Vì đó là điều khiến anh yêu em nhất.',
        'Mỗi ngày trôi qua, anh lại yêu em nhiều hơn một chút. Chúc cho tình yêu của chúng ta sẽ luôn nồng nàn và bền chặt theo năm tháng. Happy Birthday, my love!',

        // Lời chúc hài hước và đáng yêu
        'Happy Birthday! Tuổi mới chúc em ăn mau chóng lớn, tiền đầy túi, tình đầy tim (tình của anh thôi nhié hẹ hẹ).',
        'Hôm nay là ngày gì mà một thiên thần lại hạ phàm zị ta? À, là sinh nhật eiuuu của a. Chúc công chúa của anh tất cả những điều tốt đẹp nhất.',
        'Chúc em tuổi mới bớt suy nghĩ lung tung, bớt lo âu, và nhớ rằng đã có anh ở đây lo cho em rồi.',
        'Sinh nhật vui vẻ! Quà thì từ từ anh tặng, còn tình yêu thì lúc nào cũng có sẵn cho em 24/7.',
        'Chúc em tuổi mới ngày càng xinh đẹp, thông minh, và giàu có... hơn anh một chút cũng được.',
        'Cảnh báo: Một cô gái cực kỳ đáng yêu đang + lên một tuổi. Chúc mừng sinh nhật em!',
        'Chúc em sinh nhật vui vẻ. Anh đã chuẩn bị một món quà siêu to khổng lồ, đó là tình yêu của anh đây. Nhận đi niè! chíu chíuuu chíuuuu',
        'Chúc em sinh nhật hạnh phúc. Nếu có điều ước nào, hãy ước đi, biết đâu anh lại biến nó thành hiện thực được thì sao.',
        'Chúc mừng sinh nhật! Anh không có gì ngoài một tấm thân trong trắng và một trái tim chung thủy để tặng em. Eiuuu lấy khom :)))',

        // Lời chúc ngắn gọn, ngọt ngào
        'Sinh nhật vui vẻ, tình yêu của anh!',
        'Yêu em, hôm qua, hôm nay và mãi mãi dìa sauu.',
        'Chúc mừng sinh nhật, công chúaaa iuuu của a.',
        'Tuổi mới, niềm vui mới, yêuu emmm!',
        'Chúc em một ngày thật đặc biệt.',
        'Mãi yêu công chúa của anh.',
        'Chúc em luôn hạnh phúc bên anh.',
        'Sinh nhật an lành nhié, bé yêu của a.',
        'Yêuuuuu em không cần lý do, eiuuu sinh nhật zui ziẻ!',
        'Chúc mừng sinh nhật eiuuu của a <3',

        // Thêm nhiều lời chúc khác
        'Chúc em tuổi mới có thêm nhiều trải nghiệm đáng nhớ và những chuyến đi thú vị cùng anh.',
        'Mong rằng mỗi ngày của em đều tràn ngập tiếng cười và niềm vui, không chỉ riêng ngày sinh nhật.',
        'Chúc em luôn giữ được ngọn lửa đam mê trong công việc và cuộc sống.',
        'Tuổi mới, chúc em có thêm nhiều bạn tốt và những mối quan hệ chất lượng.',
        'Chúc em luôn khỏe mạnh để chúng ta có thể cùng nhau đi đến cuối con đường.',
        'Anh mong rằng mọi dự định của em trong tuổi mới đều sẽ thành công rực rỡ.',
        'Chúc em có một ngày sinh nhật ấm áp bên gia đình, bạn bè zà anh :3',
        'Hãy luôn là chính mình, vì em là phiên bản tuyệt vời nhất rồi.',
        'Chúc em tuổi mới học được nhiều điều mới, khám phá nhiều nơi mới.',
        'Anh sẽ luôn là người ủng hộ em trên mọi con đường em chọn. Sinh nhật vui vẻ!',
        'Chúc em có một ngày sinh nhật không thể nào quên!',
        'Tuổi mới, hãy để những điều phiền muộn lại phía sau và chỉ mang theo niềm vui thôi nhié.',
        'Chúc em luôn tìm thấy niềm vui trong những điều nhỏ nhặt nhất của cuộc sống.',
        'Anh yêu cách em cười, cách em nói, yêu tất cả mọi thứ thuộc về em. Sinh nhật vui vẻ!',
        'Chúc em một tuổi mới với thật nhiều may mắn và thành công đang chờ đón phía trước.'
    ];
    
    // Load ALL images from data/images folder
    const photos = await loadAllImages();
    
    // Calculate total items
    const totalItems = wishes.length + photos.length;
    
    // Create multiple orbits for better distribution
    const orbits = [
        { radius: 350, count: 0 },
        { radius: 500, count: 0 },
        { radius: 650, count: 0 },
        { radius: 800, count: 0 }
    ];
    
    // Distribute items across orbits
    const itemsPerOrbit = Math.ceil(totalItems / orbits.length);
    
    let currentOrbitIndex = 0;
    let itemsInCurrentOrbit = 0;
    let totalIndex = 0;
    
    // Add wishes
    wishes.forEach((wish, index) => {
        if (itemsInCurrentOrbit >= itemsPerOrbit && currentOrbitIndex < orbits.length - 1) {
            currentOrbitIndex++;
            itemsInCurrentOrbit = 0;
        }
        
        const orbit = orbits[currentOrbitIndex];
        createUniverseItem('wish', wish, itemsInCurrentOrbit, itemsPerOrbit, orbit.radius);
        
        itemsInCurrentOrbit++;
        orbit.count++;
        totalIndex++;
        
        // Update loading progress
        updateLoadingProgress(totalIndex, totalItems);
    });
    
    // Add photos
    photos.forEach((photo, index) => {
        if (itemsInCurrentOrbit >= itemsPerOrbit && currentOrbitIndex < orbits.length - 1) {
            currentOrbitIndex++;
            itemsInCurrentOrbit = 0;
        }
        
        const orbit = orbits[currentOrbitIndex];
        createUniverseItem('photo', photo, itemsInCurrentOrbit, itemsPerOrbit, orbit.radius);
        
        itemsInCurrentOrbit++;
        orbit.count++;
        totalIndex++;
        
        // Update loading progress
        updateLoadingProgress(totalIndex, totalItems);
    });
    
    // Update counters
    universeState.photoCount = photos.length;
    universeState.wishCount = wishes.length;
    updateInfoDisplay();
    
    // Hide loading screen
    setTimeout(() => hideLoading(), 500);
}

// Load all images from data/images/secret folder
async function loadAllImages() {
    const imageFiles = [];
    
    // List of all image files in the secret folder
    const allFiles = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg',
        '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg',
        '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg'
    ];
    
    // Add romantic captions for our special memories
    const captions = [
        '💕 Khoảnh khắc quó đẹp của đời anh',
        '🌟 Nụ cười tỏa nắng của iemm',
        '💝 Bên nhau mãi mãi hạnh phúc <3',
        '❤️ Yêu em đến tận cùng vũ chụ',
        '🎀 Kỷ niệm đáng nhớ',
        '💖 Tình yêu của chúng mình',
        '🌹 Mãi mãi bên em không rờii',
        '✨ Em là cả thế giới của anhh',
        '💗 Những ngày tuyệt vời bên nhao :3',
        '🎂 Hạnh phúc giản đơn mỗi ngày',
        '💫 Kỷ niệm không bao giờ phaii',
        '🌈 Cùng nhau vượt qua mọi khó khăn',
        '💕 Emm iuuu của a xinh đẹp nhất trên đời',
        '🎁 Tình iuuu của anh',
        '💝 Chúng mình mãi bên nhao',
        '🌟 Những phút giây ngọt ngào :>',
        '❤️ Anh yêu em nhiều lắmm',
        '💖 Khoảnh khắc đáng trân trọngg',
        '🌹 Em là thiên thần của anh',
        '✨ Hạnh phúc là được yêu emm',
        '💗 Cùng nhau viết nên câu chuyện tìn iuuu',
        '🎀 Tình yêu đẹp như mơ lun :)))',
        '💫 Em là điều tuyệt vời nhất',
        'Aiuuuu iuuu công chúa của anh',
        'Thương emmm nhất trên đời',
        'Iuuuu e nhiều lắm lắmmm'
    ];
    
    allFiles.forEach((file, index) => {
        imageFiles.push({
            src: `data/images/secret/${file}`,
            caption: captions[index % captions.length]
        });
    });
    
    return imageFiles;
}

function showLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.add('hidden');
    }
}

function updateLoadingProgress(current, total) {
    const progress = document.getElementById('loadingProgress');
    if (progress) {
        const percent = Math.round((current / total) * 100);
        progress.textContent = `${percent}%`;
    }
}

function updateInfoDisplay() {
    const photoCount = document.getElementById('photoCount');
    const wishCount = document.getElementById('wishCount');
    
    if (photoCount) photoCount.textContent = universeState.photoCount;
    if (wishCount) wishCount.textContent = universeState.wishCount;
}

function createUniverseItem(type, content, index, total, radius) {
    const item = document.createElement('div');
    item.className = 'universe-item';
    
    // Calculate 3D position on sphere surface
    // Using Fibonacci sphere algorithm for even distribution
    const phi = Math.acos(-1 + (2 * index + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    // Set position
    item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    
    // Create inner wrapper để counteract rotation
    const inner = document.createElement('div');
    inner.className = 'item-inner';
    
    if (type === 'wish') {
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        wishCard.textContent = content;
        inner.appendChild(wishCard);
        
        // Click to view wish in modal
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            showWishModal(content);
        });
    } else if (type === 'photo') {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        
        const img = document.createElement('img');
        img.src = content.src;
        img.alt = content.caption;
        img.loading = 'lazy'; // Lazy loading for performance
        img.onerror = function() {
            this.src = 'data/images/01.jpg'; // Fallback image
        };
        
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = content.caption;
        
        photoCard.appendChild(img);
        photoCard.appendChild(caption);
        inner.appendChild(photoCard);
        
        // Click to view full image
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            showImageModal(content.src, content.caption);
        });
    }
    
    item.appendChild(inner);
    universeState.scene.appendChild(item);
    universeState.items.push(item);
}

function setupUniverseDrag() {
    const scene = universeState.scene;
    
    scene.addEventListener('mousedown', (e) => {
        universeState.isDragging = true;
        universeState.previousMousePosition = { x: e.clientX, y: e.clientY };
        universeState.autoRotate = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!universeState.isDragging) return;
        
        const deltaX = e.clientX - universeState.previousMousePosition.x;
        const deltaY = e.clientY - universeState.previousMousePosition.y;
        
        universeState.rotation.y += deltaX * 0.5;
        universeState.rotation.x -= deltaY * 0.5;
        
        updateUniverseRotation();
        
        universeState.previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseup', () => {
        universeState.isDragging = false;
    });
    
    // Touch support
    scene.addEventListener('touchstart', (e) => {
        universeState.isDragging = true;
        const touch = e.touches[0];
        universeState.previousMousePosition = { x: touch.clientX, y: touch.clientY };
        universeState.autoRotate = false;
    });
    
    scene.addEventListener('touchmove', (e) => {
        if (!universeState.isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - universeState.previousMousePosition.x;
        const deltaY = touch.clientY - universeState.previousMousePosition.y;
        
        universeState.rotation.y += deltaX * 0.5;
        universeState.rotation.x -= deltaY * 0.5;
        
        updateUniverseRotation();
        
        universeState.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });
    
    scene.addEventListener('touchend', () => {
        universeState.isDragging = false;
    });
}

function setupUniverseZoom() {
    const container = document.getElementById('universeContainer');
    const zoomLevel = document.getElementById('zoomLevel');
    
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        universeState.scale = Math.max(0.3, Math.min(3, universeState.scale + delta));
        
        updateUniverseTransform();
        updateZoomDisplay();
    });
}

function setupUniverseControls() {
    // Auto rotate button
    const rotateBtn = document.getElementById('rotateBtn');
    rotateBtn.addEventListener('click', () => {
        universeState.autoRotate = !universeState.autoRotate;
        rotateBtn.classList.toggle('active', universeState.autoRotate);
        if (universeState.autoRotate) {
            startAutoRotation();
        }
    });
    rotateBtn.classList.add('active'); // Start as active
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        universeState.rotation = { x: 20, y: 0 };
        universeState.scale = 1;
        universeState.exploded = false;
        updateUniverseTransform();
        updateZoomDisplay();
        
        // Reset exploded scale if any
        universeState.items.forEach(item => {
            const inner = item.querySelector('.item-inner');
            if (inner && universeState.exploded) {
                inner.style.transform = inner.style.transform.replace(/scale\([^)]+\)/, '');
            }
        });
    });
    
    // Explode button (new feature!)
    document.getElementById('explodeBtn').addEventListener('click', () => {
        universeState.exploded = !universeState.exploded;
        
        universeState.items.forEach(item => {
            const inner = item.querySelector('.item-inner');
            if (inner) {
                if (universeState.exploded) {
                    // Add scale to inner
                    const currentTransform = inner.style.transform || '';
                    if (!currentTransform.includes('scale')) {
                        inner.style.transform = currentTransform + ' scale(1.5)';
                    }
                } else {
                    // Remove scale from inner
                    inner.style.transform = inner.style.transform.replace(/scale\([^)]+\)/, '').trim();
                }
            }
        });
    });
    
    // Zoom in button
    document.getElementById('zoomInBtn').addEventListener('click', () => {
        universeState.scale = Math.min(3, universeState.scale + 0.15);
        updateUniverseTransform();
        updateZoomDisplay();
    });
    
    // Zoom out button
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        universeState.scale = Math.max(0.3, universeState.scale - 0.15);
        updateUniverseTransform();
        updateZoomDisplay();
    });
    
    // Speed up button
    document.getElementById('speedUpBtn').addEventListener('click', () => {
        universeState.rotationSpeed = Math.min(2, universeState.rotationSpeed + 0.2);
    });
    
    // Speed down button
    document.getElementById('speedDownBtn').addEventListener('click', () => {
        universeState.rotationSpeed = Math.max(0.1, universeState.rotationSpeed - 0.2);
    });
}

function startAutoRotation() {
    if (universeState.animationId) {
        cancelAnimationFrame(universeState.animationId);
    }
    
    function animate() {
        if (universeState.autoRotate && !universeState.isDragging) {
            universeState.rotation.y += universeState.rotationSpeed;
            updateUniverseRotation();
        }
        universeState.animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function updateUniverseRotation() {
    updateUniverseTransform();
}

function updateUniverseTransform() {
    if (universeState.scene) {
        universeState.scene.style.transform = `
            scale(${universeState.scale})
            rotateX(${universeState.rotation.x}deg)
            rotateY(${universeState.rotation.y}deg)
        `;
        
        // Apply inverse rotation to all items để giữ chúng luôn đứng thẳng
        universeState.items.forEach(item => {
            const inner = item.querySelector('.item-inner');
            if (inner) {
                // Counter-rotate để luôn nhìn về phía camera
                inner.style.transform = `
                    rotateY(${-universeState.rotation.y}deg)
                    rotateX(${-universeState.rotation.x}deg)
                `;
            }
        });
    }
}

function updateZoomDisplay() {
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(universeState.scale * 100) + '%';
    }
}

// ==========================================
// WISHES RAIN
// ==========================================

let wishesRainActive = false;
let rainSpeed = 3;
let rainDensity = 2; // Start with the slider's default value
let rainCounter = 0;
let rainIntervals = []; // To hold our rain stream intervals

function initWishesRain() {
    const speedSlider = document.getElementById('speedSlider');
    const densitySlider = document.getElementById('densitySlider');
    const speedValue = document.getElementById('speedValue');
    const densityValue = document.getElementById('densityValue');
    const wishesSection = document.getElementById('wishes');

    // Set initial values from sliders
    if (speedSlider) {
        rainSpeed = parseInt(speedSlider.value);
        speedValue.textContent = rainSpeed;
    }
    if (densitySlider) {
        rainDensity = parseInt(densitySlider.value);
        densityValue.textContent = rainDensity;
    }

    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            rainSpeed = parseInt(e.target.value);
            speedValue.textContent = rainSpeed;
            // No need to restart rain for speed, it's applied dynamically
        });
    }
    
    if (densitySlider) {
        densitySlider.addEventListener('input', (e) => {
            rainDensity = parseInt(e.target.value);
            densityValue.textContent = rainDensity;
            if (wishesRainActive) {
                updateWishesRainDensity();
            }
        });
    }

    // Auto-start rain when wishes section becomes visible
    if (wishesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !wishesRainActive) {
                    startWishesRain();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(wishesSection);
    }

    // Also start rain immediately if main content is already visible
    const mainContent = document.getElementById('mainContent');
    if (mainContent && mainContent.classList.contains('active')) {
        setTimeout(() => {
            startWishesRain();
        }, 1000);
    }
}

function updateWishesRainDensity() {
    // Clear existing rain streams
    rainIntervals.forEach(clearInterval);
    rainIntervals = [];

    // Start new streams with the updated density
    const streams = rainDensity;
    for (let i = 0; i < streams; i++) {
        // Stagger the start times for a more natural effect
        setTimeout(() => {
            const interval = setInterval(createWish, 2000); // Create a wish every 2 seconds per stream
            rainIntervals.push(interval);
        }, i * (2000 / streams));
    }
}

function startWishesRain() {
    if (wishesRainActive) return;
    wishesRainActive = true;
    rainCounter = 0;
    updateRainCounter();
    updateWishesRainDensity(); // Initial start of rain
}

function stopWishesRain() {
    wishesRainActive = false;
    rainIntervals.forEach(clearInterval);
    rainIntervals = [];
}

function createWish() {
    if (!wishesRainActive) return;

    const container = document.getElementById('wishesRain');
    if (!container) return;

    const allWishes = [
        'Sinh nhật vui vẻ công chúa của anh!',
        'Chúc eiuuu của anh luôn xinh đẹp rạng ngời!',
        'Chúc em đạt được mọi ước mơ!',
        'Aiuuu em nhiều lắm lắm!',
        'Chúc em có một ngày tuyệt vời!',
        'Em là điều tuyệt vời nhất!',
        'Cảm ơn em đã đến bên anh!',
        'Tuổi mới an khang, hạnh phúc nhé eiuuu!',
        'Em là ánh sáng của đời anh!',
        'Luôn yêu thương và che chở em!',
        'Món quà lớn nhất là có em!',
        'Em mãi là nàng công chúa của anh!',
        'Hạnh phúc là được ở bên em!',
        'Chúc em ngày càng xinh đẹp!',
        'Anh sẽ luôn bên em mãi mãi!',
        'Em là vũ trụ của anh!',
        'Chúc em luôn khỏe mạnh!',
        'Em là ngôi sao sáng nhất!',
        'Yêu em hết cả trái tim!',
        'Sinh nhật em là ngày hạnh phúc!',
        'Em làm anh tin vào tình yêu!',
        'Mỗi ngày với em đều tuyệt vời!',
        'Chúc em luôn mỉm cười!',
        'Em là cầu vồng sau mưa!',
        'Anh muốn ở bên em mãi mãi!',
        'Em xứng đáng mọi điều tốt đẹp!',
        'Hoa hồng cũng không đẹp bằng em!',
        'Tình yêu anh dành cho em vô tận!',
        'Chúc em tuổi mới thật nhiều niềm vui!',
        'Em là tất cả của anh!',
        'Chúc em sinh nhật thật ý nghĩa!',
        'Em là thiên thần của anh!',
        'Chúc em luôn tỏa sáng!',
        'Anh không thể thiếu em!',
        'Mong em luôn hạnh phúc!',
        'Em là phép màu của đời anh!',
        'Yêu em nhiều hơn ngày hôm qua!',
        'Chúc em mọi điều may mắn!',
        'Em là màu sắc cuộc đời anh!',
        'Chúc em luôn được yêu thương!',
        'Em là kho báu của anh!',
        'Tình yêu của anh là vĩnh cửu!',
        'Anh sẽ yêu em đến hơi thở cuối!',
        'Chúc em thành công trong mọi việc!',
        'Em là lý do anh sống!',
        'Tuổi mới nhiều điều tốt lành!',
        'Em là giấc mơ thành hiện thực!',
        'Chúc em luôn rực rỡ!',
        'Yêu em đến tận cùng vũ trụ!',
        'Sinh nhật vui vẻ người yêu!',
        'Iuuuuu emmm nhìuuu lắmmm!',
        'Chúc mừng sinh nhật eiuuu!',
        'Thương em nhất trên đời!',
        'Chúc bé iu của anh sinh nhật vui vẻ!',
        'Tuổi mới bớt lo nghĩ, có anh ở đây rồi!',
        'Chỉ cần em vui là được!',
        'Yêu công chúa của anh rất nhiều!',
        'Chúc em một đời an yên!',
        'Mãi là cô bé đáng yêu của anh nhé!',
        'Chúc em mọi điều tốt đẹp nhất!',
        'Anh sẽ luôn là hậu phương vững chắc cho em!',
        'Cảm ơn vì đã là một phần cuộc sống của anh!',
        'Chúc em luôn cười tươi như bây giờ!',
        'Yêu và thương em rất nhiều!',
        'Chúc em tuổi mới ngày càng thành công!',
        'Hạnh phúc nhé, tình yêu của anh!',
        'Chúc em có một ngày sinh nhật thật trọn vẹn!',
        'Anh luôn tự hào về em!',
        'Chúc em luôn là chính em, cô gái tuyệt vời!',
        'Thế giới của anh chỉ có em thôi!',
        'Chúc em tuổi mới thật nhiều sức khỏe!',
        'Mong mọi điều tốt lành sẽ đến với em!',
        'Chúc em luôn được bao bọc bởi tình yêu thương!',
        'Anh yêu em, hôm nay và mãi mãi!',
        'Chúc em một sinh nhật đáng nhớ!',
        'Em là món quà quý giá nhất của anh!',
        'Chúc em luôn giữ được sự hồn nhiên, đáng yêu!',
        'Chúc em có những quyết định sáng suốt trong tuổi mới!',
        'Anh sẽ luôn ủng hộ mọi quyết định của em!',
        'Chúc em luôn gặp may mắn trong cuộc sống!',
        'Chúc em có những người bạn thật tốt bên cạnh!',
        'Chúc em luôn được sống trong sự đủ đầy!',
        'Chúc em có một tương lai tươi sáng!',
        'Anh sẽ luôn là người lắng nghe em!',
        'Chúc em luôn tìm thấy niềm vui trong cuộc sống!',
        'Chúc em có một ngày thật nhiều quà!',
        'Chúc em luôn được yêu thương như một công chúa!',
        'Chúc em luôn là cô gái hạnh phúc nhất!',
        'Chúc em có một ngày sinh nhật thật bùng nổ!',
        'Chúc em luôn giữ được nụ cười trên môi!',
        'Chúc em có một tuổi mới thật nhiều ý nghĩa!',
        'Anh yêu tất cả những gì thuộc về em!',
        'Chúc em luôn là cô gái mạnh mẽ và độc lập!',
        'Chúc em có một ngày sinh nhật thật ấm áp bên gia đình!',
        'Em luôn là nguồn cảm hứng của anh!',
        'Chúc em có một tuổi mới thật nhiều trải nghiệm!',
        'Anh sẽ luôn là người đồng hành cùng em!',
        'Emmm luôn là cô gái xinh đẹp nhất trong mắt anh!'
    ];

    const wish = document.createElement('div');
    wish.className = 'wish-rain-item';
    wish.textContent = allWishes[Math.floor(Math.random() * allWishes.length)];
    wish.style.left = Math.random() * 100 + '%';
    wish.style.setProperty('--drift', (Math.random() - 0.5) * 150 + 'px');
    
    const baseDuration = 15 - rainSpeed * 1.2;
    wish.style.animationDuration = (baseDuration + Math.random() * 2) + 's';
    
    container.appendChild(wish);
    rainCounter++;
    updateRainCounter();
    
    wish.addEventListener('click', () => {
        createWishSparkle(wish);
        wish.remove();
    });
    
    setTimeout(() => {
        if (wish.parentElement) {
            wish.remove();
        }
    }, (baseDuration + 2) * 1000);
}

function updateRainCounter() {
    const counter = document.getElementById('rainCounter');
    if (counter) {
        counter.textContent = rainCounter;
        // Add animation when counter updates
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'countUp 0.3s ease';
        }, 10);
    }
}

function createWishSparkle(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: gold;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            border-radius: 50%;
            z-index: 10000;
        `;
        
        document.body.appendChild(sparkle);
        
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 30 + Math.random() * 30;
        
        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

// ==========================================
// GALLERY CAROUSEL
// ==========================================

let galleryState = {
    currentIndex: 0,
    images: [],
    track: null,
    indicators: null
};

function initGalleryCarousel() {
    galleryState.track = document.getElementById('carouselTrack');
    galleryState.indicators = document.getElementById('carouselIndicators');
    
    if (!galleryState.track) return;
    
    // Load images
    loadGalleryImages();
    
    // Setup controls
    document.getElementById('prevBtn').addEventListener('click', () => {
        navigateGallery(-1);
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        navigateGallery(1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigateGallery(-1);
        if (e.key === 'ArrowRight') navigateGallery(1);
    });
    
    // Auto play
    setInterval(() => {
        navigateGallery(1);
    }, 5000);
}

function loadGalleryImages() {
    // Sample images - replace with actual images
    const images = [
        { src: 'data/images/01.jpg', caption: 'Khoảnh khắc đẹp nhất' },
        { src: 'data/images/02.jpg', caption: 'Nụ cười tỏa nắng' },
        { src: 'data/images/03.jpg', caption: 'Bên nhau hạnh phúc' },
        { src: 'data/images/04.jpg', caption: 'Yêu em nhiều lắm' },
        { src: 'data/images/05.jpg', caption: 'Kỷ niệm đáng nhớ' },
        { src: 'data/images/06.jpg', caption: 'Tình yêu của chúng mình' },
        { src: 'data/images/07.jpg', caption: 'Mãi mãi bên nhau' },
        { src: 'data/images/1.jpg', caption: 'Em là cả thế giới của anh' }
    ];
    
    galleryState.images = images;
    
    // Create slides
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.caption;
        image.onerror = function() {
            this.src = 'data/images/sample1.jpg';
        };
        
        slide.appendChild(image);
        galleryState.track.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'indicator' + (index === 0 ? ' active' : '');
        indicator.addEventListener('click', () => {
            galleryState.currentIndex = index;
            updateGallery();
        });
        galleryState.indicators.appendChild(indicator);
    });
}

function navigateGallery(direction) {
    galleryState.currentIndex += direction;
    
    if (galleryState.currentIndex < 0) {
        galleryState.currentIndex = galleryState.images.length - 1;
    } else if (galleryState.currentIndex >= galleryState.images.length) {
        galleryState.currentIndex = 0;
    }
    
    updateGallery();
}

function updateGallery() {
    const offset = -galleryState.currentIndex * 100;
    galleryState.track.style.transform = `translateX(${offset}%)`;
    
    // Update indicators
    const indicators = galleryState.indicators.querySelectorAll('.indicator');
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === galleryState.currentIndex);
    });
}

// ==========================================
// TIMELINE & COUNTDOWN
// ==========================================

function initTimeline() {
    startCountdown();
    animateTimelineItems();
}

function startCountdown() {
    const birthday = new Date('2025-10-08T00:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('daysCount').textContent = String(days).padStart(2, '0');
            document.getElementById('hoursCount').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutesCount').textContent = String(minutes).padStart(2, '0');
            document.getElementById('secondsCount').textContent = String(seconds).padStart(2, '0');
            
            document.getElementById('countdownMessage').textContent = 
                `Còn ${days} ngày nữa là đến sinh nhật công chúa của anh! 🎂`;
        } else {
            document.getElementById('countdownMessage').textContent = 
                '🎉 Hôm nay là sinh nhật của em! Chúc mừng sinh nhật công chúa! 🎉';
            
            // Stop countdown
            clearInterval(countdownInterval);
            
            // Extra fireworks on birthday
            triggerBirthdayFireworks();
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

function animateTimelineItems() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animationDelay = '0s';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// ==========================================
// MUSIC PLAYER
// ==========================================

function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const music = document.getElementById('birthdayMusic');
    
    if (musicToggle && music) {
        musicToggle.addEventListener('click', () => {
            if (music.paused) {
                music.play();
                musicToggle.classList.add('playing');
            } else {
                music.pause();
                musicToggle.classList.remove('playing');
            }
        });
    }
}

// ==========================================
// FIREWORKS
// ==========================================

let fireworksCanvas, fireworksCtx;
let fireworksActive = false;
let particles = [];

function initFireworks() {
    fireworksCanvas = document.getElementById('fireworksCanvas');
    if (!fireworksCanvas) return;
    
    fireworksCtx = fireworksCanvas.getContext('2d');
    resizeFireworksCanvas();
    
    window.addEventListener('resize', resizeFireworksCanvas);
}

function resizeFireworksCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

function startFireworks() {
    fireworksActive = true;
    animateFireworks();
    
    // Create fireworks periodically
    const interval = setInterval(() => {
        if (!fireworksActive) {
            clearInterval(interval);
            return;
        }
        createFirework();
    }, 800);
    
    // Stop after 10 seconds
    setTimeout(() => {
        fireworksActive = false;
    }, 10000);
}

function createFirework() {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height * 0.5;
    const colors = ['#FF69B4', '#FFD700', '#FF1493', '#FFA500', '#FF6347', '#9370DB'];
    
    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 2 + Math.random() * 3;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 100,
            size: 2 + Math.random() * 3
        });
    }
}

function animateFireworks() {
    if (!fireworksActive && particles.length === 0) return;
    
    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= 1;
        
        if (p.life > 0) {
            fireworksCtx.beginPath();
            fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            fireworksCtx.fillStyle = p.color;
            fireworksCtx.globalAlpha = p.life / 100;
            fireworksCtx.fill();
            fireworksCtx.globalAlpha = 1;
            return true;
        }
        return false;
    });
    
    requestAnimationFrame(animateFireworks);
}

function triggerBirthdayFireworks() {
    // Extra special fireworks on birthday
    fireworksActive = true;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFirework(), i * 200);
    }
    
    setTimeout(() => {
        fireworksActive = false;
    }, 5000);
}

// ==========================================
// IMAGE MODAL
// ==========================================

function initModal() {
    const modal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function showImageModal(src, caption) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalImage) {
        modalImage.src = src;
        modalImage.style.display = 'block';
        modalCaption.textContent = caption || '';
        modalCaption.style.fontSize = '';
        modalCaption.style.padding = '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showWishModal(wishText) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalCaption) {
        // Hide image and show only the wish text
        modalImage.style.display = 'none';
        modalCaption.textContent = wishText;
        modalCaption.style.fontSize = '1.8rem';
        modalCaption.style.padding = '3rem';
        modalCaption.style.textAlign = 'center';
        modalCaption.style.lineHeight = '1.8';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function playSound(soundName) {
    // Placeholder for sound effects
    console.log('Playing sound:', soundName);
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c🎂 Chúc Mừng Sinh Nhật! 🎉', 'color: #FF69B4; font-size: 24px; font-weight: bold;');
console.log('%cMade with ❤️ for the most beautiful princess', 'color: #FFD700; font-size: 16px;');
