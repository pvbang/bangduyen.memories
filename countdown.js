// Countdown page functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initCountdown();
    updateAllCountdowns();
    initQuotesCarousel();
    
    // Update all counters every second
    setInterval(updateAllCountdowns, 1000);
    
    // Update quotes every 10 seconds
    setInterval(autoNextQuote, 10000);
});

// Check authentication
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Love start date (23/03/2025 - chính thức thành ny)
const loveStartDate = new Date('2025-03-23T00:00:00');

// Important dates
const importantDates = {
    bangBirthday: calculateNextBirthday(10, 28), // October 28
    anniversary: new Date('2026-03-23T00:00:00'), // Kỷ niệm 1 năm
    duyenBirthday: calculateNextBirthday(10, 8)  // October 8
};

// Initialize countdown
function initCountdown() {
    // Set up birthday dates
    document.getElementById('duyenBirthday').textContent = formatDateDisplay(importantDates.duyenBirthday);
    document.getElementById('bangBirthday').textContent = formatDateDisplay(importantDates.bangBirthday);
    
    // Initialize progress ring
    initProgressRing();
}

// Update all countdowns
function updateAllCountdowns() {
    updateMainCounter();
    updateSpecialCountdowns();
    updateMilestoneCountdown();
}

// Update main love counter
function updateMainCounter() {
    const now = new Date();
    const timeDiff = now - loveStartDate;
    
    // Calculate detailed time
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update main display
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    
    // Update detailed time
    document.getElementById('detailYears').textContent = years;
    document.getElementById('detailMonths').textContent = months;
    document.getElementById('detailDays').textContent = days;
    document.getElementById('detailHours').textContent = hours;
    document.getElementById('detailMinutes').textContent = minutes;
    document.getElementById('detailSeconds').textContent = seconds;
    
    // Update progress ring
    updateProgressRing(totalDays);
}

// Initialize progress ring
function initProgressRing() {
    const circle = document.getElementById('progressCircle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
}

// Update progress ring
function updateProgressRing(totalDays) {
    const circle = document.getElementById('progressCircle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    // Progress towards 1000 days
    const progress = Math.min(totalDays / 1000, 1);
    const offset = circumference - (progress * circumference);
    
    circle.style.strokeDashoffset = offset;
}

// Update special countdowns
function updateSpecialCountdowns() {
    updateCountdown('bangBirthday', importantDates.bangBirthday, 'engage');
    updateCountdown('anniversary', importantDates.anniversary, 'anni');
    updateCountdown('duyenBirthday', importantDates.duyenBirthday, 'duyen');
    updateCountdown('bangBirthday', importantDates.bangBirthday, 'bang');
}

// Update individual countdown
function updateCountdown(eventName, targetDate, prefix) {
    const now = new Date();
    const timeDiff = targetDate - now;
    
    if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById(`${prefix}Days`).textContent = days;
        document.getElementById(`${prefix}Hours`).textContent = hours;
        document.getElementById(`${prefix}Minutes`).textContent = minutes;
        
        // Update progress bar
        updateCountdownProgress(eventName, targetDate, prefix);
    } else {
        // Event has passed, update for next year (for birthdays)
        if (eventName.includes('Birthday')) {
            const nextYear = targetDate.getFullYear() + 1;
            const nextBirthday = new Date(targetDate);
            nextBirthday.setFullYear(nextYear);
            
            importantDates[eventName] = nextBirthday;
            document.getElementById(`${eventName === 'duyenBirthday' ? 'duyen' : 'bang'}Birthday`).textContent = 
                formatDateDisplay(nextBirthday);
        }
    }
}

// Update countdown progress
function updateCountdownProgress(eventName, targetDate, prefix) {
    let startDate;
      switch(eventName) {
        case 'bangBirthday':
        case 'anniversary':
            startDate = loveStartDate;
            break;
        case 'duyenBirthday':
        case 'bangBirthday':
            startDate = new Date(targetDate.getFullYear() - 1, targetDate.getMonth(), targetDate.getDate());
            break;
        default:
            startDate = loveStartDate;
    }
    
    const now = new Date();
    const totalTime = targetDate - startDate;
    const elapsedTime = now - startDate;
    const progress = Math.min((elapsedTime / totalTime) * 100, 100);
    
    const progressElement = document.getElementById(`${prefix}Progress`);
    if (progressElement) {
        progressElement.style.width = `${progress}%`;
    }
}

// Update milestone countdown (1000 days)
function updateMilestoneCountdown() {
    const milestone1000Date = new Date(loveStartDate);
    milestone1000Date.setDate(milestone1000Date.getDate() + 1000);
    
    const now = new Date();
    const timeDiff = milestone1000Date - now;
    
    const milestone1000Element = document.getElementById('milestone1000');
    if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        milestone1000Element.textContent = `Còn ${days} ngày nữa`;
    } else {
        milestone1000Element.textContent = 'Đã hoàn thành! 🎉';
    }
}

