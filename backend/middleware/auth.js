// ============================================
// Auth Middleware - middleware/auth.js
// Protects routes that require login
// ============================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify user is logged in
const verifyUser = (req, res, next) => {
    // Get token from request header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. Please login first.' 
        });
    }

    // Remove "Bearer " prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        // Verify the token is valid
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Move to the actual route handler
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token. Please login again.' 
        });
    }
};

// Middleware to verify admin is logged in
const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. Admin login required.' 
        });
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        // Check if this token belongs to an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden. Admin access only.' 
            });
        }
        
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
};

module.exports = { verifyUser, verifyAdmin };
