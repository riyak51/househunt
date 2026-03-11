// ============================================================
// HouseHunt - Main Server File
// Run: node server.js
// ============================================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---- MIDDLEWARE ----
// Allow requests from frontend (CORS)
app.use(cors({
  origin: '*', // In production, replace with your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ROUTES ----
const authRoutes = require('./routes/authRoutes');
const houseRoutes = require('./routes/houseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', houseRoutes);

// ---- HOME ROUTE (test if server is running) ----
app.get('/', (req, res) => {
  res.json({ message: '🏠 HouseHunt API is running!', version: '1.0.0' });
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
