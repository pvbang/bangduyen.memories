// ==========================================
// TRUNG THU PAGE - INTERACTIVE FEATURES
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMemoryGame();
    initLoveMessages();
    initLanternWishes();
    initSmoothScrolling();
    initVideoControls();
    
    // Add some magical effects
    createFloatingElements();
    initParallaxEffect();
});

// ==========================================
// MEMORY GAME
// ==========================================

let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    score: 0,
    timer: 0,
    timerInterval: null,
    
    symbols: [
        'data/images/01.jpg', 'data/images/02.jpg', 'data/images/03.jpg', 'data/images/04.jpg', 
        'data/images/05.jpg', 'data/images/06.jpg', 'data/images/07.jpg', 'data/images/1.jpg'
    ],
    
    init() {
        this.createBoard();
        this.startTimer();
    },
    
    createBoard() {
        const board = document.getElementById('memory-board');
        if (!board) {
            return;
        }
        
        // Create card pairs
        const cardSymbols = [...this.symbols, ...this.symbols];
        cardSymbols.sort(() => Math.random() - 0.5);
        
        board.innerHTML = '';
        this.cards = [];
        
        cardSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            
            const cardInner = document.createElement('div');
            cardInner.className = 'memory-card-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'memory-card-front';

            const cardBack = document.createElement('div');
            cardBack.className = 'memory-card-back';
            cardBack.style.backgroundImage = `url('${symbol}')`;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            card.addEventListener('click', () => this.flipCard(card));
            
            board.appendChild(card);
            this.cards.push(card);
        });
    },
    
    flipCard(card) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 800);
        }
    },
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.score += 10;
            
            if (this.matchedPairs === this.symbols.length) {
                setTimeout(() => {
                    alert('🎉 Chúc mừng công chúa của anh! Em đã hoàn thành trò chơi rồi! 💖\nĐiểm của em nè: ' + this.score + '\nThời gian: ' + this.timer + 's');
                    this.clearTimer();
                }, 500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.score = Math.max(0, this.score - 2);
        }
        
        this.flippedCards = [];
        this.updateScore();
    },
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const timerEl = document.getElementById('memory-time');
            if(timerEl) {
                timerEl.textContent = this.timer;
            }
        }, 1000);
    },
    
    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    },
    
    updateScore() {
        const scoreEl = document.getElementById('memory-score');
        if(scoreEl) {
            scoreEl.textContent = this.score;
        }
    },
    
    reset() {
        this.clearTimer();
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.timer = 0;
        
        const scoreEl = document.getElementById('memory-score');
        if(scoreEl) {
            scoreEl.textContent = '0';
        }
        const timerEl = document.getElementById('memory-time');
        if(timerEl) {
            timerEl.textContent = '0';
        }
        
        this.init();
    }
};

function initMemoryGame() {
    memoryGame.init();
    
    const resetBtn = document.getElementById('memory-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => memoryGame.reset());
    }
}

// ==========================================
// LOVE MESSAGES GAME
// ==========================================

