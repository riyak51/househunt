-- ============================================================
--  HouseHunt – Smart House Suggestion System
--  Database Schema (MySQL)
-- ============================================================

CREATE DATABASE IF NOT EXISTS househunt_db;
USE househunt_db;

-- ─────────────────────────────────────────
-- 1. USERS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,       -- bcrypt hashed
    phone       VARCHAR(20),
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- 2. ADMINS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100)        NOT NULL UNIQUE,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,       -- bcrypt hashed
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- 3. HOUSES TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS houses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200)        NOT NULL,
    description     TEXT,
    location        VARCHAR(200)        NOT NULL,
    city            VARCHAR(100)        NOT NULL,
    price           DECIMAL(10,2)       NOT NULL,   -- monthly rent (₹)
    bedrooms        INT                 DEFAULT 1,
    bathrooms       INT                 DEFAULT 1,
    area_sqft       INT,
    amenities       TEXT,                           -- comma-separated list
    image_url       VARCHAR(500),
    owner_name      VARCHAR(100),
    owner_phone     VARCHAR(20),
    owner_email     VARCHAR(150),
    is_available    BOOLEAN             DEFAULT TRUE,
    added_by_admin  INT,
    created_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (added_by_admin) REFERENCES admins(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────
-- 4. BOOKINGS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT             NOT NULL,
    house_id    INT             NOT NULL,
    message     TEXT,
    status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    booked_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 5. SEED DATA – default admin
-- ─────────────────────────────────────────
-- Password is: admin@123  (bcrypt hash below)
INSERT INTO admins (username, email, password) VALUES
('admin', 'admin@househunt.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample houses
INSERT INTO houses (title, description, location, city, price, bedrooms, bathrooms, area_sqft, amenities, image_url, owner_name, owner_phone, owner_email, added_by_admin) VALUES
('Cozy 2BHK in Koregaon Park', 'Fully furnished flat with balcony and great city view.', 'Koregaon Park, Lane 5', 'Pune', 18000, 2, 2, 950, 'WiFi,Parking,Gym,Security', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'Rahul Sharma', '9876543210', 'rahul@example.com', 1),
('Spacious 3BHK Villa', 'Independent villa with garden, ideal for families.', 'Baner Road', 'Pune', 35000, 3, 3, 1800, 'Garden,Parking,Security,Power Backup', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Priya Mehta', '9765432100', 'priya@example.com', 1),
('Studio Apartment near IT Park', 'Modern studio, walking distance to Hinjewadi IT Park.', 'Hinjewadi Phase 1', 'Pune', 12000, 1, 1, 450, 'WiFi,AC,Security', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Amit Joshi', '9654321000', 'amit@example.com', 1),
('Luxury 4BHK Penthouse', 'Premium penthouse with rooftop access and panoramic views.', 'Kalyani Nagar', 'Pune', 75000, 4, 4, 3200, 'Rooftop,Pool,Gym,Parking,Security', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Sneha Patil', '9543210000', 'sneha@example.com', 1),
('1BHK near Shivaji Nagar', 'Affordable and well-connected flat for working professionals.', 'Shivaji Nagar', 'Pune', 9500, 1, 1, 550, 'Parking,Security', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'Vikram Singh', '9432100000', 'vikram@example.com', 1);
