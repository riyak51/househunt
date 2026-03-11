const express  = require('express');
const router   = express.Router();
const { getDashboardStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats',        authenticate, adminOnly, getDashboardStats);
router.get('/users',        authenticate, adminOnly, getAllUsers);
router.delete('/users/:id', authenticate, adminOnly, deleteUser);

module.exports = router;
