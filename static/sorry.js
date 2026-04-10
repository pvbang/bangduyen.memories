// ==========================================
// SORRY PAGE - INTERACTIVE APOLOGY GAME
// ==========================================

class SorryGame {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 4;
        this.yesClickCount = 0;
        this.noClickCount = 0;
        this.mediaFiles = [];
        this.gameScore = 0;
        this.init();
    }

    async init() {
        await this.loadMediaFiles();
        this.setupEventListeners();
        this.displayRandomMedia();
        this.showCurrentQuestion();
        this.startBackgroundAnimations();
    }

    // Load media files from data folder
    async loadMediaFiles() {
        // List of possible image/gif files
        const imageFiles = [
            'data/gif/gif01-v2.gif',
            'data/gif/gif02.gif'
        ];

        // Filter existing files
        this.mediaFiles = [];
        for (const file of imageFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    this.mediaFiles.push(file);
                }
            } catch (error) {
                console.log(`File not found: ${file}`);
            }
        }

        // Fallback if no files found
        if (this.mediaFiles.length === 0) {
            this.mediaFiles = [
                'https://via.placeholder.com/300x200/FFB6C1/FFFFFF?text=💕',
                'https://via.placeholder.com/300x200/FFC0CB/FFFFFF?text=❤️',
                'https://via.placeholder.com/300x200/FF91A4/FFFFFF?text=💖'
            ];
        }
    }

    displayRandomMedia() {
        const mediaElement = document.getElementById('randomMedia');
        if (mediaElement && this.mediaFiles.length > 0) {
            const randomFile = this.mediaFiles[Math.floor(Math.random() * this.mediaFiles.length)];
            mediaElement.src = randomFile;
            mediaElement.style.opacity = '0';
            
            setTimeout(() => {
                mediaElement.style.opacity = '1';
            }, 100);
        }
    }

    setupEventListeners() {
        // Question 1 listeners
        const yesBtn1 = document.getElementById('yesBtn1');
        const noBtn1 = document.getElementById('noBtn1');
        
        if (yesBtn1) {
            yesBtn1.addEventListener('click', () => this.handleYesClick(1));
        }
        
        if (noBtn1) {
            noBtn1.addEventListener('click', (e) => this.handleNoClick(e, 1));
            noBtn1.addEventListener('mouseover', (e) => this.avoidMouse(e));
        }

        // Question 2 listeners
        const yesBtn2 = document.getElementById('yesBtn2');
        const noBtn2 = document.getElementById('noBtn2');
        
        if (yesBtn2) {
            yesBtn2.addEventListener('click', () => this.handleYesClick(2));
        }
        
        if (noBtn2) {
            noBtn2.addEventListener('click', (e) => this.handleNoClick(e, 2));
            noBtn2.addEventListener('mouseover', (e) => this.avoidMouse(e));
        }

        // Question 3 listeners
        const yesBtn3 = document.getElementById('yesBtn3');
        const noBtn3 = document.getElementById('noBtn3');
        
        if (yesBtn3) {
            yesBtn3.addEventListener('click', () => this.handleYesClick(3));
        }
        
        if (noBtn3) {
            noBtn3.addEventListener('click', (e) => this.handleNoClick(e, 3));
            noBtn3.addEventListener('mouseover', (e) => this.avoidMouse(e));
        }

        // Question 4 listeners
        const yesBtn4 = document.getElementById('yesBtn4');
        const noBtn4 = document.getElementById('noBtn4');
        
        if (yesBtn4) {
            yesBtn4.addEventListener('click', () => this.handleYesClick(4));
        }
        
        if (noBtn4) {
            noBtn4.addEventListener('click', (e) => this.handleNoClick(e, 4));
            noBtn4.addEventListener('mouseover', (e) => this.avoidMouse(e));
        }

        // Change media every 10 seconds
        setInterval(() => {
            this.displayRandomMedia();
        }, 10000);
    }

    handleYesClick(questionNumber) {
        this.yesClickCount++;
        const yesBtn = document.getElementById(`yesBtn${questionNumber}`);
        const noBtn = document.getElementById(`noBtn${questionNumber}`);

        // Grow yes button
        yesBtn.classList.add('growing');
        yesBtn.style.transform = `scale(${1 + this.yesClickCount * 0.2})`;

        // Shrink no button
        if (noBtn) {
            noBtn.classList.add('shrinking');
            noBtn.style.transform = `scale(${Math.max(0.1, 1 - this.yesClickCount * 0.15)})`;
            noBtn.style.opacity = Math.max(0.1, 1 - this.yesClickCount * 0.2);
            
            // Hide no button completely after 3 clicks
            if (this.yesClickCount >= 3) {
                noBtn.style.display = 'none';
            }
        }

        // Add celebration effect
        this.createCelebrationHearts(yesBtn);
        
        // Play success sound (if available)
        this.playSound('success');

        // Move to next question after a delay
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    handleNoClick(event, questionNumber) {
        event.preventDefault();
        this.noClickCount++;
        
        const noBtn = event.target;
        const yesBtn = noBtn.parentElement.querySelector('.yes-btn');

        // Shrink no button
        const currentScale = noBtn.style.transform ? parseFloat(noBtn.style.transform.replace('scale(', '')) : 1;
        const newScale = Math.max(0, currentScale - 0.2);
        noBtn.style.transform = `scale(${newScale})`;
        noBtn.style.opacity = newScale;

        if (newScale <= 0) {
            noBtn.style.display = 'none';
        }

        // Grow yes button
        const currentYesScale = yesBtn.style.transform ? parseFloat(yesBtn.style.transform.replace('scale(', '')) : 1;
        const newYesScale = currentYesScale + 0.3;
        yesBtn.style.transform = `scale(${newYesScale})`;
        
        // Add avoiding animation
        noBtn.classList.add('avoiding');
        
        // Move button to random position
        this.moveButtonRandomly(noBtn);
        
        // Show sad message
        this.showSadMessage(questionNumber);
        
        // Play sad sound (if available)
        this.playSound('sad');
        
        // Remove animation class
        setTimeout(() => {
            noBtn.classList.remove('avoiding');
        }, 500);
    }

    avoidMouse(event) {
        const button = event.target;
        
        // Only avoid if it's a no button and we're in early questions
        if (button.classList.contains('no-btn') && this.yesClickCount < 2) {
            const moveDistance = 50 + Math.random() * 100;
            const angle = Math.random() * 2 * Math.PI;
            const deltaX = Math.cos(angle) * moveDistance;
            const deltaY = Math.sin(angle) * moveDistance;
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Reset position after a while
            setTimeout(() => {
                button.style.transform = '';
            }, 1000);
        }
    }

    moveButtonRandomly(button) {
        const container = button.parentElement;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const maxX = containerRect.width - buttonRect.width;
        const maxY = containerRect.height - buttonRect.height;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        button.style.position = 'absolute';
        button.style.left = newX + 'px';
        button.style.top = newY + 'px';
    }

    showSadMessage(questionNumber) {
        const messages = [
            "Anh biết em đang giận... 😢",
            "Đừng giận anh nữa mà em... 🥺",
            "Anh sẽ cố gắng hơn nữa! 😭",
            "Em là tất cả của anh mà... 💔"
        ];
        
        const messageElement = document.createElement('div');
        messageElement.className = 'floating-message';
        messageElement.textContent = messages[questionNumber - 1];
        messageElement.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFB6C1, #FF69B4);
            color: white;
            padding: 16px 24px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: 600;
            z-index: 1000;
            animation: floatMessage 3s ease-out forwards;
            box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    createCelebrationHearts(element) {
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.cssText = `
                position: absolute;
                font-size: 24px;
                pointer-events: none;
                z-index: 1000;
                animation: celebrationHeart 2s ease-out forwards;
                left: ${element.offsetLeft + Math.random() * element.offsetWidth}px;
                top: ${element.offsetTop}px;
            `;
            
            element.parentElement.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }
    }

    showCurrentQuestion() {
        // Hide all questions
        const questions = document.querySelectorAll('.question-card');
        questions.forEach(q => q.classList.remove('active'));
        
        // Show current question
        const currentQ = document.getElementById(`question${this.currentQuestion}`);
        if (currentQ) {
            setTimeout(() => {
                currentQ.classList.add('active');
                currentQ.classList.add('bounce-in');
            }, 300);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showCurrentQuestion();
            
            // Reset button states for new question
            this.yesClickCount = 0;
            this.noClickCount = 0;
        } else {
            this.showFinalMessage();
        }
    }

    showFinalMessage() {
        // Hide all questions
        const questions = document.querySelectorAll('.question-card');
        questions.forEach(q => q.classList.remove('active'));
        
        // Show final message
        const finalMessage = document.getElementById('finalMessage');
        if (finalMessage) {
            setTimeout(() => {
                finalMessage.classList.add('active');
                finalMessage.classList.add('bounce-in');
                this.startFinalAnimations();
            }, 500);
        }
        
        // Show mini game after a delay
        setTimeout(() => {
            this.showMiniGame();
        }, 3000);
    }

    startFinalAnimations() {
        // Start love meter animation
        const loveFill = document.getElementById('loveFill');
        if (loveFill) {
            setTimeout(() => {
                loveFill.style.width = '100%';
            }, 1000);
        }
        
        // Add confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#FFB6C1', '#FFC0CB', '#FF91A4', '#FF69B4', '#FFE4E1'];
        const emojis = ['💖', '💕', '❤️', '💝', '🌹', '✨', '🎉'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                const isEmoji = Math.random() > 0.5;
                
                if (isEmoji) {
                    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    confetti.style.fontSize = '20px';
                } else {
                    confetti.style.width = '10px';
                    confetti.style.height = '10px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                }
                
                confetti.style.cssText += `
                    position: fixed;
                    top: -20px;
                    left: ${Math.random() * window.innerWidth}px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 100);
        }
    }

    showMiniGame() {
        const miniGame = document.getElementById('miniGame');
        if (miniGame) {
            miniGame.style.display = 'block';
            miniGame.classList.add('fade-in-up');
            this.initMiniGame();
        }
    }

    initMiniGame() {
        const gameArea = document.querySelector('.game-area');
        const collector = document.getElementById('collector');
        const scoreElement = document.getElementById('score');
        
        if (!gameArea || !collector || !scoreElement) return;
        
        let isDragging = false;
        let gameActive = true;
        
        // Make collector draggable
        collector.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && gameActive) {
                const gameRect = gameArea.getBoundingClientRect();
                const newX = Math.max(0, Math.min(gameRect.width - 60, e.clientX - gameRect.left - 30));
                collector.style.left = newX + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Create falling hearts
        const createFallingHeart = () => {
            if (!gameActive) return;
            
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.cssText = `
                position: absolute;
                top: 0;
                left: ${Math.random() * (gameArea.offsetWidth - 30)}px;
                font-size: 24px;
                pointer-events: none;
                animation: fallDown 3s linear forwards;
                z-index: 10;
            `;
            
            gameArea.appendChild(heart);
            
            // Check collision with collector
            const checkCollision = () => {
                const heartRect = heart.getBoundingClientRect();
                const collectorRect = collector.getBoundingClientRect();
                
                if (heartRect.bottom >= collectorRect.top &&
                    heartRect.left < collectorRect.right &&
                    heartRect.right > collectorRect.left) {
                    this.gameScore++;
                    scoreElement.textContent = this.gameScore;
                    heart.remove();
                    this.createCelebrationHearts(collector);
                    return true;
                }
                return false;
            };
            
            const interval = setInterval(() => {
                if (checkCollision() || heart.offsetTop > gameArea.offsetHeight) {
                    clearInterval(interval);
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }
            }, 50);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
                clearInterval(interval);
            }, 3000);
        };
        
        // Start game
        const gameInterval = setInterval(createFallingHeart, 1000);
        
        // End game after 30 seconds
        setTimeout(() => {
            gameActive = false;
            clearInterval(gameInterval);
            this.endMiniGame();
        }, 30000);
    }

    endMiniGame() {
        console.log('Mini game ended with score:', this.gameScore);
        const miniGame = document.getElementById('miniGame');
        if (miniGame) {
            const endMessage = document.createElement('div');
            endMessage.className = 'game-end-message';
            endMessage.innerHTML = `
                <h3>Game kết thúc! 🎉</h3>
                <p>Em đã hái được ${this.gameScore} trái tim! ❤️</p>
                <p>Anh yêu em ${this.gameScore * 100}%! 💕</p>
            `;
            endMessage.style.cssText = `
                background: linear-gradient(135deg, #FFB6C1, #FF69B4);
                color: white;
                padding: 24px;
                border-radius: 20px;
                text-align: center;
                margin: 20px 0;
                animation: bounce-in 0.8s ease-out;
            `;
            
            miniGame.appendChild(endMessage);
        }
    }

    startBackgroundAnimations() {
        // Add CSS animations for floating elements
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatMessage {
                0% { opacity: 0; transform: translateX(-50%) translateY(50px) scale(0.8); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                80% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-50px) scale(0.8); }
            }
            
            @keyframes celebrationHeart {
                0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
                50% { opacity: 1; transform: translateY(-50px) scale(1.5) rotate(180deg); }
                100% { opacity: 0; transform: translateY(-100px) scale(0.5) rotate(360deg); }
            }
            
            @keyframes confettiFall {
                0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            
            @keyframes fallDown {
                0% { transform: translateY(0); }
                100% { transform: translateY(200px); }
            }
        `;
        document.head.appendChild(style);
    }

    playSound(type) {
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            } else if (type === 'sad') {
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.2); // D4
            }
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
}

// Global functions
function showLoveGames() {
    const finalMessage = document.getElementById('finalMessage');
    const loveGames = document.getElementById('loveGames');
    
    if (finalMessage && loveGames) {
        finalMessage.style.display = 'none';
        loveGames.style.display = 'block';
        loveGames.classList.add('fade-in-up');
        
        // Setup game card listeners
        setupGameCardListeners();
    }
}

function backToFinal() {
    const finalMessage = document.getElementById('finalMessage');
    const loveGames = document.getElementById('loveGames');
    
    if (finalMessage && loveGames) {
        loveGames.style.display = 'none';
        finalMessage.style.display = 'block';
        finalMessage.classList.add('bounce-in');
    }
}

function setupGameCardListeners() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        const gameType = card.getAttribute('data-game');
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startGame(gameType);
        });
        
        card.addEventListener('click', () => {
            startGame(gameType);
        });
    });
}

