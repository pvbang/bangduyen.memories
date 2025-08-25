# Hệ thống Gallery Tự động - Bằng & Duyên Memories

## 🎯 Tổng quan

Hệ thống Gallery đã được nâng cấp để **tự động quét và hiển thị** tất cả ảnh và video trong folder `data/images/` và `data/videos/` mà không cần phải liệt kê thủ công trong code JavaScript.

## 🚀 Cách hoạt động

### Trước đây (Cũ)
- Phải liệt kê tên từng file ảnh trong file `gallery.js`
- Mỗi khi thêm ảnh mới phải cập nhật code
- Dễ quên và khó maintain

### Bây giờ (Mới)
- ✅ **Tự động quét** folder `data/images/` và `data/videos/`
- ✅ **Tự động hiển thị** tất cả file ảnh/video có trong folder
- ✅ **Không cần cập nhật code** khi thêm file mới
- ✅ **Sắp xếp theo thời gian** (file mới nhất hiển thị trước)
- ✅ **Hỗ trợ nhiều định dạng**: JPG, PNG, GIF, WEBP, MP4, WEBM, v.v.

## 📁 Cấu trúc thư mục

```
bangduyen.memories/
├── data/
│   ├── images/          ← Chỉ cần thêm ảnh vào đây
│   │   ├── photo1.jpg
│   │   ├── photo2.png
│   │   ├── cute-pic.gif
│   │   └── ...
│   └── videos/          ← Chỉ cần thêm video vào đây
│       ├── video1.mp4
│       ├── memory.webm
│       └── ...
├── api/
│   ├── get-media-files.php    ← API PHP (chính)
│   ├── media-server.js        ← API Node.js (backup)
│   └── test-api.html          ← Trang test API
├── gallery.html
├── gallery.js
└── gallery.css
```

## 🔧 Setup và Cài đặt

### Phương pháp 1: PHP API (Khuyến nghị)

**Yêu cầu**: Server web hỗ trợ PHP (Apache, Nginx, v.v.)

1. Upload tất cả file lên server
2. Đảm bảo folder `api/` có quyền thực thi PHP
3. Mở `gallery.html` - hệ thống sẽ tự động hoạt động!

**Test**: Mở `api/test-api.html` để kiểm tra API

### Phương pháp 2: Node.js API (Backup)

**Yêu cầu**: Server hỗ trợ Node.js

1. Cài đặt Node.js
2. Chạy server:
   ```bash
   cd api
   node media-server.js
   ```
3. Sửa đường dẫn API trong `gallery.js` (dòng ~115):
   ```javascript
   // Thay đổi từ:
   const response = await fetch("api/get-media-files.php");
   
   // Thành:
   const response = await fetch("http://localhost:3000/api/get-media-files");
   ```

### Phương pháp 3: Directory Listing (Tự động)

Nếu server web cho phép directory listing, hệ thống sẽ tự động fallback sang phương pháp này.

## 🎮 Cách sử dụng

### Thêm ảnh/video mới:

1. **Thêm file vào folder tương ứng**:
   - Ảnh → `data/images/`
   - Video → `data/videos/`

2. **Refresh trang `gallery.html`**
   - File mới sẽ **tự động hiển thị**
   - Không cần sửa code!

### Định dạng file hỗ trợ:

**Ảnh**: JPG, JPEG, PNG, GIF, WEBP, BMP, SVG  
**Video**: MP4, WEBM, OGG, MOV, AVI, MKV

## 🛠️ Kiểm tra và Debug

### Test API:
```
Mở: api/test-api.html
```

Trang này sẽ:
- ✅ Test PHP API
- ✅ Test Node.js API  
- ✅ Test Directory Listing
- 📊 Hiển thị số lượng file tìm thấy
- 🐛 Hiển thị lỗi nếu có

### Kiểm tra Console:
Mở Developer Tools (F12) → Console để xem log:
```
Đang tải danh sách ảnh từ API...
Tìm thấy 150 ảnh từ API
Đã tải 150 ảnh
Đang tải danh sách video từ API...
Tìm thấy 5 video từ API
Đã tải 5 video
```

## 🔍 Troubleshooting

### Lỗi "API không hoạt động":
1. Kiểm tra server có hỗ trợ PHP không
2. Kiểm tra quyền truy cập folder `api/`
3. Thử phương pháp Node.js hoặc Directory Listing

### Không hiển thị ảnh mới:
1. Kiểm tra file có đúng định dạng không
2. Kiểm tra quyền đọc folder
3. Refresh trang (Ctrl+F5)
4. Kiểm tra Console có lỗi không

### API trả về 0 file:
1. Kiểm tra folder `data/images/` và `data/videos/` có tồn tại không
2. Kiểm tra có file ảnh/video trong folder không
3. Kiểm tra quyền đọc folder

## 📈 Lợi ích

### Cho Developer:
- ✅ Không cần maintain danh sách file
- ✅ Code sạch hơn, ít lỗi hơn
- ✅ Tự động hóa hoàn toàn

### Cho User:
- ✅ Thêm ảnh/video dễ dàng (chỉ cần upload file)
- ✅ Không cần kiến thức lập trình
- ✅ File mới tự động hiển thị ngay

### Cho Website:
- ✅ Luôn cập nhật với nội dung mới nhất
- ✅ Hiệu suất tốt (cache, lazy loading)
- ✅ Responsive, mobile-friendly

## 🎨 Tính năng Gallery

- 🖼️ **Grid động**: 6 chế độ xem khác nhau
- 🎯 **Filter**: Lọc theo ảnh/video
- 🔍 **Lightbox**: Xem ảnh full-size với navigation
- 📱 **Responsive**: Hoạt động mượt trên mọi thiết bị
- ⌨️ **Keyboard shortcuts**: Phím tắt tiện lợi
- 🎭 **Animations**: Hiệu ứng mượt mà, đẹp mắt

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra `api/test-api.html`
2. Xem Console log (F12)
3. Kiểm tra cấu trúc folder
4. Thử các phương pháp setup khác nhau

---

**Made with ❤️ by aiu Bang for eiu Duyen**
