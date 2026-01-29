/* =====================================================
   Main Application JavaScript
   ===================================================== */

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ==================== Cart Functions ====================

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showToast('เพิ่มสินค้าลงตะกร้าแล้ว', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

// ==================== Render Functions ====================

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-muted mb-4">ตะกร้าของคุณว่างเปล่า</p>
        <a href="index.html" class="btn btn-primary">เลือกซื้อสินค้า</a>
      </div>
    `;
        return;
    }

    container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="qty-input mt-4">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <input type="number" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">
        ✕
      </button>
    </div>
  `).join('');

    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'ฟรี' : formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// ==================== Toast Notification ====================

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== Form Validation ====================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('[required]');

    inputs.forEach(input => {
        const value = input.value.trim();
        const errorEl = input.parentElement.querySelector('.form-error');

        if (!value) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = 'กรุณากรอกข้อมูล';
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = 'อีเมลไม่ถูกต้อง';
            isValid = false;
        } else {
            input.classList.remove('error');
            if (errorEl) errorEl.textContent = '';
        }
    });

    return isValid;
}

// ==================== Login/Register ====================

function handleLogin(event) {
    event.preventDefault();

    if (!validateForm('login-form')) return;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate login
    localStorage.setItem('user', JSON.stringify({ email, name: 'ผู้ใช้งาน' }));
    showToast('เข้าสู่ระบบสำเร็จ', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();

    if (!validateForm('register-form')) return;

    showToast('สมัครสมาชิกสำเร็จ', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function logout() {
    localStorage.removeItem('user');
    showToast('ออกจากระบบแล้ว', 'info');
    window.location.href = 'index.html';
}

// ==================== Payment ====================

function processPayment(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast('ตะกร้าของคุณว่างเปล่า', 'error');
        return;
    }

    // Simulate payment
    showToast('กำลังดำเนินการชำระเงิน...', 'info');

    setTimeout(() => {
        clearCart();
        showToast('ชำระเงินสำเร็จ! ขอบคุณที่ใช้บริการ', 'success');

        setTimeout(() => {
            window.location.href = 'member.html';
        }, 2000);
    }, 2000);
}

// ==================== Initialize ====================

document.addEventListener('DOMContentLoaded', () => {
    // Update cart badge on load
    updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));

    // Render cart if on cart page
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});
