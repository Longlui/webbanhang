// ===============================
// LẤY SẢN PHẨM TỪ API (MySQL)
// ===============================

const API_BASE = "/api";

let products = [];


// ===============================
// TÊN DANH MỤC
// ===============================

const categoryNames = {
    all: "Tất cả sản phẩm",
    phone: "Điện thoại",
    laptop: "Laptop",
    tablet: "Tablet",
    accessory: "Phụ kiện",
    watch: "Đồng hồ",

};


// ===============================
// DANH MỤC ĐANG CHỌN
// ===============================

let currentCategory = "all";


// ===============================
// HIỂN THỊ SẢN PHẨM
// ===============================

function displayProducts(list) {

    const productList = document.getElementById("productList");

    if (list.length === 0) {

        productList.innerHTML = `
            <div class="no-product">
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác.</p>
            </div>
        `;

        return;
    }


    productList.innerHTML = list.map(product => `

        <div class="product" onclick="viewProduct(${product.id})">

            <span class="sale">
                ${product.sale}
            </span>

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p class="price">
                ${Number(product.price).toLocaleString("vi-VN")}đ
            </p>

            <p class="old-price">
                ${Number(product.oldPrice).toLocaleString("vi-VN")}đ
            </p>

            <p class="rating">
                ⭐ ${product.rating}
            </p>

            <button
                class="buy-btn"
                onclick="event.stopPropagation(); addToCart(${product.id})"
            >
                🛒 Thêm vào giỏ
            </button>

        </div>

    `).join("");
}


// ===============================
// LỌC THEO DANH MỤC
// ===============================

function filterProduct(category) {

    currentCategory = category;

    const result =
        category === "all"
            ? products
            : products.filter(
                product => product.category === category
            );


    document.getElementById("productTitle").textContent =
        categoryNames[category];


    // Reset tìm kiếm
    document.getElementById("searchInput").value = "";


    // Reset sắp xếp
    document.getElementById("sortPrice").value = "default";


    displayProducts(result);
}


// ===============================
// TÌM KIẾM SẢN PHẨM
// ===============================

function searchProduct() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    let result =
        currentCategory === "all"
            ? [...products]
            : products.filter(
                product =>
                    product.category === currentCategory
            );


    if (keyword !== "") {

        result = result.filter(product =>
            product.name
                .toLowerCase()
                .includes(keyword)
        );

    }


    document.getElementById("productTitle").textContent =
        keyword
            ? `Kết quả: ${keyword}`
            : categoryNames[currentCategory];


    displayProducts(result);
}


// ===============================
// SẮP XẾP GIÁ
// ===============================

function sortProduct() {

    const type =
        document.getElementById("sortPrice").value;


    let result =
        currentCategory === "all"
            ? [...products]
            : products.filter(
                product =>
                    product.category === currentCategory
            );


    // Giá thấp → cao
    if (type === "low") {

        result.sort(
            (a, b) => a.price - b.price
        );

    }


    // Giá cao → thấp
    if (type === "high") {

        result.sort(
            (a, b) => b.price - a.price
        );

    }


    displayProducts(result);
}


// ===============================
// GIỎ HÀNG TẠM THỜI (localStorage)
// ===============================

function addToCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = products.find(
        product => product.id === id
    );

    if (!product) {
        return;
    }

    const item = cart.find(
        item => item.id === id
    );

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Đã thêm " + product.name + " vào giỏ hàng!");
}

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

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

function viewProduct(id) {
    window.location.href = "product.html?id=" + id;
}

function filterPrice(type) {

    let result = [];

    if (type === "all") {

        result = products;

    } else if (type === "under5") {

        result = products.filter(product =>
            product.price < 5000000
        );

    } else if (type === "5to10") {

        result = products.filter(product =>
            product.price >= 5000000 &&
            product.price <= 10000000
        );

    } else if (type === "10to20") {

        result = products.filter(product =>
            product.price > 10000000 &&
            product.price <= 20000000
        );

    } else if (type === "over20") {

        result = products.filter(product =>
            product.price > 20000000
        );
    }

    displayProducts(result);
}


// ===============================
// KHỞI TẠO: GỌI API LẤY SẢN PHẨM
// ===============================

async function initProducts() {

    const productList = document.getElementById("productList");

    try {

        const res = await fetch(`${API_BASE}/products`);

        if (!res.ok) {
            throw new Error("Lỗi khi tải sản phẩm từ server");
        }

        products = await res.json();

        displayProducts(products);

    } catch (err) {

        console.error(err);

        productList.innerHTML = `
            <div class="no-product">
                <h3>Không thể tải sản phẩm</h3>
                <p>Vui lòng kiểm tra server Node.js / MySQL đã chạy chưa.</p>
            </div>
        `;
    }

    updateCartCount();
}

initProducts();
