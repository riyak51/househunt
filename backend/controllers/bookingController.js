// ──────────────────────────────────────────
//  Booking Controller
// ──────────────────────────────────────────
const db = require('../config/db');

// ── POST /api/bookings  (user) ──
exports.createBooking = async (req, res) => {
  try {
    const { house_id, message } = req.body;
    const user_id = req.user.id;

    if (!house_id)
      return res.status(400).json({ success: false, message: 'House ID is required.' });

    // Check house exists
    const [house] = await db.query('SELECT id FROM houses WHERE id = ?', [house_id]);
    if (house.length === 0)
      return res.status(404).json({ success: false, message: 'House not found.' });

    // Prevent duplicate booking
    const [existing] = await db.query(
      "SELECT id FROM bookings WHERE user_id=? AND house_id=? AND status != 'cancelled'",
      [user_id, house_id]
    );
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'You have already sent an enquiry for this house.' });

    await db.query(
      'INSERT INTO bookings (user_id, house_id, message) VALUES (?,?,?)',
      [user_id, house_id, message || null]
    );

    res.status(201).json({ success: true, message: 'Enquiry sent successfully! Owner will contact you.' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET /api/bookings  (admin: all  |  user: own) ──
exports.getBookings = async (req, res) => {
  try {
    let query, params = [];

    if (req.user.role === 'admin') {
      query = `
        SELECT b.*, u.full_name, u.email as user_email, h.title as house_title, h.city
        FROM bookings b
        JOIN users  u ON b.user_id  = u.id
        JOIN houses h ON b.house_id = h.id
        ORDER BY b.booked_at DESC`;
    } else {
      query = `
        SELECT b.*, h.title as house_title, h.city, h.price, h.image_url
        FROM bookings b
        JOIN houses h ON b.house_id = h.id
        WHERE b.user_id = ?
        ORDER BY b.booked_at DESC`;
      params = [req.user.id];
    }

    const [bookings] = await db.query(query, params);
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── PUT /api/bookings/:id  (admin: update status) ──
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','confirmed','cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });

    await db.query('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: 'Booking status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
