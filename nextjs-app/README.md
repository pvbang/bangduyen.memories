# 💕 Bằng & Duyên Memories

Website kỷ niệm tình yêu được xây dựng bằng **Next.js 16** (App Router) — lưu giữ những khoảnh khắc đẹp của Bằng và Duyên.

## ✨ Tính năng

| Trang | Route | Mô tả |
|-------|-------|-------|
| 🔐 Login | `/` | Trang đăng nhập với mật khẩu |
| 💕 Kỷ Niệm | `/memories` | Danh sách các kỷ niệm đẹp |
| 📸 Thư viện ảnh | `/gallery` | Gallery ảnh kỷ niệm |
| ⏱️ Đếm Ngày | `/timeline` | Đếm ngày yêu nhau |
| ⭐ Bản Đồ Sao | `/starmap` | Bản đồ sao đêm hẹn hò |
| 👑 100 Ngày Yêu | `/100days` | Kỷ niệm 100 ngày |
| 💎 300 Ngày Yêu | `/300days` | Kỷ niệm 300 ngày |
| 🏆 1 Năm Yêu | `/1year` | Kỷ niệm 1 năm |
| 🎂 Sinh Nhật | `/birthday` | Trang sinh nhật đặc biệt |
| 💙 Xin Lỗi | `/sorry` | Trang xin lỗi dễ thương |
| 💐 8/3 | `/march8` | Ngày Quốc tế Phụ nữ |
| 🌙 Trung Thu | `/trung-thu` | Tết Trung Thu |
| 🎄 Giáng Sinh | `/giang-sinh` | Giáng sinh an lành |
| ⚙️ Quản lý | `/admin` | Trang admin quản lý nội dung |

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules
- **Runtime:** React 19
- **Deployment:** Vercel

## 📂 Cấu trúc dự án

```
nextjs-app/
├── public/
│   ├── christmas/          # Assets trang Giáng Sinh
│   └── data/
│       ├── audio/          # File audio (birthday, romantic...)
│       ├── gif/            # Ảnh động GIF
│       ├── images/         # Ảnh kỷ niệm (100+ files)
│       ├── music/          # Nhạc nền (7 bài)
│       ├── videos/         # Video kỷ niệm
│       ├── memories.json   # Dữ liệu kỷ niệm
│       └── image-list.json # Danh sách ảnh gallery
├── src/
│   ├── app/
│   │   ├── page.tsx              # Trang Login (/)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── (protected)/          # Route group có auth guard
│   │       ├── layout.tsx        # Protected layout (AuthGuard + Navigation + MusicPlayer)
│   │       ├── memories/         # /memories
│   │       ├── gallery/          # /gallery
│   │       ├── timeline/         # /timeline
│   │       ├── starmap/          # /starmap
│   │       ├── 100days/          # /100days
│   │       ├── 300days/          # /300days
│   │       ├── 1year/            # /1year
│   │       ├── birthday/         # /birthday
│   │       ├── sorry/            # /sorry
│   │       ├── march8/           # /march8
│   │       ├── trung-thu/        # /trung-thu
│   │       ├── giang-sinh/       # /giang-sinh
│   │       └── admin/            # /admin
│   ├── components/
│   │   ├── features/auth/        # AuthGuard component
│   │   └── layout/               # Navigation, MusicPlayer
│   ├── contexts/                 # AuthContext (React Context)
│   ├── hooks/                    # useAuth, useMusicPlayer
│   ├── lib/                      # constants, utils
│   └── types/                    # TypeScript types (auth, memory, music)
├── next.config.ts                # Redirects .html → clean URLs
├── vercel.json                   # Vercel deployment config
├── tsconfig.json
└── package.json
```

## 🚀 Bắt đầu

### Yêu cầu

- **Node.js** >= 18.18
- **npm** >= 9

### Cài đặt & Chạy local

```bash
# Clone repo & vào thư mục nextjs-app
cd nextjs-app

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

### Build production

```bash
npm run build
npm start
```

## 🌐 Deploy lên Vercel

### Cách 1: Deploy tự động qua Git (Khuyến nghị)

1. **Push code lên GitHub/GitLab/Bitbucket**

2. **Truy cập [vercel.com](https://vercel.com)** → Đăng nhập

3. **"Add New Project"** → Import repository

4. **Cấu hình:**
   - **Framework Preset:** Next.js (tự detect)
   - **Root Directory:** `nextjs-app` ← ⚠️ QUAN TRỌNG (nếu repo chứa cả HTML gốc)
   - **Build Command:** `next build` (tự động)
   - **Output Directory:** `.next` (tự động)

5. **Click "Deploy"** → Vercel sẽ tự build & deploy

6. Mỗi lần push code, Vercel tự động deploy lại (CI/CD)

### Cách 2: Deploy bằng Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Trong thư mục nextjs-app/
cd nextjs-app

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Cấu hình Vercel quan trọng

| Config | Giá trị | Ghi chú |
|--------|---------|---------|
| Root Directory | `nextjs-app` | Nếu repo chứa nhiều thư mục |
| Framework | Next.js | Tự detect |
| Node.js Version | 18.x hoặc 20.x | Settings → General |

### Redirects tích hợp

File [`next.config.ts`](next.config.ts) đã cấu hình redirects cho tất cả old HTML URLs:

- `/index.html` → `/`
- `/memories.html` → `/memories`
- `/gallery.html` → `/gallery`
- `/timeline.html` → `/timeline`
- `/starmap.html` → `/starmap`
- `/100days.html` → `/100days`
- `/300days.html` → `/300days`
- `/1year.html` → `/1year`
- `/birthday.html` → `/birthday`
- `/sorry.html` → `/sorry`
- `/march8.html` → `/march8`
- `/trung-thu.html` → `/trung-thu`
- `/admin.html` → `/admin`
- `/cong-chua-iuuu-cua-a/giang_sinh_an_lanh.html` → `/giang-sinh`

## 📊 Build Output

```
Route (app)                    Size
┌ ○ /                          Login page
├ ○ /_not-found                404 page
├ ○ /100days                   100 Ngày Yêu
├ ○ /1year                     1 Năm Yêu
├ ○ /300days                   300 Ngày Yêu
├ ○ /admin                     Quản lý
├ ○ /birthday                  Sinh nhật
├ ○ /gallery                   Thư viện ảnh
├ ○ /giang-sinh                Giáng Sinh
├ ○ /march8                    8/3
├ ○ /memories                  Kỷ niệm
├ ○ /sorry                     Xin lỗi
├ ○ /starmap                   Bản đồ sao
├ ○ /timeline                  Đếm ngày
└ ○ /trung-thu                 Trung Thu

○  (Static)  prerendered as static content
Total: 15 routes + 404 page
```

## 🔑 Xác thực

Website sử dụng client-side authentication qua `localStorage`. Không yêu cầu environment variables hay database.

## 📝 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy dev server (Turbopack) |
| `npm run build` | Build production |
| `npm start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |

---

Made with 💕 by Bằng for Duyên
