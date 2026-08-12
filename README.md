# LongStore – Node.js + MySQL

Dự án gồm 2 phần:
- **Backend**: Node.js (Express) + MySQL, cung cấp API sản phẩm/danh mục/đơn hàng.
- **Frontend**: chính là `index.html`, `cart.html`, `css/style.css` gốc của bạn (đặt trong `public/`), đã sửa `js/script.js` và `js/cart.js` để gọi API thay vì dữ liệu cứng.

Server Express phục vụ luôn cả frontend, nên bạn chỉ cần chạy **một lệnh duy nhất** và mở `http://localhost:3000`.

---

## 1. Cài MySQL và tạo database

### Nếu dùng XAMPP / phpMyAdmin (dễ nhất)
1. Mở phpMyAdmin (`http://localhost/phpmyadmin`).
2. Tạo database tên `longstore` (Collation: `utf8mb4_general_ci`).
3. Chọn database `longstore` → tab **Import** → chọn file `longstore.sql` (nằm trong thư mục dự án) → Go.
4. Kiểm tra: database `longstore` phải có 4 bảng `categories`, `orders`, `order_items`, `products`, đã có sẵn dữ liệu mẫu.

### Nếu dùng MySQL command line
```bash
mysql -u root -p -e "CREATE DATABASE longstore CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -u root -p longstore < longstore.sql
```

---

## 2. Cài Node.js

Tải và cài Node.js LTS tại https://nodejs.org (khuyến nghị bản 18 trở lên). Kiểm tra:
```bash
node -v
npm -v
```

---

## 3. Cấu hình kết nối database

1. Trong thư mục dự án, sao chép `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
2. Mở `.env` và điền đúng thông tin MySQL của bạn:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=       # để trống nếu XAMPP mặc định không có mật khẩu
   DB_NAME=longstore
   DB_PORT=3306
   PORT=3000
   ```

---

## 3b. Thêm sản phẩm mới + thông số kỹ thuật (bắt buộc để dùng tính năng mới)

Sau khi đã import `longstore.sql` như bước 1, import thêm file **`update_products.sql`** (cùng cách: phpMyAdmin → chọn database `longstore` → tab **Import** → chọn `update_products.sql` → Go).

File này sẽ:
- Thêm danh mục **"Phụ kiện"** đang bị thiếu trong database gốc.
- Tạo bảng **`product_specs`** để lưu thông số kỹ thuật từng sản phẩm.
- Thêm 9 sản phẩm mới (tổng cộng 15 sản phẩm, đủ cả 5 danh mục).
- Thêm thông số kỹ thuật cho toàn bộ 15 sản phẩm.

Nếu bỏ qua bước này, web vẫn chạy bình thường nhưng trang chi tiết sản phẩm sẽ hiện "Đang cập nhật thông số kỹ thuật" và chỉ có 6 sản phẩm cũ.

---

## 4. Cài thư viện & chạy server

```bash
npm install
npm start
```

Nếu thấy dòng:
```
✅ Server đang chạy tại http://localhost:3000
```
nghĩa là thành công. Mở trình duyệt vào `http://localhost:3000` để xem web — sản phẩm giờ được lấy trực tiếp từ MySQL.

Trong lúc phát triển, có thể dùng `npm run dev` (cần cài `nodemon`) để server tự khởi động lại mỗi khi bạn sửa code.

---

## 5. Cấu trúc thư mục

```
longstore-backend/
├── server.js              # File khởi động server, gộp API + frontend tĩnh
├── db.js                  # Kết nối pool MySQL
├── routes/
│   ├── products.js        # GET /api/products, /api/products/:id
│   ├── categories.js      # GET /api/categories
│   └── orders.js          # POST /api/orders, GET /api/orders/:id
├── public/                # Toàn bộ frontend (được serve trực tiếp)
│   ├── index.html
│   ├── cart.html
│   ├── product.html       # Trang chi tiết sản phẩm (thông số kỹ thuật, chọn số lượng)
│   ├── css/style.css
│   └── js/
│       ├── script.js      # Đã sửa: fetch("/api/products"), click sản phẩm -> product.html
│       ├── product.js     # Mới: hiển thị chi tiết, chọn số lượng, thêm giỏ / mua ngay
│       └── cart.js        # Đã sửa: checkout() đọc form + gọi POST /api/orders
├── longstore.sql          # File để import vào MySQL (bước 1, dữ liệu gốc)
├── update_products.sql    # File import thêm (bước 3b): sản phẩm mới + thông số kỹ thuật
├── package.json
└── .env.example
```

---

## 6. Các API đã tạo

