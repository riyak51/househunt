// ============================================================
// House Routes
// ============================================================
const express = require('express');
const router = express.Router();
const {
  getAllHouses, getHouseById, addHouse, updateHouse,
  deleteHouse, getAllUsers, bookHouse, getAllBookings
} = require('../controllers/houseController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes (anyone can access)
router.get('/houses', getAllHouses);              // GET /api/houses
router.get('/houses/:id', getHouseById);          // GET /api/houses/1

// User routes (must be logged in)
router.post('/book', verifyToken, bookHouse);     // POST /api/book

// Admin only routes
router.post('/admin/houses', verifyAdmin, addHouse);           // POST /api/admin/houses
router.put('/admin/houses/:id', verifyAdmin, updateHouse);     // PUT /api/admin/houses/1
router.delete('/admin/houses/:id', verifyAdmin, deleteHouse);  // DELETE /api/admin/houses/1
router.get('/admin/users', verifyAdmin, getAllUsers);           // GET /api/admin/users
router.get('/admin/bookings', verifyAdmin, getAllBookings);     // GET /api/admin/bookings

module.exports = router;
