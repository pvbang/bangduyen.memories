// Timeline page functionality - Tính toán thời gian chính xác và hiện đại
document.addEventListener("DOMContentLoaded", function () {
    // Auth-guard.js đã xử lý việc kiểm tra xác thực
    initializeTimeline();
    updateAllCounters();
    loadTimelineEvents();
    setupModal();
    setupScrollAnimations();
    
    // Update counters every second with smooth animation
    setInterval(updateAllCounters, 1000);
    
    // Add intersection observer for scroll animations
    observeElements();
});

// Initialize timeline functionality
function initializeTimeline() {
    console.log("Timeline initialized with enhanced features");
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
}

// Important dates - Chính xác theo yêu cầu với thông tin chi tiết
const IMPORTANT_DATES = {
    // Sinh nhật Bang - 28/10/2002 (23/09/2002 âm lịch)
    bangBirthday: new Date("2002-10-28"),
    bangBirthdayLunar: "23/09/2002 âm lịch",
    // Sinh nhật Duyên - 08/10/2003
    duyenBirthday: new Date("2003-10-08"),
    // Lần đầu gặp nhau - 08/02/2025
    firstMeet: new Date("2025-02-08"),
    // Tin nhắn đầu tiên - 09/02/2025
    firstMessage: new Date("2025-02-09"),
    // Đổi màu mess - 28/02/2025
    changeMessColor: new Date("2025-02-28"),
    // First dates
    firstDate1: new Date("2025-03-06"),
    firstDate2: new Date("2025-03-12"),
    firstDate3: new Date("2025-03-15"),
    firstDate4: new Date("2025-03-22"),
    // Chính thức thành người yêu - 23/03/2025 19h30
    officialCouple: new Date("2025-03-23T19:30:00"),
    // Ngày chuộc lỗi - 24/04/2025
    makeUpDay: new Date("2025-04-24")
};

// Update all counters with smooth animation
function updateAllCounters() {
    updateLoveCounter();
    updateBirthdayCounters();
    updateDaysCounters();
    updateMilestoneCountdowns();
}

