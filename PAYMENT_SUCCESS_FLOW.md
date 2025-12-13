# ✅ FLOW SAU KHI THANH TOÁN THÀNH CÔNG

## 📋 Tổng Quan

Khi thanh toán thành công, hệ thống sẽ thực hiện các bước sau:

---

## 🔄 FLOW CHI TIẾT THEO TỪNG PHƯƠNG THỨC

### 1️⃣ **VNPay (Thanh toán Online)**

#### Backend xử lý:
1. ✅ **Cập nhật trạng thái đơn hàng**
   ```javascript
   UPDATE orders SET status = 'completed', payment_method = 'vnpay' WHERE id = ?
   ```

2. ✅ **Gửi email xác nhận thanh toán**
   - Gửi email đến `customer_email` với:
     - Mã đơn hàng
     - Số tiền đã thanh toán
     - Phương thức: VNPay
     - Mã giao dịch (transaction ID)

3. ✅ **Redirect về Frontend**
   ```
   /payment/success?orderId={orderId}&transactionId={transactionId}
   ```

#### Frontend xử lý:
1. ✅ **Hiển thị trang PaymentSuccess**
   - Icon thành công
   - Thông tin đơn hàng (ID, tổng tiền, phương thức)
   - Mã giao dịch VNPay
   - Nút "Về Trang Chủ" và "Xem Đơn Hàng"

2. ✅ **User có thể:**
   - Xem chi tiết đơn hàng
   - Quay về trang chủ
   - Xem danh sách đơn hàng

---

### 2️⃣ **Thẻ Tín Dụng (Card/Stripe)**

#### Backend xử lý:
1. ✅ **Cập nhật trạng thái đơn hàng**
   ```javascript
   UPDATE orders SET status = 'completed', payment_method = 'card' WHERE id = ?
   ```

2. ✅ **Gửi email xác nhận thanh toán**
   - Gửi email với thông tin tương tự VNPay

3. ✅ **Trả về response JSON**
   ```json
   {
     "success": true,
     "message": "Thanh toán thành công",
     "orderId": 123
   }
   ```

#### Frontend xử lý:
1. ✅ **Xóa giỏ hàng**
   ```javascript
   localStorage.removeItem('cart_${user.id}') // hoặc 'cart_guest'
   ```

2. ✅ **Hiển thị thông báo**
   - "Thanh toán thành công! Đang chuyển đến trang đơn hàng..."

3. ✅ **Redirect sau 1.5 giây**
   ```
   /orders?paymentSuccess=true
   ```

---

### 3️⃣ **Tiền Mặt (Cash)**

#### Backend xử lý:
- Không có xử lý đặc biệt (đơn hàng đã được tạo với status 'pending')

#### Frontend xử lý:
1. ✅ **Cập nhật trạng thái đơn hàng**
   ```javascript
   await ordersAPI.updateStatus(order.id, 'completed')
   ```

2. ✅ **Xóa giỏ hàng**
   ```javascript
   localStorage.removeItem('cart_${user.id}')
   ```

3. ✅ **Hiển thị thông báo**
   - "Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng."

4. ✅ **Redirect sau 1.5 giây**
   ```
   /orders?orderSuccess=true
   ```

---

## 📧 EMAIL XÁC NHẬN

### Khi nào gửi email?
- ✅ **VNPay**: Gửi sau khi thanh toán thành công
- ✅ **Card**: Gửi sau khi thanh toán thành công
- ❌ **Cash**: Không gửi email (thanh toán khi nhận hàng)

### Nội dung email:
- ✅ Tiêu đề: "Thanh toán thành công - Đơn hàng #{orderId}"
- ✅ Mã đơn hàng
- ✅ Số tiền đã thanh toán
- ✅ Phương thức thanh toán
- ✅ Mã giao dịch (nếu có)

### Lưu ý:
- Email chỉ gửi nếu đã cấu hình trong `backend/.env`:
  ```env
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your-app-password
  ```

---

## 🗄️ DATABASE UPDATES

### Bảng `orders` được cập nhật:
```sql
UPDATE orders SET 
  status = 'completed',
  payment_method = 'vnpay' | 'card' | 'cash',
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
```

### Các trường được cập nhật:
- ✅ `status`: `'pending'` → `'completed'`
- ✅ `payment_method`: Lưu phương thức thanh toán
- ✅ `updated_at`: Cập nhật thời gian

---

## 🎯 TRANG ĐÍCH SAU THANH TOÁN

### VNPay:
- **Trang**: `/payment/success`
- **Hiển thị**: Thông tin đơn hàng + mã giao dịch
- **Actions**: Về trang chủ / Xem đơn hàng

### Card/Cash:
- **Trang**: `/orders`
- **Hiển thị**: Danh sách đơn hàng
- **State**: `paymentSuccess: true` hoặc `orderSuccess: true`

---

## ✅ TÓM TẮT

Sau khi thanh toán thành công:

1. ✅ **Database**: Order status → `'completed'`
2. ✅ **Email**: Gửi xác nhận (nếu đã cấu hình)
3. ✅ **Cart**: Xóa giỏ hàng (frontend)
4. ✅ **Redirect**: Chuyển đến trang success hoặc orders
5. ✅ **Admin**: Đơn hàng hiển thị trong quản lý với status "Đã hoàn thành"

---

## 🔍 KIỂM TRA

### Kiểm tra trong database:
```bash
cd backend
sqlite3 database.sqlite "SELECT id, status, payment_method, updated_at FROM orders ORDER BY id DESC LIMIT 1;"
```

### Kiểm tra trong Admin:
1. Vào **Quản lý đơn hàng**
2. Tìm đơn hàng vừa thanh toán
3. Status phải là **"Đã hoàn thành"**
4. Có thể xem invoice nếu status = 'completed'
