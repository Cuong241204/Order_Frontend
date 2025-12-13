# 📊 THÔNG TIN CÁC BẢNG TRONG DATABASE

## ✅ Tổng số bảng: **5 bảng**

### 1. Bảng do người dùng tạo (4 bảng):

#### 📋 **users** - Quản lý người dùng
- **Số bản ghi hiện tại:** 1
- **Cột:**
  - id (PRIMARY KEY)
  - name
  - email (UNIQUE)
  - password
  - role (DEFAULT 'user')
  - created_at

#### 📋 **menu_items** - Quản lý món ăn
- **Số bản ghi hiện tại:** 15
- **Cột:**
  - id (PRIMARY KEY)
  - name
  - description
  - price
  - category
  - image
  - created_at
  - updated_at

#### 📋 **tables** - Quản lý bàn
- **Số bản ghi hiện tại:** 5
- **Cột:**
  - id (PRIMARY KEY)
  - name
  - capacity (DEFAULT 4)
  - status (DEFAULT 'available')
  - qr_code_url
  - created_at
  - updated_at

#### 📋 **orders** - Quản lý đơn hàng
- **Số bản ghi hiện tại:** 9
- **Cột:**
  - id (PRIMARY KEY)
  - user_id (FK → users)
  - table_id (FK → tables)
  - customer_name
  - customer_email
  - customer_phone
  - table_number
  - number_of_guests
  - items (JSON)
  - total_price
  - status (DEFAULT 'pending')
  - payment_method
  - created_at
  - updated_at

### 2. Bảng hệ thống SQLite (1 bảng):

#### 📋 **sqlite_sequence** - Quản lý AUTOINCREMENT
- **Số bản ghi:** 4
- **Mục đích:** SQLite tự động tạo để quản lý AUTOINCREMENT cho các bảng

## 📝 Tóm tắt:
- **4 bảng chính** do người dùng tạo
- **1 bảng hệ thống** (sqlite_sequence)
- **Tổng cộng: 5 bảng**

## 🔗 Quan hệ giữa các bảng:
- `orders.user_id` → `users.id`
- `orders.table_id` → `tables.id`
