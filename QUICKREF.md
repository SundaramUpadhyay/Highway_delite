# 🎯 Highway Delite - Quick Reference

## 🚀 Start Commands

```powershell
# Start everything
npm run dev

# Start separately
npm run server     # Backend only
npm run client     # Frontend only

# Install all
npm run install-all
```

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🎫 Test Promo Codes

```
SAVE10     → 10% off
FLAT100    → ₹100 off
WELCOME20  → 20% off
```

## 📡 API Quick Test

```powershell
# Test health
curl http://localhost:5000/api/health

# Get experiences
curl http://localhost:5000/api/experiences

# Get experience details
curl http://localhost:5000/api/experiences/1

# Test promo code
curl -X POST http://localhost:5000/api/promo/validate `
  -H "Content-Type: application/json" `
  -d '{\"code\":\"SAVE10\",\"subtotal\":1000}'
```

## 📂 Important Files

```
backend/.env              → Database config
frontend/.env             → API URL
backend/src/index.js      → API routes
frontend/src/App.tsx      → Main app
backend/src/seed.js       → Database seed
```

## 🗄️ Database Commands

```powershell
# Seed database
cd backend
npm run seed

# Connect to database
psql -U postgres -d highway_delite

# View tables
\dt

# View experiences
SELECT * FROM experiences;

# View promo codes
SELECT * FROM promo_codes;
```

## 🛠️ Useful Commands

```powershell
# View backend logs
cd backend
npm run dev

# Build frontend
cd frontend
npm run build

# Preview production build
cd frontend
npm run preview

# Check ports in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

## 📊 Database Schema

```sql
experiences
├── id (serial)
├── name (varchar)
├── location (varchar)
├── description (text)
├── price (integer)
└── image_url (text)

slots
├── id (serial)
├── experience_id (integer)
├── date (date)
├── time (varchar)
├── available_spots (integer)
└── total_spots (integer)

bookings
├── id (serial)
├── reference_id (varchar)
├── experience_id (integer)
├── slot_id (integer)
├── full_name (varchar)
├── email (varchar)
├── quantity (integer)
├── date (date)
├── time (varchar)
├── subtotal (integer)
├── taxes (integer)
├── total (integer)
└── promo_code (varchar)

promo_codes
├── id (serial)
├── code (varchar)
├── discount_type (varchar)
├── discount_value (integer)
└── is_active (boolean)
```

## 🎨 Design Specs

**Colors:**
- Primary: #FFC107 (Yellow)
- Text: Gray-900, Gray-600
- Background: Gray-50

**Fonts:**
- Family: Inter
- Weights: 400, 500, 600, 700

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ⚡ Feature Checklist

- [x] Browse experiences
- [x] Search functionality
- [x] View details with slots
- [x] Real-time availability
- [x] Date & time selection
- [x] Quantity selector
- [x] Price calculation
- [x] Promo code validation
- [x] Booking confirmation
- [x] Reference ID generation
- [x] Responsive design
- [x] Loading states
- [x] Error handling

## 🐛 Quick Fixes

**Port in use:**
```powershell
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

**Database reset:**
```powershell
psql -U postgres
DROP DATABASE highway_delite;
CREATE DATABASE highway_delite;
\q
cd backend
npm run seed
```

**Clear node_modules:**
```powershell
# Root
Remove-Item -Recurse -Force node_modules

# Backend
cd backend
Remove-Item -Recurse -Force node_modules

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules

# Reinstall
npm run install-all
```

## 📱 Test Scenarios

1. **Happy Path:**
   - Browse → Select → Book → Confirm

2. **Search:**
   - Search "Kayak" → View results

3. **Promo Code:**
   - Add to cart → Apply SAVE10 → See discount

4. **Sold Out:**
   - Try to select sold-out slot → See disabled

5. **Validation:**
   - Submit empty form → See errors

## 🚀 Deploy Checklist

- [ ] Push to GitHub
- [ ] Create Render PostgreSQL
- [ ] Seed production database
- [ ] Deploy backend to Render
- [ ] Test API endpoints
- [ ] Deploy frontend to Vercel
- [ ] Update VITE_API_URL
- [ ] Test full flow
- [ ] Check mobile responsiveness
- [ ] Monitor logs

## 📞 Support

- **README.md** - Full documentation
- **SETUP.md** - Setup guide
- **DEPLOYMENT.md** - Deployment guide
- **GitHub Issues** - Report bugs

---

**Pro Tip**: Keep this file open while developing! 💡
