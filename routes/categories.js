const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/categories -> danh sách danh mục
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, code, name FROM categories ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lấy danh mục' });
    }
});

module.exports = router;
