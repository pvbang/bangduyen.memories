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
    makeUpDay: new Date("2025-04-24"),
    // 200 days
    days200: new Date("2025-10-09"),
    // 300 days
    days300: new Date("2026-01-17"),
    // Valentine
    valentine: new Date("2026-02-14"),
    // 8/3
    march8: new Date("2026-03-08"),
    // 1 year
    oneYear: new Date("2026-03-23")
};

// Update all counters with smooth animation
function updateAllCounters() {
    updateLoveCounter();
    updateBirthdayCounters();
    updateDaysCounters();
    updateMilestoneCountdowns();
}

// Tính chính xác năm, tháng, ngày giữa 2 mốc thời gian theo lịch thực
function calcYMD(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days };
}

// Update love counter with years, months, days, hours, minutes, seconds
function updateLoveCounter() {
    const now = new Date();
    const loveStart = IMPORTANT_DATES.officialCouple;
    const loveStartDate = new Date("2025-03-23");

    if (now < loveStartDate) {
        const timeDiff = loveStartDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        animateCounter("totalYears", 0);
        animateCounter("totalMonths", 0);
        animateCounter("totalDays", days);
        animateCounter("totalDaysOverall", 0);
        animateCounter("totalHours", hours);
        animateCounter("totalMinutes", minutes);
        animateCounter("totalSeconds", seconds);

        document.getElementById("progressFill").style.width = "0%";
        return;
    }

    const ymd = calcYMD(loveStartDate, now);
    const totalDaysOverall = Math.floor((now - loveStartDate) / (1000 * 60 * 60 * 24));

    const timeDiff = now - loveStart;
    const totalSec = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSec / 3600) % 24;
    const minutes = Math.floor(totalSec / 60) % 60;
    const seconds = totalSec % 60;

    animateCounter("totalYears", ymd.years);
    animateCounter("totalMonths", ymd.months);
    animateCounter("totalDays", ymd.days);
    animateCounter("totalDaysOverall", Math.max(0, totalDaysOverall));
    animateCounter("totalHours", hours);
    animateCounter("totalMinutes", minutes);
    animateCounter("totalSeconds", seconds);

    const progressPercent = Math.min((totalDaysOverall / 1000) * 100, 100);
    document.getElementById("progressFill").style.width = progressPercent + "%";

    const progressText = document.querySelector(".progress-text");
    if (progressText) {
        progressText.textContent = `Hành trình tới 1000 ngày yêu nhau ❤️ (Hiện tại: ${Math.max(0, totalDaysOverall)} ngày)`;
    }
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

    // Days since 200 days
    const daysSince200 = Math.floor((now - IMPORTANT_DATES.days200) / (1000 * 60 * 60 * 24));
    const el200 = document.getElementById("daysSince200Days");
    if (el200) animateCounter("daysSince200Days", Math.max(0, daysSince200));

    // Days since 300 days
    const daysSince300 = Math.floor((now - IMPORTANT_DATES.days300) / (1000 * 60 * 60 * 24));
    const el300 = document.getElementById("daysSince300Days");
    if (el300) animateCounter("daysSince300Days", Math.max(0, daysSince300));

    // Days since Valentine
    const daysSinceVal = Math.floor((now - IMPORTANT_DATES.valentine) / (1000 * 60 * 60 * 24));
    const elVal = document.getElementById("daysSinceValentine");
    if (elVal) animateCounter("daysSinceValentine", Math.max(0, daysSinceVal));

    // Days since March 8
    const daysSinceMar8 = Math.floor((now - IMPORTANT_DATES.march8) / (1000 * 60 * 60 * 24));
    const elMar8 = document.getElementById("daysSinceMarch8");
    if (elMar8) animateCounter("daysSinceMarch8", Math.max(0, daysSinceMar8));
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
    },
    {
        id: 10,
        date: "2025-07-01",
        title: "100 Ngày Yêu Nhau 👑",
        description: "Cột mốc 100 ngày chính thức yêu nhau",
        icon: "👑",
        story: "Tròn trăm ngày chung lối! Anh đã tốt nghiệp xuất sắc khóa chiều chuộng công chúa. 100 ngày tập sự làm người yêu, anh đạt loại giỏi chưa nhỉ?"
    },
    {
        id: 11,
        date: "2025-10-08",
        title: "Sinh Nhật Công Chúa 🎂",
        description: "Sinh nhật đầu tiên của em khi có anh bên cạnh",
        icon: "🎂",
        story: "Ngày đặc biệt nhất của công chúa! Sinh nhật đầu tiên bên nhau, chúc em luôn xinh đẹp, hạnh phúc và được yêu thương!"
    },
    {
        id: 12,
        date: "2025-10-09",
        title: "200 Ngày Bên Nhau 📸",
        description: "200 ngày album ảnh đầy ắp nụ cười",
        icon: "📸",
        story: "200 ngày trôi qua nhanh như chớp mắt. Album ảnh đầy ắp nụ cười. Đi đâu cũng được, ăn gì cũng ngon, miễn là có em đi cùng!"
    },
    {
        id: 13,
        date: "2025-10-28",
        title: "Sinh Nhật Anh 🎉",
        description: "Sinh nhật đầu tiên của anh khi có em",
        icon: "🎉",
        story: "Sinh nhật có ý nghĩa nhất từ trước đến giờ vì có công chúa iuuu ở bên!"
    },
    {
        id: 14,
        date: "2026-01-17",
        title: "300 Ngày Yêu Thương 💎",
        description: "300 ngày tình yêu không có điểm dừng",
        icon: "💎",
        story: "300 ngày - con số tròn trĩnh, nhưng tình yêu anh dành cho em thì không có điểm dừng, nó cứ lớn lớn lớn mãi thôi!",
        special: true
    },
    {
        id: 15,
        date: "2026-02-14",
        title: "Valentine Đầu Tiên 🌹",
        description: "Ngày lễ tình nhân đầu tiên bên nhau",
        icon: "🌹",
        story: "Valentine đầu tiên chính thức bên nhau! Ngày lễ tình nhân thêm ý nghĩa khi có người mình yêu thương ở bên cạnh."
    },
    {
        id: 16,
        date: "2026-03-08",
        title: "8/3 Ngày Của Em 💐",
        description: "Ngày Quốc tế Phụ nữ - Ngày của công chúa",
        icon: "💐",
        story: "Ngày 8/3 đầu tiên bên nhau! Chúc công chúa iuuu luôn xinh đẹp, hạnh phúc. Cảm ơn em vì đã là người phụ nữ tuyệt vời nhất bên anh!"
    },
    {
        id: 17,
        date: "2026-03-23",
        title: "1 NĂM YÊU NHAU! 🏆",
        description: "365 ngày - Tròn 1 năm chính thức yêu nhau!",
        icon: "🏆",
        story: "1 năm tròn! 365 ngày yêu nhau! Cảm ơn em vì tất cả. Đây mới chỉ là chương đầu tiên, còn nhiều chương đẹp hơn phía trước!",
        special: true
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