// Update love counter with years, months, days, hours, minutes, seconds
function updateLoveCounter() {
    const now = new Date();
    const loveStart = IMPORTANT_DATES.officialCouple;
    
    if (now < loveStart) {
        // Nếu chưa tới ngày yêu
        const timeDiff = loveStart - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        animateCounter("totalYears", 0);
        animateCounter("totalMonths", 0);
        animateCounter("totalDays", days);
        animateCounter("totalHours", hours);
        animateCounter("totalMinutes", minutes);
        animateCounter("totalSeconds", seconds);
        
        // Progress bar (0% nếu chưa yêu)
        document.getElementById("progressFill").style.width = "0%";
        return;
    }
    
    const timeDiff = now - loveStart;
    
    // Tính toán chi tiết hơn
    const totalSeconds = Math.floor(timeDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalMonths = Math.floor(totalDays / 30.44); // Average days per month
    const totalYears = Math.floor(totalDays / 365.25); // Account for leap years
    
    // Phần dư để hiển thị
    const years = totalYears;
    const months = totalMonths % 12;
    const days = totalDays % Math.floor(30.44);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    animateCounter("totalYears", years);
    animateCounter("totalMonths", months);
    animateCounter("totalDays", days);
    animateCounter("totalHours", hours);
    animateCounter("totalMinutes", minutes);
    animateCounter("totalSeconds", seconds);
    
    // Progress towards 1000 days
    const progressPercent = Math.min((totalDays / 1000) * 100, 100);
    document.getElementById("progressFill").style.width = progressPercent + "%";
}

// Animate counter numbers
function animateCounter(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== newValue) {
        element.textContent = newValue;
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Update birthday counters and ages
function updateBirthdayCounters() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Tính tuổi Bang
    let bangAge = currentYear - IMPORTANT_DATES.bangBirthday.getFullYear();
    const bangBirthdayThisYear = new Date(currentYear, IMPORTANT_DATES.bangBirthday.getMonth(), IMPORTANT_DATES.bangBirthday.getDate());
    if (now < bangBirthdayThisYear) {
        bangAge--;
    }
    
    // Tính tuổi Duyên
    let duyenAge = currentYear - IMPORTANT_DATES.duyenBirthday.getFullYear();
    const duyenBirthdayThisYear = new Date(currentYear, IMPORTANT_DATES.duyenBirthday.getMonth(), IMPORTANT_DATES.duyenBirthday.getDate());
    if (now < duyenBirthdayThisYear) {
        duyenAge--;
    }
    
    animateCounter("bangAge", bangAge);
    animateCounter("duyenAge", duyenAge);
    
    // Tính ngày sinh nhật tiếp theo
    const nextBangBirthday = now < bangBirthdayThisYear ? bangBirthdayThisYear : new Date(currentYear + 1, IMPORTANT_DATES.bangBirthday.getMonth(), IMPORTANT_DATES.bangBirthday.getDate());
    const nextDuyenBirthday = now < duyenBirthdayThisYear ? duyenBirthdayThisYear : new Date(currentYear + 1, IMPORTANT_DATES.duyenBirthday.getMonth(), IMPORTANT_DATES.duyenBirthday.getDate());
    
    const daysToBangBirthday = Math.ceil((nextBangBirthday - now) / (1000 * 60 * 60 * 24));
    const daysToDuyenBirthday = Math.ceil((nextDuyenBirthday - now) / (1000 * 60 * 60 * 24));
      animateCounter("bangNextBirthday", daysToBangBirthday);
    animateCounter("duyenNextBirthday", daysToDuyenBirthday);
}

// Update days since important events
function updateDaysCounters() {
    const now = new Date();
    
    // Days since first meet
    const daysSinceFirstMeet = Math.floor((now - IMPORTANT_DATES.firstMeet) / (1000 * 60 * 60 * 24));
    const firstMeetElement = document.getElementById("daysSinceFirstMeet");
    if (firstMeetElement) {
        animateCounter("daysSinceFirstMeet", Math.max(0, daysSinceFirstMeet));
    }
    
    // Days since first message
    const daysSinceFirstMessage = Math.floor((now - IMPORTANT_DATES.firstMessage) / (1000 * 60 * 60 * 24));
    const firstMessageElement = document.getElementById("daysSinceFirstMessage");
    if (firstMessageElement) {
        animateCounter("daysSinceFirstMessage", Math.max(0, daysSinceFirstMessage));
    }
    
    // Days since color change
    const daysSinceColorChange = Math.floor((now - IMPORTANT_DATES.changeMessColor) / (1000 * 60 * 60 * 24));
    const colorChangeElement = document.getElementById("daysSinceColorChange");
    if (colorChangeElement) {
        animateCounter("daysSinceColorChange", Math.max(0, daysSinceColorChange));
    }
    
    // Days since official couple
    const daysSinceOfficial = Math.floor((now - IMPORTANT_DATES.officialCouple) / (1000 * 60 * 60 * 24));
    const officialElement = document.getElementById("daysSinceOfficial");
    if (officialElement) {
        animateCounter("daysSinceOfficial", Math.max(0, daysSinceOfficial));
    }
}

// Enhanced milestone countdowns with multiple milestones
function updateMilestoneCountdowns() {
    const now = new Date();
    const loveStart = IMPORTANT_DATES.officialCouple;
    
    // Array of milestones
    const milestones = [
        { days: 30, elementId: "milestone30days", countdownId: "countdown30days" },
        { days: 50, elementId: "milestone50days", countdownId: "countdown50days" },
        { days: 100, elementId: "milestone100days", countdownId: "countdown100days" },
        { days: 200, elementId: "milestone200days", countdownId: "countdown200days" },
        { days: 365, elementId: "milestone365days", countdownId: "countdown365days" },
        { days: 500, elementId: "milestone500days", countdownId: "countdown500days" },
        { days: 1000, elementId: "milestone1000days", countdownId: "countdown1000days" }
    ];
    
    milestones.forEach(milestone => {
        const milestoneDate = new Date(loveStart.getTime() + (milestone.days * 24 * 60 * 60 * 1000));
        const milestoneElement = document.getElementById(milestone.elementId);
        const countdownElement = document.getElementById(milestone.countdownId);
        
        if (milestoneElement && countdownElement) {
            milestoneElement.textContent = formatDate(milestoneDate);
            
            if (now < milestoneDate) {
                const daysToMilestone = Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24));
                countdownElement.textContent = `Còn ${daysToMilestone} ngày`;
                countdownElement.style.color = "";
            } else {
                countdownElement.textContent = "Đã qua ✓";
                countdownElement.style.color = "#48bb78";
                
                // Mark milestone card as achieved
                const milestoneCard = countdownElement.closest('.milestone-card');
                if (milestoneCard) {
                    milestoneCard.classList.remove('upcoming');
                    milestoneCard.classList.add('achieved');
                }
            }
        }
    });
      // 1 year milestone
    const milestone1Year = new Date(loveStart.getFullYear() + 1, loveStart.getMonth(), loveStart.getDate(), loveStart.getHours(), loveStart.getMinutes());
    const countdown1YearElement = document.getElementById("countdown1year");
    
    if (countdown1YearElement) {
        if (now < milestone1Year) {
            const daysTo1Year = Math.ceil((milestone1Year - now) / (1000 * 60 * 60 * 24));
            countdown1YearElement.textContent = `Còn ${daysTo1Year} ngày`;
            countdown1YearElement.style.color = "";
        } else {
            countdown1YearElement.textContent = "Đã qua ✓";
            countdown1YearElement.style.color = "#48bb78";
        }
    }
}