const loveMessages = [
    "Em à, anh iuu em cao hơn cả núi, dài hơn cả sông, rộng hơn cả đất, xanh hơn cả trời! 💖",
    "Vũ trụ trong mắt anh là em, công chúa xinh đẹp của anh 🌙✨",
    "Nếu như nỗi nhớ của anh như sao trên trời thì thiệt là vô lý, vì anh lúc nào cũng nghĩ về em 💫",
    "Trăng đêm nay tròn lắm, nhưng không tròn bằng tình yêu anh dành cho em 🌕❤️",
    "Em là ánh trăng chiếu sáng cả trái tim và tâm hồn anh trong đêm Trung Thu ni 🌙💕",
    "Anh muốn cùng em ngắm trăng đến hết đời, kể những câu chuyện tình yêu của chúng mình 🥮💖",
    "Bánh trung thu ngọt, nhưng không ngọt bằng nụ cười của em công chúa à 😊🏮",
    "Chúc em một mùa trung thu thật ấm áp, nhiều niềm vui và hạnh phúc bên anh nhié! 🎋✨",
    "Em là ngôi sao sáng nhất dẫn lối cho anh về phía hạnh phúc ⭐💕",
    "Anh thích cuộc đời anh có em, và muốn đi cùng em tới cuối đời 💖🌙",
    "Sương giăng mờ trên ngõ tạm thương... Thương một đời đâu phải tạm thương ❤️",
    "iuuu em cao hơn cả núi dài hơn cả sông, rộng hơn cả đất xanh hơn cả trời, bay ra vũ trụ giãn nở cùng vũ trụ vô hạnnnnn",
    "nếu như nói nỗi nhớ của a như sao trên trời thì thiệt là vô lý, vì sao trên trời còn có bữa quên mọc, còn a thì lúc lào cũng nghĩ dìa e",
    "vũ trụ trong góc nhìn khoa học là màu đen huyền bí, là vật chất tối, năng lượng tối, còn vũ trụ trong mắt a là e",
    "t2 là monday, t3 là tuesday, coàn ny của e là anhday :)))",
    "đường đời rộng lớn mênh mông, muốn mình hạnh phúc sao k chung đường, nhớ ai thao thức đêm trường, trong đầu bóng dáng vẫn thường quẩn quanh, chữ tình ta đẹp như tranh, bởi vì trong đó có a có nàng... nàng công chúa iuu của a 🥰",
    "giữa cuộc đời hàng hàng cám dỗ, a chỉ cần bến đổ là tim e",
    "ngắm mây ngắm cả bầu trời, iu e, ngắm cả cuộc đời đc khom :))",
    "nếu quá khứ của e là một chiếc bánh dở tệ thì a sẽ ăn hết rồi đền cho e một chiếc bánh ngon hơn",
    "thiệt ra chi a cũng muốn về nhất, nma a lại muốn iuu e mãi mãi về sau",
    "chết gòi hqua đọc truyện cổ tích mà quên gấp lại, để công chúa ra cả đây :))))",
    "đố e iu là động từ hay tính từ, tính từ lúc gặp e :))))",
    "bữa ni đầu tóc a cứ xơ xơ, xơ e là nhá :)))",
    "bắc thang lên hỏi ông trời, sao tôi cứ mãi ko thôi nhớ nàng, ông trời cất tiếng khẽ khàng, vì con đã trót để nàng trong tim",
    "có con ma, ma em quế :)))",
    "khi trưa a mơ lạ lắm, a đi lạc trong rừng, xong tự nhiên thấy có bóng ng, xong a chạy theo coi hn là ai :))) ai lớp du :))))))",
    "anh sẵn sàng sến súa một đời, vì nụ cười công chúa của a, coá đôi mắt biếc long lanh, dáng hình in mãi trong anh chẳng rời, mây bay bay mãi trên trời, tình a nói mãi một lời trăm năm :)))",
    "gió về qua ngõ chiều xưa, chợ chiều thanh vắng lưa thưa mấy người, bỗng dưng lại thấy e cười, làm tôi sững lại ngẩn người dại ra :)) long lanh xinh đẹp như hoa, thương a!? nếu đc a qua rước nàng 🙂‍↔️ mẹ cha cho bạc cho vàng, hỏi nàng có chịu cưới chàng hay không, nàng công chúaa iuuu của a",
    "trai việt nam nghìn năm văn vở, gặp đc nàng a thở ra thơ :))) ngỡ nàng bạch tuyết trong mơ, nên đành viết vội bài thơ gửi nàng, hạ sang mang nắng ngập tràn, ngủ mơ may mắn gặp nàng lại vui :))) a vừa mơ được ôm e ngủ đó :)))",
    "A biết là dù ko có anh thì e vẫn làm đc mọi thứ... nma có một điều anh khẳng định được, anh thích cuộc đời anh có em",
    "Nếu anh có thể cho em một khả năng đặc biệt trong cuộc đời này, anh sẽ cho em khả năng nhìn thấy chính mình qua đôi mắt của anh. Sau đó em sẽ nhận ra, em thật đặc biệt thế nào đối với anh.",
    "a với e vô tình gặp nhau, nma a quyết định dừng lại đưa tay, rồi e cũng đồng ý nắm",
    "Khôm được bỏ công túa đi trước một mình"
];

