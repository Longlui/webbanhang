const API_BASE = "/api";

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// HIỂN THỊ GIỎ HÀNG
// ===============================

function displayCart() {

    const container =
        document.getElementById("cartContainer");

    const totalPrice =
        document.getElementById("totalPrice");


    // Không có sản phẩm

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">

                <h3>Giỏ hàng đang trống</h3>

                <p>
                    Bạn chưa có sản phẩm nào trong giỏ hàng.
                </p>

                <button
                    onclick="goHome()"
                >
                    Tiếp tục mua hàng
                </button>

            </div>
        `;

        totalPrice.textContent = "0đ";

        updateCartCount();

        return;
    }


    // Hiển thị sản phẩm

    container.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-info">

                <h3>
                    ${item.name}
                </h3>

                <p class="cart-price">
                    ${Number(item.price).toLocaleString("vi-VN")}đ
                </p>


                <div class="quantity">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>

            </div>


            <div class="cart-right">

                <strong>
                    ${(
                        item.price * item.quantity
                    ).toLocaleString("vi-VN")}đ
                </strong>

                <button
                    class="remove-btn"
                    onclick="removeProduct(${index})"
                >
                    Xóa
                </button>

            </div>

        </div>

    `).join("");


    calculateTotal();

    updateCartCount();
}


// ===============================
// TĂNG SỐ LƯỢNG
// ===============================

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

}


// ===============================
// GIẢM SỐ LƯỢNG
// ===============================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

}


function removeProduct(index) {

    cart.splice(index, 1);

    saveCart();

}

function calculateTotal() {

    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

    });


    document.getElementById("totalPrice")
        .textContent =
        total.toLocaleString("vi-VN") + "đ";
}

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

}


function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    let total = 0;


    cart.forEach(item => {

        total += item.quantity;

    });


    cartCount.textContent = total;

}

function goHome() {

    window.location.href =
        "index.html";

}


// ===============================
// THANH TOÁN -> LƯU ĐƠN HÀNG VÀO MYSQL
// ===============================

async function checkout() {

    if (cart.length === 0) {

        alert(
            "Giỏ hàng đang trống!"
        );

        return;
    }

    // Thu thập thông tin khách hàng từ form trên trang
    const full_name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!full_name) {
        alert("Vui lòng nhập họ và tên.");
        document.getElementById("fullName").focus();
        return;
    }

    if (!phone) {
        alert("Vui lòng nhập số điện thoại.");
        document.getElementById("phone").focus();
        return;
    }

    if (!address) {
        alert("Vui lòng nhập địa chỉ giao hàng.");
        document.getElementById("address").focus();
        return;
    }

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    const checkoutBtn = document.querySelector(".checkout-btn");
    const oldText = checkoutBtn.textContent;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Đang xử lý...";

    try {

        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, phone, address, items })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Đặt hàng thất bại");
        }

        alert(
            `Đặt hàng thành công! Mã đơn hàng #${data.order_id}\n` +
            `Tổng tiền: ${Number(data.total_price).toLocaleString("vi-VN")}đ`
        );

        // Xóa giỏ hàng và form sau khi đặt hàng thành công
        cart = [];
        localStorage.removeItem("cart");
        document.getElementById("fullName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";
        displayCart();

    } catch (err) {

        console.error(err);
        alert("Lỗi: " + err.message);

    } finally {

        checkoutBtn.disabled = false;
        checkoutBtn.textContent = oldText;

    }
}


displayCart();
