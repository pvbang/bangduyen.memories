// Timeline page functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initTimeline();
    updateLoveCounter();
    loadTimelineEvents();
    loadMilestones();
    updateStats();
    
    // Update counters every second
    setInterval(updateLoveCounter, 1000);
    setInterval(updateCountdowns, 1000);
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

// Initialize timeline
function initTimeline() {
    const filterButtons = document.querySelectorAll('.timeline-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTimelineEvents(this.dataset.filter);
        });
    });
}

// Love start date
const loveStartDate = new Date('2022-03-23T00:00:00');

// Update love counter
function updateLoveCounter() {
    const now = new Date();
    const timeDiff = now - loveStartDate;
    
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    
    // Update progress bar
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const progressPercent = (totalDays / 10000) * 100;
    document.getElementById('progressFill').style.width = Math.min(progressPercent, 100) + '%';
}

// Timeline events data
const timelineEvents = [
    {
        id: 1,
        date: '2022-03-23',
        title: 'Ngày đầu tiên',
        description: 'Ngày chúng ta chính thức bắt đầu hành trình tình yêu',
        type: 'milestones',
        icon: '💕',
        details: 'Ngày đặc biệt nhất trong cuộc đời chúng ta. Từ một tình bạn đẹp, chúng ta đã quyết định bước vào một mối quan hệ nghiêm túc.'
    },
    {
        id: 2,
        date: '2022-04-14',
        title: 'Hẹn hò đầu tiên',
        description: 'Buổi hẹn hò chính thức đầu tiên của chúng ta',
        type: 'dates',
        icon: '🎭',
        details: 'Chúng ta đã cùng nhau xem phim và ăn tối. Cả hai đều rất hồi hộp nhưng cũng rất hạnh phúc.'
    },
    {
        id: 3,
        date: '2022-06-30',
        title: '100 ngày yêu',
        description: 'Cột mốc 100 ngày đầu tiên',
        type: 'milestones',
        icon: '💯',
        details: '100 ngày đầu tiên đầy ắp những kỷ niệm đẹp. Chúng ta đã học được nhiều điều về nhau.'
    },
    {
        id: 4,
        date: '2022-08-15',
        title: 'Sinh nhật Duyên',
        description: 'Sinh nhật đầu tiên của Duyên khi chúng ta yêu nhau',
        type: 'special',
        icon: '🎂',
        details: 'Bang đã chuẩn bị một bữa tiệc sinh nhật nhỏ thật ấm cúng và bất ngờ cho Duyên.'
    },
    {
        id: 5,
        date: '2022-10-01',
        title: 'Chuyến du lịch Đà Lạt',
        description: 'Chuyến du lịch đầu tiên cùng nhau',
        type: 'trips',
        icon: '✈️',
        details: 'Chuyến đi 3 ngày 2 đêm tuyệt vời tại thành phố sương mù. Rất nhiều kỷ niệm đẹp được tạo ra.'
    },
    {
        id: 6,
        date: '2022-12-10',
        title: 'Sinh nhật Bang',
        description: 'Sinh nhật đầu tiên của Bang trong mối quan hệ',
        type: 'special',
        icon: '🎂',
        details: 'Duyên đã tự tay làm bánh sinh nhật và chuẩn bị món quà handmade đầy ý nghĩa.'
    },
    {
        id: 7,
        date: '2023-03-23',
        title: 'Kỷ niệm 1 năm',
        description: 'Tròn 1 năm yêu nhau',
        type: 'milestones',
        icon: '🏆',
        details: 'Ngày kỷ niệm 1 năm yêu nhau. Chúng ta đã tổ chức một bữa tối lãng mạn tại nhà hàng yêu thích.'
    },
    {
        id: 8,
        date: '2023-05-20',
        title: 'Gặp gia đình',
        description: 'Bang gặp gia đình Duyên lần đầu',
        type: 'milestones',
        icon: '👨‍👩‍👧‍👦',
        details: 'Một cột mốc quan trọng trong mối quan hệ. Gia đình Duyên đã đón nhận Bang rất tốt.'
    },
    {
        id: 9,
        date: '2023-07-15',
        title: 'Chuyến biển Nha Trang',
        description: 'Kỳ nghỉ hè tuyệt vời bên bờ biển',
        type: 'trips',
        icon: '🏖️',
        details: 'Chuyến du lịch biển đầu tiên cùng nhau. Chúng ta đã có những bức ảnh đẹp và kỷ niệm khó quên.'
    },
    {
        id: 10,
        date: '2024-03-23',
        title: 'Kỷ niệm 2 năm',
        description: 'Tròn 2 năm hạnh phúc bên nhau',
        type: 'milestones',
        icon: '💖',
        details: 'Kỷ niệm 2 năm yêu nhau. Chúng ta đã trưởng thành và hiểu nhau hơn rất nhiều.'
    }
];

// Load timeline events
function loadTimelineEvents() {
    const timelineContainer = document.getElementById('timelineEvents');
    timelineContainer.innerHTML = '';
    
    timelineEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    timelineEvents.forEach((event, index) => {
        const eventElement = createTimelineEvent(event, index);
        timelineContainer.appendChild(eventElement);
    });
}

