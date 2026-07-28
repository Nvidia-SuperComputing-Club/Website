# Architecture

This document describes the system architecture, data flow, and key technical decisions for the NVIDIA Super Computing Club website.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  React 19 + Vite + Tailwind CSS + Three.js + GSAP          │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Pages   │  │Components│  │ Services │  │  Context     │  │
│  │ (Routes) │──│ (UI/3D)  │──│ (API)    │──│ (Auth/Theme) │  │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────┘  │
│                      │                                      │
│                      ▼                                      │
│              VITE DEV SERVER                                │
│              (port 5173)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│  Node.js + Express.js + Passport.js                        │
│                                                             │
│  ┌─────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Routes   │──│Controllers │──│ Services │──│Middleware │  │
│  └─────────┘  └────────────┘  └──────────┘  └──────────┘  │
│                      │                                      │
│                      ▼                                      │
│             EXPRESS SERVER                                  │
│             (port 5000)                                     │
└───────────┬──────────────────┬─────────────────────────────┘
            │                  │
            ▼                  ▼
┌───────────────────┐  ┌───────────────────┐
│     MongoDB       │  │    Cloudinary      │
│   (Mongoose ODM)  │  │  (Image Storage)   │
│                   │  │                    │
│  - events         │  │  - event images    │
│  - team           │  │  - team photos     │
│  - homepage       │  │  - homepage media  │
│  - admin_users    │  │                    │
└───────────────────┘  └───────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── PublicLayout
│   │   ├── Navbar
│   │   ├── Routes
│   │   │   ├── HomePage
│   │   │   │   ├── HeroSection (Three.js DGX model + GSAP)
│   │   │   │   ├── TerminalSection (Interactive CLI demo)
│   │   │   │   ├── AboutSection
│   │   │   │   ├── StatsSection (animated counters)
│   │   │   │   ├── FeaturedSection
│   │   │   │   └── Footer
│   │   │   ├── EventsPage
│   │   │   │   ├── EventsFilter
│   │   │   │   └── EventCard[]
│   │   │   └── TeamPage
│   │   │       └── TeamGrid
│   │   │           └── TeamMemberCard[]
│   │   └── Footer
│   │
│   └── AdminLayout (Protected)
│       ├── AdminSidebar
│       ├── AdminRoutes
│       │   ├── DashboardPage
│       │   ├── HomepageCMSPage
│       │   ├── EventsCMSPage
│       │   └── TeamCMSPage
│       └── AdminHeader
```

### Key Frontend Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Bundler | Vite | Fast HMR, native ESM, React 19 support |
| Styling | Tailwind CSS | Rapid prototyping, consistent design tokens |
| Routing | React Router DOM v6+ | Nested layouts, route guards for admin |
| 3D | React Three Fiber + Drei | React-idiomatic Three.js, easy scene management |
| Animation | GSAP + ScrollTrigger | Industry-standard scroll animations, timeline control |
| State | React Context + hooks | Simple auth/theme state, no Redux needed |

### 3D / Motion Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Three.js    │    │ React Three  │    │  Drei        │
│  (Core 3D)   │───▶│ Fiber (R3F)  │───▶│  (Helpers)   │
└──────────────┘    └──────────────┘    └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  GSAP        │    │ ScrollTrigger│    │  Custom      │
│  (Timeline)  │───▶│ (Scroll)     │───▶│  Hooks       │
└──────────────┘    └──────────────┘    └──────────────┘
```

- **Three.js / R3F** — Renders the DGX H100 3D model, particle systems, and background effects
- **GSAP ScrollTrigger** — Drives section entrance animations, parallax effects, and timeline sequences
- **WebGL shaders** — Custom fragment shaders for background particle effects and glow

---

## Backend Architecture

### Request Flow

```
Client Request
      │
      ▼
┌─────────────┐
│   CORS      │ ◀── Validate origin against allowed list
├─────────────┤
│   Auth      │ ◀── Verify JWT token (jsonwebtoken)
│  Middleware  │     (skip for public routes)
├─────────────┤
│   Route     │ ◀── Match URL to route handler
│   Handler   │
├─────────────┤
│  Controller │ ◀── Parse request, validate input
├─────────────┤
│  Service    │ ◀── Business logic, Mongoose queries
├─────────────┤
│  Response   │ ◀── Standardized JSON response
└─────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Routes** | Map URLs to controllers | `router.get('/events', eventsController.getAll)` |
| **Middleware** | Cross-cutting concerns | Auth verification, rate limiting, error handling |
| **Controllers** | Parse request, call services, send response | Extract query params, call `eventsService.list()`, return JSON |
| **Services** | Business logic, database operations | Mongoose queries, data transformation, validation rules |
| **Config** | Environment, client initialization | MongoDB connection, Passport config, CORS config |
| **Utils** | Shared helpers | Response formatters, validators, error classes |

---

## Database Schema (MongoDB / Mongoose)

### Collections & Models

```javascript
// models/Event.js
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  location: {
    type: String,
    maxlength: 200
  },
  image_url: {
    type: String  // Cloudinary URL
  },
  category: {
    type: String,
    enum: ['workshop', 'hackathon', 'talk', 'social'],
    default: 'workshop'
  },
  is_featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  // adds createdAt, updatedAt
});

