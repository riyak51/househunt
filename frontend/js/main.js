// ============================================================
//  HouseHunt  –  Global JS helpers
// ============================================================

// ── Navbar hamburger ──
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // Highlight active link
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current || a.getAttribute('href') === './'+current)
      a.classList.add('active');
  });

  // Update nav based on login state
  updateNavAuth();
});

function updateNavAuth() {
  const user  = JSON.parse(localStorage.getItem('hh_user')  || 'null');
  const admin = JSON.parse(localStorage.getItem('hh_admin') || 'null');

  const authLinks = document.getElementById('auth-links');
  if (!authLinks) return;

  if (admin) {
    authLinks.innerHTML = `
      <li><a href="pages/admin.html">Dashboard</a></li>
      <li><a href="#" onclick="logoutAll()" class="nav-cta">Logout</a></li>`;
  } else if (user) {
    authLinks.innerHTML = `
      <li><a href="#">Hi, ${user.full_name.split(' ')[0]}</a></li>
      <li><a href="#" onclick="logoutAll()" class="nav-cta">Logout</a></li>`;
  }
}

function logoutAll() {
  localStorage.clear();
  window.location.href = '/index.html';
}

// ── Toast notification ──
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    min-width:280px; box-shadow:0 8px 24px rgba(0,0,0,.15);
    animation: slideIn .3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Format price ──
function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// ── Redirect if not logged in ──
function requireAuth(role = 'user') {
  const token = localStorage.getItem('hh_token');
  if (!token) {
    window.location.href = role === 'admin' ? '../pages/admin-login.html' : '../pages/login.html';
    return false;
  }
  return true;
}
