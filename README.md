
# 🏠 HouseHunt – Smart House Suggestion System

A complete full-stack web application for house rental listings built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

---

## 📁 Project Folder Structure

```
househunt/
│
├── frontend/                   ← All HTML/CSS/JS pages
│   ├── index.html              ← Home page
│   ├── css/
│   │   └── style.css           ← Main stylesheet
│   ├── js/
│   │   ├── api.js              ← API helper functions
│   │   └── auth.js             ← Auth helper functions
│   └── pages/
│       ├── login.html          ← User login
│       ├── register.html       ← User registration
│       ├── listings.html       ← Browse all houses
│       ├── house-detail.html   ← Single house detail
│       ├── admin-login.html    ← Admin login
│       └── admin-dashboard.html← Admin panel
│
├── backend/                    ← Node.js server
│   ├── server.js               ← Main entry point
│   ├── .env.example            ← Environment variables template
│   ├── package.json            ← Dependencies
│   ├── config/
│   │   └── db.js               ← MySQL connection
│   ├── middleware/
│   │   └── authMiddleware.js   ← JWT auth middleware
│   ├── routes/
│   │   ├── authRoutes.js       ← Login/register routes
│   │   └── houseRoutes.js      ← House CRUD routes
│   └── controllers/
│       ├── authController.js   ← Auth logic
│       └── houseController.js  ← House CRUD logic
│
└── database/
    └── househunt.sql           ← All SQL CREATE TABLE queries
```

---

## 🛠️ STEP 1: Install Required Software

### Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS version** (Long Term Support)
3. Install it — click Next → Next → Finish
4. Verify installation:
```bash
node --version    # should show v18.x.x or higher
npm --version     # should show 9.x.x or higher
```

### Install MySQL
1. Go to https://dev.mysql.com/downloads/installer/
2. Download MySQL Installer → Install MySQL Server
3. Set root password (remember it!)
4. Install MySQL Workbench (GUI tool to run SQL queries)

---

## 🗄️ STEP 2: Setup Database

1. Open **MySQL Workbench** and connect with root user
2. Open the file `database/househunt.sql`
3. Click the **Run (⚡)** button to execute all queries
4. This will create the `househunt` database and all tables

### Create Default Admin (run in MySQL):
```sql
USE househunt;

-- First install bcryptjs to hash password, OR use this pre-hashed version of "admin123"
INSERT INTO admins (name, email, password) VALUES (
  'Admin',
  'admin@househunt.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);
```
> **Note:** The hashed password above = `admin123`  
> Admin login: `admin@househunt.com` / `admin123`

---

## ⚙️ STEP 3: Setup Backend

### Navigate to backend folder:
```bash
cd househunt/backend
```

### Install dependencies:
```bash
npm install
```

### Create `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

### Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=vit@123$
DB_NAME=househunt_db
JWT_SECRET=mySecretKeyForHouseHunt2024
PORT=5000
```

### Start the backend server:
```bash
node server.js
```

You should see:
```
✅ MySQL Database connected successfully!
🚀 Server running at http://localhost:5000
```

> **Tip:** Use `npx nodemon server.js` for auto-restart during development

---

## 🌐 STEP 4: Setup Frontend

The frontend is **plain HTML** — no build tools needed!

1. Open `frontend/js/api.js`
2. Make sure this line points to your backend:
```javascript
const BASE_URL = 'http://localhost:5000/api';
```

### Open the website:
- Simply open `frontend/index.html` in your browser
- OR use VS Code **Live Server** extension (recommended!)

Install Live Server in VS Code:
- Open VS Code → Extensions → Search "Live Server" → Install
- Right-click `index.html` → "Open with Live Server"

---

## 🔗 STEP 5: API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | User login | No |
| POST | /api/auth/admin/login | Admin login | No |
| GET | /api/houses | Get all houses | No |
| GET | /api/houses/:id | Get single house | No |
| POST | /api/book | Send booking request | User Token |
| POST | /api/admin/houses | Add house | Admin Token |
| PUT | /api/admin/houses/:id | Update house | Admin Token |
| DELETE | /api/admin/houses/:id | Delete house | Admin Token |
| GET | /api/admin/users | Get all users | Admin Token |
| GET | /api/admin/bookings | Get all bookings | Admin Token |

### Test APIs with this URL:
```
http://localhost:5000/api/houses
```

---

## 📊 Database Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK AUTO_INCREMENT | Unique user ID |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(100) UNIQUE | Email address |
| password | VARCHAR(255) | Hashed password |
| phone | VARCHAR(20) | Phone number |
| created_at | TIMESTAMP | Registration date |

### admins
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Admin ID |
| name | VARCHAR(100) | Admin name |
| email | VARCHAR(100) UNIQUE | Admin email |
| password | VARCHAR(255) | Hashed password |

### houses
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK AUTO_INCREMENT | House ID |
| title | VARCHAR(200) | Listing title |
| city | VARCHAR(100) | City name |
| location | VARCHAR(200) | Area/locality |
| price | DECIMAL(10,2) | Monthly rent |
| bedrooms | INT | Number of bedrooms |
| bathrooms | INT | Number of bathrooms |
| area_sqft | INT | Area in square feet |
| house_type | ENUM | Apartment/Villa/Studio/Independent |
| furnished | ENUM | Furnished/Semi/Unfurnished |
| available | BOOLEAN | Is it available |
| owner_name, phone, email | VARCHAR | Owner contact info |
| image_url | VARCHAR(500) | House image URL |

### bookings
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Booking ID |
| user_id | INT FK → users.id | Which user |
| house_id | INT FK → houses.id | Which house |
| message | TEXT | User's message |
| status | ENUM | Pending/Confirmed/Rejected |

---

## 🚀 STEP 6: Deploy to GitHub + Render + Vercel

### Upload to GitHub:
```bash
# In the househunt folder
git init
git add .
git commit -m "Initial commit: HouseHunt project"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/househunt.git
git push -u origin main
```

### Deploy Backend to Render:
1. Go to https://render.com → Sign up free
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables (same as .env file)
6. Click **Deploy** → Copy your URL (e.g., `https://househunt-api.onrender.com`)

### Deploy Frontend to Vercel:
1. Go to https://vercel.com → Sign up free
2. Click **New Project** → Import from GitHub
3. Settings:
   - **Root Directory:** `frontend`
   - Framework: Other (plain HTML)
4. Before deploying, update `frontend/js/api.js`:
```javascript
const BASE_URL = 'https://your-render-url.onrender.com/api';
```
5. Click **Deploy** → Your site is live!

---

## 🧪 Testing Checklist

- [ ] Backend running: Visit http://localhost:5000 — should see JSON message
- [ ] Database connected: Check terminal for "✅ MySQL Database connected"
- [ ] Register a user on the website
- [ ] Login with that user
- [ ] Browse houses on listings page
- [ ] Filter by city and price
- [ ] Click a house to view details
- [ ] Send a contact request (when logged in)
- [ ] Login as admin: admin@househunt.com / admin123
- [ ] Add a new house from admin panel
- [ ] Edit and delete a house
- [ ] View all users and bookings

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot connect to MySQL` | Check DB_PASSWORD in .env |
| `Port 5000 already in use` | Change PORT=5001 in .env |
| `CORS error in browser` | Backend must be running |
| `Token invalid` | Clear localStorage in browser |
| Houses not showing | Make sure backend is running first |

---

## 📞 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Database | MySQL with mysql2 driver |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deployment | GitHub + Render + Vercel |

---


# househunt
HouseHunt - Smart House Suggestion System 

