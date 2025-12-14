# 🚀 Hướng Dẫn Deploy Chi Tiết Từng Bước

Hướng dẫn deploy dự án FoodOrder lên Render từ đầu đến cuối, đảm bảo 100% chức năng hoạt động.

---

## 📋 Mục Lục

1. [Chuẩn Bị](#1-chuẩn-bị)
2. [Deploy Backend](#2-deploy-backend)
3. [Deploy Frontend](#3-deploy-frontend)
4. [Cấu Hình QR Code](#4-cấu-hình-qr-code)
5. [Cấu Hình Stripe](#5-cấu-hình-stripe)
6. [Test Toàn Bộ](#6-test-toàn-bộ)
7. [Xử Lý Lỗi](#7-xử-lý-lỗi)

---

## 1. Chuẩn Bị

### 1.1. Kiểm Tra Code

Mở Terminal và chạy:

```bash
cd /Users/macbook/Order_Frontend
git status
```

**Nếu có file chưa commit:**

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**Kiểm tra:**
- [ ] Code đã được push lên GitHub
- [ ] Repository có tên: `Order_Frontend` (hoặc tên của bạn)

### 1.2. Tạo Tài Khoản Render

1. Truy cập: https://render.com
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render để truy cập GitHub
5. Hoàn tất đăng ký

**Kiểm tra:**
- [ ] Đã đăng nhập vào Render Dashboard
- [ ] Thấy được repositories từ GitHub

### 1.3. Lấy Stripe Keys (Nếu Dùng Stripe)

1. Truy cập: https://dashboard.stripe.com/test/apikeys
2. Đăng nhập (hoặc tạo tài khoản)
3. Copy 2 keys:
   - **Publishable key**: `pk_test_...` (dùng cho Frontend)
   - **Secret key**: `sk_test_...` (dùng cho Backend)
4. **Lưu lại** 2 keys này

**Kiểm tra:**
- [ ] Đã có Publishable key (`pk_test_...`)
- [ ] Đã có Secret key (`sk_test_...`)

---

## 2. Deploy Backend

### Bước 2.1: Tạo Backend Service

1. Vào Render Dashboard: https://dashboard.render.com
2. Click nút **"New +"** (góc trên bên phải)
3. Chọn **"Web Service"**

### Bước 2.2: Connect Repository

1. Trong phần **"Connect a repository"**
2. Tìm và chọn repository **Order_Frontend** của bạn
3. Click **"Connect"**

**Kiểm tra:**
- [ ] Repository đã được connect
- [ ] Thấy code của bạn

### Bước 2.3: Cấu Hình Backend

Điền các thông tin sau **CHÍNH XÁC**:

#### Thông Tin Cơ Bản:

| Trường | Giá Trị Cần Điền |
|--------|------------------|
| **Name** | `foodorder-backend` (hoặc tên bạn muốn) |
| **Region** | `Singapore` (hoặc gần nhất) |
| **Branch** | `main` (hoặc branch chính của bạn) |
| **Root Directory** | `backend` ⚠️ **QUAN TRỌNG** |
| **Runtime** | `Node` (tự động detect) |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

⚠️ **LƯU Ý QUAN TRỌNG:**
- **Root Directory** PHẢI là `backend` (không có dấu `/` ở đầu hoặc cuối)
- **Build Command** chỉ cần `npm install` (không cần `cd backend`)
- **Start Command** chỉ cần `npm start` (không cần `cd backend`)

### Bước 2.4: Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**, click **"+ Add Environment Variable"** và thêm từng biến:

#### Biến 1: NODE_ENV
1. Click **"+ Add Environment Variable"**
2. **NAME**: `NODE_ENV`
3. **VALUE**: `production`
4. Click **"Add"**

#### Biến 2: PORT
1. Click **"+ Add Environment Variable"** lần nữa
2. **NAME**: `PORT`
3. **VALUE**: `10000`
4. Click **"Add"**

#### Biến 3: JWT_SECRET
1. Click **"+ Add Environment Variable"**
2. **NAME**: `JWT_SECRET`
3. **VALUE**: Click nút **"Generate"** (icon magic wand) để tạo tự động
   - Hoặc tự tạo: một chuỗi ngẫu nhiên dài (ít nhất 32 ký tự)
   - Ví dụ: `my-super-secret-jwt-key-2024-random-string-12345`
4. Click **"Add"**

#### Biến 4: FRONTEND_URL (Tạm thời)
1. Click **"+ Add Environment Variable"**
2. **NAME**: `FRONTEND_URL`
3. **VALUE**: `https://foodorder-frontend.onrender.com` (tạm thời, sẽ cập nhật sau)
4. Click **"Add"**

⚠️ **Lưu ý**: URL này sẽ được cập nhật sau khi deploy frontend xong.

#### Biến 5: STRIPE_SECRET_KEY (Nếu dùng Stripe)
1. Click **"+ Add Environment Variable"**
2. **NAME**: `STRIPE_SECRET_KEY`
3. **VALUE**: `sk_test_...` (Secret key bạn đã lấy từ Stripe)
4. Click **"Add"**

**Kiểm tra:**
- [ ] Đã thêm `NODE_ENV` = `production`
- [ ] Đã thêm `PORT` = `10000`
- [ ] Đã thêm `JWT_SECRET` (có giá trị)
- [ ] Đã thêm `FRONTEND_URL` (tạm thời)
- [ ] Đã thêm `STRIPE_SECRET_KEY` (nếu dùng Stripe)

### Bước 2.5: Deploy Backend

1. Scroll xuống cuối trang
2. Kiểm tra lại tất cả thông tin
3. Click nút **"Create Web Service"**
4. Render sẽ bắt đầu build và deploy

### Bước 2.6: Đợi Build Backend

- Thời gian: 2-5 phút
- Bạn có thể xem logs trong quá trình build
- Đợi đến khi thấy **"Your service is live"**

### Bước 2.7: Lấy URL Backend

Sau khi deploy xong:

1. Vào Backend Service
2. Ở đầu trang, bạn sẽ thấy URL backend
3. Copy URL này (ví dụ: `https://foodorder-backend-8xh6.onrender.com`)
4. **Lưu lại URL này** - bạn sẽ cần dùng cho frontend

### Bước 2.8: Test Backend

1. Mở trình duyệt
2. Truy cập: `https://your-backend-url.onrender.com/api/health`
3. Phải thấy response:
   ```json
   {
     "status": "ok",
     "message": "FoodOrder API is running"
   }
   ```

**Kiểm tra:**
- [ ] Backend đã deploy thành công
- [ ] Có URL backend (ví dụ: `https://foodorder-backend-8xh6.onrender.com`)
- [ ] Test `/api/health` trả về OK

---

## 3. Deploy Frontend

### Bước 3.1: Tạo Frontend Service

1. Vào Render Dashboard
2. Click nút **"New +"** (góc trên bên phải)
3. Chọn **"Static Site"**

### Bước 3.2: Connect Repository

1. Trong phần **"Connect a repository"**
2. Chọn **CÙNG repository** Order_Frontend (không cần tách repo)
3. Click **"Connect"**

**Kiểm tra:**
- [ ] Repository đã được connect
- [ ] Đây là cùng repo với backend

### Bước 3.3: Cấu Hình Frontend

Điền các thông tin sau **CHÍNH XÁC**:

| Trường | Giá Trị Cần Điền |
|--------|------------------|
| **Name** | `foodorder-frontend` (hoặc tên bạn muốn) |
| **Branch** | `main` (hoặc branch chính của bạn) |
| **Root Directory** | `frontend` ⚠️ **QUAN TRỌNG NHẤT** |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Plan** | `Free` |

⚠️ **LƯU Ý QUAN TRỌNG:**
- **Root Directory** PHẢI là `frontend` (không có dấu `/` ở đầu hoặc cuối)
- **Build Command** PHẢI là `npm install && npm run build`
- **Publish Directory** PHẢI là `dist` (không có dấu `/`)

### Bước 3.4: Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**, click **"+ Add Environment Variable"**:

#### Biến 1: VITE_API_URL (BẮT BUỘC)

1. Click **"+ Add Environment Variable"**
2. **NAME**: `VITE_API_URL`
3. **VALUE**: `https://your-backend-url.onrender.com/api`
   - Thay `your-backend-url` bằng URL backend thực tế của bạn
   - Ví dụ: `https://foodorder-backend-8xh6.onrender.com/api`
   - ⚠️ **QUAN TRỌNG**: Phải có `/api` ở cuối, không có dấu `/` cuối
4. Click **"Add"**

#### Biến 2: VITE_STRIPE_PUBLISHABLE_KEY (Nếu dùng Stripe)

1. Click **"+ Add Environment Variable"** lần nữa
2. **NAME**: `VITE_STRIPE_PUBLISHABLE_KEY`
3. **VALUE**: `pk_test_...` (Publishable key bạn đã lấy từ Stripe)
4. Click **"Add"**

**Kiểm tra:**
- [ ] Đã thêm `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
- [ ] URL có `/api` ở cuối
- [ ] Đã thêm `VITE_STRIPE_PUBLISHABLE_KEY` (nếu dùng Stripe)

### Bước 3.5: Deploy Frontend

1. Scroll xuống cuối trang
2. Kiểm tra lại tất cả thông tin
3. Click nút **"Create Static Site"**
4. Render sẽ bắt đầu build

### Bước 3.6: Đợi Build Frontend

- Thời gian: 2-5 phút
- Bạn có thể xem logs trong quá trình build
- Đợi đến khi thấy **"Your site is live"**

**Trong quá trình build, kiểm tra logs:**
- ✅ `npm install` chạy thành công
- ✅ `npm run build` chạy thành công
- ✅ Không có lỗi nào
- ✅ "Build completed successfully"

### Bước 3.7: Lấy URL Frontend

Sau khi deploy xong:

1. Vào Frontend Service
2. Ở đầu trang, bạn sẽ thấy URL frontend
3. Copy URL này (ví dụ: `https://foodorder-frontend-xxxx.onrender.com`)
4. **Lưu lại URL này** - bạn sẽ cần dùng cho backend

**Kiểm tra:**
- [ ] Frontend đã deploy thành công
- [ ] Có URL frontend (ví dụ: `https://foodorder-frontend-xxxx.onrender.com`)
- [ ] Truy cập URL frontend, trang load được

---

## 4. Cấu Hình QR Code

### Bước 4.1: Cập Nhật FRONTEND_URL Trong Backend

Sau khi có URL frontend:

1. Vào Render Dashboard
2. Vào **Backend Service** (`foodorder-backend-8xh6` hoặc tên của bạn)
3. Click tab **"Environment"** (ở menu trên)
4. Tìm biến `FRONTEND_URL`
5. Click nút **"Edit"** (hoặc icon bút chì) bên cạnh
6. Cập nhật **VALUE** = URL frontend của bạn
   - Ví dụ: `https://foodorder-frontend-xxxx.onrender.com`
   - ⚠️ **QUAN TRỌNG**: KHÔNG có dấu `/` ở cuối
7. Click **"Save Changes"**
8. Render sẽ tự động redeploy backend

### Bước 4.2: Đợi Backend Redeploy

- Thời gian: 1-2 phút
- Đợi đến khi backend redeploy xong

### Bước 4.3: Test QR Code

1. Truy cập URL frontend
2. Đăng nhập admin:
   - Email: `admin@foodorder.com`
   - Password: `admin123`
3. Vào **"Quản lý bàn"** (trong menu admin)
4. Xem QR code của mỗi bàn
5. Kiểm tra URL trong QR code:
   - Phải là: `https://your-frontend-url.onrender.com/home?table=X`
   - KHÔNG phải: `http://localhost:5173/home?table=X`

### Bước 4.4: Test Quét QR Code

1. Mở QR code trên màn hình
2. Dùng điện thoại quét QR code
3. Phải mở được trang home với `?table=X`
4. Table context phải được set đúng

**Kiểm tra:**
- [ ] QR code URL đúng (không phải localhost)
- [ ] Quét QR code bằng điện thoại hoạt động
- [ ] Trang home load với table context đúng

---

## 5. Cấu Hình Stripe

### Bước 5.1: Kiểm Tra Stripe Keys Đã Set

**Backend:**
1. Vào Backend Service → Environment
2. Kiểm tra có `STRIPE_SECRET_KEY` = `sk_test_...`
3. Nếu chưa có, thêm như Bước 2.4

**Frontend:**
1. Vào Frontend Service → Environment
2. Kiểm tra có `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
3. Nếu chưa có, thêm như Bước 3.4

### Bước 5.2: Redeploy (Nếu Cần)

**Nếu vừa thêm Stripe keys:**

**Backend:**
- Nếu vừa thêm `STRIPE_SECRET_KEY`, có thể cần manual redeploy:
  1. Vào Backend Service
  2. Click tab **"Manual Deploy"**
  3. Chọn branch `main`
  4. Click **"Deploy latest commit"**

**Frontend:**
- **Bắt buộc** redeploy sau khi thêm env vars:
  1. Vào Frontend Service
  2. Click tab **"Manual Deploy"**
  3. Chọn branch `main`
  4. Click **"Deploy latest commit"**

### Bước 5.3: Test Stripe Payment

1. Truy cập URL frontend
2. Đăng nhập (hoặc đăng ký) user
3. Thêm món vào giỏ hàng
4. Click **"Giỏ hàng"** → **"Thanh toán"**
5. Điền thông tin checkout
6. Chọn **"Thanh toán bằng thẻ"** (Stripe)
7. Điền thông tin thẻ test:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry date**: `12/25` (bất kỳ tháng/năm tương lai)
   - **CVC**: `123` (bất kỳ 3 số)
   - **ZIP code**: `12345` (bất kỳ 5 số)
8. Click **"Thanh toán"**
9. Phải redirect đến **Payment Success** page
10. Đơn hàng phải được tạo trong database

**Kiểm tra:**
- [ ] Stripe form hiển thị
- [ ] Thanh toán thành công
- [ ] Redirect đến Payment Success
- [ ] Đơn hàng được tạo

---

## 6. Test Toàn Bộ

### 6.1. Test Authentication

- [ ] Đăng ký user mới
- [ ] Đăng nhập user
- [ ] Đăng nhập admin (`admin@foodorder.com` / `admin123`)
- [ ] Logout

### 6.2. Test User Features

- [ ] Trang chủ load được
- [ ] Menu hiển thị (15 món)
- [ ] **Tất cả ảnh hiển thị đúng**
- [ ] Thêm món vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Cập nhật số lượng
- [ ] Xóa món
- [ ] Checkout
- [ ] Đặt hàng
- [ ] Xem lịch sử đơn hàng
- [ ] Xem profile

### 6.3. Test Admin Features

- [ ] Dashboard hiển thị
- [ ] Quản lý menu:
  - [ ] Thêm món mới
  - [ ] Sửa món
  - [ ] Xóa món
  - [ ] Upload ảnh món ăn
- [ ] Quản lý đơn hàng:
  - [ ] Xem danh sách đơn
  - [ ] Cập nhật trạng thái đơn
- [ ] Quản lý bàn:
  - [ ] Xem danh sách bàn
  - [ ] Thêm bàn mới
  - [ ] Sửa bàn
  - [ ] Xóa bàn
  - [ ] **QR code hiển thị**
  - [ ] **Quét QR code hoạt động**
- [ ] Quản lý user:
  - [ ] Xem danh sách user
  - [ ] Xóa user

### 6.4. Test QR Code

- [ ] QR code hiển thị trong admin
- [ ] URL trong QR code đúng (không phải localhost)
- [ ] **Quét QR code bằng điện thoại hoạt động**
- [ ] Trang home load với table context đúng

### 6.5. Test Payment

- [ ] Stripe form hiển thị
- [ ] **Thanh toán Stripe thành công**
- [ ] Payment Success page
- [ ] Đơn hàng được tạo

---

## 7. Xử Lý Lỗi

### 7.1. Backend Không Start

**Kiểm tra:**
1. Xem logs trong Backend Service → Logs
2. Kiểm tra environment variables đã đủ chưa
3. Kiểm tra Root Directory = `backend`

**Giải pháp:**
- Sửa lỗi theo logs
- Kiểm tra lại cấu hình
- Redeploy

### 7.2. Frontend Build Failed

**Kiểm tra:**
1. Xem logs trong Frontend Service → Logs
2. Kiểm tra Root Directory = `frontend`
3. Kiểm tra Build Command = `npm install && npm run build`

**Giải pháp:**
- Sửa lỗi theo logs
- Kiểm tra lại cấu hình
- Redeploy

### 7.3. QR Code Vẫn Trỏ Về Localhost

**Nguyên nhân:** `FRONTEND_URL` chưa được cập nhật hoặc backend chưa redeploy

**Giải pháp:**
1. Kiểm tra `FRONTEND_URL` trong backend = URL frontend chính xác
2. Manual redeploy backend
3. Refresh trang admin
4. Xem lại QR code

### 7.4. Stripe Không Hoạt Động

**Nguyên nhân:** Keys chưa được set hoặc không match

**Giải pháp:**
1. Kiểm tra `STRIPE_SECRET_KEY` trong backend
2. Kiểm tra `VITE_STRIPE_PUBLISHABLE_KEY` trong frontend
3. Đảm bảo cả 2 đều là test keys
4. Redeploy cả backend và frontend
5. Test lại

### 7.5. Images Không Hiển Thị

**Nguyên nhân:** Images chưa được copy vào build

**Giải pháp:**
1. Kiểm tra `frontend/public/images/` có đủ 15 ảnh
2. Vite tự động copy `public/` → `dist/`
3. Kiểm tra đường dẫn trong code: `/images/pho_bo.jpg`

### 7.6. API Không Kết Nối

**Nguyên nhân:** `VITE_API_URL` sai

**Giải pháp:**
1. Kiểm tra `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
2. Redeploy frontend

### 7.7. CORS Error

**Nguyên nhân:** `FRONTEND_URL` trong backend sai

**Giải pháp:**
1. Cập nhật `FRONTEND_URL` = URL frontend chính xác
2. Redeploy backend

---

## ✅ Checklist Cuối Cùng

### Trước Deploy:
- [ ] Code đã commit và push
- [ ] Có tài khoản Render
- [ ] Có Stripe keys (nếu dùng Stripe)

### Sau Deploy Backend:
- [ ] Backend deploy thành công
- [ ] Có URL backend
- [ ] Test `/api/health` OK
- [ ] Environment variables đầy đủ

### Sau Deploy Frontend:
- [ ] Frontend deploy thành công
- [ ] Có URL frontend
- [ ] Trang load được
- [ ] Environment variables đầy đủ

### Sau Cấu Hình:
- [ ] `FRONTEND_URL` trong backend = URL frontend chính xác
- [ ] QR code URL đúng (không phải localhost)
- [ ] QR code quét được
- [ ] Stripe keys đã set
- [ ] Stripe payment hoạt động
- [ ] Tất cả chức năng test pass

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành tất cả các bước, bạn sẽ có ứng dụng đầy đủ 100% chức năng!

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

💡 **Lưu ý quan trọng:**
1. Sau khi cập nhật `FRONTEND_URL` trong backend, phải redeploy backend
2. Sau khi thêm/sửa env vars trong frontend, phải redeploy frontend
3. QR code sẽ tự động dùng URL từ backend API
4. Stripe keys phải match (test với test, live với live)
