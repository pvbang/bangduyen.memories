// 1 YEAR ANNIVERSARY - JavaScript
document.addEventListener("DOMContentLoaded", function () {
    createFloatingHearts();
    initFireworks();
    initEnvelope();
    initRevealSections();
    initJourneyObserver();
    animateStats();
    initMusic();
});

// FLOATING HEARTS
function createFloatingHearts() {
    const container = document.getElementById("floatingHearts");
    const hearts = ["💕", "💖", "💗", "💝", "❤️", "🌸", "✨", "🩷"];
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement("div");
        heart.className = "float-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 8 + "s";
        heart.style.animationDuration = (6 + Math.random() * 6) + "s";
        heart.style.fontSize = (14 + Math.random() * 20) + "px";
        container.appendChild(heart);
    }
}

// FIREWORKS
function initFireworks() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ["#FF69B4", "#FFD700", "#FF1493", "#FF91A4", "#FFC0CB", "#FF6B6B", "#FFE66D"];

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = 0.01 + Math.random() * 0.02;
            this.size = Math.random() * 3 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.03;
            this.alpha -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createBurst(x, y) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Auto fireworks on load
    let count = 0;
    const autoFireworks = setInterval(() => {
        createBurst(
            Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
            Math.random() * canvas.height * 0.4 + 50
        );
        count++;
        if (count > 8) clearInterval(autoFireworks);
    }, 600);

    canvas.parentElement.addEventListener("click", (e) => {
        createBurst(e.clientX, e.clientY);
    });
}

// ENVELOPE
function initEnvelope() {
    const envelope = document.getElementById("envelope");
    if (!envelope) return;
    envelope.addEventListener("click", () => {
        envelope.classList.toggle("opened");
    });
}

// REVEAL SECTIONS ON SCROLL
function initRevealSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".reveal-section").forEach(el => observer.observe(el));
}

// JOURNEY ITEMS OBSERVER
function initJourneyObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".journey-item").forEach(el => observer.observe(el));
}

// ANIMATE STAT NUMBERS
function animateStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nums = entry.target.querySelectorAll(".stat-number[data-target]");
                nums.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    animateNumber(num, 0, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) observer.observe(statsSection);
}

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// MUSIC
function initMusic() {
    const btn = document.getElementById("musicToggle");
    const audio = document.getElementById("bgMusic");
    if (!btn || !audio) return;

    btn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            btn.classList.add("playing");
        } else {
            audio.pause();
            btn.classList.remove("playing");
        }
    });
}
