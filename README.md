# 💕 Bang & Duyen Memories - Website Kỷ Niệm Tình Yêu

Một website tình yêu đầy ý nghĩa dành riêng cho cặp đôi Bang và Nguyễn Thị Mỹ Duyên, lưu giữ những khoảnh khắc đẹp nhất trong hành trình yêu nhau.

## ✨ Tính Năng Chính

### 🔐 **Bảo mật & Đăng nhập**
- Đăng nhập bảo mật với mật khẩu: `23032025`
- Session quản lý thông minh
- Chuyển hướng tự động khi chưa đăng nhập

### � **Quản lý Kỷ niệm**
- ✅ Hiển thị kỷ niệm với nhiều template đẹp (8 styles)
- ✅ Upload và quản lý hình ảnh
- ✅ Phân loại theo danh mục (Đặc biệt, Hàng ngày, Du lịch, Kỷ niệm)
- ✅ Tìm kiếm và lọc kỷ niệm
- ✅ Modal xem chi tiết với hiệu ứng đẹp
- ✅ Load more với phân trang thông minh

### 🎨 **8 Template Card Tuyệt Đẹp**
1. **Classic** - Phong cách cổ điển với border gradient
2. **Modern** - Thiết kế hiện đại với border animation
3. **Romantic** - Lãng mạn với icon trái tim bay
4. **Minimalist** - Tối giản, thanh lịch
5. **Glass** - Glassmorphism với backdrop blur
6. **Neon** - Hiệu ứng neon sáng đẹp
7. **3D** - Hiệu ứng 3D khi hover
8. **Gradient** - Border gradient xoay 360°

### � **Trang Admin CRUD**
- ✅ Thêm/sửa/xóa kỷ niệm
- ✅ Upload hình ảnh (lưu vào `data/images/`)
- ✅ Quản lý danh mục và mood
- ✅ Thống kê tổng quan
- ✅ Giao diện thân thiện, responsive

### 🌟 **Bản Đồ Sao Chuyên Sâu**
- ✅ Vẽ bản đồ sao chi tiết ngày bắt đầu yêu (23/03/2022)
- ✅ Phân tích tương thích cung hoàng đạo
- ✅ Thông tin về các hành tinh và ý nghĩa
- ✅ Timeline 12 cung hoàng đạo
- ✅ Carousel quotes tình yêu tự động
- ✅ Hiệu ứng twinkling stars và animation

### ⏰ **Timeline Tình Yêu** (MỚI!)
- 📅 Dòng thời gian tương tác với các mốc quan trọng
- 💕 Đếm ngày yêu nhau real-time (năm/tháng/ngày/giờ)
- 🏆 Các cột mốc đã đạt được và sắp tới
- 📊 Thống kê kỷ niệm (ảnh, địa điểm, lễ kỷ niệm)
- 🎯 Kế hoạch tương lai (đính hôn, cưới hỏi, tổ ấm)
- 🔄 Lọc sự kiện theo loại (cột mốc, hẹn hò, du lịch, đặc biệt)
- 📱 Modal xem chi tiết từng sự kiện

### ⏳ **Đồng Hồ Tình Yêu** (MỚI!)
- 🎯 Đếm ngày yêu nhau với vòng tròn progress động
- 🎉 Countdown đến các ngày đặc biệt:
  - 💍 Đính hôn (23/03/2025)
  - 🎂 Sinh nhật Duyên (15/08)
  - 🎂 Sinh nhật Bang (10/12)
  - 🏆 Kỷ niệm 3 năm (23/03/2025)
- 🏅 Các cột mốc đã hoàn thành (100, 365, 500, 730 ngày)
- 💫 Cột mốc sắp tới (1000, 1500 ngày)
- 💬 Carousel quotes tình yêu tự động chuyển
- 📊 Progress bar cho từng countdown

## 🚀 Cách sử dụng

### 1. Mở website
- Mở file `index.html` trong trình duyệt
- Hoặc deploy lên hosting và truy cập qua domain

### 2. Đăng nhập
- Nhập mật khẩu: `23032025`
- Click "Khám phá kỷ niệm"

### 3. Xem kỷ niệm
- Browse các card kỷ niệm
- Click vào card để xem chi tiết
- Sử dụng filter để lọc theo danh mục
- Click "Bản đồ sao" để xem tương thích cung hoàng đạo
- Click "Xem thêm kỷ niệm" để load thêm

