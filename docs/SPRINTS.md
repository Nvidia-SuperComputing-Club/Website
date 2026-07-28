# Sprint Breakdown

Detailed sprint plan with issue templates and acceptance criteria.

---

## Sprint 0 — Setup & Infrastructure

**Duration:** 1 week  
**Goal:** Full development environment ready, all tooling configured.

### Issues

#### 0.1 Design UI in Figma
- [ ] Create Figma project with shared team access
- [ ] Design all pages (Landing, Events, Team, Admin)
- [ ] Create component library (buttons, cards, inputs, modals)
- [ ] Define responsive breakpoints (desktop, tablet, mobile)
- [ ] Export design tokens (colors, spacing, typography)
- [ ] Record prototype walkthrough

#### 0.2 Setup React + Tailwind
- [ ] Initialize Vite + React 19 project in `client/`
- [ ] Install and configure Tailwind CSS
- [ ] Set up ESLint + Prettier
- [ ] Configure path aliases (`@/components`, `@/pages`, etc.)
- [ ] Create `index.html`, `main.jsx`, `App.jsx`
- [ ] Set up React Router DOM with basic routes
- [ ] Create `.env.example` with all required vars
- [ ] Verify `npm run dev` starts on port 5173

#### 0.3 Setup Express Backend
- [ ] Initialize Node.js project in `server/`
- [ ] Install Express, CORS, dotenv, helmet
- [ ] Create `index.js` entry point with middleware
- [ ] Set up route structure (`routes/events.js`, etc.)
- [ ] Create controller/service layer pattern
- [ ] Add error handling middleware
- [ ] Create `.env.example`
- [ ] Verify `node index.js` starts on port 5000

#### 0.4 Configure MongoDB
- [ ] Install MongoDB locally or create MongoDB Atlas cluster
- [ ] Create database: `nvidia-sc-website`
- [ ] Create collections: `events`, `teams`, `homepagecontents`, `adminusers`
- [ ] Install Mongoose in the backend
- [ ] Create Mongoose models (Event, Team, HomepageContent, AdminUser)
- [ ] Set up MongoDB connection with retry logic
- [ ] Seed initial admin user
- [ ] Test connection with a simple query

#### 0.5 Setup OAuth
- [ ] Create Google OAuth 2.0 credentials
- [ ] Create GitHub OAuth App credentials
- [ ] Configure Passport.js strategies (Google + GitHub)
- [ ] Add callback URLs to OAuth provider settings
- [ ] Store credentials in `.env` files
- [ ] Test login flow (even without UI)

#### 0.6 Create REST API Structure
- [ ] Define API endpoints (see `docs/API.md`)
- [ ] Create route files for all endpoints
- [ ] Create controller stubs with proper HTTP methods
- [ ] Create service stubs with TODO comments
- [ ] Add input validation middleware
- [ ] Add auth middleware (JWT verification)
- [ ] Set up CORS for frontend origin
- [ ] Test API with Postman or curl

---

## Sprint 1 — Landing Page

**Duration:** 2 weeks  
**Goal:** Stunning Awwwards-quality landing page.

### Issues

#### 1.1 Navbar
- [ ] Fixed/sticky navbar with glassmorphism effect
- [ ] NVIDIA logo + club name
- [ ] Navigation links: Home, Events, Team
- [ ] Admin login button (visible only when not logged in)
- [ ] Mobile hamburger menu with slide-in animation
- [ ] Active link highlighting
- [ ] GSAP entrance animation on page load

#### 1.2 Hero Section (Three.js + GSAP)
- [ ] Full-viewport hero section with dark gradient background
- [ ] 3D NVIDIA DGX H100 server model (loaded via GLTF)
- [ ] Model auto-rotation with mouse-tracking parallax
- [ ] GSAP text reveal animation (staggered letters)
- [ ] Scroll indicator (animated chevron)
- [ ] CTA button with glow effect
- [ ] Responsive: model scales/positions differently on mobile
- [ ] Performance: lazy-load 3D model, show placeholder first
- [ ] WebGL background particles (custom shader)
- [ ] Intersection Observer to pause rendering when off-screen

#### 1.3 Interactive Terminal (CLI Demo)
- [ ] Terminal window with macOS-style title bar (red/yellow/green dots)
- [ ] Prompt: `nvidia-sc@website:~$ ` with blinking cursor
- [ ] Core commands: help, about, events, team, stats, clear
- [ ] Data commands: events (list), team (list), stats (counters)
- [ ] Easter eggs: sudo, hack, gpu, nvidia-smi, matrix, exit, ls, cd, cat
- [ ] Typing animation for output (30ms per character)
- [ ] Command history (up/down arrow keys)
- [ ] Tab completion for command names
- [ ] CRT scan-line overlay effect (subtle, toggleable)
- [ ] Matrix rain effect (3-second fallback for `matrix` command)
- [ ] Mobile responsive (full-width, 13px font)
- [ ] GSAP scroll-triggered entrance (slide up + fade in)
- [ ] Place below Hero, above About section

#### 1.4 About + Statistics Section
- [ ] About section with club description text
- [ ] GSAP scroll-triggered fade-in animation
- [ ] Statistics counters (animated number counting on scroll)
- [ ] Stats: Members, Events Hosted, Projects, Partners
- [ ] Responsive grid layout
- [ ] NVIDIA green accent elements

#### 1.5 Featured Sections
- [ ] Featured events carousel (horizontal scroll)
- [ ] Featured team members grid (3-4 cards)
- [ ] Upcoming events highlight
- [ ] "Join the Club" CTA section with gradient background
- [ ] GSAP stagger animations for card entrances

