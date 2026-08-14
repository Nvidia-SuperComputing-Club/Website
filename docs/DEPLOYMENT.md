# Deployment Guide

Step-by-step instructions for deploying the NVIDIA SC Club website to production.

---

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │      │   Backend    │      │  Cloudinary  │
│   Vercel /   │─────▶│  Express +   │─────▶│  (Storage)   │
│   Netlify    │      │  MongoDB     │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## Prerequisites

- GitHub repository access
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier)
- Vercel or Netlify account (for frontend)
- Render, Railway, or similar (for backend)
- Custom domain (optional)

---

## 1. MongoDB Setup

### Create Production Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your server IP address (or use 0.0.0.0/0 for testing)
5. Get your connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nvidia-sc-website`

---

## 2. Cloudinary Setup

### Create Account

1. Go to [Cloudinary Dashboard](https://cloudinary.com)
2. Sign up for a free account
3. Note your credentials from the Dashboard:
   - **Cloud Name:** Found in the upper left
   - **API Key:** Found in Account → API Keys
   - **API Secret:** Found in Account → API Keys (click to reveal)

---

## 3. Backend Deployment (Render / Railway)

### Setup

1. Connect your GitHub repo to Render/Railway
2. Set the **root directory** to `server/`
3. Set the **build command** to `npm install`
4. Set the **start command** to `node index.js`
5. Set environment variables (see below)

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
CORS_ORIGIN=https://your-frontend-domain.vercel.app
JWT_SECRET=your_production_jwt_secret_key
JWT_EXPIRY=1h
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Seed Database

After deployment, run the seed script:
```bash
node seed.js
```

---

## 4. Frontend Deployment (Vercel)

### Setup

1. Connect your GitHub repo to Vercel
2. Set the **root directory** to `client/`
3. Vercel auto-detects Vite — no config needed
4. **Build command:** `npm run build`
5. **Output directory:** `dist`

### Environment Variables

Set in Vercel dashboard → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-backend-domain.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Custom Domain

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatic

---

## 5. Environment Variables Summary

### Production Checklist

| Variable | Where to Set | Description |
|----------|--------------|-------------|
| `MONGODB_URI` | Render/Railway | MongoDB connection string |
| `JWT_SECRET` | Render/Railway | Secret key for JWT signing |
| `CORS_ORIGIN` | Render/Railway | Frontend production URL |
| `CLOUDINARY_*` | Render/Railway | Cloudinary credentials |
| `VITE_API_URL` | Vercel | Backend API URL |
| `VITE_SUPABASE_URL` | Vercel | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vercel | Supabase anon key |

---

## 6. Post-Deployment Verification

### Checklist

- [ ] Frontend loads at production URL
- [ ] Backend API health check passes (`GET /api/health`)
- [ ] Events page loads from MongoDB
- [ ] Team page loads from MongoDB
- [ ] Admin login works
- [ ] Admin dashboard loads after login
- [ ] CRUD operations work in admin CMS
- [ ] Upload an image → stored in Cloudinary, displays correctly
- [ ] Responsive layout works on mobile
- [ ] 3D model loads (check console for errors)
- [ ] No mixed content warnings (all HTTPS)

---

## 7. Troubleshooting

### MongoDB Connection Fails

- Verify `MONGODB_URI` is correct and includes credentials
- Check if your MongoDB Atlas cluster is running
- Verify IP whitelist includes your server IP

### Backend Build Fails

- Check the build log in Render/Railway dashboard
- Ensure all env vars are set correctly
- Run `npm run build` locally in `server/` to reproduce

### Frontend Build Fails

- Check the build log in Vercel dashboard
- Ensure all env vars prefixed with `VITE_` are set
- Run `npm run build` locally in `client/` to reproduce

---

## 8. Rollback

### Frontend (Vercel)
- Go to Vercel → Deployments
- Find the last working deployment
- Click "Promote to Production"

### Database (Supabase)
- Supabase provides point-in-time recovery on Pro plans.
- For free tier, take regular pg_dump backups or use the Supabase CLI to backup your schema and data.
