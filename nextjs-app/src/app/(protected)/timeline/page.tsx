'use client';

/**
 * Timeline Page - Đếm ngày yêu
 * Hiển thị bộ đếm thời gian, ngày đặc biệt, dòng thời gian, cột mốc
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './timeline.module.css';

// ==========================================
// CONSTANTS & DATA
// ==========================================

/** Ngày quan trọng */
const IMPORTANT_DATES = {
  bangBirthday: new Date('2002-10-28'),
  duyenBirthday: new Date('2003-10-08'),
  firstMeet: new Date('2025-02-08'),
  firstMessage: new Date('2025-02-09'),
  changeMessColor: new Date('2025-02-28'),
  firstDate1: new Date('2025-03-06'),
  firstDate2: new Date('2025-03-12'),
  firstDate3: new Date('2025-03-15'),
  firstDate4: new Date('2025-03-22'),
  officialCouple: new Date('2025-03-23T19:30:00'),
  makeUpDay: new Date('2025-04-24'),
  days200: new Date('2025-10-09'),
  days300: new Date('2026-01-17'),
  valentine: new Date('2026-02-14'),
  march8: new Date('2026-03-08'),
  oneYear: new Date('2026-03-23'),
} as const;

const LOVE_START_DATE = new Date('2025-03-23');

/** Dữ liệu timeline events */
interface TimelineEventData {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: string;
  story: string;
  special?: boolean;
}

