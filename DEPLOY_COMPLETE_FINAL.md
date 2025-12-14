# 🚀 Hướng Dẫn Deploy Hoàn Chỉnh - Đảm Bảo 100% Thành Công

Hướng dẫn deploy dự án FoodOrder từ đầu đến cuối, đảm bảo không thiếu sót, không lỗi, đầy đủ 100% chức năng.

---

## ✅ PHẦN 1: KIỂM TRA TRƯỚC KHI DEPLOY

### 1.1. Kiểm Tra Code Đã Đầy Đủ

```bash
cd /Users/macbook/Order_Frontend
git status
```

**Đảm bảo:**
- [ ] Không có file quan trọng nào chưa commit
- [ ] Tất cả code đã được commit
- [ ] Đã push lên GitHub

**Nếu có file chưa commit:**
```bash
git add .
git commit -m "Final preparation for deployment"
git push origin main
```

### 1.2. Kiểm Tra Files Quan Trọng

**Frontend:**
- [x] `frontend/public/images/` - 17 ảnh ✅
- [x] `frontend/public/404.html` - File sửa routing ✅
- [x] `frontend/vite.config.js` - Cấu hình build ✅
- [x] `frontend/index.html` - HTML chính ✅
- [x] `frontend/package.json` - Dependencies ✅

**Backend:**
- [x] `backend/src/server.js` - Server entry ✅
- [x] `backend/package.json` - Dependencies ✅
- [x] `backend/src/config/database.js` - Database ✅
- [x] Tất cả routes đầy đủ ✅

**Deploy Files:**
- [x] `render.yaml` - Blueprint config ✅
- [x] `.renderignore` - Ignore files ✅
- [x] `404.html` - SPA routing fix ✅

---

## 🚀 PHẦN 2: DEPLOY BACKEND

### Bước 1: Tạo Backend Service

1. Vào **Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect repository **Order_Frontend**

### Bước 2: Cấu Hình Backend

**Điền CHÍNH XÁC:**

| Trường | Giá Trị |
|--------|---------|
| **Name** | `foodorder-backend` |
| **Region** | `Singapore` (hoặc gần nhất) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **QUAN TRỌNG** |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Bước 3: Environment Variables (Backend)

Click **"+ Add Environment Variable"** và thêm:

#### 1. NODE_ENV
- **NAME**: `NODE_ENV`
- **VALUE**: `production`

#### 2. PORT
- **NAME**: `PORT`
- **VALUE**: `10000`

#### 3. JWT_SECRET
- **NAME**: `JWT_SECRET`
- **VALUE**: Click **"Generate"** (hoặc tự tạo chuỗi ngẫu nhiên dài)

#### 4. FRONTEND_URL (Tạm thời)
- **NAME**: `FRONTEND_URL`
- **VALUE**: `https://foodorder-frontend.onrender.com` (sẽ cập nhật sau)

#### 5. STRIPE_SECRET_KEY (Nếu dùng Stripe)
- **NAME**: `STRIPE_SECRET_KEY`
- **VALUE**: `sk_test_...` (lấy từ Stripe Dashboard)

### Bước 4: Deploy Backend

1. Click **"Create Web Service"**
2. Đợi build (2-5 phút)
3. Lấy URL backend (ví dụ: `https://foodorder-backend-8xh6.onrender.com`)

### Bước 5: Test Backend

Truy cập: `https://your-backend-url.onrender.com/api/health`

Phải thấy:
```json
{
  "status": "ok",
  "message": "FoodOrder API is running"
}
```

✅ **Backend đã sẵn sàng!**

---

## 🎨 PHẦN 3: DEPLOY FRONTEND

### Bước 1: Tạo Frontend Service

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect **CÙNG repository** Order_Frontend

### Bước 2: Cấu Hình Frontend

**Điền CHÍNH XÁC:**

| Trường | Giá Trị |
|--------|---------|
| **Name** | `foodorder-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` ⚠️ **QUAN TRỌNG NHẤT** |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Plan** | `Free` |

