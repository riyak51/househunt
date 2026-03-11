// ──────────────────────────────────────────
//  Admin Controller  –  Dashboard data
// ──────────────────────────────────────────
const db = require('../config/db');

// ── GET /api/admin/stats ──
exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ userCount }]]    = await db.query('SELECT COUNT(*) AS userCount    FROM users');
    const [[{ houseCount }]]   = await db.query('SELECT COUNT(*) AS houseCount   FROM houses');
    const [[{ bookingCount }]] = await db.query('SELECT COUNT(*) AS bookingCount FROM bookings');
    const [[{ pendingCount }]] = await db.query("SELECT COUNT(*) AS pendingCount FROM bookings WHERE status='pending'");

    res.json({
      success: true,
      stats: { userCount, houseCount, bookingCount, pendingCount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET /api/admin/users ──
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── DELETE /api/admin/users/:id ──
exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
