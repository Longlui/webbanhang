const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/products -> danh sách tất cả sản phẩm (kèm mã danh mục)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.name, p.description, p.price,
                   p.old_price AS oldPrice, p.rating, p.image,
                   p.stock, c.code AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.id ASC
        `);

        // Tự tính % giảm giá để giữ đúng format "-10%" như frontend cũ đang dùng
        const data = rows.map(p => {
            let sale = '';
            if (p.oldPrice && p.oldPrice > p.price) {
                const percent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
                sale = `-${percent}%`;
            }
            return { ...p, sale };
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
    }
});

// GET /api/products/:id -> chi tiết 1 sản phẩm, kèm thông số kỹ thuật
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.name, p.description, p.price,
                   p.old_price AS oldPrice, p.rating, p.image,
                   p.stock, c.code AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }

        const product = rows[0];

        let sale = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            const percent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            sale = `-${percent}%`;
        }

        // Lấy thông số kỹ thuật. Nếu chưa chạy update_products.sql (bảng chưa tồn tại),
        // bắt lỗi riêng để không làm hỏng cả API, chỉ trả về specs rỗng.
        let specs = [];
        try {
            const [specRows] = await pool.query(
                'SELECT label, value FROM product_specs WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
                [req.params.id]
            );
            specs = specRows;
        } catch (specErr) {
            console.warn('Chưa có bảng product_specs, hãy chạy update_products.sql. Chi tiết:', specErr.message);
        }

        res.json({ ...product, sale, specs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm' });
    }
});

module.exports = router;
