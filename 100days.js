// ==========================================
// 100 DAYS CELEBRATION PAGE - JAVASCRIPT
// Interactive & Animated Features
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initScrollAnimations();
    initCounterAnimations();
    initImageLazyLoading();
    initSmoothScrolling();
    initInteractiveElements();
    initHeartRain();
    
    // Show page after initialization
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
});

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                // Special handling for quote cards
                if (entry.target.classList.contains('quote-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                }
                
                // Special handling for gallery items
                if (entry.target.classList.contains('gallery-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.timeline-item, .stat-card, .quote-card, .gallery-item, .dream-item');
    animatedElements.forEach(el => {
        // Set initial states
        if (el.classList.contains('timeline-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s ease';
        } else if (el.classList.contains('quote-card') || el.classList.contains('gallery-item')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.9)';
            el.style.transition = 'all 0.6s ease';
        } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
        }
        
        observer.observe(el);
    });
}

// Counter animations for stats
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = counter.textContent;
        const isInfinity = target === '∞';
        
        if (isInfinity) {
            // Special animation for infinity symbol
            counter.style.animation = 'infinityPulse 2s ease-in-out infinite';
            return;
        }
        
        const numericTarget = parseInt(target.replace(/,/g, ''));
        const duration = 2000; // 2 seconds
        const increment = numericTarget / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current >= numericTarget) {
                counter.textContent = numericTarget.toLocaleString();
                return;
            }
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    };
    
    // Add CSS for infinity animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes infinityPulse {
            0%, 100% { transform: scale(1); color: #2C3E50; }
            50% { transform: scale(1.1); color: #FF69B4; }
        }
    `;
    document.head.appendChild(style);
    
    // Observe stat cards for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    setTimeout(() => animateCounter(counter), 300);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });
}

// Lazy loading for images with better error handling
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const originalSrc = img.src;
                
                // Add loading class
                img.classList.add('loading');
                
                // Create a new image to test loading
                const testImg = new Image();
                
                testImg.onload = () => {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    // Ensure the src is set correctly
                    img.src = originalSrc;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                
                testImg.onerror = () => {
                    console.warn('Image failed to load:', originalSrc);
                    img.style.display = 'none';
                    
                    // Try alternative image paths
                    const filename = originalSrc.split('/').pop();
                    const alternatives = [
                        `data/images/${filename}`,
                        `data/gif/${filename}`,
                        originalSrc.replace('data/images/', 'data/gif/'),
                        originalSrc.replace('.jpg', '.jpeg'),
                        originalSrc.replace('.jpeg', '.jpg')
                    ];
                    
                    tryAlternativeImages(img, alternatives, 0);
                };
                
                testImg.src = originalSrc;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Function to try alternative image paths
function tryAlternativeImages(img, alternatives, index) {
    if (index >= alternatives.length) {
        img.style.display = 'none';
        return;
    }
    
    const testImg = new Image();
    testImg.onload = () => {
        img.src = alternatives[index];
        img.style.display = 'block';
        img.style.opacity = '1';
    };
    
    testImg.onerror = () => {
        tryAlternativeImages(img, alternatives, index + 1);
    };
    
    testImg.src = alternatives[index];
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Interactive elements
function initInteractiveElements() {
    // Milestone badge interaction
    const milestoneBadge = document.querySelector('.milestone-badge');
    if (milestoneBadge) {
        milestoneBadge.addEventListener('mouseenter', () => {
            milestoneBadge.style.animation = 'pulseGlow 1s ease-in-out infinite';
        });
        
        milestoneBadge.addEventListener('mouseleave', () => {
            milestoneBadge.style.animation = 'pulseGlow 3s ease-in-out infinite';
        });
    }
    
    // Quote cards hover effects
    const quoteCards = document.querySelectorAll('.quote-card');
    quoteCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.background = 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = '#FFFFFF';
        });
    });
    
    // Gallery item interactions
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create full-screen overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                backdrop-filter: blur(10px);
            `;
            
            const img = item.querySelector('img');
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            fullImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(255, 182, 193, 0.3);
                animation: fadeInScale 0.3s ease;
            `;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
            
            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);
            
            // Close on click
            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.head.removeChild(style);
                }, 300);
            });
            
            // Add fade out animation
            style.textContent += `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
        });
    });
    
    // Timeline item interactions
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const marker = item.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'translateX(-50%) scale(1.1)';
                marker.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const marker = item.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'translateX(-50%) scale(1)';
            }
        });
    });
}