// Timeline events data - Enhanced với nội dung chi tiết hơn
const timelineEvents = [
    {
        id: 1,
        date: "2025-02-08",
        title: "Lần Đầu Gặp Nhau 👫",
        description: "Ngày định mệnh - chúng mình gặp nhau lần đầu tiên tại văn phòng",
        icon: "👫",
        story: "Một cuộc gặp gỡ định mệnh đã thay đổi cuộc đời cả hai. Em là con bé chiều hôm qua mới qua văn phòng chào mọi người. Ai ngờ đó lại là khởi đầu cho một câu chuyện tình yêu đẹp như cổ tích..."
    },
    {
        id: 2,
        date: "2025-02-09",
        title: "Tin Nhắn Đầu Tiên 💬",
        description: "\"Anh ơi, e là con bé chiều hôm qua mới qua văn phòng chào mn á. E hỏi anh cái này xíu\"",
        icon: "💬",
        story: "Tin nhắn đầu tiên của em đã mở ra cánh cửa cho tình yêu của chúng mình. Một câu hỏi đơn giản nhưng đã kết nối hai trái tim, bắt đầu những cuộc trò chuyện không bao giờ muốn kết thúc."
    },
    {
        id: 3,
        date: "2025-02-28",
        title: "Đổi Màu Mess 🎨",
        description: "Ngày anh đổi màu tin nhắn - dấu hiệu đầu tiên của tình cảm đặc biệt",
        icon: "🎨",
        story: "Một cử chỉ nhỏ nhưng có ý nghĩa lớn. Cả hai đều cảm nhận được sự khác biệt trong mối quan hệ. Anh nghiêm túc."
    },
    {
        id: 4,
        date: "2025-03-06",
        title: "First Date #1 💝",
        description: "Cuộc hẹn hò đầu tiên của chúng ta",
        icon: "💝",
        story: "Buổi hẹn đầu tiên đầy ắp những cảm xúc mới mẻ và hồi hộp. Anh dắt e đi ăn món Hàn Quắc dở ẹc :))). Xong dắt e đi bắn cung,..."
    },
    {
        id: 5,
        date: "2025-03-12",
        title: "Date #2 💕",
        description: "Cuộc hẹn thứ hai ngày càng gần nhau hơn",
        icon: "💕",
        story: "Chúng ta ngày càng hiểu nhau hơn qua những cuộc trò chuyện sâu sắc. Tình cảm bắt đầu nảy nở."
    },
    {
        id: 6,
        date: "2025-03-15",
        title: "Date #3 💖",
        description: "Cuộc hẹn thứ ba với nhiều cảm xúc",
        icon: "💖",
        story: "Tình cảm giữa hai ta ngày càng sâu đậm và rõ ràng hơn. Cả hai đều cảm nhận được điều gì đó đặc biệt."
    },
    {
        id: 7,
        date: "2025-03-22",
        title: "Date #4 🌹",
        description: "Cuộc hẹn cuối cùng trước khi trở thành người yêu",
        icon: "🌹",
        story: "Buổi hẹn cuối cùng trước khi anh chính thức tỏ tình với em."
    },
    {
        id: 8,
        date: "2025-03-23",
        title: "Chính Thức Thành Người Yêu ❤️",
        description: "Ngày thiêng liêng nhất - anh tỏ tình và em đồng ý",
        icon: "❤️",
        story: "\"Em đồng ý làm người yêu anh nha\" - Câu trả lời làm anh hạnh phúc nhất đời. Từ đây, chúng ta chính thức bắt đầu hành trình tình yêu.",
        special: true
    },
    {
        id: 9,
        date: "2025-04-24",
        title: "Ngày Chuộc Lỗi Đặc Biệt 🤭",
        description: "Ngày anh thêm vào lịch để chuộc lỗi vì nhầm",
        icon: "🤭",
        story: "\"Bị cáo đề nghị thêm một ngày 24 vào lịch là ngày chuộc lỗi nữa :)))\" Một ngày đặc biệt chỉ có của riêng chúng mình."
    }
];