const TIMELINE_EVENTS: TimelineEventData[] = [
  {
    id: 1, date: '2025-02-08', title: 'Lần Đầu Gặp Nhau 👫',
    description: 'Ngày định mệnh - chúng mình gặp nhau lần đầu tiên tại văn phòng',
    icon: '👫',
    story: 'Một cuộc gặp gỡ định mệnh đã thay đổi cuộc đời cả hai. Em là con bé chiều hôm qua mới qua văn phòng chào mọi người. Ai ngờ đó lại là khởi đầu cho một câu chuyện tình yêu đẹp như cổ tích...',
  },
  {
    id: 2, date: '2025-02-09', title: 'Tin Nhắn Đầu Tiên 💬',
    description: '"Anh ơi, e là con bé chiều hôm qua mới qua văn phòng chào mn á. E hỏi anh cái này xíu"',
    icon: '💬',
    story: 'Tin nhắn đầu tiên của em đã mở ra cánh cửa cho tình yêu của chúng mình. Một câu hỏi đơn giản nhưng đã kết nối hai trái tim, bắt đầu những cuộc trò chuyện không bao giờ muốn kết thúc.',
  },
  {
    id: 3, date: '2025-02-28', title: 'Đổi Màu Mess 🎨',
    description: 'Ngày anh đổi màu tin nhắn - dấu hiệu đầu tiên của tình cảm đặc biệt',
    icon: '🎨',
    story: 'Một cử chỉ nhỏ nhưng có ý nghĩa lớn. Cả hai đều cảm nhận được sự khác biệt trong mối quan hệ. Anh nghiêm túc.',
  },
  {
    id: 4, date: '2025-03-06', title: 'First Date #1 💝',
    description: 'Cuộc hẹn hò đầu tiên của chúng ta',
    icon: '💝',
    story: 'Buổi hẹn đầu tiên đầy ắp những cảm xúc mới mẻ và hồi hộp. Anh dắt e đi ăn món Hàn Quắc dở ẹc :))). Xong dắt e đi bắn cung,...',
  },
  {
    id: 5, date: '2025-03-12', title: 'Date #2 💕',
    description: 'Cuộc hẹn thứ hai ngày càng gần nhau hơn',
    icon: '💕',
    story: 'Chúng ta ngày càng hiểu nhau hơn qua những cuộc trò chuyện sâu sắc. Tình cảm bắt đầu nảy nở.',
  },
  {
    id: 6, date: '2025-03-15', title: 'Date #3 💖',
    description: 'Cuộc hẹn thứ ba với nhiều cảm xúc',
    icon: '💖',
    story: 'Tình cảm giữa hai ta ngày càng sâu đậm và rõ ràng hơn. Cả hai đều cảm nhận được điều gì đó đặc biệt.',
  },
  {
    id: 7, date: '2025-03-22', title: 'Date #4 🌹',
    description: 'Cuộc hẹn cuối cùng trước khi trở thành người yêu',
    icon: '🌹',
    story: 'Buổi hẹn cuối cùng trước khi anh chính thức tỏ tình với em.',
  },
  {
    id: 8, date: '2025-03-23', title: 'Chính Thức Thành Người Yêu ❤️',
    description: 'Ngày thiêng liêng nhất - anh tỏ tình và em đồng ý',
    icon: '❤️',
    story: '"Em đồng ý làm người yêu anh nha" - Câu trả lời làm anh hạnh phúc nhất đời. Từ đây, chúng ta chính thức bắt đầu hành trình tình yêu.',
    special: true,
  },
  {
    id: 9, date: '2025-04-24', title: 'Ngày Chuộc Lỗi Đặc Biệt 🤭',
    description: 'Ngày anh thêm vào lịch để chuộc lỗi vì nhầm',
    icon: '🤭',
    story: '"Bị cáo đề nghị thêm một ngày 24 vào lịch là ngày chuộc lỗi nữa :)))" Một ngày đặc biệt chỉ có của riêng chúng mình.',
  },
  {
    id: 10, date: '2025-07-01', title: '100 Ngày Yêu Nhau 👑',
    description: 'Cột mốc 100 ngày chính thức yêu nhau',
    icon: '👑',
    story: 'Tròn trăm ngày chung lối! Anh đã tốt nghiệp xuất sắc khóa chiều chuộng công chúa. 100 ngày tập sự làm người yêu, anh đạt loại giỏi chưa nhỉ?',
  },
  {
    id: 11, date: '2025-10-08', title: 'Sinh Nhật Công Chúa 🎂',
    description: 'Sinh nhật đầu tiên của em khi có anh bên cạnh',
    icon: '🎂',
    story: 'Ngày đặc biệt nhất của công chúa! Sinh nhật đầu tiên bên nhau, chúc em luôn xinh đẹp, hạnh phúc và được yêu thương!',
  },
  {
    id: 12, date: '2025-10-09', title: '200 Ngày Bên Nhau 📸',
    description: '200 ngày album ảnh đầy ắp nụ cười',
    icon: '📸',
    story: '200 ngày trôi qua nhanh như chớp mắt. Album ảnh đầy ắp nụ cười. Đi đâu cũng được, ăn gì cũng ngon, miễn là có em đi cùng!',
  },
  {
    id: 13, date: '2025-10-28', title: 'Sinh Nhật Anh 🎉',
    description: 'Sinh nhật đầu tiên của anh khi có em',
    icon: '🎉',
    story: 'Sinh nhật có ý nghĩa nhất từ trước đến giờ vì có công chúa iuuu ở bên!',
  },
  {
    id: 14, date: '2026-01-17', title: '300 Ngày Yêu Thương 💎',
    description: '300 ngày tình yêu không có điểm dừng',
    icon: '💎',
    story: '300 ngày - con số tròn trĩnh, nhưng tình yêu anh dành cho em thì không có điểm dừng, nó cứ lớn lớn lớn mãi thôi!',
    special: true,
  },
  {
    id: 15, date: '2026-02-14', title: 'Valentine Đầu Tiên 🌹',
    description: 'Ngày lễ tình nhân đầu tiên bên nhau',
    icon: '🌹',
    story: 'Valentine đầu tiên chính thức bên nhau! Ngày lễ tình nhân thêm ý nghĩa khi có người mình yêu thương ở bên cạnh.',
  },
  {
    id: 16, date: '2026-03-08', title: '8/3 Ngày Của Em 💐',
    description: 'Ngày Quốc tế Phụ nữ - Ngày của công chúa',
    icon: '💐',
    story: 'Ngày 8/3 đầu tiên bên nhau! Chúc công chúa iuuu luôn xinh đẹp, hạnh phúc. Cảm ơn em vì đã là người phụ nữ tuyệt vời nhất bên anh!',
  },
  {
    id: 17, date: '2026-03-23', title: '1 NĂM YÊU NHAU! 🏆',
    description: '365 ngày - Tròn 1 năm chính thức yêu nhau!',
    icon: '🏆',
    story: '1 năm tròn! 365 ngày yêu nhau! Cảm ơn em vì tất cả. Đây mới chỉ là chương đầu tiên, còn nhiều chương đẹp hơn phía trước!',
    special: true,
  },
];

