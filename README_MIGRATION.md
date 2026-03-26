# Aaj Ka Mudda — MySQL Migration

This project has been migrated from MongoDB to MySQL for production readiness on Hostinger and other standard hosting environments.

## 🚀 Migration Overview
- **ORM**: Sequelize + mysql2
- **Database**: MySQL (Aiven)
- **Status**: Fully verified and seeded

## 🔑 Admin Credentials
- **URL**: `/login`
- **Email**: `admin@news.com`
- **Password**: `admin123`

## 🛠️ Configuration
Update the `.env` file in the `backend` directory with your database credentials.
A production-ready `.env.example` is provided.

## 📦 How to Run
1. Install dependencies in both `backend` and `frontend`.
2. Start backend: `npm run dev` (port 8000)
3. Start frontend: `npm run dev` (port 5173)

For detailed technical notes, refer to the migration walkthrough.
