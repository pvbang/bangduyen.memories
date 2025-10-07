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
        '🎂 Chúc em sinh nhật vui vẻ, xinh đẹp mãi mãi!',
        '💝 Chúc em luôn khỏe mạnh và hạnh phúc!',
        '🌟 Chúc em đạt được mọi ước mơ và mục tiêu!',
        '💕 Anh yêu em rất nhiều!',
        '🎉 Chúc em có một ngày sinh nhật thật đặc biệt!',
        '✨ Em là điều tuyệt vời nhất trong đời anh!',
        '💖 Cảm ơn em đã đến bên anh!',
        '🎈 Chúc em tuổi mới tràn đầy niềm vui!',
        '🌈 Em là ánh sáng của cuộc đời anh!',
        '💫 Chúc em luôn rạng rỡ như vầng trăng!',
        '🎁 Em là món quà quý giá nhất của anh!',
        '🌹 Chúc em mãi xinh đẹp như hoa hồng!',
        '💗 Mỗi ngày bên em đều là sinh nhật của anh!',
        '🎊 Tuổi mới an khang, thịnh vượng!',
        '💓 Anh sẽ luôn ở bên che chở em!',
        '🌺 Em như đóa hoa đẹp nhất trong vườn!',
        '🎀 Chúc em luôn tươi trẻ và rạng rỡ!',
        '💝 Em là thiên thần của anh!',
        '🌸 Chúc em hạnh phúc vô bờ bến!',
        '💕 Yêu em từ ánh mặt trời đến vầng trăng!',
        '🎂 Sinh nhật em chính là ngày hạnh phúc nhất!',
        '✨ Ánh mắt em sáng hơn muôn vì sao!',
        '💖 Em là lý do anh mỉm cười mỗi ngày!',
        '🌟 Chúc em luôn tỏa sáng như ngôi sao!',
        '💗 Cuộc đời có em thật tuyệt vời!',
        '🎉 Chúc em luôn vui vẻ, khỏe mạnh!',
        '💝 Em là nữ hoàng trong trái tim anh!',
        '🌹 Mỗi ngày yêu em nhiều hơn ngày hôm qua!',
        '💕 Em là vũ trụ của anh!',
        '🎈 Chúc em có thật nhiều niềm vui!',
        '✨ Em làm cuộc sống anh thêm ý nghĩa!',
        '💖 Chúc em luôn được hạnh phúc như mơ ước!',
        '🌟 Em là công chúa duy nhất của anh!',
        '💗 Anh muốn ở bên em đến cuối đời!',
        '🎂 Sinh nhật vui vẻ người anh yêu!',
        '💝 Em xứng đáng có tất cả điều tốt đẹp nhất!',
        '🌹 Hương thơm của em ngát hơn cả hoa hồng!',
        '💕 Yêu em không cần lý do!',
        '🎉 Chúc em tuổi mới thật nhiều may mắn!',
        '✨ Nụ cười em làm anh quên đi mọi buồn phiền!',
        '💖 Em là ánh sáng dẫn đường cho anh!',
        '🌟 Chúc em luôn tỏa sáng rực rỡ!',
        '💗 Tình yêu dành cho em vô tận!',
        '🎂 Mong em luôn hạnh phúc bên anh!',
        '💝 Em là người phụ nữ tuyệt vời nhất!',
        '🌹 Anh tự hào vì có em!',
        '💕 Em làm anh tin vào tình yêu đích thực!',
        '🎈 Chúc em luôn giữ được nụ cười xinh đẹp!',
        '✨ Mỗi khoảnh khắc với em đều đáng trân quý!',
        '💖 Em là định mệnh của anh!',
        '🌟 Chúc em thành công trong mọi lĩnh vực!',
        '💗 Anh sẽ yêu em đến hơi thở cuối cùng!',
        '🎉 Sinh nhật em, anh cũng hạnh phúc!',
        '💝 Em là điều kỳ diệu trong đời anh!',
        '🌹 Tình yêu của anh dành cho em là vĩnh cửu!',
        '💕 Em khiến trái tim anh luôn rộn ràng!',
        '🎂 Chúc em tuổi mới thật nhiều thành công!',
        '✨ Em là nguồn cảm hứng của anh!',
        '💖 Mỗi ngày với em là một món quà!',
        '🌟 Chúc em luôn xinh đẹp như hôm nay!',
        '💗 Anh may mắn vì được yêu em!',
        '🎈 Hy vọng ước mơ của em sẽ thành hiện thực!',
        '💝 Em là điểm sáng nhất trong cuộc đời anh!',
        '🌹 Yêu em nhiều hơn cả vạn từ ngữ!',
        '💕 Em là bản nhạc ngọt ngào nhất!',
        '🎉 Chúc em sinh nhật thật ý nghĩa!',
        '✨ Em là thiên đường trên trái đất!',
        '💖 Anh không thể tưởng tượng cuộc sống không có em!',
        '🌟 Chúc em luôn tràn đầy năng lượng tích cực!',
        '💗 Tình yêu của anh dành cho em là vô hạn!',
        '🎂 Mong em luôn giữ được sự thuần khiết!',
        '💝 Em là báu vật quý giá nhất của anh!',
        '🌹 Anh sẽ luôn bên em trong mọi hoàn cảnh!',
        '💕 Em làm anh tin vào điều kỳ diệu!',
        '🎈 Chúc em luôn tự tin và mạnh mẽ!',
        '✨ Em là lý do anh tỉnh dậy mỗi sáng!',
        '💖 Yêu em là quyết định đúng đắn nhất!',
        '🌟 Chúc em luôn gặp may mắn và thuận lợi!',
        '💗 Anh muốn tạo nên ký ức đẹp cùng em!',
        '🎉 Sinh nhật em, anh cũng vui như hội!',
        '💝 Em là người phụ nữ anh muốn cưới!',
        '🌹 Tình yêu của anh dành cho em không bao giờ phai!',
        '💕 Em khiến anh tin vào hạnh phúc!',
        '🎂 Chúc em tuổi mới nhiều niềm vui!',
        '✨ Em là câu trả lời cho mọi câu hỏi của anh!',
        '💖 Mỗi giây phút với em đều quý giá!',
        '🌟 Chúc em luôn rạng ngời như mặt trời!',
        '💗 Anh muốn đi cùng em đến tận cùng thế giới!',
        '🎈 Hy vọng tuổi mới sẽ thật tuyệt vời!',
        '💝 Em là điểm đến cuối cùng của anh!',
        '🌹 Yêu em không chỉ là cảm xúc mà là cam kết!',
        '💕 Em làm trái tim anh đập mạnh hơn!',
        '🎉 Chúc em có thật nhiều kỷ niệm đẹp!',
        '✨ Em là giấc mơ trở thành hiện thực!',
        '💖 Anh biết ơn vì có em trong đời!',
        '🌟 Chúc em luôn được yêu thương và trân trọng!',
        '💗 Tình yêu của anh dành cho em là chân thành!',
        '🎂 Mong em luôn khỏe mạnh và hạnh phúc!',
        '💝 Em là người duy nhất anh muốn ở bên!',
        '🌹 Anh sẽ yêu em mãi mãi!',
        '💕 Em khiến anh muốn trở thành người tốt hơn!',
        '🎈 Chúc em luôn giữ được sự trong sáng!',
        '✨ Em là phép màu trong cuộc đời anh!',
        '💖 Yêu em là điều tuyệt vời nhất anh làm!',
        '🌟 Chúc em đạt được mọi điều mình mong muốn!',
        '💗 Anh muốn làm em hạnh phúc mỗi ngày!',
        '🎉 Sinh nhật vui vẻ công chúa của anh!',
        '💝 Em là tất cả những gì anh cần!',
        '🌹 Tình yêu của anh dành cho em là bất diệt!',
        '💕 Em làm cuộc sống anh thêm màu sắc!',
        '🎂 Chúc em tuổi mới thật nhiều điều tốt lành!',
        '✨ Em là thiên sứ được gửi đến cho anh!',
        '💖 Mỗi ngày yêu em là một ngày hạnh phúc!',
        '🌟 Chúc em luôn tự tin và xinh đẹp!',
        '💗 Anh sẽ luôn ở đây vì em!',
        '🎈 Hy vọng em sẽ luôn mỉm cười!',
        '💝 Em là kho báu quý giá nhất!',
        '🌹 Yêu em nhiều hơn cả cuộc đời này!',
        '💕 Em khiến anh tin vào tương lai tươi sáng!',
        '🎉 Chúc em sinh nhật thật ý nghĩa và đặc biệt!',
        '✨ Em là lý do anh tồn tại!',
        '💖 Anh không thể thiếu em được!',
        '🌟 Chúc em luôn được bình an và hạnh phúc!',
        '💗 Tình yêu của anh dành cho em là mãnh liệt!',
        '🎂 Mong em luôn giữ được nét đẹp tâm hồn!',
        '💝 Em là điểm tựa vững chắc của anh!',
        '🌹 Anh sẽ bảo vệ em suốt đời!',
        '💕 Em làm anh tin vào tình yêu đích thực!',
        '🎈 Chúc em tuổi mới thật nhiều niềm vui!',
        '✨ Em là món quà trời ban cho anh!',
        '💖 Yêu em là hạnh phúc lớn nhất của anh!',
        '🌟 Chúc em luôn rạng rỡ như ngày hôm nay!',
        '💗 Anh muốn tạo nên câu chuyện tình đẹp cùng em!',
        '🎉 Sinh nhật em, anh cũng hạnh phúc!',
        '💝 Em là người phụ nữ anh yêu nhất!',
        '🌹 Tình yêu của anh dành cho em là vĩnh hằng!',
        '💕 Em khiến trái tim anh luôn ấm áp!',
        '🎂 Chúc em tuổi mới thật nhiều may mắn!',
        '✨ Em là ánh sáng dẫn lối cho anh!',
        '💖 Mỗi khoảnh khắc với em đều đáng nhớ!',
        '🌟 Chúc em luôn xinh đẹp và duyên dáng!',
        '💗 Anh may mắn vì được yêu em!',
        '🎈 Hy vọng ước mơ của em sẽ thành sự thật!',
        '💝 Em là niềm vui lớn nhất của anh!',
        '🌹 Yêu em không có điểm dừng!',
        '💕 Em là bản tình ca ngọt ngào nhất!',
        '🎉 Chúc em sinh nhật thật ý nghĩa!',
        '✨ Em là thiên đường của anh!',
        '💖 Anh không thể sống thiếu em!',
        '🌟 Chúc em luôn tràn đầy sức sống!',
        '💗 Tình yêu của anh dành cho em là bất tận!',
        '🎂 Mong em luôn hạnh phúc và xinh đẹp!',
        '💝 Em là kỳ tích trong cuộc đời anh!',
        '🌹 Anh sẽ yêu em đến trọn đời!',
        '💕 Em làm anh tin vào phép màu tình yêu!',
        '🎈 Chúc em luôn tự tin và mạnh mẽ!',
        '✨ Em là nguồn động lực của anh!',
        '💖 Yêu em là quyết định tốt nhất!',
        '🌟 Chúc em luôn gặp nhiều điều may mắn!',
        '💗 Anh muốn tạo nên hạnh phúc cho em!',
        '🎉 Sinh nhật vui vẻ người anh thương!',
        '💝 Em là tất cả ý nghĩa cuộc đời anh!',
        '🌹 Tình yêu của anh dành cho em là thiêng liêng!',
        '💕 Em khiến anh tin vào điều kỳ diệu!',
        '🎂 Chúc em tuổi mới nhiều thành công!',
        '✨ Em là phép nhiệm màu của cuộc đời!',
        '💖 Mỗi ngày với em đều là quà tặng!',
        '🌟 Chúc em luôn rạng ngời và tươi trẻ!',
        '💗 Anh muốn đi bên em suốt cuộc đời!',
        '🎈 Hy vọng tuổi mới sẽ thật tuyệt vời!',
        '💝 Em là viên kim cương quý giá nhất!',
        '🌹 Yêu em hết lòng, hết sức!',
        '💕 Em là giai điệu ngọt ngào của anh!',
        '🎉 Chúc em có sinh nhật thật đặc biệt!',
        '✨ Em là giấc mơ đẹp nhất của anh!',
        '💖 Anh biết ơn số phận đã cho anh gặp em!',
        '🌟 Chúc em luôn được yêu thương!',
        '💗 Tình yêu của anh dành cho em là vô điều kiện!',
        '🎂 Mong em luôn khỏe mạnh và bình an!',
        '💝 Em là người duy nhất trong trái tim anh!',
        '🌹 Anh sẽ yêu em đến muôn đời!',
        '💕 Em khiến anh muốn trở thành phiên bản tốt hơn!',
        '🎈 Chúc em luôn giữ được nụ cười rạng rỡ!',
        '✨ Em là điều kỳ diệu nhất anh có!',
        '💖 Yêu em là hạnh phúc của anh!',
        '🌟 Chúc em đạt được mọi ước mơ!',
        '💗 Anh muốn làm em hạnh phúc mỗi ngày!',
        '🎉 Sinh nhật vui vẻ thiên thần của anh!',
        '💝 Em là tất cả những gì anh mơ ước!',
        '🌹 Tình yêu của anh là mãi mãi!',
        '💕 Em làm cuộc đời anh thêm ý nghĩa!',
        '🎂 Chúc em tuổi mới thật nhiều điều tốt đẹp!',
        '✨ Em là thiên thần giữ hộ của anh!',
        '💖 Mỗi giây phút yêu em đều quý giá!',
        '🌟 Chúc em luôn tự tin và xinh đẹp!',
        '💗 Anh sẽ luôn ở bên em!',
        '🎈 Hy vọng em sẽ luôn hạnh phúc!',
        '💝 Em là kho báu của cuộc đời anh!',
        '🌹 Yêu em hết cả cuộc đời này!',
        '💕 Em khiến anh tin vào tình yêu vĩnh cửu!'
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