let activeGameIntervals = [];
let activeGameCleanUp = null;

function startGame(gameType) {
    // First, ensure any previous game is fully cleaned up.
    closeGame();

    const gameArena = document.getElementById('gameArena');
    const gameTitle = document.getElementById('currentGameTitle');
    const gameContent = document.getElementById('gameContent');

    if (!gameArena || !gameTitle || !gameContent) return;

    const gameTitles = {
        'heart-collector': '🎯 Hái Trái Tim Cho Em',
        'memory-match': '💞 Ghép Đôi Kỷ Niệm',
        'hidden-hearts': '🔍 Tìm Trái Tim Ẩn',
        'love-letter': '✍️ Viết Thư Tình',
        'emotion-guess': '😊 Đoán Cảm Xúc Của Anh',
        'heart-puzzle': '🧩 Ghép Hình Trái Tim',
        'love-chat': '💬 Chat Tình Yêu',
        'love-garden': '🌸 Vườn Hoa Tình Yêu'
    };

    gameTitle.textContent = gameTitles[gameType] || 'Mini Game';
    gameContent.innerHTML = '';
    gameArena.style.display = 'flex';

    const gameInitializers = {
        'heart-collector': initHeartCollectorGame,
        'memory-match': initMemoryMatchGame,
        'hidden-hearts': initHiddenHeartsGame,
        'love-letter': initLoveLetterGame,
        'emotion-guess': initEmotionGuessGame,
        'heart-puzzle': initHeartPuzzleGame,
        'love-chat': initLoveChatGame,
        'love-garden': initLoveGardenGame
    };

    const initializer = gameInitializers[gameType];
    if (initializer) {
        // Use requestAnimationFrame to ensure the DOM is fully rendered and sized
        requestAnimationFrame(() => {
            setTimeout(() => { // A small timeout can still help with complex layouts
                initializer(gameContent);
            }, 50);
        });
    }
}

