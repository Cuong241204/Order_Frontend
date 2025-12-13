# 🔄 ĐÃ CHUYỂN TỪ VNPay SANG STRIPE

## ✅ ĐÃ THAY ĐỔI

### Frontend
1. **Payment.jsx:**
   - ✅ Xóa option VNPay
   - ✅ Đặt Stripe (card) làm phương thức mặc định
   - ✅ Cập nhật logic thanh toán để dùng Stripe
   - ✅ Cập nhật UI để hiển thị Stripe thay vì VNPay

2. **Checkout.jsx:**
   - ✅ Xóa option VNPay
   - ✅ Đặt Stripe (card) làm phương thức mặc định
   - ✅ Xóa code xử lý VNPay
   - ✅ Cập nhật UI

### Backend
- ⚠️ Backend routes VNPay vẫn còn nhưng không được sử dụng
- ✅ Stripe routes đã có sẵn và hoạt động

## 🎯 PHƯƠNG THỨC THANH TOÁN HIỆN TẠI

### 1. Stripe (Thẻ tín dụng/Ghi nợ) - **Mặc định**
- Visa, Mastercard, JCB, American Express
- Thanh toán an toàn với Stripe
- Nếu Stripe chưa cấu hình → Dùng mock payment

### 2. Tiền mặt
- Thanh toán khi nhận hàng
- Đơn hàng sẽ ở trạng thái "pending"

## 🔧 CẤU HÌNH STRIPE (Tùy chọn)

Nếu muốn dùng Stripe thật, thêm vào `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
```

**Lưu ý:**
- Nếu không cấu hình Stripe, hệ thống sẽ dùng mock payment (luôn thành công)
- Mock payment chỉ dùng cho testing, không phải thanh toán thật

## 📋 CÁCH HOẠT ĐỘNG

### Khi Stripe đã cấu hình:
1. User chọn "Stripe (Thẻ tín dụng/Ghi nợ)"
2. Nhập thông tin thẻ
3. Frontend gọi `createStripePaymentIntent`
4. Backend tạo Payment Intent với Stripe
5. Frontend xác nhận thanh toán với `confirmStripePayment`
6. Stripe xử lý thanh toán
7. Nếu thành công → Redirect đến `/payment/success`

### Khi Stripe chưa cấu hình:
1. User chọn "Stripe (Thẻ tín dụng/Ghi nợ)"
2. Nhập thông tin thẻ
3. Frontend gọi `createStripePaymentIntent`
4. Backend trả về `useMock: true`
5. Frontend dùng `processCardPayment` (mock)
6. Mock payment luôn thành công
7. Redirect đến `/payment/success`

## 🧪 TEST

### Test 1: Thanh toán với Stripe (Mock)
1. Vào `/checkout`
2. Chọn "Stripe (Thẻ tín dụng/Ghi nợ)" - mặc định
3. Điền form checkout
4. Click "Đặt Hàng"
5. Vào trang `/payment`
6. Nhập thông tin thẻ (bất kỳ)
7. Click "Thanh Toán"
8. **Kỳ vọng:** Thanh toán thành công (mock)

### Test 2: Thanh toán tiền mặt
1. Vào `/checkout`
2. Chọn "Thanh toán tiền mặt tại nhà hàng"
3. Điền form checkout
4. Click "Đặt Hàng"
5. **Kỳ vọng:** Đơn hàng được tạo với status "pending"

## ⚠️ LƯU Ý

1. **VNPay code vẫn còn trong backend** nhưng không được sử dụng
2. **Có thể xóa VNPay code** nếu không cần thiết:
   - `backend/src/config/vnpay.js`
   - `backend/src/controllers/paymentController.js` (functions: `createVNPayUrl`, `handleVNPayCallback`)
   - `backend/src/routes/payment.js` (VNPay routes)
   - `frontend/src/services/api.js` (VNPay API)

3. **Stripe test cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - CVC: Bất kỳ 3 chữ số
   - Expiry: Bất kỳ ngày trong tương lai

## ✅ KẾT LUẬN

**Đã hoàn thành:**
- ✅ Xóa VNPay khỏi frontend
- ✅ Thay thế bằng Stripe
- ✅ Stripe là phương thức mặc định
- ✅ Hỗ trợ mock payment khi Stripe chưa cấu hình

**Hệ thống hiện tại:**
- Stripe (card) - Mặc định, khuyến nghị
- Tiền mặt - Thanh toán khi nhận hàng