// Create timeline event element
function createTimelineEvent(event, index) {
    const eventDiv = document.createElement('div');
    eventDiv.className = `timeline-event ${event.type}`;
    eventDiv.dataset.type = event.type;
    
    const isLeft = index % 2 === 0;
    eventDiv.classList.add(isLeft ? 'left' : 'right');
    
    const formattedDate = formatDate(event.date);
    
    eventDiv.innerHTML = `
        <div class="event-marker">
            <div class="event-icon">${event.icon}</div>
        </div>
        <div class="event-content">
            <div class="event-date">${formattedDate}</div>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
            <button class="view-details-btn" onclick="showEventDetails(${event.id})">
                <i class="fas fa-eye"></i> Xem chi tiết
            </button>
        </div>
    `;
    
    return eventDiv;
}

// Filter timeline events
function filterTimelineEvents(filter) {
    const events = document.querySelectorAll('.timeline-event');
    
    events.forEach(event => {
        if (filter === 'all' || event.dataset.type === filter) {
            event.style.display = 'flex';
            event.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            event.style.display = 'none';
        }
    });
}

// Show event details in modal
function showEventDetails(eventId) {
    const event = timelineEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('timelineModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.innerHTML = `${event.icon} ${event.title}`;
    modalBody.innerHTML = `
        <div class="event-detail">
            <div class="detail-date">
                <i class="fas fa-calendar"></i> ${formatDate(event.date)}
            </div>
            <div class="detail-description">
                <p>${event.details}</p>
            </div>
            <div class="detail-type">
                <span class="type-badge ${event.type}">${getTypeLabel(event.type)}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Milestones data
const milestones = [
    {
        title: '1000 ngày yêu',
        date: '2024-12-18',
        icon: '🏆',
        status: 'upcoming',
        description: 'Cột mốc 1000 ngày yêu nhau - một hành trình đầy ý nghĩa!'
    },
    {
        title: 'Đính hôn',
        date: '2025-03-23',
        icon: '💍',
        status: 'planned',
        description: 'Ngày đính hôn dự kiến - bước tiến quan trọng trong cuộc sống'
    },
    {
        title: 'Tốt nghiệp đại học',
        date: '2024-06-30',
        icon: '🎓',
        status: 'achieved',
        description: 'Cả hai đã tốt nghiệp đại học thành công'
    },
    {
        title: 'Có công việc ổn định',
        date: '2024-08-01',
        icon: '💼',
        status: 'achieved',
        description: 'Đã có công việc ổn định để chuẩn bị cho tương lai'
    }
];

// Load milestones
function loadMilestones() {
    const milestonesContainer = document.getElementById('milestonesGrid');
    milestonesContainer.innerHTML = '';
    
    milestones.forEach(milestone => {
        const milestoneElement = createMilestoneElement(milestone);
        milestonesContainer.appendChild(milestoneElement);
    });
}

// Create milestone element
function createMilestoneElement(milestone) {
    const milestoneDiv = document.createElement('div');
    milestoneDiv.className = `milestone-card ${milestone.status}`;
    
    const isUpcoming = milestone.status === 'upcoming';
    const daysLeft = isUpcoming ? calculateDaysLeft(milestone.date) : '';
    
    milestoneDiv.innerHTML = `
        <div class="milestone-icon">${milestone.icon}</div>
        <h3 class="milestone-title">${milestone.title}</h3>
        <div class="milestone-date">${formatDate(milestone.date)}</div>
        <p class="milestone-description">${milestone.description}</p>
        ${isUpcoming ? `<div class="milestone-countdown">${daysLeft} ngày nữa</div>` : ''}
        <div class="milestone-status ${milestone.status}">
            ${getStatusLabel(milestone.status)}
        </div>
    `;
    
    return milestoneDiv;
}

// Update countdowns for future events
function updateCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown-to-event');
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.dataset.target);
        const now = new Date();
        const timeDiff = targetDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            element.innerHTML = `<span class="countdown-days">${days}</span> ngày nữa`;
        } else {
            element.innerHTML = '<span class="countdown-passed">Đã qua</span>';
        }
    });
}

// Update statistics
function updateStats() {
    // Simulate statistics based on timeline events
    document.getElementById('totalPhotos').textContent = timelineEvents.length * 15;
    document.getElementById('placesVisited').textContent = timelineEvents.filter(e => e.type === 'trips').length;
    document.getElementById('celebrations').textContent = timelineEvents.filter(e => e.type === 'special').length;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateDaysLeft(dateString) {
    const targetDate = new Date(dateString);
    const now = new Date();
    const timeDiff = targetDate - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function getTypeLabel(type) {
    const labels = {
        'milestones': 'Cột mốc',
        'dates': 'Hẹn hò',
        'trips': 'Du lịch',
        'special': 'Đặc biệt'
    };
    return labels[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        'achieved': 'Đã đạt được',
        'upcoming': 'Sắp tới',
        'planned': 'Kế hoạch'
    };
    return labels[status] || status;
}

// Modal functionality
const modal = document.getElementById('timelineModal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    .timeline-event {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }

    .timeline-event:nth-child(even) {
        animation-delay: 0.1s;
    }

    .timeline-event:nth-child(odd) {
        animation-delay: 0.2s;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .milestone-card {
        opacity: 0;
        transform: scale(0.9);
        animation: scaleIn 0.5s ease forwards;
    }

    .milestone-card:nth-child(1) { animation-delay: 0.1s; }
    .milestone-card:nth-child(2) { animation-delay: 0.2s; }
    .milestone-card:nth-child(3) { animation-delay: 0.3s; }
    .milestone-card:nth-child(4) { animation-delay: 0.4s; }

    @keyframes scaleIn {
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
