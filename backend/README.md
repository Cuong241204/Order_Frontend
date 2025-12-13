# FoodOrder Backend API

Backend API cho ứng dụng FoodOrder - Hệ thống đặt món nhà hàng.

## Cài đặt

1. Cài đặt dependencies:
```bash
cd backend
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật các biến môi trường trong `.env`:
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Chạy server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Menu Items
- `GET /api/menu` - Lấy tất cả món ăn (có thể filter theo category)
- `GET /api/menu/:id` - Lấy món ăn theo ID
- `POST /api/menu` - Tạo món ăn mới (Admin only)
- `PUT /api/menu/:id` - Cập nhật món ăn (Admin only)
- `DELETE /api/menu/:id` - Xóa món ăn (Admin only)

### Orders
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin only)
- `GET /api/orders/:id` - Lấy đơn hàng theo ID
- `GET /api/orders/user/:userId` - Lấy đơn hàng của user
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin only)

### Tables
- `GET /api/tables` - Lấy tất cả bàn
- `GET /api/tables/:id` - Lấy bàn theo ID
- `POST /api/tables` - Tạo bàn mới (Admin only)
- `PUT /api/tables/:id` - Cập nhật bàn (Admin only)
- `DELETE /api/tables/:id` - Xóa bàn (Admin only)

### Users
- `GET /api/users` - Lấy tất cả users (Admin only)
- `GET /api/users/:id` - Lấy user theo ID (Admin only)
- `DELETE /api/users/:id` - Xóa user (Admin only)

### Upload
- `POST /api/upload/image` - Upload ảnh (Admin only, multipart/form-data)

## Authentication

Sử dụng JWT token. Gửi token trong header:
```
Authorization: Bearer <token>
```

## Database

Sử dụng SQLite. Database file sẽ được tạo tự động tại `backend/database.sqlite`.

Default admin account:
- Email: `admin@foodorder.com`
- Password: `admin123`

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/          # Business logic
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/               # API routes
│   ├── uploads/              # Uploaded files
│   └── server.js             # Express server
├── package.json
└── README.md
```