// Load timeline events
function loadTimelineEvents() {
    const timelineContainer = document.getElementById("timelineEvents");
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = "";
    
    // Sort events by date
    timelineEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    timelineEvents.forEach((event, index) => {
        const eventElement = createTimelineEvent(event, index);
        timelineContainer.appendChild(eventElement);
    });
}

// Create timeline event element
function createTimelineEvent(event, index) {
    const eventDiv = document.createElement("div");    eventDiv.className = `timeline-event${event.special ? ' special' : ''}`;
    eventDiv.dataset.eventId = event.id;
    
    var formattedDate = formatDate(event.date);
    if (formattedDate == "Invalid Date") {
        formattedDate = 'Ký ức';
    }
    
    eventDiv.innerHTML = `
        <div class="event-marker" onclick="showEventModal(${event.id})">
            ${event.icon}
        </div>
        <div class="event-content" onclick="showEventModal(${event.id})">
            <div class="event-date">${formattedDate}</div>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
        </div>
    `;
    
    return eventDiv;
}

// Show event modal
function showEventModal(eventId) {
    const event = timelineEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById("eventModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDate = document.getElementById("modalDate");
    const modalDescription = document.getElementById("modalDescription");
    const modalStory = document.getElementById("modalStory");
    
    if (modal && modalTitle && modalDate && modalDescription && modalStory) {
        modalTitle.textContent = event.title;
        modalDate.textContent = formatDate(event.date);
        modalDescription.textContent = event.description;
        modalStory.textContent = event.story;
        
        modal.style.display = "block";
    }
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById("eventModal");
    const closeBtn = document.getElementById("closeModal");
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }
    
    if (modal) {
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe timeline events
    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach(event => {
        observer.observe(event);
    });
    
    // Observe other animated elements
    const animatedElements = document.querySelectorAll('.love-counter-card, .date-card, .milestone-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('vi-VN', options);
}

// Export functions for global access
window.showEventModal = showEventModal;