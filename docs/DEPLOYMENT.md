# Deployment Guide

Step-by-step instructions for deploying the NVIDIA SC Club website to production.

---

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │      │   Backend    │      │  Cloudinary  │
│   Vercel /   │─────▶│   Supabase   │─────▶│  (Storage)   │
│   Netlify    │      │ (DB & Auth)  │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## Prerequisites

- GitHub repository access
- Supabase account (free tier)
- Cloudinary account (free tier)
- Vercel or Netlify account (for frontend)
- Custom domain (optional)

---

## 1. Supabase Setup

### Create Production Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (e.g., `nvidia-sc-website-prod`)
3. Wait for the database to provision.

### Get Production Credentials

- **Project URL:** Found in Settings -> API
- **Anon Public Key:** Found in Settings -> API

### Create Initial Tables

In the Supabase SQL Editor, run your initial schema setup:
- `events`
- `team_members`
- `membership_applications`
- Set up Row Level Security (RLS) policies.

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

## 3. Frontend Deployment (Vercel)

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
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
```

### Custom Domain

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatic

---

## 4. Environment Variables Summary

### Production Checklist

| Variable | Where to Set |
|----------|--------------|
| `VITE_SUPABASE_URL` | Vercel |
| `VITE_SUPABASE_ANON_KEY` | Vercel |
| `VITE_CLOUDINARY_CLOUD_NAME` | Vercel |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Vercel |

---

## 5. Post-Deployment Verification

### Checklist

- [ ] Frontend loads at production URL
- [ ] Supabase connection successful (data loads)
- [ ] Login with Google / GitHub works (update OAuth redirect URIs in Supabase!)
- [ ] Admin dashboard loads after login
- [ ] Submit a membership form -> appears in Supabase
- [ ] Upload an image → stored in Cloudinary, displays correctly
- [ ] Responsive layout works on mobile
- [ ] 3D model loads (check console for errors)
- [ ] No mixed content warnings (all HTTPS)

### Supabase Keep-Alive

*Note: Supabase pauses free-tier projects after 1 week of inactivity.*
To prevent this, you can configure a GitHub Action cron job to periodically ping your database, or simply ensure regular activity.

---

## 6. Troubleshooting

### Supabase Connection Fails

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check if your Supabase project was paused due to inactivity
- Verify RLS policies are not accidentally blocking reads

### Cloudinary Upload Fails

- Verify `VITE_CLOUDINARY_CLOUD_NAME` is correct
- Ensure the upload preset is set to "Unsigned"

### Build Fails on Vercel

- Check the build log in Vercel dashboard
- Ensure all env vars prefixed with `VITE_` are set
- Run `npm run build` locally in `client/` to reproduce

---

## 7. Rollback

### Frontend (Vercel)
- Go to Vercel → Deployments
- Find the last working deployment
- Click "Promote to Production"

### Database (Supabase)
- Supabase provides point-in-time recovery on Pro plans.
- For free tier, take regular pg_dump backups or use the Supabase CLI to backup your schema and data.
