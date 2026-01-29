/* =====================================================
   Authentication System - ShopZone
   Admin-Only Authentication
   ===================================================== */

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin4532',
    password: '4532'
};

// Current user state (Admin only)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ==================== User Management ====================

function getUser() {
    return currentUser;
}

function setUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIForUser();
}

function isLoggedIn() {
    return currentUser !== null;
}

function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
}

function clearUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

// ==================== Admin Login ====================

function loginAsAdmin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
            id: 'admin',
            name: 'ผู้ดูแลระบบ',
            email: 'admin@shopzone.com',
            isAdmin: true,
            loginMethod: 'admin',
            loginTime: new Date().toISOString()
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
    }
    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
}

// ==================== Logout ====================

function logout() {
    clearUser();
    if (typeof showToast === 'function') {
        showToast('ออกจากระบบแล้ว', 'info');
    }
    window.location.href = 'index.html';
}

// ==================== Customer Order Data Storage ====================

function saveCustomerOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('allOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('allOrders', JSON.stringify(orders));
}

function getAllOrders() {
    return JSON.parse(localStorage.getItem('allOrders')) || [];
}

function getOrderCount() {
    return getAllOrders().length;
}

function getTotalRevenue() {
    const orders = getAllOrders();
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
}

// ==================== Customer Data (for Admin View) ====================

function saveCustomerData(customerInfo) {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];

    // Check if customer already exists by phone or email
    const existingIndex = customers.findIndex(c =>
        (c.phone && c.phone === customerInfo.phone) ||
        (c.email && c.email === customerInfo.email)
    );

    if (existingIndex >= 0) {
        // Update existing customer
        customers[existingIndex] = {
            ...customers[existingIndex],
            ...customerInfo,
            lastOrder: new Date().toISOString(),
            orderCount: (customers[existingIndex].orderCount || 0) + 1
        };
    } else {
        // Add new customer
        customers.push({
            id: 'cust_' + Date.now(),
            ...customerInfo,
            registeredAt: new Date().toISOString(),
            orderCount: 1
        });
    }

    localStorage.setItem('customers', JSON.stringify(customers));
}

function getAllCustomers() {
    return JSON.parse(localStorage.getItem('customers')) || [];
}

function getCustomerCount() {
    return getAllCustomers().length;
}

// ==================== Access Control ====================

function requireAdmin(redirectUrl = 'login.html') {
    if (!isAdmin()) {
        if (typeof showToast === 'function') {
            showToast('กรุณาเข้าสู่ระบบผู้ดูแล', 'warning');
        }
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
        return false;
    }
    return true;
}

// ==================== UI Updates ====================

function updateUIForUser() {
    const user = getUser();

    // Update header user display
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        if (user && user.isAdmin) {
            userDisplay.innerHTML = `
                <div class="user-menu dropdown">
                    <button class="user-btn" onclick="toggleUserMenu()">
                        <span class="user-avatar">A</span>
                        <span class="user-name">Admin</span>
                        <span class="badge badge-warning" style="margin-left:5px">ผู้ดูแล</span>
                    </button>
                    <div class="dropdown-menu user-dropdown" id="user-dropdown">
                        <a href="admin.html" class="dropdown-item">⚙️ จัดการระบบ</a>
                        <hr style="margin:8px 0;border-color:#eee">
                        <a href="#" onclick="logout()" class="dropdown-item text-danger">🚪 ออกจากระบบ</a>
                    </div>
                </div>
            `;
        } else {
            userDisplay.innerHTML = '<a href="login.html" class="btn btn-ghost btn-sm">🔐 Admin</a>';
        }
    }

    // Show/hide admin link in nav
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.style.display = user && user.isAdmin ? 'block' : 'none';
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// ==================== Initialize ====================

document.addEventListener('DOMContentLoaded', () => {
    updateUIForUser();
});