function closeGame() {
    // Clear all registered intervals for the active game
    activeGameIntervals.forEach(intervalId => clearInterval(intervalId));
    activeGameIntervals = []; // Reset the array

    // Execute any game-specific cleanup logic
    if (typeof activeGameCleanUp === 'function') {
        activeGameCleanUp();
        activeGameCleanUp = null;
    }

    const gameArena = document.getElementById('gameArena');
    if (gameArena) {
        gameArena.style.display = 'none';
    }
}

function exitGame() {
    if (confirm('Eiuu có chắc muốn thoát game không? 🥺')) {
        closeGame();
        const loveGames = document.getElementById('loveGames');
        if (loveGames) {
            loveGames.style.display = 'block';
        }
    }
}

// Heart Collector Game
function initHeartCollectorGame(container) {
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Điểm: <span id="heartScore">0</span></div>
            <div class="game-timer">Thời gian: <span id="heartTimer">30</span>s</div>
            <div class="progress-bar">
                <div class="progress-fill" id="heartProgress"></div>
            </div>
        </div>
        <div class="game-area" id="heartGameArea" style="height: 400px; position: relative; background: linear-gradient(135deg, rgba(255, 240, 245, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%); border-radius: 20px; overflow: hidden; user-select: none;">
            <div class="heart-collector" id="heartCollector" style="position: absolute; bottom: 20px; width: 80px; height: 80px; background: linear-gradient(135deg, #FF69B4, #FFD700); border-radius: 50%; cursor: move; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4); transform: translateX(-50%);">💕</div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>🎯 Di chuyển để hứng những trái tim rơi từ trên cao!</p>
            <p>💝 Mỗi trái tim là một lời yêu thương anh gửi đến em!</p>
        </div>
    `;

    // Use requestAnimationFrame to ensure correct dimensions are available
    requestAnimationFrame(() => {
        startHeartCollectorLogic();
    });
}

function startHeartCollectorLogic() {
    const gameArea = document.getElementById('heartGameArea');
    const collector = document.getElementById('heartCollector');
    const scoreEl = document.getElementById('heartScore');
    const timerEl = document.getElementById('heartTimer');
    const progressEl = document.getElementById('heartProgress');

    if (!gameArea || !collector || !scoreEl || !timerEl || !progressEl) {
        console.error("Heart Collector game elements not found!");
        return;
    }

    // Center the collector initially
    collector.style.left = `${gameArea.offsetWidth / 2}px`;

    let score = 0;
    let timeLeft = 30;
    let gameActive = true;

    const loveMessages = [
        "Yêu em nhất!", "Công chúa của anh!", "Mãi bên nhau nhé!", "Em là tất cả!",
        "Nhớ em nhiều!", "Hun em một cái!", "Tim anh thuộc về em!", "Em là định mệnh!"
    ];

    const handleDragMove = (e) => {
        if (!gameActive) return;
        e.preventDefault();

        const gameRect = gameArea.getBoundingClientRect();
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        
        let targetX = clientX - gameRect.left;
        
        // The 'left' style is relative to the transform's center, so we don't need to halve the width
        const minX = 0;
        const maxX = gameArea.offsetWidth;

        const clampedX = Math.max(minX, Math.min(maxX, targetX));
        
        collector.style.left = clampedX + 'px';
    };

    const handleDragEnd = (e) => {
        if (e) e.preventDefault();
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
    };

    collector.addEventListener('mousedown', handleDragStart);
    collector.addEventListener('touchstart', handleDragStart, { passive: false });

    const timer = setInterval(() => {
        if (!gameActive) return;
        timeLeft--;
        timerEl.textContent = timeLeft;
        progressEl.style.width = ((30 - timeLeft) / 30 * 100) + '%';
        
        if (timeLeft <= 0) {
            gameActive = false;
            // First, perform cleanup that removes event listeners
            if (typeof activeGameCleanUp === 'function') {
                activeGameCleanUp();
                activeGameCleanUp = null;
            }
            // Then, stop all game intervals
            activeGameIntervals.forEach(intervalId => clearInterval(intervalId));
            activeGameIntervals = [];
            // Finally, display the end screen
            endHeartCollectorGame(score);
        }
    }, 1000);
    activeGameIntervals.push(timer);

    const heartSpawner = setInterval(() => {
        if (gameActive) {
            createFallingHeart();
        }
    }, 800);
    activeGameIntervals.push(heartSpawner);

    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.cssText = `
            position: absolute;
            top: -40px;
            left: ${Math.random() * (gameArea.offsetWidth - 30)}px;
            font-size: 28px;
            pointer-events: none;
            z-index: 10;
            text-shadow: 0 0 10px rgba(255,255,255,0.7);
        `;
        gameArea.appendChild(heart);

        let fallSpeed = 1.5 + Math.random() * 2;
        let animationFrameId;

        function fall() {
            if (!gameActive) {
                if(heart.parentNode) heart.remove();
                cancelAnimationFrame(animationFrameId);
                return;
            }

            const heartTop = heart.offsetTop;
            heart.style.top = (heartTop + fallSpeed) + 'px';

            const collectorRect = collector.getBoundingClientRect();
            const heartRect = heart.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            if (heartRect.bottom > gameAreaRect.bottom) {
                if (heart.parentNode) heart.remove();
                cancelAnimationFrame(animationFrameId);
                return;
            }

            if (heartRect.bottom > collectorRect.top && heartRect.right > collectorRect.left && heartRect.left < collectorRect.right) {
                if (heart.parentNode) heart.remove();
                cancelAnimationFrame(animationFrameId);
                
                score++;
                scoreEl.textContent = score;
                
                const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
                showFloatingMessage(msg, collector);
                return;
            }
            
            animationFrameId = requestAnimationFrame(fall);
        }
        animationFrameId = requestAnimationFrame(fall);
    }

    function showFloatingMessage(text, element) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF69B4, #FFD700);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 1rem;
            font-weight: 600;
            white-space: nowrap;
            z-index: 20;
            animation: floatUpAndFade 2s ease-out forwards;
        `;
        collector.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }

    activeGameCleanUp = () => {
        gameActive = false; // Stop all game logic
        collector.removeEventListener('mousedown', handleDragStart);
        collector.removeEventListener('touchstart', handleDragStart);
        handleDragEnd(); // Clean up document listeners just in case
    };
}

