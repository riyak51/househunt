// ============================================================
// Auth Routes
// ============================================================
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin } = require('../controllers/authController');

router.post('/register', registerUser);   // POST /api/auth/register
router.post('/login', loginUser);         // POST /api/auth/login
router.post('/admin/login', loginAdmin);  // POST /api/auth/admin/login

module.exports = router;
