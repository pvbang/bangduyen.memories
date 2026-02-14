// ═══════════════════════════════════════════
// VALENTINE'S DAY - PIXEL LOVE INTERACTIVE
// ═══════════════════════════════════════════

(function () {
    'use strict';

    // ========== STATE ==========
    let currentSection = 0;
    const sections = [
        'intro-screen',
        'love-letter-section',
        'question-section',
        'promise-section',
        'activities-section',
        'final-section'
    ];
    let musicPlaying = false;
    let noClickCount = 0;
    let yesBtnScale = 1;
    let noBtnScale = 1;
    let flippedCards = 0;
    const totalPromiseCards = 6;
    let selectedColor = '#ff2d55';
    let isDrawing = false;
    let pixelSize = 20; // 320 / 16 = 20px grid
    let loveJarCount = 0;

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', function () {
        initPixelHeartRain();
        initIntro();
        initMusic();

        // Activities next button
        const activitiesNextBtn = document.getElementById('activitiesNextBtn');
        if (activitiesNextBtn) {
            activitiesNextBtn.addEventListener('click', function () {
                goToSection(5);
            });
        }
    });

    // ═══════════════════════════════════════════
    // PIXEL HEART RAIN (Canvas Background)
    // ═══════════════════════════════════════════
    function initPixelHeartRain() {
        const canvas = document.getElementById('pixelHeartCanvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const hearts = [];
        const heartColors = ['#ff2d55', '#ff6b9d', '#ff9ed8', '#e8a0ff', '#ffd700'];

        // Pixel heart shape (5x5 grid)
        const heartShape = [
            [0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0]
        ];

        function createHeart() {
            return {
                x: Math.random() * canvas.width,
                y: -30,
                size: 2 + Math.random() * 4,
                speed: 0.5 + Math.random() * 1.5,
                color: heartColors[Math.floor(Math.random() * heartColors.length)],
                opacity: 0.2 + Math.random() * 0.5,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.02 + Math.random() * 0.03
            };
        }

        // Initialize hearts
        for (let i = 0; i < 25; i++) {
            const h = createHeart();
            h.y = Math.random() * canvas.height;
            hearts.push(h);
        }

        function drawPixelHeart(x, y, size, color, opacity) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            for (let row = 0; row < heartShape.length; row++) {
                for (let col = 0; col < heartShape[row].length; col++) {
                    if (heartShape[row][col]) {
                        ctx.fillRect(
                            x + col * size,
                            y + row * size,
                            size, size
                        );
                    }
                }
            }
            ctx.globalAlpha = 1;
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            hearts.forEach((h, i) => {
                h.y += h.speed;
                h.wobble += h.wobbleSpeed;
                const wobbleX = Math.sin(h.wobble) * 20;

                drawPixelHeart(h.x + wobbleX, h.y, h.size, h.color, h.opacity);

                if (h.y > canvas.height + 30) {
                    hearts[i] = createHeart();
                }
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ═══════════════════════════════════════════
    // SECTION NAVIGATION
    // ═══════════════════════════════════════════
    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;

        // Hide current
        const current = document.getElementById(sections[currentSection]);
        if (current) {
            current.classList.remove('active');
            current.style.display = 'none';
        }

        // Show next
        currentSection = index;
        const next = document.getElementById(sections[currentSection]);
        if (next) {
            next.style.display = 'flex';
            // Trigger reflow for animation
            void next.offsetWidth;
            next.classList.add('active');
        }

        // Section-specific init
        switch (sections[currentSection]) {
            case 'love-letter-section':
                initLoveLetter();
                break;
            case 'question-section':
                initQuestion();
                break;
            case 'promise-section':
                initPromiseCards();
                break;
            case 'final-section':
                initFinalSection();
                break;
        }

        window.scrollTo(0, 0);
    }

    // ═══════════════════════════════════════════
    // SECTION 1: INTRO
    // ═══════════════════════════════════════════
    function initIntro() {
        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', function () {
            tryPlayMusic();
            goToSection(1);
        });
    }

    // ═══════════════════════════════════════════
    // SECTION 2: LOVE LETTER
    // ═══════════════════════════════════════════
    const loveLetterText = `Công chúa iuuu của anh ơi,

Anh muốn gửi đến em bức thư này, từ tận đáy trái tim của a, mong eiuuu của a có thể kiên nhẫn đọc hết...

Anh biết chúng mình đã trải qua nhiều lỗi lầm, nhiều lúc làm nhau buồn, nhiều lúc không hiểu nhau... Nhưng em ơi, tình yêu không phải là sự hoàn hảo.

Tình yêu là khi chúng ta sẵn sàng tha thứ cho nhau, cùng nhau bước qua những ngày khó khăn, chấp nhận những khuyết điểm của đối phương...

Tình yêu là đồng hành, là sẵn sàng giúp đỡ khi nửa kia cần, là không bao giờ bỏ cuộc dù có chuyện gì xảy ra...

Và anh muốn em biết rằng — anh sẽ luôn ở đây, bên cạnh em, mãi mãi. 💕

A biết rằng sau mỗi lần cãi nhau, em thường buồn và suy nghĩ rất nhiều, em luôn thấy a cười đùa giỡn, nma eiuuu ơi, a chỉ đang cố gắng để em vui lên thôi, a không muốn thấy em buồn đâu. Eiuuu cũng cố gắng đừng buông lời cay đăng với a nhé, mỗi lần aiuuu đọc hay nhìn thấy, a vẫn luôn bỏ qua, nma nó vẫn giống như con dao đâm vào tim a, dù a có cố gắng tỏ ra mạnh mẽ đến đou đi chăng nữa.

Có lẽ ai cũm đã làm đối phương tổn thương, aiuuu cũm không biết nữa, có lẽ luôn là từ a mà ra hết. Vậy chẳng lẽ a cảm thấy mình không đủ tốt rồi thả tay eiuuu hay s? nâuu  

Thương eiuuu của a lắm, hồi trước a từng nghĩ, nếu không có a trong cuộc đời thì eiuuu sẽ gặp ai ta, có lẽ là ai đó tốt hơn a nhiều, luôn hiểu e, không bao giờ làm e buồn, luôn theo ý e, hoặc là ai đó khác kỳ lạ?

Không quan trọng nữa, vì hiện eiuuu đã gặp a rồi, vậy eiuuu đánh giá aiuuu tốt hay không tốt? có lẽ câu trả lời là aiuuu tốt ở một vài thứ và không tốt ở một vài thứ kkk, và vài thứ ở sau đó đôi khi khiến e ghét a, có lẽ việc chúng mình chấp nhận mọi thứ của nhau chưa bao h là dễ dàng cả, nó phụ thuộc nhiều thứ eiuuu nhỉ kkk. Theo a thì tình iuuuu, thời gian, sự cảm thông và thấu hiểu nhau sẽ là điều quan trọng để làm được e nhỉ, cứ từ từ cũm được. 

Eiuuu của a không phải lúc nào cũng ngoan, không phải lúc nào cũng nghe lời, không phải lúc nào cũng làm theo ý a. Cóa lẽ eiuuu sẽ thắc mắc là cái gì, lúc nào, kkk vì nếu đó là những điều eiuuu đã làm thì eiuuu hẳn phải nghĩ đó là điều bình thường trong lúc đó. Nhưng mà a vẫn yêu eiuuu của a lắmmm. Dù chuyện gì xảy ra, eiuuu có làm điều gì khiến a không vui, a vẫn sẽ dành hết sự tử tế và tình iuuu thương của a dành cho em.

Dù sao thì, eiuuu biết ko, aiuuu hồi mới tán eiuuu á :> luôn trong tâm thái là ko đc thì thôi, ko sợ mất e đâu vì lúc đó đã quen eiuuu mấy đâu kkk. Nma giờ thì khác rồi, mình cùng đi qua bao nhiêu nơi, cùng nhau trải qua bao nhiêu chuyện, eiuuu nghĩ a là khúc gỗ á hỏ, aiuuu sợ mất eiuuu lắm ớ, sợ một ngày nào đó eiuuu sẽ rời xa aiuuu, sợ một ngày nào đó eiuuu sẽ không còn yêu aiuuu nữa, sợ một ngày nào đó eiuuu sẽ tìm được ai đó tốt hơn aiuuu và rời xa aiuuu... 

Anh xin lỗi vì đã làm em buồn, cảm ơn e vì không rời xa a, có nhiều chuyện đã xảy ra nma anh vẫn đang cố gắng hơn từng ngày để không làm em buồn nữaa. Iuuuuu emmmmmmmmm.

Hôm nay là ngày Valentine, anh muốn gửi đến em những lời nói chân thành nhất. Hôm nay a không thể ở bên cạnh e được, nhưng một ngày nào đó ta sẽ về chung một nhà và cùng đón với nhau những ngày Valentine và những cái Tết thật hạnh phúc e nhé.

Qua tết aiuuu zô lại aiuuu sẽ bù choa eiuuu của a nhe nheee hehehhee :>>>  

Chúc công chúaaaa iuuuu của a có một ngày lễ thật tuyệt zời, zuiii zẻ, quên những muộn phiền và hạnh phúc bên gia đình nhé. Mong aiuuu sẽ được chúc Va len tin eiuuu ngoannn xinhhh iuuu của a thêm một chăm lần nữa. Yêu eiuuu của a nhiều lắm. Moaaa moaaâ moaaaa :3`;

    let letterInitialized = false;

    function initLoveLetter() {
        if (letterInitialized) return;
        letterInitialized = true;

        const envelope = document.getElementById('envelope');
        const typewriterEl = document.getElementById('typewriterText');
        const letterNextBtn = document.getElementById('letterNextBtn');

        // Click envelope to open
        envelope.addEventListener('click', function () {
            if (envelope.classList.contains('opened')) return;
            envelope.classList.add('opened');

            // Start typewriter after envelope opens
            setTimeout(() => {
                typewriterEffect(typewriterEl, loveLetterText, 30, function () {
                    // Show signature
                    document.querySelector('.letter-signature').classList.add('show');
                    // Show next button
                    letterNextBtn.style.display = 'inline-block';
                    letterNextBtn.style.animation = 'fadeSlideUp 0.5s ease forwards';
                });
            }, 800);
        });

        letterNextBtn.addEventListener('click', function () {
            goToSection(2);
        });
    }

    function typewriterEffect(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = '<span class="cursor"></span>';

        function type() {
            if (i < text.length) {
                const cursor = element.querySelector('.cursor');
                const char = text[i];

                if (char === '\n') {
                    cursor.insertAdjacentHTML('beforebegin', '<br>');
                } else {
                    cursor.insertAdjacentText('beforebegin', char);
                }

                i++;
                setTimeout(type, speed);
            } else {
                // Remove cursor after a delay
                setTimeout(() => {
                    const cursor = element.querySelector('.cursor');
                    if (cursor) cursor.remove();
                    if (callback) callback();
                }, 500);
            }
        }
        type();
    }

    // ═══════════════════════════════════════════
    // SECTION 3: YES/NO QUESTION (KEY FEATURE)
    // ═══════════════════════════════════════════
    let questionInitialized = false;

    function initQuestion() {
        if (questionInitialized) return;
        questionInitialized = true;

        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const hint = document.getElementById('questionHint');
        const answerArea = document.getElementById('answerArea');

        const hints = [
            "Bấm nút iuuu đi mààà 🥺",
            "Em chắc chắn hông iuuu á? 😢",
            "Suy nghĩ lại đi nhaaa 💕",
            "Nút kia trốn hoài à 😂",
            "Iuuu anh đi mà, anh xin đóoo 🙏",
            "Hông bấm được nút kia đâuuu 😝",
            "Thôi iuuu anh đi cho rồiiii ❤️",
            "Anh đợi em bấm Iuuu nè... 🥹",
            "Nút 'Iuuu' to dần rồi kìaaa 😍",
            "Nút kia nhỏ xíu rồi, bấm được đâuu 🤭"
        ];

        // No button: Run away from cursor
        function moveNoButton(e) {
            const rect = noBtn.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;

            let mouseX, mouseY;
            if (e.type.startsWith('touch')) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }

            const distance = Math.sqrt(
                Math.pow(mouseX - btnCenterX, 2) +
                Math.pow(mouseY - btnCenterY, 2)
            );

            if (distance < 150) {
                const areaRect = answerArea.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width - 20;
                const maxY = window.innerHeight - rect.height - 20;

                // Move away from cursor
                let newX = btnCenterX + (btnCenterX - mouseX) * 2;
                let newY = btnCenterY + (btnCenterY - mouseY) * 2;

                // Add randomness
                newX += (Math.random() - 0.5) * 200;
                newY += (Math.random() - 0.5) * 200;

                // Clamp to viewport
                newX = Math.max(20, Math.min(maxX, newX - rect.width / 2));
                newY = Math.max(20, Math.min(maxY, newY - rect.height / 2));

                noBtn.style.position = 'fixed';
                noBtn.style.left = newX + 'px';
                noBtn.style.top = newY + 'px';
                noBtn.style.zIndex = '100';
            }
        }

        document.addEventListener('mousemove', moveNoButton);
        document.addEventListener('touchmove', moveNoButton, { passive: true });

        // No button clicked: shrink it + grow yes button
        noBtn.addEventListener('click', function () {
            noClickCount++;

            // Shrink no button
            noBtnScale = Math.max(0.2, noBtnScale * 0.75);
            noBtn.style.transform = `scale(${noBtnScale})`;

            // Grow yes button
            yesBtnScale = Math.min(3, yesBtnScale * 1.2);
            yesBtn.style.transform = `scale(${yesBtnScale})`;
            yesBtn.style.transition = 'transform 0.3s ease';

            // Show hint
            hint.textContent = hints[Math.min(noClickCount - 1, hints.length - 1)];

            // If too small, hide completely
            if (noBtnScale <= 0.3) {
                noBtn.style.opacity = '0.3';
            }
        });

        // Yes button clicked: CELEBRATION!
        yesBtn.addEventListener('click', function () {
            celebrateYes();
        });
    }

    function celebrateYes() {
        const hint = document.getElementById('questionHint');
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        hint.textContent = "YEAHHH! IUUU EM NHIỀU LẮM LUÔNNN! 🎉❤️🎉";
        hint.style.fontSize = '18px';
        hint.style.color = '#ffd700';

        // Hide no button
        noBtn.style.display = 'none';

        // Pulse yes button
        yesBtn.style.animation = 'heartPulse 0.5s ease infinite';
        yesBtn.innerHTML = '<span>❤️ EM IUUUU ANH ❤️</span>';

        // Launch confetti & hearts
        launchConfetti();
        launchFloatingHearts();

        // Move to next section after celebration
        setTimeout(() => {
            goToSection(3);
        }, 3500);
    }

    function launchConfetti() {
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        document.body.appendChild(overlay);

        const colors = ['#ff2d55', '#ff6b9d', '#ffd700', '#e8a0ff', '#ff9ed8', '#4ade80'];

        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            const size = 5 + Math.random() * 10;
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            if (Math.random() > 0.5) piece.style.borderRadius = '50%';
            overlay.appendChild(piece);
        }

        setTimeout(() => overlay.remove(), 5000);
    }

    function launchFloatingHearts() {
        const hearts = ['❤️', '💕', '💖', '💗', '💝', '🩷'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-float';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.bottom = '0';
                heart.style.fontSize = (20 + Math.random() * 30) + 'px';
                heart.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 3000);
            }, i * 150);
        }
    }

    // ═══════════════════════════════════════════
    // SECTION 4: PROMISE CARDS
    // ═══════════════════════════════════════════
    function initPromiseCards() {
        const cards = document.querySelectorAll('.promise-card');
        const nextBtn = document.getElementById('promiseNextBtn');

        cards.forEach(card => {
            card.addEventListener('click', function () {
                if (!this.classList.contains('flipped')) {
                    this.classList.add('flipped');
                    flippedCards++;

                    // Show next button when all cards flipped
                    if (flippedCards >= totalPromiseCards) {
                        setTimeout(() => {
                            nextBtn.style.display = 'inline-block';
                            nextBtn.style.animation = 'fadeSlideUp 0.5s ease forwards';
                        }, 500);
                    }
                }
            });
        });

        nextBtn.addEventListener('click', function () {
            goToSection(4);
        });
    }

    // ═══════════════════════════════════════════
    // SECTION 5: ACTIVITIES
    // ═══════════════════════════════════════════

    // --- Pixel Heart Builder ---
    window.startHeartBuilder = function () {
        const popup = document.getElementById('heartBuilderPopup');
        popup.style.display = 'flex';
        initPixelCanvas();
    };

    function initPixelCanvas() {
        const canvas = document.getElementById('pixelCanvas');
        const ctx = canvas.getContext('2d');
        const gridSize = 16;
        pixelSize = canvas.width / gridSize;

        // Draw grid
        function drawGrid() {
            ctx.strokeStyle = 'rgba(255,107,157,0.15)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= gridSize; i++) {
                ctx.beginPath();
                ctx.moveTo(i * pixelSize, 0);
                ctx.lineTo(i * pixelSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * pixelSize);
                ctx.lineTo(canvas.width, i * pixelSize);
                ctx.stroke();
            }
        }

        // Pre-draw heart template (faded)
        function drawTemplate() {
            const template = [
                [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            ];
            ctx.fillStyle = 'rgba(255,45,85,0.08)';
            template.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell) {
                        ctx.fillRect(c * pixelSize, (r + 2) * pixelSize, pixelSize, pixelSize);
                    }
                });
            });
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate();
        drawGrid();

        function paintPixel(e) {
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if (e.type.startsWith('touch')) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }

            // Scale for CSS sizing
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            x *= scaleX;
            y *= scaleY;

            const col = Math.floor(x / pixelSize);
            const row = Math.floor(y / pixelSize);

            if (col >= 0 && col < 16 && row >= 0 && row < 16) {
                ctx.fillStyle = selectedColor;
                ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
                // Redraw grid on that cell
                ctx.strokeStyle = 'rgba(255,107,157,0.15)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
            }
        }

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; paintPixel(e); });
        canvas.addEventListener('mousemove', (e) => { if (isDrawing) paintPixel(e); });
        canvas.addEventListener('mouseup', () => { isDrawing = false; });
        canvas.addEventListener('mouseleave', () => { isDrawing = false; });

        canvas.addEventListener('touchstart', (e) => { isDrawing = true; paintPixel(e); e.preventDefault(); }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { if (isDrawing) paintPixel(e); e.preventDefault(); }, { passive: false });
        canvas.addEventListener('touchend', () => { isDrawing = false; });

        // Color picker
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedColor = this.dataset.color;
            });
        });
    }

    window.clearPixelCanvas = function () {
        const canvas = document.getElementById('pixelCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initPixelCanvas();
    };

    // --- Love Jar ---
    const loveNotes = [
        "Mỗi ngày anh đều yêu em nhiềuuuu hơn hôm qua 💕",
        "Em là nguồn cảm hứng lớn nhat của anhh ✨",
        "Nụ cười của e làm anh quên hết mệt mỏiii hì hì 😊",
        "Được ở bên em là điều hạnh phúc nhứttt 💖",
        "Anh yêu cả những lúc em hờn dỗi 🥰",
        "Eiuuu làm cuộc sống của anh có ý nghĩa hơn 🌟",
        "Anh muốn nắm tay em đi khắp thế gian 🌍",
        "Em là điều tuyệt vời nhất a từng có 💝",
        "Tình yêu anh dành cho em là vô hạn ♾️❤",
        "Anh sẽ luôn ở bên em, mãi mãi nhé 💕",
        "Em xinh nhất khi em cười niè 😍",
        "Hông có em, anh như cá không có nước 🐟💕",
        "Anh hứa sẽ yêu em hơn mỗi ngày ❤️",
        "Vũ trụ của anh chỉ cóa em thôi 🌌💕",
        "Em là giấc mơ đẹp nhất mà anh không muốn tỉnh dậy đou ✨"
    ];

    window.startLoveJar = function () {
        document.getElementById('loveJarPopup').style.display = 'flex';
    };

    window.shakeLoveJar = function () {
        const jar = document.getElementById('jar');
        const noteDisplay = document.getElementById('loveNoteText');
        const jarHearts = document.getElementById('jarHearts');

        jar.classList.add('shake');
        setTimeout(() => jar.classList.remove('shake'), 500);

        // Random note
        const note = loveNotes[Math.floor(Math.random() * loveNotes.length)];
        noteDisplay.style.opacity = '0';
        setTimeout(() => {
            noteDisplay.textContent = note;
            noteDisplay.style.opacity = '1';
            noteDisplay.style.transition = 'opacity 0.5s ease';
        }, 300);

        // Add heart to jar
        loveJarCount++;
        const hearts = ['❤', '💕', '💖', '💗', '🩷'];
        jarHearts.textContent += hearts[Math.floor(Math.random() * hearts.length)];
    };

    // --- Love Counter ---
    let counterInterval;
    window.showLoveCounter = function () {
        document.getElementById('loveCounterPopup').style.display = 'flex';
        updateCounter();
        if (counterInterval) clearInterval(counterInterval);
        counterInterval = setInterval(updateCounter, 1000);
    };

    function updateCounter() {
        // Anniversary date: March 23, 2025
        const startDate = new Date(2025, 2, 23); // Month is 0-indexed
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('counterDays').textContent = days;
        document.getElementById('counterHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('counterMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('counterSeconds').textContent = String(seconds).padStart(2, '0');
    }

    // --- Close Popup ---
    window.closePopup = function (id) {
        const popup = document.getElementById(id);
        popup.style.display = 'none';
        if (id === 'loveCounterPopup' && counterInterval) {
            clearInterval(counterInterval);
        }
    };


    // ═══════════════════════════════════════════
    // SECTION 6: FINAL MESSAGE
    // ═══════════════════════════════════════════
    function initFinalSection() {
        launchConfetti();
        createFireworks();

        // Animate pixel heart in final section
        createFinalPixelHeart();
    }

    function createFireworks() {
        const container = document.getElementById('finalHeartsExplosion');
        if (!container) return;

        function launchFirework() {
            const x = Math.random() * 100;
            const y = 20 + Math.random() * 40;
            const colors = ['#ff2d55', '#ff6b9d', '#ffd700', '#e8a0ff', '#ff9ed8'];

            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.left = x + '%';
                particle.style.top = y + '%';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];

                const angle = (Math.PI * 2 / 20) * i;
                const distance = 50 + Math.random() * 80;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                particle.style.animation = 'none';
                particle.animate([
                    { transform: 'translate(0,0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                container.appendChild(particle);
                setTimeout(() => particle.remove(), 2000);
            }
        }

        // Launch fireworks periodically
        launchFirework();
        const fwInterval = setInterval(launchFirework, 2000);

        // Stop after 20 seconds
        setTimeout(() => clearInterval(fwInterval), 20000);
    }

    function createFinalPixelHeart() {
        const container = document.getElementById('finalPixelHeart');
        if (!container) return;

        // Create a beating pixel heart using divs
        const heartGrid = [
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        ];

        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(11, 1fr)';
        container.style.gap = '2px';
        container.style.animation = 'heartPulse 1.5s ease-in-out infinite';

        const colors = ['#ff2d55', '#ff4f7e', '#ff6b9d', '#e8456e'];

        heartGrid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const div = document.createElement('div');
                div.style.width = '100%';
                div.style.aspectRatio = '1';
                if (cell) {
                    div.style.background = colors[Math.floor(Math.random() * colors.length)];
                    div.style.boxShadow = '0 0 5px rgba(255,45,85,0.5)';
                    div.style.animation = `pixelGlow ${1.5 + Math.random()}s ease-in-out infinite`;
                    div.style.animationDelay = (r * 0.05 + c * 0.05) + 's';
                }
                container.appendChild(div);
            });
        });
    }

    // ═══════════════════════════════════════════
    // MUSIC CONTROL
    // ═══════════════════════════════════════════
    function initMusic() {
        const toggle = document.getElementById('musicToggle');
        const icon = document.getElementById('musicIcon');
        const audio = document.getElementById('bgMusic');

        toggle.addEventListener('click', function () {
            if (musicPlaying) {
                audio.pause();
                musicPlaying = false;
                icon.className = 'fas fa-volume-mute';
                toggle.classList.remove('playing');
            } else {
                audio.play().then(() => {
                    musicPlaying = true;
                    icon.className = 'fas fa-volume-up';
                    toggle.classList.add('playing');
                }).catch(() => {
                    // Autoplay blocked
                });
            }
        });
    }

    function tryPlayMusic() {
        const audio = document.getElementById('bgMusic');
        const icon = document.getElementById('musicIcon');
        const toggle = document.getElementById('musicToggle');

        if (!musicPlaying) {
            audio.play().then(() => {
                musicPlaying = true;
                icon.className = 'fas fa-volume-up';
                toggle.classList.add('playing');
            }).catch(() => {
                // Autoplay blocked, that's okay
            });
        }
    }

})();
