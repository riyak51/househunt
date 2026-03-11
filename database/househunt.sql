-- ============================================================
-- HouseHunt - Smart House Suggestion System
-- Database: MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS househunt;
USE househunt;

-- TABLE 1: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: admins
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 3: houses
CREATE TABLE houses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area_sqft INT,
    house_type ENUM('Apartment','Villa','Studio','Independent House') DEFAULT 'Apartment',
    furnished ENUM('Furnished','Semi-Furnished','Unfurnished') DEFAULT 'Unfurnished',
    available BOOLEAN DEFAULT TRUE,
    owner_name VARCHAR(100),
    owner_phone VARCHAR(20),
    owner_email VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLE 4: bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    house_id INT NOT NULL,
    message TEXT,
    status ENUM('Pending','Confirmed','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

-- Sample Houses
INSERT INTO houses (title, description, location, city, price, bedrooms, bathrooms, area_sqft, house_type, furnished, available, owner_name, owner_phone, owner_email, image_url) VALUES
('Modern 2BHK Apartment', 'Beautiful apartment with city view, 24/7 security, parking available.', 'Koregaon Park', 'Pune', 18000, 2, 2, 950, 'Apartment', 'Semi-Furnished', TRUE, 'Rahul Sharma', '9876543210', 'rahul@gmail.com', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'),
('Spacious 3BHK Villa', 'Luxurious villa with private garden and modular kitchen.', 'Baner', 'Pune', 45000, 3, 3, 2200, 'Villa', 'Furnished', TRUE, 'Priya Mehta', '9876543211', 'priya@gmail.com', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'),
('Studio Apartment', 'Compact and cozy studio near IT park, ideal for working professionals.', 'Hinjewadi', 'Pune', 10000, 1, 1, 450, 'Studio', 'Furnished', TRUE, 'Suresh Patil', '9876543212', 'suresh@gmail.com', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'),
('1BHK Flat in Mumbai', 'Well maintained flat close to metro station.', 'Andheri West', 'Mumbai', 25000, 1, 1, 600, 'Apartment', 'Semi-Furnished', TRUE, 'Kavita Nair', '9876543213', 'kavita@gmail.com', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'),
('Independent House', 'Spacious independent house with terrace and garage.', 'Whitefield', 'Bangalore', 30000, 4, 3, 1800, 'Independent House', 'Unfurnished', TRUE, 'Arun Kumar', '9876543214', 'arun@gmail.com', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600'),
('Luxury 2BHK Flat', 'Premium flat with gym, swimming pool, and club house.', 'Jubilee Hills', 'Hyderabad', 22000, 2, 2, 1100, 'Apartment', 'Furnished', TRUE, 'Sita Reddy', '9876543215', 'sita@gmail.com', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600');