### 4. Bản đồ sao
- Xem thông tin cung hoàng đạo của cả hai
- Đọc phân tích tương thích chi tiết
- Xem timeline các mốc quan trọng
- Thưởng thức những câu nói yêu thương

### 5. Thêm/Sửa kỷ niệm
- Click nút "Thêm kỷ niệm" hoặc truy cập trực tiếp `admin.html`
- Điền thông tin kỷ niệm
- Chọn hình ảnh (sẽ được lưu vào `data/images/`)
- Chọn template và tâm trạng
- Click "Lưu kỷ niệm"
- Sửa/xóa kỷ niệm trong phần "Quản lý kỷ niệm"

## 📁 Cấu trúc file

```
bangduyen.memories/
├── index.html          # Trang đăng nhập
├── memories.html       # Trang hiển thị kỷ niệm
├── admin.html          # Trang quản trị với CRUD
├── starmap.html        # Trang bản đồ sao và tương thích
├── style.css           # CSS chính với design lãng mạn
├── script.js           # JavaScript cho tất cả chức năng
├── data/
│   ├── memories.json   # File lưu trữ dữ liệu kỷ niệm
│   └── images/         # Thư mục chứa hình ảnh
└── README.md           # File hướng dẫn này
```

## 🎨 Thiết kế

### Màu sắc chủ đạo
- **Hồng chính**: #ff6b9d
- **Hồng nhạt**: #ff8fab
- **Gradient**: #ff9a9e → #fecfef
- **Trắng**: #ffffff với độ trong suốt

### Typography
- **Heading**: Dancing Script (font chữ viết tay lãng mạn)
- **Body**: Poppins (font hiện đại, dễ đọc)

### Animation
- **Floating hearts**: Trái tim bay liên tục
- **Fade in up**: Card xuất hiện từ dưới lên
- **Hover effects**: Scale và shadow khi hover
- **Gradient buttons**: Button với gradient và hiệu ứng

## 🔧 Tùy chỉnh

### Thay đổi mật khẩu
Trong file `script.js`, tìm dòng:
```javascript
const CORRECT_PASSWORD = '23032025';
```
Thay đổi thành mật khẩu mong muốn.

### Thêm template mới
Trong file `style.css`, thêm class mới:
```css
.memory-card.template-your-template {
    /* Your custom styles */
}
```

Trong file `script.js`, thêm vào array:
```javascript
const cardTemplates = ['classic', 'modern', 'romantic', 'minimalist', 'your-template'];
```

### Thay đổi màu sắc
Tìm và thay thế các biến màu trong `style.css`:
- `#ff6b9d` (hồng chính)
- `#ff8fab` (hồng nhạt)
- `#ff9a9e` và `#fecfef` (gradient)

## 💡 Gợi ý nâng cao

### 1. Tích hợp database thật
- Sử dụng Firebase, MongoDB hoặc database khác
- Lưu trữ kỷ niệm và hình ảnh trên cloud

### 2. Authentication nâng cao
- Tích hợp Google/Facebook login
- Session management an toàn hơn

### 3. Upload hình ảnh
- Tích hợp với Cloudinary, AWS S3
- Resize và optimize ảnh tự động

### 4. Chia sẻ
- Tính năng chia sẻ kỷ niệm qua social media
- Tạo link chia sẻ riêng cho từng kỷ niệm

### 5. Thông báo
- Push notification cho kỷ niệm quan trọng
- Email reminder cho các ngày đặc biệt

## 🐛 Troubleshooting

### Kỷ niệm không hiển thị
- Kiểm tra console browser có lỗi JavaScript
- Đảm bảo tất cả file đều trong cùng thư mục

### Hình ảnh không load
- Kiểm tra đường dẫn file ảnh
- Đảm bảo file ảnh có format được hỗ trợ (jpg, png, gif)

### Animation không mượt
- Kiểm tra performance browser
- Có thể giảm số lượng trái tim bay trong CSS

## ❤️ Credits

Website được thiết kế với tình yêu và sự chăm sóc cho cặp đôi Bangduyen. Chúc hai bạn luôn hạnh phúc và yêu thương!

---

*Made with ♥ for Bangduyen*