### Bước 3: Environment Variables (Frontend)

#### 1. VITE_API_URL (BẮT BUỘC)
- **NAME**: `VITE_API_URL`
- **VALUE**: `https://your-backend-url.onrender.com/api`
  - Thay `your-backend-url` bằng URL backend thực tế
  - ⚠️ **PHẢI có `/api` ở cuối**
  - ⚠️ **KHÔNG có dấu `/` cuối**

#### 2. VITE_STRIPE_PUBLISHABLE_KEY (Nếu dùng Stripe)
- **NAME**: `VITE_STRIPE_PUBLISHABLE_KEY`
- **VALUE**: `pk_test_...` (lấy từ Stripe Dashboard)

### Bước 4: Cấu Hình SPA Routing (QUAN TRỌNG)

1. Vào Frontend Service → **"Settings"**
2. Tìm phần **"Redirects"** hoặc **"Custom 404"**
3. Nếu có, thêm:
   - **From**: `/*`
   - **To**: `/index.html`
   - **Status**: `200`

⚠️ **Lưu ý**: File `404.html` đã được commit, sẽ tự động hoạt động. Nhưng nếu Render có phần cấu hình redirect, nên dùng để chắc chắn hơn.

### Bước 5: Deploy Frontend

1. Click **"Create Static Site"**
2. Đợi build (2-5 phút)
3. Lấy URL frontend (ví dụ: `https://foodorder-frontend-xxxx.onrender.com`)

### Bước 6: Test Frontend

1. Truy cập URL frontend
2. Trang chủ phải load được
3. Test các routes:
   - `/menu` - Phải load được
   - `/cart` - Phải load được
   - `/home` - Phải load được

✅ **Frontend đã sẵn sàng!**

---

## 🔄 PHẦN 4: CẬP NHẬT CẤU HÌNH

### Bước 1: Cập Nhật FRONTEND_URL Trong Backend

1. Vào **Backend Service** → Tab **"Environment"**
2. Tìm biến `FRONTEND_URL`
3. Click **"Edit"**
4. Cập nhật = URL frontend thực tế
   - Ví dụ: `https://foodorder-frontend-xxxx.onrender.com`
   - ⚠️ **KHÔNG có dấu `/` cuối**
5. Click **"Save Changes"**
6. Backend sẽ tự động redeploy

### Bước 2: Đợi Backend Redeploy

- Thời gian: 1-2 phút
- Đợi đến khi redeploy xong

---

## 🧪 PHẦN 5: TEST TOÀN BỘ CHỨC NĂNG

### 5.1. Test Authentication

- [ ] Đăng ký user mới
- [ ] Đăng nhập user
- [ ] Đăng nhập admin: `admin@foodorder.com` / `admin123`
- [ ] Logout

### 5.2. Test User Features

- [ ] Trang chủ (`/home`) load được
- [ ] Menu (`/menu`) load được, hiển thị 15 món
- [ ] **Tất cả 15 ảnh hiển thị đúng**
- [ ] Thêm món vào giỏ hàng
- [ ] Giỏ hàng (`/cart`) load được
- [ ] Cập nhật số lượng
- [ ] Xóa món
- [ ] Checkout (`/checkout`) load được
- [ ] Đặt hàng thành công
- [ ] Lịch sử đơn hàng (`/orders`) load được
- [ ] Profile (`/profile`) load được

### 5.3. Test Admin Features

- [ ] Dashboard (`/admin/dashboard`) load được
- [ ] Quản lý menu (`/admin/menu`):
  - [ ] Xem danh sách món
  - [ ] Thêm món mới
  - [ ] Sửa món
  - [ ] Xóa món
  - [ ] **Upload ảnh món ăn**
- [ ] Quản lý đơn hàng (`/admin/orders`):
  - [ ] Xem danh sách đơn
  - [ ] Cập nhật trạng thái đơn
