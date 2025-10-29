# Deployment Guide - Highway Delite

## Prerequisites for Deployment
- GitHub account
- Render account (for backend + database)
- Vercel account (for frontend)

---

## 1. Database Deployment (Render PostgreSQL)

### Step 1: Create PostgreSQL Instance
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: highway-delite-db
   - **Database**: highway_delite
   - **User**: postgres (default)
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. **Save these credentials**:
   - Internal Database URL
   - External Database URL
   - PSQL Command

### Step 2: Seed Database
```bash
# Use external database URL
DATABASE_URL="your_external_database_url" npm run seed
```

Or connect via PSQL and run seed script manually.

---

## 2. Backend Deployment (Render)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `.gitignore` excludes `.env` and `node_modules`

### Step 2: Create Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: highway-delite-api
   - **Region**: Same as database
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

### Step 3: Environment Variables
Add these in Render dashboard under "Environment":
```
DATABASE_URL=<your_internal_database_url_from_step1>
NODE_ENV=production
PORT=5000
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Test API: `https://your-api.onrender.com/api/health`
4. **Save your API URL**

### Important Notes
- Free tier sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid plan for production use

---

## 3. Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Update API URL for production
2. Test build locally:
```bash
cd frontend
npm run build
npm run preview
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Environment Variables
Add in Vercel dashboard:
```
VITE_API_URL=https://your-api.onrender.com/api
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Visit your site: `https://your-app.vercel.app`

### Automatic Deployments
- Every push to `main` branch auto-deploys
- Pull requests get preview deployments
- Configure in Vercel settings

---

## 4. Alternative: Railway Deployment

### For Backend + Database Together

1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add Node.js service
5. Configure environment variables
6. Deploy!

Railway offers:
- Better free tier (500 hours/month)
- Faster cold starts
- Built-in PostgreSQL

---

## 5. Post-Deployment Checklist

### Backend
- [ ] API health check responds
- [ ] `/api/experiences` returns data
- [ ] CORS configured for frontend domain
- [ ] Database seeded with experiences
- [ ] Promo codes working

### Frontend
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] API calls successful
- [ ] Search functionality works
- [ ] Booking flow completes
- [ ] Mobile responsive

### Testing
```bash
# Test backend
curl https://your-api.onrender.com/api/health
curl https://your-api.onrender.com/api/experiences

# Test promo code
curl -X POST https://your-api.onrender.com/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","subtotal":1000}'
```

---

## 6. Custom Domain (Optional)

### For Vercel Frontend
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records
4. Wait for SSL certificate

### For Render Backend
1. Go to Service Settings
2. Add custom domain
3. Configure DNS
4. Enable automatic SSL

---

## 7. Monitoring & Logs

### Render
- View logs in dashboard
- Set up email alerts
- Monitor CPU/memory usage

### Vercel
- View deployment logs
- Analytics dashboard
- Real-time error tracking

---

## 8. Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api.onrender.com/api
```

---

## 9. Troubleshooting

### Backend Issues
**Problem**: 502 Bad Gateway
- Solution: Check if service is running, view logs

**Problem**: Database connection failed
- Solution: Verify DATABASE_URL is correct

**Problem**: Slow response times
- Solution: Upgrade from free tier or use Railway

### Frontend Issues
**Problem**: API calls failing
- Solution: Check VITE_API_URL is correct
- Solution: Verify CORS headers in backend

**Problem**: 404 on page refresh
- Solution: Vercel handles this automatically for Vite

### CORS Issues
Make sure backend has:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 10. Scaling Considerations

### Database
- Start with free PostgreSQL
- Monitor connection count
- Add connection pooling for high traffic
- Consider managed services (Supabase, Neon)

### Backend
- Free tier for demos
- Paid tier for production
- Add Redis for caching
- Implement rate limiting

### Frontend
- Vercel scales automatically
- Add CDN for images
- Optimize bundle size
- Implement lazy loading

---

## 11. Cost Estimation

### Free Tier (Demo)
- Render PostgreSQL: Free (90 days, then $7/month)
- Render Web Service: Free (sleeps after 15 min)
- Vercel: Free
- **Total**: $0 (with limitations)

### Production
- Railway Database: $5/month
- Railway Backend: $5/month
- Vercel Pro: $20/month
- **Total**: $30/month

---

## 12. CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm run install-all
      - name: Run tests
        run: npm test
      - name: Deploy to Vercel
        run: vercel --prod
```

---

## Support

For deployment issues:
1. Check service logs
2. Review environment variables
3. Test API endpoints
4. Verify database connection

Happy Deploying! 🚀
