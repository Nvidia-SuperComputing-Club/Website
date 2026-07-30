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
│  │  Pages   │  │Components│  │ Supabase │  │  Context     │  │
│  │ (Routes) │──│ (UI/3D)  │──│ Client   │──│ (Auth/Theme) │  │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────┘  │
│                      │                                      │
│                      ▼                                      │
│              VITE DEV SERVER                                │
│              (port 5173)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST (Supabase JS Client)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       SUPABASE                              │
│  PostgreSQL + Auth + Storage + Auto-generated APIs          │
│                                                             │
│  ┌─────────────┐  ┌────────────┐  ┌───────────────────┐     │
│  │ PostgreSQL  │  │ GoTrue Auth│  │ Cloudinary        │     │
│  │ Database    │  │ (JWTs)     │  │ (Image Storage)   │     │
│  └─────────────┘  └────────────┘  └───────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context - Supabase Auth)
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
│   │   │   ├── TeamPage
│   │   │   │   └── TeamGrid
│   │   │   │       └── TeamMemberCard[]
│   │   │   └── JoinPage (Membership Form)
│   │   └── Footer
│   │
│   └── AdminLayout (Protected by Supabase Auth)
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
| Backend | Supabase | Full BaaS with Postgres, Auth, and Storage |
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

## Backend Architecture (Supabase)

We use Supabase as our complete backend solution. This eliminates the need to host and maintain a separate Node.js server.

### Key Supabase Features Used

1.  **PostgreSQL Database:** Stores events, team members, and membership applications. We interact with this database directly from React using the `@supabase/supabase-js` client library.
2.  **Authentication:** Handles Google, GitHub, and Email/Password logins. It also manages secure sessions (JWTs) in the browser.
3.  **Row Level Security (RLS):** Secures our database. For example, public users can `SELECT` from the `events` table, but only authenticated users with an `admin` role can `INSERT` or `DELETE` events.
4.  **Storage (Cloudinary):** Supabase handles our database and authentication, but we use Cloudinary for storing images (event banners, team photos) to take advantage of its powerful on-the-fly image transformations and optimizations.

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
                    │   Supabase  │
                    │  (Backend)  │
                    └─────────────┘
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment instructions.
