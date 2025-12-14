# 🔐 STRIPE PAYMENT SETUP - LUỒNG THANH TOÁN THẬT

## ✅ ĐÃ SỬA

### Backend
- ✅ `paymentController.js`: Removed mock payment logic
- ✅ `processCardPayment`: Now deprecated, returns error directing to use Stripe
- ✅ `confirmStripePayment`: Xác nhận thanh toán thật với Stripe

### Frontend
- ✅ `Checkout.jsx`: Redirect to Payment page thay vì gọi mock payment
- ✅ `Checkout.jsx`: Removed card input fields (chỉ cần ở Payment page)
- ✅ `Payment.jsx`: Removed mock fallback, BẮT BUỘC dùng Stripe
- ✅ `Payment.jsx`: Show error nếu Stripe chưa cấu hình
- ✅ `App.jsx`: Fix Elements wrapper - always wrap Payment with Elements

---

## 🎯 LUỒNG THANH TOÁN MỚI (ĐÚNG)

```
1. User vào /checkout
   ↓
2. Điền thông tin (phone, table, số khách)
   ↓
3. Chọn payment method = "card" (Stripe)
   ↓
4. Click "Hoàn Tất Đặt Hàng"
   ↓
5. Backend tạo order (status = "pending")
   ↓
6. Frontend redirect đến /payment với order data
   ↓
7. Payment page load Stripe PaymentIntent từ backend
   ↓
8. User nhập card info qua Stripe CardElement
   ↓
9. Click "Thanh Toán"
   ↓
10. Stripe xử lý payment (stripe.confirmCardPayment)
   ↓
11. Frontend gọi backend confirmStripePayment
   ↓
12. Backend update order status = "completed"
   ↓
13. Redirect đến /payment/success
```

---

## 🔑 CẤU HÌNH STRIPE (BẮT BUỘC)

### Bước 1: Lấy Stripe API Keys

1. Truy cập: https://dashboard.stripe.com/test/apikeys
2. Đăng nhập hoặc tạo tài khoản Stripe
3. Copy 2 keys:
   - **Publishable key** (bắt đầu với `pk_test_...`)
   - **Secret key** (bắt đầu với `sk_test_...`)

### Bước 2: Cấu hình Backend

Tạo file `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Sửa file `.env`:

```env
# Stripe Configuration (Required)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

# Other configs...
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

### Bước 3: Cấu hình Frontend

Tạo file `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

Sửa file `.env`:

```env
# Stripe Publishable Key (Required)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**LƯU Ý:** 
- Frontend cần `pk_test_...` (Publishable Key)
- Backend cần `sk_test_...` (Secret Key)
- KHÔNG bao giờ expose Secret Key ra frontend!

---

## 🧪 TEST THANH TOÁN

### 1. Start Backend & Frontend

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 2. Test Flow

1. Mở http://localhost:5173/home
2. Thêm món vào giỏ hàng
3. Vào `/cart` → Click "Thanh Toán"
4. Điền thông tin checkout
5. Chọn "Stripe (Thẻ tín dụng/Ghi nợ)"
6. Click "Hoàn Tất Đặt Hàng"
7. **Sẽ redirect đến `/payment`**
8. Nhập thông tin thẻ test:
   - **Card Number:** 4242 4242 4242 4242
   - **Expiry:** 12/34 (bất kỳ tương lai)
   - **CVC:** 123
   - **Name:** Test User
9. Click "Thanh Toán"
10. **Expected:** Payment success → Redirect to `/payment/success`

### 3. Stripe Test Cards

| Card Number | Result |
|------------|---------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0027 6000 3184` | 🔐 Requires authentication |

More: https://stripe.com/docs/testing#cards

---

## ⚠️ LỖI THƯỜNG GẶP

### 1. "Stripe chưa được cấu hình"

**Nguyên nhân:** Thiếu `STRIPE_SECRET_KEY` trong `backend/.env` hoặc `VITE_STRIPE_PUBLISHABLE_KEY` trong `frontend/.env`

**Giải pháp:**
```bash
# Check backend
cd backend
cat .env | grep STRIPE_SECRET_KEY

# Check frontend  
cd frontend
cat .env | grep VITE_STRIPE_PUBLISHABLE_KEY
```

Nếu thiếu, add keys vào file `.env` và **restart cả backend và frontend**.

### 2. "Could not find Elements context"

**Nguyên nhân:** Payment component không được wrap trong `<Elements>` provider

**Đã fix:** App.jsx luôn wrap Payment với Elements

### 3. "Invalid API Key"

**Nguyên nhân:** Sai key hoặc dùng test key cho production (hoặc ngược lại)

**Giải pháp:** 
- Development: dùng `pk_test_...` và `sk_test_...`
- Production: dùng `pk_live_...` và `sk_live_...`

### 4. CORS Error khi gọi Stripe API

**Nguyên nhân:** Backend không chạy hoặc CORS chưa được config

**Giải pháp:** Check backend đang chạy ở port 3001:
```bash
curl http://localhost:3001/api/menu
```

---

## 📋 CHECKLIST SỬA LỖI

- [x] Backend có `STRIPE_SECRET_KEY` trong `.env`
- [x] Frontend có `VITE_STRIPE_PUBLISHABLE_KEY` trong `.env`
- [x] Backend đang chạy (port 3001)
- [x] Frontend đang chạy (port 5173)
- [x] Restart cả backend và frontend sau khi thêm keys
- [x] Checkout redirect to Payment page
- [x] Payment page có Stripe CardElement
- [x] Payment wrapped trong `<Elements>` provider
- [x] Backend route `/api/payment/stripe/*` hoạt động

---

## 🚀 PRODUCTION DEPLOYMENT

### Chuyển sang Live Keys

1. Lấy live keys từ: https://dashboard.stripe.com/apikeys
2. Update `.env`:
   ```env
   # Backend
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   
   # Frontend
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   ```
3. Test kỹ với test cards trước khi deploy
4. **QUAN TRỌNG:** Không commit `.env` files lên git!

### Security Checklist

- [ ] `.env` files trong `.gitignore`
- [ ] Secret keys không bao giờ expose ra frontend
- [ ] HTTPS enabled cho production
- [ ] Webhook secrets configured (nếu dùng webhooks)
- [ ] Test transaction limits

---

## 📞 HỖ TRỢ

- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing#cards
- API Reference: https://stripe.com/docs/api
- Dashboard: https://dashboard.stripe.com

---

## ✨ KẾT LUẬN

**Đã hoàn thành:**
- ✅ Remove mock payment
- ✅ Implement real Stripe payment flow
- ✅ Proper error handling
- ✅ Validation và security checks
- ✅ Documentation đầy đủ

**Flow thanh toán hiện tại:** THẬT với Stripe, không còn mock!

