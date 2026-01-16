import os

def batch_rename(folder_path, base_name="image"):
    # 1. Kiểm tra thư mục có tồn tại không
    if not os.path.exists(folder_path):
        print("❌ Thư mục không tồn tại. Vui lòng kiểm tra lại đường dẫn.")
        return

    # 2. Lấy danh sách file và sắp xếp (để đổi tên theo thứ tự hiện có)
    files = os.listdir(folder_path)
    # Lọc chỉ lấy file ảnh (bạn có thể thêm đuôi khác nếu cần)
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
    images = [f for f in files if f.lower().endswith(valid_extensions)]
    
    # Sắp xếp tên file cũ để đảm bảo thứ tự (tùy chọn)
    images.sort()

    count = 0
    print(f"📂 Đang xử lý thư mục: {folder_path}")
    
    for index, filename in enumerate(images):
        # Lấy đuôi mở rộng của file cũ (ví dụ: .jpg)
        extension = os.path.splitext(filename)[1]
        
        # Tạo tên mới: image1.jpg, image2.png...
        new_name = f"{base_name}{index + 1}{extension}"
        
        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_name)

        # Tránh lỗi nếu file mới trùng tên file cũ đã có
        if old_path != new_path:
            try:
                os.rename(old_path, new_path)
                print(f"✅ Đã đổi: {filename} -> {new_name}")
                count += 1
            except Exception as e:
                print(f"⚠️ Lỗi khi đổi tên {filename}: {e}")

    print(f"\n🎉 Hoàn tất! Đã đổi tên {count} file.")

# --- CẤU HÌNH ---
# Thay đường dẫn thư mục ảnh của bạn vào bên dưới (dùng r'' để tránh lỗi ký tự đặc biệt)
folder_path = r'D:\id\media\eiuuu\300days-20260116T185647Z-1-001\300days' 

batch_rename(folder_path)