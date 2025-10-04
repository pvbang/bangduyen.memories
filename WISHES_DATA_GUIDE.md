# 🌙 Hướng Dẫn Quản Lý Dữ Liệu Thả Đèn Ước Nguyện

## 📝 Tổng Quan
Tính năng "Thả Đèn Ước Nguyện" trong trang Trung Thu đã được nâng cấp với khả năng lưu trữ và quản lý dữ liệu cục bộ, phù hợp cho việc deploy lên GitHub Pages.

## 🔧 Các Tính Năng Mới

### 1. **Lưu Trữ Cục Bộ (LocalStorage)**
- Tất cả điều ước được lưu tự động vào LocalStorage của trình duyệt
- Dữ liệu được giữ lại khi refresh trang hoặc đóng mở trình duyệt
- Không cần server, hoạt động hoàn toàn trên client-side

### 2. **Xem Danh Sách Điều Ước** 📋
- Nút "Xem Điều Ước" hiển thị modal với tất cả điều ước đã thả
- Hiển thị theo thứ tự từ mới nhất đến cũ nhất
- Mỗi điều ước có thông tin: số thứ tự, nội dung, thời gian tạo
- Có thể xóa từng điều ước riêng lẻ

### 3. **Tải Xuống Dữ Liệu** 💾
- Nút "Tải Xuống" export toàn bộ dữ liệu ra file JSON
- File chứa metadata và tất cả điều ước với timestamp
- Tên file có format: `trung-thu-wishes-YYYY-MM-DD.json`

### 4. **Tải Lên Dữ Liệu** 📁
- Nút "Tải Lên" cho phép import dữ liệu từ file JSON
- Dữ liệu import sẽ được thêm vào dữ liệu hiện có (không ghi đè)
- Tự động validate format file

### 5. **Xóa Tất Cả** 🗑️
- Nút "Xóa Tất Cả" để reset hoàn toàn dữ liệu
- Có xác nhận trước khi xóa để tránh nhầm lẫn

## 📊 Cấu Trúc Dữ Liệu

### LocalStorage Key
```
trungThuWishes
```

### Format Dữ Liệu
```json
[
  {
    "id": 1736123456789,
    "content": "Điều ước của em...",
    "timestamp": "2025-01-06T14:30:45.789Z",
    "date": "6 tháng 1, 2025 lúc 21:30"
  }
]
```

### Export File Format
```json
{
  "exportDate": "2025-01-06T14:30:45.789Z",
  "totalWishes": 5,
  "wishes": [
    // Array of wish objects
  ]
}
```

## 🚀 Ưu Điểm Cho GitHub Pages

### ✅ **Hoạt động hoàn toàn trên client-side**
- Không cần server hoặc database
- Tương thích 100% với GitHub Pages (static hosting)
- Không cần cấu hình gì thêm

### ✅ **Dữ liệu bền vững**
- Lưu trữ cục bộ trên từng thiết bị/trình duyệt
- User có thể backup/restore bằng export/import
- Không mất dữ liệu khi deploy lại website

### ✅ **Portable**
- User có thể chuyển dữ liệu giữa các thiết bị
- Có thể backup để tránh mất dữ liệu
- Chia sẻ điều ước với người khác qua file JSON

## 🛠️ Hướng Dẫn Sử Dụng

### Cho User:
1. **Thả điều ước**: Viết và nhấn "Thả Đèn 🏮"
2. **Xem điều ước**: Nhấn nút "📋 Xem Điều Ước"
3. **Backup**: Nhấn "💾 Tải Xuống" để lưu file JSON
4. **Khôi phục**: Nhấn "📁 Tải Lên" và chọn file JSON đã backup
5. **Reset**: Nhấn "🗑️ Xóa Tất Cả" để xóa hết dữ liệu

### Cho Developer:
- Code tự động load dữ liệu khi khởi tạo trang
- Validate và handle errors cho import/export
- Responsive design cho mobile
- UX/UI thân thiện và trực quan

## 🔒 Bảo Mật & Riêng Tư

- Dữ liệu chỉ lưu trên thiết bị của user
- Không gửi dữ liệu lên server nào
- User hoàn toàn kiểm soát dữ liệu của mình
- Có thể xóa dữ liệu bất cứ lúc nào

## 🎨 Giao Diện Người Dùng

- **Modal đẹp mắt** với theme Trung Thu
- **Responsive design** cho mobile và desktop  
- **Smooth animations** và transitions
- **User-friendly messages** bằng tiếng Việt
- **Intuitive controls** dễ sử dụng

## 📱 Tương Thích

- ✅ Chrome, Firefox, Safari, Edge (modern browsers)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Desktop và mobile responsive
- ✅ LocalStorage support required

---

*Tính năng này đảm bảo trải nghiệm người dùng tốt nhất khi deploy trên GitHub Pages, đồng thời cho phép lưu trữ và quản lý dữ liệu một cách hiệu quả mà không cần backend server.*