// Heart rain effect
function initHeartRain() {
    const heartRainButton = document.createElement('button');
    heartRainButton.innerHTML = '💖 Mưa chí tymmm';
    heartRainButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: linear-gradient(135deg, #FFB6C1 0%, #FF91A4 50%, #FF69B4 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(255, 182, 193, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        font-family: 'Poppins', sans-serif;
    `;
    
    heartRainButton.addEventListener('mouseenter', () => {
        heartRainButton.style.transform = 'translateY(-3px)';
        heartRainButton.style.boxShadow = '0 12px 40px rgba(255, 182, 193, 0.4)';
    });
    
    heartRainButton.addEventListener('mouseleave', () => {
        heartRainButton.style.transform = 'translateY(0)';
        heartRainButton.style.boxShadow = '0 8px 32px rgba(255, 182, 193, 0.3)';
    });
    
    heartRainButton.addEventListener('click', createHeartRain);
    document.body.appendChild(heartRainButton);
}

function createHeartRain() {
    const hearts = ['💖', '💕', '💗', '💘', '💝', '❤️', '💓', '💞'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 20}px;
                pointer-events: none;
                z-index: 9999;
                animation: heartFall ${Math.random() * 3 + 3}s linear forwards;
            `;
            
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (container.contains(heart)) {
                    container.removeChild(heart);
                }
            }, 6000);
        }, i * 100);
    }
    
    // Add heart fall animation if not exists
    if (!document.querySelector('#heartFallStyle')) {
        const style = document.createElement('style');
        style.id = 'heartFallStyle';
        style.textContent = `
            @keyframes heartFall {
                0% {
                    transform: translateY(-50px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Error handling for images with retry mechanism
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        const originalSrc = img.src;
        
        console.warn('Image failed to load:', originalSrc);
        
        // Try alternative paths
        const filename = originalSrc.split('/').pop();
        const alternatives = [
            `data/images/${filename}`,
            originalSrc.replace('.jpg', '.jpeg'),
            originalSrc.replace('.jpeg', '.jpg'),
            originalSrc.replace('data/images/', 'data/gif/'),
            `data/gif/${filename}`
        ];
        
        let attemptIndex = 0;
        
        const tryNextImage = () => {
            if (attemptIndex < alternatives.length) {
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = alternatives[attemptIndex];
                    img.style.display = 'block';
                };
                testImg.onerror = () => {
                    attemptIndex++;
                    tryNextImage();
                };
                testImg.src = alternatives[attemptIndex];
            } else {
                // All alternatives failed, hide the image
                img.style.display = 'none';
                console.error('All image alternatives failed for:', originalSrc);
            }
        };
        
        tryNextImage();
    }
}, true);

// Performance optimization with better image preloading
window.addEventListener('load', () => {
    // Preload critical images with fallbacks
    const criticalImages = [
        'data/images/gif01.gif',
        'data/images/gif02.gif',
        'data/images/01.jpg',
        'data/images/02.jpg',
        'data/images/03.jpg',
        'data/images/04.jpg',
        'data/images/img01.jpg',
        'data/images/img02.jpg',
        'data/images/img03.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.onload = () => {
            console.log('Preloaded:', src);
        };
        img.onerror = () => {
            console.warn('Failed to preload:', src);
        };
        img.src = src;
    });
    
    // Initialize special effects for GIFs
    initGifEffects();
});

// Special effects for GIFs
function initGifEffects() {
    const gifs = document.querySelectorAll('img[src*=".gif"]');
    
    gifs.forEach(gif => {
        gif.addEventListener('mouseenter', () => {
            gif.style.transform = 'scale(1.1) rotate(5deg)';
            gif.style.transition = 'transform 0.3s ease';
        });
        
        gif.addEventListener('mouseleave', () => {
            gif.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Add sparkle effect around GIFs
        createSparklesAroundElement(gif);
    });
}

// Create sparkle effect around element
function createSparklesAroundElement(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'gif-sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
            animation: sparkleGif 2s ease-in-out infinite;
            animation-delay: ${i * 0.25}s;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
        `;
        
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 2000);
    }
    
    // Add sparkle animation CSS if not exists
    if (!document.querySelector('#sparkleGifStyle')) {
        const style = document.createElement('style');
        style.id = 'sparkleGifStyle';
        style.textContent = `
            @keyframes sparkleGif {
                0%, 100% {
                    opacity: 0;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1) rotate(180deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #FFB6C1, #FF91A4, #FF69B4);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';
        createHeartRain();
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 5000);
        
        konamiCode = [];
    }
});