function endHeartCollectorGame(score) {
    const gameContent = document.getElementById('gameContent');
    if (!gameContent) return;
    
    // Clear the game area before showing the end message
    gameContent.innerHTML = '';

    const endMessage = document.createElement('div');
    endMessage.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFB6C1, #FF69B4); color: white; border-radius: 20px; margin: 20px 0; animation: bounce-in 0.8s ease-out;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">🎉 Tuyệt vời!</h3>
            <p style="font-size: 1.3rem; margin-bottom: 12px;">Em đã hứng được ${score} trái tim! 💖</p>
            <p style="font-size: 1.1rem;">Anh yêu em ${(score + 100) * 10}% mỗi ngày! 💕</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px; transition: all 0.3s ease;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endMessage);
}

// Memory Match Game
function initMemoryMatchGame(container) {
    // Use real images from the memories folder
    const realImages = [
        'data/images/01.jpg',
        'data/images/02.jpg', 
        'data/images/03.jpg',
        'data/images/04.jpg',
        'data/images/05.jpg',
        'data/images/06.jpg',
        'data/images/07.jpg',
        'data/images/1746200909303.jpeg'
    ];
    const gameCards = [...realImages, ...realImages].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Cặp đã tìm: <span id="memoryScore">0</span>/8</div>
            <div class="game-timer">Nước đi: <span id="memoryMoves">0</span></div>
        </div>
        <div class="memory-game-grid"></div>
        <div style="text-align: center; margin-top: 15px; color: #666;">
            <p>💞 Tìm những cặp ảnh kỷ niệm giống nhau của chúng ta!</p>
            <p>✨ Càng ít nước đi càng chứng tỏ em nhớ anh!</p>
        </div>
    `;
    
    const grid = container.querySelector('.memory-game-grid');
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    
    gameCards.forEach((imagePath, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.image = imagePath;
        card.dataset.index = index;
        card.innerHTML = '<div class="card-back">💕</div>';
        
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
    
    function flipCard(card) {
        if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.innerHTML = `<img src="${card.dataset.image}" alt="Memory" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('memoryMoves').textContent = moves;
            
            setTimeout(() => {
                if (flippedCards[0].dataset.image === flippedCards[1].dataset.image) {
                    flippedCards.forEach(c => {
                        c.classList.add('matched');
                        createHeartBurst(c);
                    });
                    matchedPairs++;
                    document.getElementById('memoryScore').textContent = matchedPairs;
                    
                    if (matchedPairs === 8) {
                        setTimeout(() => endMemoryGame(moves), 500);
                    }
                } else {
                    flippedCards.forEach(c => {
                        c.classList.remove('flipped');
                        c.innerHTML = '<div class="card-back">💕</div>';
                    });
                }
                flippedCards = [];
            }, 1000);
        }
    }
}