let messageGame = {
    messagesReceived: 0,
    maxMessages: 2332025,
    
    init() {
        const moonClick = document.getElementById('moon-click');
        if (moonClick) {
            moonClick.addEventListener('click', () => this.showMessage());
        }
    },
    
    showMessage() {
        if (this.messagesReceived >= this.maxMessages) {
            const msgDisplay = document.getElementById('message-display');
            if(msgDisplay) {
                msgDisplay.innerHTML = 
                '<p>💖 Em đã nhận hết tất cả lời yêu thương từ anh rồi! Anh iuu em nhiều lắm! 💖</p>';
            }
            return;
        }
        
        const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        const msgDisplay = document.getElementById('message-display');
        if(msgDisplay) {
            msgDisplay.innerHTML = `<p>${randomMessage}</p>`;
        }
        
        this.messagesReceived++;
        const msgCount = document.getElementById('messages-count');
        if(msgCount) {
            msgCount.textContent = this.messagesReceived;
        }
        
        // Add sparkle effect
        this.createSparkleEffect();
        
        if (this.messagesReceived === this.maxMessages) {
            setTimeout(() => {
                const msgDisplay = document.getElementById('message-display');
                if(msgDisplay) {
                    msgDisplay.innerHTML = 
                    '<p>🎉 Chúc mừng công chúa! Em đã nhận đủ 10 lời yêu thương từ anh! Anh iuu em rất nhiều! 💖🌙</p>';
                }
            }, 2000);
        }
    },
    
    createSparkleEffect() {
        const moon = document.querySelector('.moon');
        if (!moon) {
            return;
        }
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '20px';
            sparkle.style.color = '#FFD700';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkleEffect 1s ease-out forwards';
            
            const rect = moon.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
};

function initLoveMessages() {
    messageGame.init();
}

// ==========================================
// LANTERN WISHES GAME
// ==========================================

let lanternGame = {
    wishesCount: 0,
    wishesData: [],
    
    init() {
        // Load saved wishes
        this.loadWishesFromStorage();
        
        const releaseBtn = document.getElementById('release-lantern');
        const wishInput = document.getElementById('wish-input');
        
        if (releaseBtn && wishInput) {
            releaseBtn.addEventListener('click', () => this.releaseLantern());
            wishInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.releaseLantern();
                }
            });
        }
        
        // Initialize data management controls
        this.initDataControls();
    },
    
    initDataControls() {
        const viewBtn = document.getElementById('view-wishes');
        const exportBtn = document.getElementById('export-wishes');
        const importBtn = document.getElementById('import-wishes');
        const importFile = document.getElementById('import-file');
        const clearBtn = document.getElementById('clear-wishes');
        const closeModal = document.getElementById('close-modal');
        const modal = document.getElementById('wishes-modal');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.showWishesModal());
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportWishes());
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', () => importFile.click());
        }
        
        if (importFile) {
            importFile.addEventListener('change', (e) => this.importWishes(e));
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllWishes());
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    },
    
    loadWishesFromStorage() {
        try {
            const savedWishes = localStorage.getItem('trungThuWishes');
            if (savedWishes) {
                this.wishesData = JSON.parse(savedWishes);
                this.wishesCount = this.wishesData.length;
                this.updateWishesCount();
            }
        } catch (error) {
            console.error('Error loading wishes from storage:', error);
            this.wishesData = [];
            this.wishesCount = 0;
        }
    },
    
    saveWishesToStorage() {
        try {
            localStorage.setItem('trungThuWishes', JSON.stringify(this.wishesData));
        } catch (error) {
            console.error('Error saving wishes to storage:', error);
        }
    },
    
    updateWishesCount() {
        const wishesCountEl = document.getElementById('wishes-count');
        if (wishesCountEl) {
            wishesCountEl.textContent = this.wishesCount;
        }
    },
    
    releaseLantern() {
        const wishInput = document.getElementById('wish-input');
        const wish = wishInput.value.trim();
        
        if (!wish) {
            alert('Công chúa hãy viết điều ước của mình trước khi thả đèn nhié! 🏮');
            return;
        }
        
        // Save wish data
        const wishData = {
            id: Date.now(),
            content: wish,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        this.wishesData.push(wishData);
        this.saveWishesToStorage();
        
        const sky = document.getElementById('lanterns-sky');
        const lantern = document.createElement('div');
        lantern.className = 'floating-wish-lantern';
        lantern.innerHTML = '🏮';
        lantern.title = wish;
        
        // Random starting position
        lantern.style.left = Math.random() * (sky.offsetWidth - 40) + 'px';
        lantern.style.bottom = '-50px';
        
        sky.appendChild(lantern);
        
        // Remove lantern after animation
        setTimeout(() => {
            if (lantern.parentNode) {
                lantern.remove();
            }
        }, 8000);
        
        this.wishesCount++;
        this.updateWishesCount();
        
        wishInput.value = '';
        
        // Show success message
        this.showWishMessage(wish);
    },
    
    showWishMessage(wish) {
        // Create a temporary message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, rgba(255, 215, 0, 0.9), rgba(255, 105, 180, 0.9));
            color: white;
            padding: 20px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 215, 0, 0.5);
            animation: wishMessageAppear 3s ease-out forwards;
        `;
        
        message.innerHTML = `
            <div style="margin-bottom: 10px;">🌙 Điều ước của công chúa đã bay lên trời! 🌙</div>
            <div style="font-style: italic; font-size: 0.95rem;">"${wish}"</div>
            <div style="margin-top: 10px; font-size: 0.9rem;">Anh hy vọng điều ước ni sẽ thành hiện thực! 💖</div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    },
    
    showWishesModal() {
        const modal = document.getElementById('wishes-modal');
        const wishesListEl = document.getElementById('wishes-list');
        
        if (!modal || !wishesListEl) return;
        
        if (this.wishesData.length === 0) {
            wishesListEl.innerHTML = `
                <div class="no-wishes">
                    <p>🌙 Chưa có điều ước nào được thả...</p>
                    <p>Hãy viết điều ước đầu tiên của em nhé! 💖</p>
                </div>
            `;
        } else {
            wishesListEl.innerHTML = this.wishesData
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((wish, index) => `
                    <div class="wish-item" data-id="${wish.id}">
                        <div class="wish-header">
                            <span class="wish-number">#${this.wishesData.length - index}</span>
                            <span class="wish-date">${wish.date}</span>
                            <button class="delete-wish-btn" onclick="lanternGame.deleteWish(${wish.id})" title="Xóa điều ước">🗑️</button>
                        </div>
                        <div class="wish-content">"${wish.content}"</div>
                    </div>
                `).join('');
        }
        
        modal.style.display = 'flex';
    },
    
    deleteWish(wishId) {
        if (confirm('Bạn có chắc muốn xóa điều ước này không?')) {
            this.wishesData = this.wishesData.filter(wish => wish.id !== wishId);
            this.wishesCount = this.wishesData.length;
            this.saveWishesToStorage();
            this.updateWishesCount();
            this.showWishesModal(); // Refresh modal
        }
    },
    
    exportWishes() {
        if (this.wishesData.length === 0) {
            alert('Chưa có điều ước nào để xuất! 🌙');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalWishes: this.wishesData.length,
            wishes: this.wishesData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `trung-thu-wishes-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        this.showExportMessage();
    },
    
    importWishes(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.wishes || !Array.isArray(importData.wishes)) {
                    throw new Error('Invalid file format');
                }
                
                const confirmMsg = `Bạn có muốn thêm ${importData.wishes.length} điều ước từ file không?\n(Dữ liệu hiện tại sẽ được giữ lại)`;
                
                if (confirm(confirmMsg)) {
                    // Add imported wishes to existing data
                    importData.wishes.forEach(wish => {
                        // Ensure each wish has required fields
                        if (wish.content) {
                            const newWish = {
                                id: wish.id || Date.now() + Math.random(),
                                content: wish.content,
                                timestamp: wish.timestamp || new Date().toISOString(),
                                date: wish.date || new Date().toLocaleDateString('vi-VN')
                            };
                            this.wishesData.push(newWish);
                        }
                    });
                    
                    this.wishesCount = this.wishesData.length;
                    this.saveWishesToStorage();
                    this.updateWishesCount();
                    
                    alert(`Đã thêm thành công ${importData.wishes.length} điều ước! 🌙💖`);
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Lỗi khi đọc file! Vui lòng kiểm tra định dạng file.');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    },
    
    clearAllWishes() {
        if (this.wishesData.length === 0) {
            alert('Không có điều ước nào để xóa! 🌙');
            return;
        }
        
        const confirmMsg = `Bạn có chắc muốn xóa tất cả ${this.wishesData.length} điều ước không?\nHành động này không thể hoàn tác!`;
        
        if (confirm(confirmMsg)) {
            this.wishesData = [];
            this.wishesCount = 0;
            localStorage.removeItem('trungThuWishes');
            this.updateWishesCount();
            
            const modal = document.getElementById('wishes-modal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
            
            alert('Đã xóa tất cả điều ước! 🌙');
        }
    },
    
    showExportMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, rgba(34, 193, 195, 0.9), rgba(253, 187, 45, 0.9));
            color: white;
            padding: 20px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(34, 193, 195, 0.5);
        `;
        
        message.innerHTML = `
            <div style="margin-bottom: 10px;">📦 Đã tải xuống file điều ước! 📦</div>
            <div style="font-size: 0.9rem;">File đã được lưu vào thư mục Downloads</div>
            <div style="margin-top: 10px; font-size: 0.9rem;">Bây giờ em có thể backup được rồi! 💖</div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
};

function initLanternWishes() {
    lanternGame.init();
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// VIDEO CONTROLS
// ==========================================

function initVideoControls() {
    const video = document.getElementById('trung-thu-video');
    if (!video) {
        return;
    }
    
    // Add custom controls and effects
    video.addEventListener('play', function() {
        console.log('Video started playing');
        // Add some romantic effects when video starts
        createHeartBurst();
    });
    
    video.addEventListener('ended', function() {
        // Show sweet message when video ends
        showVideoEndMessage();
    });
}

function showVideoEndMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, rgba(255, 215, 0, 0.95), rgba(255, 105, 180, 0.95));
        color: white;
        padding: 30px 40px;
        border-radius: 25px;
        font-size: 1.3rem;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(15px);
        border: 3px solid rgba(255, 215, 0, 0.6);
        font-family: 'Dancing Script', cursive;
        max-width: 500px;
    `;
    
    message.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">🌙💖</div>
        <div style="margin-bottom: 15px; font-size: 1.4rem;">
            Video của chúng mình thật đẹp phải không công chúa?
        </div>
        <div style="font-size: 1.1rem; font-style: italic; opacity: 0.9;">
            Mỗi khoảnh khắc bên em đều là kỷ niệm đáng trân trọng trong trái tim anh
        </div>
        <div style="margin-top: 20px; font-size: 0.9rem;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); border: 2px solid white; 
                           color: white; padding: 8px 20px; border-radius: 20px; 
                           cursor: pointer; font-size: 0.9rem;">
                Đóng 💕
            </button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 8000);
}