/** Milestone data */
interface MilestoneData {
  icon: string;
  title: string;
  days?: number;
  date?: string;
  type: 'achieved' | 'upcoming' | 'dream';
  status?: string;
}

const MILESTONES: MilestoneData[] = [
  { icon: '❤️', title: 'Chính Thức Yêu Nhau', date: '23/03/2025', type: 'achieved', status: '✓ Đã đạt được' },
  { icon: '🎉', title: '30 Ngày Yêu', days: 30, type: 'upcoming' },
  { icon: '🎊', title: '50 Ngày Yêu', days: 50, type: 'upcoming' },
  { icon: '🏆', title: '100 Ngày Yêu', days: 100, type: 'upcoming' },
  { icon: '💎', title: '200 Ngày Yêu', days: 200, type: 'upcoming' },
  { icon: '🎯', title: '365 Ngày Yêu', days: 365, type: 'upcoming' },
  { icon: '🏆', title: '1 Năm Yêu Nhau', date: '23/03/2026', type: 'achieved', status: '✓ Happy Anniversary! 🎉' },
  { icon: '🎂', title: '500 Ngày Yêu', days: 500, type: 'upcoming' },
  { icon: '🌟', title: '1000 Ngày Yêu', days: 1000, type: 'upcoming' },
  { icon: '💍', title: 'Đính Hôn', date: 'Trong tương lai', type: 'dream', status: 'Heheh iuuu emmm - Nhanh thoi' },
  { icon: '👰‍♀️', title: 'Đám Cưới', date: 'Trong tương lai', type: 'dream', status: 'Mơ ước của cả hai' },
  { icon: '👶', title: 'Baby Đầu Lòng', date: 'Trong tương lai', type: 'dream', status: 'Gia đình nhỏ hạnh phúc' },
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/** Tính chính xác năm, tháng, ngày */
function calcYMD(startDate: Date, endDate: Date) {
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

/** Format ngày tiếng Việt */
function formatDateVN(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Ký ức';
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('vi-VN', options);
}

/** Tính số ngày giữa 2 mốc */
function daysBetween(date1: Date, date2: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

/** Background Animation cho Timeline */
function TimelineBackground() {
  return (
    <div className={styles.backgroundAnimation}>
      <div className={styles.floatingHearts}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={`heart-${i}`} className={styles.heart} />
        ))}
      </div>
      <div className={styles.floatingStars}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={`star-${i}`} className={styles.star} />
        ))}
      </div>
    </div>
  );
}

/** Love Counter Component */
function LoveCounter({ now }: { now: Date }) {
  const ymd = calcYMD(LOVE_START_DATE, now);
  const totalDaysOverall = Math.max(0, daysBetween(LOVE_START_DATE, now));

  const timeDiff = now.getTime() - IMPORTANT_DATES.officialCouple.getTime();
  const totalSec = Math.floor(timeDiff / 1000);
  const hours = Math.floor(totalSec / 3600) % 24;
  const minutes = Math.floor(totalSec / 60) % 60;
  const seconds = totalSec % 60;

  const progressPercent = Math.min((totalDaysOverall / 1000) * 100, 100);

  return (
    <section className={styles.loveCounterSection}>
      <div className={styles.loveCounterCard}>
        <div className={styles.counterHeader}>
          <h2>❤️ Chúng Mình Đã Yêu Nhau Được</h2>
          <p className={styles.counterSubtitle}>
            Kể từ ngày 23/03/2025 - Ngày chính thức thành người yêu
          </p>
        </div>

        {/* Total days highlight */}
        <div className={styles.counterDisplay}>
          <div className={`${styles.counterItem} ${styles.totalDaysCounter}`}>
            <span className={styles.counterNumber}>{totalDaysOverall}</span>
            <span className={styles.counterLabel}>Tổng Ngày Iuuuu 🥰</span>
          </div>
        </div>

        {/* Detailed counter */}
        <div className={styles.counterDisplay}>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{ymd.years}</span>
            <span className={styles.counterLabel}>Năm</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{ymd.months}</span>
            <span className={styles.counterLabel}>Tháng</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{ymd.days}</span>
            <span className={styles.counterLabel}>Ngày</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{hours}</span>
            <span className={styles.counterLabel}>Giờ</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{minutes}</span>
            <span className={styles.counterLabel}>Phút</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.counterNumber}>{seconds}</span>
            <span className={styles.counterLabel}>Giây</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className={styles.progressText}>
            Hành trình tới 1000 ngày yêu nhau ❤️ (Hiện tại: {totalDaysOverall} ngày)
          </p>
        </div>
      </div>
    </section>
  );
}

