-- =========================================================
-- SCRIPT BỔ SUNG DỮ LIỆU CHO LONGSTORE
-- Chạy file này SAU KHI đã import longstore.sql gốc.
-- Cách chạy: phpMyAdmin -> chọn database "longstore" -> tab SQL -> dán nội dung -> Go
-- =========================================================

-- 1) Thêm danh mục "Phụ kiện" (đang thiếu trong DB dù frontend có sẵn menu này)
INSERT INTO `categories` (`id`, `code`, `name`)
SELECT 5, 'accessory', 'Phụ kiện'
WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `code` = 'accessory');


-- 2) Tạo bảng thông số kỹ thuật cho từng sản phẩm
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `value` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_specs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 3) Thêm sản phẩm mới (id 7 -> 15), phủ đủ các danh mục kể cả "Phụ kiện"
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `old_price`, `rating`, `image`, `stock`, `created_at`) VALUES
(7, 1, 'iPhone 16', 'iPhone 16 với chip A18 mới, camera nâng cấp, màn hình Super Retina XDR sáng hơn, thời lượng pin cải thiện đáng kể so với thế hệ trước.', 23990000, 26000000, 4.9, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(8, 1, 'Xiaomi 14', 'Xiaomi 14 trang bị chip Snapdragon 8 Gen 3, camera Leica, sạc nhanh 90W, thiết kế nhỏ gọn cầm nắm thoải mái.', 14990000, 17000000, 4.6, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(9, 1, 'OPPO Reno 12', 'OPPO Reno 12 nổi bật với camera chân dung AI, thiết kế mỏng nhẹ, màn hình AMOLED cong tràn viền.', 10990000, 12000000, 4.5, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(10, 2, 'MacBook Air M2', 'MacBook Air M2 mỏng nhẹ, hiệu năng mạnh mẽ nhờ chip Apple M2, thời lượng pin lên đến 18 giờ, màn hình Liquid Retina sắc nét.', 22990000, 26000000, 4.9, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(11, 2, 'Lenovo IdeaPad 5', 'Lenovo IdeaPad 5 cân bằng giữa hiệu năng và giá thành, phù hợp học tập và làm việc văn phòng, bàn phím gõ êm.', 14990000, 18000000, 4.5, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(12, 3, 'Samsung Galaxy Tab S9', 'Galaxy Tab S9 đi kèm bút S Pen, màn hình Dynamic AMOLED 2X, kháng nước IP68, phù hợp làm việc và giải trí đa nhiệm.', 16990000, 20000000, 4.7, 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?auto=format&fit=crop&w=500&q=80', 100, NOW()),
(13, 5, 'Tai nghe Bluetooth', 'Tai nghe Bluetooth chống ồn chủ động, thời lượng pin 30 giờ kể cả hộp sạc, kết nối đa điểm tiện lợi.', 1490000, 2000000, 4.6, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80', 150, NOW()),
(14, 5, 'Chuột không dây', 'Chuột không dây thiết kế công thái học, kết nối Bluetooth kép, pin dùng liên tục lên đến 6 tháng.', 399000, 450000, 4.6, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=500&q=80', 200, NOW()),
(15, 4, 'Samsung Galaxy Watch 6', 'Galaxy Watch 6 theo dõi sức khỏe toàn diện, đo giấc ngủ, nhịp tim, chỉ số cơ thể, mặt kính Sapphire chống trầy.', 5990000, 7000000, 4.7, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80', 100, NOW());


-- 4) Thông số kỹ thuật cho TẤT CẢ sản phẩm (id 1 -> 15)

-- iPhone 15 (id 1)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(1, 'Màn hình', 'Super Retina XDR 6.1 inch', 1),
(1, 'Chip', 'Apple A16 Bionic', 2),
(1, 'Camera', 'Chính 48MP, góc rộng', 3),
(1, 'Bộ nhớ trong', '128GB', 4),
(1, 'Cổng sạc', 'USB-C', 5);

-- Samsung Galaxy S24 (id 2)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(2, 'Màn hình', 'Dynamic AMOLED 2X 120Hz', 1),
(2, 'Chip', 'Snapdragon 8 Gen 3 for Galaxy', 2),
(2, 'RAM', '8GB', 3),
(2, 'Bộ nhớ trong', '256GB', 4),
(2, 'Tính năng AI', 'Dịch thuật, tóm tắt, chỉnh sửa ảnh AI', 5);

-- Dell Inspiron 15 (id 3)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(3, 'CPU', 'Intel Core thế hệ mới', 1),
(3, 'RAM', '8GB', 2),
(3, 'Ổ cứng', 'SSD 512GB', 3),
(3, 'Màn hình', '15.6 inch Full HD', 4),
(3, 'Hệ điều hành', 'Windows 11', 5);

-- Asus Vivobook 15 (id 4)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(4, 'CPU', 'Intel Core i5 thế hệ mới', 1),
(4, 'RAM', '8GB', 2),
(4, 'Ổ cứng', 'SSD 512GB', 3),
(4, 'Màn hình', '15.6 inch Full HD viền mỏng', 4),
(4, 'Trọng lượng', '1.7kg', 5);

-- iPad Pro M2 (id 5)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(5, 'Màn hình', 'Liquid Retina XDR 12.9 inch', 1),
(5, 'Chip', 'Apple M2', 2),
(5, 'Bộ nhớ trong', '256GB', 3),
(5, 'Phụ kiện hỗ trợ', 'Magic Keyboard, Apple Pencil', 4),
(5, 'Kết nối', 'Wi-Fi / 5G (tùy phiên bản)', 5);

-- Apple Watch Series 9 (id 6)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(6, 'Chip', 'Apple S9', 1),
(6, 'Màn hình', 'Retina LTPO OLED luôn hiển thị', 2),
(6, 'Tính năng sức khỏe', 'Đo nhịp tim, oxy máu, giấc ngủ', 3),
(6, 'Chống nước', 'WR50 (50m)', 4),
(6, 'Tính năng đặc biệt', 'Double Tap', 5);

-- iPhone 16 (id 7)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(7, 'Màn hình', 'Super Retina XDR 6.1 inch', 1),
(7, 'Chip', 'Apple A18', 2),
(7, 'Camera', 'Chính 48MP nâng cấp', 3),
(7, 'Bộ nhớ trong', '128GB', 4),
(7, 'Pin', 'Cải thiện so với iPhone 15', 5);

-- Xiaomi 14 (id 8)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(8, 'Màn hình', 'AMOLED 6.36 inch 120Hz', 1),
(8, 'Chip', 'Snapdragon 8 Gen 3', 2),
(8, 'Camera', 'Leica, 3 camera sau', 3),
(8, 'Sạc', 'Sạc nhanh 90W có dây', 4),
(8, 'Bộ nhớ trong', '256GB', 5);

-- OPPO Reno 12 (id 9)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(9, 'Màn hình', 'AMOLED cong tràn viền', 1),
(9, 'Camera', 'Chân dung AI', 2),
(9, 'Chip', 'MediaTek Dimensity', 3),
(9, 'Bộ nhớ trong', '256GB', 4),
(9, 'Trọng lượng', 'Mỏng nhẹ', 5);

-- MacBook Air M2 (id 10)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(10, 'Chip', 'Apple M2', 1),
(10, 'RAM', '8GB', 2),
(10, 'Ổ cứng', 'SSD 256GB', 3),
(10, 'Pin', 'Lên đến 18 giờ', 4),
(10, 'Màn hình', 'Liquid Retina 13.6 inch', 5);

-- Lenovo IdeaPad 5 (id 11)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(11, 'CPU', 'Intel Core i5', 1),
(11, 'RAM', '8GB', 2),
(11, 'Ổ cứng', 'SSD 512GB', 3),
(11, 'Bàn phím', 'Gõ êm, có đèn nền', 4),
(11, 'Màn hình', '15.6 inch Full HD', 5);

-- Samsung Galaxy Tab S9 (id 12)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(12, 'Màn hình', 'Dynamic AMOLED 2X 11 inch', 1),
(12, 'Bút đi kèm', 'S Pen', 2),
(12, 'Chống nước', 'IP68', 3),
(12, 'Bộ nhớ trong', '256GB', 4),
(12, 'Pin', '8400 mAh', 5);

-- Tai nghe Bluetooth (id 13)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(13, 'Kết nối', 'Bluetooth 5.3', 1),
(13, 'Chống ồn', 'Chủ động (ANC)', 2),
(13, 'Thời lượng pin', '30 giờ kể cả hộp sạc', 3),
(13, 'Chống nước', 'IPX4', 4);

-- Chuột không dây (id 14)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(14, 'Kết nối', 'Bluetooth kép', 1),
(14, 'Pin', 'Dùng liên tục 6 tháng', 2),
(14, 'Thiết kế', 'Công thái học', 3),
(14, 'Trọng lượng', 'Nhẹ, cầm gọn tay', 4);

-- Samsung Galaxy Watch 6 (id 15)
INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
(15, 'Màn hình', 'Sapphire Crystal chống trầy', 1),
(15, 'Tính năng sức khỏe', 'Đo giấc ngủ, nhịp tim, chỉ số cơ thể', 2),
(15, 'Chống nước', '5ATM + IP68', 3),
(15, 'Kết nối', 'Bluetooth / LTE (tùy phiên bản)', 4);


-- 5) Cập nhật AUTO_INCREMENT cho bảng products (đề phòng)
ALTER TABLE `products` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 16;
