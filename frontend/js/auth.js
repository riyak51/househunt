// ============================================================
// Auth Helper Functions (used across all pages)
// ============================================================

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Get current user info
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if admin is logged in
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../index.html';
}

// Update navbar based on login status
function updateNavbar() {
  const authLinks = document.getElementById('authLinks');
  if (!authLinks) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    authLinks.innerHTML = `
      <li><a href="#">👤 ${user.name}</a></li>
      <li><a href="#" class="nav-btn outline" onclick="logout()">Logout</a></li>
    `;
  }
}

// Show alert messages
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (el) {
    el.className = `alert alert-${type}`;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
  }
}

// Format price in Indian Rupee format
function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// Get badge HTML for furnished status
function getFurnishedBadge(status) {
  const classes = {
    'Furnished': 'badge-furnished',
    'Semi-Furnished': 'badge-semi',
    'Unfurnished': 'badge-unfurnished'
  };
  return `<span class="badge ${classes[status] || 'badge-unfurnished'}">${status}</span>`;
}

// Create house card HTML
function createHouseCard(house) {
  const img = house.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600';
  return `
    <div class="house-card" onclick="window.location.href='pages/house-detail.html?id=${house.id}'">
      <img class="card-img" src="${img}" alt="${house.title}" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'">
      <div class="card-body">
        <div class="card-price">${formatPrice(house.price)} <span>/ month</span></div>
        <div class="card-title">${house.title}</div>
        <div class="card-location">📍 ${house.location}, ${house.city}</div>
        <div style="margin-bottom:10px">
          <span class="badge badge-type">${house.house_type}</span>
          ${getFurnishedBadge(house.furnished)}
        </div>
        <div class="card-features">
          <span>🛏 ${house.bedrooms} Bed</span>
          <span>🚿 ${house.bathrooms} Bath</span>
          ${house.area_sqft ? `<span>📐 ${house.area_sqft} sqft</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