- [ ] Quản lý bàn (`/admin/tables`):
  - [ ] Xem danh sách bàn
  - [ ] Thêm bàn mới
  - [ ] Sửa bàn
  - [ ] Xóa bàn
  - [ ] **QR code hiển thị**
  - [ ] **QR code URL đúng** (không phải localhost)
- [ ] Quản lý user (`/admin/users`):
  - [ ] Xem danh sách user
  - [ ] Xóa user

### 5.4. Test QR Code

- [ ] Đăng nhập admin
- [ ] Vào "Quản lý bàn"
- [ ] Xem QR code của mỗi bàn
- [ ] **Kiểm tra URL trong QR code**:
  - Phải là: `https://your-frontend-url.onrender.com/home?table=X`
  - KHÔNG phải: `http://localhost:5173/home?table=X`
- [ ] **Quét QR code bằng điện thoại**
- [ ] Phải mở được trang home với `?table=X`
- [ ] Table context được set đúng

### 5.5. Test Payment (Stripe)

- [ ] Thêm món vào giỏ hàng
- [ ] Checkout
- [ ] Chọn "Thanh toán bằng thẻ" (Stripe)
- [ ] **Stripe form hiển thị**
- [ ] Điền thông tin thẻ test:
  - Card: `4242 4242 4242 4242`
  - Expiry: `12/25`
  - CVC: `123`
  - ZIP: `12345`
- [ ] Click "Thanh toán"
- [ ] **Thanh toán thành công**
- [ ] Redirect đến Payment Success page
- [ ] Đơn hàng được tạo trong database

### 5.6. Test Routing (SPA)

Test tất cả routes, đảm bảo không có lỗi 404:

- [ ] `/` - Role selection
- [ ] `/home` - Home page
- [ ] `/menu` - Menu page
- [ ] `/cart` - Cart page
- [ ] `/checkout` - Checkout page
- [ ] `/login` - Login page
- [ ] `/register` - Register page
- [ ] `/profile` - Profile page
- [ ] `/orders` - Orders page
- [ ] `/admin/login` - Admin login
- [ ] `/admin/dashboard` - Admin dashboard
- [ ] `/admin/menu` - Menu management
- [ ] `/admin/orders` - Order management
- [ ] `/admin/tables` - Table management
- [ ] `/admin/users` - User management
- [ ] `/payment` - Payment page
- [ ] `/payment/success` - Payment success
- [ ] `/payment/failed` - Payment failed

**Tất cả routes phải load được, không có lỗi 404!**

---

## 🐛 PHẦN 6: XỬ LÝ LỖI

### Lỗi 1: Backend Không Start

**Kiểm tra:**
1. Xem logs trong Backend Service → Logs
2. Kiểm tra environment variables đã đủ chưa
3. Kiểm tra Root Directory = `backend`

**Giải pháp:**
- Sửa lỗi theo logs
- Kiểm tra lại cấu hình
- Redeploy

### Lỗi 2: Frontend Build Failed

**Kiểm tra:**
1. Xem logs trong Frontend Service → Logs
2. Kiểm tra Root Directory = `frontend`
3. Kiểm tra Build Command = `npm install && npm run build`

**Giải pháp:**
- Sửa lỗi theo logs
- Kiểm tra lại cấu hình
- Redeploy

### Lỗi 3: Routes Bị 404 (Not Found)

**Nguyên nhân:** SPA routing chưa được cấu hình

**Giải pháp:**
1. File `404.html` đã được commit
2. Redeploy frontend
3. Hoặc cấu hình redirect trong Render Settings:
   - From: `/*`
   - To: `/index.html`
   - Status: `200`

### Lỗi 4: QR Code Vẫn Trỏ Về Localhost

**Nguyên nhân:** `FRONTEND_URL` chưa được cập nhật

**Giải pháp:**
1. Kiểm tra `FRONTEND_URL` trong backend = URL frontend chính xác
2. Manual redeploy backend
3. Refresh trang admin
4. Xem lại QR code

