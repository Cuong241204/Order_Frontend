# 🔧 Khắc Phục Lỗi "Hoàn Tất Đặt Hàng"

## ❌ Vấn Đề
Khi ấn "Hoàn tất đặt hàng", trạng thái hiển thị là lỗi.

## 🔍 Các Nguyên Nhân Có Thể

### 1. Backend Không Chạy
**Kiểm tra:**
```bash
# Terminal 1: Kiểm tra backend
cd backend
npm run dev
```

**Phải thấy:**
```
🚀 Server is running on http://localhost:3001
Database initialized successfully
```

### 2. Lỗi Kết Nối API
**Kiểm tra:**
- Mở Console (F12)
- Xem có lỗi "Failed to fetch" không
- Kiểm tra URL: `http://localhost:3001/api/orders`

### 3. Dữ Liệu Thiếu
**Kiểm tra:**
- Số điện thoại đã nhập chưa?
- Số bàn đã nhập chưa?
- Giỏ hàng có món ăn chưa?

### 4. Lỗi Parse JSON
**Đã sửa:** Code đã được cải thiện để parse JSON an toàn hơn.

## ✅ Cách Khắc Phục

### Bước 1: Kiểm Tra Backend
```bash
cd backend
npm run dev
```

### Bước 2: Kiểm Tra Console
1. Mở F12 → Console
2. Thử đặt hàng lại
3. Xem lỗi cụ thể

### Bước 3: Kiểm Tra Network
1. Mở F12 → Network
2. Thử đặt hàng
3. Xem request `POST /api/orders`
4. Kiểm tra:
   - Status code (phải là 201)
   - Response body
   - Error message

### Bước 4: Kiểm Tra Database
```bash
cd backend
sqlite3 database.sqlite
SELECT * FROM orders ORDER BY id DESC LIMIT 1;
```

## 📝 Thông Báo Lỗi Chi Tiết

Code đã được cập nhật để hiển thị thông báo lỗi chi tiết:
- "Không thể kết nối đến server" → Backend chưa chạy
- "Giỏ hàng không được để trống" → Thêm món vào giỏ hàng
- "Tổng giá không hợp lệ" → Kiểm tra lại giỏ hàng

## 🚀 Test Nhanh

1. **Kiểm tra backend:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Phải trả về: `{"status":"ok",...}`

2. **Test tạo order:**
   ```bash
   curl -X POST http://localhost:3001/api/orders \
     -H "Content-Type: application/json" \
     -d '{"items":[{"id":1,"name":"Test","price":10000,"quantity":1}],"totalPrice":10000}'
   ```

## 💡 Nếu Vẫn Lỗi

Vui lòng cung cấp:
1. Screenshot Console (F12)
2. Screenshot Network tab (F12)
3. Lỗi trong terminal backend
4. Lỗi trong terminal frontend
