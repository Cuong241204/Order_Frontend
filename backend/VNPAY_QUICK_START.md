# ⚡ VNPay Quick Start

## 🚀 Cấu Hình Nhanh (5 Phút)

### 1. Đăng Ký VNPay Sandbox

Truy cập: **https://sandbox.vnpayment.vn/**

Đăng ký tài khoản miễn phí để test.

### 2. Lấy Credentials

Sau khi đăng nhập:
- Vào **"Quản lý website"** hoặc **"Merchant"**
- Copy **TMN Code** và **Secret Key**

### 3. Cấu Hình Backend

```bash
cd backend
```

Tạo file `.env`:

```env
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_SECRET_KEY=YOUR_SECRET_KEY
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/success
FRONTEND_URL=http://localhost:5173
```

**Thay `YOUR_TMN_CODE` và `YOUR_SECRET_KEY` bằng giá trị thực tế!**

### 4. Restart Backend

```bash
# Dừng backend (Ctrl+C)
npm run dev
```

### 5. Test

1. Tạo đơn hàng
2. Chọn VNPay
3. Click "Thanh Toán"
4. Sẽ redirect đến VNPay
5. Dùng thẻ test để thanh toán

## ✅ Xong!

VNPay đã sẵn sàng sử dụng!

Xem chi tiết: `VNPAY_CREDENTIALS.md`