// models/Team.js
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: 100
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500
  },
  image_url: {
    type: String  // Cloudinary URL
  },
  github_url: String,
  linkedin_url: String,
  twitter_url: String,
  display_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// models/HomepageContent.js
const homepageContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'about', 'stats', 'featured', 'footer']
  },
  title: String,
  subtitle: String,
  body: {
    type: mongoose.Schema.Types.Mixed  // flexible JSON object
  },
  image_url: String
}, {
  timestamps: true
});

// models/AdminUser.js
const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  full_name: String,
  password_hash: String,  // for email/password login (optional)
  provider: {
    type: String,
    enum: ['google', 'github', 'local'],
    default: 'local'
  },
  provider_id: String,  // OAuth provider user ID
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin'
  }
}, {
  timestamps: true
});
```

### Indexes

```javascript
// Performance indexes
EventSchema.index({ date: -1 });
EventSchema.index({ category: 1 });
EventSchema.index({ is_featured: 1 });
TeamSchema.index({ display_order: 1 });
TeamSchema.index({ is_active: 1 });
AdminUserSchema.index({ email: 1 }, { unique: true });
```

### Access Control

With MongoDB, access control is handled at the application level via middleware, not database-level policies:

- **Public routes** (`GET /api/events`, `GET /api/team`) — no auth required, services query MongoDB directly
- **Admin routes** (`POST /api/events`, `PUT /api/team/:id`) — auth middleware verifies JWT, checks `admin_users` collection
- **Ownership checks** — services verify the requesting user has admin role before write operations

---

## Authentication Flow

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│ Passport │────▶│ Google/  │
│  Clicks  │     │ OAuth    │     │ GitHub   │
│  Login   │     │ Strategy │     │ OAuth    │
└─────────┘     └──────────┘     └────┬─────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  Callback    │
                               │  Controller  │
                               │              │
                               │  1. Find or  │
                               │  create user │
                               │  in MongoDB  │
                               │              │
                               │  2. Generate │
                               │  JWT token   │
                               └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  Client      │
                               │  stores JWT  │
                               │  in memory / │
                               │  localStorage│
                               └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  API calls   │
                               │  include JWT │
                               │  in header   │
                               └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  Server      │
                               │  auth        │
                               │  middleware  │
                               │  verifies JWT│
                               │  + checks    │
                               │  admin role  │
                               └──────────────┘
```

### JWT Token Structure

```javascript
// Payload
{
  userId: "mongodb ObjectId",
  email: "user@university.edu",
  role: "admin",
  iat: 1234567890,
  exp: 1234571490  // 1 hour
}
```

### OAuth Setup

1. Create OAuth credentials in Google Cloud Console and GitHub Developer Settings
2. Configure Passport strategies in `server/config/passport.js`
3. Store credentials in server `.env`
4. Client calls `GET /api/auth/google` → redirects to Google
5. Callback at `GET /api/auth/google/callback` → generates JWT → redirects to frontend

---

## API Communication

### Request Format

```
GET /api/events?category=workshop&featured=true
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Events retrieved successfully"
}

// Paginated
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

---

## Image Storage (Cloudinary)

```
Admin Uploads Image
        │
        ▼
┌───────────────────┐
│  Frontend         │
│  multipart/form   │
│  POST /api/upload │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Backend          │
│  multer middleware│
│  validates type   │
│  + size           │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Cloudinary SDK   │
│  upload()         │
│  - resize 1920px  │
│  - convert WebP   │
│  - return URL     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  MongoDB          │
│  stores URL in    │
│  document field   │
└───────────────────┘
```

### Cloudinary Folder Structure

```
nvidia-sc-website/
├── events/
│   ├── event-cover-1.jpg
│   └── event-cover-2.jpg
├── team/
│   ├── member-photo-1.jpg
│   └── member-photo-2.jpg
└── homepage/
    ├── hero-bg.jpg
    └── about-image.jpg
```

---

## Deployment Architecture

```
                    ┌─────────────┐
                    │   Vercel /  │
                    │   Netlify   │
                    │  (Frontend) │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Railway / │
                    │   Render    │
                    │  (Backend)  │
                    └──────┬──────┘
                    │      │
              ┌─────┘      └─────┐
              ▼                  ▼
       ┌─────────────┐  ┌─────────────┐
       │  MongoDB    │  │  Cloudinary  │
       │  Atlas      │  │  (Storage)   │
       └─────────────┘  └─────────────┘
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment instructions.

---

## Environment Architecture

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | `localhost:5173` | `localhost:5000` | Local development |
| Preview | `*.vercel.app` | `*.railway.app` | PR previews |
| Production | `nvidia-sc.dev` | `api.nvidia-sc.dev` | Live site |
