-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 11, 2026 lúc 10:33 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `longstore`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `code`, `name`) VALUES
(1, 'phone', 'Điện thoại'),
(2, 'laptop', 'Laptop'),
(3, 'tablet', 'Tablet'),
(4, 'watch', 'Đồng hồ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `total_price` decimal(12,0) NOT NULL,
  `status` enum('pending','confirmed','shipping','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `full_name`, `phone`, `address`, `total_price`, `status`, `created_at`) VALUES
(1, 'long', 'aaa', 'aaa', 39980000, 'pending', '2026-08-11 15:24:08'),
(2, 'Huy Lộc Nguyễn', '0906135518', 'ee', 55960000, 'pending', '2026-08-11 15:31:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `price` decimal(12,0) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`) VALUES
(1, 1, 1, 'iPhone 15', 19990000, 2),
(2, 2, 2, 'Samsung Galaxy S24', 17990000, 2),
(3, 2, 6, 'Apple Watch Series 9', 9990000, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,0) NOT NULL,
  `old_price` decimal(12,0) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 100,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `old_price`, `rating`, `image`, `stock`, `created_at`) VALUES
(1, 1, 'iPhone 15', 'iPhone 15 sở hữu màn hình Super Retina XDR 6.1 inch, chip A16 Bionic mạnh mẽ, camera chính 48MP cho ảnh chụp sắc nét trong mọi điều kiện ánh sáng. Cổng USB-C tiện lợi, thiết kế viền kính cường lực sang trọng.', 19990000, 22000000, 4.8, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:09:18'),
(2, 1, 'Samsung Galaxy S24', 'Galaxy S24 trang bị chip Snapdragon 8 Gen 3 for Galaxy, màn hình Dynamic AMOLED 2X 120Hz, tích hợp AI Galaxy giúp dịch thuật, tóm tắt và chỉnh sửa ảnh thông minh ngay trên máy.', 17990000, 21000000, 4.7, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:09:18'),
(3, 2, 'Dell Inspiron 15', 'Dell Inspiron 15 trang bị vi xử lý Intel Core thế hệ mới, RAM 8GB, ổ cứng SSD tốc độ cao, thiết kế bền bỉ phù hợp cho công việc văn phòng và học tập hàng ngày.', 17490000, 19500000, 4.7, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:11:05'),
(4, 2, 'Asus Vivobook 15', 'Asus Vivobook 15 màn hình full HD viền mỏng, thiết kế trẻ trung nhiều màu sắc, hiệu năng ổn định đáp ứng tốt nhu cầu học tập, làm việc và giải trí cơ bản.', 15990000, 18000000, 4.6, 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:11:05'),
(5, 3, 'iPad Pro M2', 'iPad Pro M2 sở hữu màn hình Liquid Retina XDR, hiệu năng ngang ngửa laptop, hỗ trợ Magic Keyboard và Apple Pencil, đáp ứng tốt các tác vụ đồ họa chuyên sâu.', 24990000, 28000000, 4.8, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:12:37'),
(6, 4, 'Apple Watch Series 9', 'Apple Watch Series 9 với chip S9 mới, tính năng Double Tap tiện lợi, theo dõi sức khỏe toàn diện: nhịp tim, nồng độ oxy trong máu, giấc ngủ.', 9990000, 11000000, 4.8, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80', 100, '2026-08-11 15:12:37');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
