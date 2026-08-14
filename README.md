# NVIDIA Super Computing Club — Official Website

> A visually immersive, award-worthy website for the NVIDIA Super Computing Club, featuring 3D experiences, smooth animations, and a full admin CMS.

---

## Overview

This is the official website for the NVIDIA Super Computing Club. It serves as the public face of the club — showcasing events, team members, and the club's mission — while providing administrators with a powerful CMS to manage content in real time.

The landing page is designed to be an **Awwwards-caliber** experience with a 3D NVIDIA DGX H100 server model, WebGL particle effects, GSAP scroll-driven animations, and a responsive layout that adapts across desktop, tablet, and mobile.

---

## Tech Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| **Frontend**     | React 19, Vite, Tailwind CSS, React Router DOM    |
| **3D / Motion**  | Three.js, React Three Fiber, GSAP, WebGL          |
| **Backend & DB** | Express.js + MongoDB (Mongoose) / Supabase        |
| **Auth**         | Supabase Auth (Google, GitHub, Email/Password)    |
| **Storage**      | Cloudinary (images/media)                          |
| **Testing**      | Vitest, React Testing Library, Supertest          |

---

## Project Structure

```
website/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets (favicon, models, textures)
│   ├── src/
│   │   ├── assets/                  # Images, fonts, 3D model files
│   │   ├── components/
│   │   │   ├── 3d/                  # Three.js / R3F components (DGX model, particles)
│   │   │   │   └── Terminal/        # Interactive CLI terminal component
│   │   │   ├── sections/            # Landing page sections (Hero, About, Stats, etc.)
│   │   │   ├── ui/                  # Reusable UI primitives (Button, Card, Modal)
│   │   │   ├── layout/              # Navbar, Footer, PageWrapper
│   │   │   └── admin/               # Admin dashboard components
│   │   ├── layouts/                 # Route layouts (PublicLayout, AdminLayout)
│   │   ├── pages/                   # Route-level page components
│   │   │   └── admin/               # Admin pages (Dashboard, EventsCMS, TeamCMS)
│   │   ├── routes/                  # React Router route definitions
│   │   ├── services/                # API client functions (api.js)
│   │   ├── test/                    # Test files and setup
│   │   ├── assets/                  # Images, fonts, 3D model files
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── .env.example
│   ├── index.html
│   └── pnpm-workspace.yaml
│
├── server/                          # Backend (Express + MongoDB)
│   ├── config/                      # Database connection (db.js)
│   ├── middleware/                  # Auth middleware
│   ├── models/                      # Mongoose models (Event, Team, HomepageContent, AdminUser)
│   ├── routes/                      # API routes (events, team, homepage, auth, upload)
│   ├── seed.js                      # Database seed script
│   ├── index.js                     # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── docs/                            # Project documentation
│   ├── ARCHITECTURE.md              # System architecture & data flow
│   ├── API.md                       # REST API reference
│   ├── ADMIN-CMS.md                 # Admin CMS documentation
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── SPRINTS.md                   # Sprint breakdown & issue tracking
│   └── UI-DESIGN.md                 # Design system & 3D/motion specs
│
├── README.md                        # This file
├── .gitignore
└── LICENSE
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (recommended: v20 LTS)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Supabase** account (for auth and additional features)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Nvidia-SuperComputing-Club/Website.git
cd Website
```

### 2. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev             # Starts on http://localhost:5173
```

### 3. Setup Backend

```bash
cd server
npm install
cp .env.example .env     # Configure MongoDB URI and JWT secret
npm run dev              # Starts on http://localhost:5000
```

### 4. Seed Database

```bash
cd server
node seed.js
```

### 5. Environment Variables

#### Client `.env`

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
```

#### Server `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nvidia-sc-website
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=1h
```

---

## Scripts

### Frontend (`client/`)

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start Vite dev server        |
| `npm run build`     | Production build             |
| `npm run preview`   | Preview production build     |
| `npm run lint`      | Run ESLint                   |
| `npm run format`    | Format with Prettier         |
| `npm run test`      | Run tests with Vitest        |

### Backend (`server/`)

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start Express server (nodemon)|
| `npm start`         | Start Express server         |
| `node seed.js`      | Seed database with initial data |

---

## Development Workflow

```
Figma → Issue → Assign Contributor → Feature Branch → Development → Pull Request → Review → Merge
```

1. **Design** — UI/UX designed in Figma
2. **Issue** — Task created as a GitHub Issue with sprint label
3. **Assign** — Contributor comments to get assigned
4. **Branch** — Create feature branch: `feat/landing-hero` or `fix/events-card`
5. **Develop** — Build the feature with tests
6. **PR** — Open a Pull Request targeting `main`
7. **Review** — At least one approval required
8. **Merge** — Squash merge after CI passes

---

## Sprints

| Sprint  | Focus                         | Key Deliverables                                 |
| ------- | ----------------------------- | ------------------------------------------------ |
| Sprint 0| Setup                         | Figma, React+Tailwind, Supabase, OAuth           |
| Sprint 1| Landing Page                  | Navbar, Hero, About+Stats, Featured, Footer      |
| Sprint 2| Pages                         | Events Page, Team Page                           |
| Sprint 3| Admin CMS                     | Admin Login, Homepage/Events/Team CMS            |
| Sprint 4| Final                         | Integration, Testing, Deployment                 |

See [`docs/SPRINTS.md`](docs/SPRINTS.md) for the full issue breakdown.

---

## Design Goals

- **Awwwards-quality** visual experience
- 3D NVIDIA DGX H100 server model on the landing page (Three.js / React Three Fiber)
- GSAP scroll-driven animations and transitions
- WebGL particle effects for background ambiance
- Responsive across **desktop**, **tablet**, and **mobile**
- Dark theme with NVIDIA green (`#76B900`) accent

See [`docs/UI-DESIGN.md`](docs/UI-DESIGN.md) for the full design specification.

---

## Documentation

| Document                  | Description                                |
| ------------------------- | ------------------------------------------ |
| [Architecture](docs/ARCHITECTURE.md)     | System architecture, data flow, tech decisions |
| [API Reference](docs/API.md)             | REST API endpoints, request/response formats  |
| [Admin CMS](docs/ADMIN-CMS.md)           | Admin dashboard features and workflows        |
| [Contributing](docs/CONTRIBUTING.md)     | How to contribute, branch naming, PR process  |
| [Deployment](docs/DEPLOYMENT.md)         | Production deployment guide                   |
| [Sprints](docs/SPRINTS.md)               | Sprint breakdown with issue templates         |
| [UI Design](docs/UI-DESIGN.md)           | Design system, 3D specs, animation patterns   |

---

## License

This project is for the NVIDIA Super Computing Club. All rights reserved.

---

**Built with passion by the NVIDIA Super Computing Club team.**