| Method | Endpoint            | Mô tả                                                        |
|--------|----------------------|---------------------------------------------------------------|
| GET    | `/api/products`      | Danh sách toàn bộ sản phẩm (join sẵn tên danh mục, tính % sale) |
| GET    | `/api/products/:id`  | Chi tiết 1 sản phẩm                                            |
| GET    | `/api/categories`    | Danh sách danh mục                                             |
| POST   | `/api/orders`        | Tạo đơn hàng mới (body: `full_name, phone, address, items[]`)  |
| GET    | `/api/orders/:id`    | Xem chi tiết 1 đơn hàng đã tạo                                 |

Ví dụ body khi gọi `POST /api/orders`:
```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0900000000",
  "address": "123 Đường ABC, Hà Nội",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 6, "quantity": 1 }
  ]
}
```

Backend sẽ tự lấy giá thật từ bảng `products` trong MySQL (không tin giá từ client gửi lên), kiểm tra tồn kho `stock`, rồi lưu 1 dòng vào `orders` và các dòng tương ứng vào `order_items`, đồng thời trừ `stock`. Toàn bộ nằm trong 1 transaction — nếu có lỗi ở bất kỳ bước nào, mọi thay đổi sẽ được rollback (không lưu dở dang).

---

## 7. Những thay đổi so với bản gốc

- `script.js`: bỏ mảng `products` cứng, thay bằng `let products = []` và hàm `initProducts()` gọi `fetch("/api/products")` khi trang tải xong. Nút "Thêm vào giỏ" giờ dùng `product.id` (số) thay vì `product.name` (chuỗi), tránh trùng tên gây lỗi.
- `cart.js`: hàm `checkout()` giờ là `async`, hỏi tên/SĐT/địa chỉ bằng `prompt()`, gửi `POST /api/orders`, rồi xóa giỏ hàng nếu thành công. Có thể thay `prompt()` bằng 1 form HTML thật (input tên/SĐT/địa chỉ trên `cart.html`) nếu bạn muốn giao diện đẹp hơn — mình có thể làm tiếp phần đó nếu cần.
- Giỏ hàng (`cart`) vẫn lưu tạm ở `localStorage` như cũ (không cần đăng nhập), chỉ khi bấm "Thanh toán" mới ghi thật vào MySQL.

---

## 8. Tính năng mới: trang chi tiết sản phẩm & giỏ hàng hoàn thiện hơn

**Trang chi tiết sản phẩm** (`product.html?id=X`):
- Click vào bất kỳ sản phẩm nào ở trang chủ sẽ mở trang chi tiết (nút "Thêm vào giỏ" trên card vẫn hoạt động riêng, không bị điều hướng theo).
- Hiển thị đầy đủ: ảnh lớn, giá/giá cũ/% giảm, đánh giá, mô tả, số lượng tồn kho, bảng **thông số kỹ thuật** (lấy từ bảng `product_specs`).
- Bộ chọn số lượng (+/−), giới hạn theo tồn kho thật trong database.
- 2 nút: **"Thêm vào giỏ"** (thêm rồi ở lại trang) và **"Mua ngay"** (thêm rồi chuyển thẳng sang giỏ hàng).

**Giỏ hàng hoàn thiện hơn**:
- Form nhập **họ tên / số điện thoại / địa chỉ** ngay trên trang giỏ hàng, thay cho các hộp thoại `prompt()` cũ.
- Kiểm tra dữ liệu nhập trước khi gửi đơn hàng (báo lỗi và focus vào ô còn thiếu).
- Sau khi đặt hàng thành công, tự xóa giỏ hàng và form để sẵn sàng cho lượt mua tiếp theo.
- Vẫn giữ nguyên cơ chế backend: giá được lấy lại từ MySQL, kiểm tra tồn kho, lưu `orders` + `order_items` trong 1 transaction.

---

## 9. Gợi ý mở rộng tiếp theo

- Thêm trang quản trị (admin) để xem/duyệt đơn hàng trong bảng `orders`.
- Thêm đăng nhập/đăng ký khách hàng (bảng `users`), gắn `user_id` vào `orders`.
- Thay `prompt()` ở bước thanh toán bằng form nhập liệu tử tế trên `cart.html`.
- Thêm phân trang / lọc sản phẩm trực tiếp bằng SQL (`LIMIT`, `WHERE`) thay vì lọc toàn bộ ở frontend, khi số lượng sản phẩm lớn.

Nếu bạn muốn mình làm tiếp phần nào ở trên (đặc biệt là form thanh toán đẹp hơn hoặc trang admin xem đơn hàng), cứ nói mình làm tiếp.