// Load all images from data/images folder
async function loadAllImages() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const imageFiles = [];
    
    // List of all image files found in the folder
    const allFiles = [
        '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '1.jpg',
        '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg',
        '1746200909303.jpeg', '1747067123386.jpeg', '1747067180800.jpeg', '1747067233550.jpeg',
        '1747067377216.jpeg', '1747067566732.jpeg', '1747099503744.jpeg', '1747099524839.jpeg',
        '1747099551492.jpeg', '1747235274333.jpeg', '1747238412990.jpeg', '1747239265754.jpeg',
        '1747239328966.jpeg', '1747239447440.jpeg', '1747239480929.jpeg', '1747239539239.jpeg',
        '1747240525084.jpeg', '1747240648734.jpeg', '1747240670827.jpeg', '1747240686586.jpeg',
        '1747412046797.jpeg', '1747412078362.jpeg', '1747412179832.jpeg', '1747412197264.jpeg',
        '1747412229986.jpeg', '1747412248449.jpeg', '1747752182072.jpg', '1748167005387.jpg',
        '1748167021792.jpg', '1748167045099.jpg', '1748167130901.jpg', '1748167239073.jpg',
        '1748167250999.jpg', '1748167269854.jpg', '1748167285383.jpg', '1748167297102.jpg',
        '1748167325416.jpg', '1748447472848.jpeg', '1748447539697.jpeg', '1748447865723.jpeg',
        '1748447902717.jpeg'
    ];
    
    // Add sample captions
    const captions = [
        'Khoảnh khắc đẹp nhất', 'Nụ cười ngọt ngào', 'Bên nhau hạnh phúc',
        'Yêu em nhiều lắm', 'Kỷ niệm đáng nhớ', 'Tình yêu của chúng mình',
        'Mãi mãi bên nhau', 'Em là cả thế giới', 'Những ngày tuyệt vời',
        'Hạnh phúc giản đơn', 'Kỷ niệm không phai', 'Cùng nhau mỗi ngày',
        'Em xinh đẹp nhất', 'Tình yêu vĩnh cửu', 'Chúng mình bên nhau'
    ];
    
    allFiles.forEach((file, index) => {
        imageFiles.push({
            src: `data/images/${file}`,
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
let rainSpeed = 3; // Giảm tốc độ mặc định cho chậm hơn
let rainDensity = 10;
let rainCounter = 0;

function initWishesRain() {
    // Mưa sẽ tự động bắt đầu sau khi mở hộp quà
    
    // Set optimal values for continuous rain
    rainSpeed = 3; // Chậm hơn để dễ đọc
    rainDensity = 10;
    
    // Setup slider controls
    const speedSlider = document.getElementById('speedSlider');
    const densitySlider = document.getElementById('densitySlider');
    const speedValue = document.getElementById('speedValue');
    const densityValue = document.getElementById('densityValue');
    
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            rainSpeed = parseInt(e.target.value);
            speedValue.textContent = rainSpeed;
        });
    }
    
    if (densitySlider) {
        densitySlider.addEventListener('input', (e) => {
            rainDensity = parseInt(e.target.value);
            densityValue.textContent = rainDensity;
        });
    }
}

function startWishesRain() {
    const container = document.getElementById('wishesRain');
    
    // All 200+ wishes are already loaded in loadUniverseContent()
    // Let's use a comprehensive wish list
    const allWishes = [
        '🎂 Sinh nhật vui vẻ công chúa của anh!',
        '💝 Chúc em luôn xinh đẹp rạng ngời!',
        '🌟 Chúc em đạt được mọi ước mơ!',
        '💕 Anh yêu em rất nhiều!',
        '🎉 Chúc em có một ngày tuyệt vời!',
        '✨ Em là điều tuyệt vời nhất!',
        '💖 Cảm ơn em đã đến bên anh!',
        '🎈 Tuổi mới an khang, hạnh phúc!',
        '🌈 Em là ánh sáng của đời anh!',
        '💫 Luôn yêu thương và che chở em!',
        '🎁 Món quà lớn nhất là có em!',
        '🌹 Em mãi là nàng công chúa của anh!',
        '💗 Hạnh phúc là được ở bên em!',
        '🎊 Chúc em ngày càng xinh đẹp!',
        '💓 Anh sẽ luôn bên em mãi mãi!',
        '🎂 Em là vũ trụ của anh!',
        '💝 Chúc em luôn khỏe mạnh!',
        '🌟 Em là ngôi sao sáng nhất!',
        '💕 Yêu em hết cả trái tim!',
        '🎉 Sinh nhật em là ngày hạnh phúc!',
        '✨ Em làm anh tin vào tình yêu!',
        '💖 Mỗi ngày với em đều tuyệt vời!',
        '🎈 Chúc em luôn mỉm cười!',
        '🌈 Em là cầu vồng sau mưa!',
        '💫 Anh muốn ở bên em mãi mãi!',
        '🎁 Em xứng đáng mọi điều tốt đẹp!',
        '🌹 Hoa hồng cũng không đẹp bằng em!',
        '💗 Tình yêu anh dành cho em vô tận!',
        '🎊 Chúc em tuổi mới thật nhiều niềm vui!',
        '💓 Em là tất cả của anh!',
        '🎂 Chúc em sinh nhật thật ý nghĩa!',
        '💝 Em là thiên thần của anh!',
        '🌟 Chúc em luôn tỏa sáng!',
        '💕 Anh không thể thiếu em!',
        '🎉 Mong em luôn hạnh phúc!',
        '✨ Em là phép màu của đời anh!',
        '💖 Yêu em nhiều hơn ngày hôm qua!',
        '🎈 Chúc em mọi điều may mắn!',
        '🌈 Em là màu sắc cuộc đời anh!',
        '💫 Chúc em luôn được yêu thương!',
        // Add more variations...
        '🎁 Em là kho báu của anh!',
        '🌹 Tình yêu của anh là vĩnh cửu!',
        '💗 Anh sẽ yêu em đến hơi thở cuối!',
        '🎊 Chúc em thành công trong mọi việc!',
        '💓 Em là lý do anh sống!',
        '🎂 Tuổi mới nhiều điều tốt lành!',
        '💝 Em là giấc mơ thành hiện thực!',
        '🌟 Chúc em luôn rực rỡ!',
        '💕 Yêu em đến tận cùng vũ trụ!',
        '🎉 Sinh nhật vui vẻ người yêu!'
    ];
    
    wishesRainActive = true;
    rainCounter = 0;
    updateRainCounter();
    
    function createWish() {
        // Mưa rơi liên tục không dừng
        
        const wish = document.createElement('div');
        wish.className = 'wish-rain-item';
        wish.textContent = allWishes[Math.floor(Math.random() * allWishes.length)];
        wish.style.left = Math.random() * 100 + '%';
        wish.style.setProperty('--drift', (Math.random() - 0.5) * 150 + 'px');
        
        // Adjust speed based on slider
        const baseDuration = 10 - rainSpeed;
        wish.style.animationDuration = (baseDuration + Math.random() * 2) + 's';
        
        container.appendChild(wish);
        rainCounter++;
        updateRainCounter();
        
        // Create sparkle effect on click
        wish.addEventListener('click', () => {
            createWishSparkle(wish);
            wish.remove();
        });
        
        setTimeout(() => {
            if (wish.parentElement) {
                wish.remove();
            }
        }, (baseDuration + 2) * 1000);
        
        // Always create next wish - continuous rain
        const delay = 1000 / rainDensity + Math.random() * 500;
        setTimeout(createWish, delay);
    }
    
    // Start multiple streams for higher density
    for (let i = 0; i < Math.min(rainDensity, 5); i++) {
        setTimeout(createWish, i * 200);
    }
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
        modalCaption.textContent = caption || '';
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
