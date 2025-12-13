# 📊 THÔNG TIN BẢNG ORDERS TRONG DATABASE

## ✅ Bảng `orders` đã tồn tại

### Cấu trúc bảng:
- **id** (INTEGER, PRIMARY KEY) - ID đơn hàng
- **user_id** (INTEGER) - ID người dùng
- **table_id** (INTEGER) - ID bàn
- **customer_name** (TEXT) - Tên khách hàng
- **customer_email** (TEXT) - Email khách hàng
- **customer_phone** (TEXT) - Số điện thoại
- **table_number** (TEXT) - Số bàn
- **number_of_guests** (INTEGER) - Số khách
- **items** (TEXT, NOT NULL) - Danh sách món ăn (JSON)
- **total_price** (REAL, NOT NULL) - Tổng tiền
- **status** (TEXT, DEFAULT 'pending') - Trạng thái đơn hàng
- **payment_method** (TEXT) - Phương thức thanh toán
- **created_at** (DATETIME) - Ngày tạo
- **updated_at** (DATETIME) - Ngày cập nhật

### Trạng thái đơn hàng:
- `pending` - Đang chờ
- `confirmed` - Đã xác nhận
- `preparing` - Đang chuẩn bị
- `ready` - Sẵn sàng
- `completed` - Hoàn thành

### Foreign Keys:
- `user_id` → `users(id)`
- `table_id` → `tables(id)`

## 📝 Lưu ý:
- Bảng được tạo tự động khi backend khởi động
- File database: `backend/database.sqlite`
- Bảng sẽ được tạo nếu chưa tồn tại (CREATE TABLE IF NOT EXISTS)
