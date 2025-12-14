# 🔄 Hướng Dẫn Redeploy Frontend - Chi Tiết Từng Bước

## 🎯 Mục Đích

Redeploy frontend để áp dụng code mới (trang Home với đầy đủ chức năng user).

---

## 📋 BƯỚC 1: Vào Render Dashboard

1. Mở trình duyệt
2. Truy cập: **https://dashboard.render.com**
3. Đăng nhập (nếu chưa)

**Kiểm tra:**
- [ ] Đã đăng nhập vào Render Dashboard
- [ ] Thấy danh sách services của bạn

---

## 📋 BƯỚC 2: Tìm Frontend Service

1. Trong Dashboard, tìm service có tên:
   - `foodorder-frontend` (hoặc tên bạn đã đặt)
   - Loại: **Static Site**

2. Click vào service đó

**Kiểm tra:**
- [ ] Đã vào được Frontend Service
- [ ] Thấy các tab: Overview, Logs, Settings, Manual Deploy

---

## 📋 BƯỚC 3: Vào Tab Manual Deploy

1. Ở menu trên, click tab **"Manual Deploy"**
   - Tab này thường ở bên phải, sau tab "Settings"

**Kiểm tra:**
- [ ] Đã vào tab "Manual Deploy"
- [ ] Thấy phần "Deploy from branch"

---

## 📋 BƯỚC 4: Chọn Branch và Deploy

1. Trong phần **"Deploy from branch"**:
   - Chọn branch: **`main`** (hoặc branch chính của bạn)
   - Đảm bảo chọn đúng branch `main`

2. Click nút **"Deploy latest commit"**
   - Nút này thường màu xanh hoặc tím
   - Có thể có text: "Deploy" hoặc "Deploy latest commit"

**Kiểm tra:**
- [ ] Đã chọn branch `main`
- [ ] Đã click "Deploy latest commit"

---

## 📋 BƯỚC 5: Đợi Build

Sau khi click deploy:

1. Bạn sẽ thấy trạng thái build:
   - **"Building..."** - Đang build
   - **"Deploying..."** - Đang deploy
   - **"Live"** - Đã xong

2. Thời gian: **2-5 phút**

3. Có thể xem logs trong tab **"Logs"**:
   - Click tab "Logs" để xem quá trình build
   - Kiểm tra có lỗi không

**Kiểm tra:**
- [ ] Build đang chạy
- [ ] Không có lỗi trong logs
- [ ] Trạng thái chuyển sang "Live"

---

## 📋 BƯỚC 6: Kiểm Tra Sau Khi Deploy

Sau khi deploy xong:

1. Truy cập URL frontend của bạn
2. Test các chức năng:
   - [ ] Trang Home load được
   - [ ] Menu items hiển thị (từ API)
   - [ ] Nút "Thêm vào giỏ" hoạt động
   - [ ] QR code quét được và có đầy đủ chức năng

---

## 🐛 Nếu Gặp Lỗi

### Lỗi: Build Failed

**Kiểm tra:**
1. Xem tab "Logs" để biết lỗi cụ thể
2. Thường gặp:
   - Dependencies không install được
   - Build command sai
   - Environment variables thiếu

**Giải pháp:**
- Xem logs để biết lỗi cụ thể
- Kiểm tra lại cấu hình trong Settings
- Thử deploy lại

### Lỗi: Deploy Timeout

**Giải pháp:**
- Đợi thêm 1-2 phút
- Nếu vẫn timeout, cancel và deploy lại

### Lỗi: Không Thấy Tab "Manual Deploy"

**Giải pháp:**
- Kiểm tra bạn đang ở đúng Frontend Service (Static Site)
- Refresh trang
- Thử cách khác: Vào Settings → Scroll xuống → Tìm nút "Clear build cache" → Clear → Deploy lại

---

## ✅ Checklist Redeploy

### Trước Khi Redeploy:
- [ ] Code đã được commit và push lên GitHub
- [ ] Đã vào Render Dashboard
- [ ] Đã tìm được Frontend Service

### Khi Redeploy:
- [ ] Đã vào tab "Manual Deploy"
- [ ] Đã chọn branch `main`
- [ ] Đã click "Deploy latest commit"
- [ ] Build đang chạy

### Sau Khi Redeploy:
- [ ] Build thành công (status: "Live")
- [ ] Không có lỗi trong logs
- [ ] Test trang Home hoạt động đúng
- [ ] QR code có đầy đủ chức năng

---

## 🎯 Tóm Tắt Nhanh

1. **Vào Render Dashboard** → https://dashboard.render.com
2. **Click Frontend Service** (foodorder-frontend)
3. **Tab "Manual Deploy"**
4. **Chọn branch `main`**
5. **Click "Deploy latest commit"**
6. **Đợi 2-5 phút**
7. **Test lại trang web**

---

## 💡 Mẹo

- Có thể xem logs trong tab "Logs" để theo dõi quá trình build
- Nếu build lâu, đợi thêm (có thể mất đến 5 phút)
- Sau khi deploy xong, clear cache browser (Ctrl+Shift+R) để thấy thay đổi mới

---

**Lưu ý:** Chỉ cần redeploy Frontend, không cần redeploy Backend vì Backend không thay đổi.
