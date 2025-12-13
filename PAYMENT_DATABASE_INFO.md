# 💳 THANH TOÁN VÀ DATABASE

## ❓ Câu hỏi: Thanh toán có cần database không?

## ✅ Trả lời: **KHÔNG CẦN DATABASE RIÊNG** (hiện tại)

### 📋 Cách hoạt động hiện tại:

#### 1. **Không có bảng riêng cho payments**
- ❌ Không có bảng `payments`
- ❌ Không có bảng `transactions`
- ✅ Chỉ sử dụng bảng `orders` có sẵn

#### 2. **Thông tin thanh toán được lưu trong bảng `orders`:**
- **payment_method** (TEXT) - Phương thức thanh toán (vnpay, card, cash)
- **status** (TEXT) - Trạng thái đơn hàng (pending → completed)

#### 3. **Khi thanh toán thành công:**
```sql
UPDATE orders 
SET status = 'completed', 
    payment_method = 'vnpay' (hoặc 'card', 'cash'),
    updated_at = CURRENT_TIMESTAMP 
WHERE id = ?
```

#### 4. **Transaction ID:**
- ⚠️ **KHÔNG được lưu vào database**
- Chỉ truyền qua URL (VNPay callback) hoặc response (Stripe)
- Mất mát khi refresh/reload

## 💡 Có nên tạo bảng payments riêng?

### ✅ **NÊN** nếu muốn:
- Lưu lịch sử thanh toán chi tiết
- Lưu Transaction ID để tra cứu
- Lưu thời gian thanh toán chính xác
- Lưu thông tin card (đã hash) cho audit
- Hỗ trợ refund/hoàn tiền
- Báo cáo doanh thu theo payment method

### ❌ **KHÔNG CẦN** nếu:
- Chỉ cần biết đơn hàng đã thanh toán chưa
- Không cần tra cứu transaction
- Hệ thống đơn giản

## 📊 Kết luận:

**Hiện tại:** Thanh toán KHÔNG cần database riêng, chỉ cập nhật bảng `orders`.

**Nếu cần:** Có thể tạo bảng `payments` để lưu chi tiết hơn.
