// ============================================================
// Auth Controller - Handles user & admin login/register
// ============================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ---- REGISTER USER ----
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null]
    );

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ---- LOGIN USER ----
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token (valid for 7 days)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'househunt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ---- LOGIN ADMIN ----
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'househunt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { registerUser, loginUser, loginAdmin };
