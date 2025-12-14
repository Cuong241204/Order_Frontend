# ⚡ Hướng Dẫn Deploy Nhanh - Render

Hướng dẫn deploy nhanh nhất lên Render (miễn phí).

## 🚀 5 Bước Deploy

### 1️⃣ Push code lên GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2️⃣ Tạo tài khoản Render
- Truy cập: https://render.com
- Đăng nhập bằng GitHub

### 3️⃣ Deploy Backend
1. Click "New +" → "Web Service"
2. Connect repository của bạn
3. Cấu hình:
   - **Name**: `foodorder-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Thêm Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<tạo random string>
   FRONTEND_URL=https://your-frontend.onrender.com (sẽ cập nhật sau)
   ```

5. Click "Create Web Service"

### 4️⃣ Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect cùng repository
3. Cấu hình:
   - **Name**: `foodorder-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: `Free`

4. Thêm Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (nếu có)
   ```

5. Click "Create Static Site"

### 5️⃣ Cập nhật URLs
1. Lấy URL backend (ví dụ: `https://foodorder-backend.onrender.com`)
2. Lấy URL frontend (ví dụ: `https://foodorder-frontend.onrender.com`)
3. Vào Backend Service → Environment:
   - Cập nhật `FRONTEND_URL` = URL frontend
4. Vào Frontend Service → Environment:
   - Cập nhật `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Manual Deploy lại cả hai services

## ✅ Xong!

Truy cập URL frontend để sử dụng ứng dụng.

**Tài khoản admin mặc định:**
- Email: `admin@foodorder.com`
- Password: `admin123`

## ⚠️ Lưu ý

- Services sẽ sleep sau 15 phút không dùng
- Lần đầu wake up mất ~30 giây
- SQLite data sẽ mất khi restart (free tier)
- Upload files sẽ mất khi restart

## 🔧 Nếu cần thêm cấu hình

Xem file [DEPLOY.md](./DEPLOY.md) để biết chi tiết và các options khác.
