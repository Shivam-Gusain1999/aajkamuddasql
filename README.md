# Aaj Ka Mudda News Platform 🗞️

A comprehensive, full-stack journalism and news distribution platform built for scale. "Aaj Ka Mudda" features a highly-optimized public newsfeed, native YouTube integrations, and a secure Role-Based Access Control (RBAC) Admin Dashboard for seamless content management.

---

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** React.js (via Vite)
- **Styling:** Vanilla CSS (fully responsive, mobile-first design)
- **Routing:** React Router DOM
- **State Management:** React Context API (`UserContext`)
- **SEO & Meta:** React Helmet Async (for dynamic OpenGraph tags)
- **Icons:** Lucide React

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize (with Connection Pooling and SSL support)
- **Authentication:** JWT (Http-Only cookies, short-lived Access + long-lived Refresh tokens)
- **File Storage:** Cloudinary (Multipart/form-data via Multer)
- **Security:** Helmet.js, rate-limiting, and strict CORS handling

---

## ✨ Core Features

### For Readers
- **Dynamic Newsfeed:** Smooth feed with sticky sidebars and native HTML5 lazy-loading.
- **Content Types:** Supports standard articles, YouTube video embeds, Web Stories, and e-Papers.
- **Categorization:** Advanced category filtering (e.g., Top News, Sports, Tech, Politics).
- **Live Widgets:** Real-time localized Weather & AQI widgets.

### For Administrators (CMS)
- **Multi-Role Support:** Admins, Editors, Reporters.
- **Full Content CMS:** Create, Read, Update, and Delete capabilities for articles, videos, and ads.
- **Monetization:** Built-in Ad placement engine for sidebar and feed slots.
- **Analytics Dashboard:** Real-time tracking of total articles, video content, and active users.

---

## 🛠️ Project Setup & Installation

Follow these steps to get the project running locally.

### 1. Pre-requisites
- **Node.js** (v18 or higher)
- **MySQL** (Local or Aiven/Hosting instance)
- **Cloudinary Account** (for media uploads)

### 2. Clone the Repository
```bash
git clone https://github.com/Shivam-Gusain1999/aajkamuddasql.git
cd aajkamuddasql
```

### 3. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=8000
DATABASE_URL=mysql://user:pass@host:port/dbname?ssl-mode=REQUIRED

# Or individual values
DB_HOST=your_host
DB_PORT=3306
DB_NAME=your_db_name
DB_USER=your_user
DB_PASSWORD=your_password
DB_SSL=true

CORS_ORIGIN=http://localhost:5173

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database:
```bash
node seed_admin.js
node seed.js
```

Start backend:
```bash
npm run dev
```

### 4. Frontend Setup
Navigate into the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start frontend:
```bash
npm run dev
```

---

## 🏗️ Project Architecture
```text
aajkamudda/
│
├── backend/                   # Express.js Server
│   ├── src/
│   │   ├── config/            # Database (Sequelize) & Cloudinary config
│   │   ├── controllers/       # MySQL logic (Sequelize queries)
│   │   ├── middlewares/       # JWT Auth, Multer
│   │   ├── models/            # Sequelize Model Definitions & Associations
│   │   ├── routes/            # Express Routers
│   │   └── app.js             # Express configuration
│   └── seed.js                # Initial data population script
│
└── frontend/                  # React Vite Application
    ├── src/
    │   ├── assets/            # Axios configurations
    │   ├── components/        # UI components & Dashboards
    │   └── App.jsx            # Routing
```

---

## 🔒 Performance & Handover Notes
1. **MySQL Optimized:** Project migrated from MongoDB to MySQL using Sequelize for better compatibility with shared hosting (Hostinger).
2. **Connection Pooling:** Backend uses Sequelize connection pooling to stay within database connection limits.
3. **Admin Assets:** Standard Admin Login is `admin@news.com` / `admin123`.

---
*Developed for Aaj Ka Mudda news portal.*

---

## 🔒 Security & Performance Handover Notes
This project has recently been audited for production readiness:
1. **Codebase Internationalization:** All developer documentation and code comments have been translated to pure English, making it highly maintainable for global development teams.
2. **Scroll Jank Eliminated:** The heavy javascript-based sidebars were replaced with optimized, hardware-accelerated `requestAnimationFrame` loops, delivering native-app like smooth scrolling.
3. **Database Scalability:** Compound indices (`status` + `category` + `createdAt`) were implemented at the Mongoose level, guaranteeing query speeds remain instant even beyond 100,000 articles.
4. **Security Hardened:** `helmet()` is active to block Cross-Site Scripting (XSS), and CORS is strictly verified.

---
*Maintained and Developed by Shivam & Ankit.*
