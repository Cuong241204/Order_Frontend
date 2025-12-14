# 🧪 QUICK TEST - STRIPE PAYMENT

## Bước 1: Kiểm tra Backend đang chạy

```bash
curl http://localhost:3001/api/health
```

**Expected:** Trả về status 200

## Bước 2: Kiểm tra Frontend đang chạy

```bash
curl -I http://localhost:5173
```

**Expected:** HTTP/1.1 200 OK

## Bước 3: Kiểm tra Stripe Keys

### Backend
```bash
cd backend
grep STRIPE_SECRET_KEY .env
```

**Expected:** `STRIPE_SECRET_KEY=sk_test_51Rra...`

### Frontend
```bash
cd frontend
grep VITE_STRIPE_PUBLISHABLE_KEY .env
```

**Expected:** `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Rra...`

## Bước 4: Test Payment Flow

1. Mở trình duyệt: http://localhost:5173/home
2. Mở Console (F12)
3. Kiểm tra console có lỗi không?

### Nếu thấy lỗi "Could not find Elements context"
→ **Giải pháp:** Hard refresh trang (Cmd+Shift+R hoặc Ctrl+Shift+R)

### Nếu thấy "Stripe chưa được cấu hình"
→ **Giải pháp:** 
```bash
# Terminal 1: Restart backend
cd backend
# Ctrl+C để stop, sau đó:
npm run dev

# Terminal 2: Restart frontend
cd frontend  
# Ctrl+C để stop, sau đó:
npm run dev
```

## Bước 5: Test Checkout Flow

1. **Home** → Thêm món vào giỏ
2. **Cart** → Click "Thanh Toán"
3. **Checkout** → 
   - Điền phone: 0901234567
   - Table: Bàn 1
   - Số khách: 2
   - Payment: "Stripe (Thẻ tín dụng)"
4. Click "Hoàn Tất Đặt Hàng"
5. **Sẽ redirect đến `/payment`**

## Bước 6: Kiểm tra Payment Page

### Nếu THẤY form Stripe CardElement:
✅ **Thành công!** Tiếp tục test payment:
- Card: 4242 4242 4242 4242
- Expiry: 12/34
- CVC: 123
- Name: Test User
- Click "Thanh Toán"

### Nếu KHÔNG THẤY form (mất form):
❌ **Có vấn đề.** Kiểm tra:

1. **Console có lỗi gì?**
   - F12 → Console tab
   - Copy error message

2. **Network tab có lỗi?**
   - F12 → Network tab
   - Tìm request `/api/payment/stripe/create-intent`
   - Status code là gì? (200, 400, 500?)
   - Response là gì?

3. **React DevTools**
   - Install React DevTools extension
   - Check Payment component props:
     - `orderData`: có data không?
     - `clientSecret`: có giá trị không?
     - `stripe`: có null không?
     - `elements`: có null không?

## Bước 7: Debug Commands

### Check backend logs
```bash
# Xem terminal backend có lỗi không
# Tìm dòng có "error" hoặc "Error"
```

### Check frontend console
```javascript
// Trong browser console, chạy:
console.log('Stripe loaded?', window.Stripe)
console.log('Env vars:', import.meta.env)
```

### Test API trực tiếp
```bash
# Tạo order test
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerPhone": "0901234567",
    "tableNumber": "1",
    "numberOfGuests": 2,
    "items": [{"id":1,"name":"Test","price":50000,"quantity":1}],
    "totalPrice": 50000,
    "paymentMethod": "card"
  }'

# Copy orderId từ response, sau đó test create payment intent:
curl -X POST http://localhost:3001/api/payment/stripe/create-intent \
  -H "Content-Type: application/json" \
  -d '{"orderId": ORDER_ID_VỪA_TẠO}'
```

**Expected Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

## Troubleshooting

### "Form mất" - Các nguyên nhân có thể:

1. **Frontend chưa load Stripe key**
   - Check: `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` trong console
   - Fix: Restart frontend

2. **Backend không trả về clientSecret**
   - Check: Network tab xem response
   - Fix: Check backend logs, restart backend

3. **Order không tồn tại hoặc không pending**
   - Check: localStorage có `lastOrder` không?
   - Fix: Tạo order mới từ checkout

4. **Stripe Elements không render**
   - Check: Console có lỗi "Could not find Elements context"?
   - Fix: Hard refresh (Cmd+Shift+R)

5. **React re-render issues**
   - Check: Payment component re-render liên tục?
   - Fix: Clear cache, hard refresh

## Quick Fix Commands

```bash
# Fix tất cả cùng lúc:
# Terminal 1
cd /Users/quynhlx/Documents/Order_Frontend/backend
npm run dev

# Terminal 2  
cd /Users/quynhlx/Documents/Order_Frontend/frontend
npm run dev

# Sau đó refresh browser với Cmd+Shift+R (hard refresh)
```

---

**Nếu vẫn bị "mất form", hãy:**
1. Copy error message từ Console
2. Copy response từ Network tab (request create-intent)
3. Gửi cho tôi để debug
