// ============================================================
// House Controller - CRUD operations for houses
// ============================================================
const db = require('../config/db');

// ---- GET ALL HOUSES (with optional search/filter) ----
const getAllHouses = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, house_type } = req.query;

    let query = 'SELECT * FROM houses WHERE available = TRUE';
    const params = [];

    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (bedrooms) {
      query += ' AND bedrooms = ?';
      params.push(bedrooms);
    }
    if (house_type) {
      query += ' AND house_type = ?';
      params.push(house_type);
    }

    query += ' ORDER BY created_at DESC';

    const [houses] = await db.query(query, params);
    res.json({ houses, count: houses.length });
  } catch (error) {
    console.error('Get houses error:', error);
    res.status(500).json({ message: 'Error fetching houses' });
  }
};

// ---- GET SINGLE HOUSE BY ID ----
const getHouseById = async (req, res) => {
  try {
    const [house] = await db.query('SELECT * FROM houses WHERE id = ?', [req.params.id]);
    if (house.length === 0) {
      return res.status(404).json({ message: 'House not found' });
    }
    res.json(house[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching house details' });
  }
};

// ---- ADD NEW HOUSE (Admin only) ----
const addHouse = async (req, res) => {
  try {
    const { title, description, location, city, price, bedrooms, bathrooms,
            area_sqft, house_type, furnished, owner_name, owner_phone, owner_email, image_url } = req.body;

    if (!title || !location || !city || !price || !bedrooms) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const [result] = await db.query(
      `INSERT INTO houses (title, description, location, city, price, bedrooms, bathrooms,
       area_sqft, house_type, furnished, owner_name, owner_phone, owner_email, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, location, city, price, bedrooms, bathrooms || 1,
       area_sqft, house_type || 'Apartment', furnished || 'Unfurnished',
       owner_name, owner_phone, owner_email, image_url]
    );

    res.status(201).json({ message: 'House added successfully!', id: result.insertId });
  } catch (error) {
    console.error('Add house error:', error);
    res.status(500).json({ message: 'Error adding house' });
  }
};

// ---- UPDATE HOUSE (Admin only) ----
const updateHouse = async (req, res) => {
  try {
    const { title, description, location, city, price, bedrooms, bathrooms,
            area_sqft, house_type, furnished, available, owner_name, owner_phone, owner_email, image_url } = req.body;

    await db.query(
      `UPDATE houses SET title=?, description=?, location=?, city=?, price=?, bedrooms=?,
       bathrooms=?, area_sqft=?, house_type=?, furnished=?, available=?,
       owner_name=?, owner_phone=?, owner_email=?, image_url=?
       WHERE id=?`,
      [title, description, location, city, price, bedrooms, bathrooms,
       area_sqft, house_type, furnished, available, owner_name, owner_phone, owner_email, image_url, req.params.id]
    );

    res.json({ message: 'House updated successfully!' });
  } catch (error) {
    console.error('Update house error:', error);
    res.status(500).json({ message: 'Error updating house' });
  }
};

// ---- DELETE HOUSE (Admin only) ----
const deleteHouse = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM houses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }
    res.json({ message: 'House deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting house' });
  }
};

// ---- GET ALL USERS (Admin only) ----
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC');
    res.json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ---- CONTACT OWNER / BOOK HOUSE ----
const bookHouse = async (req, res) => {
  try {
    const { user_id, house_id, message } = req.body;
    await db.query(
      'INSERT INTO bookings (user_id, house_id, message) VALUES (?, ?, ?)',
      [user_id, house_id, message]
    );
    res.status(201).json({ message: 'Request sent to owner successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending request' });
  }
};

// ---- GET ALL BOOKINGS (Admin only) ----
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.id, b.message, b.status, b.created_at,
              u.name AS user_name, u.email AS user_email,
              h.title AS house_title, h.city
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN houses h ON b.house_id = h.id
       ORDER BY b.created_at DESC`
    );
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

module.exports = { getAllHouses, getHouseById, addHouse, updateHouse, deleteHouse, getAllUsers, bookHouse, getAllBookings };
