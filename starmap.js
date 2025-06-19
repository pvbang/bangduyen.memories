// Starmap Interactive Effects
document.addEventListener('DOMContentLoaded', function() {
    initializeStarmap();
    initializeQuoteCarousel();
    initializeInteractiveStars();
    initializeScrollAnimations();
    createDynamicStars();
    initializeMobileMenu();
});

// Initialize starmap effects
function initializeStarmap() {
    // Add parallax effect to constellations
    const constellations = document.querySelectorAll('.constellation');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        constellations.forEach((constellation, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            constellation.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Quote carousel functionality
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote-card');

function initializeQuoteCarousel() {
    // Auto-rotate quotes
    setInterval(changeQuote, 8000);
}

function changeQuote(direction = 1) {
    quotes[currentQuote].classList.remove('active');
    
    currentQuote += direction;
    
    if (currentQuote >= quotes.length) {
        currentQuote = 0;
    } else if (currentQuote < 0) {
        currentQuote = quotes.length - 1;
    }
    
    quotes[currentQuote].classList.add('active');
}

// Interactive star effects
function initializeInteractiveStars() {
    const stars = document.querySelectorAll('.constellation .star');
    
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.textShadow = '0 0 30px rgba(255, 255, 255, 1)';
            
            // Show star name tooltip
            const name = this.getAttribute('data-name') || this.getAttribute('title');
            if (name) {
                showStarTooltip(this, name);
            }
        });
        
        star.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.textShadow = '';
            hideStarTooltip();
        });
        
        star.addEventListener('click', function() {
            createStarBurst(this);
        });
    });
}

// Show star tooltip
function showStarTooltip(star, name) {
    let tooltip = document.getElementById('star-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'star-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            pointer-events: none;
            z-index: 1000;
            font-size: 0.9rem;
            font-weight: 500;
            border: 1px solid rgba(102, 126, 234, 0.5);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            max-width: 200px;
            text-align: center;
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = name;
    tooltip.style.display = 'block';
    
    // Position tooltip above the star
    const rect = star.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 15;
    
    // Ensure tooltip stays within viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = rect.bottom + 10;
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Hide star tooltip
function hideStarTooltip() {
    const tooltip = document.getElementById('star-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Create star burst effect
function createStarBurst(star) {
    const burst = document.createElement('div');
    burst.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #fff 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
    `;
    
    const rect = star.getBoundingClientRect();
    const container = star.closest('.constellation-canvas');
    const containerRect = container.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = burst.cloneNode();
        particle.style.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top - containerRect.top + rect.height / 2) + 'px';
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${endX}px, ${endY}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
        
        container.appendChild(particle);
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.compatibility-aspect, .person-card, .timeline-item, .location-card, .planet-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Create dynamic background stars
function createDynamicStars() {
    const starContainer = document.querySelector('.stars-background');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
        `;
        
        if (Math.random() > 0.7) {
            star.classList.add('bright');
        } else if (Math.random() > 0.5) {
            star.classList.add('dim');
        }
        
        starContainer.appendChild(star);
    }
}

// Compatibility score animation
function animateCompatibilityScore() {
    const scoreElement = document.querySelector('.score-number');
    if (!scoreElement) return;
    
    let currentScore = 0;
    const targetScore = 89;
    const increment = targetScore / 60; // 60 frames for smooth animation
    
    const animate = () => {
        currentScore += increment;
        if (currentScore < targetScore) {
            scoreElement.textContent = Math.floor(currentScore) + '%';
            requestAnimationFrame(animate);
        } else {
            scoreElement.textContent = targetScore + '%';
        }
    };
    
    animate();
}

// Initialize compatibility score animation when it comes into view
const scoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCompatibilityScore();
            scoreObserver.unobserve(entry.target);
        }
    });
});

const scoreElement = document.querySelector('.compatibility-score');
if (scoreElement) {
    scoreObserver.observe(scoreElement);
}

// Add CSS animations for scroll-triggered elements
const style = document.createElement('style');
style.textContent = `
    .compatibility-aspect,
    .person-card,
    .timeline-item,
    .location-card,
    .planet-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .compatibility-aspect.animate-in,
    .person-card.animate-in,
    .timeline-item.animate-in,
    .location-card.animate-in,
    .planet-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .connection-text {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        font-family: "Dancing Script", cursive;
        animation: fadeInOut 3s ease-in-out infinite;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
`;

document.head.appendChild(style);

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate elements in sequence
    setTimeout(() => {
        document.querySelector('.starmap-header').classList.add('animate-in');
    }, 200);
    
    setTimeout(() => {
        document.querySelector('.constellation-container').classList.add('animate-in');
    }, 400);
    
    setTimeout(() => {
        document.querySelector('.couple-info-section').classList.add('animate-in');
    }, 600);
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const headerActions = document.getElementById('headerActions');
    
    if (mobileMenuToggle && headerActions) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            headerActions.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (headerActions.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !headerActions.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                headerActions.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const menuLinks = headerActions.querySelectorAll('.back-btn');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                headerActions.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                headerActions.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}
