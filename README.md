# Highway Delite - Experience Booking Platform

A fullstack web application for booking travel experiences with real-time slot availability, built with React (TypeScript), Node.js, Express, and PostgreSQL.

![Highway Delite](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop)

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend API**: [Deployed on Render](https://your-api.render.com)
- **GitHub Repository**: [View Code](https://github.com/yourusername/highway-delite)

## 📋 Features

- **Experience Browsing**: Browse curated travel experiences with beautiful imagery
- **Search Functionality**: Search experiences by name or location
- **Real-time Availability**: View available dates and time slots
- **Dynamic Pricing**: Automatic tax calculation and promo code support
- **Slot Booking**: Select dates, times, and quantity with live availability
- **Promo Codes**: Apply discount codes (SAVE10, FLAT100, WELCOME20)
- **Booking Confirmation**: Get unique reference IDs for confirmed bookings
- **Responsive Design**: Mobile-first design matching Figma specifications
- **Loading States**: Clear feedback for all async operations
- **Error Handling**: Comprehensive validation and error messages

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: pg (node-postgres)
- **Environment**: dotenv
- **Unique IDs**: uuid

## 📁 Project Structure

```
highway_delite/
├── backend/
│   ├── src/
│   │   ├── db.js              # Database connection & schema
│   │   ├── index.js           # Express server & routes
│   │   └── seed.js            # Database seeding script
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts       # API client & types
│   │   ├── components/
│   │   │   ├── Header.tsx     # Navigation header
│   │   │   └── ExperienceCard.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Experience listing
│   │   │   ├── Details.tsx    # Slot selection
│   │   │   ├── Checkout.tsx   # Booking form
│   │   │   └── Result.tsx     # Confirmation page
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/highway-delite.git
cd highway-delite
```

2. **Install all dependencies**
```bash
npm run install-all
```

### Database Setup

1. **Create PostgreSQL database**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE highway_delite;
```

2. **Configure backend environment**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/highway_delite
NODE_ENV=development
```

3. **Seed the database**
```bash
cd backend
npm run seed
```

This will create tables and populate them with:
- 9 sample experiences (Kayaking, Coffee Trail, Nandi Hills, etc.)
- 5 days of time slots for each experience
- 3 promo codes (SAVE10, FLAT100, WELCOME20)

### Frontend Configuration

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**Option 1: Run both frontend and backend together**
```bash
# From root directory
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Experiences

**GET `/api/experiences`**
- Returns list of all experiences
- Query params: `?search=kayak` (optional)
- Response: Array of experience objects

**GET `/api/experiences/:id`**
- Returns experience details with available slots
- Response: Experience object with slots grouped by date

### Bookings

**POST `/api/bookings`**
- Creates a new booking
- Body:
```json
{
  "experienceId": 1,
  "slotId": 5,
  "fullName": "John Doe",
  "email": "john@example.com",
  "quantity": 2,
  "date": "2025-10-22",
  "time": "09:00 am",
  "subtotal": 1998,
  "taxes": 100,
  "total": 2098,
  "promoCode": "SAVE10"
}
```
- Response: Booking confirmation with reference ID

### Promo Codes

**POST `/api/promo/validate`**
- Validates and calculates promo code discount
- Body:
```json
{
  "code": "SAVE10",
  "subtotal": 1998
}
```
- Response: Discount details

**Available Promo Codes:**
- `SAVE10` - 10% off
- `FLAT100` - ₹100 off
- `WELCOME20` - 20% off

## 🎨 Design Features

- **Exact Figma Match**: Pixel-perfect implementation of provided designs
- **Responsive Breakpoints**: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)
- **Typography Scale**: Inter font family with consistent sizing
- **Color Palette**: 
  - Primary: #FFC107 (Yellow)
  - Text: Gray scale (900, 600, 400)
  - Background: Gray 50
- **Interactive States**: Hover, active, disabled, loading
- **Smooth Transitions**: 150-300ms for all interactive elements

## 🔒 Data Validation

### Backend Validation
- Required field checks for all booking data
- Slot availability verification before booking
- Prevents double-booking of sold-out slots
- Email format validation
- Promo code validity checks

### Frontend Validation
- Email format validation
- Required field indicators
- Real-time promo code feedback
- Terms & conditions agreement
- Quantity constraints (min: 1)

## 🌐 Deployment

### Backend (Render/Railway)

1. Create new web service
2. Connect GitHub repository
3. Set environment variables:
```
DATABASE_URL=your_postgres_connection_string
PORT=5000
NODE_ENV=production
```
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`

### Frontend (Vercel/Netlify)

1. Create new project
2. Connect GitHub repository
3. Set build settings:
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/dist`
4. Add environment variable:
```
VITE_API_URL=https://your-backend-api.com/api
```

### Database (Render PostgreSQL/Supabase)

1. Create PostgreSQL instance
2. Copy connection string
3. Run seed script:
```bash
DATABASE_URL="your_connection_string" npm run seed
```

## 🧪 Testing the Application

### Test Flow
1. **Home Page**: Browse experiences, use search
2. **Details Page**: Select date & time slot
3. **Checkout**: Fill form, apply promo code
4. **Result**: View confirmation with reference ID

### Test Promo Codes
- Try `SAVE10` for 10% discount
- Try `FLAT100` for ₹100 flat discount
- Try `INVALID` to see error handling

### Edge Cases
- Try booking sold-out slots (should be disabled)
- Submit checkout without agreeing to terms
- Apply invalid promo codes
- Navigate back/forward between pages

## 📝 Data Sources

- **Experience Images**: Unsplash (royalty-free)
- **Experience Data**: Custom curated dataset
- **Location Data**: Real Indian destinations

## 🔧 Development Scripts

```bash
# Root
npm run dev          # Run both frontend & backend
npm run install-all  # Install all dependencies

# Backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm run seed         # Seed database

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

**Database connection fails:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

**Frontend can't reach backend:**
- Check VITE_API_URL in frontend `.env`
- Verify backend is running on correct port
- Check CORS settings in `backend/src/index.js`

**Slots not showing:**
- Run seed script to populate data
- Check date filtering (only future dates shown)
- Verify database queries in browser network tab

## 📄 License

This project is created as part of a fullstack developer internship assignment.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Highway Delite for the opportunity
- Unsplash photographers for beautiful imagery
- React and Node.js communities

---

**Note**: This is a demonstration project for educational purposes. All experience data and images are for illustrative use only.
