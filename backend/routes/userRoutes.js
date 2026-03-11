// ============================================
// User Routes - routes/userRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const { verifyAdmin } = require('../middleware/auth');

// Public routes (no login needed)
router.post('/register', registerUser);   // POST /api/users/register
router.post('/login', loginUser);         // POST /api/users/login

// Protected admin routes
router.get('/all', verifyAdmin, getAllUsers); // GET /api/users/all

module.exports = router;
