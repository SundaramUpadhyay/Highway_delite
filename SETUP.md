# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```powershell
# From root directory
npm install
npm run install-all
```

### Step 2: Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```powershell
# Install PostgreSQL if not already installed
# Download from: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE highway_delite;
\q
```

**Option B: Use Docker**
```powershell
docker run --name highway-delite-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=highway_delite -p 5432:5432 -d postgres
```

### Step 3: Configure Environment

**Backend:**
```powershell
cd backend
# .env file already created with default values
# Update password in DATABASE_URL if needed
```

**Frontend:**
```powershell
cd frontend
# .env file already created
```

### Step 4: Seed Database
```powershell
cd backend
npm run seed
```

Expected output:
```
Initializing database...
Database tables initialized successfully
Seeding experiences...
Seeding promo codes...
Database seeded successfully!
```

### Step 5: Run Application
```powershell
# From root directory
npm run dev
```

This starts:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

### Step 6: Test the Application

1. Open http://localhost:3000
2. Browse experiences
3. Click "View Details" on any card
4. Select date and time
5. Click "Confirm"
6. Fill checkout form
7. Try promo code: **SAVE10**
8. Submit booking

## 🧪 Test Promo Codes

- `SAVE10` - 10% discount
- `FLAT100` - ₹100 off
- `WELCOME20` - 20% discount

## 📡 API Endpoints

Test backend directly:
- http://localhost:5000/api/health
- http://localhost:5000/api/experiences
- http://localhost:5000/api/experiences/1

## 🐛 Common Issues

**PostgreSQL not running:**
```powershell
# Windows: Start PostgreSQL service
net start postgresql-x64-14
```

**Port already in use:**
```powershell
# Change ports in .env files
# Backend: PORT=5001 in backend/.env
# Frontend: Update vite.config.ts server.port
```

**Database connection error:**
- Check PostgreSQL is running
- Verify credentials in backend/.env
- Ensure database exists

## 📁 Project Structure

```
highway_delite/
├── backend/           # Express API
├── frontend/          # React app
├── README.md          # Full documentation
├── DEPLOYMENT.md      # Deployment guide
└── SETUP.md          # This file
```

## 🎯 Next Steps

1. ✅ Set up local environment
2. ✅ Test all features
3. 📱 Check mobile responsiveness
4. 🚀 Deploy to production (see DEPLOYMENT.md)
5. 🎨 Customize branding
6. 📊 Add analytics

## 💡 Tips

- Use PostgreSQL GUI: pgAdmin or DBeaver
- Check browser console for errors
- View network tab for API calls
- Backend logs show all requests

## 📚 Documentation

- **README.md** - Complete project documentation
- **DEPLOYMENT.md** - Production deployment guide
- **API docs** - See README.md API section

## 🤝 Need Help?

1. Check the full README.md
2. Review DEPLOYMENT.md for hosting
3. Check logs in terminal
4. Verify environment variables

Happy coding! 🎉
