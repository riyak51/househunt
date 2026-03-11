const express  = require('express');
const router   = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

router.post('/',          authenticate, createBooking);
router.get('/',           authenticate, getBookings);
router.put('/:id',        authenticate, adminOnly, updateBookingStatus);

module.exports = router;
