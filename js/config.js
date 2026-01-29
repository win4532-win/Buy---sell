/* =====================================================
   App Configuration
   ===================================================== */

const CONFIG = {
  siteName: 'ShopZone',
  currency: '฿',
  currencyCode: 'THB',
  
  // API endpoints (placeholder)
  api: {
    baseUrl: '/api',
    products: '/api/products',
    cart: '/api/cart',
    orders: '/api/orders',
    auth: '/api/auth'
  },
  
  // Default settings
  defaults: {
    itemsPerPage: 12,
    maxCartItems: 99,
    minOrderAmount: 100
  },

  // Social links
  social: {
    facebook: 'https://facebook.com/shopzone',
    instagram: 'https://instagram.com/shopzone',
    twitter: 'https://twitter.com/shopzone',
    line: 'https://line.me/shopzone'
  }
};

// Format price with currency
function formatPrice(price) {
  return `${CONFIG.currency}${price.toLocaleString()}`;
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