#### 1.6 Footer
- [ ] Multi-column footer layout
- [ ] Club info, quick links, social media icons
- [ ] Newsletter signup form (optional)
- [ ] Copyright notice
- [ ] Responsive: stacks on mobile

---

## Sprint 2 — Public Pages

**Duration:** 1.5 weeks  
**Goal:** Events and Team pages fully functional with data from API.

### Issues

#### 2.1 Events Page
- [ ] Page layout with header and filters
- [ ] Filter bar: category, upcoming/all, search
- [ ] Event cards grid with responsive layout
- [ ] Each card: image, title, date, location, category badge
- [ ] Featured events highlighted with special styling
- [ ] Empty state when no events match filter
- [ ] Loading skeleton animation
- [ ] Pagination or infinite scroll
- [ ] GSAP entrance animations for cards
- [ ] Mobile: single column, filter as dropdown

#### 2.2 Team Page
- [ ] Page layout with section header
- [ ] Team grid with member cards
- [ ] Each card: photo, name, role, social links
- [ ] Hover effect: card flip or overlay with bio
- [ ] Filter by role (optional)
- [ ] GSAP stagger animation on scroll
- [ ] Responsive: 4 cols → 2 cols → 1 col
- [ ] Empty state if no members

---

## Sprint 3 — Admin CMS

**Duration:** 2 weeks  
**Goal:** Admins can manage all content through the dashboard.

### Issues

#### 3.1 Admin Login
- [ ] Login page with Google and GitHub OAuth buttons
- [ ] OAuth callback handling
- [ ] Redirect to dashboard on success
- [ ] Redirect to login if not authenticated
- [ ] Admin role check middleware
- [ ] Session persistence (JWT stored in memory/localStorage)

#### 3.2 Admin Layout
- [ ] Sidebar navigation (Dashboard, Homepage, Events, Team)
- [ ] Top bar with user info and logout
- [ ] Responsive: sidebar collapses to hamburger on mobile
- [ ] Active page highlighting

#### 3.3 Dashboard Page
- [ ] Overview stats (total events, members, recent activity)
- [ ] Quick actions (add event, add member)
- [ ] Recent changes list
- [ ] Responsive cards layout

#### 3.4 Homepage CMS
- [ ] List all homepage sections (Hero, About, Stats, Featured)
- [ ] Edit form for each section (title, subtitle, body, image)
- [ ] Rich text editor for body content (or JSON editor)
- [ ] Image upload with preview
- [ ] Save/publish functionality
- [ ] Success/error notifications

#### 3.5 Events CMS
- [ ] Table view of all events (sortable columns)
- [ ] Add new event modal/form
- [ ] Edit event inline or in modal
- [ ] Delete event with confirmation
- [ ] Image upload for event cover
- [ ] Toggle featured status
- [ ] Search and filter in table

#### 3.6 Team CMS
- [ ] Grid/table view of all team members
- [ ] Add new member form
- [ ] Edit member profile
- [ ] Remove member (soft delete)
- [ ] Upload profile photo
- [ ] Reorder members (drag-and-drop or manual order)
- [ ] Toggle active/inactive status

---

## Sprint 4 — Final

**Duration:** 1.5 weeks  
**Goal:** Integration, polish, and deployment.

### Issues

#### 4.1 Frontend ↔ Backend Integration
- [ ] Connect all pages to real API endpoints
- [ ] Replace mock data with API calls
- [ ] Implement loading states and error handling
- [ ] Test all CRUD operations end-to-end
- [ ] Verify image uploads work in CMS
- [ ] Test auth flow: login → admin → CRUD → logout

#### 4.2 Responsive Polish
- [ ] Test all pages at breakpoints: 1440px, 1024px, 768px, 375px
- [ ] Fix any layout issues on tablet
- [ ] Fix any layout issues on mobile
- [ ] Test touch interactions (swipe, tap)
- [ ] Verify 3D model performance on mobile
- [ ] Test navigation on mobile

#### 4.3 Performance Optimization
- [ ] Lazy-load 3D model and heavy assets
- [ ] Optimize images (WebP, proper sizing)
- [ ] Implement route-based code splitting
- [ ] Audit bundle size
- [ ] Lighthouse score: Performance > 90, A11y > 90
- [ ] Test on slow 3G connection

#### 4.4 Accessibility
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader testing
- [ ] Proper ARIA labels
- [ ] Color contrast compliance
- [ ] Focus indicators
- [ ] Alt text for all images

#### 4.5 Testing
- [ ] Unit tests for utility functions
- [ ] API endpoint tests
- [ ] Component rendering tests
- [ ] Manual cross-browser testing (Chrome, Firefox, Safari, Edge)

#### 4.6 Deployment
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure custom domains
- [ ] Set up environment variables in production
- [ ] Test production deployment
- [ ] Set up monitoring/alerts

#### 4.7 Documentation
- [ ] Update README with final instructions
- [ ] Document deployment process
- [ ] Create onboarding guide for new contributors
- [ ] Record demo video of the site

---

## Issue Labels

| Label | Color | Description |
|-------|-------|-------------|
| `sprint-0` | Gray | Setup & infrastructure |
| `sprint-1` | Blue | Landing page |
| `sprint-2` | Green | Public pages |
| `sprint-3` | Orange | Admin CMS |
| `sprint-4` | Red | Final polish & deploy |
| `bug` | Red | Something is broken |
| `enhancement` | Blue | New feature or improvement |
| `documentation` | Gray | Docs only |
| `good first issue` | Green | Beginner-friendly |
| `help wanted` | Yellow | Needs contributor |
| `priority: high` | Red | Must be done this sprint |
| `priority: medium` | Yellow | Should be done this sprint |
| `priority: low` | Gray | Nice to have |