function createHeartBurst() {
    const container = document.querySelector('.video-container');
    if (!container) {
        return;
    }
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            animation: heartBurst 2s ease-out forwards;
            z-index: 100;
        `;
        
        const rect = container.getBoundingClientRect();
        heart.style.left = (rect.width / 2 + Math.random() * 100 - 50) + 'px';
        heart.style.top = (rect.height / 2 + Math.random() * 100 - 50) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }
}

// ==========================================
// FLOATING ELEMENTS
// ==========================================

function createFloatingElements() {
    // Add more floating elements dynamically
    setInterval(createRandomStar, 3000);
    setInterval(createRandomHeart, 5000);
}

function createRandomStar() {
    const star = document.createElement('div');
    star.innerHTML = '✨';
    star.style.cssText = `
        position: fixed;
        font-size: 18px;
        color: #FFD700;
        pointer-events: none;
        z-index: -1;
        animation: randomFloat 8s linear forwards;
        left: ${Math.random() * 100}%;
        top: 100%;
    `;
    
    document.body.appendChild(star);
    
    setTimeout(() => star.remove(), 8000);
}

function createRandomHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.cssText = `
        position: fixed;
        font-size: 16px;
        pointer-events: none;
        z-index: -1;
        animation: randomFloat 10s linear forwards;
        left: ${Math.random() * 100}%;
        top: 100%;
        opacity: 0.7;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 10000);
}

