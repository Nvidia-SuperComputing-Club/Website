# Deployment Guide

Step-by-step instructions for deploying the NVIDIA SC Club website to production.

---

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │      │   Backend    │      │   MongoDB    │      │  Cloudinary  │
│   Vercel /   │─────▶│   Railway /  │─────▶│   Atlas      │      │  (Storage)   │
│   Netlify    │      │   Render     │      │   (Database) │      │              │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

---

## Prerequisites

- GitHub repository access
- MongoDB Atlas account (free tier M0 works)
- Cloudinary account (free tier works)
- Vercel or Netlify account (for frontend)
- Railway or Render account (for backend)
- Custom domain (optional)

---

## 1. MongoDB Atlas Setup

### Create Production Cluster

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Create a new project (e.g., `nvidia-sc-website-prod`)
3. Build a cluster (M0 free tier for development/staging)
4. Create a database user with read/write access
5. Whitelist IP addresses (or use `0.0.0.0/0` for initial setup)
6. Get the connection string

### Get Production Credentials

- **Connection String:** `mongodb+srv://<username>:<password>@cluster.mongodb.net/nvidia-sc-website?retryWrites=true&w=majority`
- Replace `<username>` and `<password>` with your database user credentials

### Create Initial Collections

In MongoDB Atlas, go to Collections and create:
- `events`
- `teams`
- `homepagecontents`
- `adminusers`

(These will be auto-created by Mongoose on first write, but creating them manually ensures indexes are set up.)

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

## 3. Backend Deployment (Railway)

### Setup

1. Connect your GitHub repo to Railway
2. Set the **root directory** to `server/`
3. Set the **build command:** `npm install`
4. Set the **start command:** `node index.js`

### Environment Variables

Set these in Railway's dashboard → Variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nvidia-sc-website?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret-min-32-chars
CORS_ORIGIN=https://your-frontend-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Verify

- Railway provides a URL like `your-app.up.railway.app`
- Visit `https://your-app.up.railway.app/api/health` — should return `{"status":"ok"}`

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
VITE_API_URL=https://your-backend-domain.up.railway.app/api
```

### Custom Domain

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatic

---

## 5. Environment Variables Summary

### Production Checklist

| Variable | Frontend | Backend | Where to Set |
|----------|----------|---------|--------------|
| `VITE_API_URL` | ✅ | — | Vercel |
| `PORT` | — | ✅ | Railway |
| `MONGODB_URI` | — | ✅ | Railway |
| `JWT_SECRET` | — | ✅ | Railway |
| `CORS_ORIGIN` | — | ✅ | Railway |
| `GOOGLE_CLIENT_ID` | — | ✅ | Railway |
| `GOOGLE_CLIENT_SECRET` | — | ✅ | Railway |
| `GITHUB_CLIENT_ID` | — | ✅ | Railway |
| `GITHUB_CLIENT_SECRET` | — | ✅ | Railway |
| `CLOUDINARY_CLOUD_NAME` | — | ✅ | Railway |
| `CLOUDINARY_API_KEY` | — | ✅ | Railway |
| `CLOUDINARY_API_SECRET` | — | ✅ | Railway |

---

## 6. Post-Deployment Verification

### Checklist

- [ ] Frontend loads at production URL
- [ ] Backend health endpoint responds
- [ ] MongoDB Atlas connection successful (check logs)
- [ ] Public API endpoints return data (`GET /api/events`, `GET /api/team`)
- [ ] Login with Google works
- [ ] Login with GitHub works
- [ ] Admin dashboard loads after login
- [ ] Create an event in CMS → appears on public Events page
- [ ] Upload an image → stored in Cloudinary, displays correctly
- [ ] Team member CRUD works
- [ ] Responsive layout works on mobile
- [ ] 3D model loads (check console for errors)
- [ ] No mixed content warnings (all HTTPS)
- [ ] Lighthouse score > 90 for Performance

### Smoke Test Script

```bash
# Test frontend
curl -s -o /dev/null -w "%{http_code}" https://your-frontend.vercel.app
# Should return 200

# Test backend
curl -s https://your-backend.up.railway.app/api/health
# Should return {"status":"ok"}

# Test API
curl -s https://your-backend.up.railway.app/api/events | head -c 200
# Should return JSON with events data
```

---

## 7. Troubleshooting

### CORS Errors

Ensure `CORS_ORIGIN` on the backend matches the exact frontend URL (including `https://`).

### MongoDB Connection Fails

- Verify `MONGODB_URI` is correct and includes the database name
- Check MongoDB Atlas → Network Access → IP whitelist (allow `0.0.0.0/0` for cloud deployments)
- Verify database user has read/write permissions
- Check that the cluster is not paused (M0 free tier pauses after inactivity)

### Cloudinary Upload Fails

- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct
- Check Cloudinary dashboard for upload activity and error logs
- Ensure the upload preset is set to "Unsigned" if not using signed uploads

### 3D Model Not Loading

- Ensure the GLTF/GLB file is in `client/public/` or referenced correctly
- Check browser console for 404 on model file
- Verify the model file size isn't too large for free tier hosting

### Build Fails on Vercel

- Check the build log in Vercel dashboard
- Ensure all env vars prefixed with `VITE_` are set
- Run `npm run build` locally in `client/` to reproduce

---

## 8. CI/CD (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bervProject/railway-deploy@main
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: your-service-name
```

---

## 9. Rollback

### Frontend (Vercel)
- Go to Vercel → Deployments
- Find the last working deployment
- Click "Promote to Production"

### Backend (Railway)
- Go to Railway → Deployments
- Find the last working deployment
- Click "Rollback to this version"

### Database (MongoDB Atlas)
- MongoDB Atlas free tier does not support point-in-time recovery
- Use `mongodump` to back up before major migrations
- Restore with `mongorestore` if needed
- Consider upgrading to M10+ for continuous backups in production