### Lỗi 5: Stripe Không Hoạt Động

**Nguyên nhân:** Keys chưa được set hoặc không match

**Giải pháp:**
1. Kiểm tra `STRIPE_SECRET_KEY` trong backend
2. Kiểm tra `VITE_STRIPE_PUBLISHABLE_KEY` trong frontend
3. Đảm bảo cả 2 đều là test keys
4. **Redeploy frontend** (bắt buộc sau khi thêm env vars)
5. Test lại với thẻ test: `4242 4242 4242 4242`

### Lỗi 6: Images Không Hiển Thị

**Nguyên nhân:** Images chưa được copy vào build

**Giải pháp:**
1. Kiểm tra `frontend/public/images/` có đủ 17 ảnh
2. Vite tự động copy `public/` → `dist/`
3. Kiểm tra đường dẫn trong code: `/images/pho_bo.jpg`

### Lỗi 7: API Không Kết Nối

**Nguyên nhân:** `VITE_API_URL` sai

**Giải pháp:**
1. Kiểm tra `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
2. Redeploy frontend

### Lỗi 8: CORS Error

**Nguyên nhân:** `FRONTEND_URL` trong backend sai

**Giải pháp:**
1. Cập nhật `FRONTEND_URL` = URL frontend chính xác
2. Redeploy backend

---

## ✅ PHẦN 7: CHECKLIST CUỐI CÙNG

### Trước Khi Deploy:
- [ ] Code đã commit và push
- [ ] Images đầy đủ (17 files)
- [ ] File `404.html` đã có
- [ ] Dependencies đầy đủ
- [ ] Configuration files đúng

### Sau Khi Deploy Backend:
- [ ] Backend deploy thành công
- [ ] Có URL backend
- [ ] Test `/api/health` OK
- [ ] Environment variables đầy đủ

### Sau Khi Deploy Frontend:
- [ ] Frontend deploy thành công
- [ ] Có URL frontend
- [ ] Trang chủ load được
- [ ] Environment variables đầy đủ
- [ ] SPA routing hoạt động (không có 404)

### Sau Khi Cấu Hình:
- [ ] `FRONTEND_URL` trong backend = URL frontend chính xác
- [ ] QR code URL đúng (không phải localhost)
- [ ] QR code quét được
- [ ] Stripe keys đã set
- [ ] Stripe payment hoạt động
- [ ] Tất cả routes load được
- [ ] Tất cả chức năng test pass

---

## 🎉 HOÀN THÀNH!

Sau khi hoàn thành tất cả các bước và checklist, bạn sẽ có ứng dụng đầy đủ 100% chức năng!

**URLs:**
- Backend: `https://foodorder-backend-8xh6.onrender.com`
- Frontend: `https://foodorder-frontend-xxxx.onrender.com`

**Tài khoản admin:**
- Email: `admin@foodorder.com`
- Password: `admin123`

**Stripe Test Card:**
- Number: `4242 4242 4242 4242`
- Expiry: `12/25` (bất kỳ tương lai)
- CVC: `123` (bất kỳ 3 số)
- ZIP: `12345` (bất kỳ 5 số)

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Root Directory**: Backend = `backend`, Frontend = `frontend` (KHÔNG có `/`)
2. **Environment Variables**: 
   - `VITE_API_URL` phải có `/api` ở cuối
   - `FRONTEND_URL` KHÔNG có `/` cuối
3. **Redeploy**: 
   - Frontend cần redeploy sau khi thêm env vars
   - Backend cần redeploy sau khi cập nhật `FRONTEND_URL`
4. **SPA Routing**: File `404.html` đã được commit, sẽ tự động hoạt động
5. **Stripe Keys**: Phải match (test với test, live với live)

---

💡 **Tip**: Làm theo từng bước, đánh dấu checklist, và test sau mỗi phần để đảm bảo không có lỗi!
