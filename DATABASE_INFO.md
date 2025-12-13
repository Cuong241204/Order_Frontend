# 📊 Thông Tin Database

## Khi Backend Chạy, Dữ Liệu Tự Động Được Thêm Vào

Khi bạn chạy backend lần đầu tiên, hệ thống sẽ **tự động tạo các bảng và thêm dữ liệu mặc định** vào SQLite database.

### ✅ Dữ Liệu Tự Động Được Tạo

#### 1. **Bảng `users`** - Tài khoản Admin
- **1 tài khoản admin** được tạo tự động:
  - Email: `admin@foodorder.com`
  - Password: `admin123`
  - Role: `admin`

#### 2. **Bảng `tables`** - Bàn Ăn
- **5 bàn** được tạo tự động:
  - Bàn 1, Bàn 2, Bàn 3, Bàn 4, Bàn 5
  - Mỗi bàn có capacity: 4 người
  - Status: `available`

#### 3. **Bảng `menu_items`** - Món Ăn
- **15 món ăn mặc định** được tạo tự động (nếu bảng trống):
  - Phở Bò Tái
  - Cơm Tấm Sài Gòn
  - Bún Mọc
  - Bún Chả
  - Gỏi Cuốn Tôm Thịt
  - Cháo Lòng
  - Cá Nướng Muối Ớt
  - Sườn Nướng
  - Chè Bưởi
  - Nhãn Trần
  - Hoa Quả
  - Sữa Đậu Nành
  - Bánh Flan
  - Cà Phê
  - Trà Đá

#### 4. **Bảng `orders`** - Đơn Hàng
- Bảng được tạo nhưng **KHÔNG có dữ liệu mặc định**
- Dữ liệu sẽ được thêm khi có đơn hàng mới

---

## 🔍 Kiểm Tra Dữ Liệu

### Xem dữ liệu trong database:

```bash
cd backend

# Xem số lượng users
sqlite3 database.sqlite "SELECT COUNT(*) FROM users;"

# Xem danh sách users
sqlite3 database.sqlite "SELECT id, email, role FROM users;"

# Xem số lượng tables
sqlite3 database.sqlite "SELECT COUNT(*) FROM tables;"

# Xem danh sách tables
sqlite3 database.sqlite "SELECT id, name, capacity, status FROM tables;"

# Xem số lượng menu items
sqlite3 database.sqlite "SELECT COUNT(*) FROM menu_items;"

# Xem danh sách menu items
sqlite3 database.sqlite "SELECT id, name, price, category FROM menu_items;"
```

---

## 📝 Lưu Ý

### Dữ Liệu Chỉ Được Tạo Khi:
- ✅ Backend chạy lần đầu tiên
- ✅ Bảng chưa tồn tại (sẽ được tạo)
- ✅ Dữ liệu mặc định chưa có (sẽ được thêm)

### Dữ Liệu KHÔNG Bị Ghi Đè:
- ⚠️ Nếu đã có dữ liệu, hệ thống **KHÔNG** xóa hoặc ghi đè
- ⚠️ Admin user chỉ được tạo nếu chưa tồn tại
- ⚠️ Tables chỉ được tạo nếu bảng `tables` trống
- ⚠️ Menu items chỉ được tạo nếu bảng `menu_items` trống

### Xóa Database và Tạo Lại:
```bash
cd backend
rm database.sqlite
npm run dev
# Database sẽ được tạo lại với dữ liệu mặc định
```

---

## 🎯 Tóm Tắt

| Bảng | Dữ Liệu Mặc Định | Tự Động Tạo? |
|------|------------------|--------------|
| `users` | 1 admin user | ✅ Có |
| `tables` | 5 bàn | ✅ Có |
| `menu_items` | 15 món ăn | ✅ Có (nếu trống) |
| `orders` | Không có | ❌ Không |

**Kết luận:** Khi backend chạy, **CÓ** dữ liệu được tự động thêm vào các bảng SQLite!