function endMemoryGame(moves) {
    const gameContent = document.getElementById('gameContent');
    let message = '';
    if (moves <= 12) message = 'Em hiểu anh quá! Hoàn hảo! 🥰';
    else if (moves <= 20) message = 'Tuyệt vời! Em thật thông minh! 😘';
    else message = 'Em vẫn đáng yêu lắm! 💕';
    
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFD700, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">🎉 ${message}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Hoàn thành trong ${moves} nước đi!</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Hidden Hearts Game
function initHiddenHeartsGame(container) {
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Tìm được: <span id="hiddenScore">0</span>/10</div>
            <div class="game-timer">Thời gian: <span id="hiddenTimer">45</span>s</div>
        </div>
        <div class="hidden-hearts-area"></div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>🔍 Tìm 10 trái tim mà anh đã giấu trong khu vườn!</p>
            <p>💝 Mỗi trái tim chứa một lời yêu thương dành riêng cho em!</p>
        </div>
    `;
    
    const area = container.querySelector('.hidden-hearts-area');
    let found = 0;
    let timeLeft = 45;
    let gameActive = true;
    
    // Create hidden hearts
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'hidden-heart';
        heart.textContent = '💖';
        heart.style.left = Math.random() * (area.offsetWidth - 40) + 'px';
        heart.style.top = Math.random() * (area.offsetHeight - 40) + 'px';
        
        heart.addEventListener('click', () => {
            if (!gameActive) return;
            found++;
            document.getElementById('hiddenScore').textContent = found;
            heart.classList.add('found');
            createHeartBurst(heart);
            playSuccessSound();
            
            if (found >= 10) {
                gameActive = false;
                endHiddenHeartsGame(true);
            }
        });
        
        area.appendChild(heart);
    }
    
    // Timer
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('hiddenTimer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            gameActive = false;
            clearInterval(timer);
            endHiddenHeartsGame(false);
        }
    }, 1000);
}

function endHiddenHeartsGame(won) {
    const gameContent = document.getElementById('gameContent');
    const message = won ? 'Em tìm được hết rồi! Anh yêu em! 💕' : 'Hết giờ rồi! Nhưng anh vẫn yêu em! 💖';
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFB6C1, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">${won ? '🎉' : '⏰'} ${message}</h3>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Love Letter Game
function initLoveLetterGame(container) {
    const letterText = `Gửi em yêu của anh,

Anh muốn nói với em rằng em là <span class="letter-blank" data-word="ánh sáng">_____</span> trong cuộc đời anh.
Mỗi ngày thức dậy, điều đầu tiên anh nghĩ đến là <span class="letter-blank" data-word="nụ cười">_____</span> của em.
Em làm cho trái tim anh <span class="letter-blank" data-word="rung động">_____</span> mỗi khi nhìn thấy em.
Anh hứa sẽ <span class="letter-blank" data-word="yêu thương">_____</span> em mãi mãi.
Và sẽ <span class="letter-blank" data-word="bảo vệ">_____</span> em khỏi mọi buồn phiền. Iuuuu iemm bié của a nhiềuuu lắmmm ❤️

Anhh yêu em nhiều lắm!
❤️ Người yêu em ❤️`;

    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Hoàn thành: <span id="letterProgress">0</span>/5</div>
        </div>
        <div class="love-letter-container">
            <div class="letter-text">${letterText}</div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 20px 0;">
                <button class="word-option" data-word="ánh sáng">ánh sáng</button>
                <button class="word-option" data-word="nụ cười">nụ cười</button>
                <button class="word-option" data-word="rung động">rung động</button>
                <button class="word-option" data-word="yêu thương">yêu thương</button>
                <button class="word-option" data-word="bảo vệ">bảo vệ</button>
            </div>
            <p style="color: #666;">✍️ Chọn từ phù hợp để hoàn thành bức thư tình!</p>
        </div>
    `;
    
    setupLoveLetterLogic(container);
}

function setupLoveLetterLogic(container) {
    const blanks = container.querySelectorAll('.letter-blank');
    const options = container.querySelectorAll('.word-option');
    let completed = 0;
    
    // Style word options
    options.forEach(option => {
        option.style.cssText = `
            background: linear-gradient(135deg, #FFB6C1, #FF69B4);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        
        option.addEventListener('click', () => {
            const word = option.dataset.word;
            const targetBlank = Array.from(blanks).find(blank => 
                blank.dataset.word === word && !blank.classList.contains('filled')
            );
            
            if (targetBlank) {
                targetBlank.textContent = word;
                targetBlank.classList.add('filled');
                option.style.display = 'none';
                completed++;
                document.getElementById('letterProgress').textContent = completed;
                
                if (completed >= 5) {
                    setTimeout(() => endLoveLetterGame(), 1000);
                }
            }
        });
    });
}

function endLoveLetterGame() {
    const gameContent = document.getElementById('gameContent');
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFD700, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">💌 Hoàn thành bức thư!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Em hiểu tâm tư của anh quá! 🥰</p>
            <p style="font-size: 1rem;">Bức thư này anh gửi từ trái tim! 💖</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Emotion Guess Game
function initEmotionGuessGame(container) {
    const emotions = [
        { emoji: '😍', name: 'Mê mẩn', correct: true },
        { emoji: '🥰', name: 'Yêu thương', correct: true },
        { emoji: '😘', name: 'Muốn hôn', correct: true },
        { emoji: '😊', name: 'Hạnh phúc', correct: true },
        { emoji: '😴', name: 'Buồn ngủ', correct: false },
        { emoji: '😤', name: 'Tức giận', correct: false },
        { emoji: '🤔', name: 'Suy nghĩ', correct: false },
        { emoji: '😋', name: 'Đói bụng', correct: false }
    ];
    
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Đúng: <span id="emotionScore">0</span></div>
            <div class="game-timer">Còn lại: <span id="emotionLeft">4</span> cảm xúc</div>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <h3 style="color: #FF69B4; font-size: 1.8rem; margin-bottom: 16px;">Anh cảm thấy thế nào khi nhìn em? 💕</h3>
        </div>
        <div class="emotion-faces"></div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>😊 Chọn 4 cảm xúc mà anh có khi nhìn thấy em!</p>
            <p>💖 Hãy chọn những cảm xúc tích cực nhé!</p>
        </div>
    `;
    
    const facesContainer = container.querySelector('.emotion-faces');
    let correctCount = 0;
    let remainingCorrect = 4;
    
    emotions.sort(() => Math.random() - 0.5).forEach(emotion => {
        const face = document.createElement('div');
        face.className = 'emotion-face';
        face.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 8px;">${emotion.emoji}</div>
                <div style="font-size: 0.9rem; color: #666;">${emotion.name}</div>
            </div>
        `;
        
        face.addEventListener('click', () => {
            if (face.classList.contains('selected')) {
                return;
            }
            
            face.classList.add('selected');
            if (emotion.correct) {
                face.classList.add('correct');
                correctCount++;
                remainingCorrect--;
                document.getElementById('emotionScore').textContent = correctCount;
                document.getElementById('emotionLeft').textContent = remainingCorrect;
                createHeartBurst(face);
                playSuccessSound();
                
                if (remainingCorrect <= 0) {
                    setTimeout(() => endEmotionGame(correctCount), 1000);
                }
            } else {
                face.style.background = 'linear-gradient(135deg, #ddd, #bbb)';
                face.style.opacity = '0.5';
            }
        });
        
        facesContainer.appendChild(face);
    });
}

function endEmotionGame(score) {
    const gameContent = document.getElementById('gameContent');
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFB6C1, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">😍 Em hiểu cảm xúc của anh!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Đúng ${score}/4 cảm xúc! 💖</p>
            <p style="font-size: 1rem;">Đúng vậy! Đó là những gì anh cảm thấy khi nhìn em! 🥰</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Heart Puzzle Game
function initHeartPuzzleGame(container) {
    const pieces = ['💖', '💕', '❤️', '💝', '💗', '💘', '🌹', '🎀', '💌'];
    let shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    let selectedPiece = null;
    let moves = 0;
    
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Nước đi: <span id="puzzleMoves">0</span></div>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <h3 style="color: #FF69B4; font-size: 1.6rem; margin-bottom: 16px;">Ghép lại trái tim đã vỡ của anh! 💔➡️❤️</h3>
        </div>
        <div class="puzzle-container"></div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>🧩 Click 2 mảnh để đổi chỗ!</p>
            <p>💖 Xếp chúng theo thứ tự đẹp nhất!</p>
        </div>
    `;
    
    const puzzleContainer = container.querySelector('.puzzle-container');
    
    shuffledPieces.forEach((piece, index) => {
        const puzzlePiece = document.createElement('div');
        puzzlePiece.className = 'puzzle-piece';
        puzzlePiece.textContent = piece;
        puzzlePiece.dataset.index = index;
        
        puzzlePiece.addEventListener('click', () => {
            if (!selectedPiece) {
                selectedPiece = puzzlePiece;
                puzzlePiece.classList.add('selected');
            } else if (selectedPiece === puzzlePiece) {
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            } else {
                // Swap pieces
                const temp = selectedPiece.textContent;
                selectedPiece.textContent = puzzlePiece.textContent;
                puzzlePiece.textContent = temp;
                
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
                moves++;
                document.getElementById('puzzleMoves').textContent = moves;
                
                // Check if puzzle is "solved" (after some moves)
                if (moves >= 5) {
                    setTimeout(() => endHeartPuzzleGame(moves), 500);
                }
            }
        });
        
        puzzleContainer.appendChild(puzzlePiece);
    });
}

function endHeartPuzzleGame(moves) {
    const gameContent = document.getElementById('gameContent');
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFD700, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">❤️ Trái tim anh đã lành!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Em đã ghép lại trong ${moves} nước đi! 💖</p>
            <p style="font-size: 1rem;">Nhờ có em, trái tim anh không còn vỡ nữa! 🥰</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Love Chat Game
function initLoveChatGame(container) {
    const chatMessages = [
        { type: 'bot', text: 'Xin chào em iuuu của a! Anh có điều muốn nói với em 💕' },
        { type: 'options', options: ['Anh muốn nói chi? 😊', 'Em đang nghe đây ❤️'] },
        { type: 'bot', text: 'Anh muốn nói rằng anh yêu em nhiều lắm! Em có tin không? 🥰' },
        { type: 'options', options: ['Tin! ❤️', 'Có bằng chứng không? 🤔'] },
        { type: 'bot', text: 'Bằng chứng là anh viết cả trang web này cho em đóa! 😘' },
        { type: 'options', options: ['Anh ngọt quó, sến quó sến! 😍', 'Anh iuu thiệt là lãng mạn hẹ hẹ! 💕'] },
        { type: 'bot', text: 'Vậy em tha lỗi cho anh chưa? 🙏' },
        { type: 'options', options: ['Tha lỗi rồi! ❤️', 'Em yêu anh! 💖'] },
        { type: 'bot', text: 'Anh cũng iuuu e nhiềuuu lắmmmm 🥰' },
        { type: 'bot', text: 'Moaa moazz moazzzzz 😘😘' },
    ];
    
    container.innerHTML = `
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-area" id="chatInputArea" style="display: none;">
                <input type="text" class="chat-input" placeholder="Nhập tin nhắn..." id="chatInput">
                <button class="chat-send-btn" id="chatSendBtn">💌</button>
            </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>💬 Trò chuyện với anh để hiểu anh hơn!</p>
        </div>
    `;
    
    const messagesContainer = document.getElementById('chatMessages');
    let currentMessageIndex = 0;
    
    function showNextMessage() {
        if (currentMessageIndex >= chatMessages.length) {
            endLoveChatGame();
            return;
        }
        
        const message = chatMessages[currentMessageIndex];
        
        if (message.type === 'bot') {
            addBotMessage(message.text);
            currentMessageIndex++;
            setTimeout(showNextMessage, 2000);
        } else if (message.type === 'options') {
            showOptions(message.options);
        }
    }
    
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function showOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin: 16px 0;';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.cssText = `
                background: linear-gradient(135deg, #FFB6C1, #FF69B4);
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', () => {
                addUserMessage(option);
                optionsDiv.remove();
                currentMessageIndex++;
                setTimeout(showNextMessage, 1000);
            });
            
            optionsDiv.appendChild(button);
        });
        
        messagesContainer.appendChild(optionsDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Start conversation
    setTimeout(showNextMessage, 1000);
}

function endLoveChatGame() {
    const gameContent = document.getElementById('gameContent');
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FFB6C1, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">💬 Cuộc trò chuyện tuyệt vời!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Em và anh hiểu nhau hơn rồi! 🥰</p>
            <p style="font-size: 1rem;">Anh yêu cách em trò chuyện! 💕</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Love Garden Game
function initLoveGardenGame(container) {
    const flowers = ['🌸', '🌹', '🌺', '🌻', '🌷', '💐'];
    let selectedFlower = null;
    let plantsPlanted = 0;
    
    container.innerHTML = `
        <div class="game-progress">
            <div class="game-score">Đã trồng: <span id="gardenScore">0</span> hoa</div>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <h3 style="color: #FF69B4; font-size: 1.6rem; margin-bottom: 16px;">Tạo khu vườn tình yêu cho em! 🌸</h3>
        </div>
        <div class="garden-tools"></div>
        <div class="garden-area"></div>
        <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>🌱 Chọn hoa và click vào đất để trồng!</p>
            <p>🌸 Tạo khu vườn đẹp nhất cho tình yêu của chúng ta!</p>
        </div>
    `;
    
    const toolsContainer = container.querySelector('.garden-tools');
    const gardenContainer = container.querySelector('.garden-area');
    
    // Create flower tools
    flowers.forEach(flower => {
        const tool = document.createElement('button');
        tool.className = 'garden-tool';
        tool.textContent = flower;
        tool.addEventListener('click', () => {
            document.querySelectorAll('.garden-tool').forEach(t => t.classList.remove('selected'));
            tool.classList.add('selected');
            selectedFlower = flower;
        });
        toolsContainer.appendChild(tool);
    });
    
    // Create garden plots
    for (let i = 0; i < 25; i++) {
        const plot = document.createElement('div');
        plot.className = 'garden-plot';
        plot.addEventListener('click', () => {
            if (selectedFlower && !plot.classList.contains('planted')) {
                const flowerElement = document.createElement('div');
                flowerElement.className = 'flower';
                flowerElement.textContent = selectedFlower;
                plot.appendChild(flowerElement);
                plot.classList.add('planted');
                plantsPlanted++;
                document.getElementById('gardenScore').textContent = plantsPlanted;
                
                if (plantsPlanted >= 15) {
                    setTimeout(() => endLoveGardenGame(plantsPlanted), 500);
                }
            }
        });
        gardenContainer.appendChild(plot);
    }
}

function endLoveGardenGame(plantsCount) {
    const gameContent = document.getElementById('gameContent');
    const endDiv = document.createElement('div');
    endDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #90EE90, #FF69B4); color: white; border-radius: 20px; margin: 20px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 16px;">🌸 Khu vườn tuyệt đẹp!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 12px;">Em đã trồng ${plantsCount} bông hoa! 🌺</p>
            <p style="font-size: 1rem;">Đây sẽ là khu vườn tình yêu của chúng ta! 💕</p>
            <button onclick="closeGame()" style="background: white; color: #FF69B4; border: none; padding: 12px 24px; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Đóng game ❤️
            </button>
        </div>
    `;
    gameContent.appendChild(endDiv);
}

// Utility functions
function createHeartBurst(element) {
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: burstHeart 1.5s ease-out forwards;
            left: ${element.offsetLeft + element.offsetWidth/2}px;
            top: ${element.offsetTop + element.offsetHeight/2}px;
        `;
        
        element.parentElement.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}

function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function goHome() {
    window.location.href = 'memories.html';
}

function skipGame() {
    const miniGame = document.getElementById('miniGame');
    if (miniGame) {
        miniGame.style.display = 'none';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SorryGame();
    
    // Add some extra romantic touches
    document.addEventListener('click', (e) => {
        // Create heart on click
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: clickHeart 1s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    });
    
    // Add click heart animation
    const clickHeartStyle = document.createElement('style');
    clickHeartStyle.textContent = `
        @keyframes clickHeart {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -70px) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -100px) scale(0.5); }
        }
    `;
    document.head.appendChild(clickHeartStyle);
    
    // Add background music toggle
    const musicBtn = document.createElement('button');
    musicBtn.innerHTML = '🎵';
    musicBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFB6C1, #FF69B4);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
        transition: all 0.3s ease;
    `;
    
    musicBtn.addEventListener('click', () => {
        const audio = document.getElementById('backgroundMusic');
        if (audio.paused) {
            audio.play().catch(() => console.log('Audio play failed'));
            musicBtn.innerHTML = '🎵';
        } else {
            audio.pause();
            musicBtn.innerHTML = '🔇';
        }
    });
    
    document.body.appendChild(musicBtn);
});

// Add some extra interactive elements
window.addEventListener('mousemove', (e) => {
    // Create trailing hearts occasionally
    if (Math.random() > 0.98) {
        const trailHeart = document.createElement('div');
        trailHeart.textContent = '💖';
        trailHeart.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            font-size: 16px;
            pointer-events: none;
            z-index: -1;
            animation: trailHeart 2s ease-out forwards;
            transform: translate(-50%, -50%);
            opacity: 0.6;
        `;
        
        document.body.appendChild(trailHeart);
        
        setTimeout(() => {
            trailHeart.remove();
        }, 2000);
    }
});

// Add trail heart animation
const trailHeartStyle = document.createElement('style');
trailHeartStyle.textContent = `
    @keyframes trailHeart {
        0% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
    }
`;
document.head.appendChild(trailHeartStyle);
