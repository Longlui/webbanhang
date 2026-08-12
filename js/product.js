const API_BASE = "/api";

let currentProduct = null;
let selectedQuantity = 1;


// ===============================
// LẤY id SẢN PHẨM TỪ URL (?id=5)
// ===============================

function getProductIdFromUrl() {

    const params = new URLSearchParams(window.location.search);

    const id = Number(params.get("id"));

    return Number.isInteger(id) && id > 0 ? id : null;
}


// ===============================
// TẢI CHI TIẾT SẢN PHẨM TỪ API
// ===============================

async function loadProduct() {

    const container = document.getElementById("productDetail");

    const id = getProductIdFromUrl();

    if (!id) {
        container.innerHTML = `
            <div class="no-product">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Đường dẫn không hợp lệ.</p>
            </div>
        `;
        return;
    }

    try {

        const res = await fetch(`${API_BASE}/products/${id}`);

        if (!res.ok) {
            throw new Error("Không tìm thấy sản phẩm");
        }

        currentProduct = await res.json();

        renderProduct();

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="no-product">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Sản phẩm có thể đã bị xóa hoặc không tồn tại.</p>
            </div>
        `;
    }

    updateCartCount();
}


// ===============================
// HIỂN THỊ CHI TIẾT SẢN PHẨM
// ===============================

function renderProduct() {

    const container = document.getElementById("productDetail");
    const p = currentProduct;

    const specsHtml = (p.specs && p.specs.length > 0)
        ? p.specs.map(s => `
            <tr>
                <td>${s.label}</td>
                <td>${s.value}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="2">Đang cập nhật thông số kỹ thuật.</td></tr>`;

    const outOfStock = p.stock <= 0;

    container.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">
                ${p.sale ? `<span class="sale">${p.sale}</span>` : ""}
                <img src="${p.image}" alt="${p.name}">
            </div>

            <div class="product-detail-info">

                <h1>${p.name}</h1>

                <p class="rating">⭐ ${p.rating}</p>

                <div class="product-detail-price">
                    <strong>${Number(p.price).toLocaleString("vi-VN")}đ</strong>
                    ${p.oldPrice ? `<span class="old-price">${Number(p.oldPrice).toLocaleString("vi-VN")}đ</span>` : ""}
                </div>

                <p class="stock-info">
                    ${outOfStock ? "Hết hàng" : `Còn lại: ${p.stock} sản phẩm`}
                </p>

                <p class="product-description">${p.description || ""}</p>

                <div class="quantity-select">
                    <span>Số lượng:</span>
                    <div class="quantity">
                        <button onclick="changeQuantity(-1)">−</button>
                        <span id="quantityValue">${selectedQuantity}</span>
                        <button onclick="changeQuantity(1)">+</button>
                    </div>
                </div>

                <div class="product-detail-actions">
                    <button
                        class="add-cart-btn"
                        onclick="addToCartFromDetail(false)"
                        ${outOfStock ? "disabled" : ""}
                    >
                        🛒 Thêm vào giỏ
                    </button>

                    <button
                        class="buy-now-btn"
                        onclick="addToCartFromDetail(true)"
                        ${outOfStock ? "disabled" : ""}
                    >
                        Mua ngay
                    </button>
                </div>

            </div>

        </div>

        <div class="product-specs">

            <h2>Thông số kỹ thuật</h2>

            <table>
                <tbody>
                    ${specsHtml}
                </tbody>
            </table>

        </div>
    `;
}


// ===============================
// CHỌN SỐ LƯỢNG
// ===============================

function changeQuantity(delta) {

    if (!currentProduct) return;

    const next = selectedQuantity + delta;

    if (next < 1) return;

    if (next > currentProduct.stock) {
        alert(`Chỉ còn ${currentProduct.stock} sản phẩm trong kho.`);
        return;
    }

    selectedQuantity = next;

    document.getElementById("quantityValue").textContent = selectedQuantity;
}


// ===============================
// THÊM VÀO GIỎ / MUA NGAY
// ===============================

function addToCartFromDetail(buyNow) {

    if (!currentProduct) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === currentProduct.id);

    if (existing) {

        const newQuantity = existing.quantity + selectedQuantity;

        if (newQuantity > currentProduct.stock) {
            alert(`Trong giỏ đã có ${existing.quantity} sản phẩm này, kho chỉ còn ${currentProduct.stock}.`);
            return;
        }

        existing.quantity = newQuantity;

    } else {

        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: selectedQuantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    if (buyNow) {
        goToCart();
    } else {
        alert(`Đã thêm ${selectedQuantity} "${currentProduct.name}" vào giỏ hàng!`);
    }
}


// ===============================
// HÀM DÙNG CHUNG (giỏ hàng)
// ===============================

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = total;
    }
}

function goToCart() {
    window.location.href = "cart.html";
}


loadProduct();