// ==========================================
// PARALLAX EFFECT
// ==========================================

function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.background-animation');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ==========================================
// CSS ANIMATIONS (Added via JavaScript)
// ==========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleEffect {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) rotate(360deg) translateY(-50px);
        }
    }
    
    @keyframes wishMessageAppear {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        30% {
            transform: translate(-50%, -50%) scale(1);
        }
        90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    @keyframes heartBurst {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) translateY(-80px);
        }
    }
    
    @keyframes randomFloat {
        0% {
            opacity: 0;
            transform: translateY(0px) rotate(0deg);
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) rotate(360deg);
        }
    }
`;

document.head.appendChild(style);

// ==========================================
// SPECIAL EFFECTS FOR TRUNG THU
// ==========================================

// Create shooting stars occasionally
setInterval(() => {
    if (Math.random() < 0.3) {
        createShootingStar();
    }
}, 8000);

function createShootingStar() {
    const star = document.createElement('div');
    star.innerHTML = '🌟';
    star.style.cssText = `
        position: fixed;
        font-size: 20px;
        top: ${Math.random() * 30}%;
        left: -50px;
        z-index: -1;
        animation: shootingStar 3s linear forwards;
        filter: drop-shadow(0 0 10px #FFD700);
    `;
    
    document.body.appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
}

// Add shooting star animation
const shootingStarStyle = document.createElement('style');
shootingStarStyle.textContent = `
    @keyframes shootingStar {
        0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateX(calc(100vw + 100px)) translateY(50vh) rotate(45deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(shootingStarStyle);

// Welcome message when page loads
setTimeout(() => {
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(145deg, rgba(255, 215, 0, 0.9), rgba(255, 105, 180, 0.9));
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 1rem;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 215, 0, 0.5);
        animation: welcomeSlide 4s ease-out forwards;
        font-family: 'Dancing Script', cursive;
    `;
    
    welcomeMsg.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 5px;">🌙✨</div>
            <div>Chào mừng công chúa đến với trang Trung Thu của chúng mình!</div>
            <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.9;">Anh iuu em nhiều lắm! 💖</div>
        </div>
    `;
    
    document.body.appendChild(welcomeMsg);
    
    setTimeout(() => {
        if (welcomeMsg.parentNode) {
            welcomeMsg.remove();
        }
    }, 6000);
}, 2000);

// Add welcome animation
const welcomeStyle = document.createElement('style');
welcomeStyle.textContent = `
    @keyframes welcomeSlide {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        20% {
            transform: translateX(0);
            opacity: 1;
        }
        80% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(welcomeStyle);