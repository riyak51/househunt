// ============================================================
// Database Connection - MySQL
// ============================================================
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (better than single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'househunt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use promises (so we can use async/await)
const db = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  }
});

module.exports = db;