// Calculate next birthday
function calculateNextBirthday(month, day) {
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthday = new Date(currentYear, month - 1, day);
    
    // If birthday has passed this year, set for next year
    if (birthday < now) {
        birthday.setFullYear(currentYear + 1);
    }
    
    return birthday;
}

// Format date for display
function formatDateDisplay(date) {
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Quotes carousel functionality
let currentQuoteIndex = 0;
const quotes = [
    {
        text: "Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.",
        author: "Antoine de Saint-Exupéry"
    },
    {
        text: "Thời gian không làm tình yêu nhạt đi, mà làm nó sâu sắc hơn.",
        author: "Anaïs Nin"
    },
    {
        text: "Trong tình yêu, một phút có thể bằng cả một đời.",
        author: "Benjamin Disraeli"
    },
    {
        text: "Tình yêu thật sự là khi bạn không thể ngủ vì thực tế đẹp hơn cả giấc mơ.",
        author: "Dr. Seuss"
    },
    {
        text: "Được ai đó yêu sâu sắc sẽ cho bạn sức mạnh, còn yêu ai đó sâu sắc sẽ cho bạn dũng khí.",
        author: "Lao Tzu"
    }
];

// Initialize quotes carousel
function initQuotesCarousel() {
    const quotesContainer = document.querySelector('.quotes-carousel');
    quotesContainer.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const quoteCard = document.createElement('div');
        quoteCard.className = `quote-card ${index === 0 ? 'active' : ''}`;
        quoteCard.innerHTML = `
            <p>"${quote.text}"</p>
            <cite>- ${quote.author}</cite>
        `;
        quotesContainer.appendChild(quoteCard);
    });
}

// Show next quote
function nextQuote() {
    const quoteCards = document.querySelectorAll('.quote-card');
    quoteCards[currentQuoteIndex].classList.remove('active');
    
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteCards[currentQuoteIndex].classList.add('active');
}

// Show previous quote
function previousQuote() {
    const quoteCards = document.querySelectorAll('.quote-card');
    quoteCards[currentQuoteIndex].classList.remove('active');
    
    currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    quoteCards[currentQuoteIndex].classList.add('active');
}

// Auto next quote
function autoNextQuote() {
    nextQuote();
}

// Add some dynamic effects
function addDynamicEffects() {
    // Add floating hearts animation to special milestones
    const achievements = document.querySelectorAll('.achievement-item.completed');
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            achievement.style.animation = 'celebration 2s ease-in-out';
        }, index * 200);
    });
}

// Call dynamic effects after page load
setTimeout(addDynamicEffects, 1000);

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .quote-card {
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.5s ease;
    }
    
    .quote-card.active {
        opacity: 1;
        transform: translateX(0);
    }
    
    .progress-ring-circle.active {
        transition: stroke-dashoffset 0.5s ease-in-out;
    }
    
    .counter-number, .time-number {
        transition: all 0.3s ease;
    }
    
    .achievement-item {
        transition: all 0.3s ease;
    }
    
    .achievement-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(255, 107, 157, 0.2);
    }
`;
document.head.appendChild(style);
