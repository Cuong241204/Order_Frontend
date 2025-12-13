# FoodOrder - Hệ Thống Đặt Món Ăn

Ứng dụng đặt món ăn trực tuyến với quản lý bàn, menu, đơn hàng và người dùng.

## 📁 Cấu Trúc Dự Án

```
Order_Frontend/
├── frontend/          # React Frontend Application
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
│
└── backend/          # Node.js Backend API
    ├── src/          # Source code
    ├── uploads/      # Uploaded images
    └── package.json  # Backend dependencies
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js >= 18.x
- npm hoặc yarn

### Bước 1: Cài Đặt Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### Bước 2: Chạy Ứng Dụng

**⚠️ QUAN TRỌNG: Phải chạy BACKEND TRƯỚC, sau đó mới chạy FRONTEND!**

**Lý do:**
- Backend cần khởi tạo database và API server
- Frontend cần kết nối với backend API (`http://localhost:3001/api`)
- Nếu frontend chạy trước mà backend chưa sẵn sàng → sẽ bị lỗi kết nối

#### Bước 1: Chạy Backend (Terminal 1) - **CHẠY TRƯỚC**
```bash
cd backend
npm run dev
```

**Đợi đến khi thấy:**
```
🚀 Server is running on http://localhost:3001
Database initialized successfully
```

#### Bước 2: Chạy Frontend (Terminal 2) - **CHẠY SAU**
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

### Hoặc sử dụng script:

#### Chạy Backend
```bash
cd backend
./start.sh
```

#### Chạy Frontend
```bash
cd frontend
./start-frontend.sh
```

## 🔧 Cấu Hình

### Backend
- Port mặc định: `3001`
- Database: SQLite (`database.sqlite`)
- Upload folder: `backend/uploads/images/`

### Frontend
- Port mặc định: `5173`
- API Base URL: `http://localhost:3001/api`

## 📝 Tài Khoản Mặc Định

Sau khi chạy backend lần đầu, tài khoản admin mặc định sẽ được tạo:

- **Email:** `admin@foodorder.com`
- **Password:** `admin123`

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- React 19
- React Router DOM
- Vite
- Lucide React (Icons)

### Backend
- Node.js + Express
- SQLite3
- JWT Authentication
- Multer (File Upload)
- bcryptjs (Password Hashing)

## 📚 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/menu` - Lấy danh sách món ăn
- `POST /api/menu` - Thêm món ăn (Admin)
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/tables` - Lấy danh sách bàn
- `POST /api/upload` - Upload ảnh

Xem chi tiết trong `backend/README.md`

## 🐛 Xử Lý Lỗi

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
- Đảm bảo backend đã chạy trước khi mở frontend
- Kiểm tra CORS settings trong backend
- Kiểm tra API URL trong `frontend/src/services/api.js`

## 📄 License

ISC