/** Important Dates Section */
function ImportantDates({ now }: { now: Date }) {
  const currentYear = now.getFullYear();

  // Tính tuổi
  const bangBirthdayThisYear = new Date(currentYear, IMPORTANT_DATES.bangBirthday.getMonth(), IMPORTANT_DATES.bangBirthday.getDate());
  let bangAge = currentYear - IMPORTANT_DATES.bangBirthday.getFullYear();
  if (now < bangBirthdayThisYear) bangAge--;

  const duyenBirthdayThisYear = new Date(currentYear, IMPORTANT_DATES.duyenBirthday.getMonth(), IMPORTANT_DATES.duyenBirthday.getDate());
  let duyenAge = currentYear - IMPORTANT_DATES.duyenBirthday.getFullYear();
  if (now < duyenBirthdayThisYear) duyenAge--;

  // Tính ngày sinh nhật tiếp theo
  const nextBangBirthday = now < bangBirthdayThisYear
    ? bangBirthdayThisYear
    : new Date(currentYear + 1, IMPORTANT_DATES.bangBirthday.getMonth(), IMPORTANT_DATES.bangBirthday.getDate());
  const nextDuyenBirthday = now < duyenBirthdayThisYear
    ? duyenBirthdayThisYear
    : new Date(currentYear + 1, IMPORTANT_DATES.duyenBirthday.getMonth(), IMPORTANT_DATES.duyenBirthday.getDate());

  const daysToBangBirthday = Math.ceil((nextBangBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysToDuyenBirthday = Math.ceil((nextDuyenBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Tính số ngày từ các sự kiện
  const daysSinceFirstMeet = Math.max(0, daysBetween(IMPORTANT_DATES.firstMeet, now));
  const daysSinceFirstMessage = Math.max(0, daysBetween(IMPORTANT_DATES.firstMessage, now));
  const daysSinceColorChange = Math.max(0, daysBetween(IMPORTANT_DATES.changeMessColor, now));
  const daysSince200Days = Math.max(0, daysBetween(IMPORTANT_DATES.days200, now));
  const daysSince300Days = Math.max(0, daysBetween(IMPORTANT_DATES.days300, now));
  const daysSinceValentine = Math.max(0, daysBetween(IMPORTANT_DATES.valentine, now));
  const daysSinceMarch8 = Math.max(0, daysBetween(IMPORTANT_DATES.march8, now));

  return (
    <section className={styles.importantDates}>
      <h2>📅 Những Ngày Đặc Biệt</h2>
      <div className={styles.datesGrid}>
        {/* Sinh nhật Anh */}
        <div className={`${styles.dateCard} ${styles.birthdayBang}`}>
          <div className={styles.dateIcon}>🎂</div>
          <h3>Sinh Nhật Anh</h3>
          <p className={styles.dateInfo}>28/10/2002</p>
          <p className={styles.dateInfoLunar}>(23/09/2002 âm lịch)</p>
          <div className={styles.ageCounter}>{bangAge} tuổi</div>
          <div className={styles.nextBirthday}>
            Sinh nhật tiếp theo: {daysToBangBirthday} ngày
          </div>
        </div>

        {/* Sinh nhật Em */}
        <div className={`${styles.dateCard} ${styles.birthdayDuyen}`}>
          <div className={styles.dateIcon}>🎂</div>
          <h3>Sinh Nhật Em</h3>
          <p className={styles.dateInfo}>08/10/2003</p>
          <div className={styles.ageCounter}>{duyenAge} tuổi</div>
          <div className={styles.nextBirthday}>
            Sinh nhật tiếp theo: {daysToDuyenBirthday} ngày
          </div>
        </div>

        {/* Lần đầu gặp nhau */}
        <div className={`${styles.dateCard} ${styles.firstMeet}`}>
          <div className={styles.dateIcon}>🥰</div>
          <h3>Lần Đầu Gặp Nhau</h3>
          <p className={styles.dateInfo}>08/02/2025</p>
          <div className={styles.daysCounter}>Đã {daysSinceFirstMeet} ngày</div>
        </div>

        {/* Tin nhắn đầu tiên */}
        <div className={`${styles.dateCard} ${styles.firstMessage}`}>
          <div className={styles.dateIcon}>✏️</div>
          <h3>Tin Nhắn Đầu Tiên</h3>
          <p className={styles.dateInfo}>09/02/2025</p>
          <div className={styles.daysCounter}>Đã {daysSinceFirstMessage} ngày</div>
        </div>

        {/* Đổi màu mess */}
        <div className={`${styles.dateCard} ${styles.colorChange}`}>
          <div className={styles.dateIcon}>🎨</div>
          <h3>Đổi Màu Mess</h3>
          <p className={styles.dateInfo}>28/02/2025</p>
          <div className={styles.daysCounter}>Đã {daysSinceColorChange} ngày</div>
        </div>

        {/* Chính thức yêu nhau */}
        <div className={`${styles.dateCard} ${styles.officialLove}`}>
          <div className={styles.dateIcon}>❤️</div>
          <h3>Chính Thức Yêu Nhau</h3>
          <p className={styles.dateInfo}>23/03/2025 - 19h30</p>
          <div className={styles.daysCounter}>Aiuuu đếm phía trên gòi nè kk :)))</div>
        </div>

        {/* 100 ngày */}
        <div className={`${styles.dateCard} ${styles.officialLove}`}>
          <div className={styles.dateIcon}>❤️</div>
          <h3>100 Ngày Yêu Nhau</h3>
          <p className={styles.dateInfo}>01/07/2025</p>
          <div className={styles.daysCounter}>
            Đã {Math.max(0, daysBetween(new Date('2025-07-01'), now))} ngày
          </div>
        </div>

        {/* 200 ngày */}
        <div className={styles.dateCard} style={{ borderLeft: '4px solid #FF91A4' }}>
          <div className={styles.dateIcon}>📸</div>
          <h3>200 Ngày Bên Nhau</h3>
          <p className={styles.dateInfo}>09/10/2025</p>
          <div className={styles.daysCounter}>Đã {daysSince200Days} ngày</div>
        </div>

        {/* 300 ngày */}
        <div className={styles.dateCard} style={{ borderLeft: '4px solid #FF69B4' }}>
          <div className={styles.dateIcon}>💎</div>
          <h3>300 Ngày Yêu Thương</h3>
          <p className={styles.dateInfo}>17/01/2026</p>
          <div className={styles.daysCounter}>Đã {daysSince300Days} ngày</div>
        </div>

        {/* Valentine */}
        <div className={styles.dateCard} style={{ borderLeft: '4px solid #FF1493' }}>
          <div className={styles.dateIcon}>💕</div>
          <h3>Valentine Đầu Tiên</h3>
          <p className={styles.dateInfo}>14/02/2026</p>
          <div className={styles.daysCounter}>Đã {daysSinceValentine} ngày</div>
        </div>

        {/* 8/3 */}
        <div className={styles.dateCard} style={{ borderLeft: '4px solid #a29bfe' }}>
          <div className={styles.dateIcon}>💐</div>
          <h3>8/3 Ngày Của Em</h3>
          <p className={styles.dateInfo}>08/03/2026</p>
          <div className={styles.daysCounter}>Đã {daysSinceMarch8} ngày</div>
        </div>

        {/* 1 năm */}
        <div className={styles.dateCard} style={{ borderLeft: '4px solid #FFD700' }}>
          <div className={styles.dateIcon}>🏆</div>
          <h3>1 Năm Yêu Nhau!</h3>
          <p className={styles.dateInfo}>23/03/2026</p>
          <div className={styles.daysCounter}>
            {now >= IMPORTANT_DATES.oneYear
              ? `Đã ${daysBetween(IMPORTANT_DATES.oneYear, now)} ngày`
              : `Còn ${Math.ceil((IMPORTANT_DATES.oneYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} ngày`
            }
          </div>
        </div>
      </div>
    </section>
  );
}

/** Timeline Events Section */
function TimelineEventsSection({
  onEventClick,
}: {
  onEventClick: (event: TimelineEventData) => void;
}) {
  const sortedEvents = [...TIMELINE_EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <section className={styles.timelineSection}>
      <h2>🕐 Dòng Thời Gian Tình Yêu</h2>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineLine} />
        <div className={styles.timelineEvents}>
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className={`${styles.timelineEvent} ${
                index % 2 !== 0 ? styles.timelineEventEven : ''
              } ${event.special ? styles.timelineEventSpecial : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={styles.eventMarker}
                onClick={() => onEventClick(event)}
              >
                {event.icon}
              </div>
              <div
                className={styles.eventContent}
                onClick={() => onEventClick(event)}
              >
                <div className={styles.eventDate}>
                  {formatDateVN(event.date)}
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Milestones Section */
function MilestonesSection({ now }: { now: Date }) {
  return (
    <section className={styles.milestonesSection}>
      <h2>🏆 Những Cột Mốc Quan Trọng</h2>
      <div className={styles.milestonesGrid}>
        {MILESTONES.map((milestone, index) => {
          let milestoneDate: Date | null = null;
          let dateText = milestone.date || '';
          let statusText = milestone.status || '';
          let computedType = milestone.type;

          if (milestone.days) {
            milestoneDate = new Date(
              IMPORTANT_DATES.officialCouple.getTime() +
              milestone.days * 24 * 60 * 60 * 1000
            );
            dateText = formatDateVN(milestoneDate.toISOString());

            if (now >= milestoneDate) {
              statusText = 'Đã qua ✓';
              computedType = 'achieved';
            } else {
              const daysToMilestone = Math.ceil(
                (milestoneDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );
              statusText = `Còn ${daysToMilestone} ngày`;
            }
          }

          const cardClass = computedType === 'achieved'
            ? styles.milestoneAchieved
            : computedType === 'dream'
            ? styles.milestoneDream
            : styles.milestoneUpcoming;

          return (
            <div
              key={`milestone-${index}`}
              className={`${styles.milestoneCard} ${cardClass}`}
            >
              <span className={styles.milestoneIcon}>{milestone.icon}</span>
              <h3>{milestone.title}</h3>
              <p className={styles.milestoneDate}>{dateText}</p>
              {milestone.days ? (
                <div
                  className={styles.milestoneCountdown}
                  style={computedType === 'achieved' ? { color: '#48bb78' } : undefined}
                >
                  {statusText}
                </div>
              ) : (
                <div className={styles.milestoneStatus}>{statusText}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Event Modal */
function EventModal({
  event,
  onClose,
}: {
  event: TimelineEventData | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (event) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      className={styles.modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{event.title}</h3>
          <button className={styles.close} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalDate}>{formatDateVN(event.date)}</div>
          <div className={styles.modalDescription}>{event.description}</div>
          <div className={styles.modalStory}>{event.story}</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function TimelinePage() {
  const [now, setNow] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>(null);

  // Update mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = useCallback((event: TimelineEventData) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <div className={styles.timelinePage}>
      <TimelineBackground />

      {/* Header */}
      <header className={styles.timelineHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1>❤️ Timeline Tình Yêu</h1>
            <p>Hành trình tình yêu của Bằng &amp; Duyên</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.timelineContent}>
        <div className={styles.container}>
          <LoveCounter now={now} />
          <ImportantDates now={now} />
          <TimelineEventsSection onEventClick={handleEventClick} />
          <MilestonesSection now={now} />
        </div>
      </div>

      {/* Modal */}
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </div>
  );
}
