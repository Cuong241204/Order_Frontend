# 🍜 FoodOrder - Hệ Thống Đặt Món Ăn Trực Tuyến

Hệ thống đặt món ăn trực tuyến với quản lý bàn, menu, đơn hàng và thanh toán tích hợp Stripe. Hỗ trợ cả khách hàng và quản trị viên với giao diện hiện đại và trải nghiệm người dùng tốt.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Dự Án](#-chạy-dự-án)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [Tài Khoản Mặc Định](#-tài-khoản-mặc-định)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Tính Năng

### 👥 Cho Khách Hàng
- ✅ Xem menu với phân loại món ăn
- ✅ Thêm món vào giỏ hàng
- ✅ Đặt hàng và thanh toán
- ✅ Thanh toán bằng Stripe (thẻ tín dụng/ghi nợ)
- ✅ Thanh toán tiền mặt
- ✅ Scan QR code để chọn bàn
- ✅ Xem lịch sử đơn hàng
- ✅ Quản lý profile

### 👨‍💼 Cho Quản Trị Viên
- ✅ Quản lý menu (thêm, sửa, xóa món ăn)
- ✅ Quản lý đơn hàng (xem, cập nhật trạng thái)
- ✅ Quản lý bàn (thêm, sửa, xóa, tạo QR code)
- ✅ Quản lý người dùng
- ✅ Dashboard với thống kê
- ✅ Upload ảnh cho món ăn

### 🔐 Bảo Mật
- ✅ JWT Authentication
- ✅ Role-based Access Control (Admin/User)
- ✅ Password hashing với bcryptjs
- ✅ Protected routes

### 💳 Thanh Toán
- ✅ Stripe Integration (thẻ tín dụng/ghi nợ)
- ✅ Mock payment cho testing
- ✅ Thanh toán tiền mặt
- ✅ Email xác nhận (tùy chọn)

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 19** - UI Framework
- **React Router DOM 7** - Routing
- **Vite 7** - Build tool
- **Lucide React** - Icons
- **@stripe/stripe-js** - Stripe integration
- **@stripe/react-stripe-js** - Stripe Elements

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Stripe** - Payment processing
- **Nodemailer** - Email (tùy chọn)

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js >= 18.x
- npm hoặc yarn
- Git

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd Order_Frontend
```

### Bước 2: Cài Đặt Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Cấu Hình

### Backend Configuration

Tạo file `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret Key (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Stripe Configuration (Optional - for Stripe payment)
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key

# Email Configuration (Optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Configuration

Tạo file `frontend/.env` hoặc `frontend/.env.local` (tùy chọn):

```env
# API Base URL
VITE_API_URL=http://localhost:3001/api

# Stripe Publishable Key (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
```

**Lưu ý:**
- Nếu không cấu hình Stripe, hệ thống sẽ dùng mock payment (luôn thành công) cho testing
- Email chỉ hoạt động nếu đã cấu hình đầy đủ

## 🚀 Chạy Dự Án

### ⚠️ QUAN TRỌNG: Phải chạy BACKEND TRƯỚC, sau đó mới chạy FRONTEND!

**Lý do:**
- Backend cần khởi tạo database và API server
- Frontend cần kết nối với backend API
- Nếu frontend chạy trước mà backend chưa sẵn sàng → sẽ bị lỗi kết nối

### Cách 1: Chạy Thủ Công

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

**Đợi đến khi thấy:**
```
Connected to SQLite database
Database initialized successfully
🚀 Server is running on http://localhost:3001
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

**Đợi đến khi thấy:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Sau đó mở trình duyệt:** `http://localhost:5173`

### Cách 2: Sử Dụng Scripts

#### Chạy Tất Cả (Backend + Frontend)
```bash
./start-all.sh
```

#### Chạy Riêng Lẻ

**Backend:**
```bash
cd backend
./start.sh
```

**Frontend:**
```bash
cd frontend
./start-frontend.sh
```

### Cách 3: Kiểm Tra Hệ Thống

```bash
# Kiểm tra hệ thống (dependencies, .env, database, etc.)
./check-system.sh

# Test API endpoints
./test-api.sh
```

## 📁 Cấu Trúc Dự Án

```
Order_Frontend/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # Database setup
│   │   │   ├── email.js       # Email configuration
│   │   │   ├── stripe.js      # Stripe configuration
│   │   │   └── vnpay.js        # VNPay configuration (deprecated)
│   │   ├── controllers/       # Business logic
│   │   │   ├── authController.js
│   │   │   ├── menuController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── tableController.js
│   │   │   └── userController.js
│   │   ├── middleware/        # Middleware
│   │   │   └── auth.js        # JWT authentication
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── menu.js
│   │   │   ├── orders.js
│   │   │   ├── payment.js
│   │   │   ├── tables.js
│   │   │   ├── upload.js
│   │   │   └── users.js
│   │   └── server.js          # Express server
│   ├── uploads/               # Uploaded images
│   │   └── images/
│   ├── database.sqlite        # SQLite database (auto-generated)
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/                   # Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdminHeader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/          # React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── TableContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MenuManagement.jsx
│   │   │   │   ├── OrderManagement.jsx
│   │   │   │   ├── TableManagement.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── RoleSelection.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static files
│   │   └── images/            # Menu item images
│   ├── .env                   # Environment variables (optional)
│   ├── package.json
│   └── vite.config.js
│
├── check-system.sh            # System check script
├── test-api.sh                # API test script
├── start-all.sh               # Start both servers
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Menu Items
- `GET /api/menu` - Lấy tất cả món ăn (có thể filter theo `?category=main`)
- `GET /api/menu/:id` - Lấy món ăn theo ID
- `POST /api/menu` - Tạo món ăn mới (Admin only)
- `PUT /api/menu/:id` - Cập nhật món ăn (Admin only)
- `DELETE /api/menu/:id` - Xóa món ăn (Admin only)

### Orders
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin only)
- `GET /api/orders/:id` - Lấy đơn hàng theo ID (Authenticated)
- `GET /api/orders/user/:userId` - Lấy đơn hàng của user (Authenticated)
- `POST /api/orders` - Tạo đơn hàng mới (Public)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin only)

### Tables
- `GET /api/tables` - Lấy tất cả bàn (Public)
- `GET /api/tables/:id` - Lấy bàn theo ID (Public)
- `POST /api/tables` - Tạo bàn mới (Admin only)
- `PUT /api/tables/:id` - Cập nhật bàn (Admin only)
- `DELETE /api/tables/:id` - Xóa bàn (Admin only)

### Users
- `GET /api/users` - Lấy tất cả users (Admin only)
- `GET /api/users/:id` - Lấy user theo ID (Admin only)
- `DELETE /api/users/:id` - Xóa user (Admin only)

### Payment
- `POST /api/payment/stripe/create-intent` - Tạo Stripe Payment Intent
- `POST /api/payment/stripe/confirm` - Xác nhận Stripe payment
- `POST /api/payment/card` - Mock card payment (fallback)

### Upload
- `POST /api/upload/image` - Upload ảnh (Admin only, multipart/form-data)

### Health Check
- `GET /api/health` - Health check

## 👤 Tài Khoản Mặc Định

Sau khi chạy backend lần đầu, tài khoản admin mặc định sẽ được tạo tự động:

- **Email:** `admin@foodorder.com`
- **Password:** `admin123`
- **Role:** `admin`

**⚠️ Lưu ý:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên trong môi trường production!

## 📖 Hướng Dẫn Sử Dụng

### Cho Khách Hàng

1. **Truy cập ứng dụng:**
   - Mở `http://localhost:5173`
   - Chọn "Tôi là khách hàng"

2. **Scan QR Code (Tùy chọn):**
   - Scan QR code trên bàn
   - Hoặc nhập số bàn khi checkout

3. **Đặt món:**
   - Vào `/menu` để xem menu
   - Thêm món vào giỏ hàng
   - Vào `/cart` để xem giỏ hàng
   - Click "Thanh Toán"

4. **Thanh toán:**
   - Điền thông tin giao hàng
   - Chọn phương thức thanh toán:
     - **Stripe:** Nhập thông tin thẻ
     - **Tiền mặt:** Thanh toán khi nhận hàng
   - Click "Đặt Hàng"

5. **Xem đơn hàng:**
   - Vào `/order-history` để xem lịch sử đơn hàng

### Cho Quản Trị Viên

1. **Đăng nhập:**
   - Mở `http://localhost:5173`
   - Chọn "Tôi là quản trị viên"
   - Đăng nhập với: `admin@foodorder.com` / `admin123`

2. **Quản lý Menu:**
   - Vào `/admin/menu`
   - Thêm, sửa, xóa món ăn
   - Upload ảnh cho món ăn

3. **Quản lý Đơn Hàng:**
   - Vào `/admin/orders`
   - Xem tất cả đơn hàng
   - Cập nhật trạng thái đơn hàng

4. **Quản lý Bàn:**
   - Vào `/admin/tables`
   - Thêm, sửa, xóa bàn
   - Tạo và download QR code cho mỗi bàn

5. **Quản lý Người Dùng:**
   - Vào `/admin/users`
   - Xem danh sách người dùng
   - Xóa người dùng (nếu cần)

## 🔧 Troubleshooting

### Port đã được sử dụng

**Backend (port 3001):**
```bash
cd backend
npm run kill
# hoặc
lsof -ti:3001 | xargs kill -9
```

**Frontend (port 5173):**
```bash
lsof -ti:5173 | xargs kill -9
```

### Lỗi kết nối API

**Triệu chứng:** "Không thể kết nối đến server"

**Kiểm tra:**
1. Backend có đang chạy không?
   ```bash
   curl http://localhost:3001/api/health
   ```

2. CORS settings trong backend
   - Kiểm tra `FRONTEND_URL` trong `backend/.env`

3. API URL trong frontend
   - Kiểm tra `VITE_API_URL` trong `frontend/.env`

### Database không tạo

**Triệu chứng:** Lỗi database khi chạy backend

**Sửa:**
```bash
cd backend
# Xóa database cũ (nếu có)
rm database.sqlite
# Chạy lại backend
npm run dev
```

### Stripe không hoạt động

**Triệu chứng:** Thanh toán thất bại

**Kiểm tra:**
1. Stripe keys đã cấu hình chưa?
   - `STRIPE_SECRET_KEY` trong `backend/.env`
   - `VITE_STRIPE_PUBLISHABLE_KEY` trong `frontend/.env`

2. Nếu chưa cấu hình:
   - Hệ thống sẽ dùng mock payment (luôn thành công)
   - Đây là bình thường cho testing

### QR Code không hoạt động

**Triệu chứng:** Scan QR code không load table

**Kiểm tra:**
1. QR code URL có đúng format không?
   - Phải có format: `http://localhost:5173/home?table={id}`

2. Backend có trả về table không?
   ```bash
   curl http://localhost:3001/api/tables/1
   ```

3. Console có lỗi không?
   - Mở Developer Tools (F12) → Console

## 📚 Tài Liệu Tham Khảo

- [Backend README](./backend/README.md) - Chi tiết về backend API
- [Stripe Integration](./STRIPE_INTEGRATION.md) - Hướng dẫn tích hợp Stripe
- [QR Code Fix](./QR_CODE_FIX.md) - Hướng dẫn sử dụng QR code
- [Image Fix](./IMAGE_FIX.md) - Hướng dẫn xử lý ảnh
- [Backend Fixes](./BACKEND_FIXES.md) - Các lỗi backend đã sửa

## 🧪 Testing

### Test API
```bash
./test-api.sh
```

### Test System
```bash
./check-system.sh
```

### Test Stripe (với test cards)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Expiry:** Bất kỳ ngày trong tương lai (ví dụ: `12/25`)
- **CVC:** Bất kỳ 3 chữ số (ví dụ: `123`)

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` trong `.env`
2. Đổi `JWT_SECRET` thành key mạnh
3. Cấu hình Stripe keys (live keys)
4. Cấu hình email (nếu cần)
5. Chạy: `npm start`

### Frontend
1. Build: `npm run build`
2. Serve với nginx hoặc server tĩnh
3. Cấu hình `VITE_API_URL` trỏ đến backend production

## 📄 License

ISC

## 👥 Contributors

- Developer: [Your Name]

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem các file hướng dẫn trong thư mục gốc
3. Kiểm tra Console (F12) và Network tab
4. Kiểm tra backend logs

---

**Made with ❤️ for FoodOrder System**
