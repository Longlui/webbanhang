require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const ordersRoute = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

// ===== API =====
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/orders', ordersRoute);

// ===== Frontend tĩnh (index.html, cart.html, css/, js/) =====
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
