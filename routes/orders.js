const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/orders -> tạo đơn hàng mới, lưu vào bảng orders + order_items
router.post('/', async (req, res) => {
    const { full_name, phone, address, items } = req.body;

    if (!full_name || !phone || !address || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Luôn lấy giá & tồn kho THẬT từ DB, không tin giá client gửi lên
        const productIds = items.map(i => i.product_id);
        const placeholders = productIds.map(() => '?').join(',');

        const [products] = await connection.query(
            `SELECT id, name, price, stock FROM products WHERE id IN (${placeholders})`,
            productIds
        );

        if (products.length !== new Set(productIds).size) {
            throw new Error('Một số sản phẩm không tồn tại');
        }

        let total = 0;
        const orderItemsData = items.map(item => {
            const product = products.find(p => p.id === item.product_id);
            if (!product) throw new Error('Sản phẩm không hợp lệ');
            if (!item.quantity || item.quantity < 1) throw new Error('Số lượng không hợp lệ');
            if (product.stock < item.quantity) throw new Error(`${product.name} không đủ hàng trong kho`);

            const lineTotal = product.price * item.quantity;
            total += lineTotal;

            return {
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        const [orderResult] = await connection.query(
            `INSERT INTO orders (full_name, phone, address, total_price, status) VALUES (?, ?, ?, ?, 'pending')`,
            [full_name, phone, address, total]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItemsData) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.product_name, item.price, item.quantity]
            );

            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        res.status(201).json({ order_id: orderId, total_price: total });

    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(400).json({ error: err.message || 'Lỗi khi tạo đơn hàng' });
    } finally {
        connection.release();
    }
});

// GET /api/orders/:id -> xem lại chi tiết 1 đơn hàng (dùng cho trang xác nhận)
router.get('/:id', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (orders.length === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);

        res.json({ ...orders[0], items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy đơn hàng' });
    }
});

module.exports = router;
