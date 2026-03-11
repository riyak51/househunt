// ============================================
// User Controller - controllers/userController.js
// Handles user registration and login logic
// ============================================

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ---- REGISTER NEW USER ----
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email and password are required.' 
            });
        }

        // Check if email already exists
        const [existingUser] = await db.execute(
            'SELECT id FROM users WHERE email = ?', [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered. Please login.' 
            });
        }

        // Hash the password (never store plain text passwords!)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into database
        await db.execute(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, phone || null]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully! Please login.' 
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
};

// ---- LOGIN USER ----
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required.' 
            });
        }

        // Find user by email
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password.' 
            });
        }

        const user = users[0];

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password.' 
            });
        }

        // Generate JWT token (expires in 7 days)
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login successful!',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
};

// ---- GET ALL USERS (Admin Only) ----
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC'
        );
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { registerUser, loginUser, getAllUsers };
