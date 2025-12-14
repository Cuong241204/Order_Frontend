# 🚀 Hướng Dẫn Deploy Miễn Phí

Hướng dẫn deploy dự án FoodOrder lên các nền tảng miễn phí.

## 📋 Tổng Quan

Dự án này có thể deploy miễn phí trên:
- **Render** (Khuyến nghị) - Hỗ trợ cả backend và frontend
- **Vercel** - Frontend + Serverless Functions
- **Railway** - Full-stack với persistent storage

## 🎯 Option 1: Deploy trên Render (Khuyến nghị)

### Bước 1: Chuẩn bị Repository
1. Đẩy code lên GitHub/GitLab/Bitbucket
2. Đảm bảo có file `render.yaml` trong root project

### Bước 2: Tạo tài khoản Render
1. Truy cập: https://render.com
2. Đăng ký/Đăng nhập bằng GitHub
3. Chọn "New +" → "Blueprint"

### Bước 3: Deploy Backend
1. Chọn repository của bạn
2. Render sẽ tự động detect file `render.yaml`
3. Hoặc tạo Web Service thủ công:
   - **Name**: `foodorder-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

### Bước 4: Cấu hình Environment Variables cho Backend
Trong Render Dashboard → Environment:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.onrender.com
JWT_SECRET=<tạo secret key ngẫu nhiên>
STRIPE_SECRET_KEY=sk_test_...
VNPAY_TMN_CODE=...
VNPAY_SECRET_KEY=...
VNPAY_RETURN_URL=https://your-backend-url.onrender.com/api/payment/vnpay/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Bước 5: Deploy Frontend
1. Tạo Web Service mới:
   - **Name**: `foodorder-frontend`
   - **Environment**: `Static Site`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: `Free`

### Bước 6: Cấu hình Environment Variables cho Frontend
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Bước 7: Cập nhật URLs
1. Lấy URL backend từ Render (ví dụ: `https://foodorder-backend.onrender.com`)
2. Cập nhật `FRONTEND_URL` trong backend với URL frontend
3. Cập nhật `VITE_API_URL` trong frontend với URL backend
4. Redeploy cả hai services

### ⚠️ Lưu ý Render Free Tier:
- Services sẽ sleep sau 15 phút không hoạt động
- Lần đầu truy cập sau khi sleep sẽ mất ~30 giây để wake up
- SQLite database sẽ mất dữ liệu khi service restart (không persistent)
- Uploads folder sẽ mất khi service restart

---

## 🎯 Option 2: Deploy trên Vercel

### Frontend trên Vercel
1. Truy cập: https://vercel.com
2. Import project từ GitHub
3. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Backend trên Vercel (Serverless Functions)
Vercel hỗ trợ serverless functions, nhưng cần refactor code. Khuyến nghị dùng Render cho backend.

---

## 🎯 Option 3: Deploy trên Railway

### Bước 1: Tạo tài khoản
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub

### Bước 2: Deploy Backend
1. "New Project" → "Deploy from GitHub repo"
2. Chọn repository
3. Railway sẽ auto-detect Node.js
4. Cấu hình:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

### Bước 3: Deploy Frontend
1. Thêm service mới trong cùng project
2. **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s dist -l 3000`

### Bước 4: Cấu hình Environment Variables
Tương tự như Render, cấu hình các biến môi trường cần thiết.

### ⚠️ Lưu ý Railway Free Tier:
- Có $5 credit miễn phí mỗi tháng
- Sau khi hết credit sẽ cần upgrade
- Database có thể dùng Railway Postgres (free tier)

---

## 🔧 Cấu Hình Bổ Sung

### 1. Database Persistent (Render)
Render free tier không hỗ trợ persistent disk. Có thể:
- Dùng PostgreSQL trên Render (có free tier)
- Hoặc dùng Supabase/PlanetScale (free tier)
- Hoặc chấp nhận mất dữ liệu khi restart

### 2. File Uploads
Trên Render free tier, uploads sẽ mất khi restart. Giải pháp:
- Dùng Cloudinary (free tier)
- Dùng AWS S3
- Dùng Cloudflare R2 (free tier)

### 3. CORS Configuration
Đảm bảo `FRONTEND_URL` trong backend trỏ đúng URL frontend đã deploy.

---

## 📝 Checklist Trước Khi Deploy

- [ ] Code đã được push lên Git repository
- [ ] Đã test local và mọi thứ hoạt động
- [ ] Đã cấu hình tất cả environment variables
- [ ] Đã cập nhật URLs trong environment variables
- [ ] Đã test API endpoints sau khi deploy
- [ ] Đã test thanh toán (nếu có)
- [ ] Đã kiểm tra upload files (nếu có)

---

## 🐛 Troubleshooting

### Backend không start
- Kiểm tra logs trong Render Dashboard
- Đảm bảo PORT được set đúng (Render dùng PORT từ env)
- Kiểm tra database initialization

### Frontend không kết nối được backend
- Kiểm tra CORS settings
- Đảm bảo `VITE_API_URL` đúng
- Kiểm tra backend đã deploy thành công

### Database mất dữ liệu
- Đây là hạn chế của SQLite trên free tier
- Cân nhắc migrate sang PostgreSQL

### Upload files không hoạt động
- Files sẽ mất khi service restart trên free tier
- Cân nhắc dùng Cloudinary hoặc S3

---

## 🔗 Links Hữu Ích

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Cloudinary (Free): https://cloudinary.com
- Supabase (Free DB): https://supabase.com

---

**Lưu ý:** Free tier có giới hạn. Để production thực sự, nên cân nhắc upgrade plan hoặc dùng các dịch vụ có free tier tốt hơn